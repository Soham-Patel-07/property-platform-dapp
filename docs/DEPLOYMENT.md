# Deployment Guide

This guide covers how to deploy Millow smart contracts and run the application locally.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension
- Terminal/Command Prompt

---

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- hardhat - Ethereum development environment
- @openzeppelin/contracts - Smart contract libraries
- ethers.js - Ethereum JavaScript library
- react & react-scripts - Frontend framework

---

## Step 2: Start Local Blockchain

Open a new terminal and run:

```bash
npx hardhat node
```

This starts a local Ethereum node with 20 accounts. Each account has 100 ETH for testing.

**Important**: Keep this terminal running while developing.

**Sample Output:**
```
Started HTTP and WebSocket URLs:
- http://127.0.0.1:8545
- ws://127.0.0.1:8545

Chain ID: 31337

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (100 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (100 ETH)
...
```

---

## Step 3: Deploy Contracts

Open a **new terminal** (keep Hardhat node running) and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**
```
Deployed Real Estate Contract at: 0x...
Minting 3 properties...
Deployed Escrow Contract at: 0x...
Listing 3 properties...
Finished.
```

**Note**: Copy the deployed contract addresses shown in the output.

---

## Step 4: Update Configuration

After deployment, update `src/config.json` with the new addresses:

```json
{
    "31337": {
        "realEstate": {
            "address": "<RealEstate_Contract_Address>"
        },
        "escrow": {
            "address": "<Escrow_Contract_Address>"
        }
    }
}
```

---

## Step 5: Configure MetaMask

### Add Local Network

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Fill in:
   - **Network Name**: Localhost 8545
   - **New RPC URL**: http://localhost:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

### Import Test Account

1. Click account icon → "Import Account"
2. Copy private key from Hardhat node output (Account #0)
3. Paste and click "Import"

Now you have test ETH to use.

---

## Step 6: Run Frontend

```bash
npm start
```

This opens http://localhost:3000 in your browser.

---

## Step 7: Test Buying a Property

1. Click "Connect" in the navigation to connect MetaMask
2. Click on a property card
3. Click "Buy" button
4. MetaMask will prompt for:
   - Transaction 1: Approve (for NFT transfer)
   - Transaction 2: Deposit earnest money
5. Confirm both transactions
6. Wait for transactions to complete

---

## Network Configuration

### Localhost (Development)

```json
{
    "31337": {
        "realEstate": { "address": "0x..." },
        "escrow": { "address": "0x..." }
    }
}
```

### Ethereum Mainnet

```json
{
    "1": {
        "realEstate": { "address": "0x..." },
        "escrow": { "address": "0x..." }
    }
}
```

### Goerli Testnet

```json
{
    "5": {
        "realEstate": { "address": "0x..." },
        "escrow": { "address": "0x..." }
    }
}
```

### Sepolia Testnet

```json
{
    "11155111": {
        "realEstate": { "address": "0x..." },
        "escrow": { "address": "0x..." }
    }
}
```

---

## Deploying to Testnet

### 1. Get Testnet ETH

- Goerli: https://goerli-faucet.slock.it
- Sepolia: https://faucet.sepolia.org

### 2. Configure MetaMask

Switch to Goerli or Sepolia network in MetaMask.

### 3. Deploy

```bash
npx hardhat run scripts/deploy.js --network goerli
# or
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Update Config

Update `src/config.json` with deployed addresses.

---

## Deploying to Mainnet

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

**Warning**: This costs real ETH. Make sure to verify all transactions.

---

## Verifying Deployment

After deployment, verify:

1. ✅ Properties appear on the page
2. ✅ Property images load
3. ✅ "Buy" button appears when connected
4. ✅ MetaMask prompts for transaction

---

## Troubleshooting

### "Properties not loading"
- Ensure Hardhat node is running
- Check MetaMask is connected to localhost:8545
- Check contract addresses in config.json

### "Buy button not working"
- Connect MetaMask wallet first
- Check browser console for errors

### "MetaMask not connecting"
- Refresh the page
- Check MetaMask extension is working

### "Insufficient funds"
- Import test account from Hardhat node
- Get more test ETH from faucet
