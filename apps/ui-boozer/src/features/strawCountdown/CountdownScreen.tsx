import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import styles from './CountdownScreen.module.css'

export function CountdownScreen() {
  const navigate = useNavigate()
  const [count, setCount] = useState(3)

  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      playerName: true,
      paymentCompleted: true,
    },
  })

  useEffect(() => {
    if (count <= 0) {
      navigate('/blow')
      return
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, navigate])

  return (
    <ScreenShell>
      <div className={styles.countdownContainer}>
        <p className={styles.countdownLabel}>COGE LA PAJITA</p>
        <div className={styles.countdownIcon}>🥤</div>
        {count > 0 ? (
          <p className={styles.countdownNumber}>{count}</p>
        ) : (
          <p className={styles.readyText}>¡YA!</p>
        )}
      </div>
    </ScreenShell>
  )
}
