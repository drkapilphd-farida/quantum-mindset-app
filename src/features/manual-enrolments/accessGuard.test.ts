import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Founder rule (4 Nov 2026): the moment "Give full access" is pressed, the
// learner has full access on every page — no payment screen, no batch wait.
// That holds only while every paid page asks the ONE shared check
// (getIsPaidUser, via the helpers in src/lib/subscription) and nothing a
// learner sees waits for a batch date. These scans fail if either drifts.

const SHARED_CHECK = /getIsPaidUser|hasQuantumSpeedReadingProAccess|hasHabitBuilderAccess|checkAppAccess/

function files(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) files(path, out)
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(path)
  }
  return out
}

const read = (path: string): string => readFileSync(path, 'utf8')

describe('manual "Give full access" works on every page', () => {
  it('the pages the founder named all use the shared access check', () => {
    const named = [
      'src/app/(dashboard)/dashboard/QsrDashboard.tsx',
      'src/app/(dashboard)/labs/sharp-brain/journey/[day]/page.tsx',
      'src/app/(dashboard)/labs/sharp-brain/thirty-day-curriculum/page.tsx',
      'src/app/(dashboard)/memory-studio/page.tsx',
      'src/features/live-classes/actions.ts',
      'src/features/live-classes/components/NextClassCard.tsx',
      'src/features/masterclass-app/actions/checkAppAccess.ts',
    ]
    for (const path of named) expect(SHARED_CHECK.test(read(path)), path).toBe(true)
  })

  it('every page that shows a paywall decides it with the shared check', () => {
    const pages = files('src/app').filter((p) => /[/\\](page|route)\.tsx?$/.test(p) && !p.includes('(admin)'))
    const gated = pages.filter((p) => /<ProLockedScreen|\bisPro\b|PROGRAM_OFFER_HREF/.test(read(p)))
    expect(gated.length).toBeGreaterThan(10)
    const offenders = gated.filter((p) => !SHARED_CHECK.test(read(p)))
    expect(offenders).toEqual([])
  })

  it('nothing a learner sees waits for a batch start date', () => {
    const learnerFacing = [...files('src/app'), ...files('src/features'), ...files('src/components'), ...files('src/lib')].filter(
      (p) => !/\(admin\)|[/\\]api[/\\]razorpay|sharp-brain-enrol|manual-enrolments|live-classes[/\\]admin|supabase[/\\]types/.test(p),
    )
    const offenders = learnerFacing.filter((p) => /batch_start|batchStart/.test(read(p)))
    expect(offenders).toEqual([])
  })

  it('an active lifetime program subscription counts as paid, whatever its dates', () => {
    const source = read('src/lib/subscription/getIsPaidUser.ts')
    expect(source).toMatch(/if \(interval !== 'month'\) return true/)
    expect(source).toMatch(/\.in\('status', \['active', 'trialing'\]\)/)
  })
})
