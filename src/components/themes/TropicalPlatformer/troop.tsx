import type { ReactNode } from 'react'
import { COLORS as C, TROOP, type Ape } from './palette'
import { Shadow } from './props'

// His troop, our own, drawn as the props are (props.tsx): rendered volumes, a dark edge, lit from the upper
// right. Besides him (character.tsx) and the lemur (partner.tsx): a tall orangutan with wide cheek pads in a
// blue neckerchief, a little tamarin with a long white moustache in a purple vest, and a huge silverback with a
// crest and a silver back in a green sash. Each is side on and faces right, his feet on 0 0, and carries his
// own tool and instrument (research/2026-11-25-deep-dk64 §2: five apes, five colours, five tools, five
// instruments). His near arm (`<ape>-arm`) turns at the shoulder and his body (`<ape>-body`) about his feet,
// for the places that make him play, cheer or bob. Mangoes in the troop's colours are the fruit each gathers.
// None of them is a character, name or look of the game it evokes.

const EDGE = C.shadow
const LINE = { stroke: EDGE, strokeWidth: 3, strokeLinejoin: 'round' as const }

type Fur = readonly [dark: string, mid: string, light: string]

interface ApeLook {
  /** His height in place units; the drawing is made at 200. */
  height: number
  fur: Fur
  face: string
  /** How far his long arms reach, a share of the drawing's arm. */
  reach: number
  /** His own marks: the orangutan's cheek pads, the tamarin's moustache, the silverback's crest and silver back. */
  mark: 'cheeks' | 'moustache' | 'crest'
  /** What he wears in his colour. */
  wear: 'neckerchief' | 'vest' | 'sash'
}

export type FriendApe = Exclude<Ape, 'him' | 'lemur'>

const LOOK: Record<FriendApe, ApeLook> = {
  orangutan: { height: 210, fur: ['#6a2a0e', '#b8541e', '#e8944e'], face: '#d8a07e', reach: 1.25, mark: 'cheeks', wear: 'neckerchief' },
  tamarin: { height: 104, fur: ['#141010', '#3a3230', '#6a5e58'], face: '#8a6a5a', reach: 0.95, mark: 'moustache', wear: 'vest' },
  silverback: { height: 250, fur: ['#0e0c12', '#2a2834', '#4c4a5c'], face: '#7a6e76', reach: 1.1, mark: 'crest', wear: 'sash' },
}

/** The shoulder his near arm turns at, in the drawing at 200 tall (from his feet). */
export const SHOULDER = { x: 22, y: -128 } as const

/** His near arm's transform turned `deg` at the shoulder (negative swings it forward, positive back and up over
 *  his head for a cheer). */
export const armTurn = (deg: number): string => `translate(${SHOULDER.x} ${SHOULDER.y}) rotate(${deg.toFixed(1)})`

/** His arm's length from the shoulder to the middle of his hand in the drawing at 200 tall, before his reach. */
const ARM = 104

/** A long arm from the shoulder on 0 0, hanging a little forward to the hand at the end of its `length`: the
 *  shoulder's ball, the arm tapering to the wrist, the big hand. */
const armPath = (length: number): string =>
  `M-11 -4 Q0 -14 11 -4 Q12 ${r1(length * 0.45)} 9 ${r1(length - 10)} L-3 ${r1(length - 8)} Q-10 ${r1(length * 0.45)} -11 -4 Z`

const r1 = (n: number): string => n.toFixed(1)

/** How tall an ape stands: the place units of his height. */
export const heightOf = (ape: FriendApe): number => LOOK[ape].height

function Head({ look }: { look: ApeLook }) {
  const [dark, mid, light] = look.fur
  return (
    <g transform="translate(44 -162)">
      {look.mark === 'crest' && <path d="M-30 -20 Q-16 -56 12 -46 Q28 -34 30 -12 Z" fill={mid} {...LINE} />}
      {look.mark === 'cheeks' && <ellipse cx={4} cy={8} rx={44} ry={30} fill={dark} {...LINE} />}
      <circle r={34} fill={mid} {...LINE} />
      <path d="M-20 -24 Q0 -38 22 -26" fill="none" stroke={light} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <path d="M-2 -10 Q14 -26 30 -18 Q40 -8 40 8 Q40 30 18 32 Q-4 32 -6 14 Q-8 -2 -2 -10 Z" fill={look.face} {...LINE} />
      <path d="M2 -12 Q18 -22 36 -12" fill="none" stroke={dark} strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={20} cy={-2} rx={6} ry={7} fill="#fbf2dc" stroke={EDGE} strokeWidth={1.4} />
      <circle cx={22.5} cy={-1} r={3.6} fill={EDGE} />
      <circle cx={23.5} cy={-2.4} r={1.2} fill="#ffffff" />
      <path d="M34 10 Q40 12 38 18" fill="none" stroke={EDGE} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M14 22 Q26 28 38 20" fill="none" stroke={EDGE} strokeWidth={2.6} strokeLinecap="round" />
      {look.mark === 'moustache' && <path d="M22 16 Q4 26 -6 60 Q12 34 26 22 Q34 34 34 62 Q42 30 30 16 Z" fill="#f6f1e8" {...LINE} strokeWidth={1.6} />}
    </g>
  )
}

