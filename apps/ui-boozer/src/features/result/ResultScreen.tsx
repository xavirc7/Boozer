import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import { mapBacToResult } from '../../utils/resultMapper'
import styles from './ResultScreen.module.css'

export function ResultScreen() {
  const navigate = useNavigate()
  const { result } = useSessionStore()

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      playerName: true,
      paymentCompleted: true,
      result: true,
    },
  })

  if (result === null) {
    return null
  }

  const mappedResult = mapBacToResult(result)
  const labelClass = mappedResult.label.toLowerCase()
  const moodEmoji =
    mappedResult.label === 'SAFE'
      ? '😎'
      : mappedResult.label === 'WARNING'
        ? '🥴'
        : '🤪'
  const resultTitle =
    mappedResult.label === 'SAFE'
      ? 'TODO OK'
      : mappedResult.label === 'WARNING'
        ? 'OJITO'
        : 'MUY BORRACHO'

  return (
    <ScreenShell>
      <div className={styles.resultContainer}>
        <p className={styles.emoji}>{moodEmoji}</p>
        <p className={`${styles.bacValue} ${styles[labelClass]}`}>
          {mappedResult.bac.toFixed(2)}
          <span className={styles.unit}>g/l</span>
        </p>

        <p className={`${styles.resultLabel} ${styles[labelClass]}`}>
          {resultTitle}
        </p>

        <p className={styles.messageText}>{mappedResult.message}</p>

        <div className={styles.utilityButtons}>
          <button type="button" className={styles.shareBtn}>
            📱 COMPARTE
          </button>
          <button type="button" className={styles.rankingBtn}>
            🏆 VER RANKING
          </button>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.finishBtn}
            onClick={() => navigate('/countdown')}
          >
            OTRA VEZ
          </button>
          <button
            className={styles.tryAgainBtn}
            onClick={() => navigate('/final')}
          >
            FIN
          </button>
        </div>
      </div>
    </ScreenShell>
  )
}
