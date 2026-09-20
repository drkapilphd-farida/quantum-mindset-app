import { describe, expect, it } from 'vitest'
import { deriveDeviceLabel } from './deviceLabel'

describe('deriveDeviceLabel', () => {
  it('returns a placeholder when no User-Agent is available', () => {
    expect(deriveDeviceLabel(null)).toBe('Unknown device')
  })

  it('labels a Chrome/Windows request', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    expect(deriveDeviceLabel(ua)).toBe('Chrome on Windows')
  })

  it('labels a Safari/iPhone request', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/604.1'
    expect(deriveDeviceLabel(ua)).toBe('Safari on iPhone')
  })

  it('never includes the raw User-Agent string in its output', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15'
    expect(deriveDeviceLabel(ua)).not.toContain('Mozilla')
    expect(deriveDeviceLabel(ua)).not.toContain('AppleWebKit')
  })
})
