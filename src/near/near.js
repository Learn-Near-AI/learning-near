import { Buffer } from 'buffer'
import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'

// Polyfill Buffer for any deps that still expect it (near-api-js, etc.)
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}

const TESTNET_NETWORK = 'testnet'
const CONTRACT_ID = 'example-contract.testnet' // you can change this later

let selectorPromise = null
let modal = null

export const getNearConfig = () => ({
  networkId: TESTNET_NETWORK,
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://testnet.mynearwallet.com',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
})

export async function initWalletSelector() {
  if (!selectorPromise) {
    selectorPromise = setupWalletSelector({
      network: TESTNET_NETWORK,
      debug: false,
      modules: [setupMyNearWallet()],
    }).then((selector) => {
      if (!modal) {
        modal = setupModal(selector, {
          contractId: CONTRACT_ID,
          theme: 'dark',
        })
      }
      return selector
    })
  }

  return selectorPromise
}

export function openWalletSelectorModal() {
  if (modal) {
    modal.show()
  }
}

export async function getActiveAccountId() {
  const selector = await initWalletSelector()
  const state = selector.store.getState()
  const active = state.accounts.find((it) => it.active)
  return active?.accountId || null
}

export async function getActiveAccountBalance() {
  const accountId = await getActiveAccountId()
  if (!accountId) return null

  const { nodeUrl } = getNearConfig()

  try {
    const res = await fetch(nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: accountId,
        },
      }),
    })

    const json = await res.json()
    const amountYocto = json?.result?.amount
    if (!amountYocto) return null

    // Convert yoctoNEAR (1e24) to NEAR, formatted to 3 decimal places
    const balance = Number(amountYocto) / 1e24
    return balance.toFixed(3)
  } catch (e) {
    console.error('Failed to fetch account balance', e)
    return null
  }
}

export async function disconnectWallet() {
  try {
    const selector = await initWalletSelector()
    const wallet = await selector.wallet()
    await wallet.signOut()
  } catch (e) {
    console.error('Failed to disconnect wallet', e)
  }
}

/**
 * Validates a NEAR account ID format
 * @param {string} accountId - The account ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidAccountId(accountId) {
  if (!accountId || typeof accountId !== 'string') return false
  
  // NEAR account ID rules:
  // - 2-64 characters
  // - Lowercase alphanumeric or separators (._-)
  // - Cannot start or end with separator
  // - Cannot have consecutive separators
  if (accountId.length < 2 || accountId.length > 64) return false
  
  const accountIdRegex = /^[a-z0-9]+([._-][a-z0-9]+)*$/
  return accountIdRegex.test(accountId)
}

/**
 * Validates contract WASM size
 * NEAR has a maximum contract size limit
 * @param {number} sizeInBytes - Contract size in bytes
 * @returns {{valid: boolean, error?: string, warning?: string}} - Validation result
 */
export function validateContractSize(sizeInBytes) {
  const MAX_CONTRACT_SIZE = 4 * 1024 * 1024 // 4 MB (NEAR's limit)
  const MIN_VALID_WASM_SIZE = 8 // Absolute minimum for WASM (magic number + version)
  const MIN_RECOMMENDED_SIZE = 100 // Minimum recommended size for a real contract
  
  // Allow minimal WASM files (for testing/placeholder contracts)
  if (sizeInBytes < MIN_VALID_WASM_SIZE) {
    return { 
      valid: false, 
      error: 'Contract is too small. A valid WASM file must be at least 8 bytes.' 
    }
  }
  
  // Warn if contract is suspiciously small (likely a placeholder)
  if (sizeInBytes < MIN_RECOMMENDED_SIZE) {
    return { 
      valid: true, 
      warning: 'Contract is very small. This may be a placeholder. Real contracts are typically larger.' 
    }
  }
  
  if (sizeInBytes > MAX_CONTRACT_SIZE) {
    return { 
      valid: false, 
      error: `Contract exceeds maximum size of ${MAX_CONTRACT_SIZE / 1024 / 1024} MB` 
    }
  }
  
  return { valid: true }
}

