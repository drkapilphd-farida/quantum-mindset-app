'use client'

import { useAppT } from '@/lib/app-i18n/client'

/** 1–3 stars for a round: 90% or more = 3, 60% or more = 2, else 1. */
export function starsFor(correct: number, total: number): 1 | 2 | 3 {
  if (total <= 0) return 1
  const r = correct / total
  return r >= 0.9 ? 3 : r >= 0.6 ? 2 : 1
}

export function Stars({ count, size = 40 }: { count: 1 | 2 | 3; size?: number }): React.JSX.Element {
  const t = useAppT()
  return (
    <div className="flex items-end justify-center gap-1" role="img" aria-label={t('training.play.stars', { n: count })} data-stars={count}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={i === 1 ? size * 1.2 : size}
          height={i === 1 ? size * 1.2 : size}
          className="motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:fill-mode-both"
          style={{ animationDelay: `${i * 140}ms`, animationDuration: '420ms' }}
          aria-hidden="true"
        >
          <path
            d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z"
            fill={i < count ? 'var(--play-star, #f59e0b)' : 'none'}
            stroke={i < count ? 'var(--play-star, #f59e0b)' : 'var(--border)'}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}
