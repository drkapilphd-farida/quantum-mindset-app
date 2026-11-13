import type { Metadata } from 'next'
import { listRecordingsForAdmin } from '@/features/sharp-brain-plans/admin/recordingsActions'
import { RecordingsAdmin } from '@/features/sharp-brain-plans/admin/RecordingsAdmin'
import { todayIst } from '@/features/manual-enrolments/rules'

// Uses the service-role client — never at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const metadata: Metadata = { title: 'Class recordings — Admin', robots: { index: false, follow: false } }

// Sharp Brain class recordings (YouTube unlisted). Saved here → learners with
// Sharp Brain access (live or self-paced) see them at once in Live Classes.
export default async function RecordingsAdminPage(): Promise<React.JSX.Element> {
  const recordings = await listRecordingsForAdmin()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Class recordings</h1>
        <p className="text-sm text-muted-foreground">
          Paste the YouTube link of an unlisted video, choose the class and date, and press Save — learners with Sharp Brain access (live batch or self-paced) can watch it straight away in Live Classes → Class recordings. The video plays inside the app; the YouTube link itself is never shown to learners. After a live
          class ends, learners see “Recording coming soon” until you add its link.
        </p>
      </div>
      <RecordingsAdmin recordings={recordings} today={todayIst()} />
    </div>
  )
}
