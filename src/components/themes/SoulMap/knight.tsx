import { memo, useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import { SOUL } from './palette'
import knight from './knight.module.css'

// Him as this world's knight, the heavy armoured warrior of the dark action game the world comes from: an
// iron helm, leather and mail, a plain dusk blue surcoat, a straight sword and a heater shield.
// Painted, not outlined: steel, mail, leather and the one saturated blue, lit by gradients, heavy and
// seven heads tall.
//
// The helm stays on with its visor hinged up: with the visor up his face shows under it, his eyes, his
// nose and the full dark beard, in his own colours (HERO_IDENTITY). The Martial Artist takes the helm off
// and wears the mongkhon on his bare head.
//
// Gear per profession:
// - engineer: a straight sword, the shield kept on the arm.
// - drummer: two drum mallets, the shield slung on his back.
// - fighter: no helm, no shield, no sword: red hand wraps and the mongkhon.
//
// He faces right, so his left side, the shield arm, is the near one. Every limb is two groups, upper and
// lower, each turning round its own joint (knight.module.css), and what the far hand holds turns in its
// grip at the hand, so a theatre scene's writer (pose.ts) poses him on the shared rig with transforms
// only: the blade ahead, point down for a plunge, or up. viewBox 60 by 96, feet on y 95.

/** His box: the viewBox's size and the y his soles stand on. */
export const KNIGHT_VIEW = { width: 60, height: 96, soles: 95 } as const

interface Ink {
  steelLight: string
  steel: string
  steelDark: string
  mail: string
  leather: string
  leatherDark: string
  surcoat: string
  surcoatDark: string
  skin: string
  skinShade: string
  hair: string
  beard: string
  eyes: string
  wraps: string
}

const STEEL_INK: Ink = {
  steelLight: SOUL.steelLight,
  steel: SOUL.steel,
  steelDark: SOUL.steelDark,
  mail: SOUL.mail,
  leather: SOUL.leather,
  leatherDark: SOUL.leatherDark,
  surcoat: SOUL.surcoat,
  surcoatDark: SOUL.surcoatDark,
  skin: HERO_IDENTITY.skin,
  skinShade: HERO_IDENTITY.skinShade,
  hair: HERO_IDENTITY.hair,
  beard: HERO_IDENTITY.beard,
  eyes: HERO_IDENTITY.eyes,
  wraps: SOUL.wraps,
}

interface Paint {
  ink: Ink
  steelFill: string
  coatFill: string
}

// ---- hand items, drawn hanging from the hand at (hx, 53.5) and turned forward ----

const HAND_Y = 53.5

// The straight sword: the grip and pommel in the fist, the crossguard, and the blade with its lit edge.
function Sword({ x, paint }: { x: number; paint: Paint }) {
  return (
    <g transform={`rotate(-80 ${x} ${HAND_Y})`}>
      <circle cx={x} cy={HAND_Y - 3.2} r={1.1} fill={paint.ink.steelDark} />
      <rect x={x - 0.6} y={HAND_Y - 2.4} width={1.2} height={4.2} fill={paint.ink.leatherDark} />
      <rect x={x - 3.4} y={HAND_Y + 1.6} width={6.8} height={1.3} rx={0.5} fill={paint.ink.steelDark} />
      <path d={`M${x - 1.1} ${HAND_Y + 2.9} H${x + 1.1} V${HAND_Y + 24} L${x} ${HAND_Y + 26.4} L${x - 1.1} ${HAND_Y + 24} Z`} fill={paint.ink.steel} />
      <path d={`M${x + 0.15} ${HAND_Y + 3} V${HAND_Y + 25}`} stroke={paint.ink.steelLight} strokeWidth={0.5} />
    </g>
  )
}

function Mallet({ x, paint }: { x: number; paint: Paint }) {
  return (
    <g transform={`rotate(-70 ${x} ${HAND_Y})`}>
      <rect x={x - 0.5} y={HAND_Y - 1.5} width={1} height={10} fill={paint.ink.leather} />
      <circle cx={x} cy={HAND_Y + 9.2} r={1.9} fill={paint.ink.leatherDark} />
    </g>
  )
}

function Gauntlet({ x, paint, wrapped }: { x: number; paint: Paint; wrapped: boolean }) {
  const fill = wrapped ? paint.ink.wraps : paint.ink.steelDark
  return <circle cx={x} cy={HAND_Y} r={wrapped ? 2.6 : 2.3} fill={fill} />
}

// The heater shield strapped to the near forearm: steel face, a darker rim, the boss and a centre ridge.
function HeaterShield({ paint }: { paint: Paint }) {
  return (
    <g>
      <path d="M29.4 38.6 Q36 36.6 43 38.6 Q43.6 53 36.2 62.4 Q28.6 53 29.4 38.6 Z" fill={paint.ink.steelDark} />
      <path d="M30.6 39.6 Q36 38 41.8 39.6 Q42.2 52.4 36.2 60.4 Q30 52.4 30.6 39.6 Z" fill={paint.steelFill} />
      <line x1={36.2} y1={39} x2={36.2} y2={59.6} stroke={paint.ink.steelDark} strokeWidth={0.6} />
      <circle cx={36.2} cy={46} r={1.6} fill={paint.ink.steelDark} />
    </g>
  )
}

// The same shield seen from behind, slung across his back (the Musician needs both hands).
function SlungShield({ paint }: { paint: Paint }) {
  return <path d="M19.6 33 Q25 31.4 30.6 33 Q31 45 25.2 52.6 Q19.2 45 19.6 33 Z" fill={paint.ink.steelDark} />
}

// ---- the head: the helm with its visor up over his face, or his bare head with the mongkhon ----

function Face({ ink }: { ink: Ink }) {
  return (
    <>
      <path d="M31 14 H38.2 Q39.4 18.5 38.6 22.5 L37.6 27 H31 Z" fill={ink.skin} />
      <path d="M31 14 H33 V27 H31 Z" fill={ink.skinShade} opacity={0.6} />
      <ellipse cx={35.8} cy={17.9} rx={0.75} ry={1} fill={ink.eyes} />
      <line x1={34.6} y1={16.3} x2={37.3} y2={16.1} stroke={ink.hair} strokeWidth={0.7} strokeLinecap="round" />
      <path d="M38.2 18 L39.7 20.7 L38.3 21.1 Z" fill={ink.skinShade} />
      <path d="M30.6 20.6 Q34.6 22.3 38.8 21.4 Q39.7 25 37.8 28.1 Q34.4 30.6 30.6 29 Z" fill={ink.beard} />
    </>
  )
}

function HelmedHead({ paint }: { paint: Paint }) {
  const { ink } = paint
  return (
    <>
      <Face ink={ink} />
      <path d="M23.4 22.5 Q22.2 9.5 30.6 8 Q37.8 8.2 39 13.4 V14.2 H31.8 Q30.6 14.2 30.6 15.6 V27.6 H26.4 Q23.6 26.6 23.4 22.5 Z" fill={paint.steelFill} />
      <path d="M24.6 12.6 Q30 7.2 38 10.6" fill="none" stroke={ink.steelLight} strokeWidth={0.7} opacity={0.7} />
      <circle cx={27.4} cy={20.6} r={0.55} fill={ink.steelDark} />
      <circle cx={27.4} cy={24} r={0.55} fill={ink.steelDark} />
      <path d="M29.6 8.6 L40.8 6.6 Q42.4 8 41.4 9.8 L30.8 11.8 Z" fill={ink.steelDark} />
      <line x1={31.6} y1={9.9} x2={40.2} y2={8.3} stroke={SOUL.ink} strokeWidth={0.5} />
    </>
  )
}

function BareHead({ paint }: { paint: Paint }) {
  const { ink } = paint
  return (
    <>
      <path d="M24.4 18 Q24 11.4 31 11 Q38 11.2 38.6 16 Q39.6 19 38.6 22.5 L37.6 27 H27 Q24.6 24 24.4 18 Z" fill={ink.skin} />
      <path d="M24.2 19.4 Q23.4 10.2 31 9.6 Q38.2 9.6 38.9 14.8 L37 13.8 Q34 12.6 31.2 13.6 L29.8 17.4 Q27.4 16 26.2 20 Z" fill={ink.hair} />
      <ellipse cx={28.6} cy={19.6} rx={1.2} ry={1.7} fill={ink.skinShade} />
      <Face ink={ink} />
      <path d="M27 21.6 Q29 23 31 22.4 V29.4 Q28.4 28.6 27 21.6 Z" fill={ink.beard} />
      {/* the mongkhon: the corded ring round his head, its tail standing up behind */}
      <path d="M24 15.2 Q31 12 38.6 14.4" fill="none" stroke={SOUL.cord} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M24 15.2 Q31 12 38.6 14.4" fill="none" stroke={ink.wraps} strokeWidth={1.6} strokeDasharray="1.2 1.4" strokeLinecap="round" />
      <path d="M24.6 15.4 Q20 13.2 18.8 8.8 Q21.8 11.8 25.2 13.2 Z" fill={SOUL.cord} />
    </>
  )
}

// ---- limbs ----

function Leg({ hipX, paint, thigh, shin }: { hipX: number; paint: Paint; thigh: string; shin: string }) {
  const { ink } = paint
  return (
    <g className={thigh}>
      <rect x={hipX - 3} y={61} width={6} height={15.4} rx={2.6} fill={ink.mail} />
      <g className={shin}>
        <rect x={hipX - 2.6} y={76} width={5.2} height={15} rx={2} fill={paint.steelFill} />
        <path d={`M${hipX - 3} 90 H${hipX + 3.4} Q${hipX + 7.4} 91.6 ${hipX + 7} 95 H${hipX - 3} Z`} fill={ink.leatherDark} />
      </g>
      <circle cx={hipX} cy={76.4} r={2.6} fill={ink.steelDark} />
    </g>
  )
}

interface ArmProps {
  shoulderX: number
  paint: Paint
  upper: string
  fore: string
  pauldron?: boolean
  children?: ReactNode
}

function Arm({ shoulderX, paint, upper, fore, pauldron = false, children }: ArmProps) {
  const { ink } = paint
  const elbowX = shoulderX + 0.5
  return (
    <g className={upper}>
      <rect x={shoulderX - 2.4} y={31} width={5} height={12.4} rx={2.4} fill={ink.leather} />
      <g className={fore}>
        <rect x={elbowX - 2.4} y={42} width={4.8} height={10.6} rx={2} fill={paint.steelFill} />
        <circle cx={elbowX} cy={43} r={2.2} fill={ink.steelDark} />
        {children}
      </g>
      {pauldron && <path d="M28.4 33.4 Q28.8 27 34 27.2 Q39.2 28 38.8 34.2 Q34 32.4 28.4 33.4 Z" fill={paint.steelFill} />}
    </g>
  )
}

// ---- the gear each look carries in each hand ----

const FAR_X = 27.6
const NEAR_X = 33.6

interface Gear {
  helm: boolean
  shield: 'arm' | 'back' | 'none'
  far: (paint: Paint) => ReactNode
  near: (paint: Paint) => ReactNode
}

const GEAR: Record<Profession, Gear> = {
  engineer: {
    helm: true,
    shield: 'arm',
    far: (paint) => (
      <>
        <Sword x={FAR_X} paint={paint} />
        <Gauntlet x={FAR_X} paint={paint} wrapped={false} />
      </>
    ),
    near: (paint) => <Gauntlet x={NEAR_X} paint={paint} wrapped={false} />,
  },
  drummer: {
    helm: true,
    shield: 'back',
    far: (paint) => (
      <>
        <Mallet x={FAR_X} paint={paint} />
        <Gauntlet x={FAR_X} paint={paint} wrapped={false} />
      </>
    ),
    near: (paint) => (
      <>
        <Mallet x={NEAR_X} paint={paint} />
        <Gauntlet x={NEAR_X} paint={paint} wrapped={false} />
      </>
    ),
  },
  fighter: {
    helm: false,
    shield: 'none',
    far: (paint) => <Gauntlet x={FAR_X} paint={paint} wrapped />,
    near: (paint) => <Gauntlet x={NEAR_X} paint={paint} wrapped />,
  },
}

interface KnightProps {
  profession: Profession
  box?: { width: number; height: number }
  className?: string
}

// Memoised on its plain props, so a parent render that leaves his outfit and box as they are does not
// redraw him under the writer's transforms.
export const Knight = memo(function Knight({ profession, box, className = '' }: KnightProps) {
  const id = useId()
  const paint: Paint = { ink: STEEL_INK, steelFill: `url(#${id}-steel)`, coatFill: `url(#${id}-coat)` }
  const look = GEAR[profession]

  return (
    <svg
      viewBox={`0 0 ${KNIGHT_VIEW.width} ${KNIGHT_VIEW.height}`}
      {...box}
      className={`${knight.sprite} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor={STEEL_INK.steelDark} />
          <stop offset="0.45" stopColor={STEEL_INK.steel} />
          <stop offset="0.75" stopColor={STEEL_INK.steelLight} />
          <stop offset="1" stopColor={STEEL_INK.steel} />
        </linearGradient>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={STEEL_INK.surcoat} />
          <stop offset="1" stopColor={STEEL_INK.surcoatDark} />
        </linearGradient>
      </defs>
      <ellipse cx={31} cy={95.2} rx={12} ry={1.6} fill={SOUL.ink} opacity={0.5} />
      <g className={knight.whole}>
        <Arm shoulderX={27} paint={paint} upper={knight.armFar} fore={knight.foreFar}>
          <g className={knight.grip}>{look.far(paint)}</g>
        </Arm>
        <Leg hipX={27} paint={paint} thigh={knight.legFar} shin={knight.shinFar} />
        <g>
          {look.shield === 'back' && <SlungShield paint={paint} />}
          <path d="M22.4 54 H38.6 L40 70 H21 Z" fill={STEEL_INK.mail} />
          <path d="M23 50 H38 L40.6 69 Q35 71 31 68.4 Q27 71 20.4 69 Z" fill={paint.coatFill} />
          <path d="M22.4 31 Q30 28.4 38 31 Q39.6 40 38.4 50 H23.2 Q21.6 40 22.4 31 Z" fill={paint.steelFill} />
          <path d="M25 33 Q30.6 31.6 36 33 L36.6 50 H24.6 Z" fill={paint.coatFill} />
          <rect x={22.8} y={48.4} width={16} height={2.6} rx={0.6} fill={STEEL_INK.leatherDark} />
          <rect x={29.6} y={48.2} width={2.6} height={3} fill={STEEL_INK.steel} />
          <path d="M25.4 26 H36 L37 31.6 H24.4 Z" fill={STEEL_INK.mail} />
          <g>{look.helm ? <HelmedHead paint={paint} /> : <BareHead paint={paint} />}</g>
        </g>
        <Leg hipX={33} paint={paint} thigh={knight.legNear} shin={knight.shinNear} />
        <Arm shoulderX={33} paint={paint} upper={knight.armNear} fore={knight.foreNear} pauldron>
          {look.shield === 'arm' && <HeaterShield paint={paint} />}
          {look.near(paint)}
        </Arm>
      </g>
    </svg>
  )
})
