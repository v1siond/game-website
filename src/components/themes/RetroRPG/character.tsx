import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { RPG } from './palette'

// Him in the role playing world (the shared HeroFigure), dressed as a 16 bit party member:
// - System Engineer: a blue travelling tunic with a gold belt, brown trousers and boots.
// - Musician: a red vest over bare arms, brown trousers, pale wooden sticks.
// - Martial Artist: bare chested in red Muay Thai shorts with a gold waistband, the white mongkhon
//   (the corded ring a Muay Thai fighter wears on his head) over his hair, white prajioud bands on his
//   upper arms, red gloves and bare feet.

// The tunic or vest outline under his neck, in HeroFigure's 64 by 96 box.
const TORSO = 'M22 32 Q32 29 42 32 L41 59 L23 59 Z'

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
const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  bare: (x) => <circle cx={x} cy={55} r={3} fill={SKIN} />,
  sticks: (x) => (
    <>
      <line x1={x} y1={53} x2={x} y2={73} stroke={RPG.stick} strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => (
    <>
      <rect x={x - 3.6} y={35} width={7.2} height={2.4} fill={RPG.border} />
      <circle cx={x} cy={55} r={4.8} fill={RPG.glove} />
    </>
  ),
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={TORSO} fill={RPG.tunic} />
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
        <path d={TORSO} fill={SKIN} />
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
        <path d={TORSO} fill={SKIN} />
        <rect x={23} y={56} width={18} height={3} fill={RPG.belt} />
      </>
    ),
    sleeve: SKIN,
    legs: RPG.shorts,
    long: false,
    shorts: 12,
    feet: SKIN,
    hand: 'gloves',
    overHair: (
      <>
        <path d="M21.6 12.8 Q32 8.6 42.4 12.8" stroke={RPG.border} strokeWidth={2.2} fill="none" />
        <path d="M42 12.6 Q46 10 47 5" stroke={RPG.border} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </>
    ),
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
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={14} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={outfit.shorts} feet={outfit.feet} />}
    />
  )
}
