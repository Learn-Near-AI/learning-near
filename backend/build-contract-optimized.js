import { writeFile, mkdir, readFile, rm, cp, access } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { platform } from 'os'

const execAsync = promisify(exec)

// Configuration for optimization
const TEMPLATE_DIR = join(process.cwd(), 'contract-template')
const BUILD_POOL_SIZE = 5 // Number of persistent build directories
const BUILD_POOL_DIR = join(process.cwd(), 'build-pool')

// Build pool management - simple round-robin with lock files
let currentBuildIndex = 0
const buildLocks = new Map()

// Check if near-sdk-js is available (it doesn't support Windows)
function isNearSdkJsAvailable() {
  try {
    // Check if near-sdk-js module exists in template or main node_modules
    const nearSdkPath = join(process.cwd(), 'node_modules', 'near-sdk-js')
    const templateSdkPath = join(TEMPLATE_DIR, 'node_modules', 'near-sdk-js')
    return existsSync(nearSdkPath) || existsSync(templateSdkPath)
  } catch (error) {
    return false
  }
}

/**
 * Initialize the template directory with near-sdk-js pre-installed
 * This runs once at startup to create a reusable template
 */
export async function initializeTemplate() {
  if (existsSync(TEMPLATE_DIR)) {
    console.log('✓ Template directory already exists')
    return
  }

  console.log('📦 Initializing contract template directory...')
  const startTime = Date.now()

  try {
    await mkdir(TEMPLATE_DIR, { recursive: true })
    await mkdir(join(TEMPLATE_DIR, 'src'), { recursive: true })
    await mkdir(join(TEMPLATE_DIR, 'build'), { recursive: true })

    // Create package.json
    const packageJson = {
      name: "near-contract-template",
      version: "1.0.0",
      type: "module",
      scripts: {
        build: "near-sdk-js build src/contract.js build/contract.wasm"
      }
    }
    await writeFile(
      join(TEMPLATE_DIR, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    )

    // Create default tsconfig.json
    const tsconfig = {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        lib: ["ES2020"],
        moduleResolution: "node",
        esModuleInterop: true,
        skipLibCheck: true,
        resolveJsonModule: true,
        strict: false,
        outDir: "./build",
        rootDir: "./src",
        allowSyntheticDefaultImports: true
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "build"]
    }
    await writeFile(
      join(TEMPLATE_DIR, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
      'utf-8'
    )

    // Create a dummy contract file
    const dummyContract = `import { NearBindgen, near, call, view } from 'near-sdk-js';

@NearBindgen({})
class Template {
  @view({}) 
  dummy() { 
    return "template"; 
  }
}`
    await writeFile(join(TEMPLATE_DIR, 'src', 'contract.js'), dummyContract, 'utf-8')

    // Install near-sdk-js ONCE
    console.log('📦 Installing near-sdk-js in template (this happens once)...')
    await execAsync('npm install near-sdk-js@2.0.0 --legacy-peer-deps --no-audit --no-fund --loglevel=error', {
      cwd: TEMPLATE_DIR,
      maxBuffer: 10 * 1024 * 1024,
      timeout: 180000
    })

    const initTime = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`✓ Template initialized in ${initTime}s`)
    console.log(`✓ Template location: ${TEMPLATE_DIR}`)
  } catch (error) {
    console.error('Failed to initialize template:', error.message)
    // Clean up on failure
    await rm(TEMPLATE_DIR, { recursive: true, force: true }).catch(() => {})
    throw new Error(`Template initialization failed: ${error.message}`)
  }
}

/**
 * Initialize the build pool directories
 */
async function initializeBuildPool() {
  await mkdir(BUILD_POOL_DIR, { recursive: true })
  
  for (let i = 0; i < BUILD_POOL_SIZE; i++) {
    const buildDir = join(BUILD_POOL_DIR, `build-${i}`)
    if (!existsSync(buildDir)) {
      await mkdir(buildDir, { recursive: true })
    }
  }
}

/**
 * Get an available build directory from the pool
 * Uses simple round-robin selection with lock checking
 */
