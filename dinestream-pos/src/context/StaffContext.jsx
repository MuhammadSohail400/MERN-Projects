import { createContext, useReducer, useEffect } from 'react'
import staffReducer, {
  staffInitialState,
  STAFF_ACTIONS,
} from '../features/staff/staffReducer'
import staffService from '../services/staffService'
import useAuth from '../hooks/useAuth'   // ← ADD

const StaffContext = createContext(null)

export const StaffProvider = ({ children }) => {
  const [state, dispatch] = useReducer(staffReducer, staffInitialState)
  const { isAuthenticated } = useAuth()  // ← ADD

  const fetchStaff = async () => {
    dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: true })
    try {
      const res = await staffService.getAll()
      const staff = res.data.map(s => ({
        ...s,
        role:        s.role.toLowerCase(),
        status:      s.status.toLowerCase(),
        ordersToday: 0,
        maxOrders:   20,
        startedAgo:  'On shift',
        avatarColor: s.avatarColor || '#f97316',
      }))
      dispatch({ type: STAFF_ACTIONS.SET_STAFF, payload: staff })
    } catch (err) {
      console.error('Staff fetch failed:', err)
      dispatch({ type: STAFF_ACTIONS.SET_LOADING, payload: false })
    }
  }

  // ✅ Sirf logged in hone par
  useEffect(() => {
    if (isAuthenticated) fetchStaff()
  }, [isAuthenticated])

 const addStaff = async (data) => {
  try {
    const res = await staffService.create({
      name:       data.name,
      email:      data.email,
      phone:      data.phone,
      password:   'Staff@123',        // ← default password
      role:       data.role.toUpperCase(),
      status:     data.status?.toUpperCase() || 'ON_DUTY',
      shift:      data.shift || '',
      shiftStart: data.shiftStart || '',
      shiftEnd:   data.shiftEnd || '',
      avatarColor: '#f97316',
    })

    const newMember = {
      ...res.data,
      role:        res.data.role.toLowerCase(),
      status:      res.data.status?.toLowerCase() || 'on_duty',
      ordersToday: 0,
      maxOrders:   20,
      startedAgo:  'Just added',
      avatarColor: res.data.avatarColor || '#f97316',
    }
    dispatch({ type: STAFF_ACTIONS.ADD_STAFF, payload: newMember })
  } catch (err) {
    console.error('Add staff failed:', err.response?.data || err)
    alert('Error: ' + (err.response?.data?.message || err.message))
  }
}

  const editStaff = async (data) => {
    try {
      const res = await staffService.update(data.id, {
        ...data,
        role:   data.role?.toUpperCase(),
        status: data.status?.toUpperCase(),
      })
      dispatch({
        type:    STAFF_ACTIONS.EDIT_STAFF,
        payload: { ...data, ...res.data },
      })
    } catch (err) {
      console.error('Edit staff failed:', err)
    }
  }

  const deleteStaff = async (id) => {
    try {
      await staffService.delete(id)
      dispatch({ type: STAFF_ACTIONS.DELETE_STAFF, payload: id })
    } catch (err) {
      console.error('Delete staff failed:', err)
    }
  }

  const value = {
    staff:     state.staff,
    isLoading: state.isLoading,
    addStaff, editStaff,
    deleteStaff, fetchStaff,
  }

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  )
}

export default StaffContext