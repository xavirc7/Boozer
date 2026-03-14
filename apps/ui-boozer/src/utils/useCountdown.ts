import { useEffect, useRef, useState } from 'react'

export interface CountdownState {
  /** Current countdown value in seconds */
  seconds: number
  /** Whether countdown has finished */
  isFinished: boolean
  /** Trigger manual reset to initial value */
  reset: () => void
}

/**
 * Custom hook for countdown timer logic
 * Useful for flows like: "Starting in 3... 2... 1..."
 *
 * @param initialSeconds Initial countdown value
 * @param onComplete Optional callback when countdown finishes
 * @returns Countdown state object
 *
 * @example
 * const { seconds, isFinished, reset } = useCountdown(5, () => {
 *   console.log('Countdown finished!')
 * })
 *
 * return <div>Starting in {seconds}s</div>
 */
export const useCountdown = (
  initialSeconds: number,
  onComplete?: () => void
): CountdownState => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isFinished, setIsFinished] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // Update callback ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Main countdown effect
  useEffect(() => {
    // Don't run if already finished
    if (isFinished) return

    // Don't run with invalid initial value
    if (initialSeconds <= 0) {
      setIsFinished(true)
      onCompleteRef.current?.()
      return
    }

    // Set up interval
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1

        // Check if we've reached zero
        if (next <= 0) {
          setIsFinished(true)
          onCompleteRef.current?.()
          return 0
        }

        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [initialSeconds, isFinished])

  const reset = () => {
    setSeconds(initialSeconds)
    setIsFinished(false)
  }

  return {
    seconds,
    isFinished,
    reset,
  }
}

export default useCountdown