/**
 * Securely deploys a contract to NEAR TestNet using MyNearWallet
 * @param {string|Uint8Array|Array} wasmCode - The compiled WASM contract code (base64 string, Uint8Array, or Array)
 * @param {Object} options - Deployment options
 * @param {string} options.accountId - The account ID to deploy to (must be the connected account)
 * @param {number} options.gasLimit - Gas limit for deployment (default: 300 TGas)
 * @param {string} options.attachedDeposit - NEAR to attach (default: 0)
 * @returns {Promise<{success: boolean, transactionHash?: string, contractId?: string, error?: string}>}
 */
export async function deployContract(wasmCode, options = {}) {
  try {
    const { accountId, gasLimit = '300000000000000', attachedDeposit = '0' } = options
    
    // Security validations
    if (!accountId) {
      return { success: false, error: 'Account ID is required' }
    }
    
    if (!isValidAccountId(accountId)) {
      return { success: false, error: 'Invalid account ID format' }
    }
    
    // Verify network is testnet (safety check)
    const config = getNearConfig()
    if (config.networkId !== 'testnet') {
      return { success: false, error: 'Deployment is only allowed on TestNet for safety' }
    }
    
    // Get wallet selector and verify connection
    const selector = await initWalletSelector()
    const state = selector.store.getState()
    const activeAccount = state.accounts.find((it) => it.active)
    
    if (!activeAccount) {
      return { success: false, error: 'No wallet connected. Please connect your wallet first.' }
    }
    
    // Security: Only allow deploying to the connected account
    if (activeAccount.accountId !== accountId) {
      return { 
        success: false, 
        error: 'Security: You can only deploy to your own connected account.' 
      }
    }
    
    // Convert WASM code to Uint8Array
    let wasmUint8Array
    if (typeof wasmCode === 'string') {
      // Base64 string
      const wasmBuffer = Buffer.from(wasmCode, 'base64')
      wasmUint8Array = new Uint8Array(wasmBuffer)
    } else if (Array.isArray(wasmCode)) {
      // Array of numbers
      wasmUint8Array = new Uint8Array(wasmCode)
    } else if (wasmCode instanceof Uint8Array) {
      wasmUint8Array = wasmCode
    } else {
      return { success: false, error: 'Invalid WASM code format' }
    }
    
    // Validate contract size
    const sizeValidation = validateContractSize(wasmUint8Array.length)
    if (!sizeValidation.valid) {
      return { success: false, error: sizeValidation.error }
    }
    
    // Store warning if present (for informational purposes)
    const warning = sizeValidation.warning
    
    // Get wallet instance
    const wallet = await selector.wallet()
    
    // Import near-api-js for proper transaction building
    const nearApi = await import('near-api-js')
    
    // Build DeployContract action
    // The wallet selector expects actions in a format compatible with near-api-js
    // We need to construct the action properly for the wallet selector to serialize it
    let deployAction
    
    // Try different methods to create the deploy action
    if (nearApi.transactions && typeof nearApi.transactions.deployContract === 'function') {
      // Method 1: Use transactions.deployContract if available
      deployAction = nearApi.transactions.deployContract(wasmUint8Array)
    } else if (nearApi.Action) {
      // Method 2: Use Action enum directly
      deployAction = nearApi.Action.deployContract(wasmUint8Array)
    } else {
      // Method 3: Construct action manually in NEAR protocol format
      // The wallet selector will serialize this properly
      deployAction = {
        enum: 'deployContract',
        deployContract: {
          code: wasmUint8Array,
        },
      }
    }
    
    // Deploy to user's own account (signerId === receiverId)
    // This is the standard and safe way to deploy contracts
    // MyNearWallet will not block this since you're deploying to your own account
    const result = await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: accountId, // Deploy to your own account (required for security)
      actions: [deployAction],
    })
    
    // Extract transaction hash from result
    let transactionHash = null
    if (result?.transaction?.hash) {
      transactionHash = result.transaction.hash
    } else if (result?.transactionHash) {
      transactionHash = result.transactionHash
    } else if (result?.receipts_outcome?.[0]?.id) {
      transactionHash = result.receipts_outcome[0].id
    } else if (typeof result === 'string') {
      transactionHash = result
    }
    
    return {
      success: true,
      transactionHash,
      contractId: accountId,
      warning, // Include warning if present
    }
  } catch (error) {
    // Handle specific error types
    let errorMessage = 'Deployment failed'
    
    if (error.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    // Common error patterns
    if (errorMessage.includes('User rejected')) {
      errorMessage = 'Transaction was rejected by user'
    } else if (errorMessage.includes('network')) {
      errorMessage = 'Network error. Please check your connection and try again.'
    } else if (errorMessage.includes('insufficient')) {
      errorMessage = 'Insufficient balance. Please ensure you have enough NEAR for deployment.'
    }
    
    console.error('Deployment error:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Calls a view method on a deployed contract
 * @param {string} contractId - The contract account ID
 * @param {string} methodName - The method name to call
 * @param {Object} args - Method arguments (will be JSON stringified)
 * @returns {Promise<{success: boolean, result?: any, error?: string}>}
 */
export async function callViewMethod(contractId, methodName, args = {}) {
  try {
    if (!isValidAccountId(contractId)) {
      return { success: false, error: 'Invalid contract ID format' }
    }
    
    const config = getNearConfig()
    const response = await fetch(config.nodeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'call_function',
          finality: 'final',
          account_id: contractId,
          method_name: methodName,
          args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        },
      }),
    })
    
    const json = await response.json()
    
    if (json.error) {
      return { success: false, error: json.error.message || 'View method call failed' }
    }
    
    // Decode result
    const result = JSON.parse(Buffer.from(json.result.result, 'base64').toString())
    
    return { success: true, result }
  } catch (error) {
    console.error('View method call error:', error)
    return { success: false, error: error.message || 'Failed to call view method' }
  }
}

