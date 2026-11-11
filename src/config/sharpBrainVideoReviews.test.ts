import { describe, expect, it } from 'vitest'
import { SHARP_BRAIN_VIDEO_REVIEWS, sharpBrainReviewCards } from './sharpBrainVideoReviews'

// Owner (Nov 2026): captions matched by YouTube video ID, English and Hindi.
const OWNER: Record<string, { en: string; hi: string }> = {
  g135C_Dak7s: { en: 'Class 9 Student: Reading Speed 100 → 300 WPM, with Retention', hi: 'कक्षा 9 का छात्र: Reading Speed 100 → 300 WPM, याद रखने के साथ' },
  BOqf3ioo1N4: { en: '150 WPM, 30% Retention → 350 WPM, 100% Retention', hi: '150 WPM, 30% याद → 350 WPM, 100% याद' },
  '2wSuE6hQrEg': { en: 'Increase Reading Speed from 100 to 350 WPM', hi: 'Reading Speed 100 से 350 WPM तक' },
  '9oO6Yn2mzs0': { en: 'Reading Speed 100 WPM → 300+ WPM', hi: 'Reading Speed 100 WPM → 300+ WPM' },
  'KTc1B-kajTY': { en: '"He used to study for hours, yet couldn\'t remember anything" — Parent Review, Ruchi ji', hi: '"घंटों पढ़ता था, पर कुछ याद नहीं रहता था" — अभिभावक की राय, रुचि जी' },
  lJIMgohkV1c: { en: 'Struggled with focus… now studying is easy to remember and understand', hi: 'पहले focus नहीं बनता था… अब पढ़ाई समझना और याद रखना आसान है' },
  VMe2HiAj_S4: { en: '"It\'s a must-have for every student."', hi: '"हर student के लिए ज़रूरी है।"' },
}

describe('Sharp Brain review captions', () => {
  it('has every owner caption, matched by video ID, and the same 7 videos in the same order as before', () => {
    expect(SHARP_BRAIN_VIDEO_REVIEWS.map((v) => v.videoId)).toEqual(['g135C_Dak7s', 'BOqf3ioo1N4', 'KTc1B-kajTY', '9oO6Yn2mzs0', '2wSuE6hQrEg', 'lJIMgohkV1c', 'VMe2HiAj_S4'])
    for (const video of SHARP_BRAIN_VIDEO_REVIEWS) expect(video.caption, video.videoId).toEqual(OWNER[video.videoId])
  })

  it('gives the cards the caption in the page language', () => {
    expect(sharpBrainReviewCards('en')[0]?.caption).toBe(OWNER.g135C_Dak7s?.en)
    expect(sharpBrainReviewCards('hi')[0]?.caption).toBe(OWNER.g135C_Dak7s?.hi)
  })
})
