import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HERO_SKIN as SKIN, HERO_TORSO, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'
import { HeroFist, HeroGlove, HeroStick } from '@/components/scroll/heroHands'
import { NEON } from './palette'

// Him in Neon Cyber (the shared HeroFigure): the dark tee, dressed per profession, the trim lit in the
// HUD's colours, and one piece of chrome, the optic at his right temple that the scanner reads through.

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
  engineer: { shirt: NEON.jacket, trim: NEON.data, legs: NEON.jeans, long: true, feet: SHOE, hand: 'fist' },
  drummer: { shirt: NEON.jacket, trim: NEON.hud, legs: NEON.shorts, long: false, feet: SHOE, hand: 'sticks' },
  fighter: { shirt: NEON.jacket, trim: NEON.chromeRed, legs: NEON.hotPink, long: false, feet: SKIN, hand: 'gloves' },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number, y: number) => ReactNode> = {
  fist: (x, y) => <HeroFist x={x} y={y} />,
  sticks: (x, y) => (
    <>
      <HeroStick x={x} y={y} color={NEON.stickWood} />
      <HeroFist x={x} y={y} />
    </>
  ),
  gloves: (x, y) => <HeroGlove x={x} y={y} fill={NEON.hotPink} r={4.5} stroke={NEON.gloveTrim} strokeWidth={0.8} />,
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      overHair={
        <>
          <rect x={40.5} y={14.5} width={4} height={6} rx={1} fill={NEON.steel} />
          <rect x={41.5} y={16} width={2} height={3} fill={NEON.hud} />
        </>
      }
      torso={
        <>
          {/* the dark tee with the profession's neon trim at the collar and hem */}
          <path d={HERO_TORSO} fill={outfit.shirt} />
          <path d="M27 31 Q32 35 37 31" fill="none" stroke={outfit.trim} strokeWidth={1.4} />
          <line x1={23} y1={58} x2={41} y2={58} stroke={outfit.trim} strokeWidth={1.4} />
        </>
      }
      arm={(x) => <HeroArm x={x} sleeve={outfit.shirt} forearm={15} hand={(y) => HAND_DRAW[outfit.hand](x, y)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={11} feet={outfit.feet} />}
    />
  )
}
