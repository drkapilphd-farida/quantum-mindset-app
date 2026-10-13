import Link from 'next/link'
import { IllustratedFace } from '@/features/memory-check/components/IllustratedFace'
import { itemIcon } from '../content'
import { STUDIO_FACES } from '../nameFace'

const ICON: Record<string, string> = {
  'story-rocket': itemIcon('rocket'),
  'peg-shape': itemIcon('shape-swan'),
  palace: '/memory-palace/icons/1-01.svg',
  'my-palaces': itemIcon('tent'),
  chapter: itemIcon('telescope'),
  number: '/memory-studio/numbers/1f3b2.svg',
  keyword: '/memory-studio/numbers/1f4a1.svg',
  acronym: '/memory-studio/numbers/1f4dd.svg',
}

// A method tile (play design): the picture on its skill colour (memory =
// violet), the name, and the learner's level — or "New" before the first try.
export function MethodCard({ href, icon, title, description, levelLabel }: { href: string; icon: keyof typeof ICON | 'name-face'; title: string; description: string; levelLabel: string }): React.JSX.Element {
  return (
    <Link href={href} className="play-card flex min-h-40 flex-col gap-2 p-3" data-method-card={href}>
      <span className="flex size-14 items-center justify-center rounded-2xl" style={{ background: 'color-mix(in srgb, var(--skill-memory, #7c3aed) 22%, transparent)' }}>
        {icon === 'name-face' ? (
          <IllustratedFace face={STUDIO_FACES[4]!.spec} colorIndex={1} size={40} label="" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- small bundled SVG
          <img src={ICON[icon]} alt="" width={40} height={40} />
        )}
      </span>
      <span className="text-base leading-tight font-bold text-foreground">{title}</span>
      <span className="line-clamp-2 text-xs text-muted-foreground">{description}</span>
      <span className="mt-auto self-start rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground" data-method-level={levelLabel}>
        {levelLabel}
      </span>
    </Link>
  )
}
