# Troubleshooting Guide

## Common Issues and Solutions

---

## Frontend Issues

### Issue: Properties Not Loading

**Symptoms:**
- Page shows "Homes For You" but no properties appear
- Loading spinner never completes

**Solutions:**

1. **Check if Hardhat node is running**
   ```bash
   # Terminal should show:
   # Started HTTP and WebSocket URLs:
   # http://127.0.0.1:8545
   ```

2. **Verify MetaMask network**
   - Open MetaMask
   - Check network is "Localhost 8545"
   - Chain ID should be 31337

3. **Check browser console (F12)**
   - Look for error messages
   - Check if "Using local metadata" appears

4. **Verify contract addresses in config.json**
   ```json
   {
     "31337": {
       "realEstate": { "address": "0x..." },
       "escrow": { "address": "0x..." }
     }
   }
   ```

5. **Re-deploy contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

---

### Issue: Images Not Loading

**Symptoms:**
- Property cards appear but images are broken

**Solutions:**

1. **IPFS may be slow or blocked**
   - Images use IPFS URLs in metadata
   - Try again later or use VPN

2. **Check network connectivity**
   - Ensure internet is working

3. **Use local fallback images**
   - Metadata files use Unsplash URLs as backup

---

### Issue: "Please connect to the blockchain first!"

**Symptoms:**
- Alert shows when clicking Buy button
- Buy button doesn't trigger MetaMask

**Solutions:**

1. **Connect MetaMask wallet first**
   - Click "Connect" button in navigation
   - Approve connection request

2. **Check browser console**
   - Open F12 → Console tab
   - Look for: "Provider:", "Escrow:", "Account:"
   - If any are null, that's the issue

3. **Refresh page after connecting**
   - Sometimes need to refresh after wallet connection

4. **Verify network in MetaMask**
   - Must be connected to localhost:8545
   - Chain ID: 31337

---

### Issue: Buy Button Triggers Error

**Symptoms:**
- MetaMask doesn't open
- Error in console: "Transaction failed"

**Solutions:**

1. **Check console for specific error**
   ```javascript
   // Look for:
   // - "escrowAmount is undefined"
   // - "Contract not found"
   // - "Insufficient funds"
   ```

2. **Verify contracts are deployed**
   - Run `npx hardhat node`
   - Run `npx hardhat run scripts/deploy.js --network localhost`
   - Check console output for addresses

3. **Check account has ETH**
   - In MetaMask, check balance
   - Import test account if needed

4. **Check contract addresses**
   - Update config.json with new addresses after deploy

---

## Blockchain Issues

### Issue: Contracts Not Deploying

**Symptoms:**
- Deploy script hangs or fails
- Error: "Could not find artifacts"

**Solutions:**

1. **Compile contracts first**
   ```bash
   npx hardhat compile
   ```

2. **Check hardhat.config.js**
   ```javascript
   module.exports = {
     solidity: "0.8.17",
   };
   ```

3. **Clean and recompile**
   ```bash
   npx hardhat clean
   npx hardhat compile
   ```

---

### Issue: Wrong Network Error

**Symptoms:**
- Error: "NativeCurrency not found"
- Error: "Chain ID not supported"

**Solutions:**

1. **Switch MetaMask to correct network**
   - Localhost 8545 → Chain ID 31337

2. **Add network manually**
   - Network Name: Localhost 8545
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency: ETH

---

### Issue: Insufficient Funds

**Symptoms:**
- MetaMask shows "Insufficient funds"
- Transaction fails

**Solutions:**

1. **Import test account**
   ```bash
   # From Hardhat output:
   # Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   # Copy the private key (first one listed)
   ```

2. **Get more test ETH**
   - Hardhat accounts have 100 ETH each
   - Import a fresh account from node output

---

## MetaMask Issues

### Issue: MetaMask Not Detecting

**Symptoms:**
- "MetaMask not installed" message

**Solutions:**

1. **Install MetaMask**
   - Download from https://metamask.io
   - Install browser extension

2. **Refresh page**
   - After installing MetaMask

3. **Check extension is enabled**
   - Browser settings → Extensions

---

### Issue: Connection Not Requesting

**Symptoms:**
- Clicking Connect does nothing
- No MetaMask popup

**Solutions:**

1. **Check window.ethereum exists**
   ```javascript
   // Run in console:
   console.log(window.ethereum)
   ```

2. **Disable popup blockers**
   - Browser settings

3. **Refresh and try again**

---

### Issue: Account Not Showing

**Symptoms:**
- Connected but account shows as null
- "Connect" button stays instead of address

**Solutions:**

1. **Check accounts array**
   ```javascript
   // Run in console:
   await window.ethereum.request({ method: 'eth_requestAccounts' })
   ```

2. **Switch account in MetaMask**
   - Sometimes need to select correct account

3. **Check account change event**
   - App should auto-update on account change

---

## Smart Contract Issues

### Issue: "Property not listed" Error

**Solutions:**

1. **Property may already be sold**
   - Check isListed mapping
   - Try a different property

2. **Re-deploy to relist**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

---

### Issue: "Only buyer can call" Error

**Solutions:**

1. **Wrong account connected**
   - Check which account is active in MetaMask
   - Switch to correct account

2. **Buyer not set**
   - depositEarnest() should set buyer
   - Make sure to call it first

---

### Issue: "Inspection not passed" Error

**Solutions:**

1. **Inspector must approve first**
   - Switch to inspector account in MetaMask
   - Call updateInspectionStatus(true)

2. **Check inspector address**
   - Verify in deploy script output

---

### Issue: "Insufficient funds" in Contract

**Solutions:**

1. **Lender must fund**
   - Lender needs to send purchase price - escrow amount
   - Call lendHandler in frontend

2. **Check contract balance**
   ```javascript
   await escrow.getBalance()
   ```

---

## Development Issues

### Issue: React App Not Starting

**Solutions:**

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Check Node version**
   ```bash
   node --version  # Should be v14+
   ```

3. **Clear cache and restart**
   ```bash
   rm -rf node_modules
   npm install
   npm start
   ```

---

### Issue: Port Already in Use

**Solutions:**

1. **Kill process on port 3000**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Use different port**
   ```bash
   PORT=3001 npm start
   ```

---

### Issue: Changes Not Reflecting

**Solutions:**

1. **Hard refresh**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

2. **Clear browser cache**
   - Settings → Privacy → Clear cache

3. **Restart dev server**
   - Ctrl+C to stop
   - npm start to restart

---

## Getting Help

### Debug Information to Collect

1. **Browser console errors**
   - Open F12 → Console tab
   - Screenshot or copy errors

2. **MetaMask network info**
   - Network name
   - Chain ID
   - Account address

3. **Hardhat node output**
   - Is it running?
   - What addresses are shown?

4. **Deploy script output**
   - Contract addresses
   - Any errors shown

### Contact Support

If issues persist:
1. Check all dependencies installed
2. Verify all steps in deployment guide
3. Try a fresh installation in new folder
4. Open issue at https://github.com/anomalyco/opencode/issues

---

## Prevention Tips

1. **Always keep Hardhat node running** while developing
2. **Check console for errors** regularly
3. **Use test accounts** for development
4. **Re-deploy contracts** if making changes
5. **Keep config.json updated** with correct addresses
6. **Test with one property** before listing multiple
