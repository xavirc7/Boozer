import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { AnimatedNeonCard } from '../../components/ui/AnimatedNeonCard'
import { AnimatedNeonButton } from '../../components/ui/AnimatedNeonButton'
import { useSessionStore } from '../../store/sessionStore'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useCopy } from '../../content/useCopy'
import styles from './LanguageScreen.module.css'

export function LanguageScreen() {
  const navigate = useNavigate()
  const { setLanguage } = useSessionStore()
  const copy = useCopy()
  const [selectedLang, setSelectedLang] = useState<'es' | 'en' | null>(null)

  const handleContinue = () => {
    if (selectedLang) {
      setLanguage(selectedLang)
      navigate('/mode')
    }
  }

  return (
    <ScreenWrapper>
      <ScreenShell title={copy.language.title}>
        <div className={styles.cardGrid}>
          <AnimatedNeonCard
            title={copy.language.spanish}
            selected={selectedLang === 'es'}
            onClick={() => setSelectedLang('es')}
          >
            🇪🇸
          </AnimatedNeonCard>

          <AnimatedNeonCard
            title={copy.language.english}
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
              {copy.language.continueButton}
            </AnimatedNeonButton>
          </div>
        )}
      </ScreenShell>
    </ScreenWrapper>
  )
}
