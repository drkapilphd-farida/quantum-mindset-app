import type { AppLang } from '@/lib/app-i18n/languages'
import type { NarrationLine } from '@/features/guided-audio/useGuidedNarration'

type ScriptFile = { lang: string; review: string; lines: (NarrationLine & { phase: string })[] }

// Only the active language's script is downloaded (one small chunk per language).
const LOADERS: Record<AppLang, () => Promise<{ default: ScriptFile }>> = {
  en: () => import('./en.json'),
  hi: () => import('./hi.json'),
  kn: () => import('./kn.json'),
  ta: () => import('./ta.json'),
  te: () => import('./te.json'),
  mr: () => import('./mr.json'),
  gu: () => import('./gu.json'),
  bn: () => import('./bn.json'),
}

/** The Memory Palace script for a language, as id → line. */
export async function loadPalaceScript(lang: AppLang): Promise<Map<string, NarrationLine>> {
  const file = (await LOADERS[lang]()).default
  return new Map(file.lines.map((l) => [l.id, { id: l.id, text: l.text }]))
}
