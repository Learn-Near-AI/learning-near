# Environment Variables Configuration

This document describes the environment variables required for the backend server.

## Server Configuration

```bash
PORT=3001
```
- **Description**: Port the server runs on
- **Default**: 3001
- **Required**: No

## NEAR CLI Deployment Configuration

These credentials are used by the backend to deploy contracts via NEAR CLI. This is **separate** from the frontend wallet connection (wallet-selector).

### NEAR_ACCOUNT_ID

```bash
NEAR_ACCOUNT_ID=your-account.testnet
```
- **Description**: The NEAR account that will deploy contracts
- **Example**: `your-account.testnet` or `your-account.near`
- **Required**: Yes (for deployment features)
- **How to get**: This is your NEAR account ID

### NEAR_PRIVATE_KEY

```bash
NEAR_PRIVATE_KEY=ed25519:your_private_key_here
```
- **Description**: The private key for the deployer account
- **Format**: `ed25519:...` (starts with ed25519:)
- **Required**: Yes (for deployment features)
- **How to get**:
  1. Login with NEAR CLI: `near login`
  2. View credentials: `cat ~/.near-credentials/testnet/YOUR_ACCOUNT.testnet.json`
  3. Copy the `private_key` value

### NEAR_NETWORK

```bash
NEAR_NETWORK=testnet
```
- **Description**: Network to deploy to
- **Options**: `testnet` or `mainnet`
- **Default**: `testnet`
- **Required**: No

## Local Development Setup

1. **Create a `.env` file** in the `backend` directory:

```bash
cd backend
touch .env
```

2. **Add your credentials** to the `.env` file:

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

## Production Deployment (Fly.io)

For production deployment on Fly.io, set environment variables as secrets:

```bash
# Navigate to backend directory
cd backend

# Set NEAR credentials as secrets
flyctl secrets set NEAR_ACCOUNT_ID="your-account.testnet"
flyctl secrets set NEAR_PRIVATE_KEY="ed25519:your_private_key_here"
flyctl secrets set NEAR_NETWORK="testnet"

# Deploy
flyctl deploy
```

## Security Best Practices

### 1. Use a Dedicated Deployment Account
Create a specific NEAR account just for backend deployments, separate from your personal account.

```bash
# Create a new account for deployments
near create-account deploy-bot.your-account.testnet --masterAccount your-account.testnet --initialBalance 5
```

### 2. Limit Funds
Keep minimal NEAR balance in the deployment account (just enough for gas fees). You can always add more later.

### 3. Environment-Specific Accounts
Use different accounts for different environments:
- Development: `deploy-dev.your-account.testnet`
- Staging: `deploy-staging.your-account.testnet`
- Production: `deploy-prod.your-account.testnet`

### 4. Never Commit Credentials
- The `.env` file is in `.gitignore` - **never commit it**
- Never hardcode credentials in source code
- Use environment variables or secrets management

### 5. Rotate Keys Periodically
Change the private key regularly for security:

```bash
# Generate new key pair
near generate-key your-account.testnet

# Add the new key to your account
near add-key your-account.testnet <new_public_key>

# Update the NEAR_PRIVATE_KEY environment variable
flyctl secrets set NEAR_PRIVATE_KEY="ed25519:new_private_key"

# Test the new key
curl https://your-app.fly.dev/api/near/status

# Remove old key (after confirming new key works)
near delete-key your-account.testnet <old_public_key>
```

### 6. Monitor Deployments
Log all deployment activity and monitor for suspicious behavior:

```bash
# View Fly.io logs
flyctl logs

# Check NEAR account activity
near state your-account.testnet --networkId testnet
```

## Checking Configuration

### Check if credentials are configured:

```bash
curl http://localhost:3001/api/near/status
```

Response when configured:
```json
{
  "configured": true,
  "accountId": "your-account.testnet",
  "network": "testnet",
  "message": "NEAR CLI is configured and ready"
}
```

Response when NOT configured:
```json
{
  "configured": false,
  "accountId": null,
  "network": "testnet",
  "message": "NEAR CLI not configured. Set NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY environment variables."
}
```

## Troubleshooting

### "NEAR CLI deployment not configured" error

**Problem**: The server returns a 503 error with message about missing configuration.

**Solution**: Ensure `NEAR_ACCOUNT_ID` and `NEAR_PRIVATE_KEY` are set:

```bash
# Check if variables are set
echo $NEAR_ACCOUNT_ID
echo $NEAR_PRIVATE_KEY

# On Fly.io, check secrets
flyctl secrets list
```

### "Invalid credentials" error

**Problem**: Deployment fails with authentication error.

**Solutions**:
1. Verify the private key format includes `ed25519:` prefix
2. Ensure the account ID matches the private key
3. Check that the account exists on the specified network
4. Verify the account has sufficient balance for gas

```bash
# Check account state
near state your-account.testnet --networkId testnet
```

### "Transaction failed" error

**Problem**: Deployment transaction fails.

**Possible causes**:
1. Insufficient balance for gas
2. Contract is too large
3. Network issues

**Solutions**:
1. Add more NEAR to the account: `near send your-account.testnet deploy-account.testnet 1`
2. Optimize contract size (ensure wasm-opt is installed)
3. Retry the deployment

## Example Usage

### Complete Compile and Deploy Flow

```javascript
// 1. Compile the contract
const compileResponse = await fetch('http://localhost:3001/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: rustCode,
    language: 'Rust'
  })
})

const compileResult = await compileResponse.json()

// 2. Deploy the compiled contract
const deployResponse = await fetch('http://localhost:3001/api/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wasmBase64: compileResult.wasm,
    initMethod: 'new',
    initArgs: {}
  })
})

const deployResult = await deployResponse.json()
console.log('Contract deployed to:', deployResult.contractId)
console.log('Explorer URL:', deployResult.explorerUrl)

// 3. Call a contract method
const callResponse = await fetch('http://localhost:3001/api/contract/call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractAccountId: deployResult.contractId,
    methodName: 'hello_world',
    args: {}
  })
})

const callResult = await callResponse.json()
console.log('Result:', callResult.result)
```

