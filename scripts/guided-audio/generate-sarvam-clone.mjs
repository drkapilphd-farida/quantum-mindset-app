// Voices a script with one of Dr. Kapil's own Sarvam voice clones
// (Instant Voice Cloning, POST /voices/clone) and writes ready MP3s.
//
//   node scripts/guided-audio/generate-sarvam-clone.mjs --script src/features/brain-unlock/script/hi.json \
//     --lang hi --out public/audio/brain-unlock/hi --work "<scratch folder>" --max-credits 20 [--dry-run] [--only id,id]
//
// Clone IDs come from GET https://api.sarvam.ai/voices ("Dr Kapil english" /
// "Dr Kapil Hindi"); they are not secrets. The API key is read from .env.local
// (SARVAM_API_KEY) and never printed. Each "..." in a line becomes a short
// pause (the line is voiced in pieces and joined). Memory-story and focus lines
// are voiced a little slower, and story steps end with a small pause.
// Cloned voices are in beta and sometimes add or repeat words, so every piece
// is transcribed (Sarvam speech-to-text) and voiced again, up to 6 times, until
// it says exactly the script; lines still unsure are listed at the end.
// Cloned-voice TTS costs ₹2 per 1,000 characters (Nov 2026).
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

export const CLONE_VOICES = { en: 'svc-0457f3df-1b84-4269-894c-39bb8bcd4a91', hi: 'svc-26aff049-8578-4114-b5cf-560109fe6b74' }

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const lang = arg('lang')
const scriptFile = arg('script')
const out = arg('out')
const work = arg('work')
const maxCredits = Number(arg('max-credits', '0'))
const only = arg('only', '')
const dryRun = process.argv.includes('--dry-run')
if (!CLONE_VOICES[lang] || !scriptFile || !out || !work) throw new Error('usage: --lang en|hi --script <json> --out <mp3 folder> --work <scratch folder> --max-credits <n>')

const SLOW = /^(story[AB]-\d|memory-replay|focus-)/
const pace = (id) => (SLOW.test(id) ? 0.85 : 0.95)
const GAP_S = 0.7
const TAIL_S = (id) => (/^story[AB]-\d/.test(id) ? 0.6 : 0)

const script = JSON.parse(fs.readFileSync(scriptFile, 'utf8'))
const lines = script.lines.filter((l) => only === '' || only.split(',').includes(l.id))
const pieces = (text) => text.split(/\s*\.\.\.\s*/).map((s) => s.trim()).filter(Boolean)
const chars = lines.reduce((n, l) => n + pieces(l.text).join('').length, 0)
const credits = (chars * 2) / 1000
process.stdout.write(`${lang}: ${lines.length} lines, ${chars} characters ≈ ${credits.toFixed(1)} credits\n`)
if (dryRun) process.exit(0)
if (credits > maxCredits) throw new Error(`would use ≈${credits.toFixed(1)} credits, above --max-credits ${maxCredits}; nothing generated`)

