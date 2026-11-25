// ============================================================
// Mind Ur Mind — Brain Test → WhatsApp result card (Supabase Edge Function)
// Function name: brain-test-send     |  "Verify JWT" = OFF
// Kaam: Brain Test ka result (poora ya aadha) usi WhatsApp number par bhejna —
//       card ki photo + naam aur numbers wala message + agla kadam (button).
// Kaun bulata hai: database (bt_progress trigger / har 5 min ka sweep), header
//   x-bt-secret = wa_settings.bt_send_secret. Ek session par poora card ek baar,
//   aadha card ek baar (aur poora ho jaye to aadha nahi jata).
// Secrets: WA_TOKEN, WA_PHONE_NUMBER_ID (wa-webhook wale hi).
// Message ka text bot_flow ke in dibbon (nodes) se aata hai — Bot editor me badaliye:
//   btr_full_en / btr_full_hi  (test poora)   btr_half_en / btr_half_hi  (aadha)
//   Placeholders: {name} {summary} {best} {done} {left} {bt} {card}
// Optional audio (aapki aawaz) pehle: wa_settings bt_audio_full_en / _hi, bt_audio_half_en / _hi
// ============================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const GRAPH = `https://graph.facebook.com/${Deno.env.get("GRAPH_VERSION") || "v25.0"}`;
const WA_TOKEN = Deno.env.get("WA_TOKEN")!;
const PHONE_ID = Deno.env.get("WA_PHONE_NUMBER_ID")!;
const HOUR = 3600 * 1000;

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

type FlowMedia = { type: "image" | "video" | "audio" | "document"; url: string; filename?: string } | null;
type FlowButton = { title: string; next: string | null; desc?: string };
type FlowNode = {
  text: string; media: FlowMedia; buttons: FlowButton[]; next: string | null; tag?: string; status?: string;
  header?: string; footer?: string; cta?: { text: string; url: string } | null; listLabel?: string;
};
type Flow = { start: string; nodes: Record<string, FlowNode> };

type Skill = { before: number; after?: number; counted?: boolean; backward?: number };
type Facts = { speed?: Skill; memory?: Skill; focus?: Skill };

