import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import { mapBacToResult } from '../../utils/resultMapper'
import { useCopy } from '../../content/useCopy'
import styles from './RankingScreen.module.css'

export function RankingScreen() {
  const navigate = useNavigate()
  const { players, playerCount } = useSessionStore()
  const copy = useCopy()

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      paymentCompleted: true,
      result: true,
    },
  })

  const rankedPlayers = [...players]
    .filter((player) => player.result !== null)
    .sort((first, second) => (second.result ?? 0) - (first.result ?? 0))

  if (playerCount <= 1 || rankedPlayers.length === 0) {
    return null
  }

  return (
    <ScreenShell title={copy.ranking.title}>
      <div className={styles.rankingContainer}>
        <div className={styles.list}>
          {rankedPlayers.map((player, index) => {
            const mappedResult = mapBacToResult(player.result ?? 0)
            const labelClass = mappedResult.label.toLowerCase()

            return (
              <div key={player.id} className={styles.row}>
                <span className={styles.position}>#{index + 1}</span>
                <span className={styles.name}>{player.name}</span>
                <span className={`${styles.value} ${styles[labelClass]}`}>
                  {mappedResult.bac.toFixed(2)}
                  <span className={styles.unit}>{copy.common.unit}</span>
                </span>
              </div>
            )
          })}
        </div>

        <button className={styles.finishButton} onClick={() => navigate('/final')}>
          {copy.ranking.finishButton}
        </button>
      </div>
    </ScreenShell>
  )
}
