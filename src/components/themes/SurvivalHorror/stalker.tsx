import { useId } from 'react'
import { Breath, Joint, Limb } from './rig'
import { SH } from './palette'

// The pursuer of the 1999 sequel (Nemesis, named here in code only), drawn from the series' renders: about
// one and a half times his height, the shoulders very wide and the head small on them, a black coat to below
// the knee closed by straps with brass buckles, black gloves, heavy boots, the olive launcher slung across
// his back, and the bald grey head with its stitched scalp, one pale eye and the bared teeth where the lip
// is gone. Built on the same rig as him (./rig) and drawn facing right; the stage flips him to face left.
// A pose is a row of angles in STALKER_POSES. viewBox units: 80 by 160, feet on y 158.

interface PoseRow {
  lean: number
  head: number
  backArm: readonly [number, number]
  frontArm: readonly [number, number]
  backLeg: readonly [number, number]
  frontLeg: readonly [number, number]
}

const STAND: PoseRow = { lean: 2, head: 4, backArm: [4, -6], frontArm: [-4, -8], backLeg: [2, 2], frontLeg: [-2, 2] }

const pose = (row: Partial<PoseRow>): PoseRow => ({ ...STAND, ...row })

export const STALKER_POSES = {
  stand: STAND,
  walkA: pose({ lean: 4, backArm: [-14, -10], frontArm: [16, -6], backLeg: [14, 8], frontLeg: [-16, 4] }),
  walkB: pose({ lean: 4, backArm: [16, -6], frontArm: [-14, -10], backLeg: [-16, 4], frontLeg: [14, 10] }),
  reach: pose({ lean: 8, head: 6, frontArm: [-80, -10], backArm: [-10, -20] }),
  raise: pose({ lean: -6, head: -6, frontArm: [-160, -20], backArm: [-20, -20] }),
  pound: pose({ lean: 12, head: 8, frontArm: [-70, -10], backArm: [-10, -20] }),
  stagger: pose({ lean: -18, head: -14, frontArm: [30, -20], backArm: [40, -30], backLeg: [10, 6], frontLeg: [-24, 10] }),
  chargeA: pose({ lean: 16, frontArm: [40, -70], backArm: [-50, -80], frontLeg: [-45, 25], backLeg: [25, 70] }),
  chargeB: pose({ lean: 16, frontArm: [-50, -80], backArm: [40, -70], frontLeg: [25, 70], backLeg: [-45, 25] }),
} satisfies Record<string, PoseRow>

export type StalkerPose = keyof typeof STALKER_POSES

const BACK_X = 30
const FRONT_X = 52
const BACK_LEG_X = 35
const FRONT_LEG_X = 46
const SHOULDER_Y = 42
const ELBOW_Y = 68
const HIP_Y = 92
const KNEE_Y = 122
const LEAN_AT = [41, 92] as const
const NECK_AT = [44, 34] as const

function Arm({ x, fill, angles }: { x: number; fill: string; angles: readonly [number, number] }) {
  return (
    <Limb
      root={[x, SHOULDER_Y]}
      mid={[x, ELBOW_Y]}
      angles={angles}
      upper={
        <>
          <rect x={x - 6.5} y={36} width={13} height={36} rx={6} fill={fill} />
          <rect x={x - 6.5} y={56} width={13} height={2.4} fill={SH.strap} />
        </>
      }
      lower={
        <>
          <rect x={x - 5.5} y={64} width={11} height={30} rx={5} fill={fill} />
          <rect x={x - 5.8} y={86} width={11.6} height={3} fill={SH.strap} />
          <rect x={x - 1.4} y={86.4} width={2.8} height={2.2} fill={SH.brass} />
          <circle cx={x} cy={98} r={6.6} fill={SH.top} />
          <path d={`M${x - 4} 101 Q${x} 104 ${x + 4} 101`} stroke={SH.coatLit} strokeWidth={0.8} fill="none" />
        </>
      }
    />
  )
}

function Leg({ x, fill, angles }: { x: number; fill: string; angles: readonly [number, number] }) {
  return (
    <Limb
      root={[x, HIP_Y]}
      mid={[x, KNEE_Y]}
      angles={angles}
      upper={<rect x={x - 6} y={88} width={12} height={36} rx={5} fill={fill} />}
      lower={
        <>
          <rect x={x - 5.5} y={120} width={11} height={30} rx={4} fill={fill} />
          <path d={`M${x - 6.4} 146 H${x + 5} Q${x + 13} 149 ${x + 12.6} 158 H${x - 6.4} Z`} fill={SH.boot} />
          <rect x={x - 6.4} y={155.6} width={19} height={2.4} fill={SH.void} />
        </>
      }
    />
  )
}

