import assert from 'node:assert/strict'
import { test } from 'node:test'
import { startPaymentCountdown } from '../src/features/payment/paymentCountdown'

test('timeout screen starts at 10 and returns home exactly once after ten seconds', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
  let remaining = -1
  let returns = 0
  startPaymentCountdown(10, (seconds) => { remaining = seconds }, () => { returns++ })
  assert.equal(remaining, 10)
  t.mock.timers.tick(1000)
  assert.equal(remaining, 9)
  t.mock.timers.tick(8999)
  assert.equal(returns, 0)
  t.mock.timers.tick(1)
  assert.equal(returns, 1)
  t.mock.timers.tick(20000)
  assert.equal(returns, 1)
})

test('Realizar pago before the deadline cancels the old timer and only admits one retry', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
  let returns = 0
  const countdown = startPaymentCountdown(10, () => {}, () => { returns++ })
  t.mock.timers.tick(9999)
  assert.equal(countdown.tryResume(), true)
  assert.equal(countdown.tryResume(), false)
  t.mock.timers.tick(30000)
  assert.equal(returns, 0)
})

test('a click after the wall-clock deadline cannot start a payment even if timers were throttled', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
  let returns = 0
  const countdown = startPaymentCountdown(10, () => {}, () => { returns++ })
  t.mock.timers.setTime(Date.now() + 10001)
  assert.equal(countdown.tryResume(), false)
  assert.equal(returns, 1)
})

test('unmount and StrictMode cleanup leave no old return-to-home callback running', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
  let returns = 0
  const countdown = startPaymentCountdown(10, () => {}, () => { returns++ })
  countdown.stop()
  t.mock.timers.tick(15000)
  assert.equal(returns, 0)
})

test('rejection notice lasts seven seconds before returning home', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
  let returns = 0
  startPaymentCountdown(7, () => {}, () => { returns++ })
  t.mock.timers.tick(6999)
  assert.equal(returns, 0)
  t.mock.timers.tick(1)
  assert.equal(returns, 1)
})
