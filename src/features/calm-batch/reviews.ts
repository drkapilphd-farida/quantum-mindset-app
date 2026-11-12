import { REVIEW_VIDEOS, type ReviewVideo } from '@/features/programs/reviewVideos'

/** The 6 review videos the owner chose for /calm-mind-batch, matched by caption (reviewVideos.ts). */
export const CALM_REVIEW_CAPTIONS = [
  'I was mentally disturbed. After the program I feel very well.',
  'A deep experience of meditation.',
  'His meditation is really very good.',
  'By connecting with the universe, I feel well again.',
  'A meditation experience like never before.',
  'I feel ten times more confident now.',
] as const

export function calmReviewVideos(): ReviewVideo[] {
  return CALM_REVIEW_CAPTIONS.map((caption) => REVIEW_VIDEOS.find((v) => v.caption.en === caption)).filter((v): v is ReviewVideo => v !== undefined)
}
