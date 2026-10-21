import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { NUKA_RED, PIPBOY_GREEN, VAULT_BLUE, VAULT_YELLOW } from './palette'

// Him in Retro Atomic (the shared HeroFigure), dressed the atomic age way per profession: a blue utility
// jumpsuit with a yellow stripe and a wrist computer at the terminals, a white tee and dark jeans behind
// the kit, and bare chested in red Muay Thai shorts with a yellow waistband and red gloves in the ring.

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
}

// The hand sits at the end of the 14 unit forearm (y 53 to 57).
const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  computer: (x) => (
    <>
      <rect x={x - 3.5} y={46} width={7} height={5} rx={1} fill="#4a4a3c" stroke={PIPBOY_GREEN} strokeWidth={0.6} />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  sticks: (x) => (
    <>
      <line x1={x} y1={53} x2={x} y2={73} stroke="#e8c98a" strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={55} r={4.8} fill={NUKA_RED} stroke="#ffd7c2" strokeWidth={0.8} />,
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={VAULT_BLUE} />
        <rect x={30.5} y={31} width={3} height={28} fill={VAULT_YELLOW} />
      </>
    ),
    sleeve: VAULT_BLUE,
    legs: VAULT_BLUE,
    long: true,
    feet: BOOT,
    hand: 'computer',
  },
  drummer: {
    torso: <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={TEE} />,
    sleeve: TEE,
    legs: JEANS,
    long: true,
    feet: BOOT,
    hand: 'sticks',
  },
  fighter: {
    torso: (
      <>
        <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={SKIN} />
        <rect x={23} y={56} width={18} height={3} fill={VAULT_YELLOW} />
      </>
    ),
    sleeve: SKIN,
    legs: NUKA_RED,
    long: false,
    feet: SKIN,
    hand: 'gloves',
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
    />
  )
}
