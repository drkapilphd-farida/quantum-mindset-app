'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { GOLD_BUTTON, WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'

// Phones: a sticky "Book on WhatsApp — ₹5,999" bar. Wider screens: a round
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
  const label = pick(telepathyCopy.bookButton, lang)

  return (
    <>
      <div
        inert={!pastHero}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-void/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-all duration-500 sm:hidden ${hidden}`}
      >
        <WhatsAppLink topic="general" location="mobile_sticky_bar" className={`${GOLD_BUTTON} w-full text-[17px]`}>
          <WhatsAppGlyph className="size-6 flex-none" />
          {label}
        </WhatsAppLink>
      </div>

      <div inert={!pastHero} className={`fixed bottom-6 right-6 z-40 hidden transition-all duration-500 sm:block ${hidden}`}>
        <WhatsAppLink
          topic="general"
          location="desktop_floating"
          ariaLabel={label}
          className="group relative flex size-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_6px_rgba(37,211,102,0.15),0_12px_40px_-8px_rgba(37,211,102,0.7)] transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppGlyph className="size-8" />
          <span className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-sm bg-ink px-4 py-2 text-[14px] font-semibold text-void opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {label}
          </span>
        </WhatsAppLink>
      </div>
    </>
  )
}
