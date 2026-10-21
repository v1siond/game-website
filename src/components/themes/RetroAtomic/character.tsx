import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { ROCKET_RED, PHOSPHOR_GREEN, SHELTER_BLUE, ATOMIC_YELLOW } from './palette'

// Him in Retro Atomic (the shared HeroFigure), dressed the atomic age way per profession: a blue utility
// jumpsuit with a yellow stripe and a wrist computer at the terminals, a white tee and dark jeans behind
// the kit, and bare chested in red Muay Thai shorts with a yellow waistband, a yellow headband tied at
// the side and red gloves in the ring.

const EYE = '#0a0a08'
const BOOT = '#3a2a1e'
const TEE = '#f1ece0'
const JEANS = '#2c3e66'

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  long: boolean
  feet: string
  hand: 'computer' | 'sticks' | 'gloves'
  // Drawn in HeroFigure's over hair slot.
  head: ReactNode
}

// The hand sits at the end of the 14 unit forearm (y 53 to 57).
const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  computer: (x) => (
    <>
      <rect x={x - 3.5} y={46} width={7} height={5} rx={1} fill="#4a4a3c" stroke={PHOSPHOR_GREEN} strokeWidth={0.6} />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  sticks: (x) => (
    <>
      <line x1={x} y1={53} x2={x} y2={73} stroke="#e8c98a" strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={55} r={4.8} fill={ROCKET_RED} stroke="#ffd7c2" strokeWidth={0.8} />,
}

// The Muay Thai headband: a band across the forehead along the hairline, its knot and two tails at the side.
const HEADBAND = (
  <>
    <path d="M21.6 12.5 Q32 7.6 42.4 12.5 L42.6 15.4 Q32 10.8 21.4 15.4 Z" fill={ATOMIC_YELLOW} />
    <circle cx={21.4} cy={14} r={1.6} fill={ATOMIC_YELLOW} />
    <path d="M20.6 13.4 L15.4 16.2 L16.4 17.6 Z M20.8 14.8 L16.6 19.4 L18 20.2 Z" fill={ATOMIC_YELLOW} />
  </>
)

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={SHELTER_BLUE} />
        <rect x={30.5} y={31} width={3} height={28} fill={ATOMIC_YELLOW} />
      </>
    ),
    sleeve: SHELTER_BLUE,
    legs: SHELTER_BLUE,
    long: true,
    feet: BOOT,
    hand: 'computer',
    head: null,
  },
  drummer: {
    torso: <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={TEE} />,
    sleeve: TEE,
    legs: JEANS,
    long: true,
    feet: BOOT,
    hand: 'sticks',
    head: null,
  },
  fighter: {
    torso: (
      <>
        <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={SKIN} />
        <rect x={23} y={56} width={18} height={3} fill={ATOMIC_YELLOW} />
      </>
    ),
    sleeve: SKIN,
    legs: ROCKET_RED,
    long: false,
    feet: SKIN,
    hand: 'gloves',
    head: HEADBAND,
  },
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      torso={outfit.torso}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={14} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={12} feet={outfit.feet} />}
      overHair={outfit.head}
    />
  )
}
