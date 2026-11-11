import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// WCAG relative luminance contrast.
function contrast(a: string, b: string): number {
  const lum = (hex: string): number => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (bl ?? 0)
  }
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05)
}

describe('FreeTestButton (owner, Nov 2026)', () => {
  it('white on teal passes WCAG AA (4.5:1), including hover', () => {
    expect(contrast('#FFFFFF', '#0F766E')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#FFFFFF', '#115E59')).toBeGreaterThanOrEqual(4.5)
  })

  it('uses the owner’s colours and wording', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/FreeTestButton.tsx'), 'utf8')
    for (const part of ['bg-[#0F766E]', 'hover:bg-[#115E59]', 'en: "FREE", hi: "मुफ़्त"', 'en: "3 minutes", hi: "3 मिनट"']) expect(src).toContain(part)
  })
})
