import { permanentRedirect } from 'next/navigation'

// Guessing games were removed from Sharp Brain (Oct 2026): a chance score can
// never improve, so it can't show real progress.
export default function RemovedGuessingGamePage(): never {
  permanentRedirect('/labs/sharp-brain')
}
