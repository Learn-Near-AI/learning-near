#!/bin/bash
cd /tmp
rm -rf test-near
mkdir -p test-near/src
cd test-near

cat > src/contract.js << 'EOF'
import { NearBindgen, view } from 'near-sdk-js';

@NearBindgen({})
export class Test {
  @view({})
  hello() {
    return 'hi';
  }
}
EOF

echo '{"name":"test","version":"1.0.0","type":"module"}' > package.json

cp -r /mnt/c/Users/User/Documents/Learn-near/backend/node_modules/near-sdk-js node_modules/ 2>/dev/null
cp -r /mnt/c/Users/User/Documents/Learn-near/backend/node_modules/.bin node_modules/ 2>/dev/null

npx near-sdk-js build src/contract.js build/contract.wasm 2>&1
