import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { NeonButton } from '../../components/ui/NeonButton'
import { useCopy } from '../../content/useCopy'
import styles from './AttractScreen.module.css'

export function AttractScreen() {
  const navigate = useNavigate()
  const copy = useCopy()

  return (
    <ScreenShell
      footer={
        <div className={styles.ctaSection}>
          <NeonButton
            variant="secondary"
            className={styles.startButton}
            onClick={() => navigate('/language')}
          >
            {copy.attract.startButton}
          </NeonButton>
        </div>
      }
    >
      <div className={styles.heroSection}>
        <p className={styles.titleOverline}>{copy.attract.overline}</p>
        <h1 className={styles.mainTitle}>
          {copy.attract.titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <div className={styles.iconWrapper}>🍾</div>
        <p className={styles.subtitle}>{copy.attract.touchHint}</p>
      </div>
    </ScreenShell>
  )
}
