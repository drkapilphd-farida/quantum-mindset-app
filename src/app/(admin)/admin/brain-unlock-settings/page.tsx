import type { Metadata } from "next";
import { currentAdminEmail } from "@/features/live-classes/admin/data";
import { getBrainUnlockSettings } from "@/features/brain-unlock/settingsServer";
import {
  followupText,
  type FollowupStep,
} from "@/features/brain-unlock/messages";
import { SettingsForm } from "@/features/brain-unlock/admin/SettingsForm";
import { isChatboxxConfigured } from "@/lib/whatsapp/chatboxx";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Brain Unlock settings — Admin",
  robots: { index: false, follow: false },
};

const STEPS: FollowupStep[] = ["instant", "h1", "d1", "d2", "d30"];

export default async function BrainUnlockSettingsPage(): Promise<React.JSX.Element> {
  if ((await currentAdminEmail()) === null) return <p>Not authorized.</p>;
  const settings = await getBrainUnlockSettings();
  const sample = {
    facts: {
      firstName: "Asha",
      brainType: "sprinter" as const,
      score: 78,
      speed: { before: 160, after: 290, counted: true },
      memory: { before: 2, forward: 5, backward: 5 },
      focus: { before: 18.2, after: 11.4 },
    },
    role: "parent" as const,
    settings,
    links: {
      report: "https://www.mindurmind.org.in/reading-memory-test?view=offer",
      selfPaced:
        "https://www.mindurmind.org.in/reading-memory-test?view=offer&plan=self",
      live: "https://www.mindurmind.org.in/reading-memory-test?view=offer&plan=live",
      retake: "https://www.mindurmind.org.in/reading-memory-test",
    },
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Brain Unlock settings</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Changes apply to /reading-memory-test at once — no deploy. Real values
          only: empty fields hide their block.
        </p>
      </div>
      <SettingsForm
        initial={settings}
        followupPreview={STEPS.map((step) => ({
          step,
          text: followupText(step, sample),
        }))}
        chatboxx={isChatboxxConfigured()}
      />
    </div>
  );
}
