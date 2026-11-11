// Review video thumbnails (owner, Nov 2026): a frame from inside the video
// instead of YouTube's title card. YouTube gives three auto frames per video:
// hq1.jpg (25%), hq2.jpg (50%), hq3.jpg (75%). Default: hq2. Each video can
// switch with `thumbFrame: 1 | 3` in its reviews data.
//
// The frames are 480×360 (4:3) with black bars around the video: a Short sits
// in the middle with bars left and right; a landscape video has bars top and
// bottom. Cards crop with object-fit: cover and object-position: center 35%
// (faces sit in the upper-middle), then zoom just enough that no black bar
// shows in the card's shape (reviewFrameScale).

export type ThumbFrame = 1 | 2 | 3
export type VideoShape = 'S' | 'L'

export const DEFAULT_THUMB_FRAME: ThumbFrame = 2
export const REVIEW_FRAME_POSITION = 'center 35%'

export function reviewFrameSrc(id: string, frame: ThumbFrame = DEFAULT_THUMB_FRAME): string {
  return `https://i.ytimg.com/vi/${id}/hq${frame}.jpg`
}

const IMG_W = 480
const IMG_H = 360
const POS_X = 0.5
const POS_Y = 0.35

/**
 * The smallest zoom (≥ 1) at which a card of `boxAspect` (width / height),
 * cropped at center 35%, shows only video and no black bar.
 */
export function reviewFrameScale(boxAspect: number, shape: VideoShape): number {
  // Where the real video sits inside the 4:3 frame.
  const content = shape === 'S' ? { x0: (IMG_W - (IMG_H * 9) / 16) / 2, x1: (IMG_W + (IMG_H * 9) / 16) / 2, y0: 0, y1: IMG_H } : { x0: 0, x1: IMG_W, y0: (IMG_H - (IMG_W * 9) / 16) / 2, y1: (IMG_H + (IMG_W * 9) / 16) / 2 }
  // What object-fit: cover shows at zoom 1.
  const visW = boxAspect > IMG_W / IMG_H ? IMG_W : IMG_H * boxAspect
  const visH = boxAspect > IMG_W / IMG_H ? IMG_W / boxAspect : IMG_H
  for (let s = 1; s <= 4; s += 0.01) {
    const w = visW / s
    const h = visH / s
    const x = POS_X * (IMG_W - w)
    const y = POS_Y * (IMG_H - h)
    // 1px margin so no hairline of a bar shows after rounding.
    if (x >= content.x0 + 1 && x + w <= content.x1 - 1 && y >= content.y0 && y + h <= content.y1 - 1) return Math.round(s * 100) / 100
  }
  return 4
}

/** Inline style for the frame inside its card: crop point + zoom about the same point. */
export function reviewFrameStyle(boxAspect: number, shape: VideoShape): React.CSSProperties {
  const scale = reviewFrameScale(boxAspect, shape)
  return { objectPosition: REVIEW_FRAME_POSITION, transform: `scale(${scale})`, transformOrigin: REVIEW_FRAME_POSITION }
}
