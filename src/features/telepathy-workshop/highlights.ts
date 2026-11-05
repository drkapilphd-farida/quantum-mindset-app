import { GALLERY_IMAGES, type TelepathyPhoto } from '@/config/telepathyWorkshopConfig'

// Phase 4.3 — "Inside the workshop": real workshop photos from
// public/images/telepathy-workshop and (Phase 4.4) the owner's uploads in public/. Captions say only what the photo
// clearly shows; city/year only where the existing gallery data has them
// (GALLERY_IMAGES). muse2-demo.jpg is NOT used: it carries an image-
// generator watermark and drawn-on wave labels, so it is not a real photo.

type Bi = { en: string; hi: string }
export type Highlight = TelepathyPhoto & { caption: Bi; city: 'mumbai' | 'ahmedabad' | 'vadodara' | null; year: number | null }

const IMG = '/images/telepathy-workshop'
const C = {
  groupMeditation: { en: 'Group meditation', hi: 'सामूहिक ध्यान' },
  eyesClosed: { en: 'Meditation with eyes closed', hi: 'आँखें बंद करके ध्यान' },
  floor: { en: 'Floor meditation', hi: 'ज़मीन पर ध्यान' },
  drKapil: { en: 'Dr. Kapil with the batch', hi: 'डॉ. कपिल बैच के साथ' },
  circle: { en: 'Sitting in a circle', hi: 'घेरे में बैठकर' },
  session: { en: 'Workshop session', hi: 'वर्कशॉप सत्र' },
  group: { en: 'Group photo', hi: 'ग्रुप फोटो' },
  lying: { en: 'Lying-down practice', hi: 'लेटकर अभ्यास' },
  standing: { en: 'Standing practice', hi: 'खड़े होकर अभ्यास' },
  certificate: { en: 'Certificate presentation', hi: 'सर्टिफ़िकेट देते हुए' },
} as const satisfies Record<string, Bi>

const photo = (file: string, width: number, height: number, caption: Bi): Highlight => ({ src: `${IMG}/${file}`, width, height, position: '50% 50%', caption, city: null, year: null })

function gallery(n: number, caption: Bi): Highlight {
  const g = GALLERY_IMAGES[n - 1]
  if (g === undefined) throw new Error(`gallery-${n} missing`)
  const city = g.city === 'mumbai' || g.city === 'ahmedabad' || g.city === 'vadodara' ? g.city : null
  return { src: g.src, width: g.width, height: g.height, position: g.position, caption, city, year: g.year }
}

// Phase 4.4: the owner's uploads in public/ (year from the file name, IMG_YYYYMMDD; no city in the names).
const upload = (file: string, width: number, height: number, caption: Bi): Highlight => ({ src: `/${file}`, width, height, position: '50% 50%', caption, city: null, year: Number(file.slice(4, 8)) })
const U_SELFIE = upload('IMG_20220828_123945.jpg', 4000, 1824, C.drKapil)
const U_SESSION = upload('IMG_20220910_164123.jpg', 4000, 1824, C.session)
const U_SELFIE_2 = upload('IMG_20220910_164131.jpg', 4000, 1824, C.drKapil)
const U_LYING = upload('IMG_20221121_122722.jpg', 4000, 1824, C.lying)
const U_STANDING = upload('IMG_20221124_141950.jpg', 4000, 1824, C.standing)
const U_CERTIFICATE = upload('IMG_20221225_192623.jpg', 1824, 4000, C.certificate)

export const HERO_2 = photo('hero-2.jpg', 1440, 1080, C.groupMeditation)
export const HERO_3 = photo('hero-3.jpg', 4096, 3072, C.eyesClosed)
export const HERO_5 = photo('hero-5.jpg', 4000, 1824, C.floor)

/** /telepathy-workshop: 12 photos (Phase 4.4: the owner's new uploads mixed in, the fullest and clearest first). */
export const WORKSHOP_HIGHLIGHTS: readonly Highlight[] = [
  HERO_2,
  U_SESSION,
  U_SELFIE,
  U_LYING,
  U_STANDING,
  HERO_3,
  HERO_5,
  U_SELFIE_2,
  gallery(4, C.group),
  gallery(14, C.session),
  gallery(12, C.session),
  U_CERTIFICATE,
]

/** Homepage: the short version (6 photos). */
export const HOME_HIGHLIGHTS: readonly Highlight[] = [HERO_2, U_SESSION, U_LYING, U_STANDING, HERO_3, U_SELFIE]

/** Photos for the "4 things you learn" cards, by card index (0 telepathy: no photo shows pair practice clearly). */
export const LEARN_CARD_PHOTOS: readonly (Highlight | null)[] = [null, HERO_5, HERO_3, HERO_2]
