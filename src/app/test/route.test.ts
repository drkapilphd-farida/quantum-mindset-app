import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('/test short link', () => {
  it('redirects to the Reading Speed Test and keeps UTM tags', () => {
    const res = GET(new NextRequest('https://www.example.org/test?utm_source=youtube&utm_campaign=reel-12'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://www.example.org/programs/sharp-brain/speed-test?utm_source=youtube&utm_campaign=reel-12')
  })

  it('works without parameters', () => {
    const res = GET(new NextRequest('https://www.example.org/test'))
    expect(res.headers.get('location')).toBe('https://www.example.org/programs/sharp-brain/speed-test')
  })
})
