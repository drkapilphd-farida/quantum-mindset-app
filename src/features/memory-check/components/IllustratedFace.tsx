import type { FaceSpec, Skin } from '../content'

// A made-up person, drawn by the app in the same flat style as the Memory
// Palace pictures — never a photo of a real person. The colours belong to
// the drawing itself, so they stay the same in light and dark mode.

const SKIN: Record<Skin, { base: string; shade: string }> = {
  light: { base: '#EDC19C', shade: '#D9A47C' },
  wheat: { base: '#DDA676', shade: '#C68B5B' },
  medium: { base: '#C2874F', shade: '#A86F3D' },
  brown: { base: '#9A6239', shade: '#80502D' },
  deep: { base: '#6C4226', shade: '#57341D' },
}
const BLACK = '#22201F'
const GREY = '#B9B6B1'
const SHIRTS = ['#3F7CAC', '#C2505C', '#4C9A6A', '#8A63B8', '#D99A2B']

export function IllustratedFace({ face, colorIndex = 0, size = 128, label }: { face: FaceSpec; colorIndex?: number; size?: number; label: string }): React.JSX.Element {
  const skin = SKIN[face.skin]
  const grey = face.hair.startsWith('grey')
  const hair = grey ? GREY : BLACK
  const child = face.age === 'child'
  const ry = child ? 31 : 35
  const cy = child ? 66 : 62
  const top = cy - ry
  const eyeY = cy - 2
  const shirt = SHIRTS[colorIndex % SHIRTS.length]

  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} {...(label === '' ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label })} className="shrink-0">
      <circle cx="60" cy="70" r="58" fill="#EEF0F4" />
      {/* hair that falls behind the head */}
      {face.hair === 'shoulder' && <path d={`M27 ${cy - 6} Q24 ${cy + 40} 34 ${cy + 46} L86 ${cy + 46} Q96 ${cy + 40} 93 ${cy - 6} Z`} fill={hair} />}
      {face.hair === 'plait' && <path d={`M84 ${cy} Q98 ${cy + 30} 90 ${cy + 62} Q86 ${cy + 66} 83 ${cy + 60} Q90 ${cy + 30} 78 ${cy + 4} Z`} fill={hair} />}
      {(face.hair === 'bun' || face.hair === 'grey-bun') && <circle cx="60" cy={top - 4} r="12" fill={hair} />}
      {/* neck and shoulders */}
      <rect x="51" y={cy + ry - 8} width="18" height="16" fill={skin.shade} />
      <path d={`M18 140 Q20 ${cy + ry + 8} 60 ${cy + ry + 6} Q100 ${cy + ry + 8} 102 140 Z`} fill={shirt} />
      {/* ears + earrings */}
      <ellipse cx="30" cy={eyeY + 4} rx="5" ry="8" fill={skin.shade} />
      <ellipse cx="90" cy={eyeY + 4} rx="5" ry="8" fill={skin.shade} />
      {face.earrings && (
        <>
          <circle cx="30" cy={eyeY + 15} r="2.6" fill="#E2B33C" />
          <circle cx="90" cy={eyeY + 15} r="2.6" fill="#E2B33C" />
        </>
      )}
      {/* head */}
      <ellipse cx="60" cy={cy} rx="30" ry={ry} fill={skin.base} />
      {/* hair on top */}
      {(face.hair === 'short' || face.hair === 'grey-short') && <path d={`M30 ${cy - 4} Q30 ${top - 6} 60 ${top - 6} Q90 ${top - 6} 90 ${cy - 4} Q86 ${top + 12} 60 ${top + 10} Q36 ${top + 12} 30 ${cy - 4} Z`} fill={hair} />}
      {face.hair === 'curly' &&
        [30, 40, 50, 60, 70, 80, 90].map((x, i) => <circle key={x} cx={x} cy={top + (i === 0 || i === 6 ? 14 : 2) + (i % 2) * 3} r="9" fill={hair} />)}
      {face.hair === 'spiky' && <path d={`M30 ${cy - 6} L33 ${top - 2} L41 ${top + 6} L46 ${top - 8} L54 ${top + 4} L60 ${top - 10} L66 ${top + 4} L74 ${top - 8} L79 ${top + 6} L87 ${top - 2} L90 ${cy - 6} Q60 ${top + 14} 30 ${cy - 6} Z`} fill={hair} />}
      {(face.hair === 'plait' || face.hair === 'bun' || face.hair === 'grey-bun' || face.hair === 'shoulder') && (
        <path d={`M29 ${cy + 2} Q28 ${top - 4} 60 ${top - 4} Q92 ${top - 4} 91 ${cy + 2} Q86 ${top + 10} 62 ${top + 8} L60 ${top + 2} L58 ${top + 8} Q34 ${top + 10} 29 ${cy + 2} Z`} fill={hair} />
      )}
      {/* eyebrows */}
      <path d={`M40 ${eyeY - 9} Q46 ${eyeY - 12} 52 ${eyeY - 9}`} stroke={grey ? '#8E8A85' : BLACK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d={`M68 ${eyeY - 9} Q74 ${eyeY - 12} 80 ${eyeY - 9}`} stroke={grey ? '#8E8A85' : BLACK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="46" cy={eyeY} rx="3.2" ry={child ? 4 : 3.4} fill={BLACK} />
      <ellipse cx="74" cy={eyeY} rx="3.2" ry={child ? 4 : 3.4} fill={BLACK} />
      {face.age === 'older' && (
        <>
          <path d={`M36 ${eyeY + 2} l-3 2`} stroke={skin.shade} strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M84 ${eyeY + 2} l3 2`} stroke={skin.shade} strokeWidth="1.6" strokeLinecap="round" />
          <path d={`M47 ${top + 20} Q60 ${top + 17} 73 ${top + 20}`} stroke={skin.shade} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* glasses */}
      {face.glasses === 'round' && (
        <g stroke="#3A3A3A" strokeWidth="2" fill="none">
          <circle cx="46" cy={eyeY} r="8" />
          <circle cx="74" cy={eyeY} r="8" />
          <path d={`M54 ${eyeY} H66`} />
        </g>
      )}
      {face.glasses === 'square' && (
        <g stroke="#3A3A3A" strokeWidth="2" fill="none">
          <rect x="37" y={eyeY - 6} width="18" height="12" rx="2" />
          <rect x="65" y={eyeY - 6} width="18" height="12" rx="2" />
          <path d={`M55 ${eyeY} H65`} />
        </g>
      )}
      {/* bindi */}
      {face.bindi && <circle cx="60" cy={eyeY - 13} r="2.6" fill="#C8283C" />}
      {/* nose */}
      <path d={`M60 ${eyeY + 4} Q57 ${eyeY + 13} 60 ${eyeY + 14} Q63 ${eyeY + 14} 64 ${eyeY + 12}`} stroke={skin.shade} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* beard / moustache */}
      {face.facialHair === 'beard' && <path d={`M34 ${cy + 8} Q38 ${cy + ry + 4} 60 ${cy + ry + 4} Q82 ${cy + ry + 4} 86 ${cy + 8} Q80 ${cy + 26} 70 ${cy + 26} Q60 ${cy + 22} 50 ${cy + 26} Q40 ${cy + 26} 34 ${cy + 8} Z`} fill={hair} />}
      {(face.facialHair === 'moustache' || face.facialHair === 'grey-moustache' || face.facialHair === 'beard') && (
        <path d={`M48 ${eyeY + 20} Q54 ${eyeY + 16} 60 ${eyeY + 19} Q66 ${eyeY + 16} 72 ${eyeY + 20} Q66 ${eyeY + 22} 60 ${eyeY + 21} Q54 ${eyeY + 22} 48 ${eyeY + 20} Z`} fill={face.facialHair === 'grey-moustache' ? GREY : hair} />
      )}
      {/* mouth */}
      <path d={`M51 ${eyeY + 25} Q60 ${eyeY + 31} 69 ${eyeY + 25}`} stroke="#7A3B2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}
