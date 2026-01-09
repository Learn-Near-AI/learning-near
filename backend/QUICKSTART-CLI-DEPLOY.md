# Quick Start: NEAR CLI Deployment

Get up and running with backend NEAR CLI deployments in 5 minutes!

## What Was Implemented

Your backend now has **NEAR CLI deployment** capabilities! This means:

✅ **Compile Rust contracts** (you already had this)  
✅ **Deploy to NEAR** via backend API (NEW!)  
✅ **Call contract methods** via backend API (NEW!)  
✅ **View contract methods** via backend API (NEW!)  
✅ **No browser wallet needed** for backend deployments (NEW!)

## Prerequisites

Before you start, you need:

1. **A NEAR testnet account** - Create one at https://wallet.testnet.near.org
2. **NEAR CLI installed** - `npm install -g near-cli`
3. **Your account credentials** - We'll get these in the next step

## Setup in 4 Steps

### Step 1: Get Your NEAR Credentials

```bash
# Login to NEAR (opens browser)
near login

# View your credentials
cat ~/.near-credentials/testnet/YOUR_ACCOUNT.testnet.json
```

You'll see something like:
```json
{
  "account_id": "your-account.testnet",
  "private_key": "ed25519:5Jz7..."
}
```

**Copy these values** - you'll need them in the next step.

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
nano .env
```

Add your credentials:

```bash
PORT=3001
NEAR_ACCOUNT_ID=your-account.testnet
NEAR_PRIVATE_KEY=ed25519:your_private_key_here
NEAR_NETWORK=testnet
```

**Important**: Replace `your-account.testnet` and `ed25519:your_private_key_here` with your actual values!

### Step 3: Start the Backend

```bash
# Install dependencies (if not already done)
npm install

# Start the server
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:3001
📦 Compile endpoint: POST http://localhost:3001/api/compile
🚢 Deploy endpoint: POST http://localhost:3001/api/deploy
✅ NEAR CLI configured for account: your-account.testnet on testnet
```

### Step 4: Test the Deployment

Run the test script:

```bash
npm run test:deploy
```

This will:
1. ✅ Check NEAR CLI configuration
2. ✅ Compile a Rust contract
3. ✅ Deploy it to NEAR
4. ✅ Call a contract method
5. ✅ View the result

If all tests pass, you're ready to go! 🎉

## What's Next?

### Use from Your Frontend

Update your frontend to use the new deployment endpoint:

```javascript
// Compile and deploy in one flow
async function deployContract(rustCode) {
  const API_BASE = 'http://localhost:3001';
  
  // 1. Compile
  const compileRes = await fetch(`${API_BASE}/api/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: rustCode, language: 'Rust' })
  });
  const { wasm } = await compileRes.json();
  
  // 2. Deploy
  const deployRes = await fetch(`${API_BASE}/api/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      wasmBase64: wasm,
      initMethod: 'new',
      initArgs: {}
    })
  });
  const result = await deployRes.json();
  
  console.log('Deployed to:', result.contractId);
  console.log('Explorer:', result.explorerUrl);
  
  return result;
}
```

### Deploy to Fly.io

When you're ready for production:

```bash
cd backend

# Set secrets on Fly.io
flyctl secrets set NEAR_ACCOUNT_ID="your-account.testnet"
flyctl secrets set NEAR_PRIVATE_KEY="ed25519:your_key"
flyctl secrets set NEAR_NETWORK="testnet"

# Deploy
flyctl deploy

# Verify
flyctl logs
curl https://your-app.fly.dev/api/near/status
```

## API Endpoints

### Check Status
```bash
GET /api/near/status
```

### Compile Contract
```bash
POST /api/compile
{
  "code": "rust_code_here",
  "language": "Rust"
}
```

### Deploy Contract
```bash
POST /api/deploy
{
  "wasmBase64": "compiled_wasm_base64",
  "initMethod": "new",
  "initArgs": {}
}
```

### Call Contract Method
```bash
POST /api/contract/call
{
  "contractAccountId": "account.testnet",
  "methodName": "method_name",
  "args": {}
}
```

### View Contract Method
```bash
POST /api/contract/view
{
  "contractAccountId": "account.testnet",
  "methodName": "method_name",
  "args": {}
}
```

## Security Reminders

⚠️ **Important**:
- Never commit `.env` file to git (it's already in `.gitignore`)
- Use a dedicated account for backend deployments
- Keep minimal NEAR balance in the deployment account
- For production, use Fly.io secrets (not `.env`)

## Troubleshooting

### "NEAR CLI deployment not configured"
→ Check that `NEAR_ACCOUNT_ID` and `NEAR_PRIVATE_KEY` are in your `.env` file

### "Invalid credentials"
→ Verify the private key includes the `ed25519:` prefix

### "Transaction failed"
→ Ensure your account has sufficient balance:
```bash
near state your-account.testnet
```

### Need more help?
- See detailed docs: [DEPLOY-CLI.md](./DEPLOY-CLI.md)
- Environment setup: [ENVIRONMENT.md](./ENVIRONMENT.md)
- Check server logs for detailed error messages

## Files Changed/Added

### New Files:
- `backend/deploy-contract.js` - Deployment logic
- `backend/test-near-deploy.js` - Test suite
- `backend/DEPLOY-CLI.md` - Detailed documentation
- `backend/ENVIRONMENT.md` - Environment configuration guide
- `backend/QUICKSTART-CLI-DEPLOY.md` - This file

### Modified Files:
- `backend/Dockerfile` - Added NEAR CLI installation
- `backend/server.js` - Added deployment endpoints
- `backend/package.json` - Added test script
- `backend/README.md` - Updated API documentation

## Summary

You now have a **fully functional backend** that can:
- ✅ Compile Rust NEAR contracts
- ✅ Deploy them to NEAR blockchain
- ✅ Call and view contract methods
- ✅ All via simple HTTP API calls

No browser wallet needed for backend deployments! 🚀

