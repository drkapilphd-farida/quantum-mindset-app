// Voices Brain Unlock lines with the Sarvam Bulbul v3 "shubh" voice — each line
// in ONE request (no splitting/joining: joins sounded choppy), then trims the
// silence at both ends (keeps ~200 ms), evens the loudness (two-pass EBU R128,
// -16 LUFS) and writes a 64 kbps mono MP3. Every final file is transcribed
// (Sarvam speech-to-text) and voiced again until it says exactly the script.
//
//   node scripts/guided-audio/generate-sarvam-shubh.mjs --lang hi --script src/features/brain-unlock/script/hi.json \
//     --out public/audio/brain-unlock/hi --work "<scratch folder>" --budget 25 [--only id,id] [--dry-run]
//
// "..." in the script is the caption's pause mark; it is removed before voicing
// (sentence punctuation gives the pauses). Memory-story and focus lines are a
// little slower and calmer. The key is read from .env.local (SARVAM_API_KEY),
// never printed. Bulbul v3: 3 credits per 1,000 characters; speech-to-text is
// counted at ~0.5 credit per minute of audio (Nov 2026). --budget stops the run
// before the estimate would pass it.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const lang = arg('lang')
const scriptFile = arg('script')
const out = arg('out')
const work = arg('work')
const budget = Number(arg('budget', '0'))
const only = arg('only', '')
const dryRun = process.argv.includes('--dry-run')
if (!['en', 'hi'].includes(lang) || !scriptFile || !out || !work) throw new Error('usage: --lang en|hi --script <json> --out <folder> --work <scratch> --budget <credits>')
const CODE = lang === 'hi' ? 'hi-IN' : 'en-IN'
const MAX_TAKES = 8

const SLOW = /^(story[AB]-\d|memory-teach|memory-replay|focus-)/
const pace = (id) => (SLOW.test(id) ? 0.88 : 1.0)
export const ttsText = (t) => t.replace(/\s*\.\.\.\s*/g, ' ').replace(/\s+/g, ' ').trim()

const script = JSON.parse(fs.readFileSync(scriptFile, 'utf8'))
const lines = script.lines.filter((l) => only === '' || only.split(',').includes(l.id))
const chars = lines.reduce((n, l) => n + ttsText(l.text).length, 0)
process.stdout.write(`${lang}: ${lines.length} lines, ${chars} characters ≈ ${((chars * 3) / 1000).toFixed(1)} credits per pass\n`)
if (dryRun) process.exit(0)

const key = fs.readFileSync('.env.local', 'utf8').split('\n').find((l) => l.startsWith('SARVAM_API_KEY='))?.slice('SARVAM_API_KEY='.length).trim().replace(/^"|"$/g, '')
if (!key) throw new Error('SARVAM_API_KEY is not set in .env.local')
fs.mkdirSync(out, { recursive: true })
fs.mkdirSync(work, { recursive: true })

