import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { publicOrigin } from './publicOrigin'

const req = (host: string | null): NextRequest => {
  const r = new NextRequest('https://0.0.0.0:8080/test')
  if (host !== null) r.headers.set('host', host)
  return r
}

describe('publicOrigin', () => {
  it('uses our own domain from the Host header, not the server address', () => {
    expect(publicOrigin(req('www.mindurmind.org.in'))).toBe('https://www.mindurmind.org.in')
    expect(publicOrigin(req('app.mindurmind.org.in'))).toBe('https://app.mindurmind.org.in')
    expect(publicOrigin(req('mindurmind.org.in'))).toBe('https://mindurmind.org.in')
  })
  it('localhost stays http with its port', () => {
    expect(publicOrigin(req('localhost:3000'))).toBe('http://localhost:3000')
  })
  it('never trusts a foreign Host', () => {
    expect(publicOrigin(req('evil.example'))).toBe('https://0.0.0.0:8080')
    expect(publicOrigin(req('mindurmind.org.in.evil.example'))).toBe('https://0.0.0.0:8080')
  })
})