function Wear({ ape, look }: { ape: FriendApe; look: ApeLook }) {
  const colour = TROOP[ape]
  if (look.wear === 'neckerchief') {
    return (
      <g>
        <path d="M14 -132 Q40 -120 64 -132 L60 -116 Q40 -108 18 -116 Z" fill={colour} {...LINE} />
        <path d="M30 -116 L22 -92 L42 -112 Z" fill={colour} {...LINE} />
      </g>
    )
  }
  if (look.wear === 'vest') return <path d="M-30 -130 Q10 -150 52 -126 Q56 -96 48 -66 L-28 -66 Q-38 -96 -30 -130 Z" fill={colour} {...LINE} opacity={0.95} />
  return <path d="M-34 -136 L-18 -146 L54 -70 L38 -60 Z" fill={colour} {...LINE} />
}

/** A friend of the troop, side on and facing right, his feet on 0 0, `children` held in his near hand. */
export function FriendFigure({ ape, children }: { ape: FriendApe; children?: ReactNode }) {
  const look = LOOK[ape]
  const [dark, mid, light] = look.fur
  const s = look.height / 200
  const length = ARM * look.reach
  const arm = armPath(length)
  return (
    <g>
      <Shadow width={look.height * 0.6} x={10 * s} />
      <g data-fx={`${ape}-body`}>
        <g transform={`scale(${s.toFixed(3)})`}>
          <g transform={`translate(${SHOULDER.x - 16} ${SHOULDER.y}) rotate(-8)`}>
            <path d={arm} fill={dark} {...LINE} />
            <circle cx={3} cy={length} r={11} fill={dark} {...LINE} />
          </g>
          <path d="M-14 -62 Q-30 -30 -22 0 L-2 0 L0 -50 Z" fill={dark} {...LINE} />
          <path d="M-40 -60 Q-56 -144 8 -154 Q62 -154 58 -94 Q54 -56 24 -50 L-28 -50 Q-42 -52 -40 -60 Z" fill={mid} {...LINE} />
          {look.mark === 'crest' && <path d="M-36 -70 Q-46 -136 4 -146 Q-24 -110 -20 -66 Z" fill="#b8bcc8" opacity={0.85} />}
          <ellipse cx={26} cy={-96} rx={20} ry={32} fill={light} opacity={0.75} />
          <path d="M-4 -62 Q14 -40 10 -2 L36 -2 Q38 -8 24 -12 L26 -44 Q22 -62 10 -66 Z" fill={mid} {...LINE} />
          <Wear ape={ape} look={look} />
          <Head look={look} />
          <g data-fx={`${ape}-arm`} transform={armTurn(0)}>
            <path d={arm} fill={mid} {...LINE} />
            <path d={`M8 2 Q9 ${r1(length * 0.45)} 7 ${r1(length - 14)}`} fill="none" stroke={light} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
            <circle cx={3} cy={length} r={11} fill={look.face} {...LINE} />
            <g transform={`translate(3 ${r1(length)})`}>{children}</g>
          </g>
        </g>
      </g>
    </g>
  )
}

/** A mango in an ape's colour, its middle on 0 0, `size` 1 about 40 long: the fruit that ape gathers. */
export function ColourMango({ ape, size = 1 }: { ape: Ape; size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      <ellipse rx={22} ry={17} fill={TROOP[ape]} {...LINE} />
      <ellipse cx={6} cy={-5} rx={11} ry={7} fill="#ffffff" opacity={0.45} />
      <path d="M-18 -10 Q-26 -26 -10 -24 Q-14 -16 -18 -10 Z" fill="#3f8a2a" {...LINE} strokeWidth={2} />
    </g>
  )
}

// ---- the troop's instruments, each round its own 0 0, held or stood by its place

/** His hand drum, standing on its foot at 0 0, its head 70 up. */
export const HandDrum = () => (
  <g>
    <path d="M-26 0 L-20 -40 Q-34 -50 -30 -70 L30 -70 Q34 -50 20 -40 L26 0 Z" fill="url(#tp-wood)" {...LINE} />
    <ellipse cx={0} cy={-70} rx={31} ry={8} fill="#f2e2bc" {...LINE} />
    <path d="M-28 -60 L-22 -10 M28 -60 L22 -10 M0 -62 V-4" stroke={TROOP.him} strokeWidth={3} />
  </g>
)

