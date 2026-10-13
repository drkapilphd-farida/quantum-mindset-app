import { numberIcon, numberPicture, type NumberList } from '../numberCode'

// One number picture: the pair of digits, its picture and its word.
export function NumberPictureCard({ list, pair, size = 56, showNumber = true, showWord = true }: { list: NumberList; pair: string; size?: number; showNumber?: boolean; showWord?: boolean }): React.JSX.Element {
  const pic = numberPicture(list, pair)
  return (
    <span className="flex flex-col items-center gap-1" data-number-picture={pair}>
      {showNumber && <span className="font-heading text-lg font-bold text-primary tabular-nums">{pair}</span>}
      {/* eslint-disable-next-line @next/next/no-img-element -- small bundled SVG */}
      <img src={numberIcon(pic.icon)} alt={showWord ? '' : pic.word} width={size} height={size} />
      {showWord && <span className="text-sm font-semibold text-foreground">{pic.word}</span>}
    </span>
  )
}
