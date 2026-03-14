import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import { hardwareService } from '../../services/hardware'
import styles from './BlowScreen.module.css'

export function BlowScreen() {
  const navigate = useNavigate()
  const { setResult } = useSessionStore()
  const [progress, setProgress] = useState(0)

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      playerName: true,
      paymentCompleted: true,
    },
  })

  useEffect(() => {
    let isActive = true
    let navigationTimer: ReturnType<typeof setTimeout> | null = null

    const startTest = async () => {
      const unsubscribe = hardwareService.breathalyzer.listenBreathProgress(
        (event) => {
          if (!isActive) return
          setProgress(event.progress)
        }
      )

      try {
        const result = await hardwareService.breathalyzer.startBreathTest()

        if (isActive && result.isValid) {
          setResult(result.bac)
          navigationTimer = setTimeout(() => {
            navigate('/processing')
          }, 300)
        }
      } finally {
        unsubscribe()
      }
    }

    startTest()

    return () => {
      isActive = false
      if (navigationTimer) {
        clearTimeout(navigationTimer)
      }
      void hardwareService.breathalyzer.stopBreathTest()
    }
  }, [navigate, setResult])

  const progressPercent = Math.round(progress)
  const secondsLeft = Math.max(0, Math.ceil((100 - progressPercent) / 34))
  const bars = Array.from({ length: 8 }, (_, index) => {
    const threshold = ((index + 1) / 8) * 100
    return progressPercent >= threshold
  })

  return (
    <ScreenShell>
      <div className={styles.blowContainer}>
        <p className={styles.instruction}>¡SOPLA FUERTE!</p>
        <div className={styles.visualizer}>
          <div className={styles.breathIcon}>🌬️</div>
          <div className={styles.bars}>
            {bars.map((active, index) => (
              <span
                key={index}
                className={`${styles.bar} ${active ? styles.barActive : ''}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.progressContainer}>
          <ProgressBar
            value={progress}
            variant="cyan"
            showLabel={false}
            height={24}
            className={styles.progressBar}
          />
        </div>

        <p className={styles.progressText}>{secondsLeft}s</p>
        <p className={styles.statusLabel}>
          {progress < 100 ? 'NO PARES' : 'COMPLETO'}
        </p>
      </div>
    </ScreenShell>
  )
}
