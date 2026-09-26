import TrainerBio from '@/components/TrainerBio'

// About the trainer — name, bio, stats and photo come from site.config via
// TrainerBio (site-rebuild Phase 2), in the light tone this page uses.
export function ExecutiveWorkshopTrainer(): React.JSX.Element {
  return <TrainerBio variant="long" tone="light" accent="teal" eyebrow="About the Trainer" lang="en" />
}
