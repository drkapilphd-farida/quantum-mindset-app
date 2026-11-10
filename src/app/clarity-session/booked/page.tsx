import type { Metadata } from 'next'
import { langOf, type ProgramRouteProps } from '@/features/programs/programRoute'
import { bookedMetadata } from '@/features/clarity-session/routes'
import { ClarityBookedPage } from '@/features/clarity-session/components/ClarityPages'

// /clarity-session/booked — after payment: choose a time on Cal.com
// (owner's conversion brief). Razorpay redirects here after payment.
export async function generateMetadata(props: ProgramRouteProps): Promise<Metadata> {
  return bookedMetadata(await langOf(props))
}

export default async function Page(props: ProgramRouteProps): Promise<React.JSX.Element> {
  return <ClarityBookedPage lang={await langOf(props)} />
}
