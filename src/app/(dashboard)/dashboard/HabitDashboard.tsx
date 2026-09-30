import { createClient } from '@/lib/supabase/server'
import { hasHabitBuilderAccess } from '@/lib/subscription/hasHabitBuilderAccess'
import { getCurrentUserProfile } from '@/lib/supabase/getCurrentUserProfile'
import { GreetingHeading } from '@/components/dashboard/GreetingHeading'
import { TwentyOneDayJourneyCard } from '@/components/dashboard/TwentyOneDayJourneyCard'
import { isDevUnlockEnabled } from '@/lib/dev/isDevUnlockEnabled'
import { getDailyQuantumSessionHistory } from '@/app/unified-session-preview/actions/getDailyQuantumSessionHistory'
import { computeDailyQuantumStreak } from '@/app/unified-session-preview/components/dailyQuantumSessionTracking'
import { getNextJourneyDay } from '@/features/quantum-journey/streakMotivation'
import { hasStartedPracticeJourney } from '@/features/quantum-journey/queries/hasStartedPracticeJourney'
import { primaryCheckoutHref, programs } from '@/config/site.config'

const PROGRAM_PRICE = `₹${(programs.sharpBrain.prices[0]?.amountInr ?? 0).toLocaleString('en-IN')}`
const PROGRAM_CHECKOUT_HREF = primaryCheckoutHref('sharpBrain')

// Domain Split™ — habit.mindurmind.org.in's entire dashboard: the 21-Day
// Quantum Habit Builder journey and its own real streak tracker, nothing
// else. No Document Upload, no 30-Day Masterclass, no Parent Dashboard —
// those routes are actively unreachable from this domain at the
// middleware level (see src/middleware.ts's DOMAIN_ROUTES), not just
// omitted from this page.
export async function HabitDashboard(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return <div />

  const [profile, dailyQuantumSessionHistory, isPaidUser, hasStartedJourney] = await Promise.all([
    getCurrentUserProfile(user.id),
    getDailyQuantumSessionHistory(),
    hasHabitBuilderAccess(user.id, user.email ?? null),
    hasStartedPracticeJourney(user.id),
  ])

  // The next real 21-Day Journey day (1-21) — daily_quantum_sessions has
  // no persisted "day number" column, so this is simply one past however
  // many real sessions already exist, clamped to the journey's real
  // length (see getNextJourneyDay's own doc comment).
  const nextJourneyDay = getNextJourneyDay(dailyQuantumSessionHistory.length)
  // Streak Counter Mechanism™ — the exact same real computation
  // QuantumJourneySession's own briefing/completion screens already use,
  // reused here rather than a second, parallel streak that could drift.
  const journeyStreak = computeDailyQuantumStreak(dailyQuantumSessionHistory)

  const studentName = profile?.fullName ?? 'there'
  const studentFirstName = studentName.trim().split(' ').at(0) ?? 'there'

  return (
    <div className="glass-premium relative -m-6 space-y-4 p-6 sm:-m-8 sm:space-y-6 sm:p-8">
      {/* Dashboard Glass™ ambient background — see QsrDashboard.tsx's
          identical block for why this is fixed/-z-10/scoped per page. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="glass-ambient-blob" style={{ width: 520, height: 520, top: -140, left: -100, background: 'var(--ambient-a)' }} />
        <div className="glass-ambient-blob" style={{ width: 460, height: 460, top: 220, right: -140, background: 'var(--ambient-b)' }} />
        <div className="glass-ambient-blob" style={{ width: 380, height: 380, bottom: -160, left: '35%', background: 'var(--ambient-a)' }} />
      </div>

      <div className="glass-premium-card glass-premium-lift p-6 sm:p-8">
        <GreetingHeading studentName={studentFirstName} />
        {hasStartedJourney && (
          <p className="mt-1 text-sm text-muted-foreground">Day {nextJourneyDay} of your {programs.focusStarter.appName}.</p>
        )}
      </div>

      {hasStartedJourney ? (
        <TwentyOneDayJourneyCard isPaidUser={isPaidUser} isDevUnlocked={isDevUnlockEnabled()} currentDay={nextJourneyDay} currentStreak={journeyStreak} />
      ) : (
        // The Practice Journey is closed to new learners — offer the program.
        <div className="glass-premium-card glass-premium-lift p-6 sm:p-8">
          <h2 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">{programs.sharpBrain.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{programs.sharpBrain.outcome}</p>
          <p className="mt-2 text-sm text-foreground">{programs.sharpBrain.format}.</p>
          <a
            href={PROGRAM_CHECKOUT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-indigo-400"
          >
            Enrol now · {PROGRAM_PRICE}
          </a>
        </div>
      )}
    </div>
  )
}
