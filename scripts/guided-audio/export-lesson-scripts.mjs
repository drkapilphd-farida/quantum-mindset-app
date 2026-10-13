// Writes the Memory Studio "Learn" lesson lines as voice scripts:
//   scripts/guided-audio/lessons/<narrationId>/<lang>.json  ({ lines: [{ id, text }] })
// for generate-sarvam.mjs --script. Captions show "…"; the voice script uses
// "..." (each becomes a 0.9 s pause, exactly as in the Memory Palace audio).
// Run: node scripts/guided-audio/export-lesson-scripts.mjs
import fs from 'node:fs'

const msg = (lang) => JSON.parse(fs.readFileSync(`src/lib/app-i18n/messages/${lang}/training.json`, 'utf8')).studio
const lessonsTs = fs.readFileSync('src/features/memory-studio/lessons.ts', 'utf8')
const rhyme = JSON.parse(lessonsTs.slice(lessonsTs.indexOf('[', lessonsTs.indexOf('const RHYME_LESSON_TEXT')), lessonsTs.indexOf(']', lessonsTs.indexOf('const RHYME_LESSON_TEXT')) + 1).replace(/'/g, '"').replace(/,\s*\]/, ']'))
const voice = (text) => text.replace(/\s*…\s*/g, ' ... ').trim()
// EN and HI were approved by the founder; the other 6 are marked pending native
// review — a line corrected later is re-recorded on its own (generate-sarvam.mjs).
const REVIEWED = new Set(['en', 'hi'])
const write = (id, lang, texts) => {
  fs.mkdirSync(`scripts/guided-audio/lessons/${id}`, { recursive: true })
  const lines = texts.map((text, i) => ({ id: `line-${i + 1}`, text: voice(text) }))
  fs.writeFileSync(`scripts/guided-audio/lessons/${id}/${lang}.json`, JSON.stringify({ lang, review: REVIEWED.has(lang) ? 'approved by the founder 12 Oct 2026' : 'pending native review', lines }, null, 2) + '\n')
  console.log(`${id}/${lang}: ${lines.length} lines, ${lines.reduce((a, l) => a + l.text.length, 0)} characters`)
}
const LANGS = ['en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn']
for (const lang of LANGS) write('story-lesson', lang, [1, 2, 3, 4, 5, 6, 7, 8].map((n) => msg(lang).storyLesson[`l${n}`]))
// Rhyme pegs exist only in English; every other language uses the shape pegs.
write('peg-lesson-rhyme', 'en', rhyme)
for (const lang of LANGS.filter((l) => l !== 'en')) write('peg-lesson-shape', lang, [1, 2, 3, 4, 5, 6, 7, 8].map((n) => msg(lang).pegLesson[`l${n}`]))
