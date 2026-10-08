'use server'

import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { getFairResults } from '@/features/fair-reading-test/actions'
import { MEMORY_PALACE_EXERCISE_ID, NEXT_DAY_RECALL_EXERCISE_ID } from '@/features/memory-palace/memoryPalace'
import { buildSnapshot, CERT_DAY, CERT_PROGRAM, cleanLearnerName, completedOnIst, generateCode, type CertificateSnapshot } from './certificate'

export type IssuedCertificate = { code: string; learnerName: string; completedOn: string; snapshot: CertificateSnapshot }

export type CertificateState =
  | { status: 'locked' }
  | { status: 'ready'; suggestedName: string }
  | { status: 'issued'; certificate: IssuedCertificate }

const SIGNATURE_BUCKET = 'certificate-assets'
const SIGNATURE_PATH = 'signature.png'

type CertRow = { code: string; learner_name: string; completed_on: string; snapshot: unknown }

const toIssued = (row: CertRow): IssuedCertificate => ({
  code: row.code,
  learnerName: row.learner_name,
  completedOn: row.completed_on,
  snapshot: row.snapshot as CertificateSnapshot,
})

async function signedInUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

async function ownCertificate(userId: string): Promise<CertRow | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('program_certificates')
    .select('code, learner_name, completed_on, snapshot')
    .eq('user_id', userId)
    .eq('program', CERT_PROGRAM)
    .is('revoked_at', null)
    .maybeSingle()
  return data
}

/** Where the signed-in learner stands: certificate locked, ready to issue (name check), or issued. */
export async function getCertificateState(): Promise<CertificateState> {
  const userId = await signedInUserId()
  if (userId === null) return { status: 'locked' }
  const existing = await ownCertificate(userId)
  if (existing) return { status: 'issued', certificate: toIssued(existing) }

  const supabase = await createClient()
  const [{ data: day30 }, { data: profile }] = await Promise.all([
    supabase.from('curriculum_day_completions').select('day').eq('user_id', userId).eq('day', CERT_DAY).maybeSingle(),
    supabase.from('profiles').select('full_name').eq('id', userId).maybeSingle(),
  ])
  if (!day30) return { status: 'locked' }
  return { status: 'ready', suggestedName: cleanLearnerName(profile?.full_name ?? '') ?? '' }
}

/** Memory Palace averages over the whole programme (0–100), null when never attempted. */
async function programmeMemoryScores(userId: string): Promise<{ memory: number | null; retention: number | null }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('exercise_results')
    .select('exercise_id, accuracy_percent')
    .eq('user_id', userId)
    .in('exercise_id', [MEMORY_PALACE_EXERCISE_ID, NEXT_DAY_RECALL_EXERCISE_ID])
  const avg = (id: string): number | null => {
    const values = (data ?? []).filter((r) => r.exercise_id === id && typeof r.accuracy_percent === 'number').map((r) => r.accuracy_percent as number)
    return values.length === 0 ? null : Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }
  return { memory: avg(MEMORY_PALACE_EXERCISE_ID), retention: avg(NEXT_DAY_RECALL_EXERCISE_ID) }
}

/**
 * Issues the certificate once Day 30 is really complete, with the name the
 * learner confirmed. The numbers are frozen now. Calling it again returns the
 * certificate already issued.
 */
export async function issueCertificate(input: unknown): Promise<{ ok: true; certificate: IssuedCertificate } | { ok: false; error: 'invalid-name' | 'locked' | 'unauthenticated' | 'db' }> {
  const parsed = z.object({ name: z.string().max(200) }).safeParse(input)
  const name = parsed.success ? cleanLearnerName(parsed.data.name) : null
  if (name === null) return { ok: false, error: 'invalid-name' }
  const userId = await signedInUserId()
  if (userId === null) return { ok: false, error: 'unauthenticated' }

  const existing = await ownCertificate(userId)
  if (existing) return { ok: true, certificate: toIssued(existing) }

  const supabase = await createClient()
  const { data: completions } = await supabase.from('curriculum_day_completions').select('day, completed_at').eq('user_id', userId)
  const day30 = (completions ?? []).find((c) => c.day === CERT_DAY)
  if (!day30) return { ok: false, error: 'locked' }

  const [results, memory] = await Promise.all([getFairResults(), programmeMemoryScores(userId)])
  const snapshot = buildSnapshot(
    results,
    (completions ?? []).map((c) => c.completed_at),
    memory,
  )

  const service = createServiceClient()
  for (let attempt = 0; attempt < 4; attempt++) {
    const { data, error } = await service
      .from('program_certificates')
      .insert({ user_id: userId, program: CERT_PROGRAM, code: generateCode(randomInt), learner_name: name, completed_on: completedOnIst(day30.completed_at), snapshot })
      .select('code, learner_name, completed_on, snapshot')
      .single()
    if (data) return { ok: true, certificate: toIssued(data) }
    if (error?.code !== '23505') {
      logger.error('issueCertificate: insert failed', { code: error?.code })
      return { ok: false, error: 'db' }
    }
    // Unique clash: either this learner already has one (a double tap) or the random ID was taken.
    const raced = await ownCertificate(userId)
    if (raced) return { ok: true, certificate: toIssued(raced) }
  }
  return { ok: false, error: 'db' }
}

/**
 * The founder's signature, as a data URL — only for a learner who holds a
 * certificate, only to draw it. Never a public file.
 */
export async function getCertificateSignature(): Promise<string | null> {
  const userId = await signedInUserId()
  if (userId === null || (await ownCertificate(userId)) === null) return null
  const { data, error } = await createServiceClient().storage.from(SIGNATURE_BUCKET).download(SIGNATURE_PATH)
  if (error || !data) {
    logger.error('getCertificateSignature: download failed', { message: error?.message })
    return null
  }
  const bytes = Buffer.from(await data.arrayBuffer())
  return `data:image/png;base64,${bytes.toString('base64')}`
}
