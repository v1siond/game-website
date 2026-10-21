import { useId, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'
import { SH } from './palette'
import sprite from './survivor.module.css'

// Him as this world's character, a parody of the 2005 survival horror hero (Leon in the village game, named here
// in code only): upright and realistic, about seven and a half heads tall, seen three quarters from the side
// and facing right, lit from above left like a pre-rendered room. The brown leather bomber with its cream fur
// collar over a black top, grey cargo trousers and boots, the chest rig with the knife across it, the thigh
// holster and the handgun with its laser sight. He is still himself: his skin, his short dark hair with the
// hero's fringe falling over the eye, his full dark beard (HERO_IDENTITY).
// - System Engineer: the full kit, the handgun in his hand.
// - Musician: the full kit, a stick in each hand, the handgun holstered.
// - Martial Artist: the jacket off, a black vest and bare arms, cream hand wraps, and the mongkhon (the
//   corded ring of a Muay Thai fighter) round his head with its tail behind.
//
// The parts are separate groups (back arm, back leg, body and head, front leg, front arm), each turning
// round its own joint, so survivor.module.css runs every pose with transforms only: idle (breath and blink),
// walk, aim (the arm follows --my from the world root, the laser running out of the muzzle), limp (Danger:
// hunched, a hand on his side), kick (the roundhouse), suplex, and act (one action per profession: typing,
// drumming, the roundhouse at the bag). viewBox units: 48 by 112, feet on y 110.

export type SurvivorPose = 'idle' | 'walk' | 'aim' | 'limp' | 'kick' | 'suplex' | 'act'

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

const BELT = <rect x={17} y={52.6} width={17} height={3} fill={SH.strap} />

interface Kit {
  // The torso drawn over the bare one: the bomber or the vest.
  torso: (fill: string) => ReactNode
  sleeve: (fill: string) => string
  hand: 'gun' | 'stick' | 'wrap'
  headwear: ReactNode
  holster: boolean
}

// The mongkhon: one wound cord across the brow, knotted behind with its tail standing out.
const MONGKHON = (
  <>
    <path d="M19.6 10.4 Q26 7.6 33 10.2" fill="none" stroke={SH.ivory} strokeWidth={1.6} strokeLinecap="round" />
    <path d="M19.6 10.4 Q26 7.6 33 10.2" fill="none" stroke={SH.rust} strokeWidth={0.5} strokeDasharray="1 1.2" />
    <path d="M19.8 10.6 Q15.4 8 14 3.6 Q16.8 6.4 20.4 9.2 Z" fill={SH.ivory} />
  </>
)

const KIT: Record<Profession, Kit> = {
  engineer: {
    torso: (fill) => (
      <>
        <path d={JACKET} fill={fill} />
        <path d="M24.8 30 L25.6 52.6 L28 52.4 L27.4 30 Z" fill={SH.top} />
        <rect x={16.8} y={50.4} width={17.2} height={2.6} fill={SH.bomberShade} />
        {RIG}
        <path d={COLLAR} fill={SH.fur} />
        <path d="M19.4 28.8 Q22.4 30 24.2 35.4 M31.4 28.8 Q29 31.4 27.6 35" stroke={SH.furShade} strokeWidth={0.7} fill="none" />
      </>
    ),
    sleeve: (fill) => fill,
    hand: 'gun',
    headwear: null,
    holster: true,
  },
  drummer: {
    torso: (fill) => KIT.engineer.torso(fill),
    sleeve: (fill) => fill,
    hand: 'stick',
    headwear: null,
    holster: true,
  },
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
    holster: true,
  },
}

// A hand at the end of an arm hanging from its shoulder (local frame, the arm pointing down), with what
// it holds. Turned by the pose, the gun's barrel points along the arm.
const HANDS: Record<Kit['hand'], (x: number, laser: boolean) => ReactNode> = {
  gun: (x, laser) => (
    <>
      <rect x={x - 3.6} y={57} width={3} height={4.4} rx={0.6} fill={SH.gunmetal} />
      <rect x={x - 1.4} y={57.6} width={2.8} height={9.6} rx={0.5} fill={SH.gunmetal} />
      <rect x={x - 0.6} y={58} width={0.8} height={8.8} fill={SH.steel} />
      {laser && (
        <g className={sprite.laser}>
          <line x1={x} y1={67.4} x2={x} y2={420} stroke={SH.laser} strokeWidth={0.5} opacity={0.75} />
          <circle cx={x} cy={420} r={1.6} fill={SH.laser} />
          <circle cx={x} cy={420} r={4} fill={SH.laser} opacity={0.25} />
        </g>
      )}
      <circle cx={x} cy={57.6} r={1.9} fill={ID.skin} />
    </>
  ),
  stick: (x) => (
    <>
      <line x1={x} y1={56} x2={x + 1} y2={72} stroke={SH.brass} strokeWidth={1.1} strokeLinecap="round" />
      <circle cx={x} cy={57.4} r={1.9} fill={ID.skin} />
    </>
  ),
  wrap: (x) => (
    <>
      <circle cx={x} cy={57.6} r={2.4} fill={SH.cream} />
      <path d={`M${x - 2.2} 56.6 H${x + 2.2} M${x - 2.3} 58.4 H${x + 2.3}`} stroke={SH.furShade} strokeWidth={0.4} />
    </>
  ),
}

