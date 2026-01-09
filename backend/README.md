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

### Compilation
- `GET /api/health` - Health check endpoint
- `POST /api/compile` - Compile a contract
  - Body: `{ code: string, language: 'JavaScript' | 'TypeScript' | 'Rust' }`
  - Returns: `{ success: boolean, wasm: string (base64), size: number }`

### NEAR CLI Deployment (New!)
- `GET /api/near/status` - Check NEAR CLI configuration status
- `POST /api/deploy` - Deploy a compiled contract to NEAR
  - Body: `{ wasmBase64: string, contractAccountId?: string, initMethod?: string, initArgs?: object }`
  - Returns: `{ success: boolean, contractId: string, transactionHash: string, explorerUrl: string }`
- `POST /api/contract/call` - Call a contract method (state-changing)
  - Body: `{ contractAccountId: string, methodName: string, args?: object, deposit?: string, gas?: string }`
- `POST /api/contract/view` - View a contract method (read-only)
  - Body: `{ contractAccountId: string, methodName: string, args?: object }`

See [DEPLOY-CLI.md](./DEPLOY-CLI.md) for detailed deployment documentation.

## Environment Variables

### Server
- `PORT` - Server port (default: 3001)

### NEAR CLI Deployment
- `NEAR_ACCOUNT_ID` - NEAR account for deployments (required for deployment features)
- `NEAR_PRIVATE_KEY` - Private key for the account (format: `ed25519:...`)
- `NEAR_NETWORK` - Network to use (`testnet` or `mainnet`, default: `testnet`)

See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed configuration instructions.

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

