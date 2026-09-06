import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createMockApiServices } from '../src/services/api/api.mock'
import { ApiClient } from '../src/services/api/client'
import { PaymentApiService } from '../src/services/api/paymentApi'
import { ResultApiService } from '../src/services/api/resultApi'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const request = (id = 'attempt-1', players = 1) => ({ transaction_id: id, amount: players, player_count: players })

test('cancellation before card waits for confirmation and settles the pending start', async () => {
  const { payment } = createMockApiServices({ cardDelayMs: 1000, cancellationDelayMs: 20 })
  const pending = payment.startPayment(request())
  let acknowledged = false
  const cancellation = payment.cancelPayment('attempt-1').then((result) => { acknowledged = true; return result })
  assert.equal(acknowledged, false)
  assert.equal((await pending).status, 'cancelled')
  assert.equal((await cancellation).status, 'cancelled')
  assert.equal(acknowledged, true)
})

test('a card already presented cannot be cancelled, including while authorization is pending', async () => {
  const { payment } = createMockApiServices({ cardDelayMs: 0, paymentDelayMs: 150, cancellationDelayMs: 0 })
  const pending = payment.startPayment(request())
  await sleep(10)
  assert.equal((await payment.cancelPayment('attempt-1')).status, 'processing')
  assert.equal((await pending).status, 'accepted')
  assert.equal((await payment.cancelPayment('attempt-1')).status, 'accepted')
})

test('reader timeout comes from the simulated backend and does not interrupt an in-progress charge', async () => {
  const timedOut = createMockApiServices({ cardDelayMs: 1000, readerTimeoutMs: 10 })
  assert.equal((await timedOut.payment.startPayment(request())).status, 'cancelled')
  const charging = createMockApiServices({ cardDelayMs: 0, readerTimeoutMs: 10, paymentDelayMs: 30 })
  assert.equal((await charging.payment.startPayment(request())).status, 'accepted')
})

test('rejected payments have a final status and never permit a reading', async () => {
  const api = createMockApiServices({ cardDelayMs: 0, paymentDelayMs: 0, paymentAccepted: false })
  assert.equal((await api.payment.startPayment(request())).status, 'rejected')
  await assert.rejects(api.result.listenBreathalyzer('attempt-1', 0))
})

test('duplicate activation shares the same attempt; late cancellation does not cancel a newer attempt', async () => {
  const api = createMockApiServices({ cardDelayMs: 1000, cancellationDelayMs: 0 })
  const first = api.payment.startPayment(request())
  assert.equal(first, api.payment.startPayment(request()))
  await api.payment.cancelPayment('attempt-1')
  const second = api.payment.startPayment(request('attempt-2'))
  assert.equal((await api.payment.cancelPayment('attempt-1')).status, 'cancelled')
  await assert.rejects(api.payment.startPayment(request('attempt-3')), /busy/)
  assert.equal((await api.payment.cancelPayment('attempt-2')).status, 'cancelled')
  assert.equal((await second).status, 'cancelled')
})

test('cancel arriving before start prevents activation of that attempt', async () => {
  const { payment } = createMockApiServices({ cancellationDelayMs: 0 })
  await payment.cancelPayment('attempt-1')
  assert.equal((await payment.startPayment(request())).status, 'cancelled')
})

test('one payment covers the selected players and replaying a reading returns the same final result', async () => {
  const api = createMockApiServices({ cardDelayMs: 0, paymentDelayMs: 0, readingDelayMs: 0 })
  await api.payment.startPayment(request('group', 2))
  const first = api.result.listenBreathalyzer('group', 0)
  assert.equal(first, api.result.listenBreathalyzer('group', 0))
  const result = await first
  assert.equal(result.unit, 'g/l')
  assert.equal(typeof result.bac_level, 'number')
  assert.notEqual((await api.result.listenBreathalyzer('group', 1)).test_id, result.test_id)
  await assert.rejects(api.result.listenBreathalyzer('group', 2))
})

test('HTTP adapter coalesces in-flight activation and validates final responses', async (t) => {
  let calls = 0
  let settle!: (value: Response) => void
  t.mock.method(globalThis, 'fetch', () => {
    calls++
    return new Promise<Response>((resolve) => { settle = resolve })
  })
  const payment = new PaymentApiService(new ApiClient({ baseUrl: '/api' }))
  const first = payment.startPayment(request())
  const duplicate = payment.startPayment(request())
  assert.equal(calls, 1)
  settle(Response.json({ transaction_id: 'attempt-1', status: 'accepted' }))
  assert.equal((await first).status, 'accepted')
  assert.equal((await duplicate).status, 'accepted')
})

test('transport failure is an error, not a confirmed cancellation', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch') })
  const payment = new PaymentApiService(new ApiClient({ baseUrl: '/api' }))
  await assert.rejects(payment.cancelPayment('attempt-1'), (error: any) => error.code === 'NETWORK_ERROR')
})

test('old pending responses and another attempt ID are rejected by the HTTP adapter', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ transaction_id: 'attempt-1', status: 'pending' }))
  const payment = new PaymentApiService(new ApiClient({ baseUrl: '/api' }))
  await assert.rejects(payment.startPayment(request()), /Unexpected payment response/)
  await assert.rejects(payment.cancelPayment('attempt-2'), /Unexpected payment response/)
})

test('the reading adapter rejects wrong units instead of displaying an incorrectly scaled value', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ transaction_id: 'attempt-1', player_index: 0, status: 'completed', bac_level: 0.15, unit: '%' }))
  const result = new ResultApiService(new ApiClient({ baseUrl: '/api' }))
  await assert.rejects(result.listenBreathalyzer('attempt-1', 0), /Invalid final reading/)
})

test('every third distinct attempt is rejected; repeating an ID does not advance the mock sequence', async () => {
  const api = createMockApiServices({ cardDelayMs: 0, paymentDelayMs: 0, rejectEvery: 3, timeoutEvery: 0 })
  const outcomes = []
  for (let index = 1; index <= 4; index++) {
    const attempt = request(`periodic-${index}`)
    const response = await api.payment.startPayment(attempt)
    outcomes.push(response.status)
    assert.deepEqual(await api.payment.startPayment(attempt), response)
  }
  assert.deepEqual(outcomes, ['accepted', 'accepted', 'rejected', 'accepted'])
})

test('periodic timeout reports its reason and a new attempt can pay again', async () => {
  const api = createMockApiServices({ cardDelayMs: 0, paymentDelayMs: 0, readerTimeoutMs: 10, rejectEvery: 0, timeoutEvery: 2 })
  await api.payment.startPayment(request('first'))
  const timedOut = await api.payment.startPayment(request('second'))
  assert.equal(timedOut.status, 'cancelled')
  assert.equal(timedOut.reason, 'timeout')
  assert.deepEqual(await api.payment.startPayment(request('second')), timedOut)
  assert.equal((await api.payment.startPayment(request('third'))).status, 'accepted')
})

test('manual cancellation is distinguishable from reader timeout', async () => {
  const api = createMockApiServices({ cardDelayMs: 1000, cancellationDelayMs: 0 })
  const pending = api.payment.startPayment(request())
  assert.equal((await api.payment.cancelPayment('attempt-1')).reason, 'user_cancelled')
  assert.equal((await pending).reason, 'user_cancelled')
})
