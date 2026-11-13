'use client'

import { programs } from '@/config/site.config'
import { useAppT } from '@/lib/app-i18n/client'
import { Lock } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { SharpBrainPricingProvider } from '@/features/sharp-brain-enrol/components/SharpBrainPricing'
import { SharpBrainPlans } from '@/features/sharp-brain-enrol/components/SharpBrainPlans'

const PROGRAM_NAME = programs.sharpBrain.name

type MasterclassPaywallModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Which locked day the learner tapped — null when the modal was
  // triggered generically (not from a specific day cell). Only changes
  // the headline copy; the plans/checkout are identical either way.
  day: number | null
}

// 30-Day Masterclass Paywall™ — every locked day cell opens this instead
// of navigating anywhere (see ThirtyDayCurriculumOverview.tsx /
// ThirtyDayCurriculumExperience.tsx), and so do the exercise lock screen
// and the Class Recordings lock. Both plans side by side (13 Nov 2026): Live
// batch ₹8,999 (recommended) and Self-paced ₹2,999. The server decides the
// price and creates the Razorpay link (SharpBrainPlans → BatchCheckout).
// Fetched only while open.
export function MasterclassPaywallModal({ open, onOpenChange, day }: MasterclassPaywallModalProps): React.JSX.Element {
  const t = useAppT()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <div className="flex flex-col items-center gap-4 p-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" aria-hidden="true">
            <Lock className="size-6" />
          </div>

          <div>
            <DialogTitle className="font-heading text-xl font-bold tracking-tight text-foreground">
              {day !== null ? t('curriculum.paywall.dayTitle', { day, program: PROGRAM_NAME }) : t('curriculum.paywall.startTitle', { program: PROGRAM_NAME })}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t('curriculum.paywall.body')}
            </DialogDescription>
          </div>

          {open && (
            <SharpBrainPricingProvider initial={null}>
              <div className="w-full" data-enroll-button="true">
                <SharpBrainPlans location="app_paywall_modal" />
              </div>
            </SharpBrainPricingProvider>
          )}

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('common.actions.maybeLater')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
