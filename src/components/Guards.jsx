import { Navigate, useLocation } from 'react-router-dom'
import { usePulse } from '../context/PulseContext'

export function ProtectedRoute({ children, role }) {
  const { currentUser } = usePulse()
  const loc = useLocation()
  if (!currentUser) return <Navigate to="/login" replace state={{ from: loc.pathname }} />

  const isCommandUser = ['admin', 'dispatcher'].includes(currentUser.role)
  if (role === 'admin' && !isCommandUser) return <Navigate to="/app" replace />
  if (role === 'citizen' && currentUser.role !== 'citizen') return <Navigate to="/command" replace />
  if (currentUser.role === 'citizen' && !currentUser.profileComplete && loc.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />
  return children
}
