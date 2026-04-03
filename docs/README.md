# Millow - Blockchain Real Estate Platform

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.17-blue" alt="Solidity">
  <img src="https://img.shields.io/badge/React-18.2.0-blue" alt="React">
  <img src="https://img.shields.io/badge/Hardhat-2.12.0-blue" alt="Hardhat">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---

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

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [User Roles](#user-roles)
- [Troubleshooting](#troubleshooting)

---

## Overview

Millow is a blockchain-based real estate application that facilitates property transactions through escrow smart contracts. The platform uses NFT representation for properties and handles the entire buying/selling process securely on the blockchain.

## Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React.js, ethers.js
- **Blockchain**: Ethereum, Hardhat Local Network
- **Wallet**: MetaMask

## Project Structure

```
millow/
├── contracts/
│   ├── Escrow.sol        # Escrow smart contract
│   └── RealEstate.sol    # NFT contract for properties
├── scripts/
│   └── deploy.js         # Deployment script
├── src/
│   ├── abis/             # Compiled contract ABIs
│   ├── assets/           # Images and icons
│   ├── components/       # React components
│   │   ├── Home.js       # Property details modal
│   │   ├── Navigation.js # Navigation bar
│   │   └── Search.js     # Search component
│   ├── config.json       # Contract addresses
│   ├── metadata/         # Property metadata (local)
│   ├── App.js            # Main app component
│   └── index.js          # React entry point
├── hardhat.config.js     # Hardhat configuration
├── package.json          # Dependencies
└── README.md            # This file
```

---

## Smart Contracts

### RealEstate.sol
ERC-721 NFT contract that represents properties as tokens.

**Features:**
- Mint new property NFTs
- Token URI for metadata
- Transfer ownership

### Escrow.sol
Handles the escrow process for property transactions.

**Features:**
- Property listing
- Earnest money deposit
- Inspection approval
- Lender financing
- Sale finalization
- Cancellation handling

---

## Frontend

### Components

1. **Navigation**: Connect wallet, navigation links
2. **Search**: Property search bar
3. **Home**: Property listing cards with details
4. **Property Modal**: Individual property details and buy/sell buttons

### Data Flow

1. App loads → Connects to MetaMask
2. Checks network → Loads contract addresses from config.json
3. Fetches property NFTs from RealEstate contract
4. Displays properties with metadata
5. User clicks property → Opens detail modal
6. User connects wallet → Can buy/sell

---

## Getting Started

### Prerequisites

- Node.js (v14+)
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

### Run Frontend

```bash
npm start
```

### Configure MetaMask

1. Open MetaMask
2. Add Network:
   - Network Name: Localhost 8545
   - New RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
3. Import Account: Copy account address from Hardhat node output

---

## How It Works

### Buying a Property

1. User connects wallet
2. Clicks on property card
3. Clicks "Buy" button
4. MetaMask prompts for:
   - Earnest money deposit (escrow amount)
   - Transaction approval
5. Buyer deposits earnest money and approves
6. Inspector approves inspection status
7. Lender approves and provides financing
8. Seller approves and finalizes sale
9. NFT transfers to buyer, funds transfer to seller

### Selling a Property

1. Seller lists property (done via deploy script)
2. Property appears on marketplace
3. Buyer completes purchase process
4. Seller approves and finalizes
5. Receives payment in ETH

---

## User Roles

| Role | Description | Actions |
|------|-------------|---------|
| Buyer | Purchases property | Deposit earnest, approve sale |
| Seller | Lists property | Approve & finalize sale |
| Inspector | Verifies property condition | Approve inspection |
| Lender | Provides financing | Approve & lend funds |

---

## Configuration

### config.json

Contract addresses for different networks:

```json
{
    "31337": {
        "realEstate": { "address": "0x..." },
        "escrow": { "address": "0x..." }
    }
}
```

### Property Metadata

Located in `src/metadata/`:
- 1.json to 6.json for 6 sample properties
- Contains: name, address, description, image, attributes

---

## Troubleshooting

### Properties Not Loading

1. Ensure Hardhat node is running
2. Check MetaMask is connected to localhost:8545
3. Verify contracts are deployed
4. Check browser console for errors

### Buy Button Not Working

1. Connect MetaMask wallet first
2. Ensure you're on localhost network (Chain ID 31337)
3. Check console for "Please connect to blockchain" message
4. Verify contract addresses in config.json

### Images Not Loading

- IPFS images may not load in development
- Local Unsplash URLs are used as fallback

### MetaMask Connection Issues

1. Refresh the page
2. Disconnect and reconnect MetaMask
3. Check network settings in MetaMask

---

## Contract Addresses (Localhost)

After running deploy.js:
- RealEstate: Check console output
- Escrow: Check console output

Update `src/config.json` with deployed addresses.

---

## License

MIT
