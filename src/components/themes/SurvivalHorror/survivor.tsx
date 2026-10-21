import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { Breath, Drop, Joint, Limb } from './rig'
import { SH } from './palette'
import rig from './rig.module.css'

// Him as this world's character, a parody of the 2005 survival horror hero (Leon in the village game, named
// here in code only): upright and realistic, about seven and a half heads tall, three quarters from the side
// and facing right, lit from above left like a pre-rendered room. The brown leather bomber with its cream
// fur collar over a black top, grey cargo trousers and boots, black fingerless gloves, the chest rig with the
// knife across it, the thigh holster and the handgun with its laser sight. He is still himself: his skin,
// his short dark hair with the hero's fringe falling over the eye, his full dark beard (HERO_IDENTITY).
// - System Engineer: the full kit, the handgun in his hand.
// - Musician: the full kit, a drumstick in each hand, the handgun holstered.
// - Martial Artist: the jacket off, a black vest and bare arms, cream hand wraps, and the mongkhon (the
//   corded ring of a Muay Thai fighter) round his head with its tail behind.
//
// Built on the world's rig (./rig): shoulder, elbow, hip and knee joints, the lean at the hips, the head at
// the neck, and a drop for kneeling and sitting. A pose is a row of angles in HERO_POSES; the stage
// (./stage) steps him through them. viewBox units: 48 by 112, feet on y 110.

interface Angles {
  lean: number
  head: number
  backArm: readonly [number, number]
  frontArm: readonly [number, number]
  backLeg: readonly [number, number]
  frontLeg: readonly [number, number]
  drop: number
}

// What the front hand holds in a pose: the profession's own (gun, stick or wrap) unless the pose says.
type Hold = 'kit' | 'gun' | 'paper' | 'key' | 'item' | 'bare'
// What the back hand holds: nothing, or the fresh magazine on its way to the gun.
type BackHold = 'none' | 'mag'

interface PoseRow extends Angles {
  hold: Hold
  backHold: BackHold
}

const STAND: PoseRow = {
  lean: 0,
  head: 0,
  backArm: [3, -4],
  frontArm: [-3, -6],
  backLeg: [2, 2],
  frontLeg: [-2, 2],
  drop: 0,
  hold: 'kit',
  backHold: 'none',
}

const pose = (row: Partial<PoseRow>, from: PoseRow = STAND): PoseRow => ({ ...from, ...row })

// The two handed aim of the genre: both arms straight to the eye line, the back hand under the front.
const AIM = pose({ lean: -2, head: 4, frontArm: [-88, -2], backArm: [-78, -12], backLeg: [6, 3], frontLeg: [-8, 4], hold: 'gun' })
const GUARD = pose({ lean: -3, head: 4, frontArm: [-50, -105], backArm: [-38, -115], backLeg: [10, 8], frontLeg: [-16, 12], hold: 'bare' })
const KNEEL = pose({ lean: 18, head: 10, frontArm: [-42, -28], backArm: [-20, -30], backLeg: [0, 92], frontLeg: [-88, 88], drop: 24, hold: 'bare' })
const READ = pose({ lean: 2, head: 14, frontArm: [-40, -95], backArm: [-30, -100], hold: 'paper' })
const GUN_CHECK = pose({ lean: 4, head: 18, frontArm: [-40, -70], backArm: [-35, -75], hold: 'gun' })
const LIMP = pose({ lean: 16, head: 10, backArm: [-25, -110], frontArm: [8, -4], backLeg: [8, 16], frontLeg: [-4, 12], drop: 2 })
const SIT = pose({ lean: 4, head: 6, frontArm: [-50, -50], backArm: [-45, -55], backLeg: [-84, 84], frontLeg: [-86, 86], drop: 22, hold: 'bare' })

