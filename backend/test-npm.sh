#!/bin/bash
mkdir -p /tmp/test-npm-install
cd /tmp/test-npm-install
cat > package.json << 'EOF'
{
  "name": "test",
  "version": "1.0.0",
  "type": "module"
}
EOF
npm install near-sdk-js@2.0.0 --legacy-peer-deps --no-audit --no-fund 2>&1
echo "Exit code: $?"
