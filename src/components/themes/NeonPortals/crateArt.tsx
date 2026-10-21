import type { ReactNode } from 'react'
import { PORTAL } from './palette'

// The crates of the time travel platformer (Warped, named in code only), drawn as boxes seen from a
// little above and to the left, the way its camera sees them on the path: the lit lid, the front face,
// the shaded right side, a dark frame round every face, corner nails, and each kind's own marking on the
// front.
//   wood        the plain crate, planks inside the frame
//   question    a gold question mark painted on the planks
//   bounce      steel bands and a coiled spring mark
//   arrow       steel corners and a red up arrow
//   tnt         red with the label in yellow (its countdown digits replace it when lit)
//   nitro       sickly green with the label in black, glowing from the cracks
//   metal       riveted steel with an X brace: only a body slam opens it
//   mask        a carved mask face burnt into the planks
//   checkpoint  the letter C ring painted in white
// viewBox 0 0 100 100: the front face is x 8 to 72, y 30 to 94.

export type CrateKind = 'wood' | 'question' | 'bounce' | 'arrow' | 'tnt' | 'nitro' | 'metal' | 'mask' | 'checkpoint'

interface Faces {
  front: string
  lid: string
  side: string
  frame: string
  inner: string
}

const WOOD: Faces = { front: PORTAL.PLANK, lid: PORTAL.PLANK_LIT, side: PORTAL.PLANK_DARK, frame: PORTAL.BAND, inner: PORTAL.PLANK }

const FACES: Record<CrateKind, Faces> = {
  wood: WOOD,
  question: WOOD,
  bounce: { ...WOOD, frame: PORTAL.METAL_DARK },
  arrow: { ...WOOD, frame: PORTAL.METAL_DARK },
  tnt: { front: PORTAL.TNT, lid: PORTAL.ORANGE, side: PORTAL.TNT_DARK, frame: PORTAL.TNT_DARK, inner: PORTAL.TNT },
  nitro: { front: PORTAL.NITRO, lid: '#9bff8a', side: PORTAL.NITRO_DARK, frame: PORTAL.NITRO_DARK, inner: PORTAL.NITRO },
  metal: { front: PORTAL.METAL, lid: PORTAL.PLATINUM, side: PORTAL.METAL_DARK, frame: PORTAL.METAL_DARK, inner: PORTAL.METAL },
  mask: WOOD,
  checkpoint: WOOD,
}

const PLANKS = (
  <g stroke={PORTAL.PLANK_DARK} strokeWidth="1.2" opacity="0.8">
    <path d="M17 52 H63 M17 72 H63" />
    <path d="M24 41 Q30 43 36 41 M44 61 Q52 63 58 60 M22 82 Q30 80 38 83" fill="none" opacity="0.6" />
  </g>
)

const STEEL_CORNERS = (
  <g fill={PORTAL.METAL} stroke={PORTAL.METAL_DARK} strokeWidth="1">
    <path d="M8 30 H24 L8 46 Z M72 30 H56 L72 46 Z M8 94 H24 L8 78 Z M72 94 H56 L72 78 Z" />
  </g>
)

