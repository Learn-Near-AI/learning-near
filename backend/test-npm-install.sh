#!/bin/bash
cd /tmp
rm -rf near-builds
mkdir -p near-builds/contract-template/src near-builds/contract-template/build
cd near-builds/contract-template
cat > package.json << 'EOF'
{
  "name": "test",
  "version": "1.0.0",
  "type": "module"
}
EOF
npm install near-sdk-js@2.0.0 --legacy-peer-deps --no-audit --no-fund 2>&1
