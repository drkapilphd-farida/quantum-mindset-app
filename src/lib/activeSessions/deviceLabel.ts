// Single-Device Login Enforcement™ (see the "Pre-Launch Audit Fix Pass"
// task, Phase 7) — a short, human-readable label derived from the
// User-Agent header, e.g. "Chrome on iPhone" or "Safari on Mac". Never
// stores or returns the raw UA string, and reads nothing else about the
// request (no IP, no precise fingerprint) — purely descriptive, and
// never part of the actual session-matching logic (that's session_id
// alone, in activeSessionGate.ts).
function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Edg/')) return 'Edge'
  if (userAgent.includes('OPR/') || userAgent.includes('Opera')) return 'Opera'
  if (userAgent.includes('Chrome/') && !userAgent.includes('Chromium')) return 'Chrome'
  if (userAgent.includes('CriOS/')) return 'Chrome'
  if (userAgent.includes('FxiOS/') || userAgent.includes('Firefox/')) return 'Firefox'
  if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) return 'Safari'
  return 'a browser'
}

function detectDevice(userAgent: string): string {
  if (userAgent.includes('iPhone')) return 'iPhone'
  if (userAgent.includes('iPad')) return 'iPad'
  if (userAgent.includes('Android')) return userAgent.includes('Mobile') ? 'Android phone' : 'Android tablet'
  if (userAgent.includes('Macintosh')) return 'Mac'
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Linux')) return 'Linux'
  return 'a device'
}

export function deriveDeviceLabel(userAgent: string | null): string {
  if (!userAgent) return 'Unknown device'
  return `${detectBrowser(userAgent)} on ${detectDevice(userAgent)}`
}
