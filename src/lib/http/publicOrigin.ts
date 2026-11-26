import type { NextRequest } from 'next/server'

// On Cloud Run (Nov 2026) a route handler's request.url carries the server's
// own address (https://0.0.0.0:8080), not the site the visitor typed, so a
// redirect built from it sends people nowhere. The Host header is the real
// address. Only our own domains (and localhost) are trusted; anything else
// falls back to request.url, so a forged Host can never redirect off-site.

const OWN_HOST = /^(?:[a-z0-9-]+\.)*mindurmind\.org\.in$/i
const LOCAL_HOST = /^(?:localhost|127\.0\.0\.1)(?::\d{1,5})?$/i

/** "https://www.mindurmind.org.in" — the origin the visitor actually used. */
export function publicOrigin(request: NextRequest): string {
  const host = request.headers.get('host')?.trim() ?? ''
  if (OWN_HOST.test(host)) return `https://${host.toLowerCase()}`
  if (LOCAL_HOST.test(host)) return `http://${host.toLowerCase()}`
  return new URL(request.url).origin
}
