'use client'

import { useTransition } from 'react'
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
      title="Continue here?"
      description={
        otherDeviceLabel
          ? `Your account is currently active on ${otherDeviceLabel}.`
          : 'Your account is currently active on another device.'
      }
    >
      <div className="space-y-3">
        <p className="text-muted-foreground text-center text-sm">
          Continue here and log out there? You can only be actively signed in on one device at a time.
        </p>
        <Button onClick={handleContinueHere} disabled={isPending} className="w-full">
          {isPending ? 'Please wait…' : 'Continue here and log out there'}
        </Button>
        <Button onClick={handleCancel} disabled={isPending} variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    </AuthCard>
  )
}
