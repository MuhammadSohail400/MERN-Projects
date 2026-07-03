import { createContext, useState, useEffect } from 'react'
import restaurantService from '../services/restaurantService'
import useAuth from '../hooks/useAuth'

const RestaurantContext = createContext(null)

export const RestaurantProvider = ({ children }) => {

  const { isAuthenticated } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [isLoading, setIsLoading]   = useState(true)

  const fetchRestaurant = async () => {
    try {
      const res = await restaurantService.get()
      setRestaurant(res.data)
    } catch (err) {
      console.error('Restaurant fetch failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) fetchRestaurant()
  }, [isAuthenticated])

  const value = {
    restaurant,
    isLoading,
    refreshRestaurant: fetchRestaurant,   // ← Settings save hone ke baad call karenge
  }

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  )
}

export default RestaurantContext