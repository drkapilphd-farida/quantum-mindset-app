import { createHash } from 'node:crypto'

/**
 * A stable UUID from any text key (UUID v5-style, SHA-256 based). Used as a
 * table row's primary key so the database itself refuses a second row for
 * the same key — e.g. one row per Razorpay payment ID, one reminder per
 * registration and type — without a schema change.
 */
export function idFromKey(key: string): string {
  const bytes = createHash('sha256').update(`mindurmind:${key}`).digest().subarray(0, 16)
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x50 // version 5
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80 // RFC 4122 variant
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** Postgres unique-violation code (a row with that key already exists). */
export const UNIQUE_VIOLATION = '23505'
