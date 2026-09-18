// Manual user provisioning — grants a real user real access via the
// app's own real mechanisms (public.subscriptions + getIsPaidUser(), see
// src/lib/subscription/getIsPaidUser.ts), not a side-channel flag
// nothing else in the app would check. Mirrors the exact pattern the
// Razorpay masterclass webhook already uses (see
// src/app/api/razorpay/masterclass-webhook/route.ts): invite via the
// Admin API → profiles row (auto-created by the handle_new_user()
// trigger, phone patched in explicitly since the trigger only populates
// email) → upsert into public.subscriptions.
//
// IMPORTANT — expiry is NOT enforced automatically anywhere in this
// codebase. getIsPaidUser() only checks `status IN ('active','trialing')`
// — it never reads current_period_end, and no cron/scheduled job exists
// that flips a subscription to 'expired' once that date passes. Setting
// --expires records the date for reference only; you (or a future
// scheduled job) must manually change the row's status on/after that
// date for access to actually stop. This is a known, confirmed gap in
// the app, not an oversight in this script.
//
// Usage:
//   node scripts/admin/provisionUser.mjs \
//     --email user@example.com \
//     --phone "+15551234567" \
//     --plan qsr-masterclass \
//     --expires 2026-11-18
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the
// environment (both already present in .env.local for local runs).

import { createClient } from '@supabase/supabase-js'

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '')
    out[key] = args[i + 1]
  }
  return out
}

async function main() {
  const { email, phone, plan, expires, redirectTo } = parseArgs()

  if (!email || !plan) {
    console.error('Usage: node provisionUser.mjs --email <email> --plan <plan-key> [--phone <phone>] [--expires <YYYY-MM-DD>] [--redirectTo <url>]')
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // 1. Look up the plan first — fail fast on a typo'd --plan rather than
  //    creating a user and then discovering the plan doesn't exist.
  const { data: planRow, error: planError } = await supabase
    .from('plans')
    .select('id, key, billing_interval')
    .eq('key', plan)
    .maybeSingle()

  if (planError || !planRow) {
    console.error(`Plan "${plan}" not found in public.plans. Aborting before creating any user.`)
    process.exit(1)
  }

  // 2. Refuse to double-invite an existing user — generateLink's own
  //    "invite" behavior on a duplicate email is not something to rely
  //    on silently, so check explicitly first via the Admin REST API
  //    (the JS SDK's listUsers() has no email-filter parameter).
  const lookupResponse = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?filter=email.eq.${encodeURIComponent(email)}`,
    { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } },
  )
  const lookupJson = await lookupResponse.json()
  if (Array.isArray(lookupJson.users) && lookupJson.users.length > 0) {
    console.error(`A user with email ${email} already exists (id: ${lookupJson.users[0].id}). Not re-inviting — edit this script to skip straight to the subscription upsert if you want to grant this existing user access instead.`)
    process.exit(1)
  }

  // 3. Create the auth user via a real Supabase invite link — the user
  //    sets their own password on first click; nothing sensitive is
  //    generated or transmitted by this script.
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      data: phone ? { phone } : undefined,
      redirectTo: redirectTo ?? 'https://app.mindurmind.org.in/welcome/choose-method',
    },
  })

  if (linkError || !linkData?.user) {
    console.error(`Failed to invite ${email}:`, linkError?.message ?? 'unknown error')
    console.error('If this is "user already exists", look the user up in the Supabase dashboard and skip straight to the subscription upsert below by editing this script.')
    process.exit(1)
  }

  const userId = linkData.user.id
  console.log(`Invited ${email} — user_id: ${userId}`)
  console.log(`Real invite link (one-time use — share it securely, e.g. via WhatsApp, not a public channel):`)
  console.log(linkData.properties.action_link)

  // 4. Patch profiles.phone explicitly — handle_new_user() populates
  //    email from the new auth.users row automatically, but not phone
  //    (see the masterclass-entitlement migration's own doc comment).
  if (phone) {
    const { error: phoneError } = await supabase.from('profiles').update({ phone }).eq('id', userId)
    if (phoneError) {
      console.error(`Warning: failed to set profiles.phone for ${userId}:`, phoneError.message)
    }
  }

  // 5. Grant access via the real paywall mechanism.
  const nowIso = new Date().toISOString()
  const expiresIso = expires ? new Date(`${expires}T23:59:59Z`).toISOString() : null

  const { error: subError } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_id: planRow.id,
      status: 'active',
      current_period_start: nowIso,
      current_period_end: expiresIso,
    },
    { onConflict: 'user_id,plan_id' },
  )

  if (subError) {
    console.error(`Failed to grant subscription for ${userId}:`, subError.message)
    process.exit(1)
  }

  console.log(`Granted "${plan}" access to ${email}, status=active${expiresIso ? `, current_period_end=${expiresIso}` : ''}.`)
  if (expiresIso) {
    console.log('Reminder: this date is NOT auto-enforced — flip this row\'s status to "expired" manually on/after that date, or build a scheduled job to do it (see this file\'s own header comment).')
  }
}

main()
