'use client'

import { primaryCheckoutHref, programs } from '@/config/site.config'
import { Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

// Paid button link — read from the programs registry (site.config.ts).
// Name, price and link all from the programs registry (site.config.ts).
const SHARP_BRAIN_CHECKOUT_HREF = primaryCheckoutHref('sharpBrain')
const PROGRAM_NAME = programs.sharpBrain.name
const PROGRAM_PRICE = `₹${(programs.sharpBrain.prices[0]?.amountInr ?? 0).toLocaleString('en-IN')}`

type MasterclassPaywallModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Which locked day the learner tapped — null when the modal was
  // triggered generically (not from a specific day cell). Only changes
  // the headline copy; the price/checkout are identical either way.
  day: number | null
}

// 30-Day Masterclass Paywall™ — every locked day cell opens this instead
// of navigating anywhere (see ThirtyDayCurriculumOverview.tsx /
// ThirtyDayCurriculumExperience.tsx). Same real, hosted Razorpay
// Payment Link the dashboard hero card's own "Enroll Now" button already
// uses (SHARP_BRAIN_CHECKOUT_HREF) — one real checkout URL, not
// a second one that could drift. Completing that checkout takes real
// payment but does not automatically grant in-app access yet (no
// entitlement is wired to it today — see getIsPaidUser.ts's own doc
// comment); this modal doesn't claim otherwise.
export function MasterclassPaywallModal({ open, onOpenChange, day }: MasterclassPaywallModalProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-4 p-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" aria-hidden="true">
            <Lock className="size-6" />
          </div>

          <div>
            <DialogTitle className="font-heading text-xl font-bold tracking-tight text-foreground">
              {day !== null ? `Day ${day} is part of the ${PROGRAM_NAME}` : `Start the ${PROGRAM_NAME}`}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
              All 30 days of the curriculum — real WPM + comprehension checkpoints, and 7 live classes with Dr. Kapil Dev Sharma — unlock
              with enrollment. Days you have already completed stay open.
            </DialogDescription>
          </div>

          <div className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-heading text-3xl font-bold tabular-nums text-foreground">{PROGRAM_PRICE}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">One-time enrollment · full 30-day curriculum + live classes</p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400 active:scale-95"
            data-enroll-button="true"
          >
            <a href={SHARP_BRAIN_CHECKOUT_HREF} target="_blank" rel="noopener noreferrer">
              <Sparkles className="size-4" aria-hidden="true" />
              Enroll Now for {PROGRAM_PRICE} →
            </a>
          </Button>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
