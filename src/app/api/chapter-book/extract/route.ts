import { NextResponse } from 'next/server'
import { memoryStudio } from '@/config/site.config'
import { universalUploadParser } from '@/core/universal-learning-engine/upload'
import { extractUniversalLearningDocument } from '@/core/universal-learning-engine/extraction'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { logger } from '@/lib/logger'

// Chapter & Book: reads the text out of an uploaded PDF / Word / text file
// (a file upload is the one thing a Route Handler is used for here). No AI and
// nothing stored — the learner checks the text, then the server action makes
// the key ideas. Uploads are private to the learner.
export const maxDuration = 60

const EXTRACTABLE = new Set(['pdf', 'docx', 'txt'])

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await hasQuantumSpeedReadingProAccess())) return NextResponse.json({ ok: false, error: 'locked' }, { status: 403 })
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: 'no-file' }, { status: 400 })
  if (file.size > memoryStudio.maxUploadBytes) return NextResponse.json({ ok: false, error: 'too-large' }, { status: 413 })
  const validated = await universalUploadParser.parse(file)
  if (!validated.success || !EXTRACTABLE.has(validated.source.sourceType)) return NextResponse.json({ ok: false, error: 'type' }, { status: 400 })
  const extraction = await extractUniversalLearningDocument(file, validated.source)
  if (!extraction.success) {
    logger.warn('chapter-book extract failed', { sourceType: validated.source.sourceType })
    return NextResponse.json({ ok: false, error: 'unreadable' }, { status: 422 })
  }
  return NextResponse.json({ ok: true, title: extraction.document.title || file.name.replace(/\.[^.]+$/, ''), text: extraction.document.content.slice(0, 400_000) })
}
