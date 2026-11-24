import type { Metadata } from 'next'
import { DailyRsvpExperience } from '@/features/daily-rsvp/components/DailyRsvpExperience'

export const metadata: Metadata = {
  title: 'Daily Speed Read — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

// Daily Speed Read on its own page. Inside the 30-day plan it runs as a step
// of every day (DayMasterPlayer), which is where each day's result is saved.
export default function DailyRsvpPage(): React.JSX.Element {
  return <DailyRsvpExperience />
}
