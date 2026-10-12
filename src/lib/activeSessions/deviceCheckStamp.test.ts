import { beforeAll, describe, expect, it } from 'vitest'
import { DEVICE_CHECK_INTERVAL_MS, deviceCheckIsFresh, makeDeviceCheckStamp } from './deviceCheckStamp'

describe('device check stamp (one device at a time, checked every few minutes)', () => {
  beforeAll(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-secret-for-unit-tests'
  })
  const now = 1_800_000_000_000
  it('a fresh stamp is trusted for this learner and device only', async () => {
    const stamp = (await makeDeviceCheckStamp('user-1', 'session-a', now))!
    expect(await deviceCheckIsFresh(stamp, 'user-1', 'session-a', now + 60_000)).toBe(true)
    expect(await deviceCheckIsFresh(stamp, 'user-2', 'session-a', now + 60_000)).toBe(false)
    expect(await deviceCheckIsFresh(stamp, 'user-1', 'session-b', now + 60_000)).toBe(false)
    expect(await deviceCheckIsFresh(stamp, 'user-1', null, now + 60_000)).toBe(false)
  })
  it('expires after the interval, and a forged or edited stamp is refused', async () => {
    const stamp = (await makeDeviceCheckStamp('user-1', 'session-a', now))!
    expect(await deviceCheckIsFresh(stamp, 'user-1', 'session-a', now + DEVICE_CHECK_INTERVAL_MS + 1)).toBe(false)
    const [, signature] = stamp.split('.')
    expect(await deviceCheckIsFresh(`${now + 100_000}.${signature}`, 'user-1', 'session-a', now + 120_000)).toBe(false)
    expect(await deviceCheckIsFresh(`${now}.forged`, 'user-1', 'session-a', now + 1000)).toBe(false)
    expect(await deviceCheckIsFresh(undefined, 'user-1', 'session-a', now)).toBe(false)
  })
})
