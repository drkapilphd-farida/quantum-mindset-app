'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { telepathyWhatsAppMessage } from '@/config/telepathyWorkshopConfig'
import { dayRange, startMonth } from '@/data/batches'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { v2 } from '../telepathyV2Copy'
import { pick } from '../telepathyWorkshop'
import { BookSeatLink, GOLD_BUTTON, WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'
import { nearestOfflineBatch } from './DateCards'

// Phones: a sticky bar with the nearest offline batch from
// src/data/batches.ts ("अगली बैच: मुंबई 14–15 नवंबर · ₹1,000 में सीट") and a
// "बुक" button (the ₹1,000 Razorpay link). Wider screens: a round floating
// WhatsApp button for questions, bottom-right. Both appear once the hero
// (#tw-hero) has scrolled out of view.
export function StickyBooking({ lang }: { lang: Lang }): React.JSX.Element {
  const [pastHero, setPastHero] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(new Date()), [])
  const nearest = now === null ? null : nearestOfflineBatch(now)
  const c = v2.dates

  useEffect(() => {
    const hero = document.getElementById('tw-hero')
    if (!hero) return undefined
    const io = new IntersectionObserver(([entry]) => setPastHero(entry !== undefined && !entry.isIntersecting && entry.boundingClientRect.top < 0))
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  const hidden = pastHero ? '' : 'pointer-events-none translate-y-[130%] opacity-0'
  const questions = pick(telepathyCopy.booking.questions, lang)

  return (
    <>
      {nearest !== null && (
        <div
          inert={!pastHero}
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-void/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-all duration-500 sm:hidden ${hidden}`}
        >
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-ink">
              {pick(c.sticky, lang, {
                city: nearest.id === 'mumbai' || nearest.id === 'ahmedabad' || nearest.id === 'vadodara' ? pick(c.cities[nearest.id], lang) : '',
                date: `${dayRange(nearest)} ${startMonth(nearest, lang)}`,
              })}
            </p>
            <BookSeatLink batch={nearest.id === 'mumbai' || nearest.id === 'ahmedabad' || nearest.id === 'vadodara' ? nearest.id : 'general'} location="mobile_sticky_bar" className={`${GOLD_BUTTON} flex-none !min-h-[44px] !px-5 !py-2`}>
              {pick(c.stickyButton, lang)}
            </BookSeatLink>
          </div>
        </div>
      )}

      <div inert={!pastHero} className={`fixed bottom-6 right-6 z-40 hidden transition-all duration-500 sm:block ${hidden}`}>
        <WhatsAppLink
          message={telepathyWhatsAppMessage('question', null)}
          kind="question"
          batch="general"
          location="desktop_floating"
          ariaLabel={questions}
          className="group relative flex size-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_6px_rgba(37,211,102,0.15),0_12px_40px_-8px_rgba(37,211,102,0.7)] transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppGlyph className="size-8" />
          <span className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-sm bg-ink px-4 py-2 text-[14px] font-semibold text-void opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {questions}
          </span>
        </WhatsAppLink>
      </div>
    </>
  )
}
