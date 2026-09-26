import { z } from 'zod'

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required'),
  // Not read by any metadata/canonical/OG/sitemap/robots/checkout code
  // path anymore — those all use the hardcoded SITE_URL constant (see
  // src/lib/seo/siteUrl.ts) specifically so a misconfigured env var here
  // can never again leak into production output. This refinement exists
  // purely as a loud, build/boot-time guard against the regression that
  // shipped `http://localhost:3000` as canonical/og:url in production:
  // Vercel's NEXT_PUBLIC_APP_URL had drifted to that exact literal
  // string, which passes a plain `.url()` check, so nothing ever caught
  // it. Fail the boot instead of silently continuing if that happens
  // again.
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .refine((url) => process.env.NODE_ENV !== 'production' || !url.includes('localhost'), {
      message: 'NEXT_PUBLIC_APP_URL must not be a localhost URL in production — set it to https://www.mindurmind.org.in in Vercel',
    }),
})

export type Env = z.infer<typeof serverSchema>

const parsed = serverSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(`\n\nMissing or invalid environment variables:\n${issues}\n`)
}

export const env: Env = parsed.data
