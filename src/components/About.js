import Logo from '../assets/logo.png'
const About = () => {

	return(
		<section id='about'>
			<div className='testAbout'> 
				<div className='aboutHeading'>
					Syber Tickets is a web 3.0 ticketing application that's reshaping the very essence of event ticketing. 
					Powered by the smart contracts on the Polygon Network, Syber Tickets uses the concept of soulbound NFTs to issue non-transferable event tickets.
				</div>
				<div className ='card-ex'>
					<div className='cardlogo'> <img src= {Logo} className='tinylogo' alt='Logo'/></div>
					<div> Ticket #: 26 </div>
					<div> Taylor Swift </div>
					<div> 14 March 2023 </div>
					<div> The Ground </div>
					<div> 7:00 PM EST </div>
					<div> Miami, FL </div>
				</div>
			</div>
		</section>
	)
}
export default About;
