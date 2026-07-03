import { createContext, useReducer, useCallback } from 'react'
import toastReducer, {
  toastInitialState,
  TOAST_ACTIONS,
} from '../features/toast/toastReducer'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {

  const [state, dispatch] = useReducer(toastReducer, toastInitialState)

  // 🧠 useCallback — stable function reference
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random()

    dispatch({
      type:    TOAST_ACTIONS.ADD_TOAST,
      payload: { id, message, type },
    })

    // Auto-dismiss after duration
    setTimeout(() => {
      dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id })
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    dispatch({ type: TOAST_ACTIONS.REMOVE_TOAST, payload: id })
  }, [])

  // ── Convenience methods ────────────────────────────────────────
  const success = useCallback((msg) => showToast(msg, 'success'), [showToast])
  const error   = useCallback((msg) => showToast(msg, 'error'),   [showToast])
  const warning = useCallback((msg) => showToast(msg, 'warning'), [showToast])
  const info    = useCallback((msg) => showToast(msg, 'info'),    [showToast])

  const value = {
    toasts: state.toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastContext