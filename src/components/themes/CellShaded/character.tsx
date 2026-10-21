import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { CEL } from './palette'
import world from './world.module.css'

// Him in Cell Shaded (the shared HeroFigure), every shape in flat colour with the one ink line round it:
// the System Engineer in a sky blue track jacket over a sun yellow tee band, cargo trousers and white
// sneakers; the Musician in a red sleeveless shirt and black jeans, sticks in hand; the Martial Artist
// bare chested in sun yellow Muay Thai shorts with an ink waistband, a red headband tied at the side,
// the red prajioud bands on his upper arms and sky blue gloves.

const EYE = CEL.ink
const CARGO = '#4c5a3a'
const SNEAKER = '#ffffff'
const JEANS = '#26262e'

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
const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  fist: (x) => <circle cx={x} cy={56} r={3} fill={SKIN} />,
  sticks: (x) => (
    <>
      <line x1={x} y1={54} x2={x} y2={74} stroke={CEL.sand} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={x} cy={56} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={56} r={4.8} fill={CEL.sky} />,
}

// The Muay Thai headband: a band along the hairline, its knot and two tails at the side.
const HEADBAND = (
  <>
    <path d="M21.6 12.5 Q32 7.6 42.4 12.5 L42.6 15.4 Q32 10.8 21.4 15.4 Z" fill={CEL.red} />
    <path d="M20.6 13.4 L15.4 16.2 L16.4 17.6 Z M20.8 14.8 L16.6 19.4 L18 20.2 Z" fill={CEL.red} />
  </>
)

const TORSO = 'M22 32 Q32 29 42 32 L41 59 L23 59 Z'

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={TORSO} fill={CEL.sky} />
        <path d="M29 31 L35 31 L34.5 59 L29.5 59 Z" fill={CEL.sun} />
        <rect x={23} y={46} width={18} height={3} fill={CEL.skyDeep} />
      </>
    ),
    sleeve: CEL.sky,
    legs: CARGO,
    long: true,
    feet: SNEAKER,
    hand: 'fist',
    head: null,
  },
  drummer: {
    torso: (
      <>
        <path d="M24 32 Q32 29.5 40 32 L40 59 L24 59 Z" fill={CEL.red} />
        <path d="M27 31 L32 36 L37 31" fill="none" stroke={CEL.ink} strokeWidth={1} />
      </>
    ),
    sleeve: SKIN,
    legs: JEANS,
    long: true,
    feet: CEL.ink,
    hand: 'sticks',
    head: null,
  },
  fighter: {
    torso: (
      <>
        <path d={TORSO} fill={SKIN} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke="#8a4f2b" strokeWidth={0.8} />
        <rect x={23} y={55} width={18} height={4} fill={CEL.ink} />
      </>
    ),
    sleeve: CEL.red,
    legs: CEL.sun,
    long: false,
    feet: SKIN,
    hand: 'gloves',
    head: HEADBAND,
  },
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={`${world.inked} ${className}`}
      eye={EYE}
      torso={outfit.torso}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={15} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={11} feet={outfit.feet} />}
      overHair={outfit.head}
    />
  )
}
