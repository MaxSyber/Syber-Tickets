import React, { useSelector } from 'react-redux'
import {ethers} from 'ethers'

const Transacations = () => {
    const provider = useSelector(state => state.provider.connection)
    const tickets = useSelector(state => state.tickets.contract)
	const TicketsRemaining = useSelector(state => state.tickets.ticketsRemaining)
    const userAccount = useSelector(state => state.provider.account)
    const TokenOwner = useSelector(state => state.seatSelection && state.seatSelection['0'].owner)
    const ticketMaster = '0x01179B07ca486eb9c165A4e5f9Eb02dfC48dBB89' 
    const tokenId = useSelector(state => state.seatSelection && state.seatSelection['0'].tokenId)

    const buyToggle = (TokenOwner) => {
        let className = ''
        if (TokenOwner === ticketMaster) 
            {className ='button2'
        } else 
            className = 'button2gray'
        return className
    }
    
    const returnToggle = (TokenOwner) => {
        let className = ''

        if (TokenOwner === userAccount) {
            className='button2'
        } else 
            className = 'button2gray'
        return className
    }
    
	const handleBuy = async () => {
        const buyTicketPrice = ethers.utils.parseEther(".05")
        const signer = provider.getSigner()
        let transaction = await tickets.connect(signer).buyTicket(ticketMaster, tokenId, {value: buyTicketPrice}) 
        await transaction.wait()
        setTimeout(() => {
            window.location.reload()
            }, 1000)
    }

    const handleReturn = async () => {
        const signer = provider.getSigner()
        let transaction = await tickets.connect(signer).returnTicket(TokenOwner, tokenId,{ gasLimit: 3000000 })
        await transaction.wait()
        setTimeout(() => {
            window.location.reload()
            }, 1000)
    }

  return (
	<div className="transactions">
        <div>
            <p>Tickets Remaining: {TicketsRemaining} </p>
            <p>Price: .05 MATIC </p>
        </div>
        <div>
            <button className= {buyToggle(TokenOwner)} 
                onClick={handleBuy}> Buy 
            </button>
            <button className= {returnToggle(TokenOwner)} 
            onClick={handleReturn}> Return 
            </button>
        </div>
        <div>
            <small>* Maximum two tickets per metamask account. </small>
        </div>
        <div className='disclaimer'>
            <small>* All returned tickets refund 80% of face value of ticket price </small>
        </div>
    </div>
  )
}
export default Transacations;
