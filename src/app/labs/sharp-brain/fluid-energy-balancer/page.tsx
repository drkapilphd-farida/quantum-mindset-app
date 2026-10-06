import { permanentRedirect } from 'next/navigation'

// The old "Calm Breath Balance" game was replaced by real guided breathing.
export default function FluidEnergyBalancerPage(): never {
  permanentRedirect('/labs/sharp-brain/calm-breathing')
}
