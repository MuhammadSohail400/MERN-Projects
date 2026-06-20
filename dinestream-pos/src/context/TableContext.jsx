import { createContext, useReducer, useEffect } from 'react'
import tablesReducer, {
  tablesInitialState,
  TABLE_ACTIONS,
} from '../features/tables/tablesReducer'
import tablesService from '../services/tablesService'
import useAuth from '../hooks/useAuth'   // ← ADD

const TablesContext = createContext(null)

export const TablesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tablesReducer, tablesInitialState)
  const { isAuthenticated } = useAuth()  // ← ADD

  const fetchTables = async () => {
    dispatch({ type: TABLE_ACTIONS.SET_LOADING, payload: true })
    try {
      const res = await tablesService.getAll()
      const tables = res.data.map(t => ({
        ...t,
        status: t.status.toLowerCase(),
      }))
      dispatch({ type: TABLE_ACTIONS.SET_TABLES, payload: tables })
    } catch (err) {
      console.error('Tables fetch failed:', err)
      dispatch({ type: TABLE_ACTIONS.SET_LOADING, payload: false })
    }
  }

  // ✅ Sirf logged in hone par
  useEffect(() => {
    if (isAuthenticated) fetchTables()
  }, [isAuthenticated])

  const updateTableStatus = async (id, status) => {
  try {
    await tablesService.updateStatus(id, {
      status: status.toUpperCase(),
    })
    // Optimistic update
    dispatch({
      type:    TABLE_ACTIONS.UPDATE_TABLE_STATUS,
      payload: { id, status: status.toLowerCase() },
    })
  } catch (err) {
    console.error('Table update failed:', err.response?.data || err)
    // Refresh karo agar error aaye
    fetchTables()
  }
}

  const selectTable = (table) => {
    dispatch({ type: TABLE_ACTIONS.SET_SELECTED, payload: table })
  }

  const value = {
    tables:    state.tables,
    selected:  state.selected,
    isLoading: state.isLoading,
    updateTableStatus, selectTable, fetchTables,
  }

  return (
    <TablesContext.Provider value={value}>
      {children}
    </TablesContext.Provider>
  )
}

export default TablesContext