import type { ReactNode } from 'react'
import { PORTAL } from './palette'
import { MaskFace } from './pickups'
import ui from './warped.module.css'

// The crates of the time travel platformer (Warped, named in code only), drawn from the game's crate
// renders as boxes seen from a little above and to the left: the lit lid, the front face, the shaded
// right side, a dark frame round every face and the big X brace across each wooden one, and each kind's
// own marking on the front.
//   wood        the plain crate: orange brown planks, a dark frame, an X brace on every face
//   question    a yellow green question mark outlined in red over the brace
//   bounce      a light pine frame of upright slats with the fruit showing between them
//   arrow       a yellow green up arrow outlined in red over the brace
//   tnt         red with two gold bands and the label in yellow capitals with a dark red edge (its
//               countdown digits replace the label when lit)
//   nitro       green with pale green bands and the label in pale green stencil capitals
//   metal       plain riveted steel: only a body slam opens it
//   mask        the carved mask painted on the planks, its four feathers fanned
//   checkpoint  riveted steel with a big yellow C outlined in red
// viewBox 0 0 100 100: the front face is x 8 to 72, y 30 to 94.

export type CrateKind = 'wood' | 'question' | 'bounce' | 'arrow' | 'tnt' | 'nitro' | 'metal' | 'mask' | 'checkpoint'

interface Faces {
  front: string
  lid: string
  side: string
  frame: string
  /** The X brace across the lid, the front and the side; none on steel, TNT and nitro. */
  brace: string | null
}

const WOOD: Faces = { front: PORTAL.PLANK, lid: PORTAL.PLANK_LIT, side: PORTAL.PLANK_DARK, frame: PORTAL.BAND, brace: PORTAL.BAND }
const STEEL: Faces = { front: PORTAL.METAL, lid: PORTAL.PLATINUM, side: PORTAL.METAL_DARK, frame: PORTAL.METAL_DARK, brace: null }

const FACES: Record<CrateKind, Faces> = {
  wood: WOOD,
  question: WOOD,
  bounce: { front: PORTAL.PLANK_DARK, lid: PORTAL.PINE, side: PORTAL.PLANK, frame: PORTAL.PINE, brace: PORTAL.PLANK },
  arrow: WOOD,
  tnt: { front: PORTAL.TNT, lid: PORTAL.FRUIT_RED, side: PORTAL.TNT_DARK, frame: PORTAL.TNT_DARK, brace: null },
  nitro: { front: PORTAL.NITRO, lid: PORTAL.NITRO_BAND, side: PORTAL.NITRO_DARK, frame: PORTAL.NITRO_DARK, brace: null },
  metal: STEEL,
  mask: WOOD,
  checkpoint: STEEL,
}

// The rivets round a steel face, inside its frame.
const RIVETS: ReadonlyArray<readonly [number, number]> = [
  [15, 37], [40, 37], [65, 37], [15, 62], [65, 62], [15, 87], [40, 87], [65, 87],
]

const STEEL_RIVETS = (
  <g fill={PORTAL.PLATINUM} stroke={PORTAL.METAL_DARK} strokeWidth="1">
    {RIVETS.map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />
    ))}
  </g>
)

/** A painted mark: yellow green with a red outline, as the game paints its question marks and arrows. */
const markPaint = { fill: PORTAL.MARK, stroke: PORTAL.MARK_EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const, paintOrder: 'stroke' as const }

