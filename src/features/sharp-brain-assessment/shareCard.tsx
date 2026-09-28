import { ImageResponse } from 'next/og'
import { programs } from '@/config/site.config'
import type { AssessmentRecord } from './assessmentTypes'

// Share card (Phase 8, Item 11): first name and Day 1 → Day 30 numbers
// only — never contact details. English only (the default image font has
// no Devanagari), so a non-Latin first name is left off the card.
export function buildShareCardResponse({ firstName, day1, day30 }: { firstName: string | null; day1: AssessmentRecord; day30: AssessmentRecord }): ImageResponse {
  const rows: [string, string, string][] = [
    ['Reading speed', `${day1.wpm} wpm`, `${day30.wpm} wpm`],
    ['Comprehension', `${day1.comprehensionPercent}%`, `${day30.comprehensionPercent}%`],
    ['Effective reading speed', `${day1.effectiveWpm}`, `${day30.effectiveWpm}`],
    ['Attention accuracy', `${day1.attentionAccuracyPercent}%`, `${day30.attentionAccuracyPercent}%`],
  ]
  const latinName = firstName !== null && /^[\p{Script=Latin}' -]+$/u.test(firstName) ? firstName : null

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0b0f17', color: '#edeef3', padding: 72 }}>
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 4, color: '#d4af37' }}>MIND UR MIND</div>
        <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, marginTop: 20 }}>{programs.sharpBrain.name}</div>
        <div style={{ display: 'flex', fontSize: 36, marginTop: 12, color: '#9ca3b8' }}>{latinName !== null ? `${latinName}’s Day 1 → Day 30` : 'Day 1 → Day 30'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 56, gap: 28 }}>
          {rows.map(([label, from, to]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 38, borderBottom: '1px solid #2a3142', paddingBottom: 18 }}>
              <span style={{ display: 'flex', color: '#9ca3b8' }}>{label}</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ display: 'flex' }}>{from} →</span>
                <span style={{ display: 'flex', marginLeft: 12, color: '#d4af37', fontWeight: 700 }}>{to}</span>
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 24, color: '#616b82' }}>Practice assessment — not a medical or psychological test · mindurmind.org.in</div>
      </div>
    ),
    { width: 1080, height: 1080 },
  )
}
