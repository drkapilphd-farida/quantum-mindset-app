import type { Metadata } from 'next'
import NotFoundContent from '@/components/site/NotFoundContent'

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Mind Ur Mind' },
  robots: { index: false, follow: true },
}

export default function NotFound(): React.JSX.Element {
  return <NotFoundContent />
}
