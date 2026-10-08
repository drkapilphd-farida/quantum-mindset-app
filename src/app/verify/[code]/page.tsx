import type { Metadata } from 'next'
import Image from 'next/image'
import { findPublicCertificate } from '@/features/certificate/verify'
import { formatCertDate, PROGRAM_NAME } from '@/features/certificate/certificate'

export const metadata: Metadata = {
  title: 'Certificate verification — Mind Ur Mind',
  robots: { index: false, follow: false },
}

type VerifyPageProps = { params: Promise<{ code: string }> }

// Public verification of a Sharp Brain certificate. Shows only first name +
// last initial (many learners are children), programme, date and ID — never
// the full name, scores, email or contact details.
export default async function VerifyCertificatePage({ params }: VerifyPageProps): Promise<React.JSX.Element> {
  const { code } = await params
  const cert = await findPublicCertificate(decodeURIComponent(code))
  return (
    <main className="flex min-h-[80vh] items-start justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 border-b border-border/60 pb-4">
          <Image src="/brand/mind-ur-mind-logo.svg" alt="" width={36} height={36} unoptimized />
          <span className="font-heading text-lg tracking-wide text-foreground">Mind Ur Mind</span>
        </div>
        {cert === null ? (
          <div className="flex flex-col gap-2" data-verify="not-found">
            <h1 className="font-heading text-xl font-bold text-foreground">Certificate not found</h1>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find a certificate with this ID. Check the ID on the certificate (it looks like SB-7K4M-Q2XP) and try the link again.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4" data-verify="valid">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="currentColor" />
                <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Valid certificate
            </p>
            <h1 className="font-heading text-2xl font-bold text-foreground" data-verify-name="true">
              {cert.name}
            </h1>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Programme</dt>
              <dd className="font-semibold text-foreground">{PROGRAM_NAME}</dd>
              <dt className="text-muted-foreground">Completed</dt>
              <dd className="font-semibold text-foreground">{formatCertDate(cert.completedOn, 'en')}</dd>
              <dt className="text-muted-foreground">Certificate ID</dt>
              <dd className="font-semibold text-foreground tabular-nums">{cert.code}</dd>
              <dt className="text-muted-foreground">Issued by</dt>
              <dd className="font-semibold text-foreground">Mind Ur Mind · Dr. Kapil Dev Sharma</dd>
            </dl>
            <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
              This page confirms the certificate was issued. It shows first name and last initial only, never scores, email or contact details.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
