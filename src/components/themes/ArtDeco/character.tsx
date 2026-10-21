import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { DECO_COLORS } from './palette'

// Him in the city under the sea (the shared HeroFigure), dressed the way the city dressed in 1959: the System Engineer
// in shirt sleeves, a navy waistcoat with brass buttons and a maroon tie; the Musician in the white
// dinner jacket and black bow tie of a ballroom band; the Martial Artist bare chested in gold Muay Thai
// shorts, the red prajioud bands on his upper arms and red gloves with gold cuffs.

const EYE = '#0a1420'

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  // Long trousers reach the shoe; shorts stop above the knee and show the shin.
  long: boolean
  feet: string
  hand: 'fist' | 'sticks' | 'gloves'
}

const SHIRT = DECO_COLORS.cream
const WAISTCOAT = '#1b2a44'
const DINNER_JACKET = '#efe6d2'
const TROUSERS = '#1c1c24'
const SHOES = '#3a2414'
const MAROON = DECO_COLORS.blood

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={SHIRT} />
        <path d="M24 33 L30 33 L32 46 L34 33 L40 33 L40.5 59 L23.5 59 Z" fill={WAISTCOAT} />
        <path d="M30.5 31 L33.5 31 L33 44 L32 47 L31 44 Z" fill={MAROON} />
        {[48, 52, 56].map((y) => (
          <circle key={y} cx={32} cy={y} r={0.9} fill={DECO_COLORS.gold} />
        ))}
      </>
    ),
    sleeve: SHIRT,
    legs: TROUSERS,
    long: true,
    feet: SHOES,
    hand: 'fist',
  },
  drummer: {
    torso: (
      <>
        <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={DINNER_JACKET} />
        <path d="M27 31 L32 44 L37 31" fill="none" stroke={DECO_COLORS.brassDark} strokeWidth={0.8} />
        <path d="M28.5 31 L32 33 L35.5 31 L35.5 35 L32 33 L28.5 35 Z" fill={TROUSERS} />
      </>
    ),
    sleeve: DINNER_JACKET,
    legs: TROUSERS,
    long: true,
    feet: TROUSERS,
    hand: 'sticks',
  },
  fighter: {
    torso: (
      <>
        <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={SKIN} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke="#8a4f2b" strokeWidth={0.8} />
        <rect x={23} y={55} width={18} height={4} fill={MAROON} />
      </>
    ),
    sleeve: MAROON,
    legs: DECO_COLORS.gold,
    long: false,
    feet: SKIN,
    hand: 'gloves',
  },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  fist: (x) => <circle cx={x} cy={56} r={3} fill={SKIN} />,
  sticks: (x) => (
    <>
      <line x1={x} y1={54} x2={x} y2={74} stroke={DECO_COLORS.goldBright} strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={56} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => (
    <>
      <circle cx={x} cy={56} r={4.5} fill={DECO_COLORS.blood} />
      <rect x={x - 3} y={50} width={6} height={2} fill={DECO_COLORS.gold} />
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
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={15} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={11} feet={outfit.feet} />}
    />
  )
}
