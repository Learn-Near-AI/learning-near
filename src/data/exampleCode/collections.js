// Collections and data structure examples
export const collectionsCode = {
  'storage-keys': {
    Rust: `use near_sdk::{near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize, BorshStorageKey}};
use near_sdk::collections::Vector;

#[derive(BorshStorageKey)]
enum StorageKey {
    Items,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    items: Vector<String>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            items: Vector::new(StorageKey::Items),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn add_item(&mut self, item: String) {
        self.items.push(&item);
    }

    pub fn get_items(&self) -> Vec<String> {
        self.items.iter().collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  get_items() {
    return this.items;
  }

  @call({})
  add_item({ item }) {
    this.items.push(item);
  }
}

export default Contract;`,
  },
  'todo-list': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::Vector;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Todo {
    id: u64,
    title: String,
    completed: bool,
    owner: AccountId,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    todos: Vector<Todo>,
    next_id: u64,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            todos: Vector::new(b"t"),
            next_id: 1,
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn add_todo(&mut self, title: String) {
        require!(title.len() > 0, "Title cannot be empty");
        let todo = Todo {
            id: self.next_id,
            title,
            completed: false,
            owner: env::predecessor_account_id(),
        };
        self.todos.push(&todo);
        self.next_id += 1;
    }

    pub fn get_todos(&self) -> Vec<Todo> {
        self.todos.iter().collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ todos, next_id } = { todos: [], next_id: 1 }) {
    this.todos = todos || [];
    this.next_id = next_id;
  }

  @view({})
  get_todos() {
    return this.todos;
  }

  @call({})
  add_todo({ title }) {
    if (title.length === 0) {
      near.panic("Title cannot be empty");
    }
    const todo = {
      id: this.next_id,
      title,
      completed: false,
      owner: near.predecessorAccountId(),
    };
    this.todos.push(todo);
    this.next_id += 1;
  }
}

export default Contract;`,
  },
  'user-profiles': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Profile {
    name: String,
    bio: String,
    created_at: u64,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    profiles: UnorderedMap<AccountId, Profile>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            profiles: UnorderedMap::new(b"p"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn set_profile(&mut self, name: String, bio: String) {
        let account = env::predecessor_account_id();
        let profile = Profile {
            name,
            bio,
            created_at: env::block_timestamp(),
        };
        self.profiles.insert(&account, &profile);
    }

    pub fn get_profile(&self, account: AccountId) -> Option<Profile> {
        self.profiles.get(&account)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ profiles } = { profiles: {} }) {
    this.profiles = profiles || {};
  }

  @view({})
  get_profile({ account }) {
    return this.profiles[account] || null;
  }

  @call({})
  set_profile({ name, bio }) {
    const account = near.predecessorAccountId();
    this.profiles[account] = {
      name,
      bio,
      created_at: near.blockTimestamp(),
    };
  }
}

export default Contract;`,
  },
  'voting-system': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedSet;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    votes_yes: u64,
    votes_no: u64,
    voters: UnorderedSet<AccountId>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            votes_yes: 0,
            votes_no: 0,
            voters: UnorderedSet::new(b"v"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn vote(&mut self, choice: bool) {
        let voter = env::predecessor_account_id();
        require!(!self.voters.contains(&voter), "Already voted");
        
        self.voters.insert(&voter);
        if choice {
            self.votes_yes += 1;
        } else {
            self.votes_no += 1;
        }
        
        env::log_str(&format!("Vote cast: {}", choice));
    }

    pub fn get_results(&self) -> (u64, u64) {
        (self.votes_yes, self.votes_no)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ votes_yes, votes_no, voters } = {
    votes_yes: 0,
    votes_no: 0,
    voters: []
  }) {
    this.votes_yes = votes_yes;
    this.votes_no = votes_no;
    this.voters = voters || [];
  }

  @view({})
  get_results() {
    return [this.votes_yes, this.votes_no];
  }

  @call({})
  vote({ choice }) {
    const voter = near.predecessorAccountId();
    if (this.voters.includes(voter)) {
      near.panic("Already voted");
    }
    
    this.voters.push(voter);
    if (choice) {
      this.votes_yes += 1;
    } else {
      this.votes_no += 1;
    }
    
    near.log(\`Vote cast: \${choice}\`);
  }
}

export default Contract;`,
  },
}