export const HERO_POSES = {
  stand: STAND,
  walkA: pose({ backArm: [-16, -10], frontArm: [18, -8], backLeg: [16, 10], frontLeg: [-20, 4] }),
  walkB: pose({ backArm: [18, -8], frontArm: [-16, -10], backLeg: [-20, 4], frontLeg: [16, 12] }),
  aim: AIM,
  aimStepA: pose({ backLeg: [-10, 8], frontLeg: [8, 6] }, AIM),
  aimStepB: pose({ backLeg: [10, 4], frontLeg: [-12, 10] }, AIM),
  guard: GUARD,
  sticksUp: pose({ head: -4, frontArm: [-140, -20], backArm: [-40, -60] }),
  kneel: KNEEL,
  take: pose({ head: 16, frontArm: [-62, -20] }, KNEEL),
  lift: pose({ lean: 6, head: -4, frontArm: [-110, -40], hold: 'item' }, KNEEL),
  reach: pose({ lean: 10, head: 8, frontArm: [-55, -10], hold: 'bare' }),
  read: READ,
  readTurn: pose({ backArm: [-55, -70] }, READ),
  alert: pose({ lean: -4, head: -16, frontArm: [-30, -20], backArm: [-20, -30], backLeg: [6, 3], frontLeg: [-6, 3], hold: 'gun' }),
  gunCheck: GUN_CHECK,
  reloadDrop: pose({ frontArm: [-30, -80], backArm: [10, -10] }, GUN_CHECK),
  reloadReach: pose({ frontArm: [-30, -80], backArm: [22, -40], backHold: 'mag' }, GUN_CHECK),
  reloadInsert: pose({ backArm: [-30, -85], backHold: 'mag' }, GUN_CHECK),
  rack: pose({ head: 10, frontArm: [-45, -75], backArm: [-50, -60] }, GUN_CHECK),
  keyReach: pose({ lean: 4, head: 4, frontArm: [-78, -6], hold: 'key' }),
  keyTurn: pose({ lean: 4, head: 4, frontArm: [-78, -22], hold: 'key' }),
  limp: LIMP,
  limpA: pose({ backLeg: [14, 22], frontLeg: [-14, 6] }, LIMP),
  limpB: pose({ backLeg: [-6, 10], frontLeg: [6, 20] }, LIMP),
  kickChamber: pose({ lean: -10, frontArm: [-40, -100], backArm: [-30, -110], backLeg: [4, 4], frontLeg: [-95, 100], hold: 'bare' }),
  kick: pose({ lean: -28, frontArm: [40, -40], backArm: [-60, -100], backLeg: [8, 4], frontLeg: [-100, 10], drop: -2, hold: 'bare' }),
  runA: pose({ lean: 14, head: -4, frontArm: [45, -80], backArm: [-55, -85], frontLeg: [-55, 30], backLeg: [30, 85] }),
  runB: pose({ lean: 14, head: -4, frontArm: [-55, -85], backArm: [45, -80], frontLeg: [30, 85], backLeg: [-55, 30] }),
  sit: SIT,
  typeA: pose({ frontArm: [-50, -40] }, SIT),
  typeB: pose({ frontArm: [-50, -58], backArm: [-45, -45] }, SIT),
  nod: pose({ head: 12 }),
} satisfies Record<string, PoseRow>

export type HeroPose = keyof typeof HERO_POSES

const ID = HERO_IDENTITY

const HEAD = 'M19.5 13 Q19.5 4.5 26 4.5 Q32.5 4.5 32.6 12 L33.4 16.6 Q32.4 17.4 32.2 19.6 Q31 24.6 25.6 24.6 Q20.6 24.4 19.8 19 Z'
const EAR = 'M21.6 14.4 Q19.6 14.2 19.8 16.6 Q20.2 18.6 22 18.2 Z'
// His short dark hair, with the hero's long fringe swept over to fall past the eye.
const HAIR = 'M19.2 15 Q18.2 6.6 23.4 3.8 Q29.6 1.6 33 6.4 Q34.6 9.2 33.8 12.8 Q32.6 9.4 30.4 8.8 Q31.6 12.6 30.6 15.6 Q29.4 11.4 26.6 9.6 Q24 9.4 22.4 11.2 Q21.6 13 21.6 15 Z'
// The full dark beard along the jaw and round the chin, the moustache over the lip.
const BEARD = 'M21.8 17.6 Q22.6 22.6 26 24.4 Q30.4 25.4 32.2 21.2 Q32.8 19.4 32.4 18.4 Q30.6 19.6 28.8 19.2 Q26.4 19.8 24.4 18.6 Q23 17.2 21.8 17.6 Z'
const MOUSTACHE = 'M28.4 18.6 Q30.8 17.6 32.8 18.2 Q31.4 19.6 28.4 19.4 Z'
const NECK = 'M23.4 22 H29 V27.4 H23.4 Z'

const JACKET = 'M16.6 29 Q18 25.8 24 25.6 Q30.6 25.8 33.6 29 L34 52.6 Q25 54.6 16.8 52.6 Z'
const VEST = 'M18.6 28.6 Q24.6 26.6 31.6 28.6 L32 54.4 H18.4 Z'
const COLLAR = 'M18 28.8 Q19.4 23.8 24.6 24.6 Q30.6 23.8 32.8 28.4 Q30.6 31.4 28.2 37 L26.4 30.6 L24.2 37.2 Q21.6 31.6 18 28.8 Z'

