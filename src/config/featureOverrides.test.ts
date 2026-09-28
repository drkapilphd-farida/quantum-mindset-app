import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyFeatureOverrides, featureOverrideFor, type AppFeatures } from './featureOverrides'

const OFF: AppFeatures = { onboarding: false, dayThirtyComparison: false, mobileDiscipline: false, parentWeeklySummary: false, sharpBrainCertificate: false }

describe('preview-only feature override', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('production ignores the override completely', () => {
    expect(featureOverrideFor('production', 'onboarding,dayThirtyComparison')).toBe('')
    expect(applyFeatureOverrides(OFF, featureOverrideFor('production', 'onboarding,dayThirtyComparison'))).toEqual(OFF)
  })

  it('a preview build switches on only the listed, known features', () => {
    const features = applyFeatureOverrides(OFF, featureOverrideFor('preview', ' onboarding , dayThirtyComparison,notAFeature '))
    expect(features).toEqual({ ...OFF, onboarding: true, dayThirtyComparison: true })
  })

  it('can never switch a feature off', () => {
    expect(applyFeatureOverrides({ ...OFF, onboarding: true }, '')).toEqual({ ...OFF, onboarding: true })
  })

  it('next.config bakes an empty override into production builds even when PREVIEW_APP_FEATURES is set', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    // next.config's own production guard requires the real site URL.
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://www.mindurmind.org.in')
    vi.stubEnv('PREVIEW_APP_FEATURES', 'onboarding,dayThirtyComparison,mobileDiscipline')
    const config = (await import('../../next.config')).default as { env?: Record<string, string> }
    expect(config.env?.['NEXT_PUBLIC_APP_FEATURE_OVERRIDES']).toBe('')
  })

  it('next.config passes the override through for a preview build', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('PREVIEW_APP_FEATURES', 'onboarding')
    const config = (await import('../../next.config')).default as { env?: Record<string, string> }
    expect(config.env?.['NEXT_PUBLIC_APP_FEATURE_OVERRIDES']).toBe('onboarding')
  })

  it('site.config keeps every feature off on production at runtime, even if an override value leaked in', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_APP_FEATURE_OVERRIDES', 'onboarding,dayThirtyComparison')
    const { appFeatures } = await import('./site.config')
    expect(appFeatures).toEqual(OFF)
  })

  it('site.config applies the override outside production', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('NEXT_PUBLIC_APP_FEATURE_OVERRIDES', 'mobileDiscipline')
    const { appFeatures } = await import('./site.config')
    expect(appFeatures).toEqual({ ...OFF, mobileDiscipline: true })
  })
})
