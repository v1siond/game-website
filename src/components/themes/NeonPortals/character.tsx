import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { PORTAL } from './palette'
import { HERO_SKIN as SKIN, HeroArm, HeroFigure, HeroLeg } from '@/components/scroll/HeroFigure'

// Him in Neon Portals (the shared HeroFigure), dressed as a dimension hopper per profession: a charcoal
// tee split by an orange and a blue seam (the two portal colours) and a rift band on the front wrist.

const EYE = '#07060f'
const TEE = '#2a2836'

interface Outfit {
  legs: string
  // Long trousers reach the shoe; shorts stop above the knee and show the shin.
  long: boolean
  feet: string
  hand: 'band' | 'sticks' | 'gloves'
}

const OUTFIT: Record<Profession, Outfit> = {
  engineer: { legs: '#3a3850', long: true, feet: '#15121c', hand: 'band' },
  drummer: { legs: '#1c1b29', long: false, feet: '#15121c', hand: 'sticks' },
  // Muay Thai: boxing gloves, satin shorts in the exit blue, bare feet.
  fighter: { legs: PORTAL.BLUE, long: false, feet: SKIN, hand: 'gloves' },
}

const HAND_DRAW: Record<Outfit['hand'], (x: number) => ReactNode> = {
  band: (x) => (
    <>
      <rect x={x - 3} y={49} width={6} height={3} fill={PORTAL.VIOLET} />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  sticks: (x) => (
    <>
      <line x1={x} y1={53} x2={x} y2={74} stroke="#f5d28a" strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={55} r={3} fill={SKIN} />
    </>
  ),
  gloves: (x) => <circle cx={x} cy={55} r={4.6} fill={PORTAL.ORANGE} stroke="#7a4300" strokeWidth={0.8} />,
}

export function HeroCharacter({ profession, className = '' }: { profession: Profession; className?: string }) {
  const outfit = OUTFIT[profession]

  return (
    <HeroFigure
      className={className}
      eye={EYE}
      torso={
        <>
          {/* the charcoal tee, split by the orange and blue seams */}
          <path d="M22 32 Q32 29 42 32 L41 59 L23 59 Z" fill={TEE} />
          <line x1={30.5} y1={33} x2={30.5} y2={58} stroke={PORTAL.ORANGE} strokeWidth={1.2} />
          <line x1={33.5} y1={33} x2={33.5} y2={58} stroke={PORTAL.BLUE} strokeWidth={1.2} />
        </>
      }
      arm={(x) => <HeroArm x={x} sleeve={TEE} forearm={14} hand={HAND_DRAW[outfit.hand](x)} />}
      leg={(x) => <HeroLeg x={x} legs={outfit.legs} long={outfit.long} shorts={12} feet={outfit.feet} />}
    />
  )
}
