import { Ticket } from 'lucide-react'
import type { Lang } from '@/lib/i18n'
import { telepathyWhatsAppMessage } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { BookSeatLink, GOLD_BUTTON, WhatsAppGlyph, WhatsAppLink, type TelepathyBatchTag } from './WhatsAppLink'

const c = telepathyCopy.booking

/**
 * The main "Book your seat — ₹1,000" button (Razorpay) with the balance /
 * non-refundable note under it. Used in the hero, every batch card and the
 * final call to action.
 */
export function BookSeatCta({
  lang,
  batch,
  location,
  className = '',
  buttonClassName = '',
  noteClassName = '',
}: {
  lang: Lang
  batch: TelepathyBatchTag
  location: string
  className?: string
  buttonClassName?: string
  noteClassName?: string
}): React.JSX.Element {
  return (
    <div className={className}>
      <BookSeatLink batch={batch} location={location} className={`${GOLD_BUTTON} ${buttonClassName}`}>
        <Ticket className="size-5 flex-none" aria-hidden="true" />
        {pick(telepathyCopy.bookButton, lang)}
      </BookSeatLink>
      <p className={`mt-2.5 text-[13.5px] leading-snug text-ink-dim ${noteClassName}`}>{pick(c.note, lang)}</p>
    </div>
  )
}

/** "Questions? Chat on WhatsApp" — a quiet text link, pre-filled with the workshop (and batch). */
export function QuestionsLink({ lang, batch, location, className = '' }: { lang: Lang; batch: TelepathyBatchTag; location: string; className?: string }): React.JSX.Element {
  return (
    <WhatsAppLink
      message={telepathyWhatsAppMessage('question', batch === 'general' ? null : batch)}
      kind="question"
      batch={batch}
      location={location}
      className={`inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-gold ${className}`}
    >
      <WhatsAppGlyph className="size-5 flex-none text-[#1f9d55]" />
      {pick(c.questions, lang)}
    </WhatsAppLink>
  )
}