/** The lemur's small guitar, its neck up to the right. */
export const Guitar = () => (
  <g transform="rotate(-30)">
    <path d="M-30 0 Q-34 -16 -18 -18 Q-10 -26 0 -18 Q16 -20 14 0 Q16 18 0 16 Q-12 24 -20 16 Q-34 16 -30 0 Z" fill={TROOP.lemur} {...LINE} strokeWidth={2} />
    <circle cx={-6} cy={-1} r={5} fill={EDGE} />
    <rect x={12} y={-4} width={52} height={7} fill="url(#tp-wood)" stroke={EDGE} strokeWidth={1.6} />
  </g>
)

/** The orangutan's tuba, its bell up, round his chest. */
export const Tuba = () => (
  <g>
    <circle r={30} fill="none" stroke="url(#tp-gold)" strokeWidth={14} />
    <circle r={30} fill="none" stroke={EDGE} strokeWidth={2} />
    <path d="M14 -24 L30 -76 Q34 -90 56 -96 L60 -80 Q44 -74 42 -64 L28 -20 Z" fill="url(#tp-gold)" {...LINE} strokeWidth={2} />
    <ellipse cx={58} cy={-88} rx={12} ry={6} fill="#5a3a06" transform="rotate(-20 58 -88)" />
    <circle cx={0} cy={0} r={8} fill={TROOP.orangutan} stroke={EDGE} strokeWidth={1.6} />
  </g>
)

/** The tamarin's panpipes, their mouths along the top. */
export const Panpipes = () => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={i * 7 - 18} y={-30} width={7} height={30 - i * 4} fill="url(#tp-wood)" stroke={EDGE} strokeWidth={1.2} />
    ))}
    <rect x={-20} y={-20} width={38} height={5} fill={TROOP.tamarin} stroke={EDGE} strokeWidth={1.2} />
  </g>
)

/** The silverback's gong on its frame, standing on its feet at 0 0, its face (`gong-face`) 150 up. */
export const Gong = () => (
  <g>
    <path d="M-70 0 V-230 H70 V0" fill="none" stroke="url(#tp-wood)" strokeWidth={14} />
    <path d="M-80 -232 H80" stroke={EDGE} strokeWidth={6} strokeLinecap="round" />
    <path d="M-40 -230 V-210 M40 -230 V-210" stroke={EDGE} strokeWidth={3} />
    <g data-fx="gong-face">
      <circle cx={0} cy={-150} r={60} fill="url(#tp-gold)" {...LINE} />
      <circle cx={0} cy={-150} r={38} fill="none" stroke={TROOP.silverback} strokeWidth={8} />
      <circle cx={0} cy={-150} r={14} fill="#d89a1a" stroke={EDGE} strokeWidth={2} />
    </g>
  </g>
)

/** The silverback's mallet. */
export const Mallet = () => (
  <g>
    <path d="M0 0 L46 -10" stroke="url(#tp-wood)" strokeWidth={6} strokeLinecap="round" />
    <circle cx={50} cy={-11} r={10} fill="#f2e2bc" {...LINE} strokeWidth={2} />
  </g>
)

/** A coconut, the one he hurls, its middle on 0 0. */
export const Coconut = () => (
  <g>
    <circle r={13} fill="#6b4a2a" {...LINE} strokeWidth={2} />
    <circle cx={-3} cy={-3} r={2} fill={EDGE} />
    <circle cx={3} cy={-4} r={2} fill={EDGE} />
    <circle cx={0} cy={2} r={2} fill={EDGE} />
  </g>
)

/** A seed of the lemur's pistols, its middle on 0 0. */
export const Seed = () => <ellipse rx={8} ry={5} fill={TROOP.lemur} stroke={EDGE} strokeWidth={1.6} />

/** A coloured pad on the ground, round 0 0, an ape's sign in the middle: where his instrument plays. */
export function Pad({ ape, width = 110 }: { ape: Ape; width?: number }) {
  return (
    <g>
      <ellipse cx={0} cy={4} rx={width / 2 + 6} ry={width / 7 + 3} fill={EDGE} opacity={0.5} />
      <ellipse cx={0} cy={0} rx={width / 2} ry={width / 7} fill={TROOP[ape]} {...LINE} />
      <ellipse cx={0} cy={-2} rx={width / 4} ry={width / 16} fill="#ffffff" opacity={0.5} />
    </g>
  )
}
