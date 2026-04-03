import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';

// Local metadata for development
import metadata1 from './metadata/1.json'
import metadata2 from './metadata/2.json'
import metadata3 from './metadata/3.json'
import metadata4 from './metadata/4.json'
import metadata5 from './metadata/5.json'
import metadata6 from './metadata/6.json'

const localMetadata = [metadata1, metadata2, metadata3, metadata4, metadata5, metadata6]

function App() {
  const [provider, setProvider] = useState(null)
  const [escrow, setEscrow] = useState(null)

  const [account, setAccount] = useState(null)

  const [homes, setHomes] = useState([])
  const [home, setHome] = useState({})
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        console.log("MetaMask not installed, using local metadata")
        setHomes(localMetadata)
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      
      const network = await provider.getNetwork()
      
      // Handle chainId properly - convert to number
      let chainId = network.chainId
      if (typeof chainId === 'object') {
        chainId = chainId.toNumber()
      }
      chainId = chainId.toString()
      
      console.log("Network chainId:", chainId)
      console.log("Available config keys:", Object.keys(config))
      
      const configData = config[chainId]

      if (!configData) {
        console.log('No config for chainId:', chainId, '- using local metadata')
        setHomes(localMetadata)
        return
      }

      // Check if contracts are deployed (address is not zero)
      if (configData.escrow.address === "0x0000000000000000000000000000000000000000") {
        console.log('Contracts not deployed for this network - using local metadata')
        setHomes(localMetadata)
        return
      }

      console.log("Found config for chainId:", chainId)
      console.log("RealEstate address:", configData.realEstate.address)
      console.log("Escrow address:", configData.escrow.address)

      // Try to request accounts
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount(ethers.utils.getAddress(accounts[0]))
          console.log("Account connected:", accounts[0])
        }
      } catch (e) {
        console.log("User needs to connect wallet")
      }

      // Connect to RealEstate contract to get properties
      const realEstate = new ethers.Contract(configData.realEstate.address, RealEstate, provider)
      
      // Get total supply
      const totalSupply = await realEstate.totalSupply()
      console.log("Total supply:", totalSupply.toString())
      
      // If no NFTs minted, use local metadata
      if (totalSupply.toNumber() === 0) {
        console.log("No NFTs minted, using local metadata")
        setHomes(localMetadata)
        return
      }
      
      const homes = []

      for (var i = 1; i <= totalSupply.toNumber(); i++) {
        const uri = await realEstate.tokenURI(i)
        console.log("Token URI:", uri)
        
        try {
          const response = await fetch(uri)
          const metadata = await response.json()
          homes.push(metadata)
        } catch (e) {
          console.log("Failed to fetch metadata for token", i, e)
        }
      }

      if (homes.length === 0) {
        console.log("No metadata fetched, using local metadata")
        setHomes(localMetadata)
        return
      }
      
      setHomes(homes)

      // Connect to Escrow contract
      const escrow = new ethers.Contract(configData.escrow.address, Escrow, provider)
      setEscrow(escrow)

      console.log("Escrow contract loaded:", escrow.address)

      // Listen for account changes
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const account = ethers.utils.getAddress(accounts[0])
          setAccount(account)
          console.log("Account changed:", account)
        } else {
          setAccount(null)
        }
      })
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
      
    } catch (error) {
      console.log('Error loading blockchain data:', error)
      console.log('Using local metadata for development')
      setHomes(localMetadata)
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  // Re-load when account changes
  useEffect(() => {
    if (account) {
      loadBlockchainData()
    }
  }, [account])

  const togglePop = (home) => {
    setHome(home)
    toggle ? setToggle(false) : setToggle(true);
  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />

      <div className='cards__section'>

        <h3>Homes For You</h3>

        <hr />

        <div className='cards'>
          {homes.map((home, index) => (
            <div className='card' key={index} onClick={() => togglePop(home)}>
              <div className='card__image'>
                <img src={home.image} alt="Home" />
              </div>
              <div className='card__info'>
                <h4>{home.attributes[0].value} ETH</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>
                <p>{home.address}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {toggle && (
        <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;
