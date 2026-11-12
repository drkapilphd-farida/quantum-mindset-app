import { reviewFrameSrc, type ThumbFrame, type VideoShape } from '@/lib/video/reviewFrames'

// Phase 4.5 — the Sharp Brain video reviews (YouTube Shorts, 9:16), in the
// owner's order. These replace every older Sharp Brain review on the site
// (qsrVideoReviews.ts / HOME_LEARNING_VIDEO_REVIEWS stay in the code but are
// no longer shown).
//
// title / name: only from the owner's table — still null (not given).
// caption: what each review is about, from the owner (Nov 2026), matched by
// video ID; shown under every card wherever these videos appear.

export type SharpBrainVideoReview = {
  videoId: string
  /** First line under the card (bold). null = not given yet → not shown. */
  title: string | null
  /** Second line (small, grey). null = not given yet → not shown. */
  name: string | null
  /** What the review is about (owner, Nov 2026), English and Hindi — matched by video ID. */
  caption: { en: string; hi: string }
  /** Thumbnail frame from inside the video: hq1 (25%), hq2 (50%, default) or hq3 (75%). Add `thumbFrame: 1` or `3` to switch. */
  thumbFrame?: ThumbFrame
}

export const SHARP_BRAIN_VIDEO_REVIEWS: readonly SharpBrainVideoReview[] = [
  { videoId: 'g135C_Dak7s', title: null, name: null, caption: { en: 'Class 9 Student: Reading Speed 100 → 300 WPM, with Retention', hi: 'कक्षा 9 का छात्र: Reading Speed 100 → 300 WPM, याद रखने के साथ' } },
  { videoId: 'BOqf3ioo1N4', title: null, name: null, thumbFrame: 3, caption: { en: '150 WPM, 30% Retention → 350 WPM, 100% Retention', hi: '150 WPM, 30% याद → 350 WPM, 100% याद' } },
  { videoId: 'KTc1B-kajTY', title: null, name: null, caption: { en: '"He used to study for hours, yet couldn\'t remember anything" — Parent Review, Ruchi ji', hi: '"घंटों पढ़ता था, पर कुछ याद नहीं रहता था" — अभिभावक की राय, रुचि जी' } },
  { videoId: '9oO6Yn2mzs0', title: null, name: null, caption: { en: 'Reading Speed 100 WPM → 300+ WPM', hi: 'Reading Speed 100 WPM → 300+ WPM' } },
  { videoId: '2wSuE6hQrEg', title: null, name: null, thumbFrame: 3, caption: { en: 'Increase Reading Speed from 100 to 350 WPM', hi: 'Reading Speed 100 से 350 WPM तक' } },
  { videoId: 'lJIMgohkV1c', title: null, name: null, caption: { en: 'Struggled with focus… now studying is easy to remember and understand', hi: 'पहले focus नहीं बनता था… अब पढ़ाई समझना और याद रखना आसान है' } },
  { videoId: 'VMe2HiAj_S4', title: null, name: null, caption: { en: '"It\'s a must-have for every student."', hi: '"हर student के लिए ज़रूरी है।"' } },
]

/** The list in VideoReviewGrid's shape, with each video's caption in the page's language. */
export function sharpBrainReviewCards(lang: 'en' | 'hi'): { videoId: string; thumbnailSrc: string; frameShape: VideoShape; caption: string; title?: string; name?: string }[] {
  return SHARP_BRAIN_VIDEO_REVIEWS.map((video) => ({
    videoId: video.videoId,
    // An in-video frame (hq2 by default), not YouTube's title card.
    thumbnailSrc: reviewFrameSrc(video.videoId, video.thumbFrame),
    frameShape: 'S' as const,
    caption: video.caption[lang],
    ...(video.title !== null ? { title: video.title } : {}),
    ...(video.name !== null ? { name: video.name } : {}),
  }))
}

/** English cards, for pages without a Hindi version. */
export const SHARP_BRAIN_REVIEW_CARDS = sharpBrainReviewCards('en')

/** Shorts row: a swipeable strip on phones, one row of 7 on desktop (4 per row on tablets). */
export const SHARP_BRAIN_REVIEW_GRID_CLASS =
  '-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 *:w-[44%] *:flex-none *:snap-start sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:scroll-px-0 sm:px-0 sm:*:w-auto lg:grid-cols-7'
