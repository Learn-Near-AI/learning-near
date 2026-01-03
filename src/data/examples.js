export const examplesData = {
  Basics: [
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
  NFTs: [
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
  Indexing: [
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
  'JavaScript': '📜',
}

// Real, minimal NEAR contract code for each example & language.
// These are valid patterns you can copy into a real NEAR project.
export const exampleCode = {
  'hello-world': {
    Rust: `use near_sdk::near_bindgen;

#[near_bindgen]
#[derive(Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    pub fn hello_world(&self) -> String {
        "Hello, NEAR!".to_string()
    }
}`,
    JavaScript: `// near-sdk-js hello world (JavaScript)
import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  hello_world() {
    return "Hello, NEAR!";
  }
}

export default Contract;`,
  },
  'storage-basics': {
    Rust: `use near_sdk::{near_bindgen, BorshStorageKey};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    message: String,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            message: "Hello, NEAR storage!".to_string(),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn set_message(&mut self, message: String) {
        self.message = message;
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }
}`,
    JavaScript: `// near-sdk-js storage basics (JavaScript)
import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "Hello, NEAR storage!" }) {
    this.message = message;
  }

  @view({})
  get_message() {
    return this.message;
  }

  @call({})
  set_message({ message }) {
    near.log(\`Updating message to: \${message}\`);
    this.message = message;
  }
}

export default Contract;`,
  },
  'state-management': {
    Rust: `use near_sdk::near_bindgen;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    counter: u64,
}

impl Default for Contract {
    fn default() -> Self {
        Self { counter: 0 }
    }
}

#[near_bindgen]
impl Contract {
    pub fn increment(&mut self) {
        self.counter += 1;
    }

    pub fn get_counter(&self) -> u64 {
        self.counter
    }
}`,
    JavaScript: `// near-sdk-js state management (JavaScript)
import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter } = { counter: 0 }) {
    this.counter = counter;
  }

  @view({})
  get_counter() {
    return this.counter;
  }

  @call({})
  increment() {
    this.counter += 1;
  }
}

export default Contract;`,
  },
  'contract-structure': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    owner_id: AccountId,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            owner_id: env::current_account_id(),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }
}`,
    JavaScript: `// near-sdk-js contract structure (JavaScript)
import { NearBindgen, view, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id } = { owner_id: near.currentAccountId() }) {
    this.owner_id = owner_id;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }
}

export default Contract;`,
  },
  'view-methods': {
    Rust: `use near_sdk::near_bindgen;

#[near_bindgen]
#[derive(Default)]
pub struct Contract {
    greeting: String,
}

#[near_bindgen]
impl Contract {
    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }

    pub fn get_greeting_length(&self) -> u64 {
        self.greeting.len() as u64
    }
}`,
    JavaScript: `// near-sdk-js view methods (JavaScript)
import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ greeting } = { greeting: "hello" }) {
    this.greeting = greeting;
  }

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @view({})
  get_greeting_length() {
    return this.greeting.length;
  }
}

export default Contract;`,
  },
  'change-methods': {
    Rust: `use near_sdk::near_bindgen;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    greeting: String,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            greeting: "hello".to_string(),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn set_greeting(&mut self, greeting: String) {
        self.greeting = greeting;
    }

    pub fn append_suffix(&mut self, suffix: String) {
        self.greeting.push_str(&suffix);
    }
}`,
    JavaScript: `// near-sdk-js change methods (JavaScript)
import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ greeting } = { greeting: "hello" }) {
    this.greeting = greeting;
  }

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @call({})
  set_greeting({ greeting }) {
    near.log(\`Setting greeting to \${greeting}\`);
    this.greeting = greeting;
  }

  @call({})
  append_suffix({ suffix }) {
    this.greeting = this.greeting + suffix;
  }
}

export default Contract;`,
  },
  events: {
    Rust: `use near_sdk::{near_bindgen, env};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    message: String,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            message: "initial".to_string(),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn set_message(&mut self, message: String) {
        env::log_str(&format!("EVENT_JSON:{{\"event\":\"MessageUpdated\",\"new_message\":\"{}\"}}", message));
        self.message = message;
    }
}`,
    JavaScript: `// near-sdk-js events (JavaScript) using structured logs
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "initial" }) {
    this.message = message;
  }

  @call({})
  set_message({ message }) {
    near.log(
      JSON.stringify({
        event: "MessageUpdated",
        new_message: message,
      }),
    );
    this.message = message;
  }
}

export default Contract;`,
  },
  errors: {
    Rust: `use near_sdk::{near_bindgen, env};

#[near_bindgen]
#[derive(Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    pub fn assert_positive(&self, value: i64) {
        if value <= 0 {
            env::panic_str("VALUE_MUST_BE_POSITIVE");
        }
    }

    pub fn assert_owner(&self, account_id: String) {
        assert_eq!(env::current_account_id().to_string(), account_id, "ONLY_OWNER");
    }
}`,
    JavaScript: `// near-sdk-js error handling (JavaScript)
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  assert_positive({ value }) {
    if (value <= 0) {
      near.panic("VALUE_MUST_BE_POSITIVE");
    }
  }

  @call({})
  assert_caller({ expected_account }) {
    if (near.predecessorAccountId() !== expected_account) {
      near.panic("ONLY_EXPECTED_CALLER");
    }
  }
}

export default Contract;`,
  },
  'gas-optimization': {
    Rust: `use near_sdk::near_bindgen;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    // Store only minimal data on-chain to save gas
    counter: u64,
}

impl Default for Contract {
    fn default() -> Self {
        Self { counter: 0 }
    }
}

#[near_bindgen]
impl Contract {
    pub fn bulk_increment(&mut self, times: u32) {
        // Simple loop; in real code you should cap times to avoid out-of-gas
        for _ in 0..times {
            self.counter += 1;
        }
    }

    pub fn get_counter(&self) -> u64 {
        self.counter
    }
}`,
    JavaScript: `// near-sdk-js gas optimization (JavaScript)
import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter } = { counter: 0 }) {
    this.counter = counter;
  }

  @view({})
  get_counter() {
    return this.counter;
  }

  @call({})
  bulk_increment({ times }) {
    // In production, always validate "times" to avoid excessive gas usage
    for (let i = 0; i < times; i += 1) {
      this.counter += 1;
    }
  }
}

export default Contract;`,
  },
  testing: {
    Rust: `use near_sdk::near_bindgen;

#[near_bindgen]
#[derive(Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    pub fn add(&self, a: u64, b: u64) -> u64 {
        a + b
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        let contract = Contract::default();
        assert_eq!(contract.add(2, 3), 5);
    }
}`,
    JavaScript: `// near-sdk-js testing example (JavaScript)
// Contract code
import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  add({ a, b }) {
    return a + b;
  }
}

export default Contract;`,
  },
}

