import { useId } from 'react'

export type SkillIconName = 'telepathy' | 'intuition' | 'cosmic' | 'coherence'

// The four skill icons, drawn as line art in a gold → aqua gradient.
// Decorative (the card heading names the skill).
export function SkillIcon({ name, className = 'size-14' }: { name: SkillIconName; className?: string }): React.JSX.Element {
  const id = useId().replace(/:/g, '')
  const stroke = `url(#tw-g-${id})`

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id={`tw-g-${id}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F7E2A6" />
          <stop offset="0.55" stopColor="#E8C46E" />
          <stop offset="1" stopColor="#8FE3D6" />
        </linearGradient>
      </defs>
      {name === 'telepathy' && (
        <g stroke={stroke} strokeWidth="2">
          {/* Two minds with waves travelling between them */}
          <path d="M8 40c0-8 5-14 12-14s10 5 10 10c0 3-2 4-2 6v4h-6v6H12v-6c-3-1-4-3-4-6Z" />
          <path d="M56 40c0-8-5-14-12-14s-10 5-10 10c0 3 2 4 2 6v4h6v6h10v-6c3-1 4-3 4-6Z" opacity="0.85" />
          <path d="M26 18c4-3 8-3 12 0" />
          <path d="M22 13c6-5 14-5 20 0" opacity="0.7" />
          <path d="M18 8c8-6 20-6 28 0" opacity="0.45" />
          <circle cx="20" cy="34" r="1.6" fill="#E8C46E" stroke="none" />
          <circle cx="44" cy="34" r="1.6" fill="#8FE3D6" stroke="none" />
        </g>
      )}
      {name === 'intuition' && (
        <g stroke={stroke} strokeWidth="2">
          {/* The inner eye, with rays of insight */}
          <path d="M6 36c7-10 16-15 26-15s19 5 26 15c-7 10-16 15-26 15S13 46 6 36Z" />
          <circle cx="32" cy="36" r="8" />
          <circle cx="32" cy="36" r="3" fill="#E8C46E" stroke="none" />
          <path d="M32 6v7M20 9l3 6M44 9l-3 6M11 16l5 4M53 16l-5 4" opacity="0.8" />
        </g>
      )}
      {name === 'cosmic' && (
        <g stroke={stroke} strokeWidth="2">
          {/* A radiant centre with orbits — prana meeting universal energy */}
          <circle cx="32" cy="32" r="7" />
          <path d="M32 21v-4M32 47v-4M21 32h-4M47 32h-4" opacity="0.8" />
          <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(-25 32 32)" opacity="0.9" />
          <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(35 32 32)" opacity="0.6" />
          <circle cx="54" cy="21" r="2.4" fill="#8FE3D6" stroke="none" />
          <circle cx="12" cy="18" r="1.8" fill="#E8C46E" stroke="none" />
          <circle cx="32" cy="32" r="2.5" fill="#F7E2A6" stroke="none" />
        </g>
      )}
      {name === 'coherence' && (
        <g stroke={stroke} strokeWidth="2">
          {/* A heart with one calm rhythm running through it */}
          <path d="M32 54S8 40 8 23c0-7 5-12 11-12 6 0 10 4 13 9 3-5 7-9 13-9 6 0 11 5 11 12 0 17-24 31-24 31Z" />
          <path d="M4 32h10l4-8 6 16 5-12 3 4h28" opacity="0.95" />
        </g>
      )}
    </svg>
  )
}
