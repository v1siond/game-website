import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { NOIR } from './palette'

// Him in Bold Noir (the shared HeroFigure), dressed in black, white and greys with one touch of red:
// the System Engineer in a grey trench coat over a white shirt and a red tie, a black fedora with a
// paper band; the Musician of a late night club in a white shirt, sleeves rolled, a black waistcoat and
// a red bow tie, sticks in hand; the Martial Artist bare chested in black Muay Thai shorts with a red
// waistband, the white mongkol round his head, white prajioud bands on his upper arms and red gloves.

const EYE = NOIR.ink
const SHOES = NOIR.ink

interface Outfit {
  torso: ReactNode
  // The upper arm: the coat or shirt sleeve, or the prajioud band on a bare arm.
  sleeve: string
  hand: 'fist' | 'sticks' | 'gloves'
  legs: string
  long: boolean
  feet: string
  // Drawn in HeroFigure's over hair slot.
  head: ReactNode
}

// The hand sits at the end of the 15 unit forearm (y 54 to 58).
const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  fist: (x) => <circle cx={x} cy={56} r={3} fill={SKIN} />,
  sticks: (x) => (
    <>
      <line x1={x} y1={54} x2={x} y2={74} stroke={NOIR.paper} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={x} cy={56} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={56} r={4.8} fill={NOIR.red} />,
}

// The fedora: a pinched crown with its paper band, the brim pulled low over the hairline.
const FEDORA = (
  <>
    <path d="M24 11 Q24 2.5 32 2 Q40 2.5 40 11 Z" fill={NOIR.ink} />
    <rect x={24} y={8.5} width={16} height={2.5} fill={NOIR.paper} />
    <path d="M16 12.5 Q32 8 48 12.5 Q32 11.5 16 12.5 Z" fill={NOIR.ink} stroke={NOIR.ink} strokeWidth={1.6} strokeLinejoin="round" />
  </>
)

// The mongkol: the corded ring round his head and its tail standing out behind.
const MONGKOL = (
  <>
    <path d="M21.4 13 Q32 7.4 42.6 13" fill="none" stroke={NOIR.paper} strokeWidth={2.4} strokeLinecap="round" />
    <path d="M41.6 11.8 Q47 6 49 1.5" fill="none" stroke={NOIR.paper} strokeWidth={1.8} strokeLinecap="round" />
  </>
)

const TORSO = 'M22 32 Q32 29 42 32 L41 59 L23 59 Z'

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d="M21 32 Q32 28.5 43 32 L44 62 L20 62 Z" fill={NOIR.ash} />
        <path d="M28 31 L32 40 L36 31 Z" fill={NOIR.paper} />
        <path d="M31 33 L33 33 L33.6 44 L32 46.5 L30.4 44 Z" fill={NOIR.red} />
        <path d="M27 31 L32 46 L30 58 M37 31 L32 46" fill="none" stroke={NOIR.smoke} strokeWidth={1.2} />
        <rect x={21} y={48} width={22} height={2.5} fill={NOIR.smoke} />
      </>
    ),
    sleeve: NOIR.ash,
    hand: 'fist',
    legs: NOIR.smoke,
    long: true,
    feet: SHOES,
    head: FEDORA,
  },
  drummer: {
    torso: (
      <>
        <path d={TORSO} fill={NOIR.paper} />
        <path d="M24.5 33 L29 33 L30.5 59 L23.5 59 Z M39.5 33 L35 33 L33.5 59 L40.5 59 Z" fill={NOIR.ink} />
        <path d="M28.5 31.5 L32 33.5 L35.5 31.5 L35.5 35.5 L32 33.5 L28.5 35.5 Z" fill={NOIR.red} />
      </>
    ),
    sleeve: NOIR.paper,
    hand: 'sticks',
    legs: NOIR.ink,
    long: true,
    feet: SHOES,
    head: null,
  },
  fighter: {
    torso: (
      <>
        <path d={TORSO} fill={SKIN} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke="#8a4f2b" strokeWidth={0.8} />
        <rect x={23} y={55} width={18} height={4} fill={NOIR.red} />
      </>
    ),
    sleeve: NOIR.paper,
    hand: 'gloves',
    legs: NOIR.ink,
    long: false,
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
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={15} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={11} feet={outfit.feet} />}
      overHair={outfit.head}
    />
  )
}
