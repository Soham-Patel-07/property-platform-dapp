# API Reference

## Smart Contract Functions

### Escrow.sol

#### list()
Lists a property for sale on the marketplace.

```solidity
function list(
    uint256 _nftID,
    uint256 _purchasePrice,
    uint256 _escrowAmount
) public payable onlySeller
```

**Parameters:**
- `_nftID` (uint256): NFT token ID
- `_purchasePrice` (uint256): Total purchase price in wei
- `_escrowAmount` (uint256): Earnest money amount in wei

**Example Call:**
```javascript
await escrow.connect(seller).list(1, ethers.utils.parseEther("20"), ethers.utils.parseEther("10"))
```

---

#### depositEarnest()
Buyer deposits earnest money to show commitment.

```solidity
function depositEarnest(uint256 _nftID) public payable
```

**Parameters:**
- `_nftID` (uint256): NFT token ID

**Requirements:**
- Property must be listed
- Value must be >= escrow amount

**Example Call:**
```javascript
const escrowAmount = await escrow.escrowAmount(1)
await escrow.connect(buyer).depositEarnest(1, { value: escrowAmount })
```

---

#### updateInspectionStatus()
Inspector updates the property inspection result.

```solidity
function updateInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector
```

**Parameters:**
- `_nftID` (uint256): NFT token ID
- `_passed` (bool): Inspection passed status

**Example Call:**
```javascript
await escrow.connect(inspector).updateInspectionStatus(1, true)
```

---

#### approveSale()
Party approves the sale transaction.

```solidity
function approveSale(uint256 _nftID) public
```

**Parameters:**
- `_nftID` (uint256): NFT token ID

**Example Call:**
```javascript
await escrow.connect(buyer).approveSale(1)
```

---

#### finalizeSale()
Finalizes the sale after all approvals.

```solidity
function finalizeSale(uint256 _nftID) public
```

**Parameters:**
- `_nftID` (uint256): NFT token ID

**Requirements:**
- Property must be listed
- Inspection must be passed
- Buyer, seller, and lender must all approve
- Contract balance must be >= purchase price

**Example Call:**
```javascript
await escrow.connect(seller).finalizeSale(1)
```

---

#### cancelSale()
Cancels the sale and handles refund.

```solidity
function cancelSale(uint256 _nftID) public
```

**Parameters:**
- `_nftID` (uint256): NFT token ID

**Logic:**
- If inspection not passed → refund buyer
- If inspection passed → transfer to seller

---

### RealEstate.sol

#### mint()
Mints a new property NFT.

```solidity
function mint(string memory tokenURI) public returns (uint256)
```

**Parameters:**
- `tokenURI` (string): IPFS URI to metadata JSON

**Returns:**
- `uint256`: Token ID of minted NFT

**Example Call:**
```javascript
await realEstate.connect(seller).mint("https://ipfs.io/ipfs/...")
```

---

#### totalSupply()
Returns total number of properties.

```solidity
function totalSupply() public view returns (uint256)
```

**Example Call:**
```javascript
const count = await realEstate.totalSupply()
```

---

#### tokenURI()
Returns metadata URI for a token.

```solidity
function tokenURI(uint256 tokenId) public view returns (string)
```

---

## Frontend API

### App.js

#### loadBlockchainData()
Initializes blockchain connection and loads properties.

```javascript
const loadBlockchainData = async () => {
    // Creates ethers provider from window.ethereum
    // Loads contract addresses from config.json
    // Fetches property NFTs
    // Sets up event listeners
}
```

**State Updates:**
- `setProvider(provider)`
- `setEscrow(escrowContract)`
- `setAccount(userAddress)`
- `setHomes(propertyArray)`

---

#### togglePop()
Opens property detail modal.

```javascript
const togglePop = (home) => {
    setHome(home)
    setToggle(!toggle)
}
```

---

### Home.js (Property Component)

#### fetchDetails()
Fetches property details from escrow contract.

```javascript
const fetchDetails = async () => {
    const buyer = await escrow.buyer(home.id)
    const seller = await escrow.seller()
    const lender = await escrow.lender()
    const inspector = await escrow.inspector()
    const isListed = await escrow.isListed(home.id)
    // ... etc
}
```

---

#### buyHandler()
Processes property purchase.

```javascript
const buyHandler = async () => {
    const signer = provider.getSigner()
    
    // 1. Deposit earnest money
    const tx1 = await escrow.connect(signer).depositEarnest(home.id, { value: escrowAmount })
    await tx1.wait()
    
    // 2. Approve sale
    const tx2 = await escrow.connect(signer).approveSale(home.id)
    await tx2.wait()
    
    setHasBought(true)
}
```

---

## Config JSON

### Structure

```json
{
    "CHAIN_ID": {
        "realEstate": {
            "address": "0x..."
        },
        "escrow": {
            "address": "0x..."
        }
    }
}
```

### Available Networks

| Chain ID | Network |
|----------|---------|
| 31337 | Hardhat Localhost |
| 1337 | Localhost (alternative) |
| 1 | Ethereum Mainnet |
| 5 | Goerli Testnet |
| 11155111 | Sepolia Testnet |

---

## Metadata Schema

### Property Metadata

```json
{
    "name": "string",
    "address": "string",
    "description": "string",
    "image": "string (URL)",
    "id": "string",
    "attributes": [
        { "trait_type": "Purchase Price", "value": number },
        { "trait_type": "Type of Residence", "value": "string" },
        { "trait_type": "Bed Rooms", "value": number },
        { "trait_type": "Bathrooms", "value": number },
        { "trait_type": "Square Feet", "value": number },
        { "trait_type": "Year Built", "value": number }
    ]
}
```
