import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { AnimatedNeonCard } from '../../components/ui/AnimatedNeonCard'
import { AnimatedNeonButton } from '../../components/ui/AnimatedNeonButton'
import { BackButton } from '../../components/ui/BackButton'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useSessionStore } from '../../store/sessionStore'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import styles from './GameModeScreen.module.css'

export function GameModeScreen() {
  const navigate = useNavigate()
  const { setGameMode } = useSessionStore()
  const [selectedMode, setSelectedMode] = useState<'solo' | 'group' | null>(null)

  // Protect this route - language must be selected
  useRouteGuard({
    requiredState: {
      language: true,
    },
  })

  const handleContinue = () => {
    if (selectedMode) {
      setGameMode(selectedMode)
      navigate('/name')
    }
  }

  return (
    <>
      <BackButton to="/language" />
      <ScreenWrapper>
        <ScreenShell title="¿CÓMO JUEGAS?">
          <div className={styles.cardGrid}>
            <AnimatedNeonCard
              title="YO SOLO"
              selected={selectedMode === 'solo'}
              onClick={() => setSelectedMode('solo')}
              accent="cyan"
            >
              👤
            </AnimatedNeonCard>

            <AnimatedNeonCard
              title="CON MI CREW"
              selected={selectedMode === 'group'}
              onClick={() => setSelectedMode('group')}
              accent="magenta"
            >
              👥
            </AnimatedNeonCard>
          </div>

          {selectedMode && (
            <div className={styles.continueButton}>
              <AnimatedNeonButton
                variant="primary"
                className={styles.continueCta}
                fullWidth
                onClick={handleContinue}
              >
                SEGUIR
              </AnimatedNeonButton>
            </div>
          )}
        </ScreenShell>
      </ScreenWrapper>
    </>
  )
}
