import type { Metadata } from 'next'
import { LegalPageShell, legalStyles } from '@/features/legal/components/LegalPageShell'
import { buildPageMetadata } from '@/lib/seo/metadata'

// Replaces stale legacy content (see the "Pre-Launch Audit Fix Pass"
// task, Phase 3) — this page previously described a different business
// entirely ("Quantum Mind Learning Lab™," a school/franchise-partner LMS
// subscription platform with recurring monthly/yearly billing) and its
// billing section's one refund line ("non-refundable except where
// required by law") directly contradicted the 30-Day QSR Masterclass's
// own advertised "100% Results Guaranteed" claim. That section now
// links to the new, real /refund-policy page (also added in this same
// phase) instead. Contact email fixed from the wrong-domain
// legal@mindurmindlab.com to the real info@mindurmind.org.in.
//
// Same "not yet lawyer-reviewed" flag as privacy/page.tsx — genuinely
// complete and internally consistent, worth a real legal pass soon,
// not held back from launch on that basis alone.
export const metadata: Metadata = buildPageMetadata({
  path: '/terms',
  title: 'Terms of Service — Mind Ur Mind',
  description: 'The terms governing your use of Mind Ur Mind\'s courses, retreats, mentoring, franchise program, and the Quantum Mind app.',
})

const LAST_UPDATED = 'September 2026'

export default function TermsOfServicePage(): React.JSX.Element {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated={LAST_UPDATED} brandName="Mind Ur Mind">
      <p className="text-muted-foreground leading-relaxed">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of mindurmind.org.in and enrollment in any Mind
        Ur Mind program — Quantum Speed Reading, meditation and inner-mastery retreats, 1-on-1 mentoring, the
        Quantum Mind &amp; Habit Builder app, and our self-paced courses (together, the &ldquo;Service&rdquo;). By
        creating an account or enrolling in a program, you agree to these Terms.
      </p>

      <section>
        <h2 className={legalStyles.h2}>1. Nature of our services</h2>
        <p className={legalStyles.p}>
          Mind Ur Mind provides cognitive training, meditation and personal-development retreats, and mentoring
          services. These are educational and developmental in nature and are not a substitute for licensed
          medical, psychiatric, or therapeutic treatment. Our programs are intended for users aged 13 and above;
          users under 18 should have a parent or guardian&rsquo;s consent to enroll.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>2. Accounts</h2>
        <p className={legalStyles.p}>
          You are responsible for maintaining the confidentiality of your login credentials and for all activity
          under your account. Notify us promptly at{' '}
          <a href="mailto:info@mindurmind.org.in" className="text-foreground underline underline-offset-2">
            info@mindurmind.org.in
          </a>{' '}
          of any unauthorized use.
        </p>
      </section>

      <section id="billing">
        <h2 className={legalStyles.h2}>3. Enrollment, payment, and refunds</h2>
        <ul className={legalStyles.list}>
          <li>Payments are processed securely by our payment processor, Razorpay.</li>
          <li>Prices and what&rsquo;s included are as stated on each program&rsquo;s page at the time of enrollment.</li>
          <li>
            Most Mind Ur Mind programs are one-time payments, not recurring subscriptions, except where a specific
            program page states otherwise (for example, the optional ₹499/month continued-practice plan after
            completing the 30-Day Masterclass).
          </li>
          <li>
            Refunds and cancellations — including the 30-Day Quantum Speed Reading Masterclass&rsquo;s 100% Results
            Guarantee — are governed by our{' '}
            <a href="/refund-policy" className="text-foreground underline underline-offset-2">
              Refund &amp; Cancellation Policy
            </a>
            , not by a blanket no-refund rule.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>4. Your responsibilities</h2>
        <ul className={legalStyles.list}>
          <li>Provide accurate information during enrollment.</li>
          <li>
            Treat instructors, mentors, and fellow participants with respect during live sessions and retreats;
            disruptive or abusive conduct may result in removal from a program without a refund.
          </li>
          <li>Do not attempt to access another user&rsquo;s data or circumvent any access control or security measure.</li>
          <li>Do not resell, redistribute, or publicly share course content, recordings, or materials.</li>
        </ul>
      </section>

      <section>
        <h2 className={legalStyles.h2}>5. Your content and AI-generated output</h2>
        <p className={legalStyles.p}>
          You retain ownership of documents, notes, and other content you upload (&ldquo;Your Content&rdquo;). You
          grant us a limited license to process Your Content solely to operate the Service for you, including
          sending it to our AI provider to generate summaries, questions, or other learning output. AI-generated
          output may be inaccurate or incomplete; it supports learning, not a substitute for professional, academic,
          or expert judgment.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>6. Intellectual property</h2>
        <p className={legalStyles.p}>
          All course content, videos, and materials are the property of Mind Ur Mind and Dr. Kapil Dev Sharma and
          may not be copied, redistributed, or used to create derivative works without permission.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>7. Disclaimers and limitation of liability</h2>
        <p className={legalStyles.p}>
          The Service is provided &ldquo;as is,&rdquo; without warranties of any kind. Mind Ur Mind and Dr. Kapil
          Dev Sharma are not liable for outcomes not expressly guaranteed as part of a program — see each program&rsquo;s
          own page, and our Refund &amp; Cancellation Policy, for what is and isn&rsquo;t promised. To the fullest
          extent permitted by law, our total liability for any claim relating to the Service will not exceed the
          amount you paid us for the program giving rise to the claim.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>8. Changes to these Terms</h2>
        <p className={legalStyles.p}>
          We may update these Terms from time to time. We&rsquo;ll update the &ldquo;Last updated&rdquo; date above
          when we do; continued use of the Service after a change constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section>
        <h2 className={legalStyles.h2}>9. Governing law &amp; contact</h2>
        <p className={legalStyles.p}>
          These Terms are governed by the laws of India, with courts in Vadodara, Gujarat having jurisdiction.
          Questions about these Terms can be sent to{' '}
          <a href="mailto:info@mindurmind.org.in" className="text-foreground underline underline-offset-2">
            info@mindurmind.org.in
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  )
}
