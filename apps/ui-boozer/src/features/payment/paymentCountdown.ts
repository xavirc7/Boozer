/** Wall-clock deadline: background throttling must not extend the retry window. */
export function startPaymentCountdown(seconds: number, onTick: (seconds: number) => void, onExpire: () => void) {
  const deadline = Date.now() + seconds * 1000
  let stopped = false
  const stop = () => {
    stopped = true
    clearInterval(interval)
    clearTimeout(timeout)
  }
  const expire = () => {
    if (stopped) return
    stop()
    onExpire()
  }
  const interval = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
    onTick(remaining)
    if (remaining === 0) expire()
  }, 250)
  const timeout = setTimeout(expire, seconds * 1000)
  onTick(seconds)
  return {
    stop,
    tryResume() {
      if (stopped) return false
      if (Date.now() >= deadline) { expire(); return false }
      stop()
      return true
    },
  }
}
