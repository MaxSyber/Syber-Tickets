import { ethers } from 'ethers'
import TICKETS_ABI from '../abis/Tickets.json'


export const loadProvider = (dispatch) => {
	const connection = new ethers.providers.Web3Provider(window.ethereum)
	dispatch({ type: 'PROVIDER_LOADED', connection })

	return connection
}

export const loadNetwork = async (provider, dispatch) => {
	const {chainId} = await provider.getNetwork()
	dispatch({ type: 'NETWORK_LOADED', chainId })

	return chainId
}

export const loadAccount = async (provider, dispatch) => {
	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])

    dispatch({ type: 'ACCOUNT_LOADED', account })

    let balance = await provider.getBalance(account)
		balance = ethers.utils.formatEther(balance)

		dispatch({ type: 'ETHER_BALANCE_LOADED', balance})

    return account
}

export const loadTickets = async (provider, address, dispatch) => {
const tickets = new ethers.Contract(address, TICKETS_ABI, provider)
		dispatch({ type: 'SYBER_TICKETS_LOADING', tickets })

	try {
		const totalSupply = await tickets.totalSupply()
		const ticketsData = [] 
		const ticketMaster = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' 

		for (let i = 0; i < totalSupply; i++) {
			const tokenId = i
			const owner = await tickets.ownerOf(tokenId)
			const tokenURI = await tickets.tokenURI(tokenId)
			ticketsData.push({ tokenId, owner, tokenURI })
		}
		const ticketsRemaining = (await tickets.balanceOf(ticketMaster)).toString()
		dispatch({ type: 'TICKETS_REMAINING_LOADED', ticketsRemaining})
		dispatch ({ type: 'SYBER_TICKETS_LOADED', ticketsData, tickets })
		return ticketsData, tickets

		} catch (error) {
			console.error('Error loading tickets', error)
		}
	return tickets
}

export const subscribeToEvents = (tickets, dispatch) => {
	
	tickets.on('Sell', (to, from, tokenId, amount, event) => {
		const order = event.args
	dispatch({ type: 'ORDER_SELL_SUCCESS', order, event})
	})

	tickets.on('Return', (to, from, tokenId, amount, event) => {
	const order = event.args
	dispatch({ type: 'ORDER_RETRUN_SUCCESS', order, event})
	})
}

export const loadTicketsRemaining = async (provider, tickets, dispatch) => {
	const TicketsRemaining = await tickets.balanceOf('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
	TicketsRemaining.push({ TicketsRemaining })
 }

export const selectSeat = (selectedSeatData) => {
	return  {type: 'SEAT_SELECTED', selectedSeatData}
}

export const loadMetadata = async (tokenId) => {
	try {
		const result = await fetch(`/ticketMetadata/${tokenId}.json`)
		if (!result.ok) {
			throw Error('Failed to loadmetadata')
		}
		const metadata = await result.json()
		return metadata
	} catch (error) {
		console.error('Error fetching ticket metadata', error)
	}
}

