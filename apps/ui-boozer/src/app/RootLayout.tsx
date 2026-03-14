import { Outlet } from 'react-router-dom'
import { useInactivityReset } from '../hooks/useInactivityReset'

/**
 * Root layout wrapper for all app routes.
 * Handles inactivity reset at the app level.
 */
export function RootLayout() {
  // Enable inactivity reset (2 minutes = 120000ms)
  useInactivityReset(120000)

  return <Outlet />
}
