import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Pose } from './choreography'
import { FIGURE } from './palette'
import css from './character.module.css'

// Him as this world's hero, a parody of the time travel platformer's hunched grinning runner (research
// 2026-11-09-c44-r4 part 3), drawn the way the game's 2D art draws its hero: colour blocked parts with a
// warm near black outline, each part its own colour so it reads at any size. Kept from the hero: the pear
// silhouette, the oversized head (crest to chin 41% of his height), the hunch and the bent knees, long
// thin arms with big hands, rolled jeans with the drawstring bow, brown fingerless gloves, huge red high
// tops with cream laces and toe band, the wide square toothed grin, the thick brows angled in and the
// spiky crest. His own, from HERO_IDENTITY: the skin where the fur was, the crest in his hair colour, his
// full beard filling the muzzle wrap with the teeth showing through it, his dark eyes in the big whites.
// He is human, so the long ears and the ball nose become a human nose and ears, and the light chest
// stripe becomes a tan sleeveless top. One look per profession: the drummer carries his sticks, the
// fighter wears the mongkhon round his head and wraps on his hands.
//
// The parts are groups turning on their own joints (the hips, the shoulders, the elbows, the neck), so
// character.module.css plays every pose with transforms only: idle, the head scratch (his reaction to
// the visitor), the run, the plunger pull, the spin, the head hit, the point, the drum roll, the guard,
// the victory knee, the press, the victory dance and the hop. viewBox 120 by 200, his feet on y 197.

const LINE = FIGURE.line

