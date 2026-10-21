import type { ReactNode } from 'react'
import scene from './heroScene.module.css'
import { HERO_IDENTITY } from '@/components/cv/heroIdentity'

// His figure in a scroll scene, drawn from his sprite (src/assets/sprites/stop_front.png): short dark
// hair, the full dark beard, oval eyes. A world dresses him (the torso, the sleeves, the legs, what he
// wears on his head, what his hands hold); the limbs are separate groups so the scene's pose class (stride, drum, strike, type,
// guard in heroScene.module.css) swings them from the shoulder or hip with transforms only. The skin and
// hair default to his own; a world that draws him as a shape (Silhouette) passes its own.

export const HERO_SKIN = HERO_IDENTITY.skin
export const HERO_SKIN_SHADE = HERO_IDENTITY.skinShade
const HERO_HAIR = HERO_IDENTITY.hair

// The tee, shirt, coat or bare chest outline under his neck; a world fills it with its costume.
export const HERO_TORSO = 'M22 32 Q32 29 42 32 L41 59 L23 59 Z'

// Where the bare forearm starts and how far below its end the hand's centre sits.
const FOREARM_TOP = 39
const HAND_DROP = 2

interface ArmProps {
  x: number
  sleeve: string
  // The bare forearm's length, down to where the hand sits.
  forearm: number
  // Draws the hand (heroHands.tsx) centred at the forearm's end, y given.
  hand: (y: number) => ReactNode
  skin?: string
}

export function HeroArm({ x, sleeve, forearm, hand, skin = HERO_SKIN }: ArmProps) {
  return (
    <>
      <rect x={x - 3.5} y={32} width={7} height={9} rx={2} fill={sleeve} />
      <rect x={x - 2.5} y={FOREARM_TOP} width={5} height={forearm} rx={2} fill={skin} />
      {hand(FOREARM_TOP + forearm + HAND_DROP)}
    </>
  )
}

interface LegProps {
  x: number
  legs: string
  // Long trousers reach the shoe; shorts stop above the knee and show the shin.
  long: boolean
  // How far the shorts reach down the thigh.
  shorts: number
  feet: string
  skin?: string
}

export function HeroLeg({ x, legs, long, shorts, feet, skin = HERO_SKIN }: LegProps) {
  return (
    <>
      {!long && <rect x={x - 3} y={64} width={6} height={22} rx={2} fill={skin} />}
      <rect x={x - 4} y={57} width={8} height={long ? 30 : shorts} rx={1.5} fill={legs} />
      <rect x={x - 4.5} y={86} width={10} height={5} rx={2} fill={feet} />
    </>
  )
}

interface HeroFigureProps {
  className?: string
  eye: string
  // The world's tee and its trim, drawn under the neck and the head.
  torso: ReactNode
  // The shapes of one arm or leg hanging at x; HeroArm and HeroLeg draw them.
  arm: (x: number) => ReactNode
  leg: (x: number) => ReactNode
  // What he wears on his head (a headband, a cap), drawn over the hair and the face.
  overHair?: ReactNode
  skin?: string
  skinShade?: string
  hair?: string
}

export function HeroFigure({
  className = '',
  eye,
  torso,
  arm,
  leg,
  overHair = null,
  skin = HERO_SKIN,
  skinShade = HERO_SKIN_SHADE,
  hair = HERO_HAIR,
}: HeroFigureProps) {
  return (
    <svg viewBox="0 0 64 96" className={className} aria-hidden="true" focusable="false">
      <g className={`${scene.limb} ${scene.armBack}`}>{arm(23)}</g>
      <g className={`${scene.limb} ${scene.legBack}`}>{leg(28)}</g>

      {torso}
      <rect x={29} y={26} width={6} height={5} fill={skinShade} />

      {/* head: ears, face, the short hair, the full beard, the oval eyes */}
      <circle cx={21.5} cy={19} r={2.6} fill={skin} />
      <circle cx={42.5} cy={19} r={2.6} fill={skin} />
      <ellipse cx={32} cy={18} rx={10.5} ry={11} fill={skin} />
      <path d="M21.5 15 Q21 6 32 5.5 Q43 6 42.5 15 Q38 10.5 32 10.5 Q26 10.5 21.5 15 Z" fill={hair} />
      <path d="M21.5 18 Q22 31 32 31.5 Q42 31 42.5 18 Q40 24 36 23.5 Q32 25 28 23.5 Q24 24 21.5 18 Z" fill={hair} />
      <ellipse cx={28} cy={17.5} rx={1.6} ry={2.4} fill={eye} />
      <ellipse cx={36} cy={17.5} rx={1.6} ry={2.4} fill={eye} />
      {overHair}

      <g className={`${scene.limb} ${scene.legFront}`}>{leg(36)}</g>
      <g className={`${scene.limb} ${scene.armFront}`}>{arm(41)}</g>
    </svg>
  )
}
