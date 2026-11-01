import type { ReactNode } from 'react'
import './telepathy-workshop.css'

// /telepathy-workshop uses the site's own fonts (Inter + Noto Sans
// Devanagari from the root layout), like the other workshop pages; this
// layout only adds the page's stylesheet.
export default function TelepathyWorkshopLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <>{children}</>
}
