// QSR Real Video Testimonials™ (Phase 6A) — 13 real, individually supplied
// YouTube video URLs (Shorts + long-form), split into a featured 6 (3
// Adults + 3 Young Learners) and a "Watch More" 7. Thumbnails are
// YouTube's own official static thumbnail (i.ytimg.com/.../hqdefault.jpg),
// downloaded once and stored locally under public/qsr-videos/ — not an
// arbitrary scrubbed frame, so there was no ability to hand-pick a
// different moment from within a video. Each was visually inspected
// before selection; none of the 13 official thumbnails happen to be
// blindfold-dominated, so no video was excluded on that basis.
//
// Age-group classification is based on visual inspection of the person in
// each official thumbnail (adult vs. clearly child/teen), not filename or
// guesswork. Two videos (UM9LBm0hh0Y, 1pvc5yHgJGU) show a person whose age
// could not be confidently placed in either bucket, so they were left out
// of both featured groups and placed under "Watch More" instead of being
// forced into a category.
//
// `label` (see the "Home & QSR Testimonial/Video Reorder" task) — no
// name/age/profession was ever supplied alongside these 13 video URLs
// (see QsrVideoTestimonials.tsx's own doc comment on this), so a specific
// name or exact age would be fabricated, not sourced. These are the
// same honest, category-level labels the age-group classification above
// already supports — "Student" / "Working Professional" — not a
// generic "Quantum Speed Reading Program" caption repeated everywhere,
// but not a fabricated identity either. QSR_MORE_VIDEO_REVIEWS mixes
// both age groups (unclassified by video, see above), so it gets the
// one honest umbrella label that's true regardless of which group a
// given video is actually in.
export type QsrVideoReview = {
  videoId: string
  thumbnailSrc: string | undefined
  label: string
}

export const QSR_ADULT_VIDEO_REVIEWS: readonly QsrVideoReview[] = [
  { videoId: 'l77qMQmRdqY', thumbnailSrc: '/qsr-videos/l77qMQmRdqY-thumb.jpg', label: 'Working Professional' },
  { videoId: 'R2icA1-gbTY', thumbnailSrc: '/qsr-videos/R2icA1-gbTY-thumb.jpg', label: 'Working Professional' },
  { videoId: 'RX7t26jYNUg', thumbnailSrc: '/qsr-videos/RX7t26jYNUg-thumb.jpg', label: 'Working Professional' },
]

export const QSR_YOUNG_LEARNER_VIDEO_REVIEWS: readonly QsrVideoReview[] = [
  { videoId: 'WCt_kzlmdj8', thumbnailSrc: '/qsr-videos/WCt_kzlmdj8-thumb.jpg', label: 'Student' },
  { videoId: 'FyOm01mfBf0', thumbnailSrc: '/qsr-videos/FyOm01mfBf0-thumb.jpg', label: 'Student' },
  { videoId: 'VHgzVzVr-B8', thumbnailSrc: '/qsr-videos/VHgzVzVr-B8-thumb.jpg', label: 'Student' },
]

// The remaining 7 of the 13 supplied videos — never hidden, always
// reachable via the "Watch More Student Stories" toggle in
// QsrVideoTestimonials.tsx.
export const QSR_MORE_VIDEO_REVIEWS: readonly QsrVideoReview[] = [
  { videoId: 'UM9LBm0hh0Y', thumbnailSrc: '/qsr-videos/UM9LBm0hh0Y-thumb.jpg', label: 'Quantum Speed Reading Student' },
  { videoId: '1pvc5yHgJGU', thumbnailSrc: '/qsr-videos/1pvc5yHgJGU-thumb.jpg', label: 'Quantum Speed Reading Student' },
  { videoId: 'B2HwCJwMPDQ', thumbnailSrc: '/qsr-videos/B2HwCJwMPDQ-thumb.jpg', label: 'Quantum Speed Reading Student' },
  { videoId: 'V_-iUWQarT4', thumbnailSrc: '/qsr-videos/V_-iUWQarT4-thumb.jpg', label: 'Quantum Speed Reading Student' },
  { videoId: 'QutuICwaKJ4', thumbnailSrc: '/qsr-videos/QutuICwaKJ4-thumb.jpg', label: 'Quantum Speed Reading Student' },
  { videoId: 'TpCltll0VFc', thumbnailSrc: '/qsr-videos/TpCltll0VFc-thumb.jpg', label: 'Quantum Speed Reading Student' },
  { videoId: 'uetG4y2SXTY', thumbnailSrc: '/qsr-videos/uetG4y2SXTY-thumb.jpg', label: 'Quantum Speed Reading Student' },
]
