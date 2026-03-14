import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { useSessionStore } from '../../store/sessionStore'
import { mapBacToResult } from '../../utils/resultMapper'
import styles from './ProcessingScreen.module.css'

export function ProcessingScreen() {
  const navigate = useNavigate()
  const { result, setResultLabel } = useSessionStore()
  const [displayValue, setDisplayValue] = useState('0.00')

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      playerName: true,
      paymentCompleted: true,
      result: true,
    },
  })

  useEffect(() => {
    if (result === null) {
      navigate('/blow')
      return
    }

    setDisplayValue('0.00')

    const randomValueTimer = setInterval(() => {
      const randomValue = Math.random() * 1.6
      setDisplayValue(randomValue.toFixed(2))
    }, 65)

    const settleTimer = setTimeout(() => {
      clearInterval(randomValueTimer)
      setDisplayValue(result.toFixed(2))
    }, 1500)

    const navigateTimer = setTimeout(() => {
      setResultLabel(mapBacToResult(result).label)
      navigate('/result')
    }, 2050)

    return () => {
      clearInterval(randomValueTimer)
      clearTimeout(settleTimer)
      clearTimeout(navigateTimer)
    }
  }, [navigate, result, setResultLabel])

  return (
    <ScreenShell>
      <div className={styles.processingContainer}>
        <p className={styles.processingLabel}>ANALIZANDO...</p>

        <p className={styles.previewValue}>
          {displayValue}
          <span className={styles.previewUnit}>g/l</span>
        </p>

        <div className={styles.animatedLoader}>
          <div className={styles.loaderDot}></div>
          <div className={styles.loaderDot}></div>
          <div className={styles.loaderDot}></div>
        </div>

        <p className={styles.analyzeText}>CALCULANDO TU NIVEL</p>
      </div>
    </ScreenShell>
  )
}
