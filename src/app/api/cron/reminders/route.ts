import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { sendDueReminders } from '@/features/reminders/sendDueReminders'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Called every 15 minutes by the Supabase scheduler (pg_cron + pg_net — the
// Vercel Hobby plan only allows daily jobs). Authorised by its own secret,
// REMINDERS_CRON_SECRET, sent as "Authorization: Bearer …". Returns counts only.
function authorised(request: Request): boolean {
  const secret = process.env.REMINDERS_CRON_SECRET
  const header = request.headers.get('authorization') ?? ''
  if (!secret || !header.startsWith('Bearer ')) return false
  const given = Buffer.from(header.slice('Bearer '.length))
  const expected = Buffer.from(secret)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

async function handle(request: Request): Promise<NextResponse> {
  if (!authorised(request)) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  return NextResponse.json(await sendDueReminders())
}

export const GET = handle
export const POST = handle
