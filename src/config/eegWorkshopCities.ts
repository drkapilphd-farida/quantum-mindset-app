// Offline QSR + EEG Cognitive Testing — per-city batch status (see the
// "Homepage, QSR & Multi-City EEG Rewrite" task). No CMS/feature-flag
// system exists anywhere in this codebase (confirmed by repo-wide grep),
// so this typed config file is the same pattern already used for
// WORKSHOP_CITIES elsewhere: editing a city's `status` here and
// redeploying is how its CTA state actually changes — there is no
// zero-deploy toggle. If a real no-deploy toggle is wanted later (e.g. a
// database-backed batches table), this file is the natural thing to
// replace; every component reading it (OfflineEegWorkshopSection) only
// needs its data source swapped, not its rendering logic.
//
// Lesson applied from the Mumbai pilot workshop (see
// QsrMumbaiWorkshopCard/qsr-mumbai/* — that page's own batch dates were
// never locked, which is exactly the situation this `status` field
// exists to represent honestly): a city stays 'waitlist' — "Join
// Waitlist — We'll Confirm Your City's Date" — until its batch date is
// actually confirmed, at which point (and only then) flip it to
// 'confirmed' for a real "Register Now" CTA. All 6 cities start on
// 'waitlist' since no dates are locked yet.
export type EegWorkshopCityStatus = 'waitlist' | 'confirmed'

export type EegWorkshopCity = {
  city: string
  status: EegWorkshopCityStatus
  // Set once a date is actually locked (used only when status is
  // 'confirmed' — a real date belongs in the UI, not a placeholder).
  confirmedDateLine?: string
}

export const EEG_WORKSHOP_CITIES: EegWorkshopCity[] = [
  { city: 'Mumbai', status: 'waitlist' },
  { city: 'Pune', status: 'waitlist' },
  { city: 'Vadodara', status: 'waitlist' },
  { city: 'Surat', status: 'waitlist' },
  { city: 'Ahmedabad', status: 'waitlist' },
  { city: 'Noida', status: 'waitlist' },
]
