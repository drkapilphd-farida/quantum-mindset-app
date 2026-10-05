import type { AppLang } from './languages'
import type { EnglishMessages } from './catalog'

// The app's translator. Keys are typed from the English catalog, so a key
// that doesn't exist in English is a compile error. At runtime a string
// missing in the chosen language falls back to English — never to the raw
// key. Placeholders look like {name}.

export type MessageDict = { [key: string]: string | MessageDict }

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]

export type MessageKey = Leaves<EnglishMessages>

export type TranslateVars = Record<string, string | number>

export type Translator = (key: MessageKey, vars?: TranslateVars) => string

export function lookup(dict: MessageDict | undefined, key: string): string | undefined {
  let node: string | MessageDict | undefined = dict
  for (const part of key.split('.')) {
    if (node === undefined || typeof node === 'string') return undefined
    node = node[part]
  }
  return typeof node === 'string' && node !== '' ? node : undefined
}

export function interpolate(template: string, vars?: TranslateVars): string {
  if (vars === undefined) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
}

/** A translator over one language's messages, falling back to English per string. */
export function createTranslator(messages: MessageDict, english: MessageDict): Translator {
  return (key, vars) => interpolate(lookup(messages, key) ?? lookup(english, key) ?? '', vars)
}

/**
 * Catalog key for a fixed English label that lives in engine code (level
 * names, stat labels, rating words). Such labels are translated by value
 * under `exercises.labels.<labelKey>`; an unknown label stays as written.
 */
export function labelKey(english: string): string {
  return english
    .toLowerCase()
    .replace(/™/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60)
}

/** Translate a fixed English label by value (see labelKey). */
export function translateLabel(t: Translator, english: string): string {
  if (english === '') return english
  return t(`exercises.labels.${labelKey(english)}` as MessageKey) || english
}

/** Deep-merge `lang` over English: every English key present, translated where available. */
export function mergeOverEnglish(english: MessageDict, lang: MessageDict | undefined): MessageDict {
  const out: MessageDict = {}
  for (const [key, value] of Object.entries(english)) {
    const translated = lang?.[key]
    if (typeof value === 'string') out[key] = typeof translated === 'string' && translated !== '' ? translated : value
    else out[key] = mergeOverEnglish(value, typeof translated === 'object' ? translated : undefined)
  }
  return out
}

/** Every key path in a catalog, e.g. "common.save". */
export function keyPaths(dict: MessageDict, prefix = ''): string[] {
  return Object.entries(dict).flatMap(([key, value]) => (typeof value === 'string' ? [`${prefix}${key}`] : keyPaths(value, `${prefix}${key}.`)))
}

export type { AppLang }
