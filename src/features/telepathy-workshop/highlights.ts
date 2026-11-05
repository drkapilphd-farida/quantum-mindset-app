import { GALLERY_IMAGES, type TelepathyPhoto } from '@/config/telepathyWorkshopConfig'

// Phase 4.3 — "Inside the workshop": real workshop photos from
// public/images/telepathy-workshop. Captions say only what the photo
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
} as const satisfies Record<string, Bi>

const photo = (file: string, width: number, height: number, caption: Bi): Highlight => ({ src: `${IMG}/${file}`, width, height, position: '50% 50%', caption, city: null, year: null })

function gallery(n: number, caption: Bi): Highlight {
  const g = GALLERY_IMAGES[n - 1]
  if (g === undefined) throw new Error(`gallery-${n} missing`)
  const city = g.city === 'mumbai' || g.city === 'ahmedabad' || g.city === 'vadodara' ? g.city : null
  return { src: g.src, width: g.width, height: g.height, position: g.position, caption, city, year: g.year }
}

export const HERO_2 = photo('hero-2.jpg', 1440, 1080, C.groupMeditation)
export const HERO_3 = photo('hero-3.jpg', 4096, 3072, C.eyesClosed)
export const HERO_5 = photo('hero-5.jpg', 4000, 1824, C.floor)

/** /telepathy-workshop: 12 photos. */
export const WORKSHOP_HIGHLIGHTS: readonly Highlight[] = [
  HERO_2,
  photo('hero-1.jpg', 6528, 4896, C.drKapil),
  HERO_3,
  HERO_5,
  gallery(2, C.circle),
  photo('hero-4.jpg', 4000, 1824, C.session),
  gallery(14, C.session),
  gallery(6, C.session),
  gallery(12, C.session),
  gallery(13, C.session),
  gallery(4, C.group),
  gallery(1, C.group),
]

/** Homepage: the short version (6 photos). */
export const HOME_HIGHLIGHTS: readonly Highlight[] = [0, 1, 2, 3, 10, 6].map((i) => WORKSHOP_HIGHLIGHTS[i]).filter((h): h is Highlight => h !== undefined)

/** Photos for the "4 things you learn" cards, by card index (0 telepathy: no photo shows pair practice clearly). */
export const LEARN_CARD_PHOTOS: readonly (Highlight | null)[] = [null, HERO_5, HERO_3, HERO_2]
