import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { AnimatedNeonCard } from '../../components/ui/AnimatedNeonCard'
import { AnimatedNeonButton } from '../../components/ui/AnimatedNeonButton'
import { useSessionStore } from '../../store/sessionStore'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import styles from './LanguageScreen.module.css'

export function LanguageScreen() {
  const navigate = useNavigate()
  const { setLanguage } = useSessionStore()
  const [selectedLang, setSelectedLang] = useState<'es' | 'en' | null>(null)

  const handleContinue = () => {
    if (selectedLang) {
      setLanguage(selectedLang)
      navigate('/mode')
    }
  }

  return (
    <ScreenWrapper>
      <ScreenShell title="IDIOMA / LANGUAGE">
        <div className={styles.cardGrid}>
          <AnimatedNeonCard
            title="ESPAÑOL"
            selected={selectedLang === 'es'}
            onClick={() => setSelectedLang('es')}
          >
            🇪🇸
          </AnimatedNeonCard>

          <AnimatedNeonCard
            title="ENGLISH"
            selected={selectedLang === 'en'}
            onClick={() => setSelectedLang('en')}
          >
            🇺🇸
          </AnimatedNeonCard>
        </div>

        {selectedLang && (
          <div className={styles.continueButton}>
            <AnimatedNeonButton
              variant="primary"
              className={styles.continueCta}
              fullWidth
              onClick={handleContinue}
            >
              CONTINUAR
            </AnimatedNeonButton>
          </div>
        )}
      </ScreenShell>
    </ScreenWrapper>
  )
}
