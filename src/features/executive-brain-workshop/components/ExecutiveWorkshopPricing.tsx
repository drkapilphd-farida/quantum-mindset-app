'use client'

import { Check } from 'lucide-react'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildWhatsAppLink } from '../utmTracking'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'
import { ExecutiveWorkshopCountdown } from './ExecutiveWorkshopCountdown'

export function ExecutiveWorkshopPricing(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  function handlePlanClick(planName: string, hasRealLink: boolean): void {
    trackGaEvent('razorpay_checkout_click', { location: 'pricing', plan: planName })
    trackMetaPixelEvent('InitiateCheckout', { content_name: planName })
    if (!hasRealLink) trackGaEvent('whatsapp_click', { location: `pricing_${planName}` })
  }

  return (
    <section id="pricing" className="border-b border-slate-200 bg-white px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal">Reserve Your Seat</p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Pricing</h2>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[13.5px] font-medium text-slate-600">{config.seatsRemaining} of {config.totalSeats} seats remaining</p>
            {config.earlyBirdDeadlineISO !== '' && <ExecutiveWorkshopCountdown deadlineIso={config.earlyBirdDeadlineISO} />}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {config.pricingPlans.map((plan) => {
            const hasRealLink = plan.paymentLink !== ''
            const href = hasRealLink
              ? plan.paymentLink
              : buildWhatsAppLink(config.whatsappNumber, `Hi, I want to reserve a seat in the ${plan.name} plan for the Executive Brain Performance Workshop`)

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
                  ₹{plan.price.toLocaleString('en-IN')}
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
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePlanClick(plan.name, hasRealLink)}
                  className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14.5px] font-semibold transition-transform hover:-translate-y-0.5 ${
                    plan.highlighted ? 'bg-teal text-white' : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {hasRealLink ? `Reserve — ${plan.name}` : `Ask on WhatsApp — ${plan.name}`}
                </a>
              </div>
            )
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] text-slate-500">{config.refundPolicyText}</p>
      </div>
    </section>
  )
}
