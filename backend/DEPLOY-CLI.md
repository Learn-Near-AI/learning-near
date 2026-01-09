# NEAR CLI Deployment Guide

This guide explains how to use the backend's NEAR CLI deployment feature to compile and deploy Rust smart contracts.

## Overview

The backend now supports **two deployment methods**:

1. **NEAR CLI (Backend)** - Server-side deployment using NEAR CLI
   - Perfect for demos, examples, and automated deployments
   - No browser wallet required
   - Deploys from a backend-controlled account
   - Fast and automated

2. **MyNearWallet (Frontend)** - Browser-based deployment
   - For user-initiated deployments
   - Users control their own keys
   - Integrates with wallet-selector

## Architecture

```
User → Frontend → Backend API → NEAR CLI → NEAR Network
                                    ↓
                              Credentials from
                              Environment Variables
```

## Setup Instructions

### Prerequisites

1. **NEAR Account**: You need a NEAR account for deployments
   - For testnet: https://wallet.testnet.near.org
   - Create a dedicated account for backend deployments (recommended)

2. **NEAR CLI**: Installed on your development machine
   ```bash
   npm install -g near-cli
   ```

3. **Fly.io CLI**: For production deployment
   ```bash
   # Install Fly.io CLI
   curl -L https://fly.io/install.sh | sh
   
   # Login
   flyctl auth login
   ```

### Step 1: Get Your NEAR Credentials

1. **Login with NEAR CLI** (on your local machine):
   ```bash
   near login
   ```
   This opens a browser to authorize and stores credentials locally.

2. **Locate your credentials**:
   ```bash
   # For testnet
   cat ~/.near-credentials/testnet/your-account.testnet.json
   
   # For mainnet
   cat ~/.near-credentials/mainnet/your-account.near.json
   ```

3. **Copy the values**:
   ```json
   {
     "account_id": "your-account.testnet",
     "private_key": "ed25519:5Jz7..."
   }
   ```

### Step 2: Configure Local Development

1. **Create `.env` file** in the `backend` directory:
   ```bash
   cd backend
   nano .env  # or use your preferred editor
   ```

