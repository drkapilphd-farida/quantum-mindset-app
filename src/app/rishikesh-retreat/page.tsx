import type { Metadata } from 'next'
import { RISHIKESH_COPY, RISHIKESH_PATH } from '@/features/events/copy'
import { EventRoute, eventMetadata, type EventRouteProps } from '@/features/events/route'

export async function generateMetadata(props: EventRouteProps): Promise<Metadata> {
  return eventMetadata(RISHIKESH_COPY, RISHIKESH_PATH, props)
}

export default async function Page(props: EventRouteProps): Promise<React.JSX.Element> {
  return <EventRoute copy={RISHIKESH_COPY} path={RISHIKESH_PATH} {...props} />
}
