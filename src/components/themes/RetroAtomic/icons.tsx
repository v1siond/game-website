import {
  ATOMIC_YELLOW,
  CHROME,
  DUST_BROWN,
  DUST_BROWN_DARK,
  PHOSPHOR_GREEN,
  ROCKET_RED,
  ROCKET_RED_DARK,
  RUST_ORANGE,
  SHELTER_BLUE_DARK,
  STEEL_EDGE,
  TERMINAL_AMBER,
} from './palette'
import world from './world.module.css'

// Retro Atomic's own atomic age art, drawn in house: the hazard trefoil, the atom with its orbiting
// electrons, the space age starburst, the finned rocket, the round shelter hatch and the town skyline
// with its saucer tower and the rocket on its pad.

export function RadiationSymbol({ size = 24, color = ATOMIC_YELLOW }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="12" fill={color} />
      <path d="M50 10 A40 40 0 0 1 84.6 30 L60 45 A10 10 0 0 0 50 38 Z" fill={color} />
      <path d="M84.6 70 A40 40 0 0 1 15.4 70 L40 55 A10 10 0 0 0 60 55 Z" fill={color} />
      <path d="M15.4 30 A40 40 0 0 1 50 10 L50 38 A10 10 0 0 0 40 45 Z" fill={color} />
    </svg>
  )
}

// The atom: three orbits and the electrons travelling them (the one ambient loop, still under reduced motion).
export function AtomSymbol({ size = 24, color = PHOSPHOR_GREEN }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="6" fill={color} />
      {[0, 60, 120].map((angle) => (
        <ellipse key={angle} cx="50" cy="50" rx="42" ry="14" fill="none" stroke={color} strokeWidth="2" transform={`rotate(${angle} 50 50)`} />
      ))}
      <g className={world.orbit}>
        <circle cx="92" cy="50" r="4" fill={color} />
        <circle cx="29" cy="86.4" r="4" fill={color} />
        <circle cx="29" cy="13.6" r="4" fill={color} />
      </g>
    </svg>
  )
}

const STAR_POINTS = Array.from({ length: 8 }, (_, i) => i * 45)

// The space age starburst: eight long rays and eight short ones round a dot.
export function Starburst({ size = 24, color = ATOMIC_YELLOW }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {STAR_POINTS.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <path d="M50 2 L53 50 L47 50 Z" fill={color} />
          <path d="M50 50 L72 28" stroke={color} strokeWidth="2" />
        </g>
      ))}
      <circle cx="50" cy="50" r="7" fill={color} />
    </svg>
  )
}

// The finned rocket: a red hull, a porthole, three fins and the flame under it.
export function Rocket({ size = 60 }: { size?: number }) {
  return (
    <svg width={size * 0.5} height={size} viewBox="0 0 50 100" aria-hidden="true" focusable="false">
      <path d="M25 2 Q40 22 38 70 H12 Q10 22 25 2 Z" fill={ROCKET_RED} />
      <path d="M25 2 Q31 10 34 22 H16 Q19 10 25 2 Z" fill={CHROME} />
      <circle cx="25" cy="38" r="7" fill={SHELTER_BLUE_DARK} stroke={CHROME} strokeWidth="2" />
      <path d="M12 52 L2 78 L13 72 Z M38 52 L48 78 L37 72 Z" fill={ROCKET_RED_DARK} />
      <rect x="22" y="56" width="6" height="22" fill={ROCKET_RED_DARK} />
      <path d="M16 72 Q25 98 34 72 Z" fill={TERMINAL_AMBER} />
      <path d="M20 72 Q25 88 30 72 Z" fill={ATOMIC_YELLOW} />
    </svg>
  )
}

const HATCH_BOLTS = Array.from({ length: 12 }, (_, i) => i * 30)

// The round shelter hatch, shut: the steel rim and its bolts, the door with its wheel.
export function ShelterHatch({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="48" fill={STEEL_EDGE} />
      {HATCH_BOLTS.map((angle) => (
        <circle key={angle} cx="50" cy="6" r="2.5" fill={CHROME} transform={`rotate(${angle} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="40" fill={SHELTER_BLUE_DARK} />
      <circle cx="50" cy="50" r="30" fill="none" stroke={ATOMIC_YELLOW} strokeWidth="2" />
      <circle cx="50" cy="50" r="16" fill="none" stroke={CHROME} strokeWidth="4" />
      <path d="M50 30 V70 M30 50 H70" stroke={CHROME} strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="5" fill={CHROME} />
    </svg>
  )
}

// The atomic age town at dusk: low blocks, a saucer topped tower, a boomerang roof and the rocket on its pad.
export function TownSkyline() {
  return (
    <svg className="h-32 w-full" viewBox="0 0 1200 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="atomicDusk" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={TERMINAL_AMBER} stopOpacity="0.1" />
          <stop offset="50%" stopColor={RUST_ORANGE} stopOpacity="0.15" />
          <stop offset="100%" stopColor={DUST_BROWN_DARK} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="1200" height="150" fill="url(#atomicDusk)" />

      <g fill={DUST_BROWN_DARK} opacity="0.55">
        <rect x="80" y="100" width="70" height="50" />
        <rect x="170" y="88" width="40" height="62" />
        <rect x="292" y="60" width="8" height="90" />
        <ellipse cx="296" cy="58" rx="34" ry="8" />
        <ellipse cx="296" cy="52" rx="14" ry="6" />
        <path d="M420 150 V110 L470 96 L520 110 V150 Z" />
        <path d="M560 112 L640 98 L720 112 L720 150 L560 150 Z" />
        <rect x="780" y="94" width="50" height="56" />
        <rect x="850" y="104" width="60" height="46" />
        <path d="M1040 150 L1050 70 Q1060 40 1070 70 L1080 150 Z" />
        <path d="M1028 150 L1046 118 L1046 150 Z M1092 150 L1074 118 L1074 150 Z" />
      </g>
      <path d="M360 150 L400 80 L404 82 L372 150 Z" fill={DUST_BROWN} opacity="0.35" />

      <path d="M0,145 Q200,140 400,145 T800,142 T1200,145 L1200,150 L0,150 Z" fill={DUST_BROWN_DARK} opacity="0.5" />
    </svg>
  )
}
