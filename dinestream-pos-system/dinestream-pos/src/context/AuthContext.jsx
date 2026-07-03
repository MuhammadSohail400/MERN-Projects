import { createContext, useReducer, useEffect } from 'react'
import authReducer, {
  authInitialState,
  AUTH_ACTIONS,
} from '../features/auth/authReducer'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, authInitialState)

  // ── Real Login ───────────────────────────────────────────────
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })
    try {
      // Real API call
      const res = await authService.login(email, password)

      const { user, token } = res.data

      localStorage.setItem('ds_token', token)
      localStorage.setItem('ds_user', JSON.stringify(user))

      dispatch({
        type:    AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      })
      return { success: true }

    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      dispatch({
        type:    AUTH_ACTIONS.LOGIN_FAILURE,
        payload: message,
      })
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('ds_token')
    localStorage.removeItem('ds_user')
    dispatch({ type: AUTH_ACTIONS.LOGOUT })
  }

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // ── Rehydrate on refresh ─────────────────────────────────────
  useEffect(() => {
    const savedUser  = localStorage.getItem('ds_user')
    const savedToken = localStorage.getItem('ds_token')
    if (savedUser && savedToken) {
      dispatch({
        type:    AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user:  JSON.parse(savedUser),
          token: savedToken,
        },
      })
    }
  }, [])

  const updateProfile = async (data) => {
  try {
    const res = await authService.updateProfile(data)
    const updatedUser = res.data

    // localStorage + state update karo
    localStorage.setItem('ds_user', JSON.stringify(updatedUser))
    dispatch({
      type:    AUTH_ACTIONS.UPDATE_PROFILE,
      payload: updatedUser,
    })

    return { success: true, user: updatedUser }
  } catch (err) {
    const message = err.response?.data?.message || 'Update failed'
    return { success: false, error: message }
  }
}

const changePassword = async (data) => {
  try {
    await authService.changePassword(data)
    return { success: true }
  } catch (err) {
    const message = err.response?.data?.message || 'Password change failed'
    return { success: false, error: message }
  }
}


  const value = {
    user:            state.user,
    token:           state.token,
    isLoading:       state.isLoading,
    error:           state.error,
    isAuthenticated: !!state.token,
    login,
    logout,
    clearError,
    updateProfile,      // ← ADD
    changePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext