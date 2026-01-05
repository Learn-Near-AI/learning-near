// Advanced patterns and testing examples
export const advancedCode = {
  'testing': {
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
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  add({ a, b }) {
    return a + b;
  }
}

export default Contract;`,
  },
  'panic-handling': {
    Rust: `use near_sdk::{near_bindgen, env, require};

#[near_bindgen]
#[derive(Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        if b == 0 {
            env::panic_str("Division by zero");
        }
        Some(a / b)
    }

    pub fn assert_positive(&self, value: i64) {
        require!(value > 0, "Value must be positive");
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  safe_divide({ a, b }) {
    if (b === 0) {
      near.panic("Division by zero");
    }
    return a / b;
  }

  @call({})
  assert_positive({ value }) {
    if (value <= 0) {
      near.panic("Value must be positive");
    }
  }
}

export default Contract;`,
  },
  'event-patterns': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, borsh::{self, BorshDeserialize, BorshSerialize}};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    balance: u64,
}

impl Default for Contract {
    fn default() -> Self {
        Self { balance: 0 }
    }
}

#[near_bindgen]
impl Contract {
    pub fn deposit(&mut self, amount: u64) {
        self.balance += amount;
        env::log_str(&format!(
            "EVENT_JSON:{{\\\"event\\\":\\\"Deposit\\\",\\\"account\\\":\\\"{}\\\",\\\"amount\\\":{}}}",
            env::predecessor_account_id(),
            amount
        ));
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ balance } = { balance: 0 }) {
    this.balance = balance;
  }

  @view({})
  get_balance() {
    return this.balance;
  }

  @call({})
  deposit({ amount }) {
    this.balance += amount;
    near.log(
      JSON.stringify({
        event: "Deposit",
        account: near.predecessorAccountId(),
        amount,
      })
    );
  }
}

export default Contract;`,
  },
  'initialization': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, borsh::{self, BorshDeserialize, BorshSerialize}};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    owner_id: AccountId,
    initialized: bool,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
            initialized: true,
        }
    }
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            owner_id: env::current_account_id(),
            initialized: false,
        }
    }
}`,
    JavaScript: `import { NearBindgen, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, initialized } = {}) {
    if (near.isInitialized()) {
      this.owner_id = owner_id || near.currentAccountId();
      this.initialized = initialized !== undefined ? initialized : true;
    } else {
      this.owner_id = owner_id || near.currentAccountId();
      this.initialized = true;
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
  bulk_increment({ times }) {
    // In production, always validate "times" to avoid excessive gas usage
    for (let i = 0; i < times; i += 1) {
      this.counter += 1;
    }
  }
}

export default Contract;`,
  },
  'complete-example': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Task {
    id: u64,
    title: String,
    completed: bool,
    owner: AccountId,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    owner_id: AccountId,
    tasks: UnorderedMap<u64, Task>,
    next_id: u64,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            owner_id: env::current_account_id(),
            tasks: UnorderedMap::new(b"t"),
            next_id: 1,
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn add_task(&mut self, title: String) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can add tasks"
        );
        require!(title.len() > 0, "Title cannot be empty");
        
        let task = Task {
            id: self.next_id,
            title,
            completed: false,
            owner: self.owner_id.clone(),
        };
        self.tasks.insert(&self.next_id, &task);
        self.next_id += 1;
        
        env::log_str(&format!("Task {} added", task.id));
    }

    pub fn get_task(&self, id: u64) -> Option<Task> {
        self.tasks.get(&id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, tasks, next_id } = {
    owner_id: near.currentAccountId(),
    tasks: {},
    next_id: 1
  }) {
    this.owner_id = owner_id;
    this.tasks = tasks || {};
    this.next_id = next_id;
  }

  @view({})
  get_task({ id }) {
    return this.tasks[id] || null;
  }

  @call({})
  add_task({ title }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can add tasks");
    }
    if (title.length === 0) {
      near.panic("Title cannot be empty");
    }
    
    const task = {
      id: this.next_id,
      title,
      completed: false,
      owner: this.owner_id,
    };
    this.tasks[this.next_id] = task;
    this.next_id += 1;
    
    near.log(\`Task \${task.id} added\`);
  }
}

export default Contract;`,
  },
}

