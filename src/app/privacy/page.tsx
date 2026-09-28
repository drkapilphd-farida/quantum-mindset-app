import type { Metadata } from 'next'
import { LegalPageShell, legalStyles } from '@/features/legal/components/LegalPageShell'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { brand, programs, waLink } from '@/config/site.config'

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
  description: `How Mind Ur Mind collects, uses, and protects your personal data across our courses, retreats, mentoring, and the ${brand.appName}.`,
})

const LAST_UPDATED = 'September 2026'

export default function PrivacyPolicyPage(): React.JSX.Element {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated={LAST_UPDATED} brandName="Mind Ur Mind">
      <p className="text-muted-foreground leading-relaxed">
        Mind Ur Mind (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates mindurmind.org.in and the
        {brand.appName}, offering Sharp Brain, meditation and inner-mastery retreats, 1-on-1 mentoring,
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
            Usage data from the {brand.appName} — reading speed (WPM), comprehension scores, and daily practice
            activity across the {programs.sharpBrain.name} curriculum and other exercises.
          </li>
          <li>
            In the {brand.appName}, the role (parent, student or working professional) and main goal (focus, memory,
            exam preparation or reading) you choose when you first sign in — used only to put the most relevant
            practice first on your dashboard. You can change or skip these at any time in Settings.
          </li>
          <li>
            If you take the {programs.sharpBrain.name} Day 1 and Day 30 assessments: your reading time, answers to the
            comprehension questions and your attention-task responses, from which we calculate reading speed,
            comprehension, effective reading speed, attention accuracy and reaction time. These are practice results,
            not a medical or psychological test. A share card is only created if you ask for it, and it shows your first
            name and these numbers only.
          </li>
          <li>
            If you use Mobile Discipline: the daily screen-time goal you set, your answer to the daily check-in, and the
            focus-timer sessions you finish. This is self-reported — the app never blocks your device or reads your use
            of other apps.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>How we use it</h2>
        <ul className={legalStyles.list}>
          <li>To respond to inquiries and process enrollments and payments.</li>
          <li>To personalize coaching, mentoring, and program recommendations.</li>
          <li>To operate the {brand.appName}&rsquo;s progress-tracking and curriculum-unlock features.</li>
          <li>To send program-related communication, including WhatsApp messages you&rsquo;ve opted into.</li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Third parties we share data with</h2>
        <ul className={legalStyles.list}>
          <li>Razorpay (payment processing for our own programs).</li>
          <li>Classplus (delivery of specific self-paced courses, where applicable).</li>
          <li>Supabase (our database and authentication infrastructure).</li>
          <li>Google (Google Analytics 4 — website measurement).</li>
          <li>Meta Platforms (Meta Pixel — measuring the results of our Facebook and Instagram ads).</li>
        </ul>
        <p className={legalStyles.p}>We do not sell your personal data to third parties.</p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Cookies, analytics and advertising pixels</h2>
        <p className={legalStyles.p}>
          Our website uses Google Analytics 4 and the Meta Pixel to understand how visitors use the site and to
          measure the results of our advertising. These tools set cookies or similar identifiers in your browser and
          record events such as page views, clicks on WhatsApp or payment buttons, form submissions (not the form
          contents) and free tests started.
        </p>
        <p className={legalStyles.p}>
          If you arrive from a link with campaign tags (utm_source, utm_medium, utm_campaign …), we keep those tags in
          your browser for the current session and add them to the WhatsApp message or enquiry you send us, so we know
          which campaign brought you.
        </p>
        <p className={legalStyles.p}>
          You can block or delete cookies in your browser settings, opt out of Google Analytics with Google&rsquo;s
          browser add-on, and manage ad personalisation in your Facebook or Instagram ad preferences. The site works
          without these cookies.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>Children</h2>
        <p className={legalStyles.p}>
          Many learners in our programs are children. When a parent or legal guardian sets up the {brand.appName} for a
          child, we ask them to confirm their consent, and we store that confirmation with its date and the wording
          shown. We collect only what the practice features need — no public profiles — and anything shared from the
          app (for example a progress card or a WhatsApp summary) shows the child&rsquo;s first name only, never contact
          details. A parent or guardian can ask us to delete their child&rsquo;s practice and assessment data at any time
          from Settings in the app, by email to info@mindurmind.org.in, or on WhatsApp.
        </p>
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
            href={waLink('Hi Dr. Kapil, I have a question about your privacy policy.')}
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
