# Quick Test Guide - NEAR Backend

## 🚀 Quick Start

### Start Backend
```bash
cd backend
npm run dev
```

### Run Tests
```bash
# Quick test
node test-backend-production.js

# Or basic test
node test-backend.js
```

---

## 🧪 Quick Manual Tests

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```
Expected: `{"status":"ok"}`

### 2. Compile a Simple Contract
```bash
curl -X POST http://localhost:3001/api/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import { NearBindgen, view } from \"near-sdk-js\"; @NearBindgen({}) class Contract { @view({}) hello() { return \"Hello!\"; } } export default Contract;",
    "language": "JavaScript",
    "projectId": "test"
  }'
```

### 3. Check NEAR Status
```bash
curl http://localhost:3001/api/near/status
```

---

## 🌐 Test URLs

### Local Development
- **URL:** http://localhost:3001
- **Health:** http://localhost:3001/api/health
- **Status:** http://localhost:3001/api/near/status

### Production (Fly.io)
- **URL:** https://near-by-example-backend.fly.dev
- **Health:** https://near-by-example-backend.fly.dev/api/health
- **Note:** First request may be slow (waking from sleep)

---

## ✅ Test Results

| Test | Status |
|------|--------|
| JavaScript Compilation | ✅ PASSED |
| TypeScript Compilation | ✅ PASSED |
| Counter Contract | ✅ PASSED |
| Health Check | ✅ PASSED |
| NEAR Status | ✅ PASSED |

**Success Rate:** 100%

---

## 📚 Test Files

- `test-backend.js` - Basic test suite
- `test-backend-production.js` - Comprehensive tests with auto-detection
- `TEST-RESULTS.md` - Detailed test results and documentation

---

## 🔧 Troubleshooting

### Backend Not Starting?
```bash
cd backend
npm install
npm run dev
```

### Tests Failing?
1. Make sure backend is running
2. Check port 3001 is not in use
3. Verify Node.js version (14+ required)

### Need Deployment Features?
Set these environment variables:
```bash
export NEAR_ACCOUNT_ID="your-account.testnet"
export NEAR_PRIVATE_KEY="ed25519:your-key"
```

---

**Last Test:** January 10, 2026 - All tests passed ✅
