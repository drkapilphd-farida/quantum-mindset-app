import type { ReactNode } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import './telepathy-workshop.css'

// English headline font for /telepathy-workshop only: Cormorant Garamond.
// Body fonts (Inter + Noto Sans Devanagari) come from the root layout. The
// Hindi headline font (Noto Serif Devanagari) is self-hosted as subsets and
// declared in telepathy-workshop.css, so it loads only for Hindi.
const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: '600',
  style: ['normal', 'italic'],
  variable: '--font-tw-serif',
  display: 'swap',
})

export default function TelepathyWorkshopLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <div className={serif.variable}>{children}</div>
}
