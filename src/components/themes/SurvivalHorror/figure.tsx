import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { SH } from './palette'
import s from './figure.module.css'

// Him as this world's survivor, side on and facing right, the way the genre's fixed cameras show a figure
// crossing a room: a worn canvas jacket over a grey shirt, dark trousers and boots, a flashlight in his near
// (left) hand whose beam he raises into the dark, a revolver he draws in his far (right) hand. His traits
// come from HERO_IDENTITY: his skin, his short dark hair, his full dark beard, here in profile. The Martial
// Artist sheds the jacket for a dark vest, wraps his hands and wears his own mongkhon. Drawn in a 100 by 150
// box, feet on y 144, on the shared rig's joints: both shoulders turn on one point, both hips side by side,
// so a negative angle swings a limb forward, to the right. The scenes pose him per frame (pose.ts).

const LINE = SH.void
const LW = 1.4
const SKIN = HERO_IDENTITY.skin
const SKIN_SHADE = HERO_IDENTITY.skinShade
const HAIR = HERO_IDENTITY.hair

// The head in profile: the back of the skull on the left, the brow, nose and chin to the right.
const HEAD = 'M41 26 Q41 12 52 11.5 Q61 12 62.5 21 L66 27 L62.8 28.5 Q63 36 58 41 Q52 44 46 40 Q41 35 41 26 Z'
const HAIR_CUT = 'M40.5 27 Q39 10 53 9.5 Q62 10 63 19 Q58 15.5 52 16.5 Q47 18 46 27 Z'
const BEARD = 'M46.5 31 Q47 42 53.5 44.5 Q61 43 63.4 32 L60 33.5 Q57 34.5 55 33 Q50 34 46.5 31 Z'
const JACKET = 'M41 46 Q52 42 62 46 L63 98 L41 98 Z'
const VEST = 'M43 47 Q52 44 61 47 L61 92 L43 92 Z'

// One arm's parts, shoulder at (51, 49), elbow at (51, 67), hand at (51, 88): the far and the near arm are
// the same shape, the far one drawn behind the body in shade.
const UPPER = 'M46.5 46 L55.5 46 L55 68 L47 68 Z'
const FORE = 'M47 66 L55 66 L54.5 85 L47.5 85 Z'
const HAND = { x: 51, y: 88 }

// The legs side by side under the hips, the boots' toes to the right.
const HIP = { right: 49, left: 53 }
const thigh = (x: number) => `M${x - 6} 92 L${x + 6} 92 L${x + 5} 118 L${x - 4.5} 118 Z`
const shin = (x: number) => `M${x - 4.5} 116 L${x + 5} 116 L${x + 4.5} 135 L${x - 4} 135 Z`
const boot = (x: number) => `M${x - 5} 133 L${x + 5} 133 Q${x + 12} 136 ${x + 12} 144 L${x - 5} 144 Z`

type Side = 'right' | 'left'

