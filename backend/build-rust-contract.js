import { writeFile, mkdir, readFile, rm, readdir, copyFile } from 'fs/promises'
import { join } from 'path'
import { randomBytes, createHash } from 'crypto'
import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'

const execAsync = promisify(exec)

/**
 * Recursively copy directory
 */
async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const dstPath = join(dst, entry.name)
    
    // Skip target and .git directories
    if (entry.name === 'target' || entry.name === '.git') {
      continue
    }
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, dstPath)
    } else {
      await copyFile(srcPath, dstPath)
    }
  }
}

/**
 * Get shared target directory path for all builds
 */
function getSharedTargetDir() {
  return join(process.cwd(), 'shared-target')
}

/**
 * Initialize base project template if it doesn't exist
 */
async function ensureBaseProject(baseProjectPath) {
  if (!existsSync(baseProjectPath)) {
    console.log('Creating base project template...')
    
    // Create base project structure
    await mkdir(join(baseProjectPath, 'src'), { recursive: true })
    
    // Create Cargo.toml
    const cargoToml = `[package]
name = "contract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
near-sdk = "5"
borsh = "1"

[profile.release]
opt-level = "z"
lto = "thin"
codegen-units = 1
panic = "abort"
`
    await writeFile(join(baseProjectPath, 'Cargo.toml'), cargoToml, 'utf-8')
    
    // Create default lib.rs with new syntax
    const defaultLibRs = `use near_sdk::near;
use near_sdk::PanicOnDefault;

#[derive(PanicOnDefault)]
#[near(contract_state)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }
    
    pub fn hello_world(&self) -> String {
        "Hello, NEAR!".to_string()
    }
}
`
    await writeFile(join(baseProjectPath, 'src', 'lib.rs'), defaultLibRs, 'utf-8')
    
    // Build base project to cache dependencies using shared target
    console.log('Building base project to cache dependencies...')
    const sharedTargetDir = getSharedTargetDir()
    try {
      await execAsync('cargo build --target wasm32-unknown-unknown --release', {
        cwd: baseProjectPath,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        env: {
          ...process.env,
          CARGO_TARGET_DIR: sharedTargetDir,
          RUSTFLAGS: '-C link-arg=-s' // Strip symbols to reduce size
        }
      })
      console.log('Base project built successfully')
    } catch (error) {
      console.warn('Base project build failed (dependencies will be downloaded on first compile):', error.message)
    }
  }
}

/**
 * Converts old near_bindgen syntax to new near syntax for near-sdk 5
 */
