import { clampLevel } from '@/features/exercise-core/levelEngine'
import type { FaceSpec } from '@/features/memory-check/content'
import type { StudioLang } from './content'
import { shuffle, type Rng } from './storyMethod'

// Names and faces (Group A): spot one feature of the face → turn the name into
// a picture → link the two. The people are made up and drawn by the app (the
// memory check's drawing), never photos. None of these faces or names is used
// in the Day 1 / Day 30 memory check, so practising here never makes it easier.
// Faces and names are paired afresh every round, so learners practise the
// method, not a fixed set of pairs. Pure logic only.

export const NAME_FACE_EXERCISE_ID = 'name-face'
export const NAME_FACE_OWN_EXERCISE_ID = 'name-face-own'

/** Which names suit a drawing: kept so a face with a beard never gets a name like Priya. */
type Look = 'f' | 'm'

export type StudioFace = { id: string; look: Look; spec: FaceSpec }
export type StudioName = { id: string; look: Look; en: string; hi: string }

const f = (id: string, spec: Omit<FaceSpec, 'facialHair'>): StudioFace => ({ id, look: 'f', spec: { ...spec, facialHair: 'none' } })
const m = (id: string, spec: Omit<FaceSpec, 'bindi' | 'earrings'>): StudioFace => ({ id, look: 'm', spec: { ...spec, bindi: false, earrings: false } })

export const STUDIO_FACES: readonly StudioFace[] = [
  f('f01', { skin: 'wheat', hair: 'curly', glasses: 'none', bindi: true, earrings: true, age: 'adult' }),
  f('f02', { skin: 'brown', hair: 'plait', glasses: 'round', bindi: false, earrings: true, age: 'adult' }),
  f('f03', { skin: 'deep', hair: 'bun', glasses: 'none', bindi: true, earrings: false, age: 'adult' }),
  f('f04', { skin: 'light', hair: 'shoulder', glasses: 'square', bindi: false, earrings: false, age: 'adult' }),
  f('f05', { skin: 'medium', hair: 'shoulder', glasses: 'none', bindi: true, earrings: true, age: 'adult' }),
  f('f06', { skin: 'wheat', hair: 'grey-bun', glasses: 'round', bindi: true, earrings: true, age: 'older' }),
  f('f07', { skin: 'brown', hair: 'grey-bun', glasses: 'none', bindi: false, earrings: true, age: 'older' }),
  f('f08', { skin: 'medium', hair: 'plait', glasses: 'none', bindi: false, earrings: false, age: 'child' }),
  f('f09', { skin: 'light', hair: 'curly', glasses: 'square', bindi: false, earrings: true, age: 'adult' }),
  f('f10', { skin: 'deep', hair: 'plait', glasses: 'square', bindi: true, earrings: true, age: 'adult' }),
  f('f11', { skin: 'wheat', hair: 'bun', glasses: 'none', bindi: false, earrings: true, age: 'adult' }),
  f('f12', { skin: 'brown', hair: 'shoulder', glasses: 'round', bindi: true, earrings: false, age: 'adult' }),
  f('f13', { skin: 'brown', hair: 'curly', glasses: 'round', bindi: false, earrings: true, age: 'child' }),
  f('f14', { skin: 'medium', hair: 'bun', glasses: 'square', bindi: false, earrings: true, age: 'older' }),
  m('m01', { skin: 'wheat', hair: 'short', glasses: 'none', facialHair: 'moustache', age: 'adult' }),
  m('m02', { skin: 'deep', hair: 'short', glasses: 'round', facialHair: 'none', age: 'adult' }),
  m('m03', { skin: 'light', hair: 'curly', glasses: 'none', facialHair: 'beard', age: 'adult' }),
  m('m04', { skin: 'medium', hair: 'spiky', glasses: 'square', facialHair: 'none', age: 'adult' }),
  m('m05', { skin: 'brown', hair: 'grey-short', glasses: 'round', facialHair: 'grey-moustache', age: 'older' }),
  m('m06', { skin: 'wheat', hair: 'grey-short', glasses: 'none', facialHair: 'none', age: 'older' }),
  m('m07', { skin: 'deep', hair: 'curly', glasses: 'square', facialHair: 'moustache', age: 'adult' }),
  m('m08', { skin: 'light', hair: 'short', glasses: 'none', facialHair: 'none', age: 'child' }),
  m('m09', { skin: 'brown', hair: 'spiky', glasses: 'round', facialHair: 'none', age: 'child' }),
  m('m10', { skin: 'medium', hair: 'short', glasses: 'square', facialHair: 'beard', age: 'adult' }),
  m('m11', { skin: 'wheat', hair: 'curly', glasses: 'round', facialHair: 'none', age: 'adult' }),
  m('m12', { skin: 'deep', hair: 'grey-short', glasses: 'square', facialHair: 'beard', age: 'older' }),
  m('m13', { skin: 'brown', hair: 'short', glasses: 'none', facialHair: 'beard', age: 'adult' }),
  m('m14', { skin: 'light', hair: 'spiky', glasses: 'none', facialHair: 'moustache', age: 'adult' }),
]

