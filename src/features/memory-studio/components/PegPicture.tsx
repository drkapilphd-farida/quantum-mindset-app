import { pegFor, pegName, type PegSet, type StudioLang } from '../content'
import { StudioPicture } from './StudioPicture'

/** Peg n (1–20) of a set; 11–20 carry the ice mark. */
export function PegPicture({ set, n, lang, size = 56, showLabel = true }: { set: PegSet; n: number; lang: StudioLang; size?: number; showLabel?: boolean }): React.JSX.Element {
  const { base, ice } = pegFor(set, n)
  return <StudioPicture id={base.id} label={pegName(base, lang)} number={n} ice={ice} size={size} showLabel={showLabel} />
}
