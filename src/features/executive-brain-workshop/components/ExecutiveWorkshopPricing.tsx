'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { executiveBrainWorkshopConfig, hasExecutiveWorkshopEventPassed } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink } from '../utmTracking'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'
import { ExecutiveWorkshopCountdown } from './ExecutiveWorkshopCountdown'

// Registrations Closed™ — once the event's own end time has passed,
// this replaces the whole pricing grid with a closed message and a
// WhatsApp "Notify me" button, never a payment button for an event
// that's already happened. Checked via state + an effect (not just
// read once) so a page left open across the event's end time updates
// on its own, same posture as ExecutiveWorkshopCountdown.
function RegistrationsClosedNotice(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
      <p className="text-[20px] font-bold text-slate-900">Registrations closed — next batch coming soon</p>
      <p className="mt-2 text-[14.5px] text-slate-600">
        This batch of the Executive Brain Performance Workshop has concluded. Tell us you&apos;re interested and we&apos;ll message you as soon as
        the next date is confirmed.
      </p>
      <a
        href={buildWhatsAppLink(config.whatsappNumber, 'Hi, please notify me when the next Executive Brain Performance Workshop batch is announced')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackGaEvent('whatsapp_click', { location: 'pricing_closed_notify_me' })}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-teal px-7 py-3.5 text-[14.5px] font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        Notify Me on WhatsApp
      </a>
    </div>
  )
}

export function ExecutiveWorkshopPricing(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig
  const [registrationsClosed, setRegistrationsClosed] = useState(() => hasExecutiveWorkshopEventPassed())

  useEffect(() => {
    const interval = setInterval(() => setRegistrationsClosed(hasExecutiveWorkshopEventPassed()), 60_000)
    return () => clearInterval(interval)
  }, [])

  function handlePlanClick(planName: string): void {
    trackGaEvent('razorpay_checkout_click', { location: 'pricing', plan: planName })
    trackMetaPixelEvent('InitiateCheckout', { content_name: planName })
  }

  function handleConfirmWhatsAppClick(planName: string): void {
    trackGaEvent('whatsapp_click', { location: `pricing_confirm_${planName}` })
  }

  return (
    <section id="pricing" className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal">Reserve Your Seat</p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Pricing</h2>
          </div>
          {!registrationsClosed && (
            <div className="text-left sm:text-right">
              <p className="text-[13.5px] font-medium text-slate-600">
                {config.seatsRemaining} of {config.totalSeats} seats remaining
              </p>
              {config.earlyBirdDeadlineISO !== '' && <ExecutiveWorkshopCountdown deadlineIso={config.earlyBirdDeadlineISO} />}
            </div>
          )}
        </div>

        {registrationsClosed ? (
          <div className="mt-10">
            <RegistrationsClosedNotice />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {config.pricingPlans.map((plan) => {
                const priceLabel = `₹${plan.price.toLocaleString('en-IN')}`
                const confirmWhatsAppHref = buildWhatsAppLink(
                  config.whatsappNumber,
                  `Hi, I just paid for the ${plan.name} plan (${priceLabel}) for the Executive Brain Performance Workshop — sharing my payment screenshot to confirm my seat.`,
                )

                return (
                  <div
                    key={plan.id}
                    className={`flex flex-col rounded-3xl border p-7 ${
                      plan.highlighted ? 'border-teal bg-teal-soft shadow-[0_20px_50px_rgba(23,138,122,0.12)]' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {plan.highlighted && (
                      <span className="mb-3 inline-flex w-fit items-center rounded-full bg-teal px-3 py-1 text-[11px] font-semibold text-white uppercase tracking-wide">
                        Most Popular
                      </span>
                    )}
                    <p className="text-[15.5px] font-bold text-slate-900">{plan.name}</p>
                    <p className="mt-3 text-[34px] font-bold tabular-nums text-slate-900">
                      {priceLabel}
                      {config.gstApplicable && <span className="ml-1.5 text-[13px] font-medium text-slate-400">+ GST as applicable</span>}
                    </p>
                    {plan.availabilityNote !== '' && <p className="mt-1 text-[12.5px] font-medium text-teal">{plan.availabilityNote}</p>}

                    <ul className="mt-5 flex-1 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-slate-600">
                          <Check className="mt-0.5 size-4 flex-none text-teal" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePlanClick(plan.name)}
                      className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14.5px] font-semibold transition-transform hover:-translate-y-0.5 ${
                        plan.highlighted ? 'bg-teal text-white' : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      Reserve — {plan.name}
                    </a>

                    {/* Payer-Entered-Amount Note™ — the Razorpay Payment
                        Link lets the payer type the amount themselves
                        rather than the page fixing it, so this note (and
                        the WhatsApp confirmation below) is the real
                        seat-confirmation step, not decorative copy. */}
                    <p className="mt-3 text-[12px] leading-relaxed text-slate-500">
                      Pay {priceLabel} on the next screen, then send the payment screenshot on WhatsApp to confirm your seat.
                    </p>
                    <a
                      href={confirmWhatsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleConfirmWhatsAppClick(plan.name)}
                      className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-teal underline underline-offset-2"
                    >
                      Confirm on WhatsApp →
                    </a>
                  </div>
                )
              })}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] text-slate-500">{config.refundPolicyText}</p>
          </>
        )}
      </div>
    </section>
  )
}