2. **Add your credentials**:
   ```bash
   PORT=3001
   NEAR_ACCOUNT_ID=your-account.testnet
   NEAR_PRIVATE_KEY=ed25519:your_private_key_here
   NEAR_NETWORK=testnet
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

4. **Verify configuration**:
   ```bash
   curl http://localhost:3001/api/near/status
   ```
   
   Expected response:
   ```json
   {
     "configured": true,
     "accountId": "your-account.testnet",
     "network": "testnet",
     "message": "NEAR CLI is configured and ready"
   }
   ```

### Step 3: Configure Production (Fly.io)

1. **Set secrets on Fly.io**:
   ```bash
   cd backend
   
   # Set NEAR credentials as secrets
   flyctl secrets set NEAR_ACCOUNT_ID="your-account.testnet"
   flyctl secrets set NEAR_PRIVATE_KEY="ed25519:your_private_key_here"
   flyctl secrets set NEAR_NETWORK="testnet"
   ```

2. **Deploy to Fly.io**:
   ```bash
   flyctl deploy
   ```

3. **Verify deployment**:
   ```bash
   # Check if app is running
   flyctl status
   
   # Check NEAR configuration
   curl https://your-app.fly.dev/api/near/status
   
   # View logs
   flyctl logs
   ```

## API Endpoints

### 1. Check Configuration Status

**GET** `/api/near/status`

Check if NEAR CLI is configured and ready.

**Response:**
```json
{
  "configured": true,
  "accountId": "your-account.testnet",
  "network": "testnet",
  "message": "NEAR CLI is configured and ready"
}
```

### 2. Deploy Contract

**POST** `/api/deploy`

Deploy a compiled WASM contract to NEAR.

**Request:**
```json
{
  "wasmBase64": "base64_encoded_wasm_file",
  "contractAccountId": "optional-contract.testnet",
  "initMethod": "new",
  "initArgs": {}
}
```

**Parameters:**
- `wasmBase64` (required): Base64-encoded WASM file
- `contractAccountId` (optional): Specific account to deploy to. If not provided, deploys to the backend's account
- `initMethod` (optional): Initialization method name (default: "new")
- `initArgs` (optional): Arguments for initialization method

**Response:**
```json
{
  "success": true,
  "contractId": "your-account.testnet",
  "transactionHash": "ABC123...",
  "network": "testnet",
  "wasmSize": 45678,
  "deploymentTime": 3.45,
  "explorerUrl": "https://explorer.testnet.near.org/transactions/ABC123...",
  "accountUrl": "https://explorer.testnet.near.org/accounts/your-account.testnet",
  "initialized": true,
  "initError": null
}
```

### 3. Call Contract Method

**POST** `/api/contract/call`

Call a contract method (state-changing).

**Request:**
```json
{
  "contractAccountId": "contract.testnet",
  "methodName": "set_greeting",
  "args": {
    "greeting": "Hello, World!"
  },
  "deposit": "0",
  "gas": "300000000000000"
}
```

**Parameters:**
- `contractAccountId` (required): Contract account ID
- `methodName` (required): Method to call
- `args` (optional): Method arguments object
- `accountId` (optional): Caller account (defaults to backend account)
- `deposit` (optional): NEAR deposit amount
- `gas` (optional): Gas amount

**Response:**
```json
{
  "success": true,
  "result": "Greeting set successfully",
  "stdout": "...",
  "stderr": ""
}
```

### 4. View Contract Method

**POST** `/api/contract/view`

View a contract method (read-only, no gas cost).

**Request:**
```json
{
  "contractAccountId": "contract.testnet",
  "methodName": "get_greeting",
  "args": {}
}
```

**Response:**
```json
{
  "success": true,
  "result": "Hello, World!",
  "stdout": "...",
  "stderr": ""
}
```

## Complete Workflow Example

### JavaScript/Fetch Example

```javascript
async function compileAndDeployRustContract(rustCode) {
  const API_BASE = 'http://localhost:3001'; // or your Fly.io URL
  
  try {
    // Step 1: Compile the Rust contract
    console.log('📦 Compiling contract...');
    const compileResponse = await fetch(`${API_BASE}/api/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: rustCode,
        language: 'Rust'
      })
    });
    
    const compileResult = await compileResponse.json();
    
    if (!compileResult.success) {
      throw new Error(`Compilation failed: ${compileResult.stderr}`);
    }
    
    console.log('✅ Compilation successful!');
    console.log(`   Size: ${compileResult.size} bytes`);
    console.log(`   Time: ${compileResult.compilation_time}s`);
    
    // Step 2: Deploy the contract
    console.log('\n🚀 Deploying contract...');
    const deployResponse = await fetch(`${API_BASE}/api/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wasmBase64: compileResult.wasm,
        initMethod: 'new',
        initArgs: {}
      })
    });
    
    const deployResult = await deployResponse.json();
    
    if (!deployResult.success) {
      throw new Error(`Deployment failed: ${deployResult.error}`);
    }
    
    console.log('✅ Deployment successful!');
    console.log(`   Contract ID: ${deployResult.contractId}`);
    console.log(`   Transaction: ${deployResult.transactionHash}`);
    console.log(`   Explorer: ${deployResult.explorerUrl}`);
    
    // Step 3: Test the contract
    console.log('\n🧪 Testing contract...');
    const testResponse = await fetch(`${API_BASE}/api/contract/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractAccountId: deployResult.contractId,
        methodName: 'hello_world',
        args: {}
      })
    });
    
    const testResult = await testResponse.json();
    
    if (testResult.success) {
      console.log('✅ Test successful!');
      console.log(`   Result: ${JSON.stringify(testResult.result)}`);
    }
    
    return deployResult;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Example Rust contract code
const rustCode = `
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[derive(PanicOnDefault)]
#[near(contract_state)]
pub struct Contract {
    message: String
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { 
            message: "Hello, NEAR!".to_string() 
        }
    }
    
    pub fn hello_world(&self) -> String {
        self.message.clone()
    }
    
    pub fn set_message(&mut self, message: String) {
        self.message = message;
    }
}
`;

// Run the deployment
compileAndDeployRustContract(rustCode)
  .then(result => console.log('\n🎉 All done!', result))
  .catch(error => console.error('\n💥 Failed:', error));
```

### cURL Examples

