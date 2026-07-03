import { useContext } from 'react'
import TablesContext from '../context/TableContext'


const useTables = () => {
  const context = useContext(TablesContext)
  if (!context) {
    throw new Error('useTables must be used inside TablesProvider')
  }
  return context
}

export default useTables