// The chest rig: a strap from the front shoulder to the back hip, the knife upside down on it.
const RIG = (
  <>
    <path d="M30.6 28 L19.4 50.6 L21.6 51.6 L32.6 29.2 Z" fill={SH.strap} />
    <rect x={26.2} y={33.4} width={2.6} height={8.6} rx={0.6} transform="rotate(-26 27.5 37.7)" fill={SH.boot} />
    <rect x={27.4} y={30.2} width={1.4} height={3.4} transform="rotate(-26 28 32)" fill={SH.steel} />
  </>
)

// The mongkhon: one wound cord across the brow, knotted behind with its tail standing out.
const MONGKHON = (
  <>
    <path d="M19.6 10.4 Q26 7.6 33 10.2" fill="none" stroke={SH.ivory} strokeWidth={1.6} strokeLinecap="round" />
    <path d="M19.6 10.4 Q26 7.6 33 10.2" fill="none" stroke={SH.rust} strokeWidth={0.5} strokeDasharray="1 1.2" />
    <path d="M19.8 10.6 Q15.4 8 14 3.6 Q16.8 6.4 20.4 9.2 Z" fill={SH.ivory} />
  </>
)

interface Kit {
  torso: (leather: string) => ReactNode
  sleeve: (leather: string) => string
  hand: 'gun' | 'stick' | 'wrap'
  headwear: ReactNode
}

const BOMBER = (leather: string) => (
  <>
    <path d={JACKET} fill={leather} />
    <path d="M24.8 30 L25.6 52.6 L28 52.4 L27.4 30 Z" fill={SH.top} />
    <rect x={16.8} y={50.4} width={17.2} height={2.6} fill={SH.bomberShade} />
    {RIG}
    <path d={COLLAR} fill={SH.fur} />
    <path d="M19.4 28.8 Q22.4 30 24.2 35.4 M31.4 28.8 Q29 31.4 27.6 35" stroke={SH.furShade} strokeWidth={0.7} fill="none" />
  </>
)

const KIT: Record<Profession, Kit> = {
  engineer: { torso: BOMBER, sleeve: (leather) => leather, hand: 'gun', headwear: null },
  drummer: { torso: BOMBER, sleeve: (leather) => leather, hand: 'stick', headwear: null },
  fighter: {
    torso: () => (
      <>
        <path d={VEST} fill={SH.top} />
        <path d="M21 28 Q24.6 31.6 29.6 28" stroke={SH.cargoShade} strokeWidth={0.8} fill="none" />
      </>
    ),
    sleeve: () => ID.skin,
    hand: 'wrap',
    headwear: MONGKHON,
  },
}

// Joints in viewBox units: shoulders and elbows per arm, hips and knees per leg, the lean and the neck.
const BACK_X = 19.4
const FRONT_X = 30.6
const BACK_LEG_X = 22
const FRONT_LEG_X = 27
const SHOULDER_Y = 30.5
const ELBOW_Y = 44
const HIP_Y = 56
const KNEE_Y = 79
const LEAN_AT = [25, 55] as const
const NECK_AT = [26, 25] as const

// The fist at the end of the forearm (local frame, the arm hanging), a glove or a wrap.
function Fist({ x, wrapped }: { x: number; wrapped: boolean }) {
  if (wrapped) return <circle cx={x} cy={57.6} r={2.4} fill={SH.cream} />
  return (
    <>
      <circle cx={x} cy={57.6} r={2} fill={SH.top} />
      <circle cx={x + 0.9} cy={58.6} r={0.8} fill={ID.skin} />
    </>
  )
}

const PROFESSION_ITEM: Record<Profession, (x: number) => ReactNode> = {
  engineer: (x) => (
    <>
      <rect x={x - 5} y={58} width={10} height={7} rx={0.8} fill={SH.gunmetal} />
      <rect x={x - 4} y={59} width={8} height={5} fill={SH.monitor} />
      <path d={`M${x - 3} 60.6 H${x + 2} M${x - 3} 62.4 H${x + 3}`} stroke={SH.fine} strokeWidth={0.5} />
    </>
  ),
  drummer: (x) => <path d={`M${x - 4} 66 L${x + 3} 56 M${x + 4} 66 L${x - 3} 56`} stroke={SH.brass} strokeWidth={1} strokeLinecap="round" />,
  fighter: (x) => <rect x={x - 2.4} y={58} width={4.8} height={8} rx={2} fill={SH.cream} />,
}

