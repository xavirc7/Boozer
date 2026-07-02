import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { NeonButton } from '../../components/ui/NeonButton'
import { useSessionStore } from '../../store/sessionStore'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { interpolate, useCopy } from '../../content/useCopy'
import styles from './PlayerNameScreen.module.css'

export function PlayerNameScreen() {
  const navigate = useNavigate()
  const { currentPlayerIndex, playerCount, players, setPlayerName } =
    useSessionStore()
  const copy = useCopy()
  const [name, setName] = useState('')

  // Protect this route - payment must be completed before collecting names
  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      paymentCompleted: true,
    },
  })

  const defaultName = interpolate(copy.playerName.defaultNameTemplate, {
    number: currentPlayerIndex + 1,
  })
  const usedNicknames = new Set(
    players
      .slice(0, currentPlayerIndex)
      .map((player) => player.name.trim().toUpperCase())
      .filter(Boolean)
  )
  const availableNicknames = copy.playerName.nicknames.filter(
    (suggestion) => !usedNicknames.has(suggestion.trim().toUpperCase())
  )

  const handleContinue = () => {
    const finalName = name.trim() || defaultName
    setPlayerName(finalName)
    navigate('/countdown')
  }

  const handleSkip = () => {
    setPlayerName(defaultName)
    navigate('/countdown')
  }

  const handleSuggestion = (suggestion: string) => {
    setName(suggestion)
  }

  return (
    <ScreenShell
      title={copy.playerName.title}
      subtitle={interpolate(copy.playerName.subtitleTemplate, {
        current: currentPlayerIndex + 1,
        total: playerCount,
      })}
    >
      <div className={styles.inputSection}>
        <input
          type="text"
          className={styles.textInput}
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder={copy.playerName.placeholder}
          maxLength={20}
          autoFocus
        />

        <div className={styles.suggestionsSection}>
          <p className={styles.suggestionLabel}>
            {copy.playerName.suggestionLabel}
          </p>
          <div className={styles.suggestionsContainer}>
            {availableNicknames.map((suggestion) => (
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
              {copy.playerName.anonymous}
            </NeonButton>
          </div>
          <div className={styles.skipBtn}>
            <NeonButton
              variant="primary"
              className={styles.continueButton}
              fullWidth
              onClick={handleContinue}
            >
              {copy.playerName.goButton}
            </NeonButton>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}
