import { describe, expect, it, vi } from 'vitest'
import { isStaleBuildError, reloadOnceForNewVersion } from './staleBuild'

describe('stale build after a deploy', () => {
  it('recognises the "old version" errors only', () => {
    expect(isStaleBuildError(new Error('Loading chunk 6761 failed.\n(error: https://app.mindurmind.org.in/_next/static/chunks/6761.62e3821007ceb890.js)'))).toBe(true)
    expect(isStaleBuildError({ name: 'ChunkLoadError', message: 'x' })).toBe(true)
    expect(isStaleBuildError(new Error('Loading CSS chunk app-layout failed.'))).toBe(true)
    expect(isStaleBuildError(new TypeError('Failed to fetch dynamically imported module: /x.js'))).toBe(true)
    expect(isStaleBuildError(new Error('Cannot read properties of undefined'))).toBe(false)
    expect(isStaleBuildError(null)).toBe(false)
  })
  it('reloads once per page per minute — never a loop', () => {
    const store = new Map<string, string>()
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }
    const reload = vi.fn()
    expect(reloadOnceForNewVersion(storage, '/dashboard', 1_000, reload)).toBe(true)
    expect(reloadOnceForNewVersion(storage, '/dashboard', 20_000, reload)).toBe(false)
    expect(reloadOnceForNewVersion(storage, '/progress', 21_000, reload)).toBe(true)
    expect(reloadOnceForNewVersion(storage, '/dashboard', 120_000, reload)).toBe(true)
    expect(reload).toHaveBeenCalledTimes(3)
  })
})
