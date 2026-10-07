// App translations ⇄ CSV, for native-speaker review.
//
//   node scripts/i18n-csv.mjs export            → docs/translations/<lang>.csv (one per language)
//   node scripts/i18n-csv.mjs import kn.csv     → writes corrections back into the app
//
// Columns: key, english, translation, status, notes
//  - status is "pending" or "reviewed". A reviewer edits `translation` and
//    sets status to "reviewed" for every line they have checked.
//  - Import writes every non-empty translation into
//    src/lib/app-i18n/messages/<lang>/<namespace>.json and records reviewed
//    lines in src/lib/app-i18n/review/<lang>.json together with the English
//    text they were reviewed against — if that English text changes later,
//    the line becomes "pending" again on the next export.
//  - The language is taken from the file name (kn.csv, ta.csv, …).
import fs from 'node:fs'
import path from 'node:path'

const MESSAGES = 'src/lib/app-i18n/messages'
const REVIEW = 'src/lib/app-i18n/review'
const OUT = 'docs/translations'
const LANGS = ['hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn']

const readJson = (file, fallback) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback)

function flatten(dict, prefix = '') {
  return Object.entries(dict).flatMap(([k, v]) => (typeof v === 'string' ? [[`${prefix}${k}`, v]] : flatten(v, `${prefix}${k}.`)))
}

function setPath(dict, keyPath, value) {
  const parts = keyPath.split('.')
  let node = dict
  for (const part of parts.slice(0, -1)) node = node[part] ??= {}
  node[parts.at(-1)] = value
}

function englishEntries() {
  return fs
    .readdirSync(path.join(MESSAGES, 'en'))
    .filter((f) => f.endsWith('.json'))
    .sort()
    .flatMap((file) => flatten(readJson(path.join(MESSAGES, 'en', file), {}), `${file.replace(/\.json$/, '')}.`))
}

function langEntries(lang) {
  const dir = path.join(MESSAGES, lang)
  if (!fs.existsSync(dir)) return new Map()
  return new Map(
    fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .flatMap((file) => flatten(readJson(path.join(dir, file), {}), `${file.replace(/\.json$/, '')}.`)),
  )
}

const csvCell = (v) => (/[",\n\r]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v)

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') (cell += '"'), i++
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') row.push(cell), (cell = '')
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cell), rows.push(row), (row = []), (cell = '')
    } else cell += c
  }
  if (cell !== '' || row.length > 0) row.push(cell), rows.push(row)
  return rows.filter((r) => r.some((v) => v !== ''))
}

function exportAll() {
  fs.mkdirSync(OUT, { recursive: true })
  const english = englishEntries()
  const summary = []
  for (const lang of LANGS) {
    const translated = langEntries(lang)
    const reviewed = readJson(path.join(REVIEW, `${lang}.json`), {})
    let pending = 0
    let missing = 0
    const lines = ['key,english,translation,status,notes']
    for (const [key, en] of english) {
      const tr = translated.get(key) ?? ''
      const isReviewed = tr !== '' && reviewed[key] === en
      if (tr === '') missing++
      else if (!isReviewed) pending++
      lines.push([key, en, tr, isReviewed ? 'reviewed' : 'pending', tr === '' ? 'missing — shows English' : ''].map(csvCell).join(','))
    }
    fs.writeFileSync(path.join(OUT, `${lang}.csv`), '﻿' + lines.join('\n') + '\n')
    summary.push({ lang, keys: english.length, pending, missing, reviewed: english.length - pending - missing })
  }
  fs.writeFileSync(path.join(OUT, 'status.json'), JSON.stringify(summary, null, 2) + '\n')
  console.table(summary)
}

function importOne(file) {
  const lang = path.basename(file).replace(/\.csv$/, '')
  if (!LANGS.includes(lang)) throw new Error(`File name must be one of ${LANGS.map((l) => l + '.csv').join(', ')}`)
  const [header, ...rows] = parseCsv(fs.readFileSync(file, 'utf8'))
  const col = (name) => header.indexOf(name)
  const [iKey, iEn, iTr, iStatus] = ['key', 'english', 'translation', 'status'].map(col)
  if ([iKey, iTr].some((i) => i < 0)) throw new Error('CSV needs at least the columns: key, translation')
  const english = new Map(englishEntries())
  const byNs = {}
  const reviewFile = path.join(REVIEW, `${lang}.json`)
  const reviewed = readJson(reviewFile, {})
  let written = 0
  let marked = 0
  let unknown = 0
  for (const row of rows) {
    const key = row[iKey]?.trim()
    const tr = row[iTr]?.trim() ?? ''
    if (!key || !english.has(key)) {
      unknown++
      continue
    }
    const [ns, ...rest] = key.split('.')
    if (tr !== '') {
      byNs[ns] ??= readJson(path.join(MESSAGES, lang, `${ns}.json`), {})
      setPath(byNs[ns], rest.join('.'), tr)
      written++
    }
    if (iStatus >= 0 && row[iStatus]?.trim().toLowerCase() === 'reviewed' && tr !== '') {
      reviewed[key] = iEn >= 0 && row[iEn] ? english.get(key) : english.get(key)
      marked++
    }
  }
  for (const [ns, dict] of Object.entries(byNs)) fs.writeFileSync(path.join(MESSAGES, lang, `${ns}.json`), JSON.stringify(dict, null, 2) + '\n')
  fs.mkdirSync(REVIEW, { recursive: true })
  fs.writeFileSync(reviewFile, JSON.stringify(reviewed, null, 2) + '\n')
  console.log(`${lang}: ${written} translations written, ${marked} marked reviewed, ${unknown} unknown keys skipped`)
}

const [cmd, arg] = process.argv.slice(2)
if (cmd === 'export') exportAll()
else if (cmd === 'import' && arg) importOne(arg)
else console.log('Usage: node scripts/i18n-csv.mjs export | import <lang>.csv')
