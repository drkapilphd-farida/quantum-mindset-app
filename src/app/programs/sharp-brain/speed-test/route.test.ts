import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('old Reading Speed Test address', () => {
  it('forwards to the Reading & Memory Test, keeping UTM tags and dropping ?mode=live', () => {
    const res = GET(new NextRequest('https://www.example.org/programs/sharp-brain/speed-test?mode=live&utm_source=yt&utm_campaign=reel'))
    expect(res.status).toBe(308)
    expect(res.headers.get('location')).toBe('https://www.example.org/reading-memory-test?utm_source=yt&utm_campaign=reel')
  })
  it('works without parameters', () => {
    expect(GET(new NextRequest('https://www.example.org/programs/sharp-brain/speed-test')).headers.get('location')).toBe('https://www.example.org/reading-memory-test')
  })
})
