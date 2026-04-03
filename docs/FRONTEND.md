# Frontend Architecture

## Overview

The Millow frontend is a React.js application that interacts with Ethereum smart contracts via ethers.js.

## File Structure

```
src/
├── App.js                 # Main application component
├── index.js               # React entry point
├── index.css              # Global styles
├── config.json            # Contract addresses
├── abis/
│   ├── RealEstate.json    # NFT contract ABI
│   └── Escrow.json       # Escrow contract ABI
├── components/
│   ├── Home.js            # Property details & buy/sell
│   ├── Navigation.js      # Navigation bar
│   └── Search.js         # Search component
└── metadata/
    ├── 1.json to 6.json  # Property metadata
```

---

## Main Component: App.js

### Purpose
- Initializes blockchain connection
- Loads property data
- Manages global state

### State Variables

```javascript
const [provider, setProvider] = useState(null)      // Web3 provider
const [escrow, setEscrow] = useState(null)            // Escrow contract
const [account, setAccount] = useState(null)         // User wallet address
const [homes, setHomes] = useState([])                // Property list
const [home, setHome] = useState({})                 // Selected property
const [toggle, setToggle] = useState(false)          // Modal visibility
```

### Key Functions

#### loadBlockchainData()
- Connects to MetaMask
- Gets network chain ID
- Loads contract ABIs
- Fetches property NFTs from RealEstate contract
- Sets up account change listeners

#### togglePop(home)
- Opens/closes property detail modal
- Sets selected property

---

## Navigation Component

### Props
- `account` - User's wallet address
- `setAccount` - Function to update account state

### Features
- Navigation links (Buy, Rent, Sell)
- Logo and brand name
- Connect/Disconnect wallet button
- Shows truncated wallet address when connected

### Wallet Connection

```javascript
const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account);
}
```

---

## Home Component (Property Modal)

### Props
- `home` - Property metadata
- `provider` - Web3 provider
- `account` - User's wallet address
- `escrow` - Escrow contract instance
- `togglePop` - Function to close modal

### State Variables

```javascript
const [hasBought, setHasBought] = useState(false)
const [hasLended, setHasLended] = useState(false)
const [hasInspected, setHasInspected] = useState(false)
const [hasSold, setHasSold] = useState(false)
const [buyer, setBuyer] = useState(null)
const [lender, setLender] = useState(null)
const [inspector, setInspector] = useState(null)
const [seller, setSeller] = useState(null)
const [owner, setOwner] = useState(null)
const [isListed, setIsListed] = useState(true)
```

### Key Functions

#### fetchDetails()
- Fetches buyer, seller, lender, inspector addresses
- Gets approval status for each party
- Gets inspection status
- Checks if property is listed

#### fetchOwner()
- Checks if property is still listed
- Gets current owner if sold

#### buyHandler()
- Gets signer from provider
- Calls escrow.depositEarnest() with ETH
- Calls escrow.approveSale()
- Updates state on success

#### inspectHandler()
- Only callable by inspector
- Updates inspection status to passed

#### lendHandler()
- Only callable by lender
- Approves sale
- Sends lending amount to contract

#### sellHandler()
- Only callable by seller
- Approves sale
- Finalizes sale (transfers NFT & funds)

### UI Logic

The button shown depends on the connected account:
- **Inspector** → "Approve Inspection"
- **Lender** → "Approve & Lend"
- **Seller** → "Approve & Sell"
- **Other (Buyer)** → "Buy"

---

## Search Component

A simple search input component for future search functionality.

```javascript
const Search = () => {
    return (
        <header>
            <h2 className="header__title">Search it. Explore it. Buy it.</h2>
            <input
                type="text"
                className="header__search"
                placeholder="Enter an address, neighborhood, city, or ZIP code"
            />
        </header>
    );
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         App.js                              │
├─────────────────────────────────────────────────────────────┤
│  1. User loads page                                         │
│  2. loadBlockchainData() runs                               │
│  3. Connects to MetaMask                                    │
│  4. Loads contract addresses from config.json              │
│  5. Creates contract instances                             │
│  6. Fetches property NFTs                                  │
│  7. Sets homes state                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Property Cards                           │
├─────────────────────────────────────────────────────────────┤
│  Maps through homes array                                   │
│  Displays: image, price, beds, baths, sqft, address         │
│  onClick → togglePop(home)                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Home.js (Modal)                        │
├─────────────────────────────────────────────────────────────┤
│  1. fetchDetails() - Gets contract data                    │
│  2. Renders property info                                  │
│  3. Shows action button based on account role             │
│  4. User clicks Buy → buyHandler()                         │
│  5. Calls escrow contract functions                        │
│  6. MetaMask prompts for transaction                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

### config.json

```json
{
    "31337": {
        "realEstate": {
            "address": "0x..."
        },
        "escrow": {
            "address": "0x..."
        }
    }
}
```

Chain IDs:
- 31337 - Localhost (Hardhat)
- 1337 - Localhost alternative
- 1 - Ethereum Mainnet
- 5 - Goerli Testnet
- 11155111 - Sepolia Testnet

---

## Property Metadata

### Structure

```json
{
    "name": "Property Name",
    "address": "Full Address",
    "description": "Property description",
    "image": "Image URL",
    "id": "1",
    "attributes": [
        { "trait_type": "Purchase Price", "value": 20 },
        { "trait_type": "Type of Residence", "value": "Condo" },
        { "trait_type": "Bed Rooms", "value": 2 },
        { "trait_type": "Bathrooms", "value": 3 },
        { "trait_type": "Square Feet", "value": 2200 },
        { "trait_type": "Year Built", "value": 2013 }
    ]
}
```

### Local Metadata

Stored in `src/metadata/` for development fallback when blockchain is not available.

---

## State Management

The app uses React useState hooks for state management:

1. **App level** - Global state (provider, escrow, account, homes)
2. **Component level** - Local UI state (toggle, home selection)

---

## Error Handling

### try-catch in buyHandler()

```javascript
try {
    const signer = provider.getSigner()
    const tx = await escrow.connect(signer).depositEarnest(home.id, { value: escrowAmount })
    await tx.wait()
    setHasBought(true)
} catch (error) {
    console.error("Buy error:", error)
    alert("Transaction failed: " + error.message)
}
```

### Fallback to Local Metadata

If blockchain fails to load, the app falls back to local metadata:

```javascript
} catch (error) {
    console.log('Using local metadata for development')
    setHomes(localMetadata)
}
```

---

## Styling

CSS files (not shown) handle the visual presentation:
- Responsive grid for property cards
- Modal styling for property details
- Navigation styling
- Button states and hover effects
