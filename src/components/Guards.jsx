import { Navigate, useLocation } from 'react-router-dom'
import { usePulse } from '../context/PulseContext'
import { AccessDeniedPage } from '../pages/StatusPages'
import { hasRecentLogoutRedirect } from '../services/storageService'

export function ProtectedRoute({ children, role }) {
  const { currentUser } = usePulse()
  const loc = useLocation()
  if (!currentUser) return hasRecentLogoutRedirect()
    ? <Navigate to="/" replace />
    : <AccessDeniedPage authenticationRequired />

  const isCommandUser = ['admin', 'dispatcher'].includes(currentUser.role)
  if (role === 'admin' && !isCommandUser) return <AccessDeniedPage />
  if (role === 'citizen' && currentUser.role !== 'citizen') return <AccessDeniedPage />
  if (currentUser.role === 'citizen' && !currentUser.profileComplete && loc.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />
  return children
}
