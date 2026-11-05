import type { Metadata } from 'next'
import { absoluteUrl } from './siteUrl'

// Phase 4.3 — hreflang. The site opens in English; each page's Hindi
// version is /hi (homepage) or ?lang=hi (workshop pages). x-default = English.
// Merged into a page's metadata, keeping its own canonical.
export function withLanguageAlternates(metadata: Metadata, enPath: string, hiPath: string = `${enPath}?lang=hi`): Metadata {
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: { en: absoluteUrl(enPath), hi: absoluteUrl(hiPath), 'x-default': absoluteUrl(enPath) },
    },
  }
}
