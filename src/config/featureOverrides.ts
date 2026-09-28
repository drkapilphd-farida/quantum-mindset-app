// Preview-only feature-switch override (Phase 8). Lets a Vercel preview of
// a branch turn on app features for testing, e.g.
//   PREVIEW_APP_FEATURES=onboarding,dayThirtyComparison
// Production never honours it: next.config.ts bakes an EMPTY value into
// production builds, and site.config.ts checks VERCEL_ENV again at runtime.
// Deliberately a leaf module (imported by next.config.ts and site.config.ts).

export const APP_FEATURE_KEYS = ['onboarding', 'dayThirtyComparison', 'mobileDiscipline', 'parentWeeklySummary', 'sharpBrainCertificate'] as const

export type AppFeatureKey = (typeof APP_FEATURE_KEYS)[number]
export type AppFeatures = { readonly [K in AppFeatureKey]: boolean }

/** The override value for a build or runtime: always '' on production. */
export function featureOverrideFor(vercelEnv: string | undefined, raw: string | undefined): string {
  if (vercelEnv === 'production') return ''
  return (raw ?? '').trim()
}

/** Switches ON the listed known features; unknown names are ignored. It can never switch a feature off. */
export function applyFeatureOverrides(base: AppFeatures, raw: string): AppFeatures {
  const requested = new Set(
    raw
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part !== ''),
  )
  const result: Record<AppFeatureKey, boolean> = { ...base }
  for (const key of APP_FEATURE_KEYS) if (requested.has(key)) result[key] = true
  return result
}
