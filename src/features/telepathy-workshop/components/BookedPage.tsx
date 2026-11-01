'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, MapPin, Utensils, Wallet } from 'lucide-react'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { telepathyBookedMessage, type TelepathyBatchId } from '@/config/telepathyWorkshopConfig'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { readUtmParams } from '@/lib/analytics/utm'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { langFromParam, pick } from '../telepathyWorkshop'
import { useVisibleBatches } from './BookingSections'
import { GOLD_BUTTON, WhatsAppGlyph, WhatsAppLink } from './WhatsAppLink'

const c = telepathyCopy.booked
const b = telepathyCopy.batches

/** Razorpay adds razorpay_payment_id to the redirect; anything that doesn't look like one is ignored. */
const PAYMENT_ID = /^pay_[A-Za-z0-9]{8,30}$/

// /telepathy-workshop/booked — after the ₹1,000 Razorpay payment. Follows
// the site's EN/हिंदी choice (?lang=hi|en switches it). The visitor picks
// their batch (and may type their name), then sends the booking on WhatsApp.
export function BookedPage({ renderedAt }: { renderedAt: number }): React.JSX.Element {
  const { lang, setLang } = useLanguage()
  const batches = useVisibleBatches(renderedAt)
  const [batchId, setBatchId] = useState<TelepathyBatchId | null>(null)
  const [name, setName] = useState('')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const nameId = useId()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLang = langFromParam(params.get('lang'))
    if (urlLang !== null) setLang(urlLang)
    const pid = params.get('razorpay_payment_id')
    if (pid !== null && PAYMENT_ID.test(pid)) setPaymentId(pid)
    trackGaEvent('telepathy_booked_visit', {
      payment_status: params.get('razorpay_payment_link_status') ?? '(none)',
      utm_source: readUtmParams().utm_source ?? '(none)',
    })
  }, [setLang])

  const chosen = batches.find((x) => x.id === batchId)
  const card = b.cities.find((x) => x.id === batchId)

  return (
    <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
      <SiteNav />
      <main className="bg-void px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="tw-h2 text-center text-ink">{pick(c.heading, lang)}</h1>
          <p className="tw-body mt-4 text-center">{pick(c.body, lang)}</p>

          <fieldset className="mt-10">
            <legend className="text-[17px] font-bold text-ink">{pick(c.chooseBatch, lang)}</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {batches.map((batch) => {
                const city = b.cities.find((x) => x.id === batch.id)
                if (city === undefined) return null
                const selected = batch.id === batchId
                return (
                  <label
                    key={batch.id}
                    className={`tw-card flex min-h-[64px] cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${selected ? '!border-gold bg-gold-soft' : 'hover:!border-gold/60'}`}
                  >
                    <input type="radio" name="batch" value={batch.id} checked={selected} onChange={() => setBatchId(batch.id)} className="size-5 flex-none accent-[#b8862e]" />
                    <span>
                      <span className="block text-[16.5px] font-bold text-ink">{pick(city.city, lang)}</span>
                      <span className="block text-[14px] text-ink-dim">{pick(city.dates, lang)}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {chosen !== undefined && card !== undefined && (
            <dl className="tw-card mt-6 grid gap-3 px-5 py-5 text-[16px]" aria-live="polite">
              <Detail icon={<CalendarDays className="size-5" aria-hidden="true" />} label={pick(b.datesLabel, lang)}>
                <span className="font-semibold text-ink">
                  {pick(card.city, lang)} · {pick(card.dates, lang)}
                </span>
              </Detail>
              <Detail icon={<MapPin className="size-5" aria-hidden="true" />} label={pick(b.venueLabel, lang)}>
                {pick(card.venue, lang)}
              </Detail>
              <Detail icon={<Clock className="size-5" aria-hidden="true" />}>{pick(b.infoTime, lang)}</Detail>
              <Detail icon={<Utensils className="size-5" aria-hidden="true" />}>{pick(b.infoMeals, lang)}</Detail>
              <Detail icon={<Wallet className="size-5" aria-hidden="true" />}>
                <span className="font-semibold text-ink">{pick(c.balance, lang)}</span>
              </Detail>
            </dl>
          )}

          <label htmlFor={nameId} className="mt-8 block text-[16px] font-semibold text-ink">
            {pick(c.nameLabel, lang)}
          </label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 block min-h-[48px] w-full rounded-sm border border-line-strong bg-panel px-4 text-[16px] text-ink focus:border-gold focus:outline-none"
          />

          <div className="mt-8">
            {batchId === null ? (
              <>
                <span aria-disabled="true" className={`${GOLD_BUTTON} w-full cursor-not-allowed opacity-50`}>
                  <WhatsAppGlyph className="size-6 flex-none" />
                  {pick(c.sendButton, lang)}
                </span>
                <p className="mt-2.5 text-center text-[14px] text-ink-dim">{pick(c.chooseFirst, lang)}</p>
              </>
            ) : (
              <WhatsAppLink message={telepathyBookedMessage(name, batchId, paymentId)} kind="booked" batch={batchId} location="booked_page" className={`${GOLD_BUTTON} w-full text-[17px]`}>
                <WhatsAppGlyph className="size-6 flex-none" />
                {pick(c.sendButton, lang)}
              </WhatsAppLink>
            )}
          </div>

          <p className="mt-10 text-center">
            <Link href="/telepathy-workshop" className="text-[15px] font-medium text-ink-dim underline underline-offset-4 hover:text-ink">
              {pick(c.back, lang)}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Detail({ icon, label, children }: { icon: React.ReactNode; label?: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex gap-3">
      <dt className="flex-none pt-0.5 text-gold">
        {icon}
        {label !== undefined && <span className="sr-only">{label}</span>}
      </dt>
      <dd className="leading-relaxed text-ink-dim">{children}</dd>
    </div>
  )
}
