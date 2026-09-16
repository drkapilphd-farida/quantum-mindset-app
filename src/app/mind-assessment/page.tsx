import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: { absolute: 'Free Mind Assessment — Coming Soon | Mind Ur Mind' },
  description: 'A free self-awareness assessment for overthinking, worry, and stress patterns — coming soon.',
}

// Route placeholder only, per the "Build the 21-Day Mind Reset System
// Landing Page" master prompt's own instruction: "Do not implement the
// assessment logic itself — CTA and route placeholder only." An honest
// "coming soon" stop (same discipline as questions-coming-soon/page.tsx
// elsewhere in this repo), not a faked assessment flow. Links back to
// the Mind Reset page rather than the homepage, since visitors land here
// specifically from that page's own assessment CTAs.
export default function MindAssessmentPage(): React.JSX.Element {
  return (
    <div className="warm-light flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16 text-center font-sans">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose/40 bg-rose-soft">
        <Sparkles className="h-7 w-7 text-rose" aria-hidden="true" />
      </div>
      <div className="max-w-md">
        <h1 className="text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
          The Free Mind Assessment Is Coming Soon
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-dim">
          We&rsquo;re building a simple self-awareness assessment for overthinking, worry, and stress patterns — for
          educational reflection only, not a clinical diagnosis. Check back soon, or explore the 21-Day Mind Reset
          System in the meantime.
        </p>
      </div>
      <Link
        href="/mentoring/mind-reset-system"
        className="inline-flex items-center gap-2 rounded-sm bg-rose px-7 py-[15px] text-[14px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e]"
      >
        Back to the 21-Day Mind Reset System
      </Link>
    </div>
  )
}
