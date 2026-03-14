import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { NeonButton } from '../../components/ui/NeonButton'
import { BackButton } from '../../components/ui/BackButton'
import { useSessionStore } from '../../store/sessionStore'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import styles from './PlayerNameScreen.module.css'

const NICKNAME_SUGGESTIONS = [
  'PARTY KING',
  'DJ SHOTS',
  'LOCA',
  'EL JEFE',
  'FIESTA',
  'TEQUILA',
]

export function PlayerNameScreen() {
  const navigate = useNavigate()
  const { setPlayerName } = useSessionStore()
  const [name, setName] = useState('')

  // Protect this route - game mode must be selected
  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
    },
  })

  const handleContinue = () => {
    const finalName = name.trim() || 'PLAYER'
    setPlayerName(finalName)
    navigate('/payment')
  }

  const handleSkip = () => {
    setPlayerName('PLAYER')
    navigate('/payment')
  }

  const handleSuggestion = (suggestion: string) => {
    setName(suggestion)
  }

  return (
    <>
      <BackButton to="/mode" />
      <ScreenShell title="¿CÓMO TE LLAMAMOS?">
        <div className={styles.inputSection}>
          <input
            type="text"
            className={styles.textInput}
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            placeholder="TU NOMBRE..."
            maxLength={20}
            autoFocus
          />

          <div className={styles.suggestionsSection}>
            <p className={styles.suggestionLabel}>O ELIGE UNO:</p>
            <div className={styles.suggestionsContainer}>
              {NICKNAME_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  className={styles.suggestionChip}
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <div className={styles.continueBtn}>
              <NeonButton
                variant="danger"
                className={styles.skipButton}
                fullWidth
                onClick={handleSkip}
              >
                ANÓNIMO
              </NeonButton>
            </div>
            <div className={styles.skipBtn}>
              <NeonButton
                variant="primary"
                className={styles.continueButton}
                fullWidth
                onClick={handleContinue}
              >
                VAMOS
              </NeonButton>
            </div>
          </div>
        </div>
      </ScreenShell>
    </>
  )
}
