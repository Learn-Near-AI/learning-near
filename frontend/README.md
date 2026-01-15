# NEAR Contract Compiler Frontend

A simple HTML frontend for compiling JavaScript NEAR smart contracts.

## Usage

1. **Start the backend server** (in WSL):
   ```bash
   cd backend
   npm run dev
   ```

2. **Open the frontend**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (if you have http-server installed)
     npx http-server -p 8000
     ```
   - Then navigate to `http://localhost:8000`

3. **Write your contract** in the textarea or use one of the example contracts

4. **Click "Compile Contract"** or press `Ctrl+Enter`

5. **View the results** - success shows WASM size, errors show detailed messages

## Features

- ✅ Write JavaScript NEAR contracts
- ✅ Compile via backend `/api/compile` endpoint
- ✅ Example contracts included (Counter, Greeting, Storage)
- ✅ Real-time compilation feedback
- ✅ Keyboard shortcut: `Ctrl+Enter` to compile

## Backend Endpoint

The frontend connects to: `http://localhost:3001/api/compile`

Make sure your backend server is running before compiling contracts.