const key = fs.readFileSync('.env.local', 'utf8').split('\n').find((l) => l.startsWith('SARVAM_API_KEY='))?.slice('SARVAM_API_KEY='.length).trim().replace(/^"|"$/g, '')
if (!key) throw new Error('SARVAM_API_KEY is not set in .env.local')
fs.mkdirSync(out, { recursive: true })
fs.mkdirSync(work, { recursive: true })
const silence = (s) => {
  const f = path.join(work, `silence-${s}.wav`)
  if (!fs.existsSync(f)) execFileSync('ffmpeg', ['-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(s), '-c:a', 'pcm_s16le', f])
  return f
}

// ── Check: the transcript must match the script (no added or repeated words) ──
const tokens = (t) => t.toLowerCase().replace(/[।,.!?:;"“”‘’()]/g, ' ').split(/\s+/).filter(Boolean)
export function sameWords(want, got) {
  const w = tokens(want)
  const g = tokens(got)
  // No extra words at all, except that an English word inside a Hindi line may
  // come back as two ("superpowers" → "सुपर पावर्स"); words may merge ("दर-कदम").
  const extra = w.filter((t) => /[a-z]/.test(t) && /[\u0900-\u097f]/.test(want)).length
  if (g.length > w.length + extra || g.length < w.length - Math.max(1, Math.ceil(w.length * 0.2))) return false
  // A word said twice in a row that the script doesn't repeat = a stutter.
  for (let i = 1; i < g.length; i++) if (g[i] === g[i - 1] && !want.toLowerCase().includes(`${g[i]} ${g[i]}`)) return false
  // The last two words said again (e.g. "real numbers, real numbers").
  if (g.length >= 4 && g.at(-1) === g.at(-3) && g.at(-2) === g.at(-4)) return false
  return true
}
async function transcribe(file) {
  const form = new FormData()
  form.set('file', new Blob([fs.readFileSync(file)], { type: 'audio/wav' }), 'piece.wav')
  form.set('model', 'saarika:v2.5')
  form.set('language_code', lang === 'hi' ? 'hi-IN' : 'en-IN')
  const res = await fetch('https://api.sarvam.ai/speech-to-text', { method: 'POST', headers: { 'api-subscription-key': key }, body: form })
  if (!res.ok) throw new Error(`speech-to-text HTTP ${res.status}`)
  return (await res.json()).transcript ?? ''
}
const unsure = []

let sent = 0
const manifest = { exercise: 'brain-unlock', lang, voice: `clone:${CLONE_VOICES[lang]}`, createdAt: new Date().toISOString(), lines: {} }
for (const line of lines) {
  const parts = []
  for (const [i, text] of pieces(line.text).entries()) {
    const raw = path.join(work, `${lang}-${line.id}-${i}.wav`)
    let ok = false
    for (let take = 1; take <= 6 && !ok; take++) {
      const form = new FormData()
      form.set('voice_id', CLONE_VOICES[lang])
      form.set('text', text)
      form.set('language_code', lang === 'hi' ? 'hi-IN' : 'en-IN')
      form.set('pace', String(pace(line.id)))
      form.set('output_audio_codec', 'wav')
      form.set('speech_sample_rate', '24000')
      form.set('enable_qc', 'true')
      let res
      for (let attempt = 1; ; attempt++) {
        res = await fetch('https://api.sarvam.ai/voices/clone', { method: 'POST', headers: { 'api-subscription-key': key }, body: form })
        if (res.status !== 429 || attempt === 6) break
        await new Promise((r) => setTimeout(r, attempt * 5000))
      }
      if (!res.ok) throw new Error(`${line.id}: HTTP ${res.status} after ${sent} characters`)
      sent += text.length
      const body = await res.json()
      // Normalise every piece to 24 kHz mono PCM so the pieces join cleanly.
      fs.writeFileSync(`${raw}.in`, Buffer.from(body.audio_b64 ?? body.audio, 'base64'))
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', `${raw}.in`, '-ar', '24000', '-ac', '1', '-c:a', 'pcm_s16le', raw])
      fs.rmSync(`${raw}.in`)
      const heard = await transcribe(raw)
      ok = sameWords(text, heard)
      if (!ok) process.stdout.write(`    ${line.id} piece ${i + 1} take ${take}: heard "${heard}"\n`)
      await new Promise((r) => setTimeout(r, 300))
    }
    if (!ok) unsure.push(line.id)
    if (i > 0) parts.push(silence(GAP_S))
    parts.push(raw)
  }
  if (TAIL_S(line.id) > 0) parts.push(silence(TAIL_S(line.id)))
  const list = path.join(work, `${lang}-${line.id}.txt`)
  fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'))
  const mp3 = path.join(out, `${line.id}.mp3`)
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'libmp3lame', '-b:a', '64k', '-ar', '24000', '-ac', '1', mp3])
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString().trim())
  manifest.lines[line.id] = { file: `${line.id}.mp3`, durationMs: Math.round(dur * 1000), text: line.text }
  process.stdout.write(`  ${line.id} ${dur.toFixed(1)} s\n`)
}
const mfile = path.join(out, 'manifest.json')
const prev = fs.existsSync(mfile) ? JSON.parse(fs.readFileSync(mfile, 'utf8')) : { lines: {} }
fs.writeFileSync(mfile, JSON.stringify({ ...manifest, lines: { ...prev.lines, ...manifest.lines } }, null, 2) + '\n')
if (unsure.length > 0) process.stdout.write(`still unsure after 6 takes (please listen): ${[...new Set(unsure)].join(', ')}\n`)
process.stdout.write(`done: ${sent} characters sent ≈ ${((sent * 2) / 1000).toFixed(1)} credits\n`)