const MARK: Record<CrateKind, (label: string) => ReactNode> = {
  wood: () => PLANKS,
  question: () => (
    <>
      {PLANKS}
      <path
        d="M30 50 Q30 40 40 40 Q51 40 51 49 Q51 55 44 58 Q41 60 41 65 V68 H37 V63 Q37 56 43 53 Q46 51 46 49 Q46 45 40 45 Q35 45 35 50 Z M37 72 H42 V78 H37 Z"
        fill={PORTAL.GOLD}
        stroke={PORTAL.BAND}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </>
  ),
  bounce: () => (
    <>
      {PLANKS}
      {STEEL_CORNERS}
      <path d="M26 80 L54 74 L26 68 L54 62 L26 56 L54 50 L26 44" fill="none" stroke={PORTAL.METAL_DARK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  arrow: () => (
    <>
      {PLANKS}
      {STEEL_CORNERS}
      <path d="M40 38 L58 58 H47 V84 H33 V58 H22 Z" fill={PORTAL.TNT} stroke={PORTAL.TNT_DARK} strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  tnt: (label) => (
    <>
      <text x="40" y="69" textAnchor="middle" fontFamily="'Arial Black', system-ui, sans-serif" fontSize="19" fontWeight="900" fill={PORTAL.GOLD} stroke={PORTAL.TNT_DARK} strokeWidth="1.2" paintOrder="stroke">
        {label}
      </text>
    </>
  ),
  nitro: (label) => (
    <>
      <path d="M18 40 L28 48 L22 56 M60 42 L52 50 L58 58 M30 86 L36 78 L44 84" fill="none" stroke={PORTAL.NITRO_DARK} strokeWidth="1.6" />
      <text x="40" y="69" textAnchor="middle" fontFamily="'Arial Black', system-ui, sans-serif" fontSize="14" fontWeight="900" fill={PORTAL.VOID}>
        {label}
      </text>
    </>
  ),
  metal: () => (
    <>
      <path d="M14 36 L66 88 M66 36 L14 88" stroke={PORTAL.METAL_DARK} strokeWidth="5" />
      <path d="M14 36 L66 88 M66 36 L14 88" stroke={PORTAL.PLATINUM} strokeWidth="1.4" opacity="0.7" />
      {[
        [14, 36],
        [66, 36],
        [14, 88],
        [66, 88],
        [40, 62],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill={PORTAL.PLATINUM} stroke={PORTAL.METAL_DARK} strokeWidth="1" />
      ))}
    </>
  ),
  mask: () => (
    <>
      {PLANKS}
      <path d="M30 42 Q40 38 50 42 L51 58 Q50 72 44 80 Q40 82 36 80 Q30 72 29 58 Z" fill={PORTAL.MASK_WOOD} stroke={PORTAL.BAND} strokeWidth="1.6" />
      <ellipse cx="35.5" cy="55" rx="3.4" ry="4" fill={PORTAL.WHITE} />
      <ellipse cx="44.5" cy="55" rx="3.4" ry="4" fill={PORTAL.WHITE} />
      <circle cx="36" cy="56" r="1.6" fill={PORTAL.VOID} />
      <circle cx="44" cy="56" r="1.6" fill={PORTAL.VOID} />
      <path d="M33 67 Q40 73 47 67 Q45 75 40 75 Q35 75 33 67 Z" fill={PORTAL.MASK_LIP} />
      <path d="M32 42 L28 34 M40 39 L40 31 M48 42 L52 34" stroke={PORTAL.FRUIT_RED} strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  checkpoint: () => (
    <>
      {PLANKS}
      <path d="M52 48 A15 15 0 1 0 52 76" fill="none" stroke={PORTAL.WHITE} strokeWidth="8" strokeLinecap="round" />
      <path d="M52 48 A15 15 0 1 0 52 76" fill="none" stroke={PORTAL.BAND} strokeWidth="1.2" opacity="0.5" />
    </>
  ),
}

const NAILS = [
  [12, 34],
  [68, 34],
  [12, 90],
  [68, 90],
] as const

interface CrateArtProps {
  kind: CrateKind
  /** The word on a TNT or nitro crate, from the labels. */
  label?: string
  /** Replaces the TNT label with its countdown digit while it is lit. */
  countdown?: number
  className?: string
}

export function CrateArt({ kind, label = '', countdown, className }: CrateArtProps) {
  const faces = FACES[kind]
  const lit = kind === 'tnt' && countdown !== undefined

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path d="M8 30 L24 14 H88 L72 30 Z" fill={faces.lid} stroke={PORTAL.VOID} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 26 L27 18 H80 L69 26 Z" fill="none" stroke={faces.frame} strokeWidth="2.2" opacity="0.8" />
      <path d="M72 30 L88 14 V78 L72 94 Z" fill={faces.side} stroke={PORTAL.VOID} strokeWidth="2" strokeLinejoin="round" />
      <path d="M76 34 L84 26 V74 L76 82 Z" fill="none" stroke={faces.frame} strokeWidth="2" opacity="0.7" />
      <rect x="8" y="30" width="64" height="64" fill={faces.front} stroke={PORTAL.VOID} strokeWidth="2" />
      <rect x="13" y="35" width="54" height="54" fill={faces.inner} stroke={faces.frame} strokeWidth="4" />
      {MARK[kind](label)}
      {lit && (
        <g>
          <rect x="14" y="44" width="52" height="34" rx="4" fill={PORTAL.VOID} opacity="0.85" />
          <text x="40" y="73" textAnchor="middle" fontFamily="'Arial Black', system-ui, sans-serif" fontSize="30" fontWeight="900" fill={PORTAL.GOLD}>
            {countdown}
          </text>
        </g>
      )}
      {NAILS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill={PORTAL.VOID} opacity="0.6" />
      ))}
      <path d="M10 32 H70" stroke={PORTAL.WHITE} strokeWidth="1.2" opacity="0.35" />
    </svg>
  )
}

/** One broken plank, for the burst. */
export function Plank({ className, tone = PORTAL.PLANK }: { className?: string; tone?: string }) {
  return (
    <svg viewBox="0 0 40 12" className={className} aria-hidden="true" focusable="false">
      <path d="M1 3 L34 1 L39 6 L33 11 L2 10 Z" fill={tone} stroke={PORTAL.VOID} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6 6 H28" stroke={PORTAL.BAND} strokeWidth="1" opacity="0.6" />
    </svg>
  )
}
