'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { clampLevel } from '@/features/exercise-core/levelEngine'
import {
  decodeObjects,
  MEMORY_PALACE_EXERCISE_ID,
  NEXT_DAY_RECALL_EXERCISE_ID,
  nextDayRecallStatus,
  type DelayLabel,
  type Palace,
} from '../memoryPalace'

export type PendingPalace = Palace & { hoursSince: number; label: DelayLabel; days: number }

const WEEK_MS = 7 * 24 * 3_600_000

/**
 * The learner's most recent palace that is due for its next-day recall
 * (built 8 h – 7 days ago, not yet recalled the next day), or null. Only
 * the latest palace is ever asked, so old ones never pile up.
 */
export async function getPendingPalace(): Promise<PendingPalace | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const since = new Date(Date.now() - WEEK_MS - 3_600_000).toISOString()
    const { data: built, error } = await supabase
      .from('exercise_results')
      .select('details, level_end, played_at')
      .eq('user_id', user.id)
      .eq('exercise_id', MEMORY_PALACE_EXERCISE_ID)
      .gte('played_at', since)
      .order('played_at', { ascending: false })
      .limit(1)
    if (error) {
      logger.error('getPendingPalace: read failed', { code: error.code })
      return null
    }
    const latest = built?.[0]
    if (!latest) return null
    const details = (latest.details ?? {}) as Record<string, unknown>
    const palaceId = typeof details.palaceId === 'string' ? details.palaceId : null
    const objects = decodeObjects(details.objects)
    if (palaceId === null || objects === null) return null

    const status = nextDayRecallStatus((Date.now() - new Date(latest.played_at).getTime()) / 3_600_000)
    if (!status.due) return null

    const { count } = await supabase
      .from('exercise_results')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('exercise_id', NEXT_DAY_RECALL_EXERCISE_ID)
      .eq('details->>palaceId', palaceId)
    if ((count ?? 0) > 0) return null

    return {
      palaceId,
      objects,
      level: clampLevel(typeof details.level === 'number' ? details.level : (latest.level_end ?? 1)),
      hoursSince: Math.floor((Date.now() - new Date(latest.played_at).getTime()) / 3_600_000),
      label: status.label,
      days: status.days,
    }
  } catch (error) {
    logger.error('getPendingPalace: unexpected error', { error })
    return null
  }
}

export type MemoryScores = { memory: number | null; retention: number | null }

/** Average immediate recall (Memory) and next-day recall (Retention), last 7 days, 0–100; null when not attempted. */
export async function getMemoryScores(): Promise<MemoryScores> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { memory: null, retention: null }
    const { data } = await supabase
      .from('exercise_results')
      .select('exercise_id, accuracy_percent')
      .eq('user_id', user.id)
      .in('exercise_id', [MEMORY_PALACE_EXERCISE_ID, NEXT_DAY_RECALL_EXERCISE_ID])
      .gte('played_at', new Date(Date.now() - WEEK_MS).toISOString())
    const avg = (id: string): number | null => {
      const values = (data ?? []).filter((r) => r.exercise_id === id && typeof r.accuracy_percent === 'number').map((r) => r.accuracy_percent as number)
      return values.length === 0 ? null : Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    }
    return { memory: avg(MEMORY_PALACE_EXERCISE_ID), retention: avg(NEXT_DAY_RECALL_EXERCISE_ID) }
  } catch (error) {
    logger.error('getMemoryScores: unexpected error', { error })
    return { memory: null, retention: null }
  }
}
