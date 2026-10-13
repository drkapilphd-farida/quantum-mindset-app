// Server-only. Never import this from client components.
import { randomUUID } from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import { DEFAULT_MODEL_PRICING } from '@/core/ai-foundation/types/ModelPricing'
import { logger } from '@/lib/logger'
import { ChapterMapSchema, type ChapterIdea, type ChapterQuestion } from './chapterBook'

const MODEL = 'claude-haiku-4-5-20251001'
const FEATURE = 'chapter-map'

const SYSTEM = [
  'You help students remember the key ideas and structure of a chapter they are studying.',
  'From the chapter, choose the 5–9 most important ideas, in the order they appear. For each: a short title (max 8 words) a student can picture,',
  'one plain sentence of detail, and 0–3 short supporting points (facts, names, numbers, dates exactly as in the text).',
  'Then write 5 multiple-choice questions that check those ideas (4 options, exactly one correct, plausible wrong options, no "all of the above").',
  'Write everything in the same language as the chapter. Use only what the chapter says — never add outside facts.',
].join(' ')

const TOOL: Anthropic.Tool = {
  name: 'chapter_map',
  description: 'The key ideas of the chapter and questions about them.',
  input_schema: {
    type: 'object',
    properties: {
      ideas: { type: 'array', minItems: 5, maxItems: 9, items: { type: 'object', properties: { title: { type: 'string' }, detail: { type: 'string' }, points: { type: 'array', items: { type: 'string' }, maxItems: 3 } }, required: ['title', 'detail', 'points'] } },
      questions: {
        type: 'array',
        minItems: 5,
        maxItems: 5,
        items: { type: 'object', properties: { question: { type: 'string' }, options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 }, correctIndex: { type: 'integer', minimum: 0, maximum: 3 }, idea: { type: 'integer', minimum: 0, description: 'index of the idea this question checks' } }, required: ['question', 'options', 'correctIndex', 'idea'] },
      },
    },
    required: ['ideas', 'questions'],
  },
}

export type ChapterMapResult = { ok: true; ideas: ChapterIdea[]; questions: ChapterQuestion[] } | { ok: false; error: 'unavailable' }

export async function generateChapterMap(userId: string, title: string, text: string): Promise<ChapterMapResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { ok: false, error: 'unavailable' }
  const started = Date.now()
  let usage = { input_tokens: 0, output_tokens: 0 }
  let success = false
  try {
    const response = await new Anthropic({ apiKey }).messages.create({
      model: MODEL,
      max_tokens: 2500,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: 'chapter_map' },
      messages: [{ role: 'user', content: `Chapter title: ${title}\n\nChapter:\n${text}` }],
    })
    usage = response.usage
    const block = response.content.find((b) => b.type === 'tool_use')
    const parsed = ChapterMapSchema.safeParse(block && block.type === 'tool_use' ? block.input : null)
    if (!parsed.success) {
      logger.error('generateChapterMap: unusable reply', { issue: parsed.error.issues[0]?.message })
      return { ok: false, error: 'unavailable' }
    }
    const ideas = parsed.data.ideas
    const questions = parsed.data.questions.map((q) => ({ ...q, idea: Math.min(q.idea, ideas.length - 1) }))
    success = true
    return { ok: true, ideas, questions }
  } catch (error) {
    logger.error('generateChapterMap: AI call failed', { message: error instanceof Error ? error.message : 'unknown' })
    return { ok: false, error: 'unavailable' }
  } finally {
    const rate = DEFAULT_MODEL_PRICING[MODEL]
    await createServiceClient()
      .from('ai_cost_log')
      .insert({
        document_id: null,
        chunk_id: null,
        feature: FEATURE,
        model_id: MODEL,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        estimated_cost_cents: rate ? (usage.input_tokens / 1000) * rate.inputCentsPer1kTokens + (usage.output_tokens / 1000) * rate.outputCentsPer1kTokens : 0,
        processing_time_ms: Date.now() - started,
        request_id: `${userId}:${randomUUID()}`,
        success,
        error_message: success ? null : 'no usable chapter map',
      })
      .then(({ error }) => error && logger.warn('generateChapterMap: cost log failed', { code: error.code }))
  }
}
