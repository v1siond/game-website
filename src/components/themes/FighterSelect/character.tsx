import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { Mongkhon } from '@/components/scroll/Mongkhon'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { FS } from './palette'

// Him as player one (the shared HeroFigure), in each profession's fight costume, player one blue
// throughout: the System Engineer in a blue track jacket with a white stripe, dark trousers and
// trainers; the Musician in a black tank top with a red stripe, black jeans and his sticks; the Martial
// Artist bare chested in blue Muay Thai shorts with a gold waistband, red prajioud bands on his upper
// arms, the mongkol ring on his head with its tail at the back, red wraps and blue gloves, barefoot.

const EYE = FS.ink

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  // Long trousers reach the shoe; shorts stop above the knee and show the shin.
  long: boolean
  feet: string
  hand: 'fist' | 'sticks' | 'gloves'
  // Drawn in HeroFigure's over hair slot.
  head: ReactNode
}

const TRACK_JACKET = '#1f4fbf'
const TANK = '#16161e'
const TROUSERS = '#1b1c2b'
const TRAINERS = '#e8e8f0'
const MONGKOL = '#e8e2d0'

// The mongkol: a wound cord ring sitting on the brow, the binding knot at the back and its tail.
const MONGKOL_RING = <Mongkhon cord={MONGKOL} binding={FS.p2} />

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={TRACK_JACKET} />
        <path d="M32 31 V59" stroke={FS.chrome} strokeWidth={0.8} />
        <path d="M22.4 34 L23.4 58 M41.6 34 L40.6 58" stroke={TRAINERS} strokeWidth={1.4} />
        <path d="M28 31 L32 34 L36 31" fill="none" stroke={FS.ink} strokeWidth={0.8} />
      </>
    ),
    sleeve: TRACK_JACKET,
    legs: TROUSERS,
    long: true,
    feet: TRAINERS,
    hand: 'fist',
    head: null,
  },
  drummer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <path d="M25 31 Q32 35 39 31 L40.5 59 L23.5 59 Z" fill={TANK} />
        <rect x={23.6} y={44} width={16.8} height={2.4} fill={FS.p2} />
      </>
    ),
    sleeve: SKIN,
    legs: TANK,
    long: true,
    feet: TANK,
    hand: 'sticks',
    head: null,
  },
  fighter: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke="#8a4f2b" strokeWidth={0.8} />
        <rect x={23} y={55} width={18} height={4} fill={FS.gold} />
      </>
    ),
    sleeve: FS.p2,
    legs: FS.p1,
    long: false,
    feet: SKIN,
    hand: 'gloves',
    head: MONGKOL_RING,
  },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  fist: (x, y) => <HeroFist x={x} y={y} />,
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color={FS.gold} />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => (
    <>
      <rect x={x - 2.8} y={y - 7} width={5.6} height={3} fill={FS.p2} />
      <HeroGlove x={x} y={y} fill={FS.p1} r={4.5} stroke={FS.ink} strokeWidth={0.6} />
    </>
  ),
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
