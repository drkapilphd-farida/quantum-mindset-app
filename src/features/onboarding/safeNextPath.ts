/** Only same-site paths are allowed as a post-onboarding destination. */
export function safeNextPath(value: string | undefined, fallback = '/dashboard'): string {
  if (value === undefined || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}
