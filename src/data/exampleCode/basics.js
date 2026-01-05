// Basic examples code - Foundation to Intermediate
export const basicsCode = {
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
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  hello_world() {
    return "Hello, NEAR!";
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
    JavaScript: `import { NearBindgen, view, near } from "near-sdk-js";

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
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

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
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

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
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

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
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

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
  'input-validation': {
    Rust: `use near_sdk::{near_bindgen, env, require};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    message: String,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            message: String::new(),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn set_message(&mut self, message: String) {
        require!(message.len() > 0, "Message cannot be empty");
        require!(message.len() <= 100, "Message too long (max 100 chars)");
        self.message = message;
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "" }) {
    this.message = message;
  }

  @view({})
  get_message() {
    return this.message;
  }

  @call({})
  set_message({ message }) {
    if (message.length === 0) {
      near.panic("Message cannot be empty");
    }
    if (message.length > 100) {
      near.panic("Message too long (max 100 chars)");
    }
    this.message = message;
  }
}

export default Contract;`,
  },
  'access-control': {
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
    pub fn set_owner(&mut self, new_owner: AccountId) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can change owner"
        );
        self.owner_id = new_owner;
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id } = { owner_id: near.currentAccountId() }) {
    this.owner_id = owner_id;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }

  @call({})
  set_owner({ new_owner }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can change owner");
    }
    this.owner_id = new_owner;
  }
}

export default Contract;`,
  },
  'error-handling': {
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
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  assert_positive({ value }) {
    if (value <= 0) {
      near.panic("VALUE_MUST_BE_POSITIVE");
    }
  }

  @call({})
  assert_owner({ account_id }) {
    if (near.currentAccountId() !== account_id) {
      near.panic("ONLY_OWNER");
    }
  }
}

export default Contract;`,
  },
  'events': {
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
        env::log_str(&format!("EVENT_JSON:{{\\\"event\\\":\\\"MessageUpdated\\\",\\\"new_message\\\":\\\"{}\\\"}}", message));
        self.message = message;
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

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
  'collections-vector': {
    Rust: `use near_sdk::{near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::Vector;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    items: Vector<String>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            items: Vector::new(b"i"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn add_item(&mut self, item: String) {
        self.items.push(&item);
    }

    pub fn get_item(&self, index: u64) -> Option<String> {
        self.items.get(index)
    }

    pub fn get_items_count(&self) -> u64 {
        self.items.len()
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  get_item({ index }) {
    return this.items[index] || null;
  }

  @view({})
  get_items_count() {
    return this.items.length;
  }

  @call({})
  add_item({ item }) {
    this.items.push(item);
  }
}

export default Contract;`,
  },
  'collections-map': {
    Rust: `use near_sdk::{near_bindgen, AccountId, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    balances: UnorderedMap<AccountId, u64>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            balances: UnorderedMap::new(b"b"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn set_balance(&mut self, account: AccountId, amount: u64) {
        self.balances.insert(&account, &amount);
    }

    pub fn get_balance(&self, account: AccountId) -> Option<u64> {
        self.balances.get(&account)
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ balances } = { balances: {} }) {
    this.balances = balances || {};
  }

  @view({})
  get_balance({ account }) {
    return this.balances[account] || 0;
  }

  @call({})
  set_balance({ account, amount }) {
    this.balances[account] = amount;
  }
}

export default Contract;`,
  },
}

