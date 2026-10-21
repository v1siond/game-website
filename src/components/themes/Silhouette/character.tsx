import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { SHADE } from './palette'

// Him in the silhouette world (the shared HeroFigure), dressed nearly black so he reads as a shape
// against the lit sky, a thin rim of light down the edge of his clothes that faces it:
// - System Engineer: a long black work coat with the rim down its back, dark trousers and boots.
// - Musician: a black tank top, dark jeans, bare arms, pale sticks that catch the light.
// - Martial Artist: bare chested in black Muay Thai shorts with an ember waistband, the mongkhon
//   (the corded ring a Muay Thai fighter wears on his head) over his hair, prajioud bands on his upper
//   arms, dark red gloves and bare feet.

const EYE = SHADE.raised
const COAT = SHADE.coat
const TROUSERS = SHADE.trousers
const BOOT = SHADE.black
const GLOVE = SHADE.glove

// The shirt or coat outline under his neck, in HeroFigure's 64 by 96 box.
const TORSO = 'M22 32 Q32 29 42 32 L41 59 L23 59 Z'

// The rim of light on the edge of his torso that faces the sky (his back, on the left).
const torsoRim = (color: string) => <path d="M22.4 33 L23.4 58" stroke={color} strokeWidth={1} />

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
      <line x1={x} y1={53} x2={x} y2={73} stroke={SHADE.rim} strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => (
    <>
      <rect x={x - 3.6} y={35} width={7.2} height={2.4} fill={SHADE.ember} />
      <circle cx={x} cy={55} r={4.8} fill={GLOVE} stroke={SHADE.rim} strokeWidth={0.6} />
    </>
  ),
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={TORSO} fill={COAT} />
        <path d="M23 59 L22 66 L42 66 L41 59 Z" fill={COAT} />
        {torsoRim(SHADE.dawnRim)}
      </>
    ),
    sleeve: COAT,
    legs: TROUSERS,
    long: true,
    shorts: 0,
    feet: BOOT,
    hand: 'bare',
    overHair: null,
  },
  drummer: {
    torso: (
      <>
        <path d={TORSO} fill={SKIN} />
        <path d="M25 33 H39 L41 59 H23 Z" fill={SHADE.black} />
        {torsoRim(SHADE.rim)}
      </>
    ),
    sleeve: SKIN,
    legs: TROUSERS,
    long: true,
    shorts: 0,
    feet: BOOT,
    hand: 'sticks',
    overHair: null,
  },
  fighter: {
    torso: (
      <>
        <path d={TORSO} fill={SKIN} />
        <rect x={23} y={56} width={18} height={3} fill={SHADE.ember} />
        {torsoRim(SHADE.rim)}
      </>
    ),
    sleeve: SKIN,
    legs: SHADE.black,
    long: false,
    shorts: 12,
    feet: SKIN,
    hand: 'gloves',
    overHair: (
      <>
        <path d="M21.6 12.8 Q32 8.6 42.4 12.8" stroke={SHADE.rim} strokeWidth={2.2} fill="none" />
        <path d="M42 12.6 Q46 10 47 5" stroke={SHADE.rim} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </>
    ),
  },
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      overHair={outfit.overHair}
      torso={outfit.torso}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve} forearm={14} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={outfit.shorts} feet={outfit.feet} />}
    />
  )
}
