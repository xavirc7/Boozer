import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { AnimatedNeonButton } from '../../components/ui/AnimatedNeonButton'
import { AnimatedNeonCard } from '../../components/ui/AnimatedNeonCard'
import { BackButton } from '../../components/ui/BackButton'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import type { PlayerCount } from '../../store/sessionStore'
import { interpolate, useCopy } from '../../content/useCopy'
import styles from './CrewSizeScreen.module.css'

const CREW_COUNTS: PlayerCount[] = [2, 3, 4, 5]

export function CrewSizeScreen() {
  const navigate = useNavigate()
  const { setPlayerCount } = useSessionStore()
  const copy = useCopy()
  const [selectedCount, setSelectedCount] = useState<PlayerCount>(2)

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
    },
  })

  const handleContinue = () => {
    setPlayerCount(selectedCount)
    navigate('/payment')
  }

  return (
    <>
      <BackButton to="/mode" />
      <ScreenWrapper>
        <ScreenShell title={copy.crewSize.title}>
          <div className={styles.countGrid}>
            {CREW_COUNTS.map((count) => (
              <AnimatedNeonCard
                key={count}
                title={`${count}`}
                subtitle={copy.crewSize.personLabel}
                selected={selectedCount === count}
                onClick={() => setSelectedCount(count)}
                accent={count % 2 === 0 ? 'cyan' : 'magenta'}
              >
                👥
              </AnimatedNeonCard>
            ))}
          </div>

          <div className={styles.summary}>
            <p className={styles.summaryText}>
              {interpolate(copy.crewSize.totalTemplate, { total: selectedCount })}
            </p>
          </div>

          <div className={styles.continueButton}>
            <AnimatedNeonButton
              variant="primary"
              className={styles.continueCta}
              fullWidth
              onClick={handleContinue}
            >
              {copy.crewSize.paymentButton}
            </AnimatedNeonButton>
          </div>
        </ScreenShell>
      </ScreenWrapper>
    </>
  )
}
