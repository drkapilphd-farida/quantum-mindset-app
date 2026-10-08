import { NextResponse } from 'next/server'
import { currentAdminEmail, getLearnerOverview } from '@/features/live-classes/admin/data'
import { learnersCsv } from '@/features/live-classes/admin/csv'

export const dynamic = 'force-dynamic'

// CSV export of the learners overview. Route handlers don't pass through the
// admin layout, so the admin check is repeated here.
export async function GET(): Promise<NextResponse> {
  if ((await currentAdminEmail()) === null) return new NextResponse('Not authorized', { status: 403 })
  const csv = learnersCsv(await getLearnerOverview())
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sharp-brain-learners-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
