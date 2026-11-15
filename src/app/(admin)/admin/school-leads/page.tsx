import type { Metadata } from 'next'
import Link from 'next/link'
import { listSchoolLeads } from '@/features/schools/admin/data'
import { SchoolLeadsTable } from '@/features/schools/admin/SchoolLeadsTable'

// listSchoolLeads() uses the service client directly (no dynamic-API signal),
// so this must never be rendered at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: 'School leads — Admin',
  robots: { index: false, follow: false },
}

// "Book a free pilot" requests from /schools.
export default async function AdminSchoolLeadsPage(): Promise<React.JSX.Element> {
  const leads = await listSchoolLeads()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">School leads</h1>
        <p className="text-sm text-muted-foreground">
          &ldquo;Book a free pilot&rdquo; requests from the{' '}
          <Link href="/schools" className="underline" target="_blank">
            Schools page
          </Link>
          . Change the page&rsquo;s photos, prices and results in{' '}
          <Link href="/admin/school-page" className="underline">
            Schools page settings
          </Link>
          .
        </p>
      </div>
      <SchoolLeadsTable rows={leads} />
    </div>
  )
}
