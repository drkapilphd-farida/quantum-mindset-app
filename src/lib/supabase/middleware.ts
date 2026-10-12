import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'
import type { SupabaseClient, User } from '@supabase/supabase-js'

type SessionResult = {
  response: NextResponse
  user: User | null
  // Threaded out so the single-device session gate (activeSessionGate.ts)
  // can read/write `active_sessions` without standing up a second,
  // redundant Supabase client in the same middleware pass.
  supabase: SupabaseClient<Database>
}

export async function updateSession(request: NextRequest): Promise<SessionResult> {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables in middleware')
  }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Speed fix 2 (Oct 2026): verify the session token here with the project's
  // public signing key (ES256) instead of asking the auth server on every
  // click. getClaims still refreshes an expired session (writing the new
  // cookies above) and checks the signature and expiry; older HS256 tokens
  // fall back to the auth server automatically.
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  const user = claims?.sub ? ({ id: claims.sub, email: claims.email } as User) : null

  return { response, user, supabase }
}
