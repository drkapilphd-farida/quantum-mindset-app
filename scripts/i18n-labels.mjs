// Collects the fixed English labels that engine code passes through
// translateLabel()/useLabelT() and adds any missing ones to
// src/lib/app-i18n/messages/en/exercises.json under "labels".
// Run after adding such labels:  node scripts/i18n-labels.mjs
import fs from 'node:fs'
import path from 'node:path'

const EN = 'src/lib/app-i18n/messages/en/exercises.json'
const labelKey = (s) =>
  s.toLowerCase().replace(/™/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60)

// Files whose label constants are shown through the label translator.
const SOURCES = [
  'src/features/phrase-reading/phraseDifficulty.ts',
  'src/features/phrase-reading/phraseChallengeLibrary.ts',
  'src/features/phrase-reading/phraseAdvancedChallengeLibrary.ts',
  'src/features/phrase-reading/phraseRecommendation.ts',
  'src/features/phrase-reading/phraseEngine.ts',
  'src/features/flash-intelligence/wordFlashInsights.ts',
  'src/lib/exercise-engine/speedEngine.ts',
  'src/features/quantum-speed-reading/sentenceDifficulty.ts',
  'src/features/quantum-speed-reading/sentenceLibrary.ts',
  'src/features/quantum-speed-reading/sentenceChallengeLibrary.ts',
  'src/features/quantum-speed-reading/sentenceRecommendation.ts',
]
// Practice content (chapter titles, answer options) that sits in the same
// source files but is never shown through the label translator.
const EXCLUDE = new Set(["Bees moving between flowers", "Celebrating small wins along the way", "Develop ______", "Foundations of Good Health", "How Modern Technology Works", "How the Mind Learns", "Increase Reading ______", "Life in the Wild", "Matter and Energy", "Muscles contracting and relaxing", "Nature's Balance", "Other scientists reviewing the research", "Rain falling regularly", "Regular exercise", "Repeated, consistent practice", "Robotic arms in factories", "The force of gravity", "The internet connecting billions of devices", "The Psychology of Motivation", "The Rise of Automation", "The Scientific Method", "Understanding the Human Body"])
const pick = new Set()
const strLit = /'((?:[^'\\\n]|\\.)+)'|"([^"\n]+)"/g

function addLiterals(text, filter) {
  for (const m of text.matchAll(strLit)) {
    const s = (m[1] ?? m[2]).replace(/\\'/g, "'")
    if (filter(s)) pick.add(s)
  }
}
const looksLikeText = (s) => /^[A-Z0-9🔓🏆]/.test(s) && /[a-z]/.test(s) && !s.includes('/') && !/^[a-z-]+$/.test(s)

// 1. Whole label modules: every capitalised string literal in a
//    `Record<..., string>` table or a `return '...'` line.
for (const file of SOURCES) {
  const text = fs.readFileSync(file, 'utf8')
  for (const line of text.split('\n')) {
    if (/^\s*(\/\/|\*|import)/.test(line)) continue
    if (/return ['"]|^\s+\d+: '|^\s+'?[a-z-]+'?: '|\): '|\| '|^\s+'[A-Z]/.test(line) || /: (MeaningRecognitionLabel|LanguageProcessingLabel)/.test(line)) addLiterals(line, looksLikeText)
  }
}

// 2. Every file that renders RuntimeResultScreen or ExerciseCountdown:
//    RESULT_LABELS values, extraStats label/hint, countdown words,
//    trainsAbility on engine definitions.
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(e.name) && !e.name.includes('.test.')) out.push(p)
  }
  return out
}
for (const file of walk('src')) {
  const text = fs.readFileSync(file, 'utf8')
  if (text.includes('RuntimeResultLabels = {')) {
    const block = text.slice(text.indexOf('RuntimeResultLabels = {'), text.indexOf('\n}', text.indexOf('RuntimeResultLabels = {')))
    addLiterals(block, looksLikeText)
  }
  if (text.includes('<RuntimeResultScreen')) {
    for (const m of text.matchAll(/\b(label|hint): '((?:[^'\\\n]|\\.)+)'/g)) pick.add(m[2].replace(/\\'/g, "'"))
  }
  for (const m of text.matchAll(/(readyLabel|goLabel)="([^"]+)"/g)) pick.add(m[2])
  for (const m of text.matchAll(/trainsAbility: '((?:[^'\\\n]|\\.)+)'/g)) pick.add(m[1].replace(/\\'/g, "'"))
}

const messages = JSON.parse(fs.readFileSync(EN, 'utf8'))
const labels = messages.labels ?? {}
let added = 0
for (const s of [...pick].sort()) {
  const key = labelKey(s)
  if (key === '' || labels[key] !== undefined || EXCLUDE.has(s)) continue
  labels[key] = s
  added++
}
messages.labels = Object.fromEntries(Object.entries(labels).sort(([a], [b]) => a.localeCompare(b)))
fs.writeFileSync(EN, JSON.stringify(messages, null, 2) + '\n')
console.log(`labels: ${Object.keys(messages.labels).length} (${added} added)`)
