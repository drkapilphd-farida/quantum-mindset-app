'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'

// Phones: a sticky "Book on WhatsApp — ₹4,999" bar. Wider screens: a round
// floating WhatsApp button, bottom-right. Both appear once the hero
// (#tw-hero) has scrolled out of view.
export function StickyWhatsApp({ lang }: { lang: Lang }): React.JSX.Element {
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('tw-hero')
    if (!hero) return undefined
    const io = new IntersectionObserver(([entry]) => setPastHero(entry !== undefined && !entry.isIntersecting && entry.boundingClientRect.top < 0))
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  const hidden = pastHero ? '' : 'pointer-events-none translate-y-[130%] opacity-0'

  return (
    <>
      <div
        inert={!pastHero}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-void/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-all duration-500 sm:hidden ${hidden}`}
      >
        <WhatsAppLink topic="general" location="mobile_sticky_bar" className="tw-btn-wa flex min-h-13 w-full items-center justify-center gap-2.5 rounded-full px-4 py-3.5 text-[17px] font-bold">
          <WhatsAppGlyph className="size-6 flex-none" />
          {pick(telepathyCopy.stickyBar, lang)}
        </WhatsAppLink>
      </div>

      <div inert={!pastHero} className={`fixed bottom-6 right-6 z-40 hidden transition-all duration-500 sm:block ${hidden}`}>
        <WhatsAppLink
          topic="general"
          location="desktop_floating"
          ariaLabel={pick(telepathyCopy.floatingButtonLabel, lang)}
          className="tw-btn-wa group relative flex size-16 items-center justify-center rounded-full shadow-[0_0_0_6px_rgba(37,211,102,0.15),0_12px_40px_-8px_rgba(37,211,102,0.7)]"
        >
          <WhatsAppGlyph className="size-8" />
          <span className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-full bg-void/95 px-4 py-2 text-[14px] font-semibold text-ink opacity-0 shadow-lg ring-1 ring-line transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {pick(telepathyCopy.floatingButtonLabel, lang)}
          </span>
        </WhatsAppLink>
      </div>
    </>
  )
}
