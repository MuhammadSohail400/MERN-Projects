export const ORDER_ACTIONS = {
  SET_ORDERS:          'SET_ORDERS',
  ADD_ORDER:           'ADD_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  DELETE_ORDER:        'DELETE_ORDER',
  SET_LOADING:         'SET_LOADING',
  SET_SELECTED:        'SET_SELECTED',
}

export const ordersInitialState = {
  orders:   [],
  selected: null,   // currently viewed order
  isLoading: false,
}

const ordersReducer = (state, action) => {
  switch (action.type) {

    case ORDER_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case ORDER_ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload, isLoading: false }

    case ORDER_ACTIONS.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      }

    case ORDER_ACTIONS.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        ),
      }

    case ORDER_ACTIONS.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(o => o.id !== action.payload),
      }

    case ORDER_ACTIONS.SET_SELECTED:
      return { ...state, selected: action.payload }

    default:
      return state
  }
}

export default ordersReducer