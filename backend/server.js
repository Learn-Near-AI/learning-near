import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { buildContract } from './build-contract.js'
import { buildRustContract } from './build-rust-contract.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Compile contract endpoint
app.post('/api/compile', async (req, res) => {
  try {
    const { code, language, projectId } = req.body

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing code or language' })
    }

    if (!['JavaScript', 'TypeScript', 'Rust'].includes(language)) {
      return res.status(400).json({ error: 'Unsupported language. Use JavaScript, TypeScript, or Rust' })
    }

    console.log(`Compiling ${language} contract...`)

    if (language === 'Rust') {
      try {
        const result = await buildRustContract(code, projectId)
        
        res.json({
          success: result.success,
          exit_code: result.exit_code,
          stdout: result.stdout,
          stderr: result.stderr,
          wasm: result.wasm,
          size: result.wasmSize,
          abi: result.abi,
          compilation_time: result.compilation_time,
          details: {
            status: result.success ? 'success' : 'failed',
            compilation_time: result.compilation_time,
            project_path: result.project_path,
            wasm_size: result.wasmSize,
            optimized: true
          }
        })
      } catch (error) {
        // Error object from buildRustContract
        res.status(500).json({
          success: false,
          exit_code: error.exit_code || -1,
          stdout: error.stdout || '',
          stderr: error.stderr || error.error || error.message,
          wasm: null,
          size: 0,
          abi: null,
          compilation_time: error.compilation_time || 0,
          error: error.error || error.message,
          details: {
            status: 'failed',
            compilation_time: error.compilation_time || 0,
            project_path: error.project_path || '',
            wasm_size: 0,
            optimized: false
          }
        })
      }
    } else {
      // JavaScript/TypeScript compilation (existing code)
      const wasmBuffer = await buildContract(code, language)

      // Convert buffer to base64 for sending over HTTP
      const wasmBase64 = wasmBuffer.toString('base64')

      res.json({
        success: true,
        wasm: wasmBase64,
        size: wasmBuffer.length,
      })
    }
  } catch (error) {
    console.error('Compilation error:', error)
    res.status(500).json({
      error: 'Compilation failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📦 Compile endpoint: POST http://localhost:${PORT}/api/compile`)
})


