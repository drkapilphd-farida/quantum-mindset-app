import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signTestToken, verifyTestToken } from './testToken'

describe('Reading Speed Test tokens', () => {
  beforeEach(() => {
    vi.stubEnv('SPEED_TEST_SIGNING_SECRET', 'test-secret')
  })

  it('round-trips a payload', () => {
    const token = signTestToken({ kind: 'reading', pid: 'en-bridge', t0: 1000, perm: [[0, 1, 2, 3]] }, 1000)
    expect(verifyTestToken(token, 'reading', 2000)).toMatchObject({ pid: 'en-bridge', t0: 1000 })
  })

  it('rejects a token whose numbers were edited in the browser', () => {
    const token = signTestToken({ kind: 'questions', pid: 'en-bridge', readMs: 20_000, perm: [] }, 1000)
    const [body, sig] = token.split('.')
    const forged = JSON.parse(Buffer.from(body!, 'base64url').toString())
    forged.readMs = 90_000
    const tampered = `${Buffer.from(JSON.stringify(forged)).toString('base64url')}.${sig}`
    expect(() => verifyTestToken(tampered, 'questions', 2000)).toThrow()
  })

  it('rejects the wrong kind and expired tokens', () => {
    const token = signTestToken({ kind: 'reading', pid: 'x', t0: 0, perm: [] }, 0)
    expect(() => verifyTestToken(token, 'result', 10)).toThrow()
    expect(() => verifyTestToken(token, 'reading', 2 * 60 * 60 * 1000)).toThrow()
  })
})
