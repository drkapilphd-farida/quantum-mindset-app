import type { ReactNode } from 'react'
import '../telepathy-workshop/telepathy-workshop.css'

// /vadodara is built from the /telepathy-workshop page's pieces, so it uses
// that page's stylesheet (no new CSS).
export default function VadodaraLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <>{children}</>
}
