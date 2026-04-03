import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';

const Home = ({ home, provider, account, escrow, togglePop }) => {
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

    const fetchDetails = async () => {
        if (!escrow || !home.id) return

        try {
            console.log("Fetching details for home:", home.id)
            console.log("Escrow address:", escrow.address)
            
            const buyer = await escrow.buyer(home.id)
            setBuyer(buyer)

            const hasBought = await escrow.approval(home.id, buyer)
            setHasBought(hasBought)

            const seller = await escrow.seller()
            setSeller(seller)

            const hasSold = await escrow.approval(home.id, seller)
            setHasSold(hasSold)

            const lender = await escrow.lender()
            setLender(lender)

            const hasLended = await escrow.approval(home.id, lender)
            setHasLended(hasLended)

            const inspector = await escrow.inspector()
            setInspector(inspector)

            const hasInspected = await escrow.inspectionPassed(home.id)
            setHasInspected(hasInspected)

            const listed = await escrow.isListed(home.id)
            setIsListed(listed)
            
            console.log("Seller:", seller)
            console.log("Inspector:", inspector)
            console.log("Lender:", lender)
            console.log("Is Listed:", listed)
        } catch (error) {
            console.log("Error fetching details:", error)
        }
    }

    const fetchOwner = async () => {
        if (!escrow) return
        
        try {
            const listed = await escrow.isListed(home.id)
            if (!listed) {
                const owner = await escrow.buyer(home.id)
                setOwner(owner)
            }
            setIsListed(listed)
        } catch (error) {
            console.log("Error fetching owner:", error)
        }
    }

    const buyHandler = async () => {
        console.log("Provider:", provider)
        console.log("Escrow:", escrow)
        console.log("Account:", account)
        
        if (!provider) {
            alert("Please install MetaMask and refresh the page!")
            return
        }
        
        if (!escrow) {
            alert("Smart contracts not found. Please connect to a network with deployed contracts (Localhost 8545).")
            return
        }
        
        if (!account) {
            alert("Please connect your wallet and try again!")
            return
        }
        
        try {
            const signer = provider.getSigner()
            const accountAddress = await signer.getAddress()
            console.log("Buying with account:", accountAddress)
            
            const escrowAmount = await escrow.escrowAmount(home.id)
            console.log("Escrow amount (ETH):", ethers.utils.formatEther(escrowAmount))

            // Deposit earnest money - this should trigger MetaMask
            const tx1 = await escrow.connect(signer).depositEarnest(home.id, { 
                value: escrowAmount 
            })
            console.log("Deposit transaction sent:", tx1.hash)
            await tx1.wait()
            console.log("Deposit confirmed")

            // Approve sale
            const tx2 = await escrow.connect(signer).approveSale(home.id)
            console.log("Approve transaction sent:", tx2.hash)
            await tx2.wait()
            console.log("Approve confirmed")

            setHasBought(true)
            alert("Property purchase initiated successfully!")
        } catch (error) {
            console.error("Buy error:", error)
            alert("Transaction failed: " + (error.reason || error.message))
        }
    }

    const inspectHandler = async () => {
        if (!provider || !escrow) return
        
        try {
            const signer = await provider.getSigner()
            const transaction = await escrow.connect(signer).updateInspectionStatus(home.id, true)
            await transaction.wait()
            setHasInspected(true)
        } catch (error) {
            console.error("Inspection error:", error)
        }
    }

    const lendHandler = async () => {
        if (!provider || !escrow) return
        
        try {
            const signer = await provider.getSigner()
            const transaction = await escrow.connect(signer).approveSale(home.id)
            await transaction.wait()

            const lendAmount = (await escrow.purchasePrice(home.id) - await escrow.escrowAmount(home.id))
            await signer.sendTransaction({ to: escrow.address, value: lendAmount.toString(), gasLimit: 60000 })

            setHasLended(true)
        } catch (error) {
            console.error("Lend error:", error)
        }
    }

    const sellHandler = async () => {
        if (!provider || !escrow) return
        
        try {
            const signer = await provider.getSigner()
            let transaction = await escrow.connect(signer).approveSale(home.id)
            await transaction.wait()

            transaction = await escrow.connect(signer).finalizeSale(home.id)
            await transaction.wait()

            setHasSold(true)
        } catch (error) {
            console.error("Sell error:", error)
        }
    }

    useEffect(() => {
        fetchDetails()
        fetchOwner()
    }, [escrow, hasSold])

    return (
        <div className="home">
            <div className='home__details'>
                <div className="home__image">
                    <img src={home.image} alt="Home" />
                </div>
                <div className="home__overview">
                    <h1>{home.name}</h1>
                    <p>
                        <strong>{home.attributes[2].value}</strong> bds |
                        <strong>{home.attributes[3].value}</strong> ba |
                        <strong>{home.attributes[4].value}</strong> sqft
                    </p>
                    <p>{home.address}</p>

                    <h2>{home.attributes[0].value} ETH</h2>

                    {owner || !isListed ? (
                        <div className='home__owned'>
                            {owner ? `Owned by ${owner.slice(0, 6) + '...' + owner.slice(38, 42)}` : 'Not Listed'}
                        </div>
                    ) : (
                        <div>
                            {(account === inspector) ? (
                                <button className='home__buy' onClick={inspectHandler} disabled={hasInspected}>
                                    Approve Inspection
                                </button>
                            ) : (account === lender) ? (
                                <button className='home__buy' onClick={lendHandler} disabled={hasLended}>
                                    Approve & Lend
                                </button>
                            ) : (account === seller) ? (
                                <button className='home__buy' onClick={sellHandler} disabled={hasSold}>
                                    Approve & Sell
                                </button>
                            ) : (
                                <button className='home__buy' onClick={buyHandler} disabled={hasBought}>
                                    Buy
                                </button>
                            )}

                            <button className='home__contact'>
                                Contact agent
                            </button>
                        </div>
                    )}

                    <hr />

                    <h2>Overview</h2>

                    <p>
                        {home.description}
                    </p>

                    <hr />

                    <h2>Facts and features</h2>

                    <ul>
                        {home.attributes.map((attribute, index) => (
                            <li key={index}><strong>{attribute.trait_type}</strong> : {attribute.value}</li>
                        ))}
                    </ul>
                </div>


                <button onClick={togglePop} className="home__close">
                    <img src={close} alt="Close" />
                </button>
            </div>
        </div >
    );
}

export default Home;