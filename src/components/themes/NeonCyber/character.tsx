import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import styles from './scenes.module.css'

// Him, drawn from his sprite (src/assets/sprites/stop_front.png): short dark hair, the full dark beard,
// oval eyes, the dark tee. Neon Cyber dresses him per profession and lights the trim in the world's
// magenta and cyan. The limbs are separate groups so the scene's pose class (run, drum, strike, type,
// guard in scenes.module.css) can swing them from the shoulder or hip with transforms only.

const SKIN = '#b5703f'
const SKIN_SHADE = '#8a4f2b'
const HAIR = '#241a24'
const EYE = '#0a0512'
const SHOE = '#15121c'

interface Outfit {
  shirt: string
  trim: string
  legs: string
  // Long trousers reach the shoe; shorts stop above the knee and show the shin.
  long: boolean
  feet: string
  hand: 'fist' | 'sticks' | 'gloves'
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: { shirt: '#23202e', trim: '#00ffff', legs: '#2d2a3d', long: true, feet: SHOE, hand: 'fist' },
  drummer: { shirt: '#23202e', trim: '#ff00ff', legs: '#e8eef0', long: false, feet: SHOE, hand: 'sticks' },
  fighter: { shirt: '#23202e', trim: '#ff0066', legs: '#ff0066', long: false, feet: SKIN, hand: 'gloves' },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  fist: (x) => <circle cx={x} cy={56} r={3} fill={SKIN} />,
  sticks: (x) => (
    <>
      <line x1={x} y1={54} x2={x} y2={74} stroke="#f5d28a" strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={56} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={56} r={4.5} fill="#ff0066" stroke="#ffd1e3" strokeWidth={0.8} />,
}

function Arm({ x, outfit, className }: { x: number; outfit: Outfit; className: string }) {
  return (
    <g className={`${styles.limb} ${className}`}>
      <rect x={x - 3.5} y={32} width={7} height={9} rx={2} fill={outfit.shirt} />
      <rect x={x - 2.5} y={39} width={5} height={15} rx={2} fill={SKIN} />
      {HAND_DRAW[outfit.hand](x)}
    </g>
  )
}

function Leg({ x, outfit, className }: { x: number; outfit: Outfit; className: string }) {
  const coverHeight = outfit.long ? 30 : 11
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

      {/* torso: the dark tee with the profession's neon trim at the collar and hem */}
      <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={outfit.shirt} />
      <path d="M27 31 Q32 35 37 31" fill="none" stroke={outfit.trim} strokeWidth={1.4} />
      <line x1={23} y1={58} x2={41} y2={58} stroke={outfit.trim} strokeWidth={1.4} />
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
