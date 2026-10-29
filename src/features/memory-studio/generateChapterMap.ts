// Server-only. Never import this from client components.
import { randomUUID } from 'node:crypto'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import { DEFAULT_MODEL_PRICING } from '@/core/ai-foundation/types/ModelPricing'
import { logger } from '@/lib/logger'
import { normaliseChapterMap, wordCount, type ChapterIdea, type ChapterQuestion } from './chapterBook'

const MODEL = 'claude-haiku-4-5-20251001'
const FEATURE = 'chapter-map'

/** Total time for all attempts — inside the 60 s limit of the routes that run this (chapter-book, thirty-day-curriculum). */
const BUDGET_MS = 50_000
/** One automatic retry. */
const ATTEMPTS = 2
const RETRY_DELAY_MS = 1_500
/** Don't start an attempt with less time than this left. */
const MIN_ATTEMPT_MS = 10_000

const SYSTEM = [
  'You help students remember the key ideas and structure of a chapter they are studying.',
  'From the chapter, choose the 5–9 most important ideas, in the order they appear. For each: a short title (max 8 words) a student can picture,',
  'one plain sentence of detail (at most 25 words), and 0–3 short supporting points (facts, names, numbers, dates exactly as in the text; each under 12 words).',
  'If the chapter contains a table, use its facts in the ideas and points, but do not copy whole rows.',
  'Then write 5 multiple-choice questions that check those ideas (4 options, exactly one correct, plausible wrong options, no "all of the above").',
  'Write everything in the same language as the chapter. Use only what the chapter says — never add outside facts.',
].join(' ')

const TOOL: Anthropic.Tool = {
  name: 'chapter_map',
  description: 'The key ideas of the chapter and questions about them.',
  input_schema: {
    type: 'object',
    properties: {
      ideas: {
        type: 'array',
        minItems: 5,
        maxItems: 9,
        items: {
          type: 'object',
          properties: { title: { type: 'string', maxLength: 60 }, detail: { type: 'string', maxLength: 180, description: 'one sentence, at most 25 words' }, points: { type: 'array', items: { type: 'string', maxLength: 80 }, maxItems: 3 } },
          required: ['title', 'detail', 'points'],
        },
      },
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

/**
 * Why a chapter map couldn't be made — each has its own message for the learner:
 * busy = the AI service was overloaded / rate-limited (try again in a minute);
 * timeout = it took too long (usually a very long chapter: split it);
 * unusable = the reply couldn't be turned into key ideas, even after a retry;
 * unavailable = set-up problem (key, billing) or anything else.
 */
export type ChapterMapFailure = 'busy' | 'timeout' | 'unusable' | 'unavailable'
export type ChapterMapResult = { ok: true; ideas: ChapterIdea[]; questions: ChapterQuestion[] } | { ok: false; error: ChapterMapFailure }

type Attempt = { ok: true; ideas: ChapterIdea[]; questions: ChapterQuestion[] } | { ok: false; error: ChapterMapFailure; retry: boolean; detail: string; status?: number }

/** An API error → reason. Only overload/rate limits/network blips are worth one retry. */
function classify(error: unknown): Omit<Extract<Attempt, { ok: false }>, 'ok'> {
  if (error instanceof Anthropic.APIConnectionTimeoutError) return { error: 'timeout', retry: false, detail: 'timeout' }
  if (error instanceof Anthropic.APIConnectionError) return { error: 'busy', retry: true, detail: 'connection' }
  if (error instanceof Anthropic.APIError) {
    const status = error.status ?? 0
    const message = error.message.toLowerCase()
    if (status === 429) return { error: 'busy', retry: true, detail: 'rate-limit', status }
    if (status >= 500) return { error: 'busy', retry: true, detail: status === 529 ? 'overloaded' : 'server-error', status }
    if (status === 401 || status === 403) return { error: 'unavailable', retry: false, detail: 'auth', status }
    if (message.includes('credit balance') || message.includes('billing')) return { error: 'unavailable', retry: false, detail: 'billing', status }
    if (message.includes('too long') || status === 413) return { error: 'timeout', retry: false, detail: 'input-too-long', status }
    return { error: 'unavailable', retry: false, detail: `api-${status}`, status }
  }
  return { error: 'unavailable', retry: false, detail: 'unknown' }
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export async function generateChapterMap(userId: string, title: string, text: string): Promise<ChapterMapResult> {
  // What gets logged about the chapter: its size and shape only — never the text.
  const shape = { words: wordCount(text), chars: text.length, tableRows: (text.match(/ \| /g) ?? []).length }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    logger.error('generateChapterMap: ANTHROPIC_API_KEY is not set', { reason: 'config' })
    return { ok: false, error: 'unavailable' }
  }
  const client = new Anthropic({ apiKey, maxRetries: 0 })
  const deadline = Date.now() + BUDGET_MS
  let last: Extract<Attempt, { ok: false }> | null = null

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const remaining = deadline - Date.now()
    if (remaining < MIN_ATTEMPT_MS) break
    const result = await attemptOnce(client, userId, title, text, remaining)
    if (result.ok) {
      if (last) logger.warn('generateChapterMap: succeeded on retry', { firstReason: last.detail, ...shape })
      return result
    }
    last = result
    logger.warn('generateChapterMap: attempt failed', { attempt, reason: result.error, detail: result.detail, status: result.status, ...shape })
    if (!result.retry || attempt === ATTEMPTS) break
    await sleep(RETRY_DELAY_MS)
  }

  const reason = last?.error ?? 'timeout'
  logger.error('generateChapterMap: no chapter map', { reason, detail: last?.detail ?? 'no time left', status: last?.status, ...shape })
  return { ok: false, error: reason }
}

async function attemptOnce(client: Anthropic, userId: string, title: string, text: string, timeoutMs: number): Promise<Attempt> {
  const started = Date.now()
  let usage = { input_tokens: 0, output_tokens: 0 }
  let outcome: Attempt = { ok: false, error: 'unavailable', retry: false, detail: 'unknown' }
  try {
    const response = await client.messages.create(
      {
        model: MODEL,
        max_tokens: 3000,
        system: SYSTEM,
        tools: [TOOL],
        tool_choice: { type: 'tool', name: 'chapter_map' },
        messages: [{ role: 'user', content: `Chapter title: ${title}\n\nChapter:\n${text}` }],
      },
      { timeout: timeoutMs },
    )
    usage = response.usage
    const block = response.content.find((b) => b.type === 'tool_use')
    const map = normaliseChapterMap(block && block.type === 'tool_use' ? block.input : null)
    outcome = map
      ? { ok: true, ideas: map.ideas, questions: map.questions }
      : { ok: false, error: 'unusable', retry: true, detail: response.stop_reason === 'max_tokens' ? 'reply-cut-off' : 'unusable-reply' }
  } catch (error) {
    outcome = { ok: false, ...classify(error) }
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
        success: outcome.ok,
        error_message: outcome.ok ? null : `${outcome.error}: ${outcome.detail}`,
      })
      .then(({ error }) => error && logger.warn('generateChapterMap: cost log failed', { code: error.code }))
  }
  return outcome
}
