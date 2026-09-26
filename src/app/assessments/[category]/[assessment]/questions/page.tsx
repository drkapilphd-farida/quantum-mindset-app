import type { Metadata } from 'next'
import QuestionsPageClient from './QuestionsPageClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Server wrapper: `metadata` exports are disallowed in files marked
// 'use client' (Next.js build-time restriction), and the original page
// component needs useRouter for its client-side "Finish" navigation — so
// the client UI now lives in ./QuestionsPageClient.tsx, unchanged, and
// this file only adds the route's robots metadata.
export default function QuestionsPage(): React.JSX.Element {
  return <QuestionsPageClient />
}
