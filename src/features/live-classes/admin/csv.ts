import { toCsv } from '../liveClasses'
import type { LearnerRow } from './data'

const ist = (iso: string | null): string => (iso === null ? '' : new Date(iso).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }))
const yesNo = (v: boolean | null): string => (v === null ? '' : v ? 'Yes' : 'No')

/** The learners overview as CSV (opens in Excel with every script intact). */
export function learnersCsv(rows: readonly LearnerRow[]): string {
  return toCsv([
    ['Name', 'Email', 'Phone', 'Batch', 'Classes done (of 7)', 'Class numbers', 'Recordings', 'Days done (of 30)', 'Day 30 completed', 'Day 1 effective speed', 'Day 1 comprehension %', 'Day 30 effective speed', 'Day 30 comprehension %', 'Test language', 'Certificate ID', 'Claim window closes', 'Claim window', 'No improvement (speed AND retention)', 'Check before refund', 'All refund conditions met'],
    ...rows.map((r) => [
      r.name,
      r.email,
      r.phone,
      r.batch,
      r.classes.length,
      r.classes.join(' '),
      r.recordings.map((x) => `Class ${x.classNumber} ${x.counts ? 'counts' : 'not counted'}`).join('; '),
      r.daysCompleted,
      ist(r.day30At),
      r.day1?.effective ?? null,
      r.day1?.comprehension ?? null,
      r.day30?.effective ?? null,
      r.day30?.comprehension ?? null,
      r.day30?.lang ?? r.day1?.lang ?? null,
      r.certificateCode,
      ist(r.guarantee.claimWindow?.closesAt ?? null),
      r.guarantee.claimWindow === null ? '' : r.guarantee.claimWindow.open ? 'Open' : 'Expired',
      yesNo(r.guarantee.noImprovement),
      r.guarantee.checkBeforeRefund ? 'Yes' : '',
      r.guarantee.qualifies ? 'Yes' : 'No',
    ]),
  ])
}
