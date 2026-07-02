import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import { useCopy } from '../../content/useCopy'
import styles from './FinalScreen.module.css'

export function FinalScreen() {
  const navigate = useNavigate()
  const { resetSession } = useSessionStore()
  const copy = useCopy()

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      playerName: true,
      paymentCompleted: true,
      result: true,
    },
  })

  const handleRestart = () => {
    navigate('/', { replace: true })
    window.setTimeout(() => {
      resetSession()
    }, 0)
  }

  return (
    <ScreenShell>
      <div className={styles.finalContainer}>
        <div className={styles.celebrationEmoji}>⚡</div>

        <h1 className={styles.finalMessage}>{copy.final.message}</h1>

        <p className={styles.subMessage}>{copy.final.subMessage}</p>

        <button className={styles.restartButton} onClick={handleRestart}>
          {copy.final.restartButton}
        </button>
      </div>
    </ScreenShell>
  )
}
