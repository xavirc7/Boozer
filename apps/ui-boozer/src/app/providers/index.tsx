import { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  // TODO: Add Zustand store provider, theme provider, etc.
  return <>{children}</>
}
