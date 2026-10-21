import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { Mongkhon } from '@/components/scroll/Mongkhon'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { COLORS } from './palette'

// Him on the island (the shared HeroFigure), dressed for the tropics per profession: a lagoon blue
// short sleeved shirt with a sun gold placket, khaki cargo shorts and trail boots on the jungle path; an
// orange tank top, blue board shorts and bare feet behind the kit on the beach stage; bare chested in
// gold Muay Thai shorts with a blue waistband, a blue headband, red gloves and bare feet in the ring.

const EYE = '#1a120c'
const KHAKI = '#c9a66b'
const BOOT = '#5a3a1e'
const TANK = COLORS.fruitGold
const BOARD_SHORTS = COLORS.seaDeep

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  shorts: number
  feet: string
  hand: 'bare' | 'sticks' | 'gloves'
  overHair: ReactNode
}

// The hand sits at the end of the 14 unit forearm (y 53 to 57).
const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  bare: (x, y) => <HeroFist x={x} y={y} />,
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color={COLORS.sandLight} />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => <HeroGlove x={x} y={y} fill={COLORS.hazard} stroke={COLORS.parchment} strokeWidth={0.8} />,
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={COLORS.lagoonDeep} />
        <rect x={31} y={31} width={2} height={28} fill={COLORS.sun} />
        <circle cx={27} cy={40} r={1.6} fill={COLORS.fruitShine} />
        <circle cx={37} cy={47} r={1.6} fill={COLORS.fruitShine} />
        <circle cx={26} cy={53} r={1.6} fill={COLORS.fruitShine} />
      </>
    ),
    sleeve: COLORS.lagoonDeep,
    legs: KHAKI,
    shorts: 13,
    feet: BOOT,
    hand: 'bare',
    overHair: null,
  },
  drummer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <path d="M25 33 H39 L41 59 H23 Z" fill={TANK} />
      </>
    ),
    sleeve: SKIN,
    legs: BOARD_SHORTS,
    shorts: 14,
    feet: SKIN,
    hand: 'sticks',
    overHair: null,
  },
  fighter: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <rect x={23} y={56} width={18} height={3} fill={COLORS.seaDeep} />
      </>
    ),
    sleeve: SKIN,
    legs: COLORS.sun,
    shorts: 12,
    feet: SKIN,
    hand: 'gloves',
    overHair: <Mongkhon cord={COLORS.seaDeep} />,
  },
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      overHair={outfit.overHair}
      torso={outfit.torso}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={14} hand={(y) => HAND_DRAW[outfit.hand](x, y)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={false} shorts={outfit.shorts} feet={outfit.feet} />}
    />
  )
}
