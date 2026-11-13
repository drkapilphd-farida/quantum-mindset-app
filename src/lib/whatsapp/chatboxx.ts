// Server only. Chatboxx WhatsApp API — NOT CONNECTED YET.
//
// The codebase has no Chatboxx integration (Nov 2026): WhatsApp leads open the
// visitor's own WhatsApp to the founder's number. Business-initiated messages
// (the Brain Unlock follow-ups) need Chatboxx's API endpoint, an API key and
// WhatsApp-approved message templates. Until CHATBOXX_API_URL and
// CHATBOXX_API_KEY are set, isChatboxxConfigured() is false and nothing is
// sent: the follow-up queue marks due messages "skipped" (reason
// whatsapp_api_not_configured) so nothing piles up and blasts later.
//
// TODO(business): send Chatboxx's API docs + the approved template names;
// then implement sendWhatsAppText below against that exact API.

export function isChatboxxConfigured(): boolean {
  return (
    (process.env.CHATBOXX_API_URL ?? "") !== "" &&
    (process.env.CHATBOXX_API_KEY ?? "") !== ""
  );
}

export type WhatsAppSendResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "not_implemented" | "failed" };

/** `to`: digits with country code (e.g. 9198…). `text`: the full message. */
export async function sendWhatsAppText(
  to: string,
  text: string,
): Promise<WhatsAppSendResult> {
  if (!isChatboxxConfigured()) return { ok: false, reason: "not_configured" };
  void to;
  void text;
  // Deliberately not guessed: the request shape must come from Chatboxx's docs.
  return { ok: false, reason: "not_implemented" };
}