async function acquireBuildDirectory() {
  await initializeBuildPool()

  // Try to find an unlocked directory
  for (let attempts = 0; attempts < BUILD_POOL_SIZE * 2; attempts++) {
    const index = currentBuildIndex % BUILD_POOL_SIZE
    currentBuildIndex++
    
    const buildDir = join(BUILD_POOL_DIR, `build-${index}`)
    const lockFile = join(buildDir, '.lock')
    
    // Check if locked
    if (buildLocks.get(buildDir) || existsSync(lockFile)) {
      continue
    }
    
    // Acquire lock
    buildLocks.set(buildDir, true)
    try {
      await writeFile(lockFile, Date.now().toString(), 'utf-8')
    } catch (e) {
      buildLocks.delete(buildDir)
      continue
    }
    
    return { buildDir, index }
  }
  
  // If all are locked, create a temporary directory
  const tempIndex = Date.now()
  const buildDir = join(BUILD_POOL_DIR, `build-temp-${tempIndex}`)
  await mkdir(buildDir, { recursive: true })
  buildLocks.set(buildDir, true)
  
  return { buildDir, index: tempIndex, isTemp: true }
}

/**
 * Release a build directory back to the pool
 */
async function releaseBuildDirectory(buildDir, isTemp) {
  const lockFile = join(buildDir, '.lock')
  
  // Clean up build artifacts but keep node_modules
  try {
    await rm(join(buildDir, 'build'), { recursive: true, force: true })
    await rm(join(buildDir, 'src'), { recursive: true, force: true })
    await rm(lockFile, { force: true })
  } catch (e) {
    // Ignore cleanup errors
  }
  
  // Remove from locks
  buildLocks.delete(buildDir)
  
  // If it's a temporary directory, delete it completely
  if (isTemp) {
    await rm(buildDir, { recursive: true, force: true }).catch(() => {})
  }
}

/**
 * Copy template to build directory (much faster than npm install)
 */
async function copyTemplateToDir(buildDir) {
  const nodeModulesInBuild = join(buildDir, 'node_modules')
  
  // Check if node_modules already exists in the build directory
  if (existsSync(nodeModulesInBuild)) {
    console.log('✓ Using cached node_modules')
    // Just copy the config files
    await cp(join(TEMPLATE_DIR, 'package.json'), join(buildDir, 'package.json'))
    await cp(join(TEMPLATE_DIR, 'tsconfig.json'), join(buildDir, 'tsconfig.json'))
  } else {
    // Copy node_modules from template (first time for this build dir)
    console.log('📦 Copying template dependencies...')
    const copyStartTime = Date.now()
    
    await cp(join(TEMPLATE_DIR, 'node_modules'), nodeModulesInBuild, { 
      recursive: true,
      force: true
    })
    await cp(join(TEMPLATE_DIR, 'package.json'), join(buildDir, 'package.json'))
    await cp(join(TEMPLATE_DIR, 'tsconfig.json'), join(buildDir, 'tsconfig.json'))
    
    const copyTime = ((Date.now() - copyStartTime) / 1000).toFixed(2)
    console.log(`✓ Dependencies copied in ${copyTime}s`)
  }
}

/**
 * Builds a NEAR contract from JavaScript/TypeScript source code
 * OPTIMIZED VERSION: Uses template directory and build pool
 * 
 * @param {string} sourceCode - The contract source code
 * @param {string} language - 'JavaScript' or 'TypeScript'
 * @returns {Promise<Buffer>} The compiled .wasm file as a Buffer
 */
