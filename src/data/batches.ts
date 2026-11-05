import { LINKS, VADODARA_MAPS_SEARCH } from './links'

// Positioning rework (BRIEF.md, Phase 0) — the ONE place for workshop
// dates, venues, prices and seats. No page or countdown may hardcode its
// own date; read it from here.
//
// Rules:
// - A batch whose endDate (IST) has passed is hidden automatically.
// - A city/program with no upcoming batch, or with startDate null, shows
//   FALLBACK_HI / FALLBACK_EN (linked to WhatsApp) — never an empty space.
// - seatsLeft is filled in by hand and never counts down by itself.

export type Batch = {
  id: 'mumbai' | 'online' | 'ahmedabad' | 'vadodara' | 'pune' | 'exec-mumbai'
  startDate: string | null // 'YYYY-MM-DD', IST. null = date not fixed
  endDate: string | null
  labelHi: string // e.g. '28–29 नवंबर 2026'
  labelEn: string // e.g. '28–29 November 2026'
  timeHi?: string
  venueHi?: string
  venueEn?: string
  priceInr?: number
  depositInr?: number // offline batches: 1000 (seat booking)
  seatsTotal?: number // Online: 40
  seatsLeft?: number | null // filled by hand. null = show only "40 सीट", no count
  bookingLinkKey?: keyof typeof LINKS
  mapsSearchUrl?: string
}

export type BatchId = Batch['id']

export const FALLBACK_HI = 'अगली तारीख जल्दी — वॉट्सऐप पर पूछिए'
export const FALLBACK_EN = 'Next date soon — ask on WhatsApp'

export const BATCHES: readonly Batch[] = [
  {
    id: 'mumbai',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    labelHi: '14–15 नवंबर 2026',
    labelEn: '14–15 November 2026',
    timeHi: 'सुबह 9:30 – शाम 6:00',
    venueHi: 'Hotel Better Home International, अंधेरी ईस्ट',
    venueEn: 'Hotel Better Home International, Sahar Road, opp. Andheri East Railway Station, Andheri East',
    priceInr: 5999,
    depositInr: 1000,
    bookingLinkKey: 'rzpTelepathyDeposit1000',
  },
  {
    id: 'online',
    startDate: '2026-11-17',
    endDate: '2026-11-19',
    labelHi: '17, 18, 19 नवंबर 2026',
    labelEn: '17, 18, 19 November 2026',
    timeHi: 'रात 7:30 – 10:00',
    venueHi: 'ज़ूम',
    venueEn: 'Zoom',
    priceInr: 3999,
    seatsTotal: 40,
    seatsLeft: null,
    bookingLinkKey: 'rzpOnline3999',
  },
  {
    id: 'ahmedabad',
    startDate: '2026-11-21',
    endDate: '2026-11-22',
    labelHi: '21–22 नवंबर 2026',
    labelEn: '21–22 November 2026',
    timeHi: 'सुबह 9:30 – शाम 6:00',
    venueHi: 'Hotel Silver Cloud, आश्रम रोड',
    venueEn: 'Hotel Silver Cloud, Ashram Road',
    priceInr: 5999,
    depositInr: 1000,
    bookingLinkKey: 'rzpTelepathyDeposit1000',
  },
  {
    id: 'vadodara',
    startDate: '2026-11-28',
    endDate: '2026-11-29',
    labelHi: '28–29 नवंबर 2026',
    labelEn: '28–29 November 2026',
    timeHi: 'सुबह 9:30 – शाम 6:00',
    venueHi: 'Hotel Surya, रेलवे स्टेशन के पास',
    priceInr: 5999,
    depositInr: 1000,
    bookingLinkKey: 'rzpTelepathyDeposit1000',
    mapsSearchUrl: VADODARA_MAPS_SEARCH,
  },
  {
    id: 'pune',
    startDate: null,
    endDate: null,
    labelHi: FALLBACK_HI,
    labelEn: FALLBACK_EN,
  },
  {
    id: 'exec-mumbai',
    startDate: null,
    endDate: null,
    labelHi: '[[EXEC_DATE]]',
    labelEn: '[[EXEC_DATE]]',
  },
]

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

/** Today's calendar date in India, as 'YYYY-MM-DD'. */
export function todayIst(now: Date = new Date()): string {
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10)
}

/** A dated batch is over once its endDate (IST) is in the past; it stays visible through its last day. */
export function isBatchOver(batch: Batch, now: Date = new Date()): boolean {
  return batch.endDate !== null && batch.endDate < todayIst(now)
}

/** The batch for `id` if it has a fixed date and is not over yet; otherwise null (show the fallback line). */
export function upcomingBatch(id: BatchId, now: Date = new Date(), batches: readonly Batch[] = BATCHES): Batch | null {
  const batch = batches.find((b) => b.id === id)
  if (batch === undefined || batch.startDate === null || isBatchOver(batch, now)) return null
  return batch
}

/** Every dated batch that is not over yet, earliest first. */
export function upcomingBatches(now: Date = new Date(), batches: readonly Batch[] = BATCHES): Batch[] {
  return batches
    .filter((b): b is Batch & { startDate: string } => b.startDate !== null && !isBatchOver(b, now))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

const MONTHS_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'] as const

/** "17 नवंबर" — the first day of a dated batch, in Hindi. */
export function startDayHi(batch: Batch & { startDate: string }): string {
  const [, month, day] = batch.startDate.split('-').map(Number)
  return `${day ?? ''} ${MONTHS_HI[(month ?? 1) - 1] ?? ''}`
}

/** "28–29 नवंबर" — labelHi without the year. */
export function labelHiNoYear(batch: Batch): string {
  return batch.labelHi.replace(/\s\d{4}$/, '')
}

const WEEKDAYS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'] as const

/** "(शनि–रवि)" — the first and last weekday of a dated batch, in Hindi ('' without dates). */
export function weekdaysHi(batch: Batch): string {
  if (batch.startDate === null || batch.endDate === null) return ''
  const day = (iso: string): string => WEEKDAYS_HI[new Date(`${iso}T12:00:00Z`).getUTCDay()] ?? ''
  return `(${day(batch.startDate)}–${day(batch.endDate)})`
}

/** "14–15" — the day numbers of a dated batch ('' without dates). */
export function dayRange(batch: Batch): string {
  if (batch.startDate === null || batch.endDate === null) return ''
  const day = (iso: string): number => Number(iso.slice(8, 10))
  return `${day(batch.startDate)}–${day(batch.endDate)}`
}
