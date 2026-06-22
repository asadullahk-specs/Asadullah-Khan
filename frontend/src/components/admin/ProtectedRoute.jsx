import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkingSession } = useAuth()
  const location = useLocation()

  // Avoid a flash-redirect to /admin/login while we're still verifying a
  // token that was found in localStorage on page load.
  if (checkingSession) {
    return (
      <div className="min-h-screen grid place-items-center bg-lightBg dark:bg-darkBg">
        <p className="text-sm text-lightText dark:text-darkText">Checking session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return children
}
