import type { Metadata } from 'next'
import { TELEPATHY_COPY, TELEPATHY_PATH } from '@/features/events/copy'
import { EventRoute, eventMetadata, type EventRouteProps } from '@/features/events/route'

export async function generateMetadata(props: EventRouteProps): Promise<Metadata> {
  return eventMetadata(TELEPATHY_COPY, TELEPATHY_PATH, props)
}

export default async function Page(props: EventRouteProps): Promise<React.JSX.Element> {
  return <EventRoute copy={TELEPATHY_COPY} path={TELEPATHY_PATH} {...props} />
}
