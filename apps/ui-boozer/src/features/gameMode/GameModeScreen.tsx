import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { AnimatedNeonCard } from '../../components/ui/AnimatedNeonCard'
import { AnimatedNeonButton } from '../../components/ui/AnimatedNeonButton'
import { BackButton } from '../../components/ui/BackButton'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useSessionStore } from '../../store/sessionStore'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useCopy } from '../../content/useCopy'
import styles from './GameModeScreen.module.css'

export function GameModeScreen() {
  const navigate = useNavigate()
  const { setGameMode, setPlayerCount } = useSessionStore()
  const copy = useCopy()
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
      if (selectedMode === 'solo') {
        setPlayerCount(1)
        navigate('/payment')
        return
      }

      navigate('/crew-size')
    }
  }

  return (
    <>
      <BackButton to="/language" />
      <ScreenWrapper>
        <ScreenShell title={copy.gameMode.title}>
          <div className={styles.cardGrid}>
            <AnimatedNeonCard
              title={copy.gameMode.solo}
              selected={selectedMode === 'solo'}
              onClick={() => setSelectedMode('solo')}
              accent="cyan"
            >
              👤
            </AnimatedNeonCard>

            <AnimatedNeonCard
              title={copy.gameMode.group}
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
                {copy.gameMode.continueButton}
              </AnimatedNeonButton>
            </div>
          )}
        </ScreenShell>
      </ScreenWrapper>
    </>
  )
}
