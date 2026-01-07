# Backend Server

Express server for compiling NEAR smart contracts.

## Setup

```bash
# Install dependencies
npm install
```

## Running

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` (or the port specified in the `PORT` environment variable).

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/compile` - Compile a contract
  - Body: `{ code: string, language: 'JavaScript' | 'TypeScript' | 'Rust' }`
  - Returns: `{ success: boolean, wasm: string (base64), size: number }`

## Environment Variables

- `PORT` - Server port (default: 3001)

## WASM Optimization

The backend automatically optimizes Rust-compiled WASM files to reduce size by 30-50%:

1. **Rust Compilation Optimization**: Uses `RUSTFLAGS='-C link-arg=-s'` to strip symbols during compilation
2. **Post-Compilation Optimization**: Uses `wasm-opt -Oz` to further optimize the WASM binary

### Installing wasm-opt (Optional but Recommended)

For maximum size reduction, install `wasm-opt`:

**Option 1: Using npm (Binaryen package)**
```bash
npm install -g binaryen
```

**Option 2: Using package manager**
- **Windows**: Download from [Binaryen releases](https://github.com/WebAssembly/binaryen/releases)
- **Linux**: `sudo apt-get install binaryen` or `sudo yum install binaryen`
- **macOS**: `brew install binaryen`

**Note**: If `wasm-opt` is not available, the backend will still compile and optimize using Rust flags, but won't apply the additional `wasm-opt` optimization. The compilation will succeed with a warning.

