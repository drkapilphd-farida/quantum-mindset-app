// Clean-up for guided-voice recordings (AI-generated or recorded by hand).
//
//   node scripts/guided-audio/prepare.mjs --exercise memory-palace --lang hi \
//     --in "<folder with <id>.wav|mp3>" --out "<folder>" [--voice shubh]
//
// For every line in src/features/<exercise>/script/<lang>.json: trims silence
// at the start and end (pauses inside a line are kept), levels loudness to
// -16 LUFS (EBU R128, true peak -1.5 dB), converts to mono 64 kbps MP3, and
// writes <out>/<id>.mp3 plus <out>/manifest.json (id → file + duration), the
// file the app reads to know which lines have audio. Reports missing and
// unexpected files. Nothing is uploaded — that's a separate, approved step.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const exercise = arg('exercise')
const lang = arg('lang')
const input = arg('in')
const out = arg('out')
const voice = arg('voice', 'unknown')
if (!exercise || !lang || !input || !out) throw new Error('usage: --exercise <id> --lang <code> --in <folder> --out <folder>')

const script = JSON.parse(fs.readFileSync(`src/features/${exercise}/script/${lang}.json`, 'utf8'))
const expected = new Set(script.lines.map((l) => l.id))
const files = fs.readdirSync(input).filter((f) => /\.(wav|mp3)$/i.test(f))
const unexpected = files.filter((f) => !expected.has(f.replace(/\.(wav|mp3)$/i, '')))
fs.mkdirSync(out, { recursive: true })

const TRIM = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse'
const manifest = { exercise, lang, voice, review: script.review ?? 'pending', createdAt: new Date().toISOString(), lines: {} }
const missing = []
for (const { id } of script.lines) {
  const source = files.find((f) => f.replace(/\.(wav|mp3)$/i, '') === id)
  if (!source) {
    missing.push(id)
    continue
  }
  const target = path.join(out, `${id}.mp3`)
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(input, source), '-af', `${TRIM},loudnorm=I=-16:TP=-1.5:LRA=11`, '-ar', '24000', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', target])
  const seconds = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', target]).toString().trim())
  manifest.lines[id] = { file: `${id}.mp3`, durationMs: Math.round(seconds * 1000) }
}
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
const total = Object.values(manifest.lines).reduce((s, l) => s + l.durationMs, 0)
process.stdout.write(`${exercise}/${lang}: ${Object.keys(manifest.lines).length} files, ${(total / 60000).toFixed(1)} min; missing ${missing.length}${missing.length ? ' (' + missing.join(', ') + ')' : ''}; unexpected ${unexpected.length}${unexpected.length ? ' (' + unexpected.join(', ') + ')' : ''}\n`)
