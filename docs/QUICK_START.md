# Millow - Quick Start Guide

## What is Millow?

Millow is a blockchain-based real estate platform where you can buy and sell properties using Ethereum smart contracts.

---

## Prerequisites

- MetaMask browser extension
- Node.js installed

---

## Setup in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Blockchain
Open terminal and run:
```bash
npx hardhat node
```
Keep this terminal open!

### Step 3: Deploy Contracts
Open **new** terminal and run:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Step 4: Configure MetaMask
1. Open MetaMask
2. Add Network:
   - Name: `Localhost 8545`
   - RPC: `http://localhost:8545`
   - Chain ID: `31337`
   - Symbol: `ETH`
3. Import Account (optional):
   - Click import
   - Paste private key from Hardhat output (Account #0)

### Step 5: Run App
```bash
npm start
```

---

## How to Use

### Browse Properties
- Properties appear as cards on the main page
- Each shows: image, price, beds, baths, sqft
- Click any property to see details

### Connect Wallet
- Click "Connect" in top navigation
- Approve MetaMask request
- Your address appears when connected

### Buy a Property
1. Connect wallet
2. Click on property
3. Click "Buy" button
4. Confirm transaction in MetaMask
5. Wait for confirmation

---

## Troubleshooting Quick Fix

| Problem | Solution |
|---------|----------|
| No properties show | Check Hardhat node is running |
| Can't buy | Connect MetaMask first |
| Images broken | Refresh page |
| MetaMask not connecting | Refresh and try again |

---

## Key Files

| File | Purpose |
|------|---------|
| `contracts/Escrow.sol` | Smart contract |
| `src/App.js` | Main frontend |
| `src/config.json` | Contract addresses |
| `docs/` | Full documentation |

---

## Need More Help?

See these docs:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed setup
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [SMART_CONTRACTS.md](./SMART_CONTRACTS.md) - Contract details
