import type { PaymentResponse, StartPaymentRequest } from './paymentApi'
import type { BreathResult } from './resultApi'

interface MockOptions {
  cardDelayMs?: number
  paymentDelayMs?: number
  readerTimeoutMs?: number
  cancellationDelayMs?: number
  readingDelayMs?: number
  paymentAccepted?: boolean
  rejectEvery?: number
  timeoutEvery?: number
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Simulates backend responses only. Real terminal timing belongs to the backend. */
export function createMockApiServices(options: MockOptions = {}) {
  const {
    cardDelayMs = 5000,
    paymentDelayMs = 2000,
    readerTimeoutMs = 30000,
    cancellationDelayMs = 300,
    readingDelayMs = 3000,
    paymentAccepted = true,
    rejectEvery = 3,
    timeoutEvery = 4,
  } = options
  type Attempt = {
    request?: StartPaymentRequest
    status: 'waiting' | PaymentResponse['status']
    reason?: PaymentResponse['reason']
    promise: Promise<PaymentResponse>
    finish: (status: 'accepted' | 'rejected' | 'cancelled', reason?: PaymentResponse['reason']) => void
  }
  let attemptCount = 0
  const attempts = new Map<string, Attempt>()
  const readings = new Map<string, Promise<BreathResult>>()

  const payment = {
    startPayment(request: StartPaymentRequest): Promise<PaymentResponse> {
      const existing = attempts.get(request.transaction_id)
      if (existing) {
        if (existing.request && (existing.request.amount !== request.amount || existing.request.player_count !== request.player_count)) {
          return Promise.reject(new Error('Attempt parameters changed'))
        }
        return existing.promise
      }
      if ([...attempts.values()].some((attempt) => attempt.status === 'waiting' || attempt.status === 'processing')) {
        return Promise.reject(new Error('Terminal busy'))
      }
      const attemptNumber = ++attemptCount
      const shouldTimeOut = timeoutEvery > 0 && attemptNumber % timeoutEvery === 0
      const shouldReject = !paymentAccepted || (rejectEvery > 0 && attemptNumber % rejectEvery === 0)
      let settle!: (response: PaymentResponse) => void
      const promise = new Promise<PaymentResponse>((resolve) => { settle = resolve })
      let cardTimer: ReturnType<typeof setTimeout>
      let timeoutTimer: ReturnType<typeof setTimeout>
      const attempt: Attempt = {
        request,
        status: 'waiting',
        promise,
        finish(status, reason) {
          clearTimeout(cardTimer)
          clearTimeout(timeoutTimer)
          attempt.status = status
          attempt.reason = reason
          settle({ transaction_id: request.transaction_id, status, reason })
        },
      }
      attempts.set(request.transaction_id, attempt)
      if (!shouldTimeOut) cardTimer = setTimeout(() => {
        attempt.status = 'processing'
        clearTimeout(timeoutTimer)
        setTimeout(() => attempt.finish(shouldReject ? 'rejected' : 'accepted'), paymentDelayMs)
      }, cardDelayMs)
      timeoutTimer = setTimeout(() => attempt.finish('cancelled', 'timeout'), readerTimeoutMs)
      return promise
    },

    async cancelPayment(transactionId: string): Promise<PaymentResponse> {
      let attempt = attempts.get(transactionId)
      if (!attempt) {
        const response: PaymentResponse = { transaction_id: transactionId, status: 'cancelled', reason: 'user_cancelled' }
        attempt = { status: 'cancelled', reason: 'user_cancelled', promise: Promise.resolve(response), finish() {} }
        attempts.set(transactionId, attempt)
      } else if (attempt.status === 'waiting') {
        attempt.finish('cancelled', 'user_cancelled')
      }
      // Acknowledgement arrives later than the local click, just like a network response.
      await delay(cancellationDelayMs)
      return { transaction_id: transactionId, status: attempt.status as PaymentResponse['status'], reason: attempt.reason }
    },
  }

  const result = {
    listenBreathalyzer(transactionId: string, playerIndex: number): Promise<BreathResult> {
      const attempt = attempts.get(transactionId)
      if (!attempt || attempt.status !== 'accepted' || !attempt.request || !Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= attempt.request.player_count) {
        return Promise.reject(new Error('No accepted payment for this player'))
      }
      const key = `${transactionId}:${playerIndex}`
      if (!readings.has(key)) {
        readings.set(key, delay(readingDelayMs).then(() => ({
          test_id: `mock-${key}`,
          transaction_id: transactionId,
          player_index: playerIndex,
          status: 'completed' as const,
          bac_level: 1.5,
          unit: 'g/l' as const,
        })))
      }
      return readings.get(key)!
    },
  }
  return { payment, result }
}
