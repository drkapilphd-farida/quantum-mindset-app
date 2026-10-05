import type { MessageKey } from '@/lib/app-i18n/translate'

// Supabase Auth error codes → a translated, plain-language message key.
// Anything unexpected shows the generic message (never Supabase's English).
export function authErrorKey(code: string | undefined): MessageKey {
  switch (code) {
    case 'invalid_credentials':
      return 'auth.errors.invalidCredentials'
    case 'email_not_confirmed':
      return 'auth.errors.emailNotConfirmed'
    case 'user_already_exists':
    case 'email_exists':
      return 'auth.errors.userExists'
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'auth.errors.tooMany'
    case 'weak_password':
      return 'auth.validation.passwordShort'
    default:
      return 'auth.errors.generic'
  }
}
