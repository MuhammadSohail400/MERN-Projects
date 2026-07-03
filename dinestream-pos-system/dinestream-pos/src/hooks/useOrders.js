import { useContext } from 'react'
import OrdersContext from '../context/orderCOntext'


const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used inside OrdersProvider')
  }
  return context
}

export default useOrders