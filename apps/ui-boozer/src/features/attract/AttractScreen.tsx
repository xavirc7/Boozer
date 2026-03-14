import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { NeonButton } from '../../components/ui/NeonButton'
import styles from './AttractScreen.module.css'

export function AttractScreen() {
  const navigate = useNavigate()

  return (
    <ScreenShell
      footer={
        <div className={styles.ctaSection}>
          <NeonButton
            variant="secondary"
            className={styles.startButton}
            onClick={() => navigate('/language')}
          >
            INICIAR TEST
          </NeonButton>
        </div>
      }
    >
      <div className={styles.heroSection}>
        <p className={styles.titleOverline}>Welcome to</p>
        <h1 className={styles.mainTitle}>
          <span>BOOZER</span>
          <span>TEST DE</span>
          <span>BORRACHERA</span>
        </h1>
        <div className={styles.iconWrapper}>🍾</div>
        <p className={styles.subtitle}>TOCA LA PANTALLA</p>
      </div>
    </ScreenShell>
  )
}
