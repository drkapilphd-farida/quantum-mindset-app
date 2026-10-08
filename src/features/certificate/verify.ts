import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { normalizeCode, publicName } from './certificate'

export type PublicCertificate = { code: string; name: string; completedOn: string }

/**
 * For the public verification page: first name + last initial, date and ID —
 * never the full name, scores, email or anything else.
 */
export async function findPublicCertificate(rawCode: string): Promise<PublicCertificate | null> {
  const code = normalizeCode(rawCode)
  if (code === null) return null
  const { data, error } = await createServiceClient()
    .from('program_certificates')
    .select('code, learner_name, completed_on')
    .eq('code', code)
    .is('revoked_at', null)
    .maybeSingle()
  if (error) {
    logger.error('findPublicCertificate: read failed', { code: error.code })
    return null
  }
  return data ? { code: data.code, name: publicName(data.learner_name), completedOn: data.completed_on } : null
}
