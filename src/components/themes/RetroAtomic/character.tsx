import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN, HERO_SKIN_SHADE, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { Mongkhon } from '@/components/scroll/Mongkhon'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import {
  BAKELITE,
  CREAM,
  GLASS,
  OLIVE_DARK,
  PHOSPHOR,
  PHOSPHOR_DEEP,
  PHOSPHOR_DIM,
  POSTER_INK,
  SHELTER_BLUE,
  SHELTER_YELLOW,
  STEEL_LIGHT,
  WARNING_RED,
} from './palette'

// Him in Retro Atomic (the shared HeroFigure), in two tones:
// - poster: the flat colours of the mascot posters, each shape outlined in ink by the `.poster` class
//   in atomic.module.css (the outline is CSS stroke, so the figure itself stays the shared one);
// - phosphor: the green line figure of the wrist terminal's status screen, every fill a shade of the
//   tube's green on the glass.
// Dressed per profession: the blue shelter jumpsuit with its yellow stripe and the wrist terminal on his
// arm (System Engineer), a cream tee and dark jeans with sticks (Musician), bare chested in red shorts
// with the yellow mongkol and red gloves (Martial Artist).
// The front arm (HeroFigure draws it last, at x 41) carries a thumb; the world's CSS raises that arm
// from the shoulder for the thumbs up, so the thumb is drawn pointing down and out along the forearm
// and turns up when the arm swings over.

export type HeroTone = 'poster' | 'phosphor'

interface Inks {
  skin: string
  skinShade: string
  hair: string
  eye: string
  suit: string
  trim: string
  tee: string
  jeans: string
  shoe: string
  glove: string
  gadget: string
  stick: string
}

const INKS: Record<HeroTone, Inks> = {
  poster: {
    skin: HERO_SKIN,
    skinShade: HERO_SKIN_SHADE,
    hair: POSTER_INK,
    eye: POSTER_INK,
    suit: SHELTER_BLUE,
    trim: SHELTER_YELLOW,
    tee: CREAM,
    jeans: OLIVE_DARK,
    shoe: BAKELITE,
    glove: WARNING_RED,
    gadget: STEEL_LIGHT,
    stick: CREAM,
  },
  phosphor: {
    skin: PHOSPHOR_DEEP,
    skinShade: GLASS,
    hair: PHOSPHOR,
    eye: PHOSPHOR,
    suit: PHOSPHOR_DIM,
    trim: PHOSPHOR,
    tee: PHOSPHOR_DIM,
    jeans: PHOSPHOR_DEEP,
    shoe: PHOSPHOR,
    glove: PHOSPHOR,
    gadget: PHOSPHOR,
    stick: PHOSPHOR,
  },
}

type Hand = 'gadget' | 'sticks' | 'gloves'

interface Outfit {
  torso: (inks: Inks) => ReactNode
  sleeve: (inks: Inks) => string
  legs: (inks: Inks) => string
  long: boolean
  feet: (inks: Inks) => string
  hand: Hand
  head: (inks: Inks) => ReactNode
}

const FRONT_ARM_X = 41

// The thumb, along the forearm's line below the fist; up once the arm is raised.
const thumb = (x: number, y: number, inks: Inks) =>
  x === FRONT_ARM_X ? <path d={`M${x + 0.6} ${y + 1.5} l1.4 3.6`} stroke={inks.skin} strokeWidth={2.4} strokeLinecap="round" fill="none" /> : null

// The hand sits at the end of the 14 unit forearm (y 55).
const HAND_DRAW: Record<Hand, (x: number, y: number, inks: Inks) => ReactNode> = {
  gadget: (x, y, inks) => (
    <>
      <rect x={x - 3.6} y={y - 10} width={7.2} height={6} rx={1.2} fill={inks.gadget} />
      <rect x={x - 2.2} y={y - 9} width={4.4} height={3.2} fill={inks.trim} />
      <HeroFist x={x} y={y} fill={inks.skin} />
      {thumb(x, y, inks)}
    </>
  ),
  sticks: (x, y, inks) => (
    <>
      <HeroStick x={x} y={y} color={inks.stick} />
      <HeroFist x={x} y={y} fill={inks.skin} />
      {thumb(x, y, inks)}
    </>
  ),
  gloves: (x, y, inks) => <HeroGlove x={x} y={y} fill={inks.glove} stroke={inks.trim} strokeWidth={0.8} />,
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: {
    torso: (inks) => (
      <>
        <path d={HERO_TORSO} fill={inks.suit} />
        <rect x={30.5} y={31} width={3} height={28} fill={inks.trim} />
        <path d="M26 31 L32 36 L38 31" fill="none" stroke={inks.trim} strokeWidth={1.4} />
      </>
    ),
    sleeve: (inks) => inks.suit,
    legs: (inks) => inks.suit,
    long: true,
    feet: (inks) => inks.shoe,
    hand: 'gadget',
    head: () => null,
  },
  drummer: {
    torso: (inks) => <path d={HERO_TORSO} fill={inks.tee} />,
    sleeve: (inks) => inks.tee,
    legs: (inks) => inks.jeans,
    long: true,
    feet: (inks) => inks.shoe,
    hand: 'sticks',
    head: () => null,
  },
  fighter: {
    torso: (inks) => (
      <>
        <path d={HERO_TORSO} fill={inks.skin} />
        <path d="M26 40 Q32 43 38 40 M32 44 V54" fill="none" stroke={inks.skinShade} strokeWidth={0.8} />
        <rect x={23} y={56} width={18} height={3} fill={inks.trim} />
      </>
    ),
    sleeve: (inks) => inks.skin,
    legs: (inks) => inks.glove,
    long: false,
    feet: (inks) => inks.skin,
    hand: 'gloves',
    head: (inks) => <Mongkhon cord={inks.trim} />,
  },
}

interface HeroCharacterProps {
  profession: Profession
  className?: string
  tone?: HeroTone
}

export function HeroCharacter({ profession, className = '', tone = 'poster' }: HeroCharacterProps) {
  const outfit = OUTFIT[profession]
  const inks = INKS[tone]

  return (
    <HeroFigure
      className={className}
      eye={inks.eye}
      skin={inks.skin}
      skinShade={inks.skinShade}
      hair={inks.hair}
      torso={outfit.torso(inks)}
      arm={(x) => <HeroArm x={x} sleeve={outfit.sleeve(inks)} forearm={14} skin={inks.skin} hand={(y) => HAND_DRAW[outfit.hand](x, y, inks)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs(inks)} long={outfit.long} shorts={12} feet={outfit.feet(inks)} skin={inks.skin} />}
      overHair={outfit.head(inks)}
    />
  )
}