export async function buildContract(sourceCode, language) {
  // Check if near-sdk-js is available
  if (!isNearSdkJsAvailable()) {
    const currentPlatform = platform()
    if (currentPlatform === 'win32') {
      throw new Error(
        'JavaScript/TypeScript compilation is not supported on Windows. ' +
        'near-sdk-js requires a Linux/Mac environment. ' +
        'This feature will work when deployed to fly.io (Linux). ' +
        'For local development on Windows, please use Rust for smart contracts.'
      )
    } else {
      throw new Error(
        'near-sdk-js is not installed. Please run: npm install near-sdk-js'
      )
    }
  }

  // Ensure template is initialized
  if (!existsSync(TEMPLATE_DIR)) {
    await initializeTemplate()
  }

  const startTime = Date.now()
  let buildDir, buildIndex, isTemp

  try {
    // Acquire a build directory from the pool
    const buildInfo = await acquireBuildDirectory()
    buildDir = buildInfo.buildDir
    buildIndex = buildInfo.index
    isTemp = buildInfo.isTemp

    console.log(`Building ${language} contract with near-sdk-js (optimized)...`)
    console.log(`Using build directory: build-${buildIndex}`)

    // Copy template to build directory (or reuse existing node_modules)
    await copyTemplateToDir(buildDir)

    // Determine file extension based on language
    const ext = language === 'TypeScript' ? '.ts' : '.js'
    const srcDir = join(buildDir, 'src')
    await mkdir(srcDir, { recursive: true })
    
    const contractFile = join(srcDir, `contract${ext}`)

    // Write source code to file
    await writeFile(contractFile, sourceCode, 'utf-8')

    // Update package.json build script
    const packageJsonPath = join(buildDir, 'package.json')
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
    packageJson.scripts.build = `near-sdk-js build src/contract${ext} build/contract.wasm`
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8')

    // Create build directory
    await mkdir(join(buildDir, 'build'), { recursive: true })

    // Build using near-sdk-js CLI (no npm install needed!)
    console.log(`Running near-sdk-js build...`)
    const buildStartTime = Date.now()
    
    const buildResult = await execAsync(`npx near-sdk-js build src/contract${ext} build/contract.wasm`, {
      cwd: buildDir,
      maxBuffer: 50 * 1024 * 1024,
      timeout: 240000,
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    })

    const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(2)
    console.log(`✓ Build completed in ${buildTime}s`)

    if (buildResult.stdout && buildResult.stdout.length < 500) {
      console.log('Build output:', buildResult.stdout)
    }

    const compilationTime = (Date.now() - startTime) / 1000
    console.log(`✓ ${language} compilation completed in ${compilationTime.toFixed(2)}s`)

    // Read the compiled WASM file
    const wasmPath = join(buildDir, 'build', 'contract.wasm')
    
    if (!existsSync(wasmPath)) {
      throw new Error(`WASM file not found at ${wasmPath}. Build may have failed.`)
    }
    
    const wasmBuffer = await readFile(wasmPath)
    console.log(`✓ WASM size: ${wasmBuffer.length} bytes`)

    // Release build directory back to pool (cleanup but keep node_modules)
    await releaseBuildDirectory(buildDir, isTemp)

    return wasmBuffer
  } catch (error) {
    // Log full error for debugging
    console.error(`✗ ${language} compilation failed with error:`, {
      message: error.message,
      stdout: error.stdout ? error.stdout.substring(0, 500) : 'none',
      stderr: error.stderr ? error.stderr.substring(0, 500) : 'none',
      code: error.code
    })
    
    // Release build directory
    if (buildDir) {
      await releaseBuildDirectory(buildDir, isTemp).catch(() => {})
    }
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Unknown error'
    
    // Extract useful information from stderr and stdout
    const stderr = error.stderr ? error.stderr.toString() : ''
    const stdout = error.stdout ? error.stdout.toString() : ''
    
    // Look for common error patterns
    if (stderr.includes('SyntaxError') || stdout.includes('SyntaxError')) {
      const syntaxMatch = (stderr + stdout).match(/SyntaxError: (.+?)(\n|$)/)
      if (syntaxMatch) {
        errorMessage = `Syntax Error: ${syntaxMatch[1]}`
      }
    } else if (stderr.includes('Error:') || stdout.includes('Error:')) {
      const errorMatch = (stderr + stdout).match(/Error: (.+?)(\n|$)/)
      if (errorMatch) {
        errorMessage = errorMatch[1]
      }
    }
    
    // Include full stderr and stdout for debugging if not too long
    if (stderr.length > 0 && stderr.length < 500) {
      errorMessage += `\nSTDERR: ${stderr}`
    }
    if (stdout.length > 0 && stdout.length < 500) {
      errorMessage += `\nSTDOUT: ${stdout}`
    }
    
    throw new Error(`${language} compilation failed: ${errorMessage}`)
  }
}
