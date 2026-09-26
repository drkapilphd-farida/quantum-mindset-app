import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DiscoverWelcomePreviewLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <>{children}</>
}