// ── The transcript must say the script: nothing added, missing or repeated ──
const tokens = (t) => t.toLowerCase().replace(/[।,.!?:;"“”‘’()…]/g, ' ').split(/\s+/).filter(Boolean)
function sameWords(want, got) {
  const w = tokens(want)
  const g = tokens(got)
  // An English word in a Hindi line may come back as two ("superpowers" → "सुपर पावर्स");
  // hyphenated words may come back split ("कदम-दर-कदम" → "कदम दर कदम").
  const extra = w.filter((t) => /[a-z]/.test(t) && /[ऀ-ॿ]/.test(want)).length + w.reduce((n, t) => n + (t.match(/-/g) ?? []).length, 0)
  if (g.length > w.length + extra || g.length < w.length - Math.max(1, Math.ceil(w.length * 0.15))) return false
  for (let i = 1; i < g.length; i++) if (g[i] === g[i - 1] && !want.toLowerCase().includes(`${g[i]} ${g[i]}`) && !want.includes(`${g[i]}-${g[i]}`)) return false
  if (g.length >= 4 && g.at(-1) === g.at(-3) && g.at(-2) === g.at(-4)) return false
  return true
}

let credits = 0
const spend = (c) => {
  credits += c
  if (credits > budget) throw new Error(`stopped: would pass the ${budget}-credit budget (≈${credits.toFixed(1)} so far)`)
}
const duration = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim())

async function voice(text, id, take) {
  spend((text.length * 3) / 1000)
  let res
  for (let attempt = 1; ; attempt++) {
    res = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: { 'api-subscription-key': key, 'content-type': 'application/json' },
      // A little less randomness on retries keeps later takes steady.
      body: JSON.stringify({ text, target_language_code: CODE, model: 'bulbul:v3', speaker: 'shubh', pace: pace(id), temperature: take <= 2 ? 0.5 : 0.35, speech_sample_rate: 24000, output_audio_codec: 'wav' }),
    })
    if (res.status !== 429 || attempt === 6) break
    await new Promise((r) => setTimeout(r, attempt * 5000))
  }
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`)
  const { audios } = await res.json()
  return Buffer.from(audios.join(''), 'base64')
}

/** Trim the ends (keep ~200 ms), even loudness (two-pass loudnorm), MP3. */
function finishFile(wav, mp3) {
  const trimmed = `${wav}.trim.wav`
  const keep = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.2:detection=peak'
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', wav, '-af', `${keep},areverse,${keep},areverse`, '-ar', '24000', '-ac', '1', trimmed])
  const m = spawnSync('ffmpeg', ['-hide_banner', '-i', trimmed, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr
  const j = JSON.parse(m.slice(m.lastIndexOf('{'), m.lastIndexOf('}') + 1))
  const norm = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', trimmed, '-af', `${norm},aresample=24000`, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', mp3])
  fs.rmSync(trimmed)
}
async function transcribe(file) {
  spend((duration(file) / 60) * 0.5)
  const form = new FormData()
  form.set('file', new Blob([fs.readFileSync(file)], { type: 'audio/mpeg' }), 'line.mp3')
  form.set('model', 'saarika:v2.5')
  form.set('language_code', CODE)
  const res = await fetch('https://api.sarvam.ai/speech-to-text', { method: 'POST', headers: { 'api-subscription-key': key }, body: form })
  if (!res.ok) throw new Error(`speech-to-text HTTP ${res.status}`)
  return (await res.json()).transcript ?? ''
}

const manifest = { exercise: 'brain-unlock', lang, voice: 'shubh', model: 'bulbul:v3', createdAt: new Date().toISOString(), lines: {} }
const unsure = []
try {
  for (const line of lines) {
    const text = ttsText(line.text)
    const wav = path.join(work, `${lang}-${line.id}.wav`)
    const mp3 = path.join(out, `${line.id}.mp3`)
    let heard = ''
    let ok = false
    for (let take = 1; take <= MAX_TAKES && !ok; take++) {
      fs.writeFileSync(wav, await voice(text, line.id, take))
      finishFile(wav, mp3)
      heard = await transcribe(mp3)
      ok = sameWords(text, heard)
      if (!ok) process.stdout.write(`    ${line.id} take ${take}: heard "${heard}"\n`)
      await new Promise((r) => setTimeout(r, 300))
    }
    fs.rmSync(wav)
    if (!ok) unsure.push(line.id)
    manifest.lines[line.id] = { file: `${line.id}.mp3`, durationMs: Math.round(duration(mp3) * 1000), text: line.text, heard }
    process.stdout.write(`  ${line.id} ${duration(mp3).toFixed(1)} s ${ok ? '✓' : '?'}\n`)
  }
} finally {
  const mfile = path.join(out, 'manifest.json')
  const prev = fs.existsSync(mfile) ? JSON.parse(fs.readFileSync(mfile, 'utf8')) : { lines: {} }
  fs.writeFileSync(mfile, JSON.stringify({ ...manifest, lines: { ...prev.lines, ...manifest.lines } }, null, 2) + '\n')
  if (unsure.length > 0) process.stdout.write(`still not matching after ${MAX_TAKES} takes (please listen): ${unsure.join(', ')}\n`)
  process.stdout.write(`credits this run ≈ ${credits.toFixed(1)}\n`)
}
