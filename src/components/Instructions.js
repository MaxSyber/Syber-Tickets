const Instructions = () => {

	return(
		<section id='seats'>
			<div className='instructions'> 
				<p>Instructions</p>
				<p>Step 1: Have Metamask installed in your browser and create an account (download Metamask on 
					<a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target="_blank" rel="noopener noreferrer"> chrome)</a></p>
				<p>Step 2: Click <button className='ex'> Connect</button> in the top right hand corner of our website to connect your metamask wallet to our site.</p>
				<p>Step 3: Select an available seat and click 'buy' ticket and then confirm the transaction within your Metamask popup. </p>
				<p>BETA Make sure you are connected to the Polygon Mumbai test Network </p>
			</div>
		</section>
	)
}
export default Instructions;
