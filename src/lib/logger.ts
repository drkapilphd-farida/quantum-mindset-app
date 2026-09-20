/* eslint-disable no-console */
import * as Sentry from '@sentry/nextjs'

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

type LogContext = Record<string, unknown>

type LogEntry = {
  level: LogLevel
  message: string
  timestamp: string
  service: 'web'
  [key: string]: unknown
}

const isDev = process.env.NODE_ENV === 'development'

function buildEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'web',
    ...context,
  }
}

// Every logger.error call now also reports to Sentry (see the
// "Pre-Launch Audit Fix Pass" task, Phase 1) — this was the exact gap
// the audit called a blocker: a failed payment webhook or thrown server
// action previously went only to console output, invisible unless
// someone was actively tailing Vercel's live log stream at that moment.
// Silently no-ops when NEXT_PUBLIC_SENTRY_DSN isn't configured (Sentry's
// own documented behavior), so this is safe to ship immediately.
//
// If `context.error` is a real Error instance, it's reported via
// captureException (real stack trace, groups correctly in Sentry). Every
// existing call site in this codebase passes error context as an
// already-extracted `.message` string (e.g. `{ error: err.message }`),
// so captureMessage is the realistic default — still fully searchable
// and alertable in Sentry, just without a stack trace. Not sent in dev,
// matching this file's own existing isDev split, to keep local
// development noise out of Sentry.
function reportErrorToSentry(message: string, context?: LogContext): void {
  if (isDev) return
  const possibleError = context?.error
  if (possibleError instanceof Error) {
    Sentry.captureException(possibleError, { extra: { message, ...context } })
  } else if (context !== undefined) {
    Sentry.captureMessage(message, { level: 'error', extra: context })
  } else {
    Sentry.captureMessage(message, { level: 'error' })
  }
}

export const logger = {
  error(message: string, context?: LogContext): void {
    if (isDev) {
      console.error(`[ERROR] ${message}`, context ?? '')
    } else {
      console.error(JSON.stringify(buildEntry('error', message, context)))
    }
    reportErrorToSentry(message, context)
  },

  warn(message: string, context?: LogContext): void {
    if (isDev) {
      console.warn(`[WARN] ${message}`, context ?? '')
    } else {
      console.warn(JSON.stringify(buildEntry('warn', message, context)))
    }
  },

  info(message: string, context?: LogContext): void {
    if (isDev) {
      console.info(`[INFO] ${message}`, context ?? '')
    } else {
      console.info(JSON.stringify(buildEntry('info', message, context)))
    }
  },

  debug(message: string, context?: LogContext): void {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, context ?? '')
    }
  },
}
