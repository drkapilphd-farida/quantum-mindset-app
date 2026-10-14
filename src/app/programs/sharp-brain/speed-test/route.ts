import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The Reading Speed Test was replaced by the Free Reading & Memory Test
// (Oct 2026). Old links, videos and ads keep working: this address (and its
// ?mode=live demo) forwards there with every utm_* tag kept. Permanent, so
// search engines move to the new page.
export function GET(request: NextRequest): NextResponse {
  const target = new URL('/reading-memory-test', request.url)
  const params = new URLSearchParams(request.nextUrl.search)
  params.delete('mode')
  target.search = params.toString()
  return NextResponse.redirect(target, 308)
}
