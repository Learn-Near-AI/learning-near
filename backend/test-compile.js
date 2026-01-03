import http from 'http'

const testRustCode = `use near_sdk::near_bindgen;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::PanicOnDefault;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    value: u64,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(initial_value: u64) -> Self {
        Self {
            value: initial_value,
        }
    }
    
    pub fn get_value(&self) -> u64 {
        self.value
    }
    
    pub fn set_value(&mut self, new_value: u64) {
        self.value = new_value;
    }
}`

function testCompilation() {
  const postData = JSON.stringify({
    code: testRustCode,
    language: 'Rust'
  })

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/compile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  console.log('🚀 Testing Rust contract compilation...\n')
  console.log('Contract code:')
  console.log(testRustCode.substring(0, 100) + '...\n')
  
  const req = http.request(options, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      console.log(`📊 Response Status: ${res.statusCode}\n`)
      try {
        const result = JSON.parse(data)
        
        if (result.success) {
          console.log('✅ Compilation SUCCESSFUL!\n')
          console.log(`⏱️  Compilation time: ${result.compilation_time?.toFixed(2)}s`)
          console.log(`📦 WASM size: ${result.size} bytes`)
          console.log(`📄 ABI: ${result.abi ? 'Generated' : 'Not found'}`)
          if (result.stdout) {
            console.log(`\n📤 Stdout:\n${result.stdout.substring(0, 500)}`)
          }
        } else {
          console.log('❌ Compilation FAILED\n')
          console.log(`Exit code: ${result.exit_code}`)
          if (result.stderr) {
            console.log(`\n📤 Stderr:\n${result.stderr}`)
          }
          if (result.error) {
            console.log(`\n❌ Error: ${result.error}`)
          }
        }
      } catch (e) {
        console.log('Raw response:', data.substring(0, 500))
        process.exit(1)
      }
      const success = result?.success || false
      process.exit(success ? 0 : 1)
    })
  })

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message)
    process.exit(1)
  })

  req.write(postData)
  req.end()
}

// Wait for server to start
setTimeout(() => {
  testCompilation()
}, 3000)

