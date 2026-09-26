import Link from 'next/link'
import { LivingBrainLogo } from '@/components/brand/LivingBrainLogo'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'

export function ExecutiveWorkshopFooter(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig

  return (
    <footer className="bg-void px-6 py-12 text-ink-dim sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em] text-ink">
          <LivingBrainLogo size={22} decorative={false} animated={false} />
          MIND UR MIND
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 text-[13.5px] sm:grid-cols-2">
          <p>
            <Link href="/" className="hover:text-ink">
              mindurmind.org.in
            </Link>
          </p>
          <p>
            <a href={`mailto:${config.contactEmail}`} className="hover:text-ink">
              {config.contactEmail}
            </a>
          </p>
          <p>{config.venueAddress}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line-strong pt-6 text-[12.5px]">
          <Link href="/privacy" className="hover:text-ink">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="hover:text-ink">
            Refund &amp; Cancellation Policy
          </Link>
        </div>

        <p className="mt-6 max-w-2xl text-[12px] text-ink-faint">
          This programme is educational and performance-focused. It is not a medical or psychological treatment.
        </p>
      </div>
    </footer>
  )
}
