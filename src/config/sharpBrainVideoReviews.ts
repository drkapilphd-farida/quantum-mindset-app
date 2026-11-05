// Phase 4.5 — the Sharp Brain video reviews (YouTube Shorts, 9:16), in the
// owner's order. These replace every older Sharp Brain review on the site
// (qsrVideoReviews.ts / HOME_LEARNING_VIDEO_REVIEWS stay in the code but are
// no longer shown).
//
// title / name: only from the owner's table. All seven are still
// placeholders there ([[TITLE_n]] / [[NAME_n]]), so they are null and the
// card shows no text line. Fill them in here when the owner sends them —
// never from YouTube or by guessing.

export type SharpBrainVideoReview = {
  videoId: string
  /** First line under the card (bold). null = not given yet → not shown. */
  title: string | null
  /** Second line (small, grey). null = not given yet → not shown. */
  name: string | null
}

export const SHARP_BRAIN_VIDEO_REVIEWS: readonly SharpBrainVideoReview[] = [
  { videoId: 'g135C_Dak7s', title: null, name: null }, // [[TITLE_1]] / [[NAME_1]]
  { videoId: 'BOqf3ioo1N4', title: null, name: null }, // [[TITLE_2]] / [[NAME_2]]
  { videoId: 'KTc1B-kajTY', title: null, name: null }, // [[TITLE_3]] / [[NAME_3]]
  { videoId: '9oO6Yn2mzs0', title: null, name: null }, // [[TITLE_4]] / [[NAME_4]]
  { videoId: '2wSuE6hQrEg', title: null, name: null }, // [[TITLE_5]] / [[NAME_5]]
  { videoId: 'lJIMgohkV1c', title: null, name: null }, // [[TITLE_6]] / [[NAME_6]]
  { videoId: 'VMe2HiAj_S4', title: null, name: null }, // [[TITLE_7]] / [[NAME_7]]
]

/** The same list in VideoReviewGrid's shape: YouTube's own thumbnail (served through next/image). */
export const SHARP_BRAIN_REVIEW_CARDS = SHARP_BRAIN_VIDEO_REVIEWS.map((video) => ({
  videoId: video.videoId,
  thumbnailSrc: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
  ...(video.title !== null ? { title: video.title } : {}),
  ...(video.name !== null ? { name: video.name } : {}),
}))

/** Shorts row: a swipeable strip on phones, one row of 7 on desktop (4 per row on tablets). */
export const SHARP_BRAIN_REVIEW_GRID_CLASS =
  '-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 *:w-[44%] *:flex-none *:snap-start sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:scroll-px-0 sm:px-0 sm:*:w-auto lg:grid-cols-7'
