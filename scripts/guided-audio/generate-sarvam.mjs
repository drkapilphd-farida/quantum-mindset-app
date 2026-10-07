// Voices a guided exercise's script with a Sarvam (Bulbul) AI voice.
//
//   node scripts/guided-audio/generate-sarvam.mjs --exercise memory-palace --lang hi \
//     --voice shubh --out "<folder>" --max-credits 20 [--dry-run]
//
// Reads src/features/<exercise>/script/<lang>.json ({ lines: [{ id, text }] }).
// Each "..." in a line becomes a 0.9 s pause: the line is voiced in pieces and
// joined, because Bulbul has no pause markup. Writes <out>/raw/<lang>/<id>.wav;
// lines that already have a file are skipped, so a re-run never pays twice.
// The API key is read from .env.local (SARVAM_API_KEY) and never printed.
// Sarvam charges 3 credits per 1,000 characters (Oct 2026).
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const exercise = arg('exercise')
const lang = arg('lang')
const voice = arg('voice', 'shubh')
const out = arg('out')
const maxCredits = Number(arg('max-credits', '0'))
const dryRun = process.argv.includes('--dry-run')
const PACE = 0.8
const GAP_S = 0.9
const CODES = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN' }
if (!exercise || !lang || !out || !CODES[lang]) throw new Error('usage: --exercise <id> --lang <en|hi|kn|ta|te|mr|gu|bn> --out <folder> --max-credits <n>')

const script = JSON.parse(fs.readFileSync(`src/features/${exercise}/script/${lang}.json`, 'utf8'))
const rawDir = path.join(out, 'raw', lang)
fs.mkdirSync(rawDir, { recursive: true })
const pieces = (text) => text.split(/\s*\.\.\.\s*/).map((s) => s.trim()).filter(Boolean)
const todo = script.lines.filter((line) => !fs.existsSync(path.join(rawDir, `${line.id}.wav`)))
const chars = todo.reduce((sum, line) => sum + pieces(line.text).join('').length, 0)
const credits = (chars * 3) / 1000
process.stdout.write(`${exercise}/${lang}: ${todo.length} of ${script.lines.length} lines to voice, ${chars} characters ≈ ${credits.toFixed(1)} credits\n`)
if (dryRun) process.exit(0)
if (credits > maxCredits) throw new Error(`would use ≈${credits.toFixed(1)} credits, above --max-credits ${maxCredits}; nothing generated`)

const key = fs.readFileSync('.env.local', 'utf8').split('\n').find((l) => l.startsWith('SARVAM_API_KEY='))?.slice('SARVAM_API_KEY='.length).trim().replace(/^"|"$/g, '')
if (!key) throw new Error('SARVAM_API_KEY is not set in .env.local')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'guided-audio-'))
const gap = path.join(tmp, 'gap.wav')
execFileSync('ffmpeg', ['-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(GAP_S), gap])

let sent = 0
for (const line of todo) {
  const parts = []
  for (const [i, text] of pieces(line.text).entries()) {
    let res
    // Sarvam rate-limits bursts (HTTP 429): wait and retry, a little longer each time.
    for (let attempt = 1; ; attempt++) {
      res = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: { 'api-subscription-key': key, 'content-type': 'application/json' },
        body: JSON.stringify({ text, target_language_code: CODES[lang], language_code: CODES[lang], model: 'bulbul:v3', speaker: voice, pace: PACE, temperature: 0.5, speech_sample_rate: 24000 }),
      })
      if (res.status !== 429 || attempt === 6) break
      await new Promise((r) => setTimeout(r, attempt * 5000))
    }
    await new Promise((r) => setTimeout(r, 400))
    if (!res.ok) throw new Error(`${line.id}: HTTP ${res.status} after ${sent} characters`)
    sent += text.length
    const { audios } = await res.json()
    const file = path.join(tmp, `${line.id}-${i}.wav`)
    fs.writeFileSync(file, Buffer.from(audios.join(''), 'base64'))
    if (i > 0) parts.push(gap)
    parts.push(file)
  }
  const list = path.join(tmp, `${line.id}.txt`)
  fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'))
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', path.join(rawDir, `${line.id}.wav`)])
}
process.stdout.write(`done: ${sent} characters sent ≈ ${((sent * 3) / 1000).toFixed(1)} credits\n`)
