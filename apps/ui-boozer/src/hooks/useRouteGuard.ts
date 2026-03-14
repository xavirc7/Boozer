import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../store/sessionStore'

interface RouteGuardConfig {
  requiredState?: {
    language?: boolean
    gameMode?: boolean
    playerName?: boolean
    paymentCompleted?: boolean
    result?: boolean
  }
}

/**
 * Hook to protect routes based on required session state.
 * Redirects to an earlier screen if prerequisites aren't met.
 */
export function useRouteGuard(config: RouteGuardConfig) {
  const navigate = useNavigate()
  const { language, gameMode, playerName, paymentCompleted, result } =
    useSessionStore()

  useEffect(() => {
    const { requiredState } = config

    if (!requiredState) return

    if (requiredState.language && !language) {
      navigate('/language')
      return
    }

    if (requiredState.gameMode && !gameMode) {
      navigate('/mode')
      return
    }

    if (requiredState.playerName && !playerName) {
      navigate('/name')
      return
    }

    if (requiredState.paymentCompleted && !paymentCompleted) {
      navigate('/payment')
      return
    }

    if (requiredState.result && result === null) {
      navigate('/blow')
      return
    }
  }, [
    config,
    gameMode,
    language,
    navigate,
    paymentCompleted,
    playerName,
    result,
  ])
}
