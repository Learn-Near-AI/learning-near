import { writeFile, mkdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { platform } from 'os'

const execAsync = promisify(exec)

// Check if near-sdk-js is available (it doesn't support Windows)
function isNearSdkJsAvailable() {
  try {
    // Check if near-sdk-js module exists
    const nearSdkPath = join(process.cwd(), 'node_modules', 'near-sdk-js')
    return existsSync(nearSdkPath)
  } catch (error) {
    return false
  }
}

/**
 * Builds a NEAR contract from JavaScript/TypeScript source code
 * Uses near-sdk-js to compile to real WASM
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

  const tempDir = join(process.cwd(), 'temp-builds', randomBytes(8).toString('hex'))
  const startTime = Date.now()

  try {
    await mkdir(tempDir, { recursive: true })

    // Determine file extension based on language
    const ext = language === 'TypeScript' ? '.ts' : '.js'
    const srcDir = join(tempDir, 'src')
    await mkdir(srcDir, { recursive: true })
    
    const contractFile = join(srcDir, `contract${ext}`)

    // Write source code to temp file
    await writeFile(contractFile, sourceCode, 'utf-8')

    // Create package.json for near-sdk-js
    const packageJson = {
      name: "temp-contract",
      version: "1.0.0",
      type: "module",
      main: `src/contract${ext}`,
      scripts: {
        build: "near-sdk-js build src/contract" + ext + " build/contract.wasm"
      }
    }
    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    )

    // Create tsconfig.json if TypeScript
    if (language === 'TypeScript') {
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
        join(tempDir, 'tsconfig.json'),
        JSON.stringify(tsconfig, null, 2),
        'utf-8'
      )
    }

    // No babel config needed - near-sdk-js handles it internally

    console.log(`Building ${language} contract with near-sdk-js...`)
    
    // Copy near-sdk-js from parent node_modules (much faster than installing)
    const parentNodeModules = join(process.cwd(), 'node_modules')
    const tempNodeModules = join(tempDir, 'node_modules')
    
    if (existsSync(parentNodeModules) && existsSync(join(parentNodeModules, 'near-sdk-js'))) {
      console.log('⚡ Using cached near-sdk-js (fast path)...')
      await mkdir(tempNodeModules, { recursive: true })
      
      // Copy near-sdk-js directory
      const { cp } = await import('fs/promises')
      const copyStartTime = Date.now()
      
      await cp(
        join(parentNodeModules, 'near-sdk-js'),
        join(tempNodeModules, 'near-sdk-js'),
        { recursive: true }
      )
      
      // Copy .bin directory for CLI commands
      if (existsSync(join(parentNodeModules, '.bin'))) {
        await cp(
          join(parentNodeModules, '.bin'),
          join(tempNodeModules, '.bin'),
          { recursive: true }
        )
      }
      
      const copyTime = ((Date.now() - copyStartTime) / 1000).toFixed(2)
      console.log(`✓ Cached copy completed in ${copyTime}s`)
    } else {
      // Fallback: install if not available (slow path)
      console.log('⚠️  Cache not found, installing near-sdk-js (this will be slow)...')
      await execAsync('npm install near-sdk-js@2.0.0 --legacy-peer-deps', {
        cwd: tempDir,
        maxBuffer: 10 * 1024 * 1024,
      })
    }

    // Build using near-sdk-js CLI
    console.log(`Running near-sdk-js build...`)
    
    const buildResult = await execAsync(`npx near-sdk-js build src/contract${ext} build/contract.wasm`, {
      cwd: tempDir,
      maxBuffer: 10 * 1024 * 1024,
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    })

    if (buildResult.stdout) {
      console.log('Build stdout:', buildResult.stdout)
    }
    if (buildResult.stderr) {
      console.log('Build stderr:', buildResult.stderr)
    }

    const compilationTime = (Date.now() - startTime) / 1000
    console.log(`✓ ${language} compilation completed in ${compilationTime.toFixed(2)}s`)

    // Read the compiled WASM file
    // near-sdk-js outputs to build/contract.wasm
    const wasmPath = join(tempDir, 'build', 'contract.wasm')
    
    if (!existsSync(wasmPath)) {
      throw new Error(`WASM file not found at ${wasmPath}. Build may have failed.`)
    }
    
    const wasmBuffer = await readFile(wasmPath)
    console.log(`✓ WASM size: ${wasmBuffer.length} bytes`)

    // Cleanup
    await rm(tempDir, { recursive: true, force: true })

    return wasmBuffer
  } catch (error) {
    // Cleanup on error
    await rm(tempDir, { recursive: true, force: true }).catch(() => {})
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Unknown error'
    
    // Extract useful information from stderr
    if (error.stderr) {
      const stderr = error.stderr.toString()
      // Look for common error patterns
      if (stderr.includes('SyntaxError')) {
        const syntaxMatch = stderr.match(/SyntaxError: (.+?)(\n|$)/)
        if (syntaxMatch) {
          errorMessage = `Syntax Error: ${syntaxMatch[1]}`
        }
      } else if (stderr.includes('Error:')) {
        const errorMatch = stderr.match(/Error: (.+?)(\n|$)/)
        if (errorMatch) {
          errorMessage = errorMatch[1]
        }
      }
      
      // Include full stderr for debugging if not too long
      if (stderr.length < 1000) {
        errorMessage += `\n${stderr}`
      }
    }
    
    console.error(`✗ ${language} compilation failed:`, errorMessage)
    throw new Error(`${language} compilation failed: ${errorMessage}`)
  }
}
