import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { NEON } from './palette'

// Him in Neon Cyber (the shared HeroFigure): the dark tee, dressed per profession, the trim lit in the
// world's magenta and cyan.

const EYE = NEON.void
const SHOE = NEON.shoe

interface Outfit {
  shirt: string
  trim: string
  legs: string
  // Long trousers reach the shoe; shorts stop above the knee and show the shin.
  long: boolean
  feet: string
  hand: 'fist' | 'sticks' | 'gloves'
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: { shirt: NEON.jacket, trim: NEON.cyan, legs: NEON.jeans, long: true, feet: SHOE, hand: 'fist' },
  drummer: { shirt: NEON.jacket, trim: NEON.magenta, legs: NEON.shorts, long: false, feet: SHOE, hand: 'sticks' },
  fighter: { shirt: NEON.jacket, trim: NEON.hotPink, legs: NEON.hotPink, long: false, feet: SKIN, hand: 'gloves' },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  fist: (x) => <circle cx={x} cy={56} r={3} fill={SKIN} />,
  sticks: (x) => (
    <>
      <line x1={x} y1={54} x2={x} y2={74} stroke={NEON.stickWood} strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={56} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={56} r={4.5} fill={NEON.hotPink} stroke={NEON.gloveTrim} strokeWidth={0.8} />,
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      torso={
        <>
          {/* the dark tee with the profession's neon trim at the collar and hem */}
          <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={outfit.shirt} />
          <path d="M27 31 Q32 35 37 31" fill="none" stroke={outfit.trim} strokeWidth={1.4} />
          <line x1={23} y1={58} x2={41} y2={58} stroke={outfit.trim} strokeWidth={1.4} />
        </>
      }
      arm={(x) => <HeroArm x={x} sleeve={outfit.shirt} forearm={15} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={11} feet={outfit.feet} />}
    />
  )
}
