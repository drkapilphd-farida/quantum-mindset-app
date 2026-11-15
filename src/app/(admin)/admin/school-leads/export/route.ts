import { NextResponse } from 'next/server'
import { currentAdminEmail } from '@/features/live-classes/admin/data'
import { listSchoolLeads } from '@/features/schools/admin/data'
import { schoolLeadsCsv } from '@/features/schools/csv'

export const dynamic = 'force-dynamic'

// CSV export of the school leads. Route handlers don't pass through the admin
// layout, so the admin check is repeated here.
export async function GET(): Promise<NextResponse> {
  if ((await currentAdminEmail()) === null) return new NextResponse('Not authorized', { status: 403 })
  const csv = schoolLeadsCsv(await listSchoolLeads())
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  // A BOM so Excel opens Hindi text correctly.
  return new NextResponse('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="school-leads-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
