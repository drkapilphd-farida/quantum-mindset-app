// Neutral hero picture until the founder uploads a real photo/video: a
// student's head and shoulders with a soft headband and calm signal lines.
// No device shape or brand, no real person.
export function HeadbandIllustration({ label }: { label: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className="block aspect-[4/3] w-full bg-[var(--muted)]">
      <defs>
        <linearGradient id="sch-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--skill-focus)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--skill-memory)" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#sch-bg)" />
      {/* signal lines */}
      <g fill="none" strokeWidth="4" strokeLinecap="round">
        <path d="M24 70 q16 -22 32 0 t32 0 t32 0" stroke="var(--skill-focus)" />
        <path d="M24 110 q12 -14 24 0 t24 0 t24 0 t24 0" stroke="var(--skill-memory)" opacity="0.85" />
        <path d="M280 70 q16 -22 32 0 t32 0 t32 0" stroke="var(--skill-reading)" />
        <path d="M280 110 q12 -14 24 0 t24 0 t24 0 t24 0" stroke="var(--skill-calm)" opacity="0.85" />
      </g>
      {/* shoulders */}
      <path d="M110 300 q0 -70 90 -78 q90 8 90 78 z" fill="var(--skill-focus)" opacity="0.85" />
      <path d="M176 224 l24 26 l24 -26" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinejoin="round" />
      {/* head */}
      <ellipse cx="200" cy="150" rx="56" ry="64" fill="#e8b98f" />
      <path d="M144 138 q4 -66 58 -66 q54 2 54 66 q-10 -30 -54 -34 q-46 4 -58 34 z" fill="#2d2a3e" />
      {/* headband */}
      <path d="M146 124 q54 -36 108 0" fill="none" stroke="var(--play-outline)" strokeWidth="13" strokeLinecap="round" />
      <path d="M146 124 q54 -36 108 0" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="200" cy="99" r="5" fill="var(--skill-calm)" />
      {/* face */}
      <circle cx="181" cy="156" r="4.5" fill="#2d2a3e" />
      <circle cx="219" cy="156" r="4.5" fill="#2d2a3e" />
      <path d="M186 182 q14 11 28 0" fill="none" stroke="#2d2a3e" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
