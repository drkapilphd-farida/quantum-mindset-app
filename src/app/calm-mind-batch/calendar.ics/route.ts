import { buildBatchIcs } from '@/features/calm-batch/batch'

// The 6 Calm Mind classes as a calendar file (8:00–9:00 PM IST). Public, so
// it carries no Zoom link — the email's copy has it.
export function GET(): Response {
  return new Response(buildBatchIcs(), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="calm-mind-classes.ics"' },
  })
}
