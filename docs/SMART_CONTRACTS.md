# Smart Contracts

## Overview

Millow uses two main smart contracts:
1. **RealEstate.sol** - ERC-721 NFT contract for property tokens
2. **Escrow.sol** - Manages the transaction escrow process

---

## RealEstate.sol

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstate is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Millow", "MLW") {}

    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
```

### Key Functions

| Function | Description | Visibility |
|----------|-------------|------------|
| mint(string memory tokenURI) | Creates new property NFT | public |
| totalSupply() | Returns total number of properties | public |
| tokenURI(uint256 tokenId) | Returns metadata URI | public |

---

## Escrow.sol

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress;
    address payable public seller;
    address public inspector;
    address public lender;

    // Mappings
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor(
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    function list(uint256 _nftID, uint256 _purchasePrice, uint256 _escrowAmount) 
        public payable onlySeller {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = address(0);
    }

    function depositEarnest(uint256 _nftID) public payable {
        require(isListed[_nftID], "Property not listed");
        require(msg.value >= escrowAmount[_nftID], "Insufficient escrow amount");
        if (buyer[_nftID] == address(0)) {
            buyer[_nftID] = msg.sender;
        }
    }

    function updateInspectionStatus(uint256 _nftID, bool _passed) 
        public onlyInspector {
        inspectionPassed[_nftID] = _passed;
    }

    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;
    }

    function finalizeSale(uint256 _nftID) public {
        require(isListed[_nftID], "Property not listed");
        require(inspectionPassed[_nftID], "Inspection not passed");
        require(approval[_nftID][buyer[_nftID]], "Buyer not approved");
        require(approval[_nftID][seller], "Seller not approved");
        require(approval[_nftID][lender], "Lender not approved");
        require(address(this).balance >= purchasePrice[_nftID], "Insufficient funds");

        isListed[_nftID] = false;
        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
    }

    receive() external payable {}
}
```

### Key Functions

| Function | Description | Modifier |
|----------|-------------|----------|
| list() | Lists property for sale | onlySeller |
| depositEarnest() | Buyer deposits earnest money | - |
| updateInspectionStatus() | Inspector updates status | onlyInspector |
| approveSale() | Approves the sale | - |
| finalizeSale() | Completes the sale | - |
| cancelSale() | Cancels and refunds | - |

### Modifiers

- **onlySeller**: Only the property seller can call
- **onlyInspector**: Only the inspector can call

### State Variables

| Variable | Type | Description |
|----------|------|-------------|
| nftAddress | address | RealEstate contract address |
| seller | address payable | Property seller |
| inspector | address | Property inspector |
| lender | address | Lender providing financing |
| isListed | mapping | Property listing status |
| purchasePrice | mapping | Property prices |
| escrowAmount | mapping | Earnest money amounts |
| buyer | mapping | Property buyers |
| inspectionPassed | mapping | Inspection status |
| approval | mapping | Approval status by address |

---

## Transaction Flow

```
1. Seller calls list()
   → NFT transferred to escrow contract
   → Property listed with price

2. Buyer calls depositEarnest()
   → Earnest money deposited
   → Buyer address stored

3. Buyer calls approveSale()

4. Inspector calls updateInspectionStatus(true)

5. Lender approves and funds

6. Seller calls finalizeSale()
   → Funds transferred to seller
   → NFT transferred to buyer
   → Property delisted
```

---

## Deployment

The contracts are deployed using Hardhat:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Deployment Script

The deploy.js script:
1. Deploys RealEstate NFT contract
2. Mints 3 sample properties
3. Deploys Escrow contract
4. Lists properties for sale

---

## ABIs

Contract ABIs are stored in `src/abis/`:
- `RealEstate.json` - NFT contract ABI
- `Escrow.json` - Escrow contract ABI