function Shape({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
}

// His mongkhon: a white and gold braided crown ring seen from the side, its tail standing up at the back.
function Mongkhon() {
  return (
    <g>
      <path d="M41 19 Q52 13 62 18" fill="none" stroke={LINE} strokeWidth={5.5} strokeLinecap="round" />
      <path d="M41 19 Q52 13 62 18" fill="none" stroke={SH.ivory} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M45 16.5 L47 18 M51 15 L53 16.5 M57 15 L59 16.5" stroke={SH.brass} strokeWidth={1.1} />
      <Shape d="M42 18 Q35 8 38 2 Q31 8 39 20 Z" fill={SH.ivory} />
    </g>
  )
}

function Head({ profession }: { profession: Profession }) {
  return (
    <g>
      <Shape d={HEAD} fill={SKIN} />
      <Shape d={HAIR_CUT} fill={HAIR} />
      <Shape d={BEARD} fill={HAIR} />
      <ellipse cx={48} cy={27} rx={2.6} ry={3.4} fill={SKIN_SHADE} stroke={LINE} strokeWidth={1} />
      <path d="M55 20.5 L60.5 21" stroke={HAIR} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M56.5 24.5 H60" stroke={LINE} strokeWidth={1.6} strokeLinecap="round" />
      {profession === 'fighter' && <Mongkhon />}
    </g>
  )
}

function Torso({ profession }: { profession: Profession }) {
  if (profession === 'fighter') {
    return (
      <g>
        <Shape d={VEST} fill={SH.top} />
        <Shape d="M42 88 L62 88 L63 98 L41 98 Z" fill={SH.cargo} />
      </g>
    )
  }

  return (
    <g>
      <Shape d={JACKET} fill={SH.jacket} />
      <Shape d="M55 44 L62 46 L58 58 Z" fill={SH.steel} />
      <path d="M57 46 L55 62" stroke={SH.jacketShade} strokeWidth={2.2} />
      <path d="M61.5 50 L62.5 94" stroke={SH.jacketLit} strokeWidth={1.6} />
      <path d="M44 72 H52" stroke={SH.jacketShade} strokeWidth={1.2} />
      <Shape d="M40.6 90 L63.4 90 L63.6 95 L40.4 95 Z" fill={SH.strap} />
      {/* the revolver's holster on his hip, empty once he draws */}
      <g className={s.holster}>
        <Shape d="M46 92 L53 92 L52 106 L47 106 Z" fill={SH.strap} />
        <path d="M48 90 L51 86" stroke={SH.gunmetal} strokeWidth={2.4} strokeLinecap="round" />
      </g>
    </g>
  )
}

function Leg({ side, shade }: { side: Side; shade: boolean }) {
  const x = HIP[side]
  const cloth = shade ? SH.top : SH.cargo
  return (
    <g className={side === 'right' ? s.thighRight : s.thighLeft}>
      <Shape d={thigh(x)} fill={cloth} />
      <g className={side === 'right' ? s.shinRight : s.shinLeft}>
        <Shape d={shin(x)} fill={cloth} />
        <Shape d={boot(x)} fill={SH.boot} />
      </g>
    </g>
  )
}

// The revolver in his far fist, its barrel along the forearm's line.
function Revolver() {
  return (
    <g className={s.gun} opacity={0}>
      <path d="M49 86 L53 86 L53 110 L49 110 Z" fill={SH.steel} stroke={LINE} strokeWidth={0.8} />
      <circle cx={51} cy={94} r={3.2} fill={SH.fog} stroke={LINE} strokeWidth={0.8} />
    </g>
  )
}

// A page in his far hand, held up to the light.
function Paper() {
  return (
    <g className={s.paper} opacity={0}>
      <path d="M44 86 L58 84 L60 104 L46 106 Z" fill={SH.ivory} stroke={LINE} strokeWidth={0.8} />
      <path d="M47 90 L56 89 M47.5 94 L56.5 93 M48 98 L54 97.4" stroke={SH.sepia} strokeWidth={0.9} />
    </g>
  )
}

// The flashlight in his near fist and its beam, a long cone along the forearm's line that lights what he
// points it at. The beam is drawn hanging down; the arm's turn points it.
function Flashlight() {
  return (
    <g>
      <path className={s.beam} opacity={0} d="M48.5 94 L53.5 94 L100 250 L2 250 Z" fill={SH.flame} fillOpacity={0.22} />
      <rect x={48.6} y={84} width={4.8} height={11} rx={1} fill={SH.gunmetal} stroke={LINE} strokeWidth={0.8} />
      <rect className={s.beam} opacity={0} x={48.6} y={93} width={4.8} height={2} fill={SH.ivory} />
    </g>
  )
}

function Arm({ side, profession }: { side: Side; profession: Profession }) {
  const far = side === 'right'
  const sleeve = profession === 'fighter' ? (far ? SKIN_SHADE : SKIN) : far ? SH.jacketShade : SH.jacket
  const fist = profession === 'fighter' ? SH.ivory : far ? SKIN_SHADE : SKIN

  return (
    <g className={far ? s.armRight : s.armLeft}>
      <Shape d={UPPER} fill={sleeve} />
      <g className={far ? s.foreRight : s.foreLeft}>
        {!far && <Flashlight />}
        <Shape d={FORE} fill={sleeve} />
        <circle cx={HAND.x} cy={HAND.y} r={4.2} fill={fist} stroke={LINE} strokeWidth={LW} />
        {far && <Revolver />}
        {far && <Paper />}
      </g>
    </g>
  )
}

/** His figure's groups in the 100 by 150 viewBox; a stage places it in a nested svg of that viewBox and poses its joints (pose.ts). */
export function SurvivorFigure({ profession }: { profession: Profession }) {
  return (
    <g className={s.sprite}>
      <ellipse cx={52} cy={145} rx={18} ry={2.6} fill={SH.void} opacity={0.6} />
      <g className={s.body}>
        <Arm side="right" profession={profession} />
        <Leg side="right" shade />
        <Leg side="left" shade={false} />
        <Torso profession={profession} />
        <Head profession={profession} />
        <Arm side="left" profession={profession} />
      </g>
    </g>
  )
}
