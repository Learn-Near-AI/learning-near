import { writeFile, mkdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { build } from 'esbuild'

/**
 * Builds a NEAR contract from JavaScript/TypeScript source code
 * Note: This validates and bundles the code, but full WASM compilation
 * requires near-sdk-js CLI which doesn't support Windows.
 * 
 * @param {string} sourceCode - The contract source code
 * @param {string} language - 'JavaScript' or 'TypeScript'
 * @returns {Promise<Buffer>} The compiled .wasm file as a Buffer (placeholder for now)
 */
export async function buildContract(sourceCode, language) {
  const tempDir = join(process.cwd(), 'temp-builds', randomBytes(8).toString('hex'))

  try {
    await mkdir(tempDir, { recursive: true })

    // Determine file extension
    const ext = language === 'TypeScript' ? '.ts' : '.js'
    const contractFile = join(tempDir, `contract${ext}`)

    // Write source code to temp file
    await writeFile(contractFile, sourceCode, 'utf-8')

    // Create tsconfig.json if TypeScript
    if (language === 'TypeScript') {
      const tsconfig = {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          lib: ['ES2020'],
          moduleResolution: 'node',
          esModuleInterop: true,
          skipLibCheck: true,
          strict: true,
        },
      }
      await writeFile(
        join(tempDir, 'tsconfig.json'),
        JSON.stringify(tsconfig, null, 2),
        'utf-8',
      )
    }

    // Use esbuild to validate and bundle the contract
    // This checks for syntax errors and bundles the code
    // Note: near-sdk-js is marked as external since it's not installed (Windows compatibility)
    try {
      await build({
        entryPoints: [contractFile],
        bundle: true,
        platform: 'node',
        format: 'esm',
        outfile: join(tempDir, 'bundle.js'),
        external: ['near-sdk-js'], // Mark as external - don't try to resolve it
        write: false, // Don't write file, just validate syntax
      })
    } catch (buildError) {
      // Re-throw with clearer message
      throw new Error(`Compilation error: ${buildError.message}`)
    }

    // For now, return a minimal valid WASM placeholder
    // Full WASM compilation requires near-sdk-js CLI (Linux/Mac only)
    // or a remote build service
    const minimalWasm = Buffer.from([
      0x00, 0x61, 0x73, 0x6d, // WASM magic number
      0x01, 0x00, 0x00, 0x00, // Version 1
    ])

    // Cleanup
    await rm(tempDir, { recursive: true, force: true })

    return minimalWasm
  } catch (error) {
    // Cleanup on error
    await rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw error
  }
}



