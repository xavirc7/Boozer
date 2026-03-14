import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { BackButton } from '../../components/ui/BackButton'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useSessionStore } from '../../store/sessionStore'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { hardwareService } from '../../services/hardware'
import styles from './PaymentScreen.module.css'

const PRICE = '1€'
const PRICE_AMOUNT = 1.0
const PRICE_CURRENCY = 'EUR'

export function PaymentScreen() {
  const navigate = useNavigate()
  const { setPaymentCompleted } = useSessionStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Protect this route - player name must be set
  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
      playerName: true,
    },
  })

  useEffect(() => {
    let isActive = true
    let navigationTimer: ReturnType<typeof setTimeout> | null = null

    const processPayment = async () => {
      setIsProcessing(true)
      try {
        const result = await hardwareService.paymentTerminal.startPayment(
          PRICE_AMOUNT,
          PRICE_CURRENCY
        )

        if (!isActive) return

        if (result.success) {
          setError(null)
          setPaymentCompleted(true)
          navigationTimer = setTimeout(() => {
            navigate('/countdown')
          }, 500)
        } else {
          setError(result.errorMessage || 'Payment failed. Please try again.')
          setIsProcessing(false)
        }
      } catch {
        if (!isActive) return
        setError('Payment error. Please try again.')
        setIsProcessing(false)
      }
    }

    processPayment()

    return () => {
      isActive = false
      if (navigationTimer) {
        clearTimeout(navigationTimer)
      }
      void hardwareService.paymentTerminal.cancelPayment()
    }
  }, [navigate, setPaymentCompleted])

  const handleRetry = async () => {
    setError(null)
    setIsProcessing(true)

    try {
      const result = await hardwareService.paymentTerminal.startPayment(
        PRICE_AMOUNT,
        PRICE_CURRENCY
      )

      if (result.success) {
        setPaymentCompleted(true)
        setTimeout(() => {
          navigate('/countdown')
        }, 500)
      } else {
        setError(result.errorMessage || 'Payment failed. Please try again.')
        setIsProcessing(false)
      }
    } catch {
      setError('Payment error. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <BackButton to="/name" />
      <ScreenWrapper>
        <ScreenShell title="PAGA Y SOPLA">
          <div className={styles.paymentContainer}>
            <div className={styles.cardIcon}>💳</div>
            <div className={styles.priceCard}>
              <p className={styles.priceAmount}>{PRICE}</p>
            </div>

            <div className={styles.instructionsContainer}>
              <h3 className={styles.instructionTitle}>ACERCA TU TARJETA</h3>
              <p className={styles.instructionText}>PAGO SEGURO Y RÁPIDO</p>
            </div>

            {isProcessing && !error && (
              <div className={styles.processingIndicator}>
                <div className={styles.processingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className={styles.processingText}>PROCESANDO...</p>
              </div>
            )}

            {error && (
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.actionButton} ${styles.retryButton}`}
                  onClick={handleRetry}
                  disabled={isProcessing}
                >
                  REINTENTAR PAGO
                </button>
              </div>
            )}

            {error && (
              <div className={styles.errorMessage}>
                <p className={styles.errorText}>{error}</p>
              </div>
            )}
          </div>
        </ScreenShell>
      </ScreenWrapper>
    </>
  )
}
