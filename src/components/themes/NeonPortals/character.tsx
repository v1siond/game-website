import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'
import styles from './scenes.module.css'

// Him, drawn from his sprite (src/assets/sprites/stop_front.png): short dark hair, the full dark beard,
// oval eyes. Neon Portals dresses him as a dimension hopper per profession, a charcoal tee split by an
// orange and a blue seam (the two portal colours) and a rift band on the front wrist. The limbs are
// separate groups so a scene's pose class (walk, drum, strike, type, guard in scenes.module.css) swings
// them from the shoulder or hip with transforms only.

const SKIN = '#b5703f'
const SKIN_SHADE = '#8a4f2b'
const HAIR = '#241a24'
const EYE = '#07060f'
const TEE = '#2a2836'

interface Outfit {
  legs: string
  // Long trousers reach the shoe; shorts stop above the knee and show the shin.
  long: boolean
  feet: string
  hand: 'band' | 'sticks' | 'gloves'
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: { legs: '#3a3850', long: true, feet: '#15121c', hand: 'band' },
  drummer: { legs: '#1c1b29', long: false, feet: '#15121c', hand: 'sticks' },
  // Muay Thai: boxing gloves, satin shorts in the exit blue, bare feet.
  fighter: { legs: PORTAL.BLUE, long: false, feet: SKIN, hand: 'gloves' },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  band: (x) => (
    <>
      <rect x={x - 3} y={49} width={6} height={3} fill={PORTAL.VIOLET} />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  sticks: (x) => (
    <>
      <line x1={x} y1={53} x2={x} y2={74} stroke="#f5d28a" strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={55} r={4.6} fill={PORTAL.ORANGE} stroke="#7a4300" strokeWidth={0.8} />,
}

function Arm({ x, outfit, className }: { x: number; outfit: Outfit; className: string }) {
  return (
    <g className={`${styles.limb} ${className}`}>
      <rect x={x - 3.5} y={32} width={7} height={9} rx={2} fill={TEE} />
      <rect x={x - 2.5} y={39} width={5} height={14} rx={2} fill={SKIN} />
      {HAND_DRAW[outfit.hand](x)}
    </g>
  )
}

function Leg({ x, outfit, className }: { x: number; outfit: Outfit; className: string }) {
  const coverHeight = outfit.long ? 30 : 12
  return (
    <g className={`${styles.limb} ${className}`}>
      {!outfit.long && <rect x={x - 3} y={64} width={6} height={22} rx={2} fill={SKIN} />}
      <rect x={x - 4} y={57} width={8} height={coverHeight} rx={1.5} fill={outfit.legs} />
      <rect x={x - 4.5} y={86} width={10} height={5} rx={2} fill={outfit.feet} />
    </g>
  )
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <svg viewBox="0 0 64 96" className={className} aria-hidden="true" focusable="false">
      <Arm x={23} outfit={outfit} className={styles.armBack} />
      <Leg x={28} outfit={outfit} className={styles.legBack} />

      {/* torso: the charcoal tee, split by the orange and blue seams */}
      <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={TEE} />
      <line x1={30.5} y1={33} x2={30.5} y2={58} stroke={PORTAL.ORANGE} strokeWidth={1.2} />
      <line x1={33.5} y1={33} x2={33.5} y2={58} stroke={PORTAL.BLUE} strokeWidth={1.2} />
      <rect x={29} y={26} width={6} height={5} fill={SKIN_SHADE} />

      {/* head: ears, face, the short hair, the full beard, the oval eyes */}
      <circle cx={21.5} cy={19} r={2.6} fill={SKIN} />
      <circle cx={42.5} cy={19} r={2.6} fill={SKIN} />
      <ellipse cx={32} cy={18} rx={10.5} ry={11} fill={SKIN} />
      <path d="M21.5 15 Q21 6 32 5.5 Q43 6 42.5 15 Q38 10.5 32 10.5 Q26 10.5 21.5 15 Z" fill={HAIR} />
      <path d="M21.5 18 Q22 31 32 31.5 Q42 31 42.5 18 Q40 24 36 23.5 Q32 25 28 23.5 Q24 24 21.5 18 Z" fill={HAIR} />
      <ellipse cx={28} cy={17.5} rx={1.6} ry={2.4} fill={EYE} />
      <ellipse cx={36} cy={17.5} rx={1.6} ry={2.4} fill={EYE} />

      <Leg x={36} outfit={outfit} className={styles.legFront} />
      <Arm x={41} outfit={outfit} className={styles.armFront} />
    </svg>
  )
}