/** A thin limb drawn as an outline line under a colour line, so it keeps the 2D edge at any angle. */
function Limb({ d, colour, width }: { d: string; colour: string; width: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={LINE} strokeWidth={width + 3.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={colour} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

/** A big gloved hand: the brown fingerless glove over the palm and the bare fingers curling out of it. */
function Hand({ x, y, wrapped }: { x: number; y: number; wrapped: boolean }) {
  return (
    <g>
      <path
        d={`M${x - 7} ${y + 5} q-2 7 2 10 q2 2 4 -1 q1 4 4 3.5 q3 0 3 -3.5 q3 3 5 0 q2 -3 0 -9 Z`}
        fill={FIGURE.skin}
        stroke={LINE}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <ellipse cx={x} cy={y + 1} rx={9} ry={8} fill={FIGURE.glove} stroke={LINE} strokeWidth={2.2} />
      <path d={`M${x - 6} ${y + 4} q6 3 12 0`} fill="none" stroke={FIGURE.gloveShade} strokeWidth={2} strokeLinecap="round" />
      {wrapped && <path d={`M${x - 8} ${y - 2} h16 M${x - 8.5} ${y + 2} h17`} stroke={FIGURE.wrap} strokeWidth={2.2} />}
    </g>
  )
}

/** A stick held in the hand, its tip toward the drum. */
const Stick = ({ x, y, dx }: { x: number; y: number; dx: number }) => (
  <g className={css.stick}>
    <Limb d={`M${x} ${y} L${x + dx} ${y + 22}`} colour={FIGURE.stick} width={3} />
    <circle cx={x + dx} cy={y + 22} r={2.6} fill={FIGURE.stick} stroke={LINE} strokeWidth={1.6} />
  </g>
)

interface Look {
  /** Drawn in each hand after the glove. */
  hand: (x: number, y: number, side: -1 | 1) => ReactNode
  /** Drawn round his head over the crest. */
  headwear: ReactNode
  wrapped: boolean
}

const NOTHING = () => null

const LOOK: Record<Profession, Look> = {
  engineer: { hand: NOTHING, headwear: null, wrapped: false },
  drummer: { hand: (x, y, side) => <Stick x={x} y={y + 2} dx={side * 14} />, headwear: null, wrapped: false },
  fighter: {
    hand: NOTHING,
    headwear: (
      <g>
        <path d="M30 31 Q60 20 90 31" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
        <path d="M30 31 Q60 20 90 31" fill="none" stroke={FIGURE.wrap} strokeWidth={4} strokeLinecap="round" />
        <path d="M30 31 Q60 20 90 31" fill="none" stroke={FIGURE.band} strokeWidth={1.4} strokeDasharray="3 4" />
        <path d="M32 29 Q20 18 22 6 Q28 16 36 24 Z" fill={FIGURE.wrap} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
      </g>
    ),
    wrapped: true,
  },
}

/** One arm from its shoulder: the upper arm, then the forearm turning on the elbow, then the hand. */
function Arm({ side, look }: { side: -1 | 1; look: Look }) {
  const shoulder = 60 + side * 14
  const elbow = shoulder + side * 6
  const wrist = elbow + side * 2
  return (
    <g className={side < 0 ? css.armBack : css.armFront}>
      <Limb d={`M${shoulder} 96 L${elbow} 121`} colour={FIGURE.skin} width={7} />
      <g className={side < 0 ? css.foreBack : css.foreFront}>
        <Limb d={`M${elbow} 121 L${wrist} 146`} colour={FIGURE.skin} width={6.4} />
        <Hand x={wrist} y={152} wrapped={look.wrapped} />
        {look.hand(wrist, 152, side)}
      </g>
    </g>
  )
}

/** One leg from the hip: the jeans to the rolled cuff, the bare shin and the big high top. */
function Leg({ side }: { side: -1 | 1 }) {
  const x = 60 + side * 13
  const toe = side * 28
  return (
    <g className={side < 0 ? css.legBack : css.legFront}>
      <path
        d={`M${x - 9} 130 L${x + 9} 130 C${x + 10 + side * 5} 142, ${x + 9 + side * 5} 156, ${x + 7} 168 L${x - 7} 168 C${x - 9 + side * 5} 156, ${x - 10 + side * 5} 142, ${x - 9} 130 Z`}
        fill={FIGURE.jeans}
        stroke={LINE}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d={`M${x - 4 + side * 2} 134 L${x - 3 + side * 3} 158`} stroke={FIGURE.jeansShade} strokeWidth={2.4} strokeLinecap="round" />
      <path d={`M${x - 9} 163 L${x + 9} 163 L${x + 10} 172 L${x - 10} 172 Z`} fill={FIGURE.cuff} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={`M${x - 9} 167.5 H${x + 9.5}`} stroke={FIGURE.jeansShade} strokeWidth={1.4} />
      <rect x={x - 5} y={171} width={10} height={6} fill={FIGURE.skinShade} stroke={LINE} strokeWidth={1.8} />
      <path
        d={`M${x - 10} 175 L${x + 10} 175 L${x + 11 + side * 2} 185 C${x + toe} 183, ${x + toe + side * 8} 189, ${x + toe + side * 4} 196 L${x - side * 12} 196 C${x - side * 15} 192, ${x - side * 13} 184, ${x - 10} 182 Z`}
        fill={FIGURE.shoe}
        stroke={LINE}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d={`M${x - side * 12} 192 L${x + toe + side * 5} 192`} stroke={FIGURE.lace} strokeWidth={3.4} strokeLinecap="round" />
      <path d={`M${x + side * 2} 186 C${x + toe * 0.6} 184, ${x + toe * 0.9} 187, ${x + toe + side * 2} 190`} fill="none" stroke={FIGURE.shoeShade} strokeWidth={2} />
      <path d={`M${x - 6} 177 L${x + 5} 181 M${x + 5} 177 L${x - 6} 181 M${x - 5} 181 L${x + 5} 185`} stroke={FIGURE.lace} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  )
}

const CREST = 'M33 36 L27 22 L37 25 L34 9 L47 19 L51 2 L60 15 L68 1 L73 17 L85 7 L83 24 L94 21 L87 37 Z'
const HEAD = 'M31 40 C30 16 90 16 89 40 C96 52 97 70 87 82 C78 92 42 92 33 82 C23 70 24 52 31 40 Z'
const SIDEBURNS = 'M30 40 C27 52 29 60 34 66 L38 62 C35 56 35 48 36 41 Z M90 40 C93 52 91 60 86 66 L82 62 C85 56 85 48 84 41 Z'
const BEARD = 'M33 62 C34 78 45 92 60 93 C75 92 86 78 87 62 C80 67 72 65 68 61 L52 61 C48 65 40 67 33 62 Z'
const MOUTH = 'M41 68 C50 74 70 74 79 68 C77 81 67 86 60 86 C53 86 43 81 41 68 Z'
const TEETH = 'M42 69 C50 74.5 70 74.5 78 69 L77 76 C68 79.5 52 79.5 43 76 Z'
const MOUSTACHE = 'M42 67 C49 61 56 62 60 64 C64 62 71 61 78 67 C71 69 65 67.5 60 67.5 C55 67.5 49 69 42 67 Z'
const NOSE = 'M59 50 C57 56 55 60 58.5 62 C61.5 63.5 65 62 64 58.5'

function Head({ look }: { look: Look }) {
  return (
    <g className={css.head}>
      <ellipse cx={27} cy={57} rx={5.5} ry={8.5} fill={FIGURE.skinShade} stroke={LINE} strokeWidth={2.2} />
      <ellipse cx={93} cy={57} rx={5.5} ry={8.5} fill={FIGURE.skinShade} stroke={LINE} strokeWidth={2.2} />
      <path d={CREST} fill={FIGURE.hair} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={HEAD} fill={FIGURE.skin} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M33 46 C30 58 32 72 40 82 C34 70 33 58 36 46 Z" fill={FIGURE.skinShade} />
      <path d="M44 22 C40 26 39 30 40 33" fill="none" stroke={FIGURE.hair} strokeWidth={3} strokeLinecap="round" />
      <path d={SIDEBURNS} fill={FIGURE.beard} />
      <path d={BEARD} fill={FIGURE.beard} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d={MOUTH} fill={FIGURE.mouth} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
      <path d={TEETH} fill={FIGURE.teeth} stroke={LINE} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M50 71.5 V78 M55 72.6 V79 M60 73 V79.4 M65 72.6 V79 M70 71.5 V78" stroke={LINE} strokeWidth={1.1} />
      <path d={MOUSTACHE} fill={FIGURE.beard} />
      <path d={NOSE} fill={FIGURE.skinShade} stroke={LINE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <g className={css.eyes}>
        <ellipse cx={49} cy={45} rx={9.5} ry={12} fill={FIGURE.eyeWhite} stroke={LINE} strokeWidth={2.2} />
        <ellipse cx={70.5} cy={45} rx={9.5} ry={12} fill={FIGURE.eyeWhite} stroke={LINE} strokeWidth={2.2} />
        <g className={css.look}>
          <circle cx={52} cy={47} r={4.8} fill={FIGURE.eyes} />
          <circle cx={73} cy={47} r={4.8} fill={FIGURE.eyes} />
          <circle cx={53.6} cy={45} r={1.6} fill={FIGURE.shine} />
          <circle cx={74.6} cy={45} r={1.6} fill={FIGURE.shine} />
        </g>
        <ellipse className={css.lid} cx={49} cy={45} rx={10} ry={12.5} fill={FIGURE.skin} stroke={LINE} strokeWidth={2.2} />
        <ellipse className={css.lid} cx={70.5} cy={45} rx={10} ry={12.5} fill={FIGURE.skin} stroke={LINE} strokeWidth={2.2} />
      </g>
      <path d="M37 32 L58 37.5 L57 42 L37 37 Z M83 32 L62 37.5 L63 42 L83 37 Z" fill={FIGURE.hair} stroke={LINE} strokeWidth={1.6} strokeLinejoin="round" />
      {look.headwear}
    </g>
  )
}

/** The rings of white and pink his body smears into while he spins. */
function SpinRings() {
  return (
    <g className={css.rings}>
      <ellipse cx={60} cy={112} rx={54} ry={14} fill="none" stroke={FIGURE.spinWhite} strokeWidth={5} />
      <ellipse cx={60} cy={142} rx={46} ry={12} fill="none" stroke={FIGURE.spinPink} strokeWidth={5} />
      <ellipse cx={60} cy={80} rx={40} ry={10} fill="none" stroke={FIGURE.spinPink} strokeWidth={3.4} />
    </g>
  )
}

/** Where he stands inside a scene's own svg, in its units, so he lines up with its art at every width. */
export interface Place {
  x: number
  y: number
  width: number
  height: number
}

interface CharacterProps {
  profession: Profession
  pose: Pose
  place?: Place
  className?: string
}

export function Character({ profession, pose, place, className = '' }: CharacterProps) {
  const look = LOOK[profession]
  return (
    <svg {...place} viewBox="0 0 120 200" className={`${css.figure} ${css[pose]} ${className}`} data-pose={pose} aria-hidden="true" focusable="false">
      <ellipse cx={60} cy={197} rx={40} ry={3.2} className={css.shadow} fill={LINE} />
      <g className={css.whole}>
        <Leg side={-1} />
        <Leg side={1} />
        <g className={css.upper}>
          <Arm side={-1} look={look} />
          <path d="M54 84 H66 V98 H54 Z" fill={FIGURE.skinShade} stroke={LINE} strokeWidth={2} />
          <path d="M47 92 C39 99 34 112 36 125 L84 125 C86 112 81 99 73 92 Z" fill={FIGURE.skin} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
          <path
            d="M49 94 C43 102 38 112 39 124 L81 124 C82 112 77 102 71 94 C66 99 54 99 49 94 Z"
            fill={FIGURE.top}
            stroke={LINE}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path d="M42 104 C39 112 39 118 40 123 L48 123 C45 116 45 110 47 102 Z" fill={FIGURE.topShade} />
          <path d="M35 121 L85 121 L87 137 C76 140 44 140 33 137 Z" fill={FIGURE.jeans} stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M35 125.5 H85" stroke={FIGURE.jeansShade} strokeWidth={1.6} />
          <path d="M60 126 q-7 -4 -7 1 q0 4 7 0 q7 -4 7 1 q0 4 -7 -1 M58.5 127 l-3 7 M61.5 127 l3 7" fill="none" stroke={FIGURE.string} strokeWidth={1.8} strokeLinecap="round" />
          <Head look={look} />
          <Arm side={1} look={look} />
        </g>
        <SpinRings />
      </g>
    </svg>
  )
}
