import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import type { SessionPlayer } from '../../store/sessionStore'
import { useCopy } from '../../content/useCopy'
import styles from './RankingProcessingScreen.module.css'

interface ScrambledPlayer {
  id: number
  name: string
  displayValue: string
}

const shufflePlayers = (players: SessionPlayer[]): SessionPlayer[] =>
  [...players].sort(() => Math.random() - 0.5)

const createScrambledRows = (players: SessionPlayer[]): ScrambledPlayer[] =>
  shufflePlayers(players).map((player) => ({
    id: player.id,
    name: player.name,
    displayValue: (Math.random() * 1.6).toFixed(2),
  }))

export function RankingProcessingScreen() {
  const navigate = useNavigate()
  const { players } = useSessionStore()
  const copy = useCopy()
  const [activeIndex, setActiveIndex] = useState(0)

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      paymentCompleted: true,
      result: true,
    },
  })

  const completedPlayers = useMemo(
    () => players.filter((player) => player.result !== null),
    [players]
  )
  const [scrambledRows, setScrambledRows] = useState<ScrambledPlayer[]>(() =>
    createScrambledRows(completedPlayers)
  )

  useEffect(() => {
    setScrambledRows(createScrambledRows(completedPlayers))

    const scrambleTimer = setInterval(() => {
      setScrambledRows(createScrambledRows(completedPlayers))
      setActiveIndex(Math.floor(Math.random() * Math.max(completedPlayers.length, 1)))
    }, 80)

    const navigateTimer = setTimeout(() => {
      navigate('/ranking')
    }, 2400)

    return () => {
      clearInterval(scrambleTimer)
      clearTimeout(navigateTimer)
    }
  }, [completedPlayers, navigate])

  return (
    <ScreenShell>
      <div className={styles.processingContainer}>
        <p className={styles.processingLabel}>
          {copy.rankingProcessing.label}
        </p>

        <div className={styles.rankingPreview}>
          {scrambledRows.map((player, index) => (
            <div
              key={player.id}
              className={`${styles.previewRow} ${
                activeIndex === index ? styles.previewRowActive : ''
              }`}
            >
              <span className={styles.previewName}>{player.name}</span>
              <span className={styles.previewValue}>
                {player.displayValue}
                <span className={styles.previewUnit}>{copy.common.unit}</span>
              </span>
            </div>
          ))}
        </div>

        <div className={styles.animatedLoader}>
          <div className={styles.loaderDot}></div>
          <div className={styles.loaderDot}></div>
          <div className={styles.loaderDot}></div>
        </div>

        <p className={styles.analyzeText}>
          {copy.rankingProcessing.analyzeText}
        </p>
      </div>
    </ScreenShell>
  )
}
