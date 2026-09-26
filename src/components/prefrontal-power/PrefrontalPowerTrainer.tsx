import TrainerBio from "../TrainerBio";

// "Meet Your Trainer" — name, bio, stats and photo come from site.config
// via TrainerBio (site-rebuild Phase 2). English-only page, so the
// language is pinned.
export default function PrefrontalPowerTrainer(): React.JSX.Element {
  return <TrainerBio variant="long" accent="gold" eyebrow="Meet Your Trainer" lang="en" />;
}
