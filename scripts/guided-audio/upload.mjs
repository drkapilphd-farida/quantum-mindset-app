// Uploads prepared guided-voice audio to Supabase Storage.
//
//   node scripts/guided-audio/upload.mjs --exercise memory-palace --from "<folder>" [--langs en,hi] [--production]
//
// <folder>/<lang>/ must hold the MP3s and manifest.json written by prepare.mjs.
// Staging by default (.env.staging.local); --production uses .env.local and
// must only be run with the founder's approval. Files go to
// guided-audio/<exercise>/<lang>/<file>, overwriting same-named files.
// Keys are read by name and never printed.
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const exercise = arg('exercise')
const from = arg('from')
const langs = arg('langs', 'en,hi,kn,ta,te,mr,gu,bn').split(',')
const production = process.argv.includes('--production')
if (!exercise || !from) throw new Error('usage: --exercise <id> --from <folder> [--langs en,hi] [--production]')

const envFile = production ? '.env.local' : '.env.staging.local'
const env = Object.fromEntries(
  fs.readFileSync(envFile, 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => {
    const i = l.indexOf('=')
    return [l.slice(0, i), l.slice(i + 1).trim().replace(/^"|"$/g, '')]
  }),
)
const prodRef = fs.readFileSync('supabase/.temp/project-ref', 'utf8').trim()
const isProdUrl = env.NEXT_PUBLIC_SUPABASE_URL.includes(prodRef)
if (production !== isProdUrl) throw new Error(`refusing: ${envFile} does not point at the ${production ? 'production' : 'staging'} project`)

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
let files = 0
let bytes = 0
for (const lang of langs) {
  const dir = path.join(from, lang)
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'))
  const names = [...Object.values(manifest.lines).map((l) => l.file), 'manifest.json']
  for (const name of names) {
    const body = fs.readFileSync(path.join(dir, name))
    const isJson = name.endsWith('.json')
    const { error } = await db.storage.from('guided-audio').upload(`${exercise}/${lang}/${name}`, body, {
      contentType: isJson ? 'application/json' : 'audio/mpeg',
      cacheControl: isJson ? '3600' : '31536000',
      upsert: true,
    })
    if (error) throw new Error(`${lang}/${name}: ${error.message}`)
    files++
    bytes += body.length
  }
  process.stdout.write(`${lang}: ${names.length} files\n`)
}
process.stdout.write(`${production ? 'PRODUCTION' : 'staging'}: uploaded ${files} files, ${(bytes / 1048576).toFixed(1)} MB\n`)
