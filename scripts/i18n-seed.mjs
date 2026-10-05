// Merges a seed file { <lang>: { <namespace>: {...} } } into
// src/lib/app-i18n/messages/<lang>/<namespace>.json (seed values win), then
// regenerate the catalog:  node scripts/i18n-seed.mjs seed.json && node scripts/i18n-catalog.mjs
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'src/lib/app-i18n/messages'
const merge = (a, b) => {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = v && typeof v === 'object' && !Array.isArray(v) ? merge(a?.[k] ?? {}, v) : v
  return out
}
const seed = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
for (const [lang, namespaces] of Object.entries(seed)) {
  fs.mkdirSync(path.join(ROOT, lang), { recursive: true })
  for (const [ns, dict] of Object.entries(namespaces)) {
    const file = path.join(ROOT, lang, `${ns}.json`)
    const current = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
    fs.writeFileSync(file, JSON.stringify(merge(current, dict), null, 2) + '\n')
  }
}
console.log('seeded', Object.keys(seed).join(', '))
