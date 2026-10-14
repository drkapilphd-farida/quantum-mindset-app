import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

export type TestLeadStatus = 'new' | 'contacted' | 'enrolled'

export type TestLeadRow = {
  id: string
  createdAt: string
  firstName: string | null
  whatsappNumber: string
  lang: string
  testKind: string
  effectiveWpm: number
  wpm: number
  comprehensionPercent: number
  retentionCorrect: number | null
  memoryCorrect: number | null
  valid: boolean
  profileType: string | null
  utmSource: string | null
  utmCampaign: string | null
  offerExpiresAt: string | null
  offerUsed: boolean
  status: TestLeadStatus
}

/** Every free-test lead, newest first, with that number's ₹1,000 offer (admin only — service role). */
export async function getTestLeads(): Promise<TestLeadRow[]> {
  const client = createServiceClient()
  const [{ data: rows, error }, { data: offers }] = await Promise.all([
    client
      .from('speed_test_results')
      .select('id, created_at, first_name, whatsapp_number, lang, test_kind, effective_wpm, wpm, comprehension_percent, retention_correct, memory_correct, status, profile_type, utm_source, utm_campaign, lead_status')
      .order('created_at', { ascending: false })
      .limit(1000),
    client.from('sharp_brain_offers').select('whatsapp_number, expires_at, redeemed_at').eq('kind', 'test1000'),
  ])
  if (error) {
    logger.error('getTestLeads: read failed', { code: error.code })
    return []
  }
  const offerFor = new Map((offers ?? []).map((o) => [o.whatsapp_number, o]))
  return (rows ?? []).map((r) => {
    const offer = offerFor.get(r.whatsapp_number)
    return {
      id: r.id,
      createdAt: r.created_at,
      firstName: r.first_name,
      whatsappNumber: r.whatsapp_number,
      lang: r.lang,
      testKind: r.test_kind,
      effectiveWpm: r.effective_wpm,
      wpm: r.wpm,
      comprehensionPercent: r.comprehension_percent,
      retentionCorrect: r.retention_correct,
      memoryCorrect: r.memory_correct,
      valid: r.status === 'valid',
      profileType: r.profile_type,
      utmSource: r.utm_source,
      utmCampaign: r.utm_campaign,
      offerExpiresAt: offer?.expires_at ?? null,
      offerUsed: offer?.redeemed_at != null,
      status: r.lead_status as TestLeadStatus,
    }
  })
}
