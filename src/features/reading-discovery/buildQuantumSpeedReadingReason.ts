// Sprint-2.6 FIX-05 — "make it feel like the natural next step... Never
// advertise. Never oversell." One short, real sentence tying Quantum
// Speed Reading™ directly to *this* session's own real biggest
// improvement (`buildReadingProfileHighlights`) — never a generic pitch.
const QSR_REASON_BY_IMPROVEMENT: Record<string, string> = {
  'Read Bigger Chunks': 'Sharp Brain™ trains your eyes to take in more words at once.',
  'Improve Reading Rhythm': 'Sharp Brain™ builds a steady, natural reading rhythm.',
  'Reduce Eye Stops': 'Sharp Brain™ trains fewer, longer eye movements across the line.',
  'Read Longer Comfortably': 'Sharp Brain™ builds real stamina for longer, uninterrupted reading.',
  'Improve Understanding': 'Sharp Brain™ pairs speed with comprehension, together.',
}

const DEFAULT_QSR_REASON = 'Sharp Brain™ builds on exactly where you are today.'

export function buildQuantumSpeedReadingReason(biggestImprovement: string): string {
  return QSR_REASON_BY_IMPROVEMENT[biggestImprovement] ?? DEFAULT_QSR_REASON
}
