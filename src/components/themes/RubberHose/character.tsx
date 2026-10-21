import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { HOSE } from './palette'
import world from './world.module.css'

// Him in Rubber Hose (the shared HeroFigure), drawn the 1930s cartoon way, flat sepia fills under one
// ink line, white cartoon gloves and big round shoes: the System Engineer in a paper shirt with ink
// braces, a red bow tie and brown trousers; the Musician in a red and paper striped vaudeville vest and
// a straw boater, sticks in hand; the Martial Artist bare chested in red Muay Thai shorts with a gold
// waistband, the red headband with its gold band and tails, red prajioud bands on his upper arms and red
// gloves. His eyes stay his own ovals; pie eyes are for the props.

const EYE = HOSE.ink
const TROUSERS = HOSE.shadowDark
const GLOVE = HOSE.highlight

interface Outfit {
  torso: ReactNode
  sleeve: string
  legs: string
  long: boolean
  feet: string
  hand: 'glove' | 'sticks' | 'boxing'
  // Drawn in HeroFigure's over hair slot.
  head: ReactNode
}

// The hand sits at the end of the 15 unit forearm (y 54 to 58).
const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  glove: (x) => <circle cx={x} cy={56} r={3.6} fill={GLOVE} />,
  sticks: (x) => (
    <>
      <line x1={x} y1={54} x2={x} y2={75} stroke={HOSE.gold} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={x} cy={56} r={3.6} fill={GLOVE} />
    </>
  ),
  boxing: (x) => <circle cx={x} cy={56} r={4.8} fill={HOSE.red} />,
}

// The straw boater: the crown, its red band and the wide brim, tipped a little.
const BOATER = (
  <g transform="rotate(-6 32 8)">
    <rect x={23} y={1} width={18} height={7} rx={1} fill={HOSE.gold} />
    <rect x={23} y={5} width={18} height={2.4} fill={HOSE.redDark} />
    <ellipse cx={32} cy={8.4} rx={14} ry={2.2} fill={HOSE.gold} />
  </g>
)

// The Muay Thai headband: a red band along the hairline with a gold stripe, its knot and two tails.
const HEADBAND = (
  <>
    <path d="M21.6 12.5 Q32 7.6 42.4 12.5 L42.6 15.4 Q32 10.8 21.4 15.4 Z" fill={HOSE.red} />
    <path d="M22 13.6 Q32 9.2 42 13.6" fill="none" stroke={HOSE.gold} strokeWidth={0.9} />
    <path d="M20.6 13.4 L15.4 16.2 L16.4 17.6 Z M20.8 14.8 L16.6 19.4 L18 20.2 Z" fill={HOSE.red} />
  </>
)

const TORSO = 'M22 32 Q32 29 42 32 L41 59 L23 59 Z'

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (
      <>
        <path d={TORSO} fill={HOSE.paper} />
        <path d="M26 31 L27 59 M38 31 L37 59" stroke={HOSE.ink} strokeWidth={2.2} />
        <path d="M28 31 L32 33.5 L28 36 Z M36 31 L32 33.5 L36 36 Z" fill={HOSE.red} />
        <circle cx={32} cy={33.5} r={1.2} fill={HOSE.redDark} />
      </>
    ),
    sleeve: HOSE.paper,
    legs: TROUSERS,
    long: true,
    feet: HOSE.ink,
    hand: 'glove',
    head: null,
  },
  drummer: {
    torso: (
      <>
        <path d={TORSO} fill={HOSE.paper} />
        <path d="M24 32 Q32 30 40 32 L40 59 L24 59 Z" fill={HOSE.red} />
        <path d="M28 32 V59 M32 31 V59 M36 32 V59" stroke={HOSE.paper} strokeWidth={1.4} />
        <path d="M27 31 L32 37 L37 31" fill={HOSE.paper} />
      </>
    ),
    sleeve: HOSE.paper,
    legs: HOSE.ink,
    long: true,
    feet: HOSE.ink,
    hand: 'sticks',
    head: BOATER,
  },
  fighter: {
    torso: (
      <>
        <path d={TORSO} fill={SKIN} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke={HOSE.shadowDark} strokeWidth={0.8} />
        <rect x={23} y={55} width={18} height={4} fill={HOSE.gold} />
      </>
    ),
    sleeve: HOSE.red,
    legs: HOSE.red,
    long: false,
    feet: SKIN,
    hand: 'boxing',
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
