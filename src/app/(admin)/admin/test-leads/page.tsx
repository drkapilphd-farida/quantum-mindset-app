import type { Metadata } from 'next'
import { getTestLeads } from '@/features/test-leads/queries/getTestLeads'
import { TestLeadsTable } from '@/features/test-leads/components/TestLeadsTable'

// Service-role read: no dynamic API of its own, so force per-request
// rendering (same as the Franchise Leads page).
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: 'Test Leads — Admin',
  robots: { index: false, follow: false },
}

export default async function AdminTestLeadsPage(): Promise<React.JSX.Element> {
  const leads = await getTestLeads()
  const fresh = leads.filter((l) => l.status === 'new').length
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Test Leads</h1>
        <p className="text-sm text-muted-foreground">
          Everyone who left their WhatsApp number after the free test — {leads.length} in all, {fresh} not contacted yet. Each new lead is also emailed to you.
        </p>
      </div>
      <TestLeadsTable rows={leads} />
    </div>
  )
}
