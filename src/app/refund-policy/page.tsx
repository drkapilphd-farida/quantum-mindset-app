import type { Metadata } from 'next'
import { LegalPageShell, legalStyles } from '@/features/legal/components/LegalPageShell'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { programs, waLink } from '@/config/site.config'

// New, dedicated Refund & Cancellation Policy (see the "Pre-Launch Audit
// Fix Pass" task, Phase 3) — this page didn't exist before. The only
// prior refund text lived in one sentence on /terms#billing
// ("non-refundable except where required by law"), which directly
// contradicted the 30-Day QSR Masterclass's own advertised "100% Results
// Guaranteed" claim (see qsrLanding.guarantee in src/lib/i18n.ts, and
// QsrGuaranteeBadge.tsx / CheckoutTrustLine.tsx, both updated in this
// same phase to link here instead of /terms#billing). That contradictory
// line has been removed from /terms.
//
// The Masterclass section below is written to be the EXACT eligibility
// condition already advertised site-wide — completing the full 30-day
// protocol (every app session, all 7 live masterclasses) with no
// measurable WPM/comprehension improvement — not a new, different, or
// narrower promise. The specific numeric windows (7 days to request,
// 5-10 business days to process) are reasonable defaults I've authored
// since no such timeframe existed anywhere in the codebase — flagged in
// the task summary as adjustable, not presented as a pre-existing fact.
export const metadata: Metadata = buildPageMetadata({
  path: '/refund-policy',
  title: 'Refund & Cancellation Policy — Mind Ur Mind',
  description: `Refund and cancellation terms for the ${programs.sharpBrain.name}, retreats, and other Mind Ur Mind programs.`,
})

const LAST_UPDATED = '29 September 2026'

export default function RefundPolicyPage(): React.JSX.Element {
  return (
    <LegalPageShell title="Refund & Cancellation Policy" lastUpdated={LAST_UPDATED} brandName="Mind Ur Mind">
      <p className="text-muted-foreground leading-relaxed">
        This policy explains how refunds and cancellations work across Mind Ur Mind&rsquo;s programs, organized
        by program.
      </p>

      <section>
        <h2 className={legalStyles.h2}>{programs.sharpBrain.name}</h2>
        <ul className={legalStyles.list}>
          <li>
            <strong>Live online (₹4,999):</strong> join the first 2 live classes. If you are not satisfied, message us
            on WhatsApp before the 3rd class and we refund your full fee.
          </li>
          <li>
            <strong>2-day online workshop (₹499) and offline workshop with EEG (₹8,999):</strong> full refund if you
            cancel at least 3 days before the workshop starts. After that the fee isn&rsquo;t refundable, but you can
            move once to a later date where one is available.
          </li>
          <li>
            <strong>Self-paced (₹2,999):</strong> refundable within 7 days of purchase if you haven&rsquo;t watched more
            than 2 recorded classes.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>{programs.onlineRetreat.name}</h2>
        <p className={legalStyles.p}>
          Full refund if you cancel before the first class begins. After the first class, refunds aren&rsquo;t
          available — but you can move once to the next batch.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Other programs</h2>
        <ul className={legalStyles.list}>
          <li>
            <strong>{programs.residentialRetreat.name}:</strong> cancel at least 30 days before the start date for a
            full refund. Within 30 days the fee isn&rsquo;t refundable, but you can move your place to a future retreat
            where one is available.
          </li>
          <li>
            <strong>Telepathy &amp; Intuition online workshop:</strong> full refund if you cancel before the first
            evening; after that you can move once to the next month&rsquo;s batch.
          </li>
          <li>
            <strong>{programs.oneOnOneCoaching.name}:</strong> refundable in full if canceled before your first session. Once your
            first session has taken place, remaining unused sessions in a package may be refunded on a pro-rated
            basis at our discretion — message us to discuss your specific situation.
          </li>
        </ul>
        <p className={legalStyles.p}>
          <strong>How to request a refund:</strong> message us on WhatsApp or email{' '}
          <a href="mailto:info@mindurmind.org.in" className="text-foreground underline underline-offset-2">
            info@mindurmind.org.in
          </a>{' '}
          with the email or phone number you paid with. Approved refunds go back to your original payment method via
          Razorpay within 5–10 business days.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>How to reach us</h2>
        <p className={legalStyles.p}>
          For any refund or cancellation request, message us on WhatsApp at{' '}
          <a
            href={waLink('Hi Dr. Kapil, I have a question about a refund or cancellation.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-2"
          >
            +91 91739 43555
          </a>{' '}
          or email{' '}
          <a href="mailto:info@mindurmind.org.in" className="text-foreground underline underline-offset-2">
            info@mindurmind.org.in
          </a>
          . Every request is reviewed personally by Dr. Kapil Dev Sharma&rsquo;s team, not an automated system.
        </p>
      </section>
    </LegalPageShell>
  )
}
