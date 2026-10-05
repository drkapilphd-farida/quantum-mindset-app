'use client'

import { useState } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
import type { MessageKey } from '@/lib/app-i18n/translate'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { SignUpForm } from '@/features/auth/components/SignUpForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type AuthMode = 'login' | 'signup'

type GatewayAuthModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Where sign-in/sign-up should land the user afterward — the exact
  // Choose Your Path™ card destination they clicked (e.g.
  // "/labs/sharp-brain/journey/1" or
  // "/dashboard#upload-document"), not a generic "back to the gateway"
  // fallback. This is what makes "route them accordingly" true: the modal
  // is a detour, not a dead end that costs a second click.
  next: string
  initialMode?: AuthMode
}

const COPY: Record<AuthMode, { title: MessageKey; description: MessageKey }> = {
  login: { title: 'auth.gateway.loginTitle', description: 'auth.gateway.loginDesc' },
  signup: { title: 'auth.gateway.signupTitle', description: 'auth.gateway.signupDesc' },
}

// Gateway Auth Modal™ — the auth gate for Choose Your Path™'s two direct
// action cards. Both cards are visible to signed-out visitors (see
// ChooseLearningMethodExperience.tsx and welcome/choose-method/page.tsx,
// which no longer hard-redirects logged-out users to /login before
// rendering); clicking one while signed out opens this instead of
// navigating, and only navigates to the real destination once
// authenticated — reusing LoginForm/SignUpForm as-is (both were already
// self-contained, page-independent components) rather than duplicating
// auth logic.
export function GatewayAuthModal({ open, onOpenChange, next, initialMode = 'signup' }: GatewayAuthModalProps): React.JSX.Element {
  const t = useAppT()
  const [mode, setMode] = useState<AuthMode>(initialMode)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) setMode(initialMode)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(COPY[mode].title)}</DialogTitle>
          <DialogDescription>{t(COPY[mode].description)}</DialogDescription>
        </DialogHeader>

        {mode === 'login' ? (
          <LoginForm next={next} onSwitchToSignup={() => setMode('signup')} />
        ) : (
          <SignUpForm next={next} onSwitchToLogin={() => setMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}
