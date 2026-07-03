import { useContext } from 'react'
import MenuContext from '../context/MenuContext'

const useMenu = () => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used inside MenuProvider')
  }
  return context
}

export default useMenu