function convertToNewSyntax(sourceCode) {
  // Check if already using new syntax
  if (sourceCode.includes('#[near(contract_state)]') || 
      (sourceCode.includes('use near_sdk::near;') && !sourceCode.includes('near_bindgen'))) {
    return sourceCode
  }
  
  let converted = sourceCode
  
  // Replace near_bindgen imports with near (handle with or without semicolon)
  converted = converted.replace(/use near_sdk::near_bindgen;?/g, 'use near_sdk::near;')
  
  // Handle use near_sdk::{near_bindgen, ...}
  converted = converted.replace(/use near_sdk::\{near_bindgen([^}]*)\};?/g, (match, rest) => {
    // Remove near_bindgen from the list and add near
    const items = rest.split(',').map(s => s.trim()).filter(s => s && s !== 'near_bindgen')
    if (items.length > 0) {
      return `use near_sdk::{near, ${items.join(', ')}};`
    }
    return 'use near_sdk::near;'
  })
  
  // Add PanicOnDefault import if not present
  if (!converted.includes('use near_sdk::PanicOnDefault') && !converted.includes('PanicOnDefault')) {
    // Find the last use statement and add after it
    const useStatements = converted.match(/use near_sdk::[^;]+;/g)
    if (useStatements && useStatements.length > 0) {
      const lastUse = useStatements[useStatements.length - 1]
      converted = converted.replace(lastUse, `${lastUse}\nuse near_sdk::PanicOnDefault;`)
    } else {
      converted = 'use near_sdk::PanicOnDefault;\n' + converted
    }
  }
  
  // Handle struct with #[near_bindgen] - convert to #[near(contract_state)]
  // Pattern: #[near_bindgen] followed by #[derive(...)] and pub struct
  converted = converted.replace(/#\[near_bindgen\]\s*\n?\s*#\[derive\(([^)]+)\)\]\s*\n?\s*pub struct/g, (match, derives) => {
    // Remove Default, BorshSerialize, and BorshDeserialize from derives
    // #[near(contract_state)] automatically provides BorshSerialize/BorshDeserialize
    const deriveList = derives.split(',').map(s => s.trim()).filter(s => 
      s && 
      s !== 'Default' && 
      s !== 'BorshSerialize' && 
      s !== 'BorshDeserialize'
    )
    // Add PanicOnDefault if not present
    if (!deriveList.includes('PanicOnDefault')) {
      deriveList.push('PanicOnDefault')
    }
    // Order: derive first, then #[near(contract_state)]
    return `#[derive(${deriveList.join(', ')})]\n#[near(contract_state)]\npub struct`
  })
  
  // Handle struct with just #[near_bindgen] (no derive)
  converted = converted.replace(/#\[near_bindgen\]\s*\n?\s*pub struct/g, 
    '#[derive(PanicOnDefault)]\n#[near(contract_state)]\npub struct')
  
  // Remove impl Default blocks (PanicOnDefault replaces Default)
  // Use a function to properly match balanced braces
  function removeImplDefault(code) {
    const pattern = /impl\s+Default\s+for\s+Contract\s*\{/g
    let match
    let result = code
    let offset = 0
    
    while ((match = pattern.exec(code)) !== null) {
      const start = match.index
      let braceCount = 1
      let i = match.index + match[0].length
      
      while (i < code.length && braceCount > 0) {
        if (code[i] === '{') braceCount++
        if (code[i] === '}') braceCount--
        i++
      }
      
      if (braceCount === 0) {
        // Remove the block including any trailing whitespace/newlines
        const end = i
        const before = result.substring(0, start - offset)
        const after = result.substring(end - offset)
        offset += (end - start)
        result = before + after
        // Reset regex lastIndex since we modified the string
        pattern.lastIndex = 0
        break // Remove one at a time
      }
    }
    
    return result
  }
  
  converted = removeImplDefault(converted)
  
  // Remove Default from any existing derive that has it (if not already handled)
  converted = converted.replace(/#\[derive\(([^)]*Default[^)]*)\)\]/g, (match, derives) => {
    const deriveList = derives.split(',').map(s => s.trim()).filter(s => s && s !== 'Default')
    if (!deriveList.includes('PanicOnDefault')) {
      deriveList.push('PanicOnDefault')
    }
    return `#[derive(${deriveList.join(', ')})]`
  })
  
  // Remove BorshSerialize and BorshDeserialize from derives when #[near(contract_state)] is present
  converted = converted.replace(/#\[derive\(([^)]+)\)\]\s*\n\s*#\[near\(contract_state\)\]/g, (match, derives) => {
    const deriveList = derives.split(',').map(s => s.trim()).filter(s => 
      s && 
      s !== 'BorshSerialize' && 
      s !== 'BorshDeserialize'
    )
    if (!deriveList.includes('PanicOnDefault')) {
      deriveList.push('PanicOnDefault')
    }
    return `#[derive(${deriveList.join(', ')})]\n#[near(contract_state)]`
  })
  
  // Clean up any double semicolons that might have been created
  converted = converted.replace(/;;+/g, ';')
  
  // Remove unused borsh imports if they're not needed
  // Check if BorshSerialize or BorshDeserialize are actually used in the code
  if (!converted.match(/BorshSerialize|BorshDeserialize/)) {
    converted = converted.replace(/use\s+near_sdk::borsh::\{[^}]*\};?\s*\n?/g, '')
  }
  
  // Ensure no duplicate PanicOnDefault
  converted = converted.replace(/#\[derive\(([^)]*PanicOnDefault[^)]*PanicOnDefault[^)]*)\)\]/g, (match) => {
    const derives = match.match(/#\[derive\(([^)]+)\)\]/)[1]
    const deriveList = [...new Set(derives.split(',').map(s => s.trim()))]
    return `#[derive(${deriveList.join(', ')})]`
  })
  
  // Replace #[near_bindgen] on impl blocks with #[near]
  converted = converted.replace(/#\[near_bindgen\]\s*\n?\s*impl/g, '#[near]\nimpl')
  
  // Remove impl Default blocks if they exist (PanicOnDefault replaces Default)
  // But keep them for now as they might be needed for initialization
  // converted = converted.replace(/impl Default for Contract[^}]*\{[^}]*\}/gs, '')
  
  return converted
}

