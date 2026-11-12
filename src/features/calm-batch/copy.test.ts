import { describe, expect, it } from 'vitest'
import { CALM_COPY } from './copy'
import { calmReviewVideos } from './reviews'

describe('21-Day Calm Mind copy', () => {
  it('uses the owner’s disclaimer, hero and price lines word for word', () => {
    expect(CALM_COPY.disclaimer.en).toBe('This is a coaching and meditation program, not a substitute for medical or psychological treatment. If you are in crisis, please contact a doctor or Tele-MANAS 14416.')
    expect(CALM_COPY.disclaimer.hi).toBe('यह coaching और meditation program है, चिकित्सा या मनोवैज्ञानिक उपचार का विकल्प नहीं। संकट में हों तो डॉक्टर या Tele-MANAS 14416 से संपर्क करें।')
    expect(CALM_COPY.hero.h1.en).toBe('Build a calm mind in 21 days — live, with Dr. Kapil')
    expect(CALM_COPY.hero.h1.hi).toBe('21 दिन में शांत मन की आदत — डॉ. कपिल के साथ, लाइव')
    expect(CALM_COPY.hero.reserve.en).toBe('Reserve my seat — ₹2,999')
    expect(CALM_COPY.meta.title.en).toBe('21-Day Calm Mind — Live Online Batch with Dr. Kapil Dev Sharma')
    expect(CALM_COPY.reviews.heading.en).toBe('What people say about learning with Dr. Kapil')
    expect(CALM_COPY.refund.en).toBe("Full refund if you cancel before the first class begins. After the first class, refunds aren't available — but you can move once to the next batch.")
    expect(CALM_COPY.refund.hi).toBe('पहली class शुरू होने से पहले रद्द करने पर पूरा पैसा वापस। पहली class के बाद refund नहीं, लेकिन आप एक बार अगले batch में शिफ़्ट हो सकते हैं।')
  })

  it('never uses the banned words (outside the required disclaimer)', () => {
    const { disclaimer: _d, ...rest } = CALM_COPY
    const text = JSON.stringify(rest, (_key, value: unknown) => (typeof value === 'function' ? String(value) : value)).toLowerCase()
    for (const pattern of [/\bcur(e|es|ed|ing)\b/, /\btreat/, /\bheal(?!th)/, /\bguarantee/, /100%/, /therapy/, /दवा छुड़ाना/, /इलाज/]) expect(text, String(pattern)).not.toMatch(pattern)
  })

  it('finds all 6 review videos by caption (no substitutes)', () => {
    expect(calmReviewVideos().map((v) => v.id)).toEqual(['otIFQVpc-RQ', '4Qiz0rkpTwc', 's87Pxs0EP58', 'nwyXXshYg3Y', 'yQzvY-YDaM0', 'SPD1x72viiU'])
  })
})
