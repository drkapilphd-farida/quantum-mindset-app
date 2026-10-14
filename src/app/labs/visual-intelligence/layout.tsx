import { redirect } from 'next/navigation'

// The old Visual Intelligence lab is retired (founder, 14 Oct 2026): every
// page under it, and any old link or bookmark, goes to the dashboard. Its
// code and learners' saved data stay untouched.
export default function RetiredVisualIntelligenceLayout(): never {
  redirect('/dashboard')
}
