import Link from 'next/link'
import { IllustratedFace } from '@/features/memory-check/components/IllustratedFace'
import { itemIcon } from '../content'
import { STUDIO_FACES } from '../nameFace'

const ICON: Record<string, string> = { 'story-rocket': itemIcon('rocket'), 'peg-shape': itemIcon('shape-swan'), palace: '/memory-palace/icons/1-01.svg', 'my-palaces': itemIcon('tent'), chapter: itemIcon('telescope'), number: '/memory-studio/numbers/1f3b2.svg', keyword: '/memory-studio/numbers/1f4a1.svg', acronym: '/memory-studio/numbers/1f4dd.svg' }

export function MethodCard({ href, icon, title, description }: { href: string; icon: keyof typeof ICON | 'name-face'; title: string; description: string }): React.JSX.Element {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4" data-method-card={href}>
      {icon === 'name-face' ? (
        <IllustratedFace face={STUDIO_FACES[4]!.spec} colorIndex={1} size={44} label="" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- small bundled SVG
        <img src={ICON[icon]} alt="" width={44} height={44} className="shrink-0" />
      )}
      <span className="min-w-0">
        <span className="block text-base font-semibold text-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
    </Link>
  )
}