// What the front hand holds, drawn in the forearm's frame so it turns with the hand.
function FrontHold({ hold, kit, profession, x, laser }: { hold: Hold; kit: Kit; profession: Profession; x: number; laser: boolean }) {
  const shown = hold === 'kit' ? kit.hand : hold
  const wrapped = kit.hand === 'wrap'
  const HOLDS: Record<Exclude<Hold, 'kit'> | Kit['hand'], ReactNode> = {
    gun: (
      <>
        <rect x={x - 3.4} y={57} width={3} height={4.4} rx={0.6} fill={SH.gunmetal} />
        <rect x={x - 1.4} y={57.6} width={2.8} height={9.6} rx={0.5} fill={SH.gunmetal} />
        <rect x={x - 0.6} y={58} width={0.8} height={8.8} fill={SH.steel} />
        {laser && (
          <>
            <line x1={x} y1={67.4} x2={x} y2={600} stroke={SH.laser} strokeWidth={0.5} opacity={0.75} />
            <circle cx={x} cy={600} r={1.6} fill={SH.laser} />
          </>
        )}
      </>
    ),
    stick: <line x1={x} y1={56} x2={x + 1} y2={72} stroke={SH.brass} strokeWidth={1.1} strokeLinecap="round" />,
    wrap: null,
    paper: (
      <>
        <rect x={x - 1} y={50} width={11} height={14} fill={SH.ivory} transform={`rotate(-12 ${x} 57)`} />
        <path d={`M${x + 1} 53 H${x + 8} M${x + 1} 56 H${x + 7} M${x + 1} 59 H${x + 8}`} stroke={SH.ash} strokeWidth={0.5} transform={`rotate(-12 ${x} 57)`} />
      </>
    ),
    key: (
      <>
        <rect x={x - 0.5} y={57.6} width={1} height={6} fill={SH.brass} />
        <rect x={x - 0.5} y={62} width={2.4} height={1} fill={SH.brass} />
      </>
    ),
    item: PROFESSION_ITEM[profession](x),
    bare: null,
  }
  return (
    <>
      {HOLDS[shown]}
      <Fist x={x} wrapped={wrapped} />
    </>
  )
}

const MAGAZINE = (x: number) => <rect x={x - 1} y={57} width={2.2} height={6} rx={0.4} fill={SH.gunmetal} />

function UpperArm({ x, fill }: { x: number; fill: string }) {
  return <rect x={x - 2.4} y={28.6} width={4.8} height={17} rx={2.4} fill={fill} />
}

function Forearm({ x, fill, cuff }: { x: number; fill: string; cuff: boolean }) {
  return (
    <>
      <rect x={x - 2.1} y={42} width={4.2} height={14.6} rx={2} fill={fill} />
      {cuff && <rect x={x - 2.3} y={52.6} width={4.6} height={2.4} rx={0.8} fill={SH.fur} />}
    </>
  )
}

function Thigh({ x, fill, holster }: { x: number; fill: string; holster: boolean }) {
  return (
    <>
      <rect x={x - 3.1} y={54.6} width={6.2} height={26} rx={2.6} fill={fill} />
      <rect x={x - 2.6} y={66} width={4} height={6} rx={0.6} fill={SH.cargoShade} />
      {holster && (
        <>
          <rect x={x - 3.4} y={60.6} width={6.8} height={1.6} fill={SH.strap} />
          <rect x={x + 0.6} y={58.4} width={3.6} height={11} rx={1} fill={SH.strap} />
          <rect x={x + 1.2} y={56.8} width={2.6} height={2.6} fill={SH.gunmetal} />
        </>
      )}
    </>
  )
}

function Shin({ x, fill }: { x: number; fill: string }) {
  return (
    <>
      <rect x={x - 2.8} y={78} width={5.6} height={24} rx={2.4} fill={fill} />
      <path d={`M${x - 3.2} 100.4 H${x + 2.6} Q${x + 7} 104 ${x + 6.6} 110 H${x - 3.2} Z`} fill={SH.boot} />
      <rect x={x - 3.2} y={108.6} width={9.8} height={1.4} fill={SH.void} />
    </>
  )
}

interface SurvivorProps {
  profession: Profession
  pose: HeroPose
  // The laser sight is on (the hall's aim), and the arms follow the visitor's pointer.
  laser?: boolean
  className?: string
}

