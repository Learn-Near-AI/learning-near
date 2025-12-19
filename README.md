# NEAR by Example

An interactive learning platform that teaches NEAR smart contract development through live, executable code examples with AI assistance.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- NEAR Wallet (MyNearWallet - https://testnet.mynearwallet.com/)

### Installation

#### Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start frontend development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start backend server (port 3001)
npm run dev
# or
npm start
```

#### Running Both Separately

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

### Environment Setup

Create a `.env` file (optional, defaults are fine for local dev):

```env
VITE_API_URL=http://localhost:3001
```

## 🛠️ Tech Stack

### Frontend
- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **NEAR Wallet Selector** - Wallet integration (MyNearWallet)

### Backend
- **Express** - Node.js web server
- **near-sdk-js** - NEAR JavaScript/TypeScript SDK
- **esbuild** - Fast JavaScript bundler
- **TypeScript** - Type-safe JavaScript

## 📁 Project Structure

```
├── src/
│   ├── components/      # React components
│   │   ├── ExampleDetail.jsx  # Code editor & execution
│   │   └── ...
│   ├── near/            # NEAR wallet integration
│   │   └── near.js      # Wallet Selector setup
│   ├── data/            # Example data
│   ├── App.jsx          # Main app component
│   └── main.jsx         # React entry point
├── backend/
│   ├── server.js        # Express backend server
│   ├── build-contract.js# Contract compilation utility
│   └── package.json     # Backend dependencies and scripts
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Frontend dependencies and scripts
```

## 🎨 Features

- **Interactive Code Editor** - Edit TypeScript/JavaScript contracts in-browser
- **Compile & Deploy** - Compile contracts and deploy to NEAR TestNet
- **Run Contracts** - Execute contract methods and view results
- **Wallet Integration** - Connect with MyNearWallet (https://testnet.mynearwallet.com/)
- **60+ Examples** - Categorized by difficulty and topic
- **AI Assistant** - Get help understanding code (UI ready)

## 🔧 Compile & Deploy

The platform includes a backend server that compiles TypeScript/JavaScript contracts:

1. **Write Code** - Edit contract code in the editor
2. **Click Run** - Compiles contract and shows results
3. **Click Deploy** - Compiles and deploys to TestNet (requires wallet connection)

**Note:** Full WASM compilation requires `near-sdk-js` CLI. The current setup provides a foundation - full production deployment integration is in progress.

## 🎯 Next Steps

- Complete full WASM compilation pipeline
- Add contract method execution
- Integrate AI assistant API
- Add Rust contract compilation support

## 📝 License

MIT License - See LICENSE file for details

