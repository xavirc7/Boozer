import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../store/sessionStore'

/**
 * Hook to reset the app to attract screen after user inactivity.
 * Listens for user interactions and resets the session if timeout is exceeded.
 */
export function useInactivityReset(timeoutMs: number = 120000) {
  const navigate = useNavigate()
  const { resetSession, paymentInFlight } = useSessionStore()
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetInactivityTimer = () => {
    // Clear existing timer
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    // Set new timer
    timeoutIdRef.current = setTimeout(() => {
      // An unresolved charge must be resolved by the payment screen first.
      if (useSessionStore.getState().paymentInFlight) return
      // Reset session and navigate to attract screen
      resetSession()
      navigate('/')
    }, timeoutMs)
  }

  useEffect(() => {
    // Start initial timer
    resetInactivityTimer()

    // Listen for user interactions
    const handleActivity = () => {
      resetInactivityTimer()
    }

    const events = ['click', 'touchstart', 'keydown', 'mousemove']

    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [navigate, resetSession, timeoutMs, paymentInFlight])
}
