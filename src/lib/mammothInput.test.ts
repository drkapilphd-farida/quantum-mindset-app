import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { extractTextFromDocx } from './documentTextExtraction'
import { universalUploadParser } from '@/core/universal-learning-engine/upload'
import { extractUniversalLearningDocument } from '@/core/universal-learning-engine/extraction'
import { cleanChapterText } from '@/features/memory-studio/chapterBook'

// A real Word file (a chapter with a table), read the way the server reads
// uploads. Before mammothInput, both readers failed in Node with "Could not
// find file in options" (mammoth only takes arrayBuffer in the browser).
const docx = (): File =>
  new File([readFileSync(join(__dirname, '__fixtures__/chapter-with-table.docx'))], 'chapter.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

describe('Word uploads on the server', () => {
  it('extractTextFromDocx reads the text', async () => {
    const result = await extractTextFromDocx(docx())
    expect(result.success).toBe(true)
    if (result.success) expect(result.text).toContain('The monsoon is the most important weather event in India')
  })
  it('the Chapter & Book upload path (parse → extract) reads the text and the table', async () => {
    const file = docx()
    const parsed = await universalUploadParser.parse(file)
    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    const result = await extractUniversalLearningDocument(file, parsed.source)
    expect(result.success).toBe(true)
    if (result.success) {
      const text = cleanChapterText(result.document.content)
      expect(text).toContain('Mawsynram')
      expect(text).toMatch(/Jaisalmer[\s\S]{0,40}160/)
    }
  })
})
