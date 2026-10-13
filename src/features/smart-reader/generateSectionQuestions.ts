// Server-only. Never import this from client components.
import { randomUUID } from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { DEFAULT_MODEL_PRICING } from '@/core/ai-foundation/types/ModelPricing'
import { logger } from '@/lib/logger'
import type { SectionQuestion } from './reader'

const MODEL = 'claude-haiku-4-5-20251001'
export const SECTION_QUESTIONS_FEATURE = 'smart-reader-questions'

const SYSTEM = [
  'You write quick comprehension checks for a student reading their own study chapter, section by section.',
  'For each numbered section, write exactly 2 multiple-choice questions about what that section says (4 options, exactly one correct, plausible wrong options, no "all of the above").',
  'Write in the same language as the sections. Use only what the section says — never add outside facts.',
].join(' ')

const TOOL: Anthropic.Tool = {
  name: 'section_questions',
  description: 'Two questions for each section, in order.',
  input_schema: {
    type: 'object',
    properties: {
      sections: {
        type: 'array',
        items: {
          type: 'object',
          properties: { questions: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'object', properties: { question: { type: 'string' }, options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 }, correctIndex: { type: 'integer', minimum: 0, maximum: 3 } }, required: ['question', 'options', 'correctIndex'] } } },
          required: ['questions'],
        },
      },
    },
    required: ['sections'],
  },
}

const Reply = z.object({ sections: z.array(z.object({ questions: z.array(z.object({ question: z.string().min(1).max(400), options: z.array(z.string().min(1).max(200)).length(4), correctIndex: z.number().int().min(0).max(3) })).min(1).max(3) })) })

/** One AI call for all sections (Claude Haiku). Logged to ai_cost_log; on failure the reader simply skips the questions. */
export async function generateSectionQuestions(userId: string, sections: readonly string[]): Promise<SectionQuestion[][] | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || sections.length === 0) return null
  const started = Date.now()
  let usage = { input_tokens: 0, output_tokens: 0 }
  let success = false
  try {
    const response = await new Anthropic({ apiKey }).messages.create({
      model: MODEL,
      max_tokens: 3000,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: 'section_questions' },
      messages: [{ role: 'user', content: sections.map((s, i) => `Section ${i + 1}:\n${s}`).join('\n\n') }],
    })
    usage = response.usage
    const block = response.content.find((b) => b.type === 'tool_use')
    const parsed = Reply.safeParse(block && block.type === 'tool_use' ? block.input : null)
    if (!parsed.success) {
      logger.error('generateSectionQuestions: unusable reply', { issue: parsed.error.issues[0]?.message })
      return null
    }
    success = true
    return sections.map((_, i) => parsed.data.sections[i]?.questions ?? [])
  } catch (error) {
    logger.error('generateSectionQuestions: AI call failed', { message: error instanceof Error ? error.message : 'unknown' })
    return null
  } finally {
    const rate = DEFAULT_MODEL_PRICING[MODEL]
    await createServiceClient()
      .from('ai_cost_log')
      .insert({
        document_id: null,
        chunk_id: null,
        feature: SECTION_QUESTIONS_FEATURE,
        model_id: MODEL,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        estimated_cost_cents: rate ? (usage.input_tokens / 1000) * rate.inputCentsPer1kTokens + (usage.output_tokens / 1000) * rate.outputCentsPer1kTokens : 0,
        processing_time_ms: Date.now() - started,
        request_id: `${userId}:${randomUUID()}`,
        success,
        error_message: success ? null : 'no usable section questions',
      })
      .then(({ error }) => error && logger.warn('generateSectionQuestions: cost log failed', { code: error.code }))
  }
}