function Arm({ x, kit, sleeve, laser, className }: { x: number; kit: Kit; sleeve: string; laser: boolean; className: string }) {
  return (
    <g className={className}>
      <rect x={x - 2.4} y={28.6} width={4.8} height={17} rx={2.4} fill={kit.sleeve(sleeve)} />
      <rect x={x - 2.1} y={42} width={4.2} height={14.6} rx={2} fill={kit.sleeve(sleeve)} />
      {kit.hand !== 'wrap' && kit.sleeve(sleeve) !== ID.skin && <rect x={x - 2.2} y={53.4} width={4.4} height={2} fill={SH.bomberShade} />}
      {HANDS[kit.hand](x, laser)}
    </g>
  )
}

function Leg({ x, trousers, holster, className }: { x: number; trousers: string; holster: boolean; className: string }) {
  return (
    <g className={className}>
      <rect x={x - 3.1} y={54.6} width={6.2} height={26} rx={2.6} fill={trousers} />
      <rect x={x - 2.8} y={78} width={5.6} height={24} rx={2.4} fill={trousers} />
      {/* the cargo pocket on the thigh */}
      <rect x={x - 2.6} y={66} width={4} height={6} rx={0.6} fill={SH.cargoShade} />
      {holster && (
        <>
          <rect x={x - 3.4} y={60.6} width={6.8} height={1.6} fill={SH.strap} />
          <rect x={x + 0.6} y={58.4} width={3.6} height={11} rx={1} fill={SH.strap} />
          <rect x={x + 1.2} y={56.8} width={2.6} height={2.6} fill={SH.gunmetal} />
        </>
      )}
      <path d={`M${x - 3.2} 100.4 H${x + 2.6} Q${x + 7} 104 ${x + 6.6} 110 H${x - 3.2} Z`} fill={SH.boot} />
      <rect x={x - 3.2} y={108.6} width={9.8} height={1.4} fill={SH.void} />
    </g>
  )
}

// Where he stands inside a scene's own svg: his feet's left edge at x, the ground at y, and his height, all
// in the scene's units, so he lines up with the room at every width.
export interface SurvivorPlace {
  x: number
  y: number
  height: number
}

interface SurvivorProps {
  profession: Profession
  pose?: SurvivorPose
  place?: SurvivorPlace
  className?: string
}

const placement = (place: SurvivorPlace | undefined) =>
  place && { x: place.x, y: place.y - place.height, height: place.height, width: (place.height * 48) / 112 }

// The aim always puts the handgun in his front hand, whatever he holds otherwise.
const handFor = (kit: Kit, pose: SurvivorPose): Kit => (pose === 'aim' ? { ...kit, hand: 'gun' } : kit)

export function Survivor({ profession, pose = 'idle', place, className = '' }: SurvivorProps) {
  const id = useId().replace(/:/g, '')
  const kit = KIT[profession]
  const front = handFor(kit, pose)
  const leather = `url(#${id}-leather)`
  const trousers = `url(#${id}-cargo)`

  return (
    <svg
      {...placement(place)}
      viewBox="0 0 48 112"
      className={`${sprite.sprite} ${sprite[pose]} ${sprite[profession]} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
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
      <g className={sprite.whole}>
        <Arm x={19.4} kit={kit} sleeve={SH.bomberShade} laser={false} className={sprite.armBack} />
        <Leg x={22} trousers={SH.cargoShade} holster={false} className={sprite.legBack} />
        <g className={sprite.body}>
          <path d="M18 28 Q24 26 32 28 L32.4 54 H18.2 Z" fill={ID.skin} />
          {kit.torso(leather)}
          {BELT}
          <path d={NECK} fill={ID.skinShade} />
          <g className={sprite.head}>
            <path d={HEAD} fill={`url(#${id}-skin)`} />
            <path d={EAR} fill={ID.skinShade} />
            <path d={BEARD} fill={ID.beard} />
            <path d={MOUSTACHE} fill={ID.beard} />
            <g className={sprite.eye}>
              <ellipse cx={29.4} cy={14.2} rx={1} ry={1.3} fill={ID.eyes} />
            </g>
            <path d="M27.6 12 Q29.6 11 31.4 12" stroke={ID.hair} strokeWidth={0.8} fill="none" />
            <path d="M32.4 12.6 L34.2 16.4 L32.4 17" fill={ID.skinShade} />
            <path d={HAIR} fill={ID.hair} />
            {kit.headwear}
          </g>
        </g>
        <Leg x={27} trousers={trousers} holster={kit.holster} className={sprite.legFront} />
        <Arm x={30.6} kit={front} sleeve={leather} laser={pose === 'aim'} className={sprite.armFront} />
      </g>
    </svg>
  )
}
