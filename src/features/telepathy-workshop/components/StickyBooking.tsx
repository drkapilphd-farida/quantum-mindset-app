'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { Ticket } from 'lucide-react'
import { telepathyWhatsAppMessage } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { BookSeatLink, GOLD_BUTTON, WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'

// Phones: a sticky "Book your seat — ₹1,000" bar (Razorpay) with the
// balance line. Wider screens: a round floating WhatsApp button for
// questions, bottom-right. Both appear once the hero (#tw-hero) has
// scrolled out of view.
export function StickyBooking({ lang }: { lang: Lang }): React.JSX.Element {
  const [pastHero, setPastHero] = useState(false)

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
      <div
        inert={!pastHero}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-void/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-all duration-500 sm:hidden ${hidden}`}
      >
        <BookSeatLink batch="general" location="mobile_sticky_bar" className={`${GOLD_BUTTON} w-full text-[17px]`}>
          <Ticket className="size-5 flex-none" aria-hidden="true" />
          {pick(telepathyCopy.bookButton, lang)}
        </BookSeatLink>
        <p className="mt-1.5 text-center text-[12.5px] text-ink-dim">{pick(telepathyCopy.booking.noteShort, lang)}</p>
      </div>

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
