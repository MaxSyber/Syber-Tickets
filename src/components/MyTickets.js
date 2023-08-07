import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import Logo from '../assets/logo.png'
import { loadMetadata } from '../store/interactions'

const MyTickets =()=> {
	const tickets = useSelector(state => state.tickets.data)
	const userAccount = useSelector(state => state.provider.account)
	const [metadata, setMetadata] = useState({})	
	const myTickets = tickets.filter(mine => mine.owner === userAccount)
	const myTicketsIds = myTickets.map(item => item.tokenId)

  useEffect(() => {

    const fetchMetadata = async () => {
    	for (const tokenId of myTicketsIds) {
    		const ticketMetadata = await loadMetadata(tokenId)
    		setMetadata(prevMetadata => ({ ...prevMetadata, [tokenId]: ticketMetadata }))
    }
   }

    fetchMetadata();
  }, [userAccount]);
  	
	return(
		<section id ='myTickets'>
			<div className='mytickets'> My Tickets:
				{myTickets.length > 0 ? (
					tickets.map(tics => {
						if (tics.owner === userAccount) {
							const ticketData = metadata[tics.tokenId]
							return (
								<div className='card' key={tics.tokenId}> 
									<div className='cardlogo'> <img src= {Logo} className='tinylogo' alt='Logo'/></div>
									<div> Ticket #: {ticketData?.tokenId} </div>
									<div> {ticketData?.name} </div>
									<div> {ticketData?.date} </div>
									<div> {ticketData?.location}</div>
									<div> {ticketData?.time} </div>
									<div> {ticketData?.city} </div>
								</div>
							)
						}
						return null
					})
			) : (
				<>
					<div className='notics'>You Own No Tickets </div> 
					<div className='span'> (Ensure you are connected with <button className='ex'> Connect</button> ^)</div>
				</>
				)}
			</div>
		</section>
	)
}
export default MyTickets;
