import React, { useSelector, useDispatch } from 'react-redux'
import { selectSeat } from '../store/interactions';

const Seats = () => {
  const dispatch = useDispatch()
  const userAccount = useSelector(state => state.provider.account)
  const data = useSelector(state => state.tickets.data)
  const owner =useSelector(state => state.tickets.data.owner)
  const seatId = useSelector(state => state.seatSelection && state.seatSelection['0'].tokenId)

  const handleClick = (tokenId) => {
    const selectedSeatData = data.filter(seat => seat.tokenId === tokenId)
    dispatch(selectSeat(selectedSeatData))
  }

  const seatSelection = (owner, tokenId) => {
    const ticketMaster = '0x01179B07ca486eb9c165A4e5f9Eb02dfC48dBB89' 
    let className = ''

    if (tokenId === seatId) {
      className ='seat_selected'
    } else if (owner === userAccount) {
      className = 'seat_owned'
    }  else if 
     (owner === ticketMaster) {
      className = 'seat_sale'
    } else
      className = 'seat_sold'
     
    return className
  }

  return (
      <div className='seatSection'>Max Fosh Comedy Seating Map
        <ul className="legend">
          <li className='legendList'>
            <div className="legsale"></div>
            <small>For Sale</small>
          </li>
          <li>
            <div className="legsold"></div>
            <small>Occupied</small>
          </li>
          <li>
            <div className="legselected"></div>
            <small>Selected</small>
          </li>
          <li>
            <div className="legowned"></div>
            <small>Your Seats</small>
          </li>
        </ul>
      <div className='stage'>STAGE
      </div>

      <div className='seat_container'>

     	  <div className="row">
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
      	 <div className="seat_sold"></div>
        </div>

        <div className="row">
          {data.map(seat => (
            <div 
              className={seatSelection(seat.owner, seat.tokenId)} 
              key={seat.tokenId} 
              onClick={() => handleClick(seat.tokenId)}
            >
            </div>
          ))}
        </div>

        <div className="row">
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
        </div>

        <div className="row">
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
         <div className="seat_sold"></div>
        </div>
        <div className='warning'> *Only one seat my be selected at a time </div>
      </div>
      <div className='quote'>Embrace a future where technology and entertainment intertwine, delivering unforgettable memories!</div>
    </div>
  )
}
export default Seats;
