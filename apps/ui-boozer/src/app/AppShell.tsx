import { useInactivityReset } from '../hooks/useInactivityReset'

interface AppShellProps {
  children: React.ReactNode
  inactivityTimeoutMs?: number
}

/**
 * App shell wrapper that handles inactivity reset.
 * Resets the kiosk to attract screen after user inactivity.
 */
export function AppShell({
  children,
  inactivityTimeoutMs = 120000, // 2 minutes default
}: AppShellProps) {
  // Enable inactivity reset (2 minutes = 120000ms)
  useInactivityReset(inactivityTimeoutMs)

  return <>{children}</>
}
