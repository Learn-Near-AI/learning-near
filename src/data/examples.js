export const examplesData = {
  'Basics': [
    { id: 'hello-world', name: 'Hello World', difficulty: 'Beginner', language: 'Rust' },
    { id: 'storage-basics', name: 'Storage Basics', difficulty: 'Beginner', language: 'Rust' },
    { id: 'state-management', name: 'State Management', difficulty: 'Beginner', language: 'Rust' },
    { id: 'contract-structure', name: 'Contract Structure', difficulty: 'Beginner', language: 'Rust' },
    { id: 'view-methods', name: 'View Methods', difficulty: 'Beginner', language: 'Rust' },
    { id: 'change-methods', name: 'Change Methods', difficulty: 'Beginner', language: 'Rust' },
    { id: 'events', name: 'Events', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'errors', name: 'Error Handling', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'gas-optimization', name: 'Gas Optimization', difficulty: 'Advanced', language: 'Rust' },
    { id: 'testing', name: 'Unit Testing', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'panics', name: 'Panic Handling', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'collections', name: 'Collections', difficulty: 'Intermediate', language: 'Rust' },
  ],
  'Fungible Tokens': [
    { id: 'ft-standard', name: 'FT Standard', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'token-minting', name: 'Token Minting', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'token-transfer', name: 'Token Transfer', difficulty: 'Beginner', language: 'Rust' },
    { id: 'token-burn', name: 'Token Burn', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'ft-storage', name: 'FT Storage', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'ft-metadata', name: 'FT Metadata', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'ft-callbacks', name: 'FT Callbacks', difficulty: 'Advanced', language: 'Rust' },
    { id: 'ft-batch', name: 'Batch Operations', difficulty: 'Advanced', language: 'Rust' },
  ],
  'NFTs': [
    { id: 'nft-standard', name: 'NFT Standard', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-metadata', name: 'NFT Metadata', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-minting', name: 'NFT Minting', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-transfer', name: 'NFT Transfer', difficulty: 'Beginner', language: 'Rust' },
    { id: 'nft-approval', name: 'NFT Approval', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-enumeration', name: 'NFT Enumeration', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-royalties', name: 'NFT Royalties', difficulty: 'Advanced', language: 'Rust' },
    { id: 'nft-marketplace', name: 'NFT Marketplace', difficulty: 'Advanced', language: 'Rust' },
  ],
  'Cross-Contract': [
    { id: 'simple-calls', name: 'Simple Calls', difficulty: 'Beginner', language: 'Rust' },
    { id: 'promises', name: 'Promises', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'callbacks', name: 'Callbacks', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'cross-call-ft', name: 'Cross-Call FT', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'cross-call-nft', name: 'Cross-Call NFT', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'batch-calls', name: 'Batch Calls', difficulty: 'Advanced', language: 'Rust' },
    { id: 'promise-results', name: 'Promise Results', difficulty: 'Advanced', language: 'Rust' },
    { id: 'async-patterns', name: 'Async Patterns', difficulty: 'Advanced', language: 'Rust' },
    { id: 'callback-patterns', name: 'Callback Patterns', difficulty: 'Advanced', language: 'Rust' },
    { id: 'error-propagation', name: 'Error Propagation', difficulty: 'Advanced', language: 'Rust' },
  ],
  'Chain Signatures': [
    { id: 'multi-chain-signing', name: 'Multi-chain Signing', difficulty: 'Advanced', language: 'Rust' },
    { id: 'signature-verification', name: 'Signature Verification', difficulty: 'Advanced', language: 'Rust' },
    { id: 'chain-signatures-basics', name: 'Chain Signatures Basics', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'signature-requests', name: 'Signature Requests', difficulty: 'Advanced', language: 'Rust' },
    { id: 'cross-chain-auth', name: 'Cross-Chain Auth', difficulty: 'Advanced', language: 'Rust' },
    { id: 'signature-callbacks', name: 'Signature Callbacks', difficulty: 'Advanced', language: 'Rust' },
  ],
  'Indexing': [
    { id: 'queryapi-basics', name: 'QueryAPI Basics', difficulty: 'Intermediate', language: 'JS' },
    { id: 'indexer-setup', name: 'Indexer Setup', difficulty: 'Intermediate', language: 'JS' },
    { id: 'data-indexing', name: 'Data Indexing', difficulty: 'Intermediate', language: 'JS' },
    { id: 'queryapi-queries', name: 'QueryAPI Queries', difficulty: 'Intermediate', language: 'JS' },
    { id: 'indexer-filters', name: 'Indexer Filters', difficulty: 'Advanced', language: 'JS' },
    { id: 'indexer-aggregation', name: 'Indexer Aggregation', difficulty: 'Advanced', language: 'JS' },
    { id: 'indexer-performance', name: 'Indexer Performance', difficulty: 'Advanced', language: 'JS' },
    { id: 'indexer-monitoring', name: 'Indexer Monitoring', difficulty: 'Advanced', language: 'JS' },
  ],
  'Real-World': [
    { id: 'defi-swap', name: 'DeFi Swap', difficulty: 'Advanced', language: 'Rust' },
    { id: 'social-app', name: 'Social App', difficulty: 'Advanced', language: 'Rust' },
    { id: 'gaming-logic', name: 'Gaming Logic', difficulty: 'Advanced', language: 'Rust' },
    { id: 'voting-system', name: 'Voting System', difficulty: 'Advanced', language: 'Rust' },
    { id: 'marketplace', name: 'Marketplace', difficulty: 'Advanced', language: 'Rust' },
    { id: 'dao-governance', name: 'DAO Governance', difficulty: 'Advanced', language: 'Rust' },
    { id: 'staking-contract', name: 'Staking Contract', difficulty: 'Advanced', language: 'Rust' },
    { id: 'lending-protocol', name: 'Lending Protocol', difficulty: 'Advanced', language: 'Rust' },
  ],
}

export const categoryIcons = {
  'Basics': '📚',
  'Fungible Tokens': '💰',
  'NFTs': '🎨',
  'Cross-Contract': '🔗',
  'Chain Signatures': '🔐',
  'Indexing': '📊',
  'Real-World': '🎮',
}

export const difficultyColors = {
  'Beginner': 'bg-green-500/20 text-green-500 border-green-500/30',
  'Intermediate': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  'Advanced': 'bg-red-500/20 text-red-500 border-red-500/30',
}

export const languageIcons = {
  'Rust': '⚽',
  'JS': '📜',
  'TS': '📘',
}

