import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { TRAIL } from './palette'

// Him in Adventure Paths (the shared HeroFigure), dressed for the trail per profession: a khaki field
// shirt with the route red satchel strap, olive trousers and a teal glowing wrist tracker on the ruins
// path under a wide brim field hat; a red check flannel and dark jeans at the campfire kit; bare chested
// in forest green Muay Thai shorts with a gold waistband, route red gloves and the mongkhon, the ringed
// headpiece of the fight, on the temple terrace.

const EYE = '#120c06'
const KHAKI = '#c8a86a'
const OLIVE = '#4f5a35'
const FLANNEL_LINE = '#6e1f12'
const JEANS = '#2c3a52'

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  long: boolean
  feet: string
  hand: 'tracker' | 'sticks' | 'gloves'
  head: ReactNode
}

const SHIRT = 'M22 32 Q32 29 42 32 L41 59 L23 59 Z'

// The hand sits at the end of the 14 unit forearm (y 53 to 57).
const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  tracker: (x) => (
    <>
      <rect x={x - 3} y={47} width={6} height={4} rx={1} fill={TRAIL.BARK} />
      <rect x={x - 2} y={48} width={4} height={2} fill={TRAIL.RUNE} />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  sticks: (x) => (
    <>
      <line x1={x} y1={53} x2={x} y2={73} stroke={TRAIL.LANTERN} strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={55} r={4.8} fill={TRAIL.ROUTE} stroke={TRAIL.PARCHMENT} strokeWidth={0.8} />,
}

// The field hat: a wide brim over the hairline, the crown and a route red band.
const FIELD_HAT = (
  <>
    <path d="M23 9 Q24 0.5 32 0.5 Q40 0.5 41 9 Z" fill={KHAKI} />
    <rect x={23.5} y={6} width={17} height={2.5} fill={TRAIL.ROUTE} />
    <ellipse cx={32} cy={9} rx={15.5} ry={2.4} fill={KHAKI} stroke={OLIVE} strokeWidth={0.6} />
  </>
)

// The mongkhon: a parchment white ring around the crown, its tail standing up behind.
const MONGKHON = (
  <>
    <path d="M41 8 Q47 5 48 0" stroke={TRAIL.PARCHMENT} strokeWidth={2} fill="none" strokeLinecap="round" />
    <ellipse cx={32} cy={8.5} rx={10.5} ry={2.6} fill="none" stroke={TRAIL.PARCHMENT} strokeWidth={2.2} />
    <ellipse cx={32} cy={8.5} rx={10.5} ry={2.6} fill="none" stroke={TRAIL.ROUTE} strokeWidth={0.7} strokeDasharray="2 2" />
  </>
)

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={SHIRT} fill={KHAKI} />
        <path d="M24 33 L40 57" stroke={TRAIL.ROUTE} strokeWidth={2.5} />
        <rect x={27} y={36} width={4} height={4} fill={OLIVE} />
      </>
    ),
    sleeve: KHAKI,
    legs: OLIVE,
    long: true,
    feet: TRAIL.BARK,
    hand: 'tracker',
    head: FIELD_HAT,
  },
  drummer: {
    torso: (
      <>
        <path d={SHIRT} fill={TRAIL.ROUTE} />
        <path d="M23 40 H41 M23 48 H41 M28 31 V59 M36 31 V59" stroke={FLANNEL_LINE} strokeWidth={1.4} />
      </>
    ),
    sleeve: TRAIL.ROUTE,
    legs: JEANS,
    long: true,
    feet: TRAIL.BARK,
    hand: 'sticks',
    head: null,
  },
  fighter: {
    torso: (
      <>
        <path d={SHIRT} fill={SKIN} />
        <rect x={23} y={56} width={18} height={3} fill={TRAIL.GOLD} />
      </>
    ),
    sleeve: SKIN,
    legs: TRAIL.FOREST,
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
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={14} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={12} feet={outfit.feet} />}
      overHair={outfit.head}
    />
  )
}
