import { ICE_ICON, itemIcon } from '../content'

// One Memory Studio picture (Twemoji, bundled) with an optional label and
// number. `ice` adds the snowflake that marks pegs 11–20.
export function StudioPicture({
  id,
  label,
  number,
  ice = false,
  size = 56,
  showLabel = true,
}: {
  id: string
  label: string
  number?: number
  ice?: boolean
  size?: number
  showLabel?: boolean
}): React.JSX.Element {
  return (
    <figure className="flex min-w-0 flex-col items-center gap-1" data-studio-picture={id}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- small bundled SVG */}
        <img src={itemIcon(id)} alt={showLabel ? '' : label} width={size} height={size} className={ice ? 'opacity-80 saturate-50' : undefined} />
        {ice && (
          // eslint-disable-next-line @next/next/no-img-element -- small bundled SVG
          <img src={ICE_ICON} alt="" width={size * 0.45} height={size * 0.45} className="absolute -top-1 -right-1" />
        )}
        {number !== undefined && (
          <span className="absolute -bottom-1 -left-1 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums">{number}</span>
        )}
      </div>
      {showLabel && <figcaption className="max-w-full text-center text-sm font-semibold break-words text-foreground">{label}</figcaption>}
    </figure>
  )
}
