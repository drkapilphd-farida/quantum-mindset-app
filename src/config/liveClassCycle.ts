// The Sharp Brain live-class cycle (spec of 4 Nov 2026): 7 live Zoom
// classes, one hour each, repeating every Monday and Thursday. Every class
// works on its own, so a learner can join the cycle at any class. The app's
// sessions (live_class_sessions) are created from this pattern in
// /admin/live-classes; the website's "Next live class" date is computed from
// it. Times are India time (IST).

export type CycleClass = {
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7
  titleEn: string
  titleHi: string
  /** Zoom / registration link, when there is a fixed one. null = register on WhatsApp in the app. */
  zoomUrl: string | null
  /** YouTube id of the recording shown on the class page in the app. null = not added yet. */
  recordingId: string | null
}

export const LIVE_CLASS_CYCLE = {
  /** 0 = Sunday … 6 = Saturday. */
  weekdays: [1, 4] as readonly number[],
  startIst: '20:00',
  endIst: '21:00',
  /** The first class of the first cycle (Mon 9 Nov 2026). */
  firstCycleStart: '2026-11-09',
  /** India dates with no class (holidays); the cycle moves to the next class day. */
  skipDates: [] as readonly string[],
  classes: [
    { n: 1, titleEn: 'Foundation', titleHi: 'बुनियाद', zoomUrl: null, recordingId: null },
    { n: 2, titleEn: 'Eye & Focus Training', titleHi: 'आँख और फ़ोकस ट्रेनिंग', zoomUrl: null, recordingId: null },
    { n: 3, titleEn: 'Inner Voice Control', titleHi: 'मन की आवाज़ पर नियंत्रण', zoomUrl: null, recordingId: null },
    { n: 4, titleEn: 'Memory Systems', titleHi: 'मेमोरी सिस्टम', zoomUrl: null, recordingId: null },
    { n: 5, titleEn: 'Visualisation & imagination', titleHi: 'विज़ुअलाइज़ेशन और कल्पना', zoomUrl: null, recordingId: null },
    { n: 6, titleEn: 'Study & Work Application', titleHi: 'पढ़ाई और काम में उपयोग', zoomUrl: null, recordingId: null },
    { n: 7, titleEn: 'Day 30 Review & Your Next Plan', titleHi: 'दिन 30 की समीक्षा और आपकी अगली योजना', zoomUrl: null, recordingId: null },
  ] as readonly CycleClass[],
} as const

/** The weekly live Q&A on Zoom (replaces the Tue & Fri live demo class, 4 Nov 2026). 0 = Sunday. */
export const LIVE_QA = { weekday: 0, startIst: '19:00', minutes: 30 } as const

/** YouTube id of the on-demand demo video (unlisted) on /sharp-brain/demo. null = not added yet. */
export const SHARP_BRAIN_DEMO_VIDEO_ID: string | null = null

/** The monthly live "Day 30 review & Q&A" — an ISO instant, or null while no date is set. */
export const DAY30_REVIEW_AT: string | null = null

/** YouTube id of the 10-minute "Start here" orientation video. null = show the short text guide. */
export const ORIENTATION_VIDEO_ID: string | null = null