```bash
# 1. Check configuration
curl http://localhost:3001/api/near/status

# 2. Compile contract
curl -X POST http://localhost:3001/api/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "use near_sdk::near;\n...",
    "language": "Rust"
  }' | jq .

# 3. Deploy contract (using WASM from compile step)
curl -X POST http://localhost:3001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "wasmBase64": "AGFzbQEAAAAB...",
    "initMethod": "new",
    "initArgs": {}
  }' | jq .

# 4. Call contract method
curl -X POST http://localhost:3001/api/contract/call \
  -H "Content-Type: application/json" \
  -d '{
    "contractAccountId": "your-account.testnet",
    "methodName": "hello_world",
    "args": {}
  }' | jq .

# 5. View contract method
curl -X POST http://localhost:3001/api/contract/view \
  -H "Content-Type: application/json" \
  -d '{
    "contractAccountId": "your-account.testnet",
    "methodName": "hello_world",
    "args": {}
  }' | jq .
```

## Integration with Frontend

Update your frontend to use the new backend deployment:

```javascript
// In your frontend code
import { compileContract, deployContract, callContract } from './api';

async function handleDeployClick() {
  try {
    // Show loading state
    setIsDeploying(true);
    
    // Compile
    const compileResult = await compileContract(code, 'Rust');
    
    // Deploy using backend NEAR CLI
    const deployResult = await deployContract(compileResult.wasm);
    
    // Show success message with explorer link
    showSuccess(`Deployed to ${deployResult.contractId}`, deployResult.explorerUrl);
    
  } catch (error) {
    showError(error.message);
  } finally {
    setIsDeploying(false);
  }
}
```

## Troubleshooting

### Issue: "NEAR CLI deployment not configured"

**Solution**: Ensure environment variables are set:
```bash
# Check local .env file
cat backend/.env

# Check Fly.io secrets
flyctl secrets list
```

### Issue: "Invalid credentials"

**Solutions**:
1. Verify private key includes `ed25519:` prefix
2. Ensure account exists: `near state your-account.testnet`
3. Check account has sufficient balance

### Issue: "Transaction failed"

**Solutions**:
1. Add more NEAR: `near send your-account.testnet target-account.testnet 1`
2. Check contract size (max ~4MB)
3. Verify network connectivity

### Issue: "Command not found: near"

**Solution**: Install NEAR CLI in Docker:
```bash
# Already included in updated Dockerfile
# If missing, rebuild: flyctl deploy --no-cache
```

## Security Considerations

⚠️ **Important Security Notes**:

1. **Never expose private keys** in client-side code
2. **Use dedicated accounts** for backend deployments
3. **Limit account balance** to minimum needed
4. **Rotate keys regularly**
5. **Monitor deployment logs** for suspicious activity
6. **Use different accounts** for dev/staging/prod

## Best Practices

### 1. Account Naming Convention
```
deploy-dev.your-account.testnet   # Development
deploy-staging.your-account.testnet  # Staging
deploy-prod.your-account.testnet  # Production
```

### 2. Balance Management
Keep ~1-5 NEAR in deployment accounts:
```bash
near send your-account.testnet deploy-account.testnet 2
```

### 3. Monitoring
```bash
# Watch Fly.io logs
flyctl logs -a your-app

# Check account state
near state deploy-account.testnet
```

### 4. Rate Limiting
Consider adding rate limiting to prevent abuse:
```javascript
// In server.js
import rateLimit from 'express-rate-limit';

const deployLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 deployments per window
  message: 'Too many deployments, please try again later'
});

app.post('/api/deploy', deployLimiter, async (req, res) => {
  // ...
});
```

## Next Steps

1. ✅ Configure environment variables
2. ✅ Test locally with `npm run dev`
3. ✅ Deploy to Fly.io with `flyctl deploy`
4. ✅ Update frontend to use new endpoint
5. ✅ Add error handling and user feedback
6. ✅ Monitor deployment logs
7. ✅ Set up rate limiting (optional)
8. ✅ Configure monitoring and alerts (optional)

## Support

For issues or questions:
- NEAR CLI Docs: https://docs.near.org/tools/near-cli
- Fly.io Docs: https://fly.io/docs/
- NEAR Discord: https://discord.gg/near

