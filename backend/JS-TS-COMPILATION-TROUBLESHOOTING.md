# JavaScript/TypeScript Compilation Troubleshooting

## Common Issue: Compilation Hanging

### Symptoms
- Compilation starts but never completes
- Gets stuck at "Creating src/contract.js file with Rollup..." 
- Eventually times out with error: `Command failed: docker run...`
- No `contract.wasm` file generated in the build directory

### Root Cause
The `near-sdk-js` compiler uses Rollup for bundling, which can be **very slow** on Windows when running inside Docker containers due to:
1. Docker volume mount performance issues on Windows
2. Windows path length limitations
3. File system translation overhead between Windows and Linux containers

### Solutions

#### Solution 1: Ensure Docker Desktop Uses WSL2 Backend (Recommended)

WSL2 provides significantly better performance than the legacy Hyper-V backend.

1. Open Docker Desktop settings
2. Go to **General**
3. Ensure "Use the WSL 2 based engine" is **checked**
4. Go to **Resources** → **WSL Integration**
5. Enable integration with your WSL distributions
6. Restart Docker Desktop

This can improve compilation speed by **5-10x**.

#### Solution 2: Use Precompiled Examples

Many examples in the app have pre-built WASM files that were compiled successfully:
- Check `persistent-builds-js/precompiled-*` directories
- These contain working examples you can reference

#### Solution 3: Increase System Resources

In Docker Desktop settings:
- **Memory**: Increase to at least 4GB (8GB recommended)
- **CPU**: Allocate at least 4 CPUs
- **Disk**: Ensure sufficient space

#### Solution 4: Clean Up Old Builds

Old build directories with corrupted node_modules can cause issues:

```powershell
# Clean all builds (WARNING: removes all cached builds)
cd backend
Remove-Item -Recurse -Force persistent-builds-js\*
```

#### Solution 5: Try Compiling Simple Contracts First

Start with a simple contract to verify the setup works:

```javascript
import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class SimpleContract {
  @view({})
  hello() {
    return "Hello!";
  }
}
```

### Expected Compilation Times

On Windows with Docker Desktop (WSL2 backend):
- **First compilation**: 2-10 minutes (installs dependencies)
- **Subsequent compilations**: 30-120 seconds (uses cached dependencies)
- **With Hyper-V backend**: Can take 20-30 minutes or hang indefinitely

### Verification

To verify a successful compilation:

```powershell
cd backend
# Check if WASM file was created
Test-Path "persistent-builds-js\<project-id>\build\contract.wasm"
```

### Alternative: Use Rust Instead

If JavaScript/TypeScript compilation continues to have issues, consider using Rust contracts instead:
- Much faster compilation (10-30 seconds)
- Better optimization (smaller WASM files)
- More mature tooling

## Additional Notes

- The backend automatically caches builds based on code hash
- If code hasn't changed, it will reuse the existing WASM file
- Timeout has been increased to 30 minutes to accommodate slow Windows builds
- The Docker image pre-installs `near-sdk-js` dependencies to speed up builds

## Getting Help

If compilation still fails after trying these solutions:
1. Check Docker Desktop logs
2. Ensure Docker Desktop is running and updated to the latest version
3. Try restarting Docker Desktop
4. Check Windows Defender or antivirus isn't blocking Docker volume mounts
