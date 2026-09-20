'use client'

import React, { useTransition } from 'react'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '@/features/billing/actions/createCheckoutSession'

type BuyButtonProps = {
  courseId: string
  priceCents: number
  isAuthenticated: boolean
  loginHref: string
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function BuyButton({
  courseId,
  priceCents,
  isAuthenticated,
  loginHref,
}: BuyButtonProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition()

  function handleBuy(): void {
    if (!isAuthenticated) {
      window.location.href = loginHref
      return
    }

    startTransition(async () => {
      // Defense in depth (see the "Pre-Launch Audit Fix Pass" task,
      // Phase 1) — createCheckoutSession itself now catches every
      // Stripe-side failure and always returns the typed { success:
      // false, error } shape below, but a Server Action call can still
      // reject for reasons entirely outside that function (a network
      // failure delivering the request/response itself, for instance).
      // Without this try/catch, that specific failure mode showed the
      // user nothing at all — no toast, no feedback, the button just
      // silently stopped being disabled.
      try {
        const result = await createCheckoutSession({ courseId })
        if (!result.success) {
          toast.error(result.error)
          return
        }
        window.location.href = result.url
      } catch {
        toast.error('Something went wrong starting checkout. Please try again in a moment.')
      }
    })
  }

  return (
    <Button size="lg" onClick={handleBuy} disabled={isPending}>
      <ShoppingCart className="size-4" />
      {isPending
        ? 'Redirecting to checkout…'
        : `Buy for ${formatPrice(priceCents)}`}
    </Button>
  )
}
