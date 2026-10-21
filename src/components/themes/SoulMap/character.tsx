import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { Mongkhon } from '@/components/scroll/Mongkhon'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { SOUL } from './palette'

// Him in Soul Map (the shared HeroFigure), dressed for the caverns: the System Engineer in a midnight
// blue explorer's jacket with a glowing cyan seam and a short scarf, dark trousers and boots; the
// Musician in a cavern blue tee with a rose collar and dark jeans, sticks in hand; the Martial Artist
// bare chested in blue Muay Thai shorts with a cyan waistband, the gold mongkhon on his head, the ember
// prajioud bands on his upper arms and ember gloves.

const EYE = SOUL.ink
const BOOT = SOUL.ink
const STICK = SOUL.lantern

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  long: boolean
  feet: string
  hand: 'fist' | 'sticks' | 'gloves'
  // Drawn in HeroFigure's over hair slot.
  head: ReactNode
}

// The hand sits at the end of the 15 unit forearm (y 54 to 58).
const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  fist: (x, y) => <HeroFist x={x} y={y} />,
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color={STICK} width={2.2} />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => <HeroGlove x={x} y={y} fill={SOUL.ember} />,
}

// The mongkhon: the corded ring round the head with its two short tails at the back.
const MONGKHON = <Mongkhon cord={SOUL.lantern} />

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SOUL.rock} />
        <path d="M31 31 H33 V59 H31 Z" fill={SOUL.glow} />
        <path d="M24 30 Q32 35 40 30 L40 33 Q32 38 24 33 Z" fill={SOUL.glowDeep} />
        <rect x={23} y={52} width={18} height={3} fill={SOUL.cavern} />
      </>
    ),
    sleeve: SOUL.rock,
    legs: SOUL.deep,
    long: true,
    feet: BOOT,
    hand: 'fist',
    head: null,
  },
  drummer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SOUL.cavern} />
        <path d="M27 31 Q32 35 37 31" fill="none" stroke={SOUL.rose} strokeWidth={1.4} />
      </>
    ),
    sleeve: SOUL.cavern,
    legs: SOUL.deep,
    long: true,
    feet: BOOT,
    hand: 'sticks',
    head: null,
  },
  fighter: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <rect x={23} y={55} width={18} height={4} fill={SOUL.glow} />
      </>
    ),
    sleeve: SOUL.ember,
    legs: SOUL.accent,
    long: false,
    feet: SKIN,
    hand: 'gloves',
    head: MONGKHON,
  },
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      torso={outfit.torso}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={15} hand={(y) => HAND_DRAW[outfit.hand](x, y)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={11} feet={outfit.feet} />}
      overHair={outfit.head}
    />
  )
}
