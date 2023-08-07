import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';
import Seats from './Seats'
import Transactions from './Transactions'
import MyTickets from './MyTickets'
import Information from './Information'
import Instructions from './Instructions'
import { loadProvider, loadNetwork, loadAccount, loadTickets, subscribeToEvents } from '../store/interactions';
import Navbar from './Navbar'
import About from './About'

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
  
    // Connect Ethers to blockchain 
    const provider = await loadProvider(dispatch)
    const chainId = await loadNetwork(provider, dispatch)
    window.ethereum.on('chainChanged', () =>{
        window.locaton.reload()
     })
    //  account will update onchange of private keys
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    }, [])
  
    const tickets = await loadTickets(provider, config[chainId].tickets.address, dispatch)
  
    subscribeToEvents(tickets, dispatch)
  }
  
  useEffect(() => {
    loadBlockchainData()
  })
 
  return (
    <div>

      <Navbar />

      <About />

    
      <main>
  
        <Instructions />
  
        <Seats />

        <Transactions />

        <MyTickets />

        <Information />
      
      </main>
        
    </div>
  );
}

export default App;
  