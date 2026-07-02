import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { BackButton } from '../../components/ui/BackButton'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useSessionStore } from '../../store/sessionStore'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { hardwareService } from '../../services/hardware'
import { useCopy } from '../../content/useCopy'
import styles from './PaymentScreen.module.css'

const PRICE_PER_PLAYER = 1
const PRICE_CURRENCY = 'EUR'

export function PaymentScreen() {
  const navigate = useNavigate()
  const { gameMode, playerCount, setPaymentCompleted } = useSessionStore()
  const copy = useCopy()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPrice = PRICE_PER_PLAYER * playerCount
  const backRoute = gameMode === 'group' ? '/crew-size' : '/mode'

  // Protect this route - mode and player count must be selected first
  useRouteGuard({
    requiredState: {
      language: true,
      gameMode: true,
    },
  })

  useEffect(() => {
    let isActive = true
    let navigationTimer: ReturnType<typeof setTimeout> | null = null

    const processPayment = async () => {
      setIsProcessing(true)
      try {
        const result = await hardwareService.paymentTerminal.startPayment(
          totalPrice,
          PRICE_CURRENCY
        )

        if (!isActive) return

        if (result.success) {
          setError(null)
          setPaymentCompleted(true)
          navigationTimer = setTimeout(() => {
            navigate('/name')
          }, 500)
        } else {
          setError(copy.payment.failed)
          setIsProcessing(false)
        }
      } catch {
        if (!isActive) return
        setError(copy.payment.error)
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
  }, [navigate, setPaymentCompleted, totalPrice])

  const handleRetry = async () => {
    setError(null)
    setIsProcessing(true)

    try {
      const result = await hardwareService.paymentTerminal.startPayment(
        totalPrice,
        PRICE_CURRENCY
      )

      if (result.success) {
        setPaymentCompleted(true)
        setTimeout(() => {
          navigate('/name')
        }, 500)
      } else {
        setError(copy.payment.failed)
        setIsProcessing(false)
      }
    } catch {
      setError(copy.payment.error)
      setIsProcessing(false)
    }
  }

  return (
    <>
      <BackButton to={backRoute} />
      <ScreenWrapper>
        <ScreenShell title={copy.payment.title}>
          <div className={styles.paymentContainer}>
            <div className={styles.cardIcon}>💳</div>
            <div className={styles.priceCard}>
              <p className={styles.priceAmount}>{totalPrice}€</p>
              <p className={styles.priceDetail}>
                {playerCount} x {PRICE_PER_PLAYER}€
              </p>
            </div>

            <div className={styles.instructionsContainer}>
              <h3 className={styles.instructionTitle}>
                {copy.payment.instructionTitle}
              </h3>
              <p className={styles.instructionText}>
                {copy.payment.instructionText}
              </p>
            </div>

            {isProcessing && !error && (
              <div className={styles.processingIndicator}>
                <div className={styles.processingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className={styles.processingText}>{copy.payment.processing}</p>
              </div>
            )}

            {error && (
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.actionButton} ${styles.retryButton}`}
                  onClick={handleRetry}
                  disabled={isProcessing}
                >
                  {copy.payment.retryButton}
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
