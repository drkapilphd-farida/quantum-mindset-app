import type { Metadata } from 'next'
import Link from 'next/link'
import { getSchoolSettings } from '@/features/schools/settingsServer'
import { SchoolSettingsForm } from '@/features/schools/admin/SchoolSettingsForm'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: 'Schools page settings — Admin',
  robots: { index: false, follow: false },
}

// /schools content that changes without a deploy (school_page_settings).
export default async function AdminSchoolPageSettings(): Promise<React.JSX.Element> {
  const settings = await getSchoolSettings()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Schools page settings</h1>
        <p className="text-sm text-muted-foreground">
          Photos, sample reports, example values, prices, results and FAQ for the{' '}
          <Link href="/schools" className="underline" target="_blank">
            Schools page
          </Link>
          . Real data only: anything left empty stays hidden.
        </p>
      </div>
      <SchoolSettingsForm initial={settings} />
    </div>
  )
}
