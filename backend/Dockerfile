# Use a base image with both Node.js and Rust (using Rust 1.85+ for near-sdk 5.24.0 support)
FROM rust:1.85-slim as rust-base

# Install curl and other dependencies, then Node.js 20
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install wasm32 target for Rust
RUN rustup target add wasm32-unknown-unknown

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies (including dev dependencies for esbuild and near-sdk-js)
RUN npm install

# Pre-install near-sdk-js for JS/TS compilation caching (speeds up compilation 20-30x)
RUN npm install near-sdk-js@2.0.0 --legacy-peer-deps

# Install NEAR CLI globally
RUN npm install -g near-cli

# Install additional build tools needed for near-sdk-js compilation
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy backend source code
COPY . .

# Create necessary directories for builds, caching, and NEAR credentials
RUN mkdir -p temp-builds base-project persistent-builds shared-target /root/.near-credentials

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server.js"]

