'use client'

import { useState } from 'react'
import { MasterclassPaywallModal } from '@/features/thirty-day-curriculum/components/MasterclassPaywallModal'

/** A button that opens both Sharp Brain plans (live + self-paced) in the app, for server-rendered pages. */
export function OpenPlansButton({ label, className, dataLocation }: { label: string; className: string; dataLocation: string }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} data-open-plans={dataLocation}>
        {label}
      </button>
      <MasterclassPaywallModal open={open} onOpenChange={setOpen} day={null} />
    </>
  )
}
