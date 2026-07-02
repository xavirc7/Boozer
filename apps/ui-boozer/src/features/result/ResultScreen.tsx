import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import { mapBacToResult } from '../../utils/resultMapper'
import { useCopy } from '../../content/useCopy'
import styles from './ResultScreen.module.css'

export function ResultScreen() {
  const navigate = useNavigate()
  const { result } = useSessionStore()
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
  const resultTitle = copy.result.titles[mappedResult.label]
  const resultMessage = copy.result.messages[mappedResult.label]

  return (
    <ScreenShell>
      <div className={styles.resultContainer}>
        <p className={styles.emoji}>{moodEmoji}</p>
        <p className={`${styles.bacValue} ${styles[labelClass]}`}>
          {mappedResult.bac.toFixed(2)}
          <span className={styles.unit}>{copy.common.unit}</span>
        </p>

        <p className={`${styles.resultLabel} ${styles[labelClass]}`}>
          {resultTitle}
        </p>

        <p className={styles.messageText}>{resultMessage}</p>

        <div className={styles.buttonGroup}>
          <button className={styles.tryAgainBtn} onClick={() => navigate('/final')}>
            {copy.result.finishButton}
          </button>
        </div>
      </div>
    </ScreenShell>
  )
}
