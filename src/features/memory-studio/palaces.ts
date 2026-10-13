import { clampLevel } from '@/features/exercise-core/levelEngine'
import { STORY_ITEMS, type StudioItem, type StudioLang } from './content'
import { shuffle, type Rng } from './storyMethod'

// Personal memory palaces (Group A): the learner's own places — home,
// school/office, a route — with 10–20 stations in walking order, used for
// practice, their own lists and Chapter & Book. Pure logic only.

export const PALACE_PRACTICE_EXERCISE_ID = 'palace-personal'
export const PALACE_OWN_EXERCISE_ID = 'palace-personal-own'
export const MAX_PALACES = 3
export const MIN_STATIONS = 10
export const MAX_STATIONS = 20

export type PalaceKind = 'home' | 'school' | 'route' | 'other'
export const PALACE_KINDS: readonly PalaceKind[] = ['home', 'school', 'route', 'other']

export type MyPalace = { id: string; name: string; kind: PalaceKind; stations: string[] }

/** Suggested stations in walking order (the learner edits them to match their own place). */
export const STATION_SUGGESTIONS: Record<Exclude<PalaceKind, 'other'>, Record<StudioLang, readonly string[]>> = {
  home: {
    en: ['Front door', 'Shoe rack', 'Sofa', 'TV', 'Dining table', 'Kitchen stove', 'Fridge', 'Kitchen sink', 'Bathroom mirror', 'Bed', 'Cupboard', 'Study table', 'Window', 'Balcony'],
    hi: ['मुख्य दरवाज़ा', 'जूतों की रैक', 'सोफ़ा', 'टीवी', 'खाने की मेज़', 'गैस का चूल्हा', 'फ्रिज', 'रसोई का सिंक', 'बाथरूम का शीशा', 'पलंग', 'अलमारी', 'पढ़ाई की मेज़', 'खिड़की', 'बालकनी'],
  },
  school: {
    en: ['School gate', 'Security desk', 'Notice board', 'Staircase', 'Corridor', 'Classroom door', 'Teacher’s desk', 'Blackboard', 'My bench', 'Library', 'Science lab', 'Canteen', 'Playground', 'Water cooler'],
    hi: ['स्कूल का गेट', 'सुरक्षा डेस्क', 'सूचना पट्ट', 'सीढ़ियाँ', 'गलियारा', 'कक्षा का दरवाज़ा', 'शिक्षक की मेज़', 'ब्लैकबोर्ड', 'मेरी बेंच', 'पुस्तकालय', 'विज्ञान प्रयोगशाला', 'कैंटीन', 'खेल का मैदान', 'वॉटर कूलर'],
  },
  route: {
    en: ['My gate', 'Street corner', 'Tea stall', 'Bus stop', 'Temple or park', 'Traffic light', 'Petrol pump', 'Big tree', 'Market', 'Bridge', 'Hospital', 'Bank', 'Post office', 'School or office gate'],
    hi: ['मेरा गेट', 'गली का मोड़', 'चाय की दुकान', 'बस स्टॉप', 'मंदिर या पार्क', 'ट्रैफ़िक लाइट', 'पेट्रोल पंप', 'बड़ा पेड़', 'बाज़ार', 'पुल', 'अस्पताल', 'बैंक', 'डाकघर', 'स्कूल या दफ़्तर का गेट'],
  },
}

export function cleanStations(stations: readonly string[]): string[] {
  return stations.map((s) => s.trim().slice(0, 40)).filter(Boolean)
}

/** Level 1 → 10: how many stations a round uses (never more than the palace has). */
const COUNTS = [5, 6, 7, 8, 10, 12, 14, 16, 18, 20] as const
export type PalaceLevelConfig = { count: number; pictures: boolean; choices: number }

export function palaceLevel(level: number, stationCount: number): PalaceLevelConfig {
  const l = clampLevel(level)
  return { count: Math.min(COUNTS[l - 1]!, stationCount), pictures: l <= 5, choices: l <= 4 ? 4 : 6 }
}

export type PalaceQuestion = { station: number; answer: string; options: string[] }

/** A round: one item placed on each of the first `count` stations; recall walks the stations in order. */
export function pickPalaceRound(level: number, stationCount: number, avoid: readonly string[], rng: Rng): { items: StudioItem[]; questions: PalaceQuestion[] } {
  const config = palaceLevel(level, stationCount)
  const fresh = STORY_ITEMS.filter((i) => !avoid.includes(i.id))
  const items = shuffle(fresh.length >= config.count ? fresh : STORY_ITEMS, rng).slice(0, config.count)
  const questions = items.map((item, station) => {
    const others = shuffle(
      items.filter((i) => i.id !== item.id).map((i) => i.id),
      rng,
    ).slice(0, config.choices - 1)
    return { station, answer: item.id, options: shuffle([item.id, ...others], rng) }
  })
  return { items, questions }
}
