import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'


// ─── Concept: useAuth() custom hook se token check ───────────
// Agar token nahi → /login par bhejo
// Agar token hai → children render karo (Outlet)
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
    // replace: true → back button /login par nahi jayega
  }

  return <Outlet />
}

export default ProtectedRoute