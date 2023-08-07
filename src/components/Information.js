const Information = () => {

	return(
  <section id='bottom'>
  	<div className='information'>FAQ 
      <div className='qnastyles'>
        <p>Q: What Can I only buy a maximum of two tickets?</p>
        <p>A: You can only buy a maximum of two tickets to prevent 
        hoarding and bulk ticket purchasing. This policy is put in 
        place to ensure fair access to tickets for all customers. 
        By limiting the number of tickets per person, we aim to create 
        a more enjoyable and accessible experience for everyone 
        interested in attending the event.</p>

        <p>Q: Why are tickets non-transferable?</p>
        <p>A: Non-transferable tickets help prevent scalping because they cannot be resold or transferred to others. 
        This ensures that tickets are sold at their original face value, making events more accessible to genuine fans. 
        </p>

        <p>Q: Why do you use the Polygon Network and not the Ethereum Mainnet?</p>
        <p>A: Transaction fees are significantly lower and speeds are significantly faster on the Polygon Network as opposed to Etherum.
        On average, a simple transaction fee on the Ethereum Netork could cost upwards of  5-10$ USD whereas on the polygon network that same 
        transaction could cost you about .02-.05$USD (Summer 2023).  Polygon also processes your tranaction faster meaning you have to wait
        even less time to receive your tickets</p>

        <p>Q: Do I need to create an account on your website?</p>
        <p>A: Your Metamask account will serve as your account for our website.  Simply log into your metamask wallet to buy tickets from our website.
        We dont need any of your personal data!</p>
          <footer> 
            <p className='float_left'>© 2023 Syber Tickets LLC. </p>
            <p className='float_right'> Created by Brett Seibert </p>
            <p className='float_right'>Link to Portfolio </p>
          </footer>
      </div>
     </div>
  </section>
	)
}
export default Information;