function safeEqual(a: string, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
async function getSettings(): Promise<Record<string, string>> {
  const { data } = await db.from("wa_settings").select("key, value");
  return Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));
}
function cut(s: string, n: number) { return [...s].length > n ? [...s].slice(0, n - 1).join("") + "…" : s; }
function firstName(full: string): string {
  const TITLES = ["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "er", "er.", "prof", "prof.", "shri", "smt", "ca", "adv"];
  const w = (full || "").replace(/[^\p{L}\p{M}\s.]/gu, " ").split(/\s+/).filter(Boolean);
  const n = w.find((x) => !TITLES.includes(x.toLowerCase())) || "";
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : ""; // "kapil" → "Kapil"
}

// ---- personal lines from the real numbers ----
const pct = (a: number, b: number) => (a > 0 ? Math.round(((b - a) / a) * 100) : 0);
const r1 = (x: number) => Math.round(x * 10) / 10; // 0.3999999 → 0.4
function lines(f: Facts, hi: boolean) {
  const out: string[] = [];
  const gains: { label: string; text: string; score: number }[] = [];
  const s = f.speed, m = f.memory, fo = f.focus;
  if (s) {
    if (s.after !== undefined && s.counted) {
      out.push(`⚡ ${hi ? "पढ़ने की speed" : "Reading speed"}: ${s.before} → *${s.after}* ${hi ? "शब्द/मिनट" : "words/min"}`);
      if (s.after > s.before) gains.push({ label: "speed", score: pct(s.before, s.after), text: hi ? `पढ़ने की speed ${pct(s.before, s.after)}% बढ़ी` : `reading speed went up ${pct(s.before, s.after)}%` });
    } else if (s.after !== undefined) {
      out.push(`⚡ ${hi ? "पढ़ने की speed" : "Reading speed"}: ${s.before} ${hi ? "शब्द/मिनट (दूसरी बार जवाब कम सही थे, इसलिए नई speed नहीं गिनी)" : "words/min (fewer answers right the 2nd time, so the new speed wasn't counted)"}`);
    } else out.push(`⚡ ${hi ? "पढ़ने की speed" : "Reading speed"}: ${s.before} ${hi ? "शब्द/मिनट (technique के बाद वाला हिस्सा बाकी)" : "words/min (the after-technique part is left)"}`);
  }
  if (m) {
    if (m.after !== undefined) {
      const back = m.backward === 5 ? (hi ? " — उल्टा भी पूरा! 🔥" : " — backwards too! 🔥") : "";
      out.push(`🧠 ${hi ? "याददाश्त" : "Memory"}: ${m.before}/5 → *${m.after}/5*${back}`);
      if (m.after > m.before) gains.push({ label: "memory", score: (m.after - m.before) * 25, text: hi ? `याददाश्त ${m.before}/5 से ${m.after}/5 हुई` : `memory went from ${m.before}/5 to ${m.after}/5` });
    } else out.push(`🧠 ${hi ? "याददाश्त" : "Memory"}: ${m.before}/5 ${hi ? "(technique वाला हिस्सा बाकी)" : "(the technique part is left)"}`);
  }
  if (fo) {
    if (fo.after !== undefined) {
      out.push(`🎯 ${hi ? "Focus (grid)" : "Focus (grid)"}: ${fo.before}s → *${fo.after}s*`);
      if (fo.after < fo.before) gains.push({ label: "focus", score: pct(fo.after, fo.before), text: hi ? `focus grid ${r1(fo.before - fo.after)} सेकंड जल्दी हुआ` : `the focus grid got ${r1(fo.before - fo.after)}s faster` });
    } else out.push(`🎯 Focus: ${fo.before}s ${hi ? "(technique वाला हिस्सा बाकी)" : "(the technique part is left)"}`);
  }
  gains.sort((a, b) => b.score - a.score);
  return { summary: out.join("\n"), best: gains[0]?.text ?? "" };
}
function doneLeft(phases: number, hi: boolean) {
  const names = hi ? ["Speed", "Memory", "Focus"] : ["Speed", "Memory", "Focus"];
  const full = Math.floor(phases / 2);
  const done = names.slice(0, full).join(", ") || (hi ? "पहला कदम" : "the first step");
  const left = names.slice(full).join(", ");
  return { done, left };
}

// ---- sending (same shape as wa-webhook) ----
async function graphSend(contactId: string, to: string, payload: object, logBody: string, logType: string, mediaUrl: string | null = null) {
  const res = await fetch(`${GRAPH}/${PHONE_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${WA_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, ...payload }),
  });
  const json = await res.json().catch(() => ({}));
  await db.from("wa_messages").insert({
    contact_id: contactId, wa_message_id: json?.messages?.[0]?.id ?? null, direction: "out",
    type: logType, body: logBody, media_url: mediaUrl, status: res.ok ? "sent" : "failed",
    error: res.ok ? null : (json?.error?.message ?? `HTTP ${res.status}`),
  });
  return { ok: res.ok, error: res.ok ? null : (json?.error?.message ?? `HTTP ${res.status}`) };
}
const MEDIA_LABEL: Record<string, string> = { image: "📷 Photo", video: "🎥 Video", audio: "🎤 Audio", document: "📄 PDF" };
function mediaObj(m: NonNullable<FlowMedia>, caption?: string) {
  const o: Record<string, string> = { link: m.url };
  if (m.type === "document") o.filename = m.filename || "file.pdf";
  if (caption && m.type !== "audio") o.caption = cut(caption, 1000);
  return o;
}

async function sendNode(contact: any, flow: Flow, nodeId: string | null, fill: (s?: string) => string, depth = 0): Promise<{ ok: boolean; error: string | null }> {
  if (!nodeId || depth > 5) return { ok: false, error: "no node" };
  const node = flow.nodes[nodeId];
  if (!node) return { ok: false, error: `node ${nodeId} missing` };
  const cid = contact.id, to = contact.wa_id;
  const patch: Record<string, unknown> = {};
  if (node.tag) patch.tag = node.tag;
  if (node.status) patch.status = node.status;
  if (Object.keys(patch).length) await db.from("wa_contacts").update(patch).eq("id", cid);

  const text = fill(node.text);
  const header = cut(fill(node.header), 60);
  const footer = cut(fill(node.footer), 60);
  const buttons = (node.buttons || []).filter((b) => b.title?.trim()).slice(0, 3);
  const media = node.media && node.media.url ? { ...node.media, url: fill(node.media.url) } as NonNullable<FlowMedia> : null;
  const cta = node.cta && node.cta.url && node.cta.text ? { text: fill(node.cta.text), url: fill(node.cta.url) } : null;
  const mediaTag = media ? `[${MEDIA_LABEL[media.type] || media.type}] ` : "";
  const headerObj = media && media.type !== "audio" ? { type: media.type, [media.type]: mediaObj(media) } : header ? { type: "text", text: header } : null;
  const viaMedia = !!(media && media.type !== "audio");
  if (media && media.type === "audio") await graphSend(cid, to, { type: "audio", audio: mediaObj(media) }, mediaTag.trim(), "audio", media.url);

  let r: { ok: boolean; error: string | null };
  if (buttons.length) {
    const interactive: any = {
      type: "button", body: { text: cut(text || "👇", 1024) },
      action: { buttons: buttons.map((b, i) => ({ type: "reply", reply: { id: `${nodeId}|${i}`, title: cut(b.title, 20) } })) },
    };
    if (headerObj) interactive.header = headerObj;
    if (footer) interactive.footer = { text: footer };
    r = await graphSend(cid, to, { type: "interactive", interactive },
      (viaMedia ? mediaTag : "") + text + "\n[" + buttons.map((b) => b.title).join(" | ") + "]", "interactive", viaMedia ? media!.url : null);
  } else if (cta) {
    const interactive: any = {
      type: "cta_url", body: { text: cut(text || "👇", 1024) },
      action: { name: "cta_url", parameters: { display_text: cut(cta.text, 20), url: cta.url } },
    };
    if (headerObj) interactive.header = headerObj;
    if (footer) interactive.footer = { text: footer };
    r = await graphSend(cid, to, { type: "interactive", interactive }, (viaMedia ? mediaTag : "") + text + `\n[🔗 ${cta.text}]`, "interactive", viaMedia ? media!.url : null);
    if (!r.ok && viaMedia) { // fallback: photo + text with link
      r = await graphSend(cid, to, { type: media!.type, [media!.type]: mediaObj(media!, `${text}\n\n👉 ${cta.text}: ${cta.url}`) }, mediaTag + text, media!.type, media!.url);
    }
  } else if (viaMedia) {
    r = await graphSend(cid, to, { type: media!.type, [media!.type]: mediaObj(media!, text) }, mediaTag + text, media!.type, media!.url);
  } else {
    r = await graphSend(cid, to, { type: "text", text: { body: text, preview_url: true } }, text, "text");
  }
  if (node.next) {
    await new Promise((res) => setTimeout(res, 1500));
    await sendNode(contact, flow, node.next, fill, depth + 1);
  }
  return r;
}

// ---- main ----
async function handle(sessionId: string): Promise<string> {
  const { data: row } = await db.from("bt_progress").select("*").eq("session_id", sessionId).maybeSingle();
  if (!row) return "no row";
  if (!row.contact_id) return "no contact";
  const stage: "full" | "half" | null =
    row.phases_done >= 6 && !row.sent_full_at ? "full"
    : row.phases_done >= 1 && row.phases_done < 6 && !row.sent_partial_at && !row.sent_full_at ? "half" : null;
  if (!stage) return "nothing to send";

  // claim it (only one sender wins)
  const col = stage === "full" ? "sent_full_at" : "sent_partial_at";
  let q = db.from("bt_progress").update({ [col]: new Date().toISOString() }).eq("session_id", sessionId).is(col, null);
  if (stage === "half") q = q.is("sent_full_at", null);
  const { data: claimed } = await q.select("session_id");
  if (!claimed?.length) return "already sent";

  const { data: contact } = await db.from("wa_contacts").select("*").eq("id", row.contact_id).maybeSingle();
  if (!contact) return "contact gone";
  const finish = async (result: string) => {
    await db.from("bt_progress").update({ send_result: `${stage}: ${result}` }).eq("session_id", sessionId);
    return result;
  };
  if (contact.opted_out) return finish("opted out");
  const lastIn = contact.last_inbound_at ? new Date(contact.last_inbound_at).getTime() : 0;
  // Free-form messages (card + buttons) need the 24-hour window — even inside the ad's
  // free window, after 24h only templates are allowed.
  if (!(Date.now() - lastIn < 24 * HOUR)) return finish("window closed");

  const settings = await getSettings();
  let flow: Flow | null = null;
  try { flow = JSON.parse(settings.bot_flow || ""); } catch { flow = null; }
  const lang = row.lang === "hi" ? "hi" : "en";
  const nodeId = `btr_${stage}_${lang}`;
  if (!flow?.nodes?.[nodeId]) return finish(`node ${nodeId} missing`);

  const hi = lang === "hi";
  const { summary, best } = lines((row.facts ?? {}) as Facts, hi);
  const { done, left } = doneLeft(row.phases_done, hi);
  const name = firstName(contact.name || "");
  const vars: Record<string, string> = {
    "{name}": name, "{summary}": summary, "{best}": best || (hi ? "आपने पहला कदम उठा लिया" : "you took the first step"),
    "{done}": done, "{left}": left, "{bt}": contact.bt_token || "", "{card}": row.card_url || "",
  };
  const fill = (s?: string) => {
    let t = s || "";
    if (!name) t = t.replace(/\{name\}( जी)?,?\s*/g, ""); // naam nahi pata to "{name} जी," hata do
    for (const [k, v] of Object.entries(vars)) t = t.replaceAll(k, v);
    return t.replace(/\n{3,}/g, "\n\n").trim();
  };
  // without a card image, drop the image header instead of sending a broken link
  const node = flow.nodes[nodeId];
  if (!row.card_url && node.media?.url?.includes("{card}")) flow.nodes[nodeId] = { ...node, media: null };

  const audio = settings[`bt_audio_${stage}_${lang}`];
  if (audio) await graphSend(contact.id, contact.wa_id, { type: "audio", audio: { link: audio } }, "🎤 [Audio] brain test result", "audio", audio);
  const r = await sendNode(contact, flow, nodeId, fill);
  await db.from("wa_contacts").update({ last_message_at: new Date().toISOString() }).eq("id", contact.id);
  if (!r.ok) {
    // let a later call retry the full card
    if (stage === "full") await db.from("bt_progress").update({ sent_full_at: null }).eq("session_id", sessionId);
    return finish("failed: " + r.error);
  }
  return finish("sent");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("OK");
  const settings = await getSettings();
  if (!safeEqual(req.headers.get("x-bt-secret") || "", settings.bt_send_secret || "")) {
    return new Response("Forbidden", { status: 403 });
  }
  try {
    const body = await req.json();
    const sid = String(body?.session_id || "");
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(sid)) return new Response("bad session", { status: 400 });
    const r = await handle(sid);
    console.log("brain-test-send", sid, r);
    return new Response(JSON.stringify({ ok: true, result: r }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("brain-test-send error", e);
    return new Response(JSON.stringify({ ok: false }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
});
