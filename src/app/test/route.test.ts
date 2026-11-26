import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('/test short link', () => {
  it('redirects to the Reading & Memory Test and keeps UTM tags', () => {
    const res = GET(new NextRequest('https://www.example.org/test?utm_source=youtube&utm_campaign=reel-12'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('https://www.example.org/reading-memory-test?utm_source=youtube&utm_campaign=reel-12')
  })

  it('works without parameters', () => {
    const res = GET(new NextRequest('https://www.example.org/test'))
    expect(res.headers.get('location')).toBe('https://www.example.org/reading-memory-test')
  })

  it('on Cloud Run, redirects to the address the visitor used, not 0.0.0.0:8080', () => {
    const req = new NextRequest('https://0.0.0.0:8080/test?utm_source=ig')
    req.headers.set('host', 'www.mindurmind.org.in')
    expect(GET(req).headers.get('location')).toBe('https://www.mindurmind.org.in/reading-memory-test?utm_source=ig')
  })
})
