import { writeFile, mkdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { exec } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'

const execAsync = promisify(exec)

/**
 * Builds a NEAR contract from JavaScript/TypeScript source code using near-sdk-js
 * 
 * @param {string} sourceCode - The contract source code
 * @param {string} language - 'JavaScript' or 'TypeScript'
 * @returns {Promise<Buffer>} The compiled .wasm file as a Buffer
 */
export async function buildContract(sourceCode, language) {
  const tempDir = join(process.cwd(), 'temp-builds', randomBytes(8).toString('hex'))
  const startTime = Date.now()

  try {
    await mkdir(tempDir, { recursive: true })

    // Create proper directory structure for near-sdk-js
    const srcDir = join(tempDir, 'src')
    const buildDir = join(tempDir, 'build')
    await mkdir(srcDir, { recursive: true })
    await mkdir(buildDir, { recursive: true })

    // Determine file extension - USE .js for JavaScript (matching experiment/auction)
    // experiment/auction uses .js for JavaScript contracts
    const ext = language === 'TypeScript' ? '.ts' : '.js'
    const contractFile = join(srcDir, `contract${ext}`)
    const wasmFile = join(buildDir, 'contract.wasm')

    // Write source code to temp file
    await writeFile(contractFile, sourceCode, 'utf-8')

    // Create package.json for near-sdk-js (required for compilation)
    // Matching experiment/auction: use direct near-sdk-js command in build script
    const packageJson = {
      name: 'temp-contract',
      version: '1.0.0',
      type: 'module',
      scripts: {
        build: `near-sdk-js build src/contract${ext} build/contract.wasm`
      },
      dependencies: {
        'near-sdk-js': '^2.0.0'
      }
    }
    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf-8',
    )

    // Create tsconfig.json (required for near-sdk-js compilation)
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        lib: ['ES2020'],
        moduleResolution: 'node',
        esModuleInterop: true,
        skipLibCheck: true,
        strict: language === 'TypeScript',
        experimentalDecorators: true,
      },
    }
    await writeFile(
      join(tempDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
      'utf-8',
    )

    // Install near-sdk-js in temp directory
    console.log(`Installing near-sdk-js in ${tempDir}...`)
    try {
      await execAsync('npm install --legacy-peer-deps --no-audit --no-fund --loglevel=error', {
        cwd: tempDir,
        maxBuffer: 10 * 1024 * 1024,
        timeout: 180000, // 3 minute timeout for npm install
      })
      console.log('✓ near-sdk-js installed')
    } catch (installError) {
      console.warn('npm install failed, trying npx...')
      // If install fails, we'll use npx which will download on the fly
    }

    // Build contract using near-sdk-js CLI (matching experiment/auction approach)
    // Use npm run build to execute the build script, which uses direct near-sdk-js command
    console.log(`Compiling ${language} contract using near-sdk-js (matching experiment/auction approach)...`)
    
    try {
      const buildResult = await execAsync('npm run build', {
        cwd: tempDir, // Run from tempDir so relative paths work
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large outputs
        timeout: 240000, // 4 minute timeout (first build downloads dependencies)
        env: {
          ...process.env,
          NODE_ENV: 'production'
        }
      })
      if (buildResult.stdout && buildResult.stdout.length < 1000) {
        console.log('Build stdout:', buildResult.stdout)
      }
      if (buildResult.stderr && buildResult.stderr.length < 1000) {
        console.log('Build stderr:', buildResult.stderr)
      }
    } catch (buildError) {
      const errorMsg = `Compilation failed: ${buildError.message}`
      const stdout = buildError.stdout || ''
      const stderr = buildError.stderr || ''
      console.error('Build error details:', { errorMsg, stdout: stdout.substring(0, 500), stderr: stderr.substring(0, 500) })
      throw new Error(`${errorMsg}\nStdout: ${stdout.substring(0, 1000)}\nStderr: ${stderr.substring(0, 1000)}`)
    }

    // Check if WASM file was created
    if (!existsSync(wasmFile)) {
      throw new Error('WASM file was not generated. Compilation may have failed.')
    }

    // Read the compiled WASM file
    const wasmBuffer = await readFile(wasmFile)
    const compilationTime = (Date.now() - startTime) / 1000

    console.log(`✓ Contract compiled successfully: ${wasmBuffer.length} bytes in ${compilationTime.toFixed(2)}s`)

    // Cleanup
    await rm(tempDir, { recursive: true, force: true })

    return wasmBuffer
  } catch (error) {
    // Cleanup on error
    await rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw error
  }
}



