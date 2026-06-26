import { createContext, useReducer, useEffect } from 'react'
import ordersReducer, {
  ordersInitialState,
  ORDER_ACTIONS,
} from '../features/orders/ordersReducer'
import ordersService from '../services/ordersService'
import useAuth from '../hooks/useAuth'    // ← ADD

const OrdersContext = createContext(null)

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, ordersInitialState)
  const { isAuthenticated } = useAuth()   // ← ADD

  const fetchOrders = async () => {
    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true })
    try {
      const res = await ordersService.getAll()
      const orders = res.data.map(order => ({
        ...order,
        tableNumber: order.table?.tableNumber,
        waiter:      order.waiter?.name,
        items:       order.items?.map(i => ({
          ...i,
          name:  i.menuItem?.name,
          emoji: i.menuItem?.emoji,
          price: i.unitPrice,
        })),
        status: order.status.toLowerCase(),
      }))
      dispatch({ type: ORDER_ACTIONS.SET_ORDERS, payload: orders })
    } catch (err) {
      console.error('Orders fetch failed:', err)
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: false })
    }
  }

  // ✅ Sirf tab fetch karo jab logged in ho
  useEffect(() => {
    if (isAuthenticated) fetchOrders()
  }, [isAuthenticated])   // ← isAuthenticated change hone par

  const createOrder = async (orderData) => {
    try {
      const payload = {
        tableId: orderData.tableId,
        waiterId: orderData.waiterId,
        notes:   orderData.notes,
        items:   orderData.items.map(item => ({
          menuItemId: item.id,
          quantity:   item.quantity,
          unitPrice:  item.price,
          notes:      item.notes || '',
        })),
      }
      const res = await ordersService.create(payload)
      const newOrder = {
        ...res.data,
        tableNumber: res.data.table?.tableNumber,
        waiter:      res.data.waiter?.name,
        items:       res.data.items?.map(i => ({
          ...i,
          name:  i.menuItem?.name,
          emoji: i.menuItem?.emoji,
          price: i.unitPrice,
        })),
        status: res.data.status.toLowerCase(),
      }
      dispatch({ type: ORDER_ACTIONS.ADD_ORDER, payload: newOrder })
      return newOrder
    } catch (err) {
      console.error('Create order failed:', err)
      throw err
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await ordersService.updateStatus(id, status.toUpperCase())
      dispatch({
        type:    ORDER_ACTIONS.UPDATE_ORDER_STATUS,
        payload: { id, status: status.toLowerCase() },
      })
    } catch (err) {
      console.error('Update status failed:', err)
    }
  }

  const deleteOrder = async (id) => {
    try {
      await ordersService.delete(id)
      dispatch({ type: ORDER_ACTIONS.DELETE_ORDER, payload: id })
    } catch (err) {
      console.error('Delete order failed:', err)
    }
  }

  const value = {
    orders:    state.orders,
    isLoading: state.isLoading,
    createOrder, updateStatus,
    deleteOrder, fetchOrders,
  }

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  )
}

export default OrdersContext