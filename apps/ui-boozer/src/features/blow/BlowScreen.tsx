import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { NeonButton } from '../../components/ui/NeonButton'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import { apiServices } from '../../services/api'
import { interpolate, useCopy } from '../../content/useCopy'
import styles from './BlowScreen.module.css'

export function BlowScreen() {
  const navigate = useNavigate()
  const { advanceToNextPlayer, currentPlayerIndex, playerCount, playerName, paymentId, setResult } = useSessionStore()
  const copy = useCopy()
  const [error, setError] = useState(false)
  const [complete, setComplete] = useState(false)
  const [retry, setRetry] = useState(0)
  useRouteGuard({ requiredState: { language: true, gameMode: true, playerName: true, paymentCompleted: true } })

  useEffect(() => {
    if (!paymentId) { navigate('/payment'); return }
    let active = true
    let navigationTimer: ReturnType<typeof setTimeout> | undefined
    setError(false)
    setComplete(false)
    apiServices.result.listenBreathalyzer(paymentId, currentPlayerIndex).then((result) => {
      if (!active) return
      setResult(result.bac_level)
      setComplete(true)
      navigationTimer = setTimeout(() => {
        if (playerCount === 1) navigate('/processing')
        else if (currentPlayerIndex < playerCount - 1) {
          advanceToNextPlayer()
          navigate('/name')
        } else navigate('/ranking-processing')
      }, 300)
    }).catch(() => { if (active) setError(true) })
    return () => { active = false; clearTimeout(navigationTimer) }
  }, [paymentId, currentPlayerIndex, playerCount, advanceToNextPlayer, navigate, setResult, retry])

  return (
    <ScreenShell>
      <div className={styles.blowContainer}>
        <p className={styles.instruction}>
          {playerCount > 1 ? interpolate(copy.blow.groupInstructionTemplate, { name: playerName }) : copy.blow.singleInstruction}
        </p>
        <div className={styles.visualizer} aria-hidden="true">
          <div className={styles.breathIcon}>🌬️</div>
          <div className={styles.bars}>
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} className={`${styles.bar} ${complete ? styles.barActive : !error ? styles.barWaiting : ''}`} style={{ animationDelay: `${index * 0.12}s` }} />
            ))}
          </div>
        </div>
        <p className={styles.progressText} role="status">
          {error ? copy.blow.error : complete ? copy.blow.complete : copy.blow.waiting}
        </p>
        {error && <NeonButton onClick={() => setRetry((value) => value + 1)}>{copy.blow.retryButton}</NeonButton>}
      </div>
    </ScreenShell>
  )
}
