import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Short, video-friendly link to the free Reading Speed Test:
// /test?utm_source=youtube&utm_campaign=… → the test, with every query
// parameter (utm_* tags included) kept so the lead stays attributable.
export function GET(request: NextRequest): NextResponse {
  const target = new URL('/programs/sharp-brain/speed-test', request.url)
  target.search = request.nextUrl.search
  return NextResponse.redirect(target, 307)
}
