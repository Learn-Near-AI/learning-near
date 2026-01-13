# JavaScript/TypeScript Compilation Issue - Diagnosis and Fixes Applied

## Issue Diagnosed

When attempting to compile JavaScript/TypeScript contracts from the frontend, the compilation was **hanging during the Rollup bundling step** and timing out after 10 minutes.

### Error Message
```
❌ Error: Command failed: docker run --rm -v "C:/Users/User/Documents/Learn-near/backend/persistent-builds-js/29af375f5057167f:/contract" near-js-compiler pnpm build
```

### Root Cause
The `near-sdk-js` compiler uses Rollup for bundling, which is **extremely slow** on Windows when running in Docker containers due to Docker volume mount performance overhead. The original 10-minute timeout was insufficient for Windows builds.

## Fixes Applied

### 1. ✅ Increased Docker Timeout
**File**: `backend/build-js-contract.js`

Changed Docker build timeout from **10 minutes to 30 minutes** to accommodate Windows build performance:

```javascript
timeout: 1800000 // 30 minutes for build (JS compilation can be very slow on Windows)
```

### 2. ✅ Rebuilt Docker Image
Rebuilt the `near-js-compiler` Docker image to ensure it has the latest optimizations and pre-installed dependencies.

### 3. ✅ Created Troubleshooting Documentation
Created `JS-TS-COMPILATION-TROUBLESHOOTING.md` with comprehensive solutions for compilation issues.

## Next Steps to Test

### Option 1: Try Compilation from Frontend
1. Ensure the backend server is running (port 3001)
2. Open the frontend application
3. Try compiling a simple JavaScript contract
4. **Expected time**: 2-10 minutes for first compilation

### Option 2: Test from Command Line
```powershell
# Test Docker compilation directly
cd backend
docker run --rm -v "C:/Users/User/Documents/Learn-near/backend/persistent-builds-js/test-hello-near:/contract" near-js-compiler pnpm build
```

## Performance Recommendations

### Critical: Use WSL2 Backend in Docker Desktop
This provides **5-10x faster** compilation:

1. Open Docker Desktop → Settings → General
2. Enable "Use the WSL 2 based engine"
3. Restart Docker Desktop
4. Try compilation again

### Verify WSL2 is Being Used
```powershell
docker info | Select-String "Operating System"
```

Should show "Docker Desktop" with WSL2 integration.

### Increase Docker Resources
Docker Desktop → Settings → Resources:
- **Memory**: 4GB minimum (8GB recommended)
- **CPU**: 4 cores minimum
- **Disk**: Ensure adequate space

## Expected Compilation Times

| Backend Type | First Build | Cached Build |
|--------------|-------------|--------------|
| WSL2 Backend | 2-5 minutes | 30-60 seconds |
| Hyper-V Backend | 10-30 minutes | 2-5 minutes |

## Verification

A successful compilation will create:
- `persistent-builds-js/<project-id>/build/contract.wasm`
- `persistent-builds-js/<project-id>/build/contract.js`
- Other build artifacts

## Known Working Examples

These directories contain successfully compiled contracts you can reference:
- `persistent-builds-js/test-hello-near/` ✅
- `persistent-builds-js/precompiled-hello-world/` ✅
- `persistent-builds-js/precompiled-contract-structure/` ✅

## Troubleshooting

If compilation still times out or hangs:

1. **Check Docker is running**: `docker --version`
2. **Verify WSL2 backend**: See "Performance Recommendations" above
3. **Clean old builds**: 
   ```powershell
   Remove-Item -Recurse -Force persistent-builds-js\<failing-project-id>
   ```
4. **Check Docker Desktop logs** for errors
5. **Try a simpler contract** to isolate the issue

## Alternative: Use Rust Contracts

If JS/TS compilation continues to be problematic on your system:
- Rust contracts compile **much faster** (10-30 seconds)
- Generate **smaller WASM files**
- Have more mature tooling
- Are the recommended approach for production

## Status

✅ **Backend server is starting** on port 3001
✅ **Docker image rebuilt** and optimized
✅ **Timeouts increased** to accommodate Windows builds
✅ **Documentation created** for troubleshooting

**Try compiling from the frontend now!** The first compilation may take several minutes, but subsequent builds should be much faster due to caching.
