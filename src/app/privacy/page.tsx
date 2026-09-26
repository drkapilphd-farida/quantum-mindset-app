import type { Metadata } from 'next'
import { LegalPageShell, legalStyles } from '@/features/legal/components/LegalPageShell'
import { buildPageMetadata } from '@/lib/seo/metadata'

// Replaces stale legacy content (see the "Pre-Launch Audit Fix Pass"
// task, Phase 3) — this page previously described a different business
// entirely ("Quantum Mind Learning Lab™," a school/franchise-partner LMS
// subscription platform) with off-domain contact emails
// (@mindurmindlab.com). Content below is the reviewed version of the
// draft that lived at /legal-drafts/privacy-policy (now retired — this
// is the one real, live page). Real business name, real on-domain
// contact (info@mindurmind.org.in), and content actually describing what
// this site does (Quantum Speed Reading, retreats, mentoring, the
// Quantum Mind app, Razorpay payments).
//
// Flagged, not glossed over: this was written and reviewed for internal
// consistency with the rest of the site, but has NOT had a lawyer's
// review — the source draft's own comment specifically called out the
// DPDP Act 2023/DPDP Rules 2025 (India's data protection law, phasing in
// through May 2027) as relevant given the sensitive context collected in
// mentoring applications and Razorpay payment data. Recommend a real
// legal review soon after launch, not as a launch blocker on its own —
// this is a genuine, substantively complete policy, just not yet
// attorney-reviewed.
export const metadata: Metadata = buildPageMetadata({
  path: '/privacy',
  title: 'Privacy Policy — Mind Ur Mind',
  description: 'How Mind Ur Mind collects, uses, and protects your personal data across our courses, retreats, mentoring, and the Quantum Mind app.',
})

const LAST_UPDATED = 'September 2026'

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated={LAST_UPDATED} brandName="Mind Ur Mind">
      <p className="text-muted-foreground leading-relaxed">
        Mind Ur Mind (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates mindurmind.org.in and the
        Quantum Mind app, offering Quantum Speed Reading, meditation and inner-mastery retreats, 1-on-1 mentoring,
        and related cognitive-training programs. This policy explains what personal data we collect, why, and how
        it&rsquo;s handled.
      </p>

      <section>
        <h2 className={legalStyles.h2}>Information we collect</h2>
        <ul className={legalStyles.list}>
          <li>Contact details you provide (name, email, phone, city) via forms, WhatsApp, or enrollment.</li>
          <li>
            Payment information processed by Razorpay — we do not store your card, UPI, or bank details ourselves.
          </li>
          <li>
            Information you choose to share in mentoring or program applications, including context about what
            you&rsquo;re seeking help with.
          </li>
          <li>
            Usage data from the Quantum Mind app — reading speed (WPM), comprehension scores, and daily practice
            activity across the 30-Day Quantum Speed Reading Masterclass Curriculum and other exercises.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>How we use it</h2>
        <ul className={legalStyles.list}>
          <li>To respond to inquiries and process enrollments and payments.</li>
          <li>To personalize coaching, mentoring, and program recommendations.</li>
          <li>To operate the Quantum Mind app&rsquo;s progress-tracking and curriculum-unlock features.</li>
          <li>To send program-related communication, including WhatsApp messages you&rsquo;ve opted into.</li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Third parties we share data with</h2>
        <ul className={legalStyles.list}>
          <li>Razorpay (payment processing for our own programs).</li>
          <li>Classplus (delivery of specific self-paced courses, where applicable).</li>
          <li>Supabase (our database and authentication infrastructure).</li>
        </ul>
        <p className={legalStyles.p}>We do not sell your personal data to third parties.</p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Sensitive information</h2>
        <p className={legalStyles.p}>
          Where you voluntarily share information about your mental health, stress, or personal circumstances — for
          example, in a 1-on-1 mentoring application — this is used solely to prepare for your session and is not
          shared beyond the coaching team without your consent.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Data retention</h2>
        <p className={legalStyles.p}>
          We retain your personal data for as long as your account is active or as needed to provide the program
          you&rsquo;ve enrolled in, and for a reasonable period afterward to meet our legal, accounting, and
          dispute-resolution obligations (including the records our Refund &amp; Cancellation Policy requires). After
          that, we delete or anonymize it. You can request earlier deletion — see &ldquo;Your rights&rdquo; below.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Your rights</h2>
        <p className={legalStyles.p}>
          You may request access to, correction of, or deletion of your personal data by emailing{' '}
          <a href="mailto:info@mindurmind.org.in" className="text-foreground underline underline-offset-2">
            info@mindurmind.org.in
          </a>
          . We respond to all requests within 30 days.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Security</h2>
        <p className={legalStyles.p}>
          We use encrypted connections (HTTPS) throughout the site and app, restrict access to personal data on a
          need-to-know basis, and store data with Supabase and process payments with Razorpay — both maintain their
          own industry-standard security certifications and practices. No online service can guarantee absolute
          security, but we take reasonable, real measures to protect your information.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Contact</h2>
        <p className={legalStyles.p}>
          Questions about this policy:{' '}
          <a href="mailto:info@mindurmind.org.in" className="text-foreground underline underline-offset-2">
            info@mindurmind.org.in
          </a>{' '}
          or WhatsApp{' '}
          <a
            href="https://wa.me/919540123161"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-2"
          >
            +91 95401 23161
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
