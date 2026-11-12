import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import { isValidJoinedToken } from '@/features/calm-batch/joinedToken'
import { CalmJoinedPage } from '@/features/calm-batch/components/CalmJoined'

type Props = { searchParams: Promise<{ lang?: string | string[]; pid?: string | string[]; t?: string | string[] }> }

// After a verified payment (not for search engines). The signed link from
// confirmCalmPayment decides whether the joining links show.
export const metadata: Metadata = buildPageMetadata({ path: '/calm-mind-batch/joined', title: "You're in — 21-Day Calm Mind batch | Mind Ur Mind", description: 'Your joining details for the 21-Day Calm Mind live batch.', index: false })

const one = (value: string | string[] | undefined): string => (Array.isArray(value) ? (value[0] ?? '') : (value ?? ''))

export default async function Page({ searchParams }: Props): Promise<React.JSX.Element> {
  const params = await searchParams
  const lang = langFromParam(params.lang) ?? 'en'
  const pid = one(params.pid)
  const verified = isValidJoinedToken(pid, one(params.t))
  return <CalmJoinedPage lang={lang} verifiedPaymentId={verified ? pid : null} />
}
