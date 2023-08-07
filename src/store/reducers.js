export const provider = (state = {}, action) => {
	switch (action.type) {
		case 'PROVIDER_LOADED':
		return {
			...state, 
			connection: action.connection
		}

		case 'NETWORK_LOADED':
		return {
			...state, 
			chainId: action.chainId
		}

		case 'ACCOUNT_LOADED':
		return {
			...state, 
			account: action.account
		}
		case 'ETHER_BALANCE_LOADED':
			return {
				...state,
				balance: action.balance
		}

		default:
			return state
	}
}

const DEFAULT_TICKETS_STATE = {
  loading: false,
  contract: {},
  data: [],
  ticketsRemaining: [],
  transaction: {
		isSuccessful: false,
	},
	events: []
}

export const tickets = (state = DEFAULT_TICKETS_STATE, action) => {
  switch (action.type) {
    case 'SYBER_TICKETS_LOADING':
      return {
        ...state,
        loading: true,
      }
    case 'SYBER_TICKETS_LOADED':
      return {
        ...state,
        loading: false,
        data: action.ticketsData,
        contract: action.tickets
      }
     case 'TICKETS_REMAINING_LOADED':
     	return {
     		...state,
     		loading: false,
     		ticketsRemaining: action.ticketsRemaining
     	}
     	//Transactions
     	case 'ORDER_SELL_SUCCESS':
     		return {
     			...state,
     			transaction: {
     				isSuccessful: true,
     				transactionType: 'Buy Ticket'
     			},
     			events: [action.event, ...state.events]
     	}

     	case 'ORDER_RETRUN_SUCCESS':
     		return {
     			...state,
     			transaction: {
     				isSuccessful: true,
     				transactionType: 'Retrun Ticket'
     			},
     			events: [action.event, ...state.events]
     		}

    default:
      return state
  }
}
//seat Selection
const DEFAULT_SEAT_SELECTION = null
export const seatSelection = (state = DEFAULT_SEAT_SELECTION, action) => {
	switch (action.type) {
		case 'SEAT_SELECTED':
			return action.selectedSeatData
		default:
		return state
	}
}


//Transactions

//Mytickets
