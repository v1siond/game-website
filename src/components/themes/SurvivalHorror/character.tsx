import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { Mongkhon } from '@/components/scroll/Mongkhon'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { SH } from './palette'

// Him (the shared HeroFigure) dressed for a night in the old house, in each profession's clothes:
// - System Engineer: an olive field jacket over a dark tee with a torch clipped to the chest pocket
//   (its beam is the strip's companion), dark trousers, boots.
// - Musician: a black tee, dark jeans, boots and his sticks.
// - Martial Artist: bare chested in rust Muay Thai shorts with a cream waistband, the mongkol cord on
//   his head, cream wraps under leather gloves, barefoot.

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  long: boolean
  feet: string
  hand: 'fist' | 'sticks' | 'gloves'
  head: ReactNode
}

// The mongkol: one wound cord across the brow, knotted at the back with its short tail.
const MONGKOL = <Mongkhon cord={SH.ivory} />

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SH.jacket} />
        <path d="M28.5 31 L32 40 L35.5 31 Z" fill={SH.denim} />
        <path d="M32 40 V59" stroke={SH.void} strokeWidth={0.8} />
        <rect x={35} y={40} width={5} height={5} fill={SH.olive} stroke={SH.void} strokeWidth={0.5} />
        {/* the torch on the chest pocket, its lens toward the way he walks */}
        <rect x={35.5} y={37} width={5.5} height={3.4} rx={1} fill={SH.steel} />
        <rect x={40.4} y={36.6} width={1.6} height={4.2} fill={SH.ivory} />
      </>
    ),
    sleeve: SH.jacket,
    legs: SH.denim,
    long: true,
    feet: SH.boot,
    hand: 'fist',
    head: null,
  },
  drummer: {
    torso: <path d={HERO_TORSO} fill={SH.shadow} />,
    sleeve: SH.shadow,
    legs: SH.denim,
    long: true,
    feet: SH.boot,
    hand: 'sticks',
    head: null,
  },
  fighter: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke={SH.rust} strokeWidth={0.7} />
        <rect x={23} y={55} width={18} height={4} fill={SH.cream} />
      </>
    ),
    sleeve: SKIN,
    legs: SH.rust,
    long: false,
    feet: SKIN,
    hand: 'gloves',
    head: MONGKOL,
  },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  fist: (x, y) => <HeroFist x={x} y={y} />,
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color={SH.brass} />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => (
    <>
      <rect x={x - 2.8} y={y - 7} width={5.6} height={3} fill={SH.cream} />
      <HeroGlove x={x} y={y} fill={SH.leather} r={4.5} stroke={SH.void} strokeWidth={0.6} />
    </>
  ),
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={SH.void}
      torso={outfit.torso}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={15} hand={(y) => HAND_DRAW[outfit.hand](x, y)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={11} feet={outfit.feet} />}
      overHair={outfit.head}
    />
  )
}
