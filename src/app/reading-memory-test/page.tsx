import type { Metadata } from 'next'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import Footer from '@/components/Footer'
import dynamic from 'next/dynamic'
import BrainUnlock, { type BuContent } from '@/features/brain-unlock/components/BrainUnlock'
import { passagesFor, toPublic } from '@/features/brain-unlock/passages'
import { getBrainUnlockSettings } from '@/features/brain-unlock/settingsServer'
import { langFromCampaign, ROLES } from '@/features/brain-unlock/types'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { buildPageMetadata } from '@/lib/seo/metadata'

// The classic test (?v=classic, kept two weeks) is its own chunk: Brain Unlock visitors never download it.
const ReadingMemoryTest = dynamic(() => import('@/features/reading-memory-test/components/ReadingMemoryTest'))

export const metadata: Metadata = buildPageMetadata({
  path: '/reading-memory-test',
  title: 'Brain Unlock — 3 Superpowers in 4 Minutes | Mind Ur Mind',
  description:
    'Free, 4 minutes, no sign-up: unlock your reading speed, memory and focus and see your own Before → After on screen. Get your Brain Type. English or Hindi.',
})

// Brain Unlock (founder spec, 13 Nov 2026) replaced the Free Reading & Memory
// Test at the same URL, because the ads point here. The old test stays at
// ?v=classic for two weeks. ?view=offer opens the plans directly (links in
// the WhatsApp report). Old links (/test, /programs/sharp-brain/speed-test)
// forward here with their utm_* tags.

type Search = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined): string | undefined => (Array.isArray(v) ? v[0] : v)

export default async function ReadingMemoryTestPage({ searchParams }: { searchParams: Promise<Search> }): Promise<React.JSX.Element> {
  const sp = await searchParams
  const classic = one(sp.v) === 'classic'
  let body: React.JSX.Element
  if (classic) {
    body = <ReadingMemoryTest />
  } else {
    const settings = await getBrainUnlockSettings()
    // Every passage a session may get, without the answer keys (the server checks answers).
    const pub = (role: (typeof ROLES)[number], lang: 'en' | 'hi'): BuContent[(typeof ROLES)[number]]['en'] => ({ check: passagesFor(role, lang, 'check').map(toPublic), sharp: passagesFor(role, lang, 'sharp').map(toPublic) })
    const content = Object.fromEntries(ROLES.map((role) => [role, { en: pub(role, 'en'), hi: pub(role, 'hi') }])) as BuContent
    // The +30-day retake link carries the earlier lead's id: the new session gets new sets.
    const retake = one(sp.retake)
    const retakeOf = retake !== undefined && /^[0-9a-f-]{36}$/i.test(retake) ? retake : null
    const langParam = one(sp.lang)
    const initialLang = langParam === 'hi' || langParam === 'en' ? langParam : (langFromCampaign(one(sp.utm_campaign)) ?? 'en')
    const plan = one(sp.plan)
    body = (
      <BrainUnlock
        content={content}
        settings={settings}
        pricing={pricingSnapshot(Date.now())}
        initialLang={initialLang}
        initialView={one(sp.view) === 'offer' ? 'offer' : 'flow'}
        initialPlan={plan === 'self' || plan === 'live' ? plan : null}
        retakeOf={retakeOf}
      />
    )
  }
  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SharpBrainNav />
      <main>{body}</main>
      <Footer />
    </div>
  )
}
