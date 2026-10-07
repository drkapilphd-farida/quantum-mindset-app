import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { CATALOG, ENGLISH } from './catalog'
import { APP_LANGS, LANGUAGES, isAppLang, langFromBrowser, siteLangFor } from './languages'
import { createTranslator, keyPaths, labelKey, lookup, mergeOverEnglish, translateLabel, type MessageDict, type MessageKey } from './translate'
import { practiceContentLang, practiceTextIsFallback, sameContentLang } from './practiceContent'
import { enrolT } from './enrol'

describe('languages', () => {
  it('has the 8 app languages, each named in its own script', () => {
    expect(APP_LANGS).toEqual(['en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn'])
    expect(APP_LANGS.map((l) => LANGUAGES[l].nativeName)).toEqual(['English', 'हिंदी', 'ಕನ್ನಡ', 'தமிழ்', 'తెలుగు', 'मराठी', 'ગુજરાતી', 'বাংলা'])
  })

  it('every language but English is marked pending native-speaker review', () => {
    for (const l of APP_LANGS) expect(LANGUAGES[l].review, l).toBe(l === 'en' ? 'reviewed' : 'pending')
  })

  it('defaults from the browser language, else English', () => {
    expect(langFromBrowser('ta-IN,ta;q=0.9,en;q=0.8')).toBe('ta')
    expect(langFromBrowser(['fr-FR', 'gu-IN'])).toBe('gu')
    expect(langFromBrowser('fr-FR,de;q=0.9')).toBe('en')
    expect(langFromBrowser(null)).toBe('en')
  })

  it('website pages stay English/Hindi', () => {
    expect(siteLangFor('hi')).toBe('hi')
    for (const l of ['en', 'kn', 'ta', 'te', 'mr', 'gu', 'bn'] as const) expect(siteLangFor(l)).toBe('en')
  })

  it('rejects unknown codes', () => {
    expect(isAppLang('ta')).toBe(true)
    expect(isAppLang('fr')).toBe(false)
    expect(isAppLang(undefined)).toBe(false)
  })
})

describe('fallback', () => {
  const english: MessageDict = { a: { hello: 'Hello {name}', only: 'Only in English' } }
  const tamil: MessageDict = { a: { hello: 'வணக்கம் {name}' } }

  it('uses the translation when present', () => {
    const t = createTranslator(tamil, english)
    expect(t('a.hello' as MessageKey, { name: 'Asha' })).toBe('வணக்கம் Asha')
  })

  it('falls back to English for a missing string — never the raw key', () => {
    const t = createTranslator(tamil, english)
    expect(t('a.only' as MessageKey)).toBe('Only in English')
    expect(t('a.missingEverywhere' as MessageKey)).toBe('')
    expect(t('a.missingEverywhere' as MessageKey)).not.toContain('a.')
  })

  it('treats an empty translation as missing', () => {
    expect(lookup({ a: { x: '' } }, 'a.x')).toBeUndefined()
    expect(mergeOverEnglish(english, { a: { hello: '' } })).toEqual(english)
  })

  it('a merged catalog always has every English key', () => {
    for (const lang of APP_LANGS) {
      const merged = mergeOverEnglish(ENGLISH, CATALOG[lang])
      expect(keyPaths(merged).sort()).toEqual(keyPaths(ENGLISH).sort())
    }
  })
})

