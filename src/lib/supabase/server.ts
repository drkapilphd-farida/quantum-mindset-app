import { cache } from 'react'
import { createServerClient } from '@supabase/ssr'
import { AuthSessionMissingError, type User, type UserResponse } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

type ServerClient = ReturnType<typeof createServerClient<Database>>

export async function createClient(): Promise<ServerClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Minimal safe fallback for build environments where Supabase env vars
    // are not present (e.g., static CI builds). Returning a mock client
    // avoids throwing during Next.js page-data collection while preserving
    // production behaviour when real envs are provided.
    type MockQuery = {
      select: (..._args: unknown[]) => MockQuery
      eq: (..._args: unknown[]) => MockQuery
      order: (..._args: unknown[]) => MockQuery
      limit: (..._args: unknown[]) => MockQuery
      single: () => Promise<{ data: null; error: null }>
      insert: () => Promise<{ data: null; error: null }>
      update: () => Promise<{ data: null; error: null }>
      delete: () => Promise<{ data: null; error: null }>
    }

    const chainable: MockQuery = {
      select() {
        return chainable
      },
      eq() {
        return chainable
      },
      order() {
        return chainable
      },
      limit() {
        return chainable
      },
      single: async () => ({ data: null, error: null }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }

    const mockClient = {
      from: () => chainable,
      rpc: async () => ({ data: null, error: null }),
    }

    return mockClient as unknown as ReturnType<typeof createServerClient<Database>>
  }

  const client = await createRawClient(url, key)
  // Speed fix 2 (Oct 2026): "who is signed in?" is answered from the signed
  // session token, verified on this server with the project's public signing
  // key (ES256) — no network trip — and only once per request. A call with an
  // explicit token still asks the auth server.
  const askAuthServer = client.auth.getUser.bind(client.auth)
  client.auth.getUser = ((jwt?: string) => (jwt ? askAuthServer(jwt) : getVerifiedUser())) as typeof client.auth.getUser
  return client
}

/**
 * The signed-in user for this request, from the verified session token.
 * Memoised per request (React cache). Tokens signed the older way (HS256)
 * fall back to the auth server inside getClaims, so security is unchanged:
 * the token's signature and expiry are always checked.
 */
const getVerifiedUser = cache(async (): Promise<UserResponse> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const client = await createRawClient(url, key)
  const { data, error } = await client.auth.getClaims()
  const claims = data?.claims
  if (error || !claims?.sub) return { data: { user: null }, error: error ?? new AuthSessionMissingError() }
  const user = {
    id: claims.sub,
    email: claims.email,
    phone: claims.phone,
    role: claims.role,
    aud: Array.isArray(claims.aud) ? (claims.aud[0] ?? 'authenticated') : (claims.aud ?? 'authenticated'),
    app_metadata: claims.app_metadata ?? {},
    user_metadata: claims.user_metadata ?? {},
    is_anonymous: claims.is_anonymous,
    created_at: '',
  } as User
  return { data: { user }, error: null }
})

async function createRawClient(url: string, key: string): Promise<ServerClient> {
  const cookieStore = await cookies()

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Called from a Server Component — cookies are read-only. Safe to ignore.
        }
      },
    },
    // Supabase-js calls the global fetch, which Next.js patches to apply its
    // own Data Cache by default — without this, a request moments after a
    // write can silently get a cached pre-write response. Every query from
    // this client must be genuinely live, never cached.
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
  })
}