const n = (look: Look, en: string, hi: string): StudioName => ({ id: en.toLowerCase(), look, en, hi })

/** Names from all over India. Many have a meaning that is easy to picture (Sagar = sea, Deepak = lamp). */
export const STUDIO_NAMES: readonly StudioName[] = [
  n('f', 'Priya', 'प्रिया'), n('f', 'Kavya', 'काव्या'), n('f', 'Sneha', 'स्नेहा'), n('f', 'Pooja', 'पूजा'), n('f', 'Anjali', 'अंजलि'),
  n('f', 'Divya', 'दिव्या'), n('f', 'Nandini', 'नंदिनी'), n('f', 'Fatima', 'फ़ातिमा'), n('f', 'Zoya', 'ज़ोया'), n('f', 'Simran', 'सिमरन'),
  n('f', 'Neha', 'नेहा'), n('f', 'Gauri', 'गौरी'), n('f', 'Isha', 'ईशा'), n('f', 'Radha', 'राधा'), n('f', 'Mary', 'मैरी'),
  n('f', 'Chandni', 'चाँदनी'), n('f', 'Megha', 'मेघा'), n('f', 'Kamala', 'कमला'), n('f', 'Rupa', 'रूपा'), n('f', 'Sunita', 'सुनीता'),
  n('m', 'Rahul', 'राहुल'), n('m', 'Vikram', 'विक्रम'), n('m', 'Sagar', 'सागर'), n('m', 'Deepak', 'दीपक'), n('m', 'Suraj', 'सूरज'),
  n('m', 'Imran', 'इमरान'), n('m', 'Aman', 'अमन'), n('m', 'Rohan', 'रोहन'), n('m', 'Gopal', 'गोपाल'), n('m', 'Mohan', 'मोहन'),
  n('m', 'Anil', 'अनिल'), n('m', 'Vijay', 'विजय'), n('m', 'Karan', 'करण'), n('m', 'Manoj', 'मनोज'), n('m', 'Thomas', 'थॉमस'),
  n('m', 'Gurdeep', 'गुरदीप'), n('m', 'Pankaj', 'पंकज'), n('m', 'Akash', 'आकाश'), n('m', 'Bharat', 'भरत'), n('m', 'Neel', 'नील'),
]

export function personName(name: StudioName, lang: StudioLang): string {
  return lang === 'hi' ? name.hi : name.en
}

/** The one feature to notice first (the lesson's step 1): the most eye-catching thing on the face. */
export type FaceFeature = 'roundGlasses' | 'squareGlasses' | 'beard' | 'moustache' | 'greyHair' | 'curlyHair' | 'spikyHair' | 'plait' | 'bun' | 'bindi' | 'longHair' | 'shortHair'

