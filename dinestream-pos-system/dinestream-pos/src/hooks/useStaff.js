import { useContext } from 'react'
import StaffContext from '../context/StaffContext'

const useStaff = () => {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error('useStaff must be used inside StaffProvider')
  }
  return context
}

export default useStaff