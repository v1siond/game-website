import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { Mongkhon } from '@/components/scroll/Mongkhon'

// Him in the warp world (the shared HeroFigure, his beard and hair): a platform hopper's clothes, bright
// and chunky so he reads at the size of a crate. The world moves him as one body (the run toward the
// camera, the bounce, the spin, the squash on landing), never limb by limb.
// - System Engineer: an orange tee with a dark collar band, blue jeans, chunky red trainers, a wrist
//   band in the warp blue.
// - Musician: a sleeveless violet tee, dark knee shorts, red trainers, pale sticks.
// - Martial Artist: bare chested in blue Muay Thai shorts with a gold waistband, the mongkhon on his
//   head, orange gloves, bare feet.

const EYE = PORTAL.VOID
const TRAINERS = '#d8322a'

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  long: boolean
  feet: string
  hand: 'band' | 'sticks' | 'gloves'
  overHair: ReactNode
}

const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  band: (x, y) => (
    <>
      <rect x={x - 3} y={y - 6} width={6} height={3} rx={1} fill={PORTAL.BLUE} />
      <HeroFist x={x} y={y} />
    </>
  ),
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color="#f5d28a" />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => <HeroGlove x={x} y={y} fill={PORTAL.ORANGE} r={4.8} stroke={PORTAL.ORANGE_DEEP} strokeWidth={0.8} />,
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={PORTAL.ORANGE} />
        <path d="M24 33 Q32 31 40 33 L40 36 Q32 34 24 36 Z" fill={PORTAL.ORANGE_DEEP} />
        <path d="M23 50 L41 50 L41 59 L23 59 Z" fill={PORTAL.ORANGE_DEEP} opacity={0.45} />
      </>
    ),
    sleeve: PORTAL.ORANGE,
    legs: '#2f5fb3',
    long: true,
    feet: TRAINERS,
    hand: 'band',
    overHair: null,
  },
  drummer: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={PORTAL.HAZE} />
        <path d="M27 31 Q32 36 37 31" fill="none" stroke={PORTAL.VIOLET} strokeWidth={1.5} />
      </>
    ),
    sleeve: SKIN,
    legs: '#1d1a33',
    long: false,
    feet: TRAINERS,
    hand: 'sticks',
    overHair: null,
  },
  fighter: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <path d="M28 40 Q32 42 36 40 M27 46 Q32 48 37 46" fill="none" stroke="#8a4f2b" strokeWidth={0.8} />
        <rect x={23} y={55} width={18} height={4} fill={PORTAL.GOLD} />
      </>
    ),
    sleeve: SKIN,
    legs: '#2f7fe0',
    long: false,
    feet: SKIN,
    hand: 'gloves',
    overHair: <Mongkhon cord={PORTAL.WHITE} binding={PORTAL.BLUE} />,
  },
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      torso={outfit.torso}
      overHair={outfit.overHair}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={14} hand={(y) => HAND_DRAW[outfit.hand](x, y)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={outfit.long ? 30 : 13} feet={outfit.feet} />}
    />
  )
}
