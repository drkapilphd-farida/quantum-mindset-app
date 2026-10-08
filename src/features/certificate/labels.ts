import type { Translator } from '@/lib/app-i18n/translate'

// The certificate's words in one language, resolved on the server so the
// learner can switch between their language and an English copy.

export const CERT_LABEL_KEYS = [
  'title', 'certifies', 'completed', 'readingTitle', 'day', 'change', 'speed', 'comprehension', 'effective', 'points',
  'readingNote', 'baselineOnDay', 'memoryTitle', 'memory', 'memorySub', 'retention', 'retentionSub', 'founder', 'certId', 'verifyAt',
  'shareDone', 'shareUnit', 'shareUnitDay30', 'shareSpeed', 'shareComprehension', 'shareRetention', 'shareVerify',
] as const

export type CertLabelKey = (typeof CERT_LABEL_KEYS)[number]
export type CertLabels = Record<CertLabelKey, string>

export function certLabels(t: Translator): CertLabels {
  return Object.fromEntries(CERT_LABEL_KEYS.map((k) => [k, t(`training.certificate.${k}`)])) as CertLabels
}

/** Fills {name} placeholders. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
}
