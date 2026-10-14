import { redirect } from 'next/navigation'

// The Reading Speed Test was replaced by the Free Reading & Memory Test
// (Oct 2026). Old links, videos and ads keep working: this address (and its
// ?mode=live demo) forwards there with every utm_* tag kept.
type OldTestPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function OldSpeedTestPage({ searchParams }: OldTestPageProps): Promise<never> {
  const params = await searchParams
  const keep = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (key === 'mode' || value === undefined) continue
    for (const v of Array.isArray(value) ? value : [value]) keep.append(key, v)
  }
  const query = keep.toString()
  redirect(`/reading-memory-test${query ? `?${query}` : ''}`)
}
