import { Hanken_Grotesk, Marcellus, Tiro_Devanagari_Hindi } from 'next/font/google'
import type { AppLang } from '@/lib/app-i18n/languages'
import type { CertFonts } from './draw'

// Certificate faces (self-hosted by next/font): an engraved display face for
// the title and name, a clean body face, and a Devanagari display face for
// Hindi and Marathi. The other scripts use the app's Noto Sans faces.

export const certDisplay = Marcellus({ subsets: ['latin'], weight: '400', variable: '--font-cert-display', display: 'swap', preload: false })
export const certBody = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-cert-body', display: 'swap', preload: false })
export const certDevanagari = Tiro_Devanagari_Hindi({ subsets: ['devanagari'], weight: '400', variable: '--font-cert-deva', display: 'swap', preload: false })

export const CERT_FONT_CLASSES = `${certDisplay.variable} ${certBody.variable} ${certDevanagari.variable}`

const SCRIPT_BODY_VAR: Record<Exclude<AppLang, 'en'>, string> = {
  hi: '--font-homepage-devanagari',
  mr: '--font-homepage-devanagari',
  kn: '--font-noto-kannada',
  ta: '--font-noto-tamil',
  te: '--font-noto-telugu',
  gu: '--font-noto-gujarati',
  bn: '--font-noto-bengali',
}

/** Canvas font stacks for a certificate language, read from the CSS variables in scope at `el`. */
export function certFontsFor(lang: AppLang, el: Element): CertFonts {
  const style = getComputedStyle(el)
  const v = (name: string, fallback: string): string => {
    const value = style.getPropertyValue(name).trim()
    return value === '' ? fallback : `${value}, ${fallback}`
  }
  const latinDisplay = v('--font-cert-display', 'Georgia, serif')
  const latinBody = v('--font-cert-body', 'system-ui, sans-serif')
  if (lang === 'en') return { display: latinDisplay, body: latinBody, latinDisplay, latinBody }
  const scriptBody = style.getPropertyValue(SCRIPT_BODY_VAR[lang]).trim()
  const scriptDisplay = lang === 'hi' || lang === 'mr' ? style.getPropertyValue('--font-cert-deva').trim() : scriptBody
  return {
    display: [scriptDisplay, latinDisplay].filter(Boolean).join(', '),
    body: [scriptBody, latinBody].filter(Boolean).join(', '),
    latinDisplay,
    latinBody,
  }
}

/** Waits until every face the drawing uses is loaded, for the characters it will draw. */
export async function loadCertFonts(fonts: CertFonts, sample: string): Promise<void> {
  const specs = [`400 40px ${fonts.display}`, `400 40px ${fonts.body}`, `600 40px ${fonts.body}`, `700 40px ${fonts.body}`, `400 40px ${fonts.latinDisplay}`, `500 40px ${fonts.latinBody}`, `600 40px ${fonts.latinBody}`, `700 40px ${fonts.latinBody}`]
  await Promise.all(specs.map((spec) => document.fonts.load(spec, sample).catch(() => [])))
}
