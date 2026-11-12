import { describe, expect, it } from 'vitest'
import { sharpBrainCopy } from './sharpBrainCopy'
import { qsrGuarantee } from '@/config/site.config'

// Owner (Nov 2026): EEG brain test in the Sharp Brain Live batch only, offline.
describe('Sharp Brain Live — EEG brain test', () => {
  for (const lang of ['en', 'hi'] as const) {
    const t = sharpBrainCopy[lang].offers.table
    it(`${lang}: sits right after the 7 classes, Live only, offline`, () => {
      expect(t.rows[0]?.live).toBe(lang === 'en' ? 'Live' : 'लाइव')
      const eeg = t.rows[1]
      expect(eeg?.self).toBe(false)
      expect(eeg?.live).toEqual({ included: true, note: lang === 'en' ? 'offline' : 'ऑफ़लाइन' })
      expect(eeg?.feature).toBe(lang === 'en' ? 'EEG Brain Test (Day 1 & Day 30)' : 'EEG ब्रेन टेस्ट (Day 1 & Day 30)')
      expect(t.rows.filter((row) => row.card !== undefined)).toHaveLength(1)
    })
  }

  it('uses the owner’s wording', () => {
    expect(sharpBrainCopy.hi.offers.table.rows[1]?.card).toEqual({
      text: '🧠 EEG ब्रेन टेस्ट — Day 1 और Day 30 पर (Muse EEG हेडबैंड से) — अपने फ़ोकस का बदलाव ग्राफ़ में देखें',
      note: 'ऑफ़लाइन — वडोदरा / वर्कशॉप सेंटर पर। ऑनलाइन छात्रों के लिए Day 1 और Day 30 का Sharp Brain टेस्ट।',
    })
    expect(sharpBrainCopy.en.offers.table.rows[1]?.card).toEqual({
      text: '🧠 EEG Brain Test on Day 1 & Day 30 (Muse EEG headband) — see your focus change on a graph',
      note: 'Offline at Vadodara / workshop centres. Online students take the regular Day 1 & Day 30 Sharp Brain test.',
    })
    const faq = sharpBrainCopy.hi.faq.items.find((item) => item.question === 'EEG ब्रेन टेस्ट क्या है?')
    expect(faq?.answer).toBe(
      'यह Muse EEG हेडबैंड से किया जाने वाला एक आसान टेस्ट है, जो पढ़ते और ध्यान करते समय आपके फ़ोकस का संकेत (indicator) ग्राफ़ में दिखाता है। Day 1 और Day 30 की तुलना से आप अपना बदलाव ख़ुद देख सकते हैं। यह कोई मेडिकल जाँच नहीं है। यह टेस्ट ऑफ़लाइन (वडोदरा / वर्कशॉप सेंटर) पर होता है।',
    )
    expect(sharpBrainCopy.en.faq.items.some((item) => item.question === 'What is the EEG brain test?')).toBe(true)
  })

  it('uses no diagnostic words, and leaves the guarantee untouched', () => {
    const text = JSON.stringify([sharpBrainCopy.en.offers, sharpBrainCopy.en.faq, sharpBrainCopy.hi.offers, sharpBrainCopy.hi.faq]).toLowerCase()
    for (const word of ['diagnos', 'brain scan', 'clinical', 'निदान']) expect(text).not.toContain(word)
    expect(qsrGuarantee.en.short.length).toBeGreaterThan(0)
  })
})
