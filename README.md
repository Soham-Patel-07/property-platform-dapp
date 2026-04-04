# Millow - Blockchain Real Estate Platform

Millow is a decentralized real estate marketplace built on the Ethereum blockchain, allowing users to buy and sell properties securely via smart contracts.

<!-- <p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.17-blue" alt="Solidity">
  <img src="https://img.shields.io/badge/React-18.2.0-blue" alt="React">
  <img src="https://img.shields.io/badge/Hardhat-2.12.0-blue" alt="Hardhat">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p> -->


## About The Project

Millow is a decentralized real estate marketplace built on the Ethereum blockchain that enables users to buy and sell properties using smart contracts. This project was developed as part of my Bachelor of Engineering in Computer Engineering (Semester 8) internship at **Advait Solutions**.

### Internship Details

| Detail | Information |
|--------|-------------|
| **Company** | Advait Solutions |
| **Duration** | January 2023 - April 2023 |
| **Course** | Bachelor of Engineering in Computer Engineering |
| **Semester** | 8th Semester (Final Year) |
| **Project Type** | Internship Major Project |

During my internship at Advait Solutions, I worked on building decentralized applications (DApps) using blockchain technology. Millow was my major project where I implemented a full-stack blockchain real estate platform combining smart contracts with a modern React frontend.



## Features

- ✅ **Property Listings** - Browse properties with images, prices, and details
- ✅ **Smart Contract Escrow** - Secure transaction handling via Ethereum smart contracts
- ✅ **NFT-based Properties** - Properties represented as ERC-721 tokens
- ✅ **MetaMask Integration** - Connect wallet seamlessly
- ✅ **Buy & Sell Flow** - Complete transaction flow with inspection and financing
- ✅ **Local Metadata Fallback** - Works even without deployed contracts



## Tech Stack

### Smart Contracts
- **Solidity** - Smart contract programming language
- **Hardhat** - Ethereum development environment
- **OpenZeppelin** - Smart contract libraries

### Frontend
- **React.js** - User interface framework
- **ethers.js** - Ethereum JavaScript library
- **CSS** - Styling

### Blockchain & Tools
- **Ethereum** - Blockchain platform
- **MetaMask** - Ethereum wallet
- **Hardhat Local Network** - Local blockchain for development



## Project Structure

```
millow/
├── contracts/
│   ├── Escrow.sol          # Escrow smart contract
│   └── RealEstate.sol      # NFT contract for properties
├── scripts/
│   └── deploy.js           # Deployment script
├── test/
│   └── Escrow.js           # Smart contract tests
├── src/
│   ├── abis/               # Compiled contract ABIs
│   │   ├── Escrow.json
│   │   └── RealEstate.json
│   ├── assets/             # Images and icons
│   │   ├── logo.svg
│   │   ├── houses.png
│   │   └── close.svg
│   ├── components/         # React components
│   │   ├── Home.js         # Property details modal
│   │   ├── Navigation.js   # Navigation bar
│   │   └── Search.js       # Search component
│   ├── metadata/           # Property metadata
│   │   ├── 1.json
│   │   ├── 2.json
│   │   ├── 3.json
│   │   ├── 4.json
│   │   ├── 5.json
│   │   └── 6.json
│   ├── config.json         # Contract addresses
│   ├── App.js              # Main app component
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles
│   ├── App.test.js         # React tests
│   ├── setupTests.js       # Test setup
│   └── reportWebVitals.js  # Performance reporting
├── public/                 # Public assets
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   ├── logo192.png
│   ├── logo512.png
│   └── favicon.ico
├── metadata/               # Root metadata files
│   ├── 1.json
│   ├── 2.json
│   └── 3.json
├── docs/                   # Documentation
│   ├── README.md
│   ├── DEPLOYMENT.md
│   ├── SMART_CONTRACTS.md
│   ├── FRONTEND.md
│   ├── API.md
│   ├── TROUBLESHOOTING.md
│   ├── QUICK_START.md
│   ├── ROADMAP.md
│   ├── INDEX.md
│   └── Internship Report SEM 8  Final.pdf
├── Screenshot/            # Application screenshots
│   ├── Property sell and buy web3 application.png
│   ├── Property is available for buy .png
│   └── Property is purchased and ready for sell .png
├── hardhat.config.js       # Hardhat configuration
├── package.json            # Dependencies
├── package-lock.json       # Locked dependencies
├── LICENSE                 # MIT License
└── .gitignore             # Git ignore rules
```



## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension

### Installation

```bash
# Install dependencies
npm install
```

### Start Local Blockchain

```bash
# Terminal 1: Start Hardhat node
npx hardhat node
```

### Deploy Contracts

```bash
# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Configure MetaMask

1. Open MetaMask
2. Add Network:
   - Network Name: `Localhost 8545`
   - New RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
3. Import Account: Copy account address from Hardhat node output

### Run Frontend

```bash
npm start
```

The app will open at `http://localhost:3000`



## How It Works

### Buying a Property

1. User connects wallet via MetaMask
2. Browse properties on the marketplace
3. Click on a property to view details
4. Click "Buy" button
5. MetaMask prompts for transaction:
   - Approve NFT transfer
   - Deposit earnest money
6. Wait for transaction confirmation
7. Property NFT transfers to buyer

### Selling a Property

1. Seller lists property (via deploy script)
2. Property appears on marketplace
3. Buyer completes purchase process
4. Seller approves and finalizes
5. Receives payment in ETH

### Transaction Flow

```
Seller lists Property
       ↓
Property NFT transferred to Escrow Contract
       ↓
Buyer deposits Earnest Money + Approves
       ↓
Inspector approves Inspection Status
       ↓
Lender approves + Provides Financing
       ↓
Seller finalizes Sale
       ↓
NFT → Buyer, Funds → Seller
```



## User Roles

| Role | Description | Actions |
|------|-------------|---------|
| **Buyer** | Purchases property | Deposit earnest, approve sale |
| **Seller** | Lists property | Approve & finalize sale |
| **Inspector** | Verifies property condition | Approve inspection |
| **Lender** | Provides financing | Approve & lend funds |



## Smart Contract Details

### RealEstate.sol
ERC-721 NFT contract that represents properties as tokens.
- Mint new property NFTs
- Token URI for metadata
- Transfer ownership

### Escrow.sol
Handles the escrow process for property transactions.
- Property listing
- Earnest money deposit
- Inspection approval
- Lender financing
- Sale finalization



## Documentation

Detailed documentation available in the `docs/` folder:

| Document | Description |
|----------|-------------|
| [docs/README.md](./docs/README.md) | Full project overview |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Detailed deployment guide |
| [docs/SMART_CONTRACTS.md](./docs/SMART_CONTRACTS.md) | Smart contract details |
| [docs/FRONTEND.md](./docs/FRONTEND.md) | Frontend architecture |
| [docs/API.md](./docs/API.md) | API reference |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common issues & solutions |
| [docs/QUICK_START.md](./docs/QUICK_START.md) | Quick start guide |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Future features |



## Screenshots

### 1. Property Buy and Sell Web3 Application
![Property Buy and Sell Web3 Application](Screenshot/Property%20sell%20and%20buy%20web3%20application.png)

### 2. Property Available for Buy
![Property Available for Buy](Screenshot/Property%20is%20available%20for%20buy%20.png)

### 3. Property Purchased and Ready for Sell
![Property Purchased and Ready for Sell](Screenshot/Property%20is%20purchased%20and%20ready%20for%20sell%20.png)



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Acknowledgments

- **Advait Solutions** - For providing the internship opportunity
- **Hardhat** - For the excellent development framework
- **OpenZeppelin** - For secure smart contract libraries
- **Ethereum Community** - For comprehensive documentation

---

**Note:** This is an academic project built during a **January 2023 to April 2023** in an internship at **Advait Solutions** as part of **BE Computer Engineering** curriculum at **Bhagwan Arihant Institute of Technology - Surat.**
