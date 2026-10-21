import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { Mongkhon } from '@/components/scroll/Mongkhon'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { MYTH } from './palette'

// Him in Mythic (the shared HeroFigure), dressed for an Aegean noon: the System Engineer in a white
// chiton with a Greek key hem, a terracotta sash over one shoulder, sandals and a laurel wreath; the
// Musician in an Aegean blue chiton with gold trim and a gold band in his hair, sticks in hand; the
// Martial Artist bare chested in terracotta Muay Thai shorts with a gold waistband, the white mongkol
// round his head, gold prajioud bands on his upper arms and dark red gloves.

const EYE = MYTH.ink
const SANDALS = MYTH.goldDeep

interface Outfit {
  torso: ReactNode
  // The upper arm: the chiton's sleeve, or the prajioud band on a bare arm.
  sleeve: string
  hand: 'fist' | 'sticks' | 'gloves'
  // The chiton's skirt or the shorts, both above the knee.
  legs: string
  feet: string
  // Drawn in HeroFigure's over hair slot.
  head: ReactNode
}

// The hand sits at the end of the 15 unit forearm (y 54 to 58).
const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  fist: (x, y) => <HeroFist x={x} y={y} />,
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color={MYTH.sand} width={2.2} />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => <HeroGlove x={x} y={y} fill={MYTH.terracottaDeep} />,
}

// The laurel wreath: the olive branch round his head and its leaves, paired along it.
const LAUREL_LEAVES = [
  { x: 23.5, y: 11.6, turn: -40 },
  { x: 27, y: 9.4, turn: -25 },
  { x: 30.6, y: 8.4, turn: -8 },
  { x: 33.4, y: 8.4, turn: 8 },
  { x: 37, y: 9.4, turn: 25 },
  { x: 40.5, y: 11.6, turn: 40 },
]

const LAUREL = (
  <>
    <path d="M21.4 13 Q32 6.6 42.6 13" fill="none" stroke={MYTH.olive} strokeWidth={1.2} />
    {LAUREL_LEAVES.map(({ x, y, turn }) => (
      <ellipse key={x} cx={x} cy={y} rx={2.3} ry={1.1} fill={MYTH.olive} transform={`rotate(${turn} ${x} ${y})`} />
    ))}
  </>
)

const DIADEM = <path d="M21.4 13 Q32 7.6 42.6 13" fill="none" stroke={MYTH.gold} strokeWidth={2} strokeLinecap="round" />

// The mongkol: the corded ring round his head and its tail standing out behind.
const MONGKOL = <Mongkhon cord={MYTH.marble} />

// The chiton falls from the shoulders to above the knee; the skirt below the hips is the legs' colour.
const CHITON = 'M21 32 Q32 28.5 43 32 L44 62 L20 62 Z'

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={CHITON} fill={MYTH.marble} />
        <path d="M24 31.5 L29.5 30.5 L42.5 52 L40.5 57 Z" fill={MYTH.terracotta} />
        <path d="M21 58 H43 M21 60.5 H43" stroke={MYTH.ink} strokeWidth={0.9} />
        <path d="M22 60.5 V58 H25 V59.5 M27 60.5 V58 H30 V59.5 M32 60.5 V58 H35 V59.5 M37 60.5 V58 H40 V59.5" fill="none" stroke={MYTH.ink} strokeWidth={0.7} />
      </>
    ),
    sleeve: MYTH.marble,
    hand: 'fist',
    legs: MYTH.marbleShade,
    feet: SANDALS,
    head: LAUREL,
  },
  drummer: {
    torso: (
      <>
        <path d={CHITON} fill={MYTH.aegean} />
        <path d="M27 31 Q32 34 37 31" fill="none" stroke={MYTH.gold} strokeWidth={1.4} />
        <rect x={21} y={46} width={22} height={2.2} fill={MYTH.gold} />
        <rect x={20.5} y={59.5} width={23} height={2.5} fill={MYTH.gold} />
      </>
    ),
    sleeve: MYTH.aegean,
    hand: 'sticks',
    legs: MYTH.aegean,
    feet: SANDALS,
    head: DIADEM,
  },
  fighter: {
    torso: (
      <>
        <path d={HERO_TORSO} fill={SKIN} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke={MYTH.inkSoft} strokeWidth={0.8} />
        <rect x={23} y={55} width={18} height={4} fill={MYTH.gold} />
      </>
    ),
    sleeve: MYTH.gold,
    hand: 'gloves',
    legs: MYTH.terracotta,
    feet: SKIN,
    head: MONGKOL,
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
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={false} shorts={11} feet={outfit.feet} />}
      overHair={outfit.head}
    />
  )
}