const MARK: Record<CrateKind, (label: string) => ReactNode> = {
  wood: () => null,
  question: () => (
    <path
      d="M28 52 Q28 38 41 38 Q54 38 54 50 Q54 57 46 61 Q43 63 43 67 V70 H36 V64 Q36 56 43 52 Q47 50 47 48 Q47 44 41 44 Q35 44 35 52 Z M36 74 H43 V82 H36 Z"
      {...markPaint}
    />
  ),
  bounce: () => (
    <>
      {[24, 40, 56].map((x) => (
        <circle key={x} cx={x + 4} cy="64" r="8" fill="url(#npw-fruit)" stroke={PORTAL.VOID} strokeWidth="1" />
      ))}
      {[16, 30, 44, 58].map((x) => (
        <rect key={x} x={x} y="35" width="6" height="54" fill={PORTAL.PINE} stroke={PORTAL.VOID} strokeWidth="1.2" />
      ))}
    </>
  ),
  arrow: () => <path d="M40 38 L60 60 H48 V86 H32 V60 H20 Z" {...markPaint} />,
  tnt: (label) => (
    <>
      <rect x="13" y="40" width="54" height="6" fill={PORTAL.GOLD} />
      <rect x="13" y="78" width="54" height="6" fill={PORTAL.GOLD} />
      <text x="40" y="71" textAnchor="middle" className={ui.chunk} fontSize="22" fill={PORTAL.GOLD} stroke={PORTAL.TNT_DARK} strokeWidth="3" paintOrder="stroke">
        {label}
      </text>
    </>
  ),
  nitro: (label) => (
    <>
      <rect x="13" y="38" width="54" height="5" fill={PORTAL.NITRO_BAND} />
      <rect x="13" y="81" width="54" height="5" fill={PORTAL.NITRO_BAND} />
      <text x="40" y="69" textAnchor="middle" className={ui.chunk} fontSize="15" fill={PORTAL.NITRO_BAND} stroke={PORTAL.NITRO_DARK} strokeWidth="3" paintOrder="stroke">
        {label}
      </text>
    </>
  ),
  metal: () => STEEL_RIVETS,
  mask: () => (
    <g transform="translate(22 32) scale(0.36)">
      <MaskFace feathers={4} />
    </g>
  ),
  checkpoint: () => (
    <>
      {STEEL_RIVETS}
      <path d="M54 50 A16 16 0 1 0 54 76" fill="none" stroke={PORTAL.MARK_EDGE} strokeWidth="13" strokeLinecap="round" />
      <path d="M54 50 A16 16 0 1 0 54 76" fill="none" stroke={PORTAL.TITLE} strokeWidth="8" strokeLinecap="round" />
    </>
  ),
}

/** The X brace on a face: a dark board with a lit edge, corner to corner both ways. */
function Brace({ d, tone }: { d: string; tone: string }) {
  return (
    <>
      <path d={d} stroke={tone} strokeWidth="6" strokeLinecap="square" />
      <path d={d} stroke={PORTAL.PLANK_LIT} strokeWidth="1.2" opacity="0.5" />
    </>
  )
}

const FRONT_X = 'M14 36 L66 88 M66 36 L14 88'
const LID_X = 'M14 28 L82 16 M30 16 L66 28'
const SIDE_X = 'M76 34 L84 74 M84 26 L76 82'

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
      <path d="M8 30 L24 14 H88 L72 30 Z" fill={faces.lid} stroke={PORTAL.VOID} strokeWidth="2.4" strokeLinejoin="round" />
      {faces.brace && <Brace d={LID_X} tone={faces.brace} />}
      <path d="M16 26 L27 18 H80 L69 26 Z" fill="none" stroke={faces.frame} strokeWidth="2.4" opacity="0.9" />
      <path d="M72 30 L88 14 V78 L72 94 Z" fill={faces.side} stroke={PORTAL.VOID} strokeWidth="2.4" strokeLinejoin="round" />
      {faces.brace && <Brace d={SIDE_X} tone={PORTAL.CRATE_EDGE} />}
      <path d="M76 34 L84 26 V74 L76 82 Z" fill="none" stroke={PORTAL.CRATE_EDGE} strokeWidth="2" opacity="0.7" />
      <rect x="8" y="30" width="64" height="64" fill={faces.front} stroke={PORTAL.VOID} strokeWidth="2.4" />
      {faces.brace && <Brace d={FRONT_X} tone={faces.brace} />}
      <rect x="11" y="33" width="58" height="58" fill="none" stroke={faces.frame} strokeWidth="5" />
      {MARK[kind](label)}
      {lit && (
        <g>
          <rect x="14" y="44" width="52" height="34" rx="4" fill={PORTAL.VOID} opacity="0.85" />
          <text x="40" y="73" textAnchor="middle" className={ui.chunk} fontSize="30" fill={PORTAL.GOLD}>
            {countdown}
          </text>
        </g>
      )}
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
