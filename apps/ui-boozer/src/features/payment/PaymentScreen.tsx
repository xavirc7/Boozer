import { useEffect, useRef, useState } from 'react'
import { useBeforeUnload, useBlocker, useNavigate } from 'react-router-dom'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { BackButton } from '../../components/ui/BackButton'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { useSessionStore } from '../../store/sessionStore'
import { useRouteGuard } from '../../hooks/useRouteGuard'
import { apiServices } from '../../services/api'
import type { PaymentResponse } from '../../services/api'
import { useCopy } from '../../content/useCopy'
import styles from './PaymentScreen.module.css'
import { PaymentOutcomeScreen } from './PaymentOutcomeScreen'

const PRICE_PER_PLAYER = 1

type Phase = 'waiting' | 'processing' | 'cancelling' | 'rejected' | 'cancelled' | 'timed_out' | 'error'

export function PaymentScreen() {
  const navigate = useNavigate()
  const { language, gameMode, playerCount, setPaymentId, setPaymentInFlight, setPaymentCompleted } = useSessionStore()
  const copy = useCopy()
  const [attemptId, setAttemptId] = useState(() => useSessionStore.getState().paymentId ?? crypto.randomUUID())
  const [retry, setRetry] = useState(0)
  const [phase, setPhase] = useState<Phase>('waiting')
  const allowExit = useRef(false)
  const cancelling = useRef(false)
  const finished = useRef(false)
  const totalPrice = PRICE_PER_PLAYER * playerCount
  const backRoute = gameMode === 'group' ? '/crew-size' : '/mode'
  const isProcessing = phase === 'waiting' || phase === 'processing' || phase === 'cancelling'
  const error = phase === 'error' ? copy.payment.unknown
    : phase === 'rejected' ? copy.payment.failed
    : phase === 'cancelled' ? copy.payment.cancelled : null

  useRouteGuard({ requiredState: { language: true, gameMode: true } })

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    Boolean(language && gameMode && !allowExit.current && currentLocation.pathname !== nextLocation.pathname)
  )
  const blockerRef = useRef(blocker)
  blockerRef.current = blocker

  useBeforeUnload((event) => {
    if (useSessionStore.getState().paymentInFlight) {
      event.preventDefault()
      event.returnValue = ''
    }
  })

  const acceptPayment = () => {
    if (finished.current) return
    finished.current = true
    allowExit.current = true
    setPaymentInFlight(false)
    setPaymentCompleted(true)
    if (blockerRef.current.state === 'blocked') blockerRef.current.reset()
    navigate('/name', { replace: true })
  }
  const acceptRef = useRef(acceptPayment)
  acceptRef.current = acceptPayment

  useEffect(() => {
    if (!language || !gameMode) return
    let active = true
    setPaymentId(attemptId)
    setPaymentInFlight(true)
    setPaymentCompleted(false)
    apiServices.payment.startPayment({
      transaction_id: attemptId,
      amount: totalPrice,
      player_count: playerCount,
    }).then((result: PaymentResponse) => {
      if (!active || finished.current) return
      if (result.status === 'accepted') {
        acceptRef.current()
      } else if (!cancelling.current && (result.status === 'rejected' || result.status === 'cancelled')) {
        allowExit.current = true
        setPaymentInFlight(false)
        setPaymentId(null)
        setPhase(result.status === 'cancelled' && result.reason === 'timeout' ? 'timed_out' : result.status)
      }
    }).catch(() => {
      if (active && !finished.current && !cancelling.current) setPhase('error')
      // A transport error does not establish whether the terminal charged the card.
    })
    return () => { active = false }
    // Never cancel in effect cleanup: StrictMode also invokes cleanup during mount.
  }, [attemptId, retry, language, gameMode, totalPrice, playerCount, setPaymentId, setPaymentInFlight, setPaymentCompleted])

  useEffect(() => {
    if (blocker.state !== 'blocked' || cancelling.current || finished.current) return
    cancelling.current = true
    setPhase('cancelling')
    apiServices.payment.cancelPayment(attemptId).then((result) => {
      if (finished.current) return
      if (result.status === 'accepted') {
        acceptRef.current()
      } else if (result.status === 'rejected' || (result.status === 'cancelled' && result.reason === 'timeout')) {
        // A final response can race with the user's Back action; still show its outcome.
        allowExit.current = true
        setPaymentInFlight(false)
        setPaymentId(null)
        blocker.reset()
        setPhase(result.status === 'rejected' ? 'rejected' : 'timed_out')
      } else if (result.status === 'cancelled') {
        finished.current = true
        allowExit.current = true
        setPaymentInFlight(false)
        setPaymentId(null)
        blocker.proceed()
      } else {
        // A card was already presented. Stay here and wait for the charge result.
        setPhase('processing')
        blocker.reset()
        setRetry((value) => value + 1)
      }
    }).catch(() => {
      if (!finished.current) {
        setPhase('error')
        blocker.reset()
      }
    }).finally(() => { cancelling.current = false })
  }, [blocker, attemptId, setPaymentId, setPaymentInFlight])

  const handleRetry = () => {
    if (isProcessing || phase === 'rejected') return
    allowExit.current = false
    setPhase('waiting')
    if (phase === 'error') {
      // Reattach to the existing attempt; never create another charge on uncertainty.
      setRetry((value) => value + 1)
    } else {
      setAttemptId(crypto.randomUUID())
    }
  }

  const returnToStart = () => {
    if (finished.current) return
    finished.current = true
    allowExit.current = true
    if (blockerRef.current.state === 'blocked') blockerRef.current.reset()
    navigate('/', { replace: true })
    useSessionStore.getState().resetSession()
  }

  if (phase === 'rejected' || phase === 'timed_out') {
    return <PaymentOutcomeScreen kind={phase} onReturnToStart={returnToStart} onRetry={handleRetry} />
  }

  return (
    <>
      <BackButton to={backRoute} disabled={phase === 'cancelling' || phase === 'processing'} />
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
                <p className={styles.processingText}>{phase === 'cancelling' ? copy.payment.cancelling : phase === 'processing' ? copy.payment.cannotCancel : copy.payment.processing}</p>
              </div>
            )}

            {error && (
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.actionButton} ${styles.retryButton}`}
                  onClick={handleRetry}
                  disabled={isProcessing}
                >
                  {phase === 'error' ? copy.payment.checkButton : copy.payment.retryButton}
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