// The coat's straps across the chest, each with its buckle.
const STRAPS = [52, 62, 72, 82]

export function Stalker({ pose: poseName, className = '' }: { pose: StalkerPose; className?: string }) {
  const id = useId().replace(/:/g, '')
  const row = STALKER_POSES[poseName]
  const coat = `url(#${id}-coat)`

  return (
    <svg viewBox="0 0 80 160" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SH.coatLit} />
          <stop offset="60%" stopColor={SH.coat} />
          <stop offset="100%" stopColor={SH.void} />
        </linearGradient>
        <radialGradient id={`${id}-head`} cx="0.6" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={SH.fog} />
          <stop offset="70%" stopColor={SH.stalkerSkin} />
          <stop offset="100%" stopColor={SH.ash} />
        </radialGradient>
      </defs>
      <ellipse cx={42} cy={158} rx={26} ry={2.6} fill={SH.void} opacity={0.7} />
      <Joint at={LEAN_AT} angle={row.lean}>
        {/* the launcher slung across his back */}
        <g transform="rotate(-34 22 70)">
          <rect x={16} y={26} width={11} height={84} rx={3} fill={SH.launcher} />
          <rect x={17.4} y={28} width={2.6} height={80} fill={SH.launcherLit} />
          <rect x={14.6} y={24} width={13.8} height={7} rx={2} fill={SH.launcherLit} />
          <rect x={14.6} y={102} width={13.8} height={7} rx={2} fill={SH.launcher} />
        </g>
        <Arm x={BACK_X} fill={SH.coat} angles={row.backArm} />
      </Joint>
      <Leg x={BACK_LEG_X} fill={SH.coat} angles={row.backLeg} />
      <Leg x={FRONT_LEG_X} fill={SH.top} angles={row.frontLeg} />
      <Joint at={LEAN_AT} angle={row.lean}>
        <Breath at={LEAN_AT}>
          {/* the coat, very wide at the shoulders, to below the knee, split at the front */}
          <path d="M16 46 Q20 34 42 33 Q64 34 68 48 L64 94 L67 136 Q44 142 18 136 L21 94 Z" fill={coat} />
          <path d="M46 94 L48 138" stroke={SH.void} strokeWidth={1.4} />
          <path d="M34 36 Q44 46 56 36 L58 42 Q44 52 32 42 Z" fill={SH.coatLit} />
          {STRAPS.map((y) => (
            <g key={y}>
              <path d={`M19 ${y} Q42 ${y + 4} 66 ${y - 2}`} stroke={SH.strap} strokeWidth={3.2} fill="none" />
              <rect x={45} y={y - 0.6} width={5} height={4.4} fill={SH.brass} />
            </g>
          ))}
          <path d="M22 40 L60 88" stroke={SH.strap} strokeWidth={3.6} />
          {/* the high collar and the bald stitched head on it */}
          <path d="M34 40 Q36 30 44 30 Q53 30 55 38 Q46 44 34 40 Z" fill={SH.coat} />
          <Joint at={NECK_AT} angle={row.head}>
            <path d="M35 30 Q33 15 44 13 Q56 13 55.6 26 Q55.4 35 47 37 Q38 37.4 35 30 Z" fill={`url(#${id}-head)`} />
            <path d="M37 19 Q44 13.6 53 17.4" stroke={SH.ash} strokeWidth={1.2} fill="none" />
            <path d="M39 16.4 L40 19.2 M43 14.6 L43.6 17.6 M47 14.6 L46.8 17.6 M51 16 L50 18.6" stroke={SH.ash} strokeWidth={0.8} />
            <ellipse cx={51} cy={23} rx={1.6} ry={1.1} fill={SH.ivory} />
            <path d="M48.6 21 Q51 20 53.6 21.4" stroke={SH.ash} strokeWidth={0.9} fill="none" />
            {/* the bared teeth where the lip is gone */}
            <path d="M46 28.4 H55.4 Q55.6 33 52 34 H46.6 Q45.6 31 46 28.4 Z" fill={SH.gums} />
            <rect x={46.8} y={29.2} width={8} height={3.6} fill={SH.ivory} />
            <path d="M48.4 29.2 V32.8 M50 29.2 V32.8 M51.6 29.2 V32.8 M53.2 29.2 V32.8 M46.8 31 H54.8" stroke={SH.ash} strokeWidth={0.4} />
          </Joint>
        </Breath>
      </Joint>
      <Joint at={LEAN_AT} angle={row.lean}>
        <Arm x={FRONT_X} fill={coat} angles={row.frontArm} />
      </Joint>
    </svg>
  )
}