describe('catalog integrity', () => {
  const placeholders = (s: string): string[] => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort()

  it('every language has its own entry for every learner-facing key (no silent English fallback)', () => {
    const englishKeys = keyPaths(ENGLISH)
    for (const lang of APP_LANGS) {
      const missing = englishKeys.filter((k) => lookup(CATALOG[lang], k) === undefined)
      expect(missing, `${lang} is missing ${missing.length} entries`).toEqual([])
    }
  })

  it('no language has keys that English does not have', () => {
    const englishKeys = new Set(keyPaths(ENGLISH))
    for (const lang of APP_LANGS) {
      const extra = keyPaths(CATALOG[lang]).filter((k) => !englishKeys.has(k))
      expect(extra, `${lang} has keys not in English`).toEqual([])
    }
  })

  it('every translation keeps exactly the same {placeholders} as English', () => {
    for (const lang of APP_LANGS) {
      for (const key of keyPaths(CATALOG[lang])) {
        const tr = lookup(CATALOG[lang], key)
        const en = lookup(ENGLISH, key)
        if (tr === undefined || en === undefined) continue
        expect(placeholders(tr), `${lang} ${key}`).toEqual(placeholders(en))
      }
    }
  })

  it('every key used in the code exists in English', () => {
    const used = new Set<string>()
    const walk = (dir: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (/\.(tsx?|mts)$/.test(entry.name) && !entry.name.includes('.test.')) {
          for (const m of fs.readFileSync(full, 'utf8').matchAll(/\bt\(\s*['"]([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)['"]/g)) used.add(m[1]!)
        }
      }
    }
    walk('src')
    const englishKeys = new Set(keyPaths(ENGLISH))
    const enrolKeys = new Set(keyPaths(CATALOG.en.enrol as MessageDict))
    const missing = [...used].filter((k) => !englishKeys.has(k) && !enrolKeys.has(k))
    expect(missing).toEqual([])
  })

  it('brand and program names stay in English in every language', () => {
    for (const lang of APP_LANGS) {
      for (const key of keyPaths(CATALOG[lang])) {
        const en = lookup(ENGLISH, key) ?? ''
        const tr = lookup(CATALOG[lang], key)
        if (tr === undefined) continue
        for (const name of ['Sharp Brain', 'Razorpay', 'WhatsApp']) {
          if (en.includes(name)) expect(tr, `${lang} ${key} keeps "${name}"`).toContain(name)
        }
      }
    }
  })
})

describe('engine labels translated by value', () => {
  it('each label key is derived from its English text (scripts/i18n-labels.mjs)', () => {
    const labels = (CATALOG.en.exercises as MessageDict).labels as MessageDict
    for (const [key, english] of Object.entries(labels)) expect(labelKey(english as string), key).toBe(key)
  })

  it('translates a known label, leaves an unknown one as written', () => {
    const english: MessageDict = { exercises: { labels: { reading_pace: 'Reading Pace' } } }
    const t = createTranslator({ exercises: { labels: { reading_pace: 'ಓದುವ ವೇಗ' } } }, english)
    expect(translateLabel(t, 'Reading Pace')).toBe('ಓದುವ ವೇಗ')
    expect(translateLabel(t, 'Some New Label')).toBe('Some New Label')
  })
})

describe('enrol strings (website + app)', () => {
  it('translates and interpolates, English fallback per string', () => {
    expect(enrolT('ta')('enrolNow', { price: '₹8,999' })).toContain('₹8,999')
    expect(enrolT('en')('earlyBirdFor', { date: '15 Oct' })).toBe('Early-bird for the 15 Oct batch')
  })
})

describe('practice text language (Part B)', () => {
  it('falls back to English until a language has its own practice text', () => {
    expect(practiceContentLang('ta', 'reading')).toBe('en')
    expect(practiceTextIsFallback('ta', 'reading')).toBe(true)
    expect(practiceContentLang('en', 'reading')).toBe('en')
    expect(practiceTextIsFallback('en', 'reading')).toBe(false)
  })

  it('Bengali practice text is English, so Bengali reading results are saved as English reading', () => {
    for (const kind of ['reading', 'rsvp', 'wordList', 'phraseList', 'readingTest', 'chunkPassages'] as const) {
      expect(practiceContentLang('bn', kind)).toBe('en')
      expect(practiceTextIsFallback('bn', kind)).toBe(true)
    }
  })

  it('Hindi gets Hindi where Hindi text exists (Reading Speed Test)', () => {
    expect(practiceContentLang('hi', 'readingTest')).toBe('hi')
    expect(practiceContentLang('hi', 'reading')).toBe('en')
  })

  it('results are comparable only within one language (missing = English)', () => {
    expect(sameContentLang({ contentLang: 'en' }, {})).toBe(true)
    expect(sameContentLang({ contentLang: 'hi' }, { contentLang: 'en' })).toBe(false)
  })
})

describe('dates in the learner’s language', () => {
  it('relative dates use the chosen locale', async () => {
    const { relativeDate } = await import('./format')
    const now = Date.parse('2026-10-05T12:00:00Z')
    expect(relativeDate('2026-10-04T12:00:00Z', 'en', now)).toBe('yesterday')
    expect(relativeDate('2026-10-04T12:00:00Z', 'hi', now)).toBe('कल')
    expect(relativeDate('2026-09-21T12:00:00Z', 'ta', now)).toMatch(/[஀-௿]/)
  })
})