/**
 * Calls a change method on a deployed contract (requires transaction)
 * @param {string} contractId - The contract account ID
 * @param {string} methodName - The method name to call
 * @param {Object} args - Method arguments
 * @param {Object} options - Transaction options
 * @param {string} options.gasLimit - Gas limit (default: 30 TGas)
 * @param {string} options.attachedDeposit - NEAR to attach (default: 0)
 * @returns {Promise<{success: boolean, transactionHash?: string, error?: string}>}
 */
export async function callChangeMethod(contractId, methodName, args = {}, options = {}) {
  try {
    const { gasLimit = '30000000000000', attachedDeposit = '0' } = options
    
    if (!isValidAccountId(contractId)) {
      return { success: false, error: 'Invalid contract ID format' }
    }
    
    const accountId = await getActiveAccountId()
    if (!accountId) {
      return { success: false, error: 'Please connect your wallet first' }
    }
    
    const selector = await initWalletSelector()
    const wallet = await selector.wallet()
    
    const nearApi = await import('near-api-js')
    const { transactions } = nearApi
    
    const functionCallAction = transactions.functionCall(
      methodName,
      Buffer.from(JSON.stringify(args)),
      gasLimit,
      attachedDeposit
    )
    
    const result = await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [functionCallAction],
    })
    
    let transactionHash = null
    if (result?.transaction?.hash) {
      transactionHash = result.transaction.hash
    } else if (result?.transactionHash) {
      transactionHash = result.transactionHash
    } else if (result?.receipts_outcome?.[0]?.id) {
      transactionHash = result.receipts_outcome[0].id
    } else if (typeof result === 'string') {
      transactionHash = result
    }
    
    return { success: true, transactionHash }
  } catch (error) {
    let errorMessage = 'Method call failed'
    
    if (error.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    if (errorMessage.includes('User rejected')) {
      errorMessage = 'Transaction was rejected by user'
    }
    
    console.error('Change method call error:', error)
    return { success: false, error: errorMessage }
  }
}


