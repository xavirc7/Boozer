import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import styles from './FinalScreen.module.css'

export function FinalScreen() {
  const navigate = useNavigate()
  const { resetSession } = useSessionStore()

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
    queueMicrotask(() => {
      resetSession()
    })
  }

  return (
    <ScreenShell>
      <div className={styles.finalContainer}>
        <div className={styles.celebrationEmoji}>⚡</div>

        <h1 className={styles.finalMessage}>GRACIAS POR JUGAR</h1>

        <p className={styles.subMessage}>
          DISFRUTA LA NOCHE. NO CONDUZCAS SI HAS BEBIDO.
        </p>

        <button className={styles.restartButton} onClick={handleRestart}>
          VOLVER AL INICIO
        </button>
      </div>
    </ScreenShell>
  )
}
