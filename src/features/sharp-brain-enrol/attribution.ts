// Attribution notes for Sharp Brain checkouts (Brain Unlock spec, Nov 2026):
// the visit's utm_* tags and the page section travel in the Razorpay payment
// link's notes, so every payment can be traced to its campaign.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** utm_* tags + where the checkout started, as Razorpay notes (max 15 notes × 256 chars; we add at most 6). */
export function attributionNotes(
  utm: Record<string, string> | undefined,
  from: string | undefined,
): Record<string, string> {
  const notes: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = utm?.[key]?.trim();
    if (value !== undefined && value !== "") notes[key] = value.slice(0, 200);
  }
  if (from !== undefined) notes.checkout_from = from;
  return notes;
}
