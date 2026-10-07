import en from './messages/en/enrol.json'
import hi from './messages/hi/enrol.json'
import kn from './messages/kn/enrol.json'
import ta from './messages/ta/enrol.json'
import te from './messages/te/enrol.json'
import mr from './messages/mr/enrol.json'
import gu from './messages/gu/enrol.json'
import bn from './messages/bn/enrol.json'
import type { AppLang } from './languages'
import { interpolate, lookup, type MessageDict, type TranslateVars } from './translate'

// Batch picker / price / countdown strings in all 8 languages. Small and
// client-safe, because these components appear on the website (EN/HI) as
// well as in the app (all languages).

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]

export type EnrolKey = Leaves<typeof en>

const ENROL: Record<AppLang, MessageDict> = { en, hi, kn, ta, te, mr, gu, bn }

export function enrolT(lang: AppLang): (key: EnrolKey, vars?: TranslateVars) => string {
  return (key, vars) => interpolate(lookup(ENROL[lang], key) ?? lookup(ENROL.en, key) ?? '', vars)
}
