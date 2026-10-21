import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { Mongkhon } from '@/components/scroll/Mongkhon'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { RPG } from './palette'

// Him in the role playing world (the shared HeroFigure), the sprite in the encounter's monster area and
// in the room before it, dressed per profession in flat pixel colours:
// - System Engineer: a blue travelling tunic with a gold belt, brown trousers and boots.
// - Musician: a red vest over bare arms, brown trousers, pale wooden sticks.
// - Martial Artist: bare chested in red Muay Thai shorts with a gold waistband, the white mongkhon
//   (the corded ring a Muay Thai fighter wears on his head) over his hair, white prajioud bands on his
//   upper arms, red gloves and bare feet.

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  long: boolean
  shorts: number
  feet: string
  hand: 'bare' | 'sticks' | 'gloves'
  overHair: ReactNode
}

// The hand sits at the end of the 14 unit forearm (y 53 to 57). The fighter's arm carries its
// prajioud band, so it swings with the arm.
const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  bare: (x, y) => <HeroFist x={x} y={y} />,
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color={RPG.stick} />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => (
    <>
      <rect x={x - 3.6} y={35} width={7.2} height={2.4} fill={RPG.border} />
      <HeroGlove x={x} y={y} fill={RPG.glove} />
    </>
  ),
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={RPG.tunic} />
        <path d="M23 59 L22 64 L42 64 L41 59 Z" fill={RPG.tunic} />
        <rect x={23} y={52} width={18} height={3} fill={RPG.belt} />
      </>
    ),
    sleeve: RPG.tunic,
    legs: RPG.trousers,
    long: true,
    shorts: 0,
    feet: RPG.boot,
    hand: 'bare',
    overHair: null,
  },
  drummer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <path d="M24 33 H40 L41 59 H23 Z" fill={RPG.vest} />
        <path d="M32 33 V59" stroke={RPG.belt} strokeWidth={1} />
      </>
    ),
    sleeve: SKIN,
    legs: RPG.trousers,
    long: true,
    shorts: 0,
    feet: RPG.boot,
    hand: 'sticks',
    overHair: null,
  },
  fighter: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <rect x={23} y={56} width={18} height={3} fill={RPG.belt} />
      </>
    ),
    sleeve: SKIN,
    legs: RPG.shorts,
    long: false,
    shorts: 12,
    feet: SKIN,
    hand: 'gloves',
    overHair: <Mongkhon cord={RPG.border} />,
  },
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={RPG.eye}
      overHair={outfit.overHair}
      torso={outfit.torso}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={14} hand={(y) => HAND_DRAW[outfit.hand](x, y)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={outfit.shorts} feet={outfit.feet} />}
    />
  )
}
