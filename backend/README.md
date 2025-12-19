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

