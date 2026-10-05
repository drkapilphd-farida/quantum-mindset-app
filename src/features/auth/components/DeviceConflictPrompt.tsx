'use client'

import { useTransition } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
import { claimActiveSession } from '@/lib/activeSessions/claimActiveSession'
import { signOut } from '../actions/signOut'
import { AuthCard } from './AuthCard'
import { Button } from '@/components/ui/button'

type DeviceConflictPromptProps = {
  next: string
  otherDeviceLabel: string | null
}

// Single-Device Login Enforcement™ (see the "Pre-Launch Audit Fix Pass"
// task, Phase 7) — shown only when the middleware gate
// (activeSessionGate.ts) finds the account's claim still fresh from a
// DIFFERENT device/browser. A graceful handoff, not a hard lock:
// "Continue here" wins the account for this device and logs the other
// one out on its own next request; "Cancel" backs out of this device's
// own sign-in instead.
export function DeviceConflictPrompt({ next, otherDeviceLabel }: DeviceConflictPromptProps): React.JSX.Element {
  const t = useAppT()
  const [isPending, startTransition] = useTransition()

  function handleContinueHere(): void {
    startTransition(async () => {
      await claimActiveSession(next)
    })
  }

  function handleCancel(): void {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <AuthCard
      title={t('auth.device.title')}
      description={
        otherDeviceLabel
          ? t('auth.device.activeOn', { device: otherDeviceLabel })
          : t('auth.device.activeElsewhere')
      }
    >
      <div className="space-y-3">
        <p className="text-muted-foreground text-center text-sm">
          {t('auth.device.explain')}
        </p>
        <Button onClick={handleContinueHere} disabled={isPending} className="w-full">
          {isPending ? t('auth.device.wait') : t('auth.device.continue')}
        </Button>
        <Button onClick={handleCancel} disabled={isPending} variant="outline" className="w-full">
          {t('common.actions.cancel')}
        </Button>
      </div>
    </AuthCard>
  )
}
