import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { YOUTUBE_CHANNEL_URL } from './reviewsPlaylist'
import { buildOrganizationSchema } from '@/lib/seo/organizationSchema'
import { buildPersonSchema } from '@/lib/seo/personSchema'

const RETIRED_PLAYLIST_ID = ['PLRNnGPqfCvKVsAJwGoYJ', 'cAK0Onf5KI9rc'].join('')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.(ts|tsx|json|md)$/.test(name) ? [path] : []
  })
}

describe('YouTube channel link', () => {
  it('points to the official channel', () => {
    expect(YOUTUBE_CHANNEL_URL).toBe('https://www.youtube.com/@innershiftWithDrKapil')
  })

  it('is listed in the Organization and Person JSON-LD sameAs', () => {
    expect(JSON.parse(buildOrganizationSchema()).sameAs).toEqual([YOUTUBE_CHANNEL_URL])
    expect(JSON.parse(buildPersonSchema()).sameAs).toEqual([YOUTUBE_CHANNEL_URL])
  })

  it('leaves no link to the retired Quantum Speed Reading playlist', () => {
    const offenders = sourceFiles('src').filter((file) => readFileSync(file, 'utf8').includes(RETIRED_PLAYLIST_ID))
    expect(offenders).toEqual([])
  })
})