/**
 * Builds a NEAR contract from Rust source code
 * 
 * @param {string} sourceCode - The Rust contract source code
 * @param {string} projectId - Optional project ID for persistent builds
 * @returns {Promise<Object>} Compilation result with stdout, stderr, wasm, and abi
 */
export async function buildRustContract(sourceCode, projectId = null) {
  const baseProjectPath = join(process.cwd(), 'base-project')
  const sharedTargetDir = getSharedTargetDir()
  
  // Convert old syntax to new syntax if needed
  const convertedCode = convertToNewSyntax(sourceCode)
  
  // Generate project directory based on code hash for caching
  const codeHash = createHash('sha256').update(convertedCode).digest('hex').substring(0, 16)
  const projectDir = projectId 
    ? join(process.cwd(), 'persistent-builds', projectId)
    : join(process.cwd(), 'persistent-builds', codeHash)
  
  const startTime = Date.now()

  try {
    // Ensure base project exists
    await ensureBaseProject(baseProjectPath)
    
    // Check if project already exists and code matches
    const projectExists = existsSync(projectDir)
    const libRsPath = join(projectDir, 'src', 'lib.rs')
    // Check WASM in shared target first, then local target
    let cachedWasmPath = join(sharedTargetDir, 'wasm32-unknown-unknown', 'release', 'contract.wasm')
    if (!existsSync(cachedWasmPath)) {
      cachedWasmPath = join(projectDir, 'target', 'wasm32-unknown-unknown', 'release', 'contract.wasm')
    }
    
    // Check if we can reuse existing build
    if (projectExists && existsSync(libRsPath)) {
      const existingCode = await readFile(libRsPath, 'utf-8')
      if (existingCode === convertedCode && existsSync(cachedWasmPath)) {
        // Code unchanged, reuse existing WASM
        console.log(`✓ Reusing cached build for code hash: ${codeHash}`)
        let wasmBuffer = await readFile(cachedWasmPath)
        let wasmSize = wasmBuffer.length
        const originalSize = wasmSize
        
        // Try to optimize cached WASM as well (in case wasm-opt wasn't available before)
        try {
          const optimizedWasmPath = join(projectDir, 'contract_optimized.wasm')
          const wasmOptResult = await execAsync(`wasm-opt -Oz -o "${optimizedWasmPath}" "${cachedWasmPath}"`, {
            maxBuffer: 10 * 1024 * 1024,
            timeout: 60000
          })
          
          if (existsSync(optimizedWasmPath)) {
            const optimizedBuffer = await readFile(optimizedWasmPath)
            const optimizedSize = optimizedBuffer.length
            if (optimizedSize < wasmSize) {
              const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1)
              console.log(`✓ Cached WASM optimized: ${originalSize} → ${optimizedSize} bytes (${reduction}% reduction)`)
              wasmBuffer = optimizedBuffer
              wasmSize = optimizedSize
              await rm(optimizedWasmPath, { force: true }).catch(() => {})
            }
          }
        } catch (wasmOptError) {
          // Ignore wasm-opt errors for cached builds
        }
        
        return {
          success: true,
          exit_code: 0,
          stdout: 'Build reused from cache',
          stderr: '',
          wasm: wasmBuffer.toString('base64'),
          wasmSize,
          abi: null,
          compilation_time: (Date.now() - startTime) / 1000,
          project_path: projectDir,
          cached: true
        }
      }
    }
    
    // Need to build - setup project directory
    if (!projectExists) {
      await mkdir(projectDir, { recursive: true })
      // Copy base project template (excluding target directory)
      await copyDir(baseProjectPath, projectDir)
    }
    
    // Write user's code to lib.rs
    await writeFile(libRsPath, convertedCode, 'utf-8')
    
    // Run cargo build with wasm32 target using shared target directory
    // Apply size optimization flags during compilation
    console.log(`Compiling Rust contract in: ${projectDir}`)
    console.log(`Using shared target directory: ${sharedTargetDir}`)
    
    const compileResult = await execAsync('cargo build --target wasm32-unknown-unknown --release', {
      cwd: projectDir,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
      env: {
        ...process.env,
        CARGO_TARGET_DIR: sharedTargetDir, // Use shared target for dependency caching
        RUSTFLAGS: '-C link-arg=-s' // Strip symbols to reduce size
      }
    })
    
    const compilationTime = (Date.now() - startTime) / 1000
    
    // Extract WASM file - with CARGO_TARGET_DIR, it's in shared-target/wasm32-unknown-unknown/release/contract.wasm
    // The package name is "contract" from Cargo.toml, so the WASM will be contract.wasm
    let wasmPath = join(sharedTargetDir, 'wasm32-unknown-unknown', 'release', 'contract.wasm')
    
    // Fallback: check local target (for backwards compatibility or if CARGO_TARGET_DIR wasn't used)
    if (!existsSync(wasmPath)) {
      wasmPath = join(projectDir, 'target', 'wasm32-unknown-unknown', 'release', 'contract.wasm')
    }
    
    let wasmBuffer = null
    let wasmSize = 0
    let abi = null
    let originalSize = 0
    
    try {
      if (existsSync(wasmPath)) {
        wasmBuffer = await readFile(wasmPath)
        originalSize = wasmBuffer.length
        wasmSize = originalSize
        console.log(`✓ WASM file compiled: ${originalSize} bytes`)
        
        // Apply wasm-opt optimization to further reduce size
        try {
          const optimizedWasmPath = join(projectDir, 'contract_optimized.wasm')
          const wasmOptResult = await execAsync(`wasm-opt -Oz -o "${optimizedWasmPath}" "${wasmPath}"`, {
            maxBuffer: 10 * 1024 * 1024,
            timeout: 60000 // 60 second timeout
          })
          
          if (existsSync(optimizedWasmPath)) {
            const optimizedBuffer = await readFile(optimizedWasmPath)
            const optimizedSize = optimizedBuffer.length
            const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1)
            
            console.log(`✓ WASM optimized: ${originalSize} → ${optimizedSize} bytes (${reduction}% reduction)`)
            
            // Use optimized WASM
            wasmBuffer = optimizedBuffer
            wasmSize = optimizedSize
            
            // Clean up temporary optimized file
            await rm(optimizedWasmPath, { force: true }).catch(() => {})
          }
        } catch (wasmOptError) {
          // wasm-opt might not be installed, continue with unoptimized WASM
          console.warn('wasm-opt not available or failed (continuing with unoptimized WASM):', wasmOptError.message)
          console.warn('To enable WASM optimization, install wasm-opt: npm install -g wasm-opt or binaryen')
        }
      } else {
        console.warn(`WASM file not found at: ${wasmPath}`)
        // Try to find any .wasm file in the release directory
        const releaseDir = join(sharedTargetDir, 'wasm32-unknown-unknown', 'release')
        try {
          if (existsSync(releaseDir)) {
            const files = await readdir(releaseDir)
            const wasmFile = files.find(f => f.endsWith('.wasm'))
            if (wasmFile) {
              wasmBuffer = await readFile(join(releaseDir, wasmFile))
              wasmSize = wasmBuffer.length
              console.log(`✓ Found WASM file: ${wasmFile} (${wasmSize} bytes)`)
            }
          }
        } catch (dirError) {
          console.warn('Could not read release directory:', dirError.message)
        }
      }
    } catch (error) {
      console.warn('Could not extract WASM file:', error.message)
    }
    
    if (!wasmBuffer) {
      throw new Error('WASM file was not generated. Compilation may have failed.')
    }
    
    // Keep project directory for future reuse (don't cleanup)
    // Only cleanup if explicitly requested (projectId === null and old behavior)
    
    return {
      success: true,
      exit_code: 0,
      stdout: compileResult.stdout,
      stderr: compileResult.stderr,
      wasm: wasmBuffer.toString('base64'),
      wasmSize,
      abi,
      compilation_time: compilationTime,
      project_path: projectDir,
      cached: false
    }
  } catch (error) {
    // Don't cleanup on error - keep for debugging
    // Only cleanup if explicitly needed
    
    // Extract error information
    const exitCode = error.code || -1
    const stdout = error.stdout || ''
    const stderr = error.stderr || error.message || ''
    
    throw {
      success: false,
      exit_code: exitCode,
      stdout,
      stderr,
      wasm: null,
      wasmSize: 0,
      abi: null,
      compilation_time: (Date.now() - startTime) / 1000,
      error: error.message
    }
  }
}

