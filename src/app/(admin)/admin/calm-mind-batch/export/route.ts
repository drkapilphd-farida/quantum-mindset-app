import { NextResponse } from 'next/server'
import { currentAdminEmail } from '@/features/live-classes/admin/data'
import { listRegistrations } from '@/features/calm-batch/registrations'
import { calmRegistrationsCsv } from '@/features/calm-batch/csv'

export const dynamic = 'force-dynamic'

// CSV export of the 21-Day Calm Mind batch registrations. Route handlers don't
// pass through the admin layout, so the admin check is repeated here.
export async function GET(): Promise<NextResponse> {
  if ((await currentAdminEmail()) === null) return new NextResponse('Not authorized', { status: 403 })
  const csv = calmRegistrationsCsv(await listRegistrations())
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  return new NextResponse(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="calm-mind-batch-${date}.csv"`, 'Cache-Control': 'no-store' },
  })
}