export function mainFeature(spec: FaceSpec): FaceFeature {
  if (spec.glasses === 'round') return 'roundGlasses'
  if (spec.glasses === 'square') return 'squareGlasses'
  if (spec.facialHair === 'beard') return 'beard'
  if (spec.facialHair === 'moustache' || spec.facialHair === 'grey-moustache') return 'moustache'
  if (spec.hair.startsWith('grey')) return 'greyHair'
  if (spec.hair === 'curly') return 'curlyHair'
  if (spec.hair === 'spiky') return 'spikyHair'
  if (spec.hair === 'plait') return 'plait'
  if (spec.hair === 'bun') return 'bun'
  if (spec.bindi) return 'bindi'
  if (spec.hair === 'shoulder') return 'longHair'
  return 'shortHair'
}

export type NameFaceLevelConfig = {
  count: number
  /** Show "Notice: …" under each face while studying. */
  hint: boolean
  /** Extra names (not in the round) mixed into the choices. */
  unseen: number
  /** Shirts change colour between studying and recall, so only the face itself helps. */
  newShirts: boolean
}

const LEVELS: readonly NameFaceLevelConfig[] = [
  { count: 3, hint: true, unseen: 1, newShirts: false },
  { count: 4, hint: true, unseen: 1, newShirts: false },
  { count: 5, hint: true, unseen: 2, newShirts: false },
  { count: 5, hint: false, unseen: 2, newShirts: true },
  { count: 6, hint: false, unseen: 2, newShirts: true },
  { count: 6, hint: false, unseen: 3, newShirts: true },
  { count: 7, hint: false, unseen: 3, newShirts: true },
  { count: 8, hint: false, unseen: 3, newShirts: true },
  { count: 9, hint: false, unseen: 4, newShirts: true },
  { count: 10, hint: false, unseen: 4, newShirts: true },
]

export function nameFaceLevel(level: number): NameFaceLevelConfig {
  return LEVELS[clampLevel(level) - 1]!
}

export type Person = { face: StudioFace; name: StudioName; shirt: number; recallShirt: number }
export type NameFaceRound = { people: Person[]; /** The order faces are asked in (indexes into people). */ askOrder: number[]; /** All name choices, shuffled once. */ choices: StudioName[] }

/** A round: `count` different faces, each with a fresh name that suits it, plus unseen names for the choices. Avoids the last round's faces and names where it can. */
export function pickNameFaceRound(level: number, avoid: readonly string[], rng: Rng, countOverride?: number): NameFaceRound {
  const config = nameFaceLevel(level)
  const count = countOverride ?? config.count
  const freshFaces = STUDIO_FACES.filter((x) => !avoid.includes(x.id))
  const faces = shuffle(freshFaces.length >= count ? freshFaces : STUDIO_FACES, rng).slice(0, count)
  const freshNames = STUDIO_NAMES.filter((x) => !avoid.includes(x.id))
  const namePool = shuffle(freshNames.length >= count + config.unseen ? freshNames : STUDIO_NAMES, rng)
  const used = new Set<string>()
  const take = (look: Look | null): StudioName => {
    const found = namePool.find((x) => !used.has(x.id) && (look === null || x.look === look)) ?? STUDIO_NAMES.find((x) => !used.has(x.id) && (look === null || x.look === look))!
    used.add(found.id)
    return found
  }
  const shirtStart = rng(5)
  const people = faces.map((face, i) => ({ face, name: take(face.look), shirt: (shirtStart + i) % 5, recallShirt: config.newShirts ? (shirtStart + i + 2) % 5 : (shirtStart + i) % 5 }))
  const unseen = Array.from({ length: countOverride === undefined ? config.unseen : 1 }, () => take(null))
  return {
    people,
    askOrder: shuffle(
      people.map((_, i) => i),
      rng,
    ),
    choices: shuffle([...people.map((p) => p.name), ...unseen], rng),
  }
}

/** Ids to avoid next round: this round's faces and names. */
export function roundIds(round: NameFaceRound): string[] {
  return [...round.people.flatMap((p) => [p.face.id, p.name.id]), ...round.choices.map((c) => c.id)]
}
