import { MYTH } from './palette'

// The foes he fights, drawn in his sprite's language (one ink line round painted shapes), each facing
// left towards him, in a 60 by 80 box with the feet on y 78: the undead legionnaire with the round
// shield and spear, the harpy on her wings, the gorgon with the serpent hair and tail, and the one eyed
// giant with the bronze shield who takes the Muay Thai strikes.

const INK = MYTH.inkLine

function Inked({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
}

function Legionnaire() {
  return (
    <>
      <path d="M8 6 L20 76" stroke={INK} strokeWidth={3.4} />
      <path d="M8 6 L20 76" stroke={MYTH.leather} strokeWidth={1.6} />
      <Inked d="M4 2 L12 4 L8 12 Z" fill={MYTH.steel} />
      <Inked d="M30 50 L28 76 L34 76 L36 52 Z M40 50 L42 76 L48 76 L44 50 Z" fill={MYTH.boneShade} />
      <Inked d="M26 30 Q38 24 48 30 L46 54 L28 54 Z" fill={MYTH.bone} />
      <path d="M30 36 L44 36 M30 41 L44 41 M31 46 L43 46" stroke={MYTH.inkSoft} strokeWidth={1.4} />
      <Inked d="M26 50 L48 50 L50 60 L24 60 Z" fill={MYTH.kiltShade} />
      <Inked d="M28 10 Q37 4 46 10 L46 24 Q37 28 28 24 Z" fill={MYTH.bone} />
      <circle cx={33} cy={17} r={2.6} fill={MYTH.soul} />
      <Inked d="M26 12 Q36 0 48 10 L48 14 Q36 8 26 16 Z" fill={MYTH.bronze} />
      <Inked d="M30 4 Q38 -4 48 4 Q40 2 32 8 Z" fill={MYTH.terracotta} />
      <Inked d="M12 46 Q12 30 24 30 Q34 34 32 48 Q28 60 18 60 Q12 56 12 46 Z" fill={MYTH.bronze} />
      <circle cx={22} cy={45} r={4} fill={MYTH.goldPale} stroke={INK} strokeWidth={1.4} />
    </>
  )
}

function Harpy() {
  return (
    <>
      <Inked d="M36 28 Q50 6 60 18 Q54 22 56 30 Q50 28 48 36 Q44 32 40 38 Z" fill={MYTH.crimson} />
      <Inked d="M28 28 Q12 8 2 22 Q8 24 6 32 Q12 30 14 38 Q18 34 22 40 Z" fill={MYTH.terracottaDeep} />
      <Inked d="M24 26 Q32 22 38 28 L36 52 L26 52 Z" fill={MYTH.boneShade} />
      <Inked d="M26 52 L36 52 L40 66 L22 66 Z" fill={MYTH.crimson} />
      <path d="M26 66 L22 76 L18 78 M34 66 L36 76 L40 78" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <Inked d="M24 12 Q30 6 37 12 L37 24 Q31 28 25 24 Z" fill={MYTH.boneShade} />
      <Inked d="M22 10 Q30 0 40 8 Q42 18 38 26 Q36 14 30 12 Q24 14 22 22 Z" fill={MYTH.inkSoft} />
      <path d="M26 17 L29 18" stroke={MYTH.fireCore} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M24 22 L20 23 L24 25" fill={MYTH.bone} stroke={INK} strokeWidth={1.2} />
    </>
  )
}

function Gorgon() {
  return (
    <>
      <Inked d="M24 50 Q20 66 34 70 Q52 74 54 62 Q56 54 48 56 Q50 64 40 64 Q30 62 34 50 Z" fill={MYTH.hydra} />
      <path d="M38 66 Q46 68 50 62" stroke={MYTH.hydraEye} strokeWidth={1.2} fill="none" opacity={0.7} />
      <Inked d="M24 28 Q32 22 40 28 L38 52 L24 52 Z" fill={MYTH.hydra} />
      <Inked d="M10 34 L24 30 L26 36 L12 40 Z" fill={MYTH.hydraShade} />
      <path d="M10 26 Q4 36 10 46" fill="none" stroke={INK} strokeWidth={2.6} />
      <path d="M10 26 Q4 36 10 46" fill="none" stroke={MYTH.bronze} strokeWidth={1.4} />
      <path d="M10 26 L10 46" stroke={MYTH.bone} strokeWidth={0.8} />
      <Inked d="M24 10 Q31 4 38 10 L38 22 Q31 27 24 22 Z" fill={MYTH.hydra} />
      <circle cx={27} cy={16} r={2.4} fill={MYTH.hydraEye} />
      {['M26 8 Q20 0 14 4', 'M31 6 Q30 -2 24 -2', 'M36 7 Q42 0 46 4', 'M38 12 Q46 10 48 16', 'M24 12 Q16 10 14 16'].map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke={INK} strokeWidth={3.6} strokeLinecap="round" />
          <path d={d} fill="none" stroke={MYTH.elyGreen} strokeWidth={1.8} strokeLinecap="round" />
        </g>
      ))}
    </>
  )
}

function Cyclops() {
  return (
    <>
      <Inked d="M26 54 L22 78 L32 78 L34 58 Z M40 56 L42 78 L52 78 L48 54 Z" fill={MYTH.columnLight} />
      <Inked d="M18 24 Q36 12 54 24 Q58 44 50 58 L22 58 Q14 44 18 24 Z" fill={MYTH.terracottaDeep} />
      <Inked d="M20 48 L52 48 L54 60 L18 60 Z" fill={MYTH.leather} />
      <Inked d="M26 6 Q36 0 46 6 L48 22 Q38 28 26 22 Z" fill={MYTH.terracottaDeep} />
      <ellipse cx={32} cy={13} rx={5} ry={4} fill={MYTH.bone} stroke={INK} strokeWidth={1.4} />
      <circle cx={30} cy={13} r={2.2} fill={MYTH.hydraEye} />
      <path d="M28 20 L36 20" stroke={MYTH.bone} strokeWidth={1.6} />
      <Inked d="M4 40 Q4 22 18 22 Q30 26 28 42 Q24 56 12 56 Q4 52 4 40 Z" fill={MYTH.bronze} />
      <circle cx={15} cy={39} r={5} fill={MYTH.goldPale} stroke={INK} strokeWidth={1.4} />
    </>
  )
}

export const FOE = { legionnaire: Legionnaire, harpy: Harpy, gorgon: Gorgon, cyclops: Cyclops } as const

export type FoeName = keyof typeof FOE

export function FoeFigure({ name, className = '' }: { name: FoeName; className?: string }) {
  const Drawing = FOE[name]
  return (
    <svg viewBox="-4 -6 66 86" className={`overflow-visible ${className}`} aria-hidden="true">
      <Drawing />
    </svg>
  )
}
