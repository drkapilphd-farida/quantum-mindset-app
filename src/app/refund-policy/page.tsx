import type { Metadata } from 'next'
import { LegalPageShell, legalStyles } from '@/features/legal/components/LegalPageShell'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { programs } from '@/config/site.config'

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
  description: `Refund and cancellation terms for the ${programs.qsr.name}, ${programs.focusStarter.name}, retreats, and other Mind Ur Mind programs.`,
})

const LAST_UPDATED = 'September 2026'

export default function RefundPolicyPage(): React.JSX.Element {
  return (
    <LegalPageShell title="Refund & Cancellation Policy" lastUpdated={LAST_UPDATED} brandName="Mind Ur Mind">
      <p className="text-muted-foreground leading-relaxed">
        This policy explains how refunds and cancellations work across Mind Ur Mind&rsquo;s programs. It&rsquo;s
        organized by program, since our {programs.qsr.name} carries a specific results
        guarantee that our other programs don&rsquo;t.
      </p>

      <section>
        <h2 className={legalStyles.h2}>{programs.qsr.name} — 100% Results Guarantee</h2>
        <p className={legalStyles.p}>
          If you complete the full 30-day protocol as instructed — every daily app session, and all 7 live
          masterclass sessions with Dr. Kapil Dev Sharma — and your reading speed (WPM) and comprehension haven&rsquo;t
          measurably improved between your Day 1 baseline and your Day 30 checkpoint, we&rsquo;ll issue a full
          refund of your ₹9,999 enrollment fee.
        </p>
        <ul className={legalStyles.list}>
          <li>
            <strong>Eligibility:</strong> you must have completed all 30 days and all 7 live sessions. Partial
            completion, or stopping partway through, isn&rsquo;t covered by this guarantee — see &ldquo;Cancelling
            before finishing&rdquo; below for that case instead.
          </li>
          <li>
            <strong>What &ldquo;results&rdquo; means:</strong> your own WPM and comprehension scores, tracked
            automatically by the app at your Day 1 baseline and your Day 30 checkpoint. We use this real, recorded
            data to evaluate every guarantee claim — not a subjective judgment call.
          </li>
          <li>
            <strong>How to request it:</strong> message us on WhatsApp or email{' '}
            <a href="mailto:info@mindurmind.org.in" className="text-foreground underline underline-offset-2">
              info@mindurmind.org.in
            </a>{' '}
            within 7 days of completing Day 30, referencing the email or phone number you enrolled with. We&rsquo;ll
            verify your checkpoint data and confirm the outcome within 3 business days.
          </li>
          <li>
            <strong>Processing time:</strong> once approved, refunds are issued to your original payment method via
            Razorpay within 5-10 business days.
          </li>
        </ul>
        <p className={legalStyles.p}>
          <strong>Cancelling before finishing:</strong> if you stop before completing all 30 days and 7 sessions, the
          results guarantee above doesn&rsquo;t apply. Message us — we handle these on a case-by-case basis and may
          offer a partial refund or credit toward a future batch, depending on how much of the program you&rsquo;ve
          used.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Other programs (Retreats, 1-on-1 Coaching, Focus & Reading Starter, Courses)</h2>
        <p className={legalStyles.p}>
          These programs don&rsquo;t carry the 30-Day Live Program&rsquo;s results guarantee, since they&rsquo;re not
          structured around a measurable WPM/comprehension checkpoint the way Quantum Speed Reading is.
        </p>
        <ul className={legalStyles.list}>
          <li>
            <strong>Retreats (online and residential):</strong> cancel at least 7 days before the retreat&rsquo;s
            start date for a full refund. Cancellations within 7 days of the start date aren&rsquo;t refundable, but
            we&rsquo;ll offer to move your seat to a future batch where one is available.
          </li>
          <li>
            <strong>{programs.oneOnOneCoaching.name}:</strong> refundable in full if canceled before your first session. Once your
            first session has taken place, remaining unused sessions in a package may be refunded on a pro-rated
            basis at our discretion — message us to discuss your specific situation.
          </li>
          <li>
            <strong>{programs.focusStarter.name}:</strong> Days 1-7 are free — nothing is charged, so there&rsquo;s
            nothing to refund. The ₹99 one-time payment to continue past Day 7 is non-refundable once paid, since it
            unlocks the remaining content immediately.
          </li>
          <li>
            <strong>Self-paced courses (e.g. the {programs.overthinkingReset.name}):</strong> refundable within 7 days of
            purchase if you haven&rsquo;t completed more than 20% of the course content.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>How to reach us</h2>
        <p className={legalStyles.p}>
          For any refund or cancellation request, message us on WhatsApp at{' '}
          <a
            href="https://wa.me/919540123161"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-2"
          >
            +91 95401 23161
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
