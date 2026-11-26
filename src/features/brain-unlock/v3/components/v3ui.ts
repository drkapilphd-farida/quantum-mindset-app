// Shared look for Brain Test v3 screens: big, thumb-friendly buttons.

export const bigBtn =
  'flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-lg font-bold text-primary-foreground shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-transform active:translate-y-0.5 disabled:opacity-50'

export const waBtn =
  'flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#25d366] px-5 text-xl font-bold text-[#0b2e17] shadow-[0_4px_0_#128c4b] transition-transform active:translate-y-0.5'

/** A short vibration on phones that support it (never on desktop, never required). */
export function buzz(ms: number | readonly number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(typeof ms === 'number' ? ms : [...ms])
  } catch {
    // haptics are a nice-to-have
  }
}
