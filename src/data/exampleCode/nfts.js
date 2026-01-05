// NFT examples
export const nftsCode = {
  'nft-transfer': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    token_id: String,
    owner_id: AccountId,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn transfer(&mut self, token_id: String, receiver_id: AccountId) {
        let mut token = self.tokens.get(&token_id).expect("Token not found");
        require!(
            token.owner_id == env::predecessor_account_id(),
            "Only owner can transfer"
        );
        token.owner_id = receiver_id.clone();
        self.tokens.insert(&token_id, &token);
        
        env::log_str(&format!("Transferred token {} to {}", token_id, receiver_id));
    }

    pub fn get_token(&self, token_id: String) -> Option<Token> {
        self.tokens.get(&token_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ tokens } = { tokens: {} }) {
    this.tokens = tokens || {};
  }

  @view({})
  get_token({ token_id }) {
    return this.tokens[token_id] || null;
  }

  @call({})
  transfer({ token_id, receiver_id }) {
    const token = this.tokens[token_id];
    if (!token) {
      near.panic("Token not found");
    }
    if (token.owner_id !== near.predecessorAccountId()) {
      near.panic("Only owner can transfer");
    }
    token.owner_id = receiver_id;
    this.tokens[token_id] = token;
    
    near.log(\`Transferred token \${token_id} to \${receiver_id}\`);
  }
}

export default Contract;`,
  },
}