export function Survivor({ profession, pose: poseName, laser = false, className = '' }: SurvivorProps) {
  const id = useId().replace(/:/g, '')
  const kit = KIT[profession]
  const row = HERO_POSES[poseName]
  const leather = `url(#${id}-leather)`
  const backSleeve = kit.sleeve(SH.bomberShade)
  const frontSleeve = kit.sleeve(leather)
  const cuffed = kit.hand !== 'wrap'
  const showLaser = laser && kit.hand === 'gun' && row.hold !== 'paper'
  const follow = showLaser ? rig.follow : ''

  const backArm = (
    <g className={follow}>
      <Limb
        root={[BACK_X, SHOULDER_Y]}
        mid={[BACK_X, ELBOW_Y]}
        angles={row.backArm}
        upper={<UpperArm x={BACK_X} fill={backSleeve} />}
        lower={
          <>
            <Forearm x={BACK_X} fill={backSleeve} cuff={cuffed} />
            {row.backHold === 'mag' && MAGAZINE(BACK_X)}
            {kit.hand === 'stick' && row.hold === 'kit' && row.backHold === 'none' && (
              <line x1={BACK_X} y1={56} x2={BACK_X + 1} y2={72} stroke={SH.brass} strokeWidth={1.1} strokeLinecap="round" />
            )}
            <Fist x={BACK_X} wrapped={!cuffed} />
          </>
        }
      />
    </g>
  )

  const frontArm = (
    <g className={follow}>
      <Limb
        root={[FRONT_X, SHOULDER_Y]}
        mid={[FRONT_X, ELBOW_Y]}
        angles={row.frontArm}
        upper={<UpperArm x={FRONT_X} fill={frontSleeve} />}
        lower={
          <>
            <Forearm x={FRONT_X} fill={frontSleeve} cuff={cuffed} />
            <FrontHold hold={row.hold} kit={kit} profession={profession} x={FRONT_X} laser={showLaser} />
          </>
        }
      />
    </g>
  )

  return (
    <svg viewBox="0 0 48 112" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-leather`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SH.bomberLit} />
          <stop offset="55%" stopColor={SH.bomber} />
          <stop offset="100%" stopColor={SH.bomberShade} />
        </linearGradient>
        <linearGradient id={`${id}-cargo`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SH.cargo} />
          <stop offset="100%" stopColor={SH.cargoShade} />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ID.skinShade} />
          <stop offset="45%" stopColor={ID.skin} />
          <stop offset="100%" stopColor={ID.skin} />
        </linearGradient>
      </defs>
      <ellipse cx={25} cy={110} rx={12} ry={1.6} fill={SH.void} opacity={0.6} />
      <Drop by={row.drop}>
        <Joint at={LEAN_AT} angle={row.lean}>
          {backArm}
        </Joint>
        <Limb
          root={[BACK_LEG_X, HIP_Y]}
          mid={[BACK_LEG_X, KNEE_Y]}
          angles={row.backLeg}
          upper={<Thigh x={BACK_LEG_X} fill={SH.cargoShade} holster={false} />}
          lower={<Shin x={BACK_LEG_X} fill={SH.cargoShade} />}
        />
        <Joint at={LEAN_AT} angle={row.lean}>
          <Breath at={LEAN_AT}>
            <path d="M18 28 Q24 26 32 28 L32.4 54 H18.2 Z" fill={ID.skin} />
            {kit.torso(leather)}
            <rect x={17} y={52.6} width={17} height={3} fill={SH.strap} />
            <path d={NECK} fill={ID.skinShade} />
            <Joint at={NECK_AT} angle={row.head}>
              <path d={HEAD} fill={`url(#${id}-skin)`} />
              <path d={EAR} fill={ID.skinShade} />
              <path d={BEARD} fill={ID.beard} />
              <path d={MOUSTACHE} fill={ID.beard} />
              <ellipse cx={29.4} cy={14.2} rx={1} ry={1.3} fill={ID.eyes} />
              <path d="M27.6 12 Q29.6 11 31.4 12" stroke={ID.hair} strokeWidth={0.8} fill="none" />
              <path d="M32.4 12.6 L34.2 16.4 L32.4 17" fill={ID.skinShade} />
              <path d={HAIR} fill={ID.hair} />
              {kit.headwear}
            </Joint>
          </Breath>
        </Joint>
        <Limb
          root={[FRONT_LEG_X, HIP_Y]}
          mid={[FRONT_LEG_X, KNEE_Y]}
          angles={row.frontLeg}
          upper={<Thigh x={FRONT_LEG_X} fill={`url(#${id}-cargo)`} holster />}
          lower={<Shin x={FRONT_LEG_X} fill={`url(#${id}-cargo)`} />}
        />
        <Joint at={LEAN_AT} angle={row.lean}>
          {frontArm}
        </Joint>
      </Drop>
    </svg>
  )
}
