import { useEffect, useRef, useState } from 'react'
import { ScreenShell } from '../../components/layout/ScreenShell'
import { ScreenWrapper } from '../../components/wrappers/ScreenWrapper'
import { interpolate, useCopy } from '../../content/useCopy'
import { startPaymentCountdown } from './paymentCountdown'
import styles from './PaymentScreen.module.css'

interface Props {
  kind: 'rejected' | 'timed_out'
  onReturnToStart: () => void
  onRetry: () => void
}

export function PaymentOutcomeScreen({ kind, onReturnToStart, onRetry }: Props) {
  const copy = useCopy()
  const seconds = kind === 'timed_out' ? 10 : 7
  const [remaining, setRemaining] = useState(seconds)
  const onExpire = useRef(onReturnToStart)
  onExpire.current = onReturnToStart
  const countdown = useRef<ReturnType<typeof startPaymentCountdown> | null>(null)

  useEffect(() => {
    const timer = startPaymentCountdown(seconds, setRemaining, () => onExpire.current())
    countdown.current = timer
    return timer.stop
  }, [seconds])

  const retry = () => {
    // Disarm synchronously: neither a second tap nor an old timeout can end the new attempt.
    if (countdown.current?.tryResume()) onRetry()
  }

  const timedOut = kind === 'timed_out'
  return (
    <ScreenWrapper>
      <ScreenShell title={copy.payment.title}>
        <div className={`${styles.paymentContainer} ${styles.outcomeContainer}`}>
          <div className={styles.outcomeIcon} aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="24" cy="24" r="19" />
              {timedOut ? <path d="M24 13v12l8 5" /> : <path d="m17 17 14 14m0-14L17 31" />}
            </svg>
          </div>
          <section className={`${styles.priceCard} ${styles.outcomeCard}`} aria-labelledby="payment-outcome-title">
            <h2 id="payment-outcome-title" className={`${styles.instructionTitle} ${styles.outcomeTitle}`}>
              {timedOut ? copy.payment.timeoutTitle : copy.payment.rejectedTitle}
            </h2>
            {timedOut && <p className={styles.countdownNumber} aria-hidden="true">{remaining}</p>}
            <p className={styles.outcomeMessage} role="alert">
              {timedOut ? copy.payment.timeoutMessage : copy.payment.rejectedMessage}
            </p>
          </section>
          <p className={`${styles.processingText} ${styles.outcomeTimer}`} role="timer" aria-live="off">
            {interpolate(copy.payment.returnCountdown, { seconds: remaining })}
          </p>
          {timedOut && (
            <div className={styles.buttonGroup}>
              <button className={`${styles.actionButton} ${styles.outcomeRetryButton}`} onClick={retry}>
                {copy.payment.payAgainButton}
              </button>
            </div>
          )}
        </div>
      </ScreenShell>
    </ScreenWrapper>
  )
}
