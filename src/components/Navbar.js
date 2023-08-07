import { useSelector, useDispatch } from 'react-redux'
import { loadAccount } from '../store/interactions'
import Logo from '../assets/logo.png'

const Navbar = () => {
	const provider = useSelector(state => state.provider.connection)
	const account = useSelector(state => state.provider.account)
	const dispatch = useDispatch()

	const connectHandler = async () => {
		await loadAccount(provider, dispatch)
	} 

	return(
		<div className='topbar'>
			<div className='title'>
				<img src= {Logo} className='navLogo' alt='Logo'/>
				<span>SYBER TICKETS</span>
			</div>
		 		<div>
		 			{account ? (
		 				<button className='account'>
		 					{account.slice(0,5) +'...' + account.slice(38,42)}
		 				</button>
		 			) : (
		 				<button className='button' onClick={connectHandler}>Connect</button>
		 			)}
		 		</div>	 		
				<ul className='navTopics'>
					<li className='topic'><a href='#about' className='topicLink'>About</a></li>
					<li className='topic'><a href='#seats' className='topicLink'>Buy/Return Tickets</a></li>
					<li className='topic'><a href='#myTickets' className='topicLink'>My Tickets</a></li>
					<li className='topic'><a href ='#bottom' className='topicLink'>F.A.Q</a></li>
				</ul>
		</div>
	)
}
export default Navbar;
