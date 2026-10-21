import type { ReactNode } from 'react'
import { COLORS } from './palette'
import world from './world.module.css'

// Tropical Platformer's small SVG pieces, drawn in house: the fruit trail, gems and crystals, crates,
// the carved tiki mask and totem, and the warp portal. All decorative (aria-hidden); the idle loops
// live in world.module.css, transform and opacity only, stopped under reduced motion.

interface IconProps {
  size?: number
  className?: string
}

// A ripe mango with two leaves: the collectible he gathers along every level.
export function Mango({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <ellipse cx={16} cy={18} rx={12} ry={11} fill={COLORS.fruit} />
      <ellipse cx={16} cy={18} rx={10} ry={9} fill={COLORS.fruitGold} opacity={0.4} />
      <ellipse cx={11} cy={13} rx={4} ry={3} fill={COLORS.fruitShine} opacity={0.7} />
      <rect x={14} y={5} width={4} height={5} rx={1} fill={COLORS.wood} />
      <path d="M14 7 Q8 4 10 0 Q14 3 16 6 Z" fill={COLORS.leaf} />
      <path d="M18 7 Q24 4 22 0 Q18 3 16 6 Z" fill={COLORS.leafLight} />
    </svg>
  )
}

export type GemColor = 'clear' | 'red' | 'blue' | 'green' | 'yellow' | 'purple'

const GEM_TONES: Record<GemColor, { main: string; dark: string; light: string }> = {
  clear: { main: COLORS.gemClear, dark: '#B0B0B0', light: '#FFFFFF' },
  red: { main: COLORS.gemRed, dark: '#CC1144', light: '#FF6699' },
  blue: { main: COLORS.gemBlue, dark: '#0099CC', light: '#66DDFF' },
  green: { main: COLORS.gemGreen, dark: '#00CC77', light: '#66FFBB' },
  yellow: { main: COLORS.gemYellow, dark: '#CCCC00', light: '#FFFF66' },
  purple: { main: COLORS.gemPurple, dark: '#9933CC', light: '#DD77FF' },
}

export function Gem({ size = 24, color = 'clear', className = '' }: IconProps & { color?: GemColor }) {
  const tone = GEM_TONES[color]

  return (
    <svg viewBox="0 0 24 28" width={size} height={size * 1.17} className={className} aria-hidden="true" focusable="false">
      <path d="M12 2 L22 12 L12 15 L2 12 Z" fill={tone.main} />
      <path d="M12 15 L22 12 L12 26 L2 12 Z" fill={tone.dark} />
      <path d="M12 2 L2 12 L12 15 Z" fill={tone.light} opacity={0.4} />
      <path d="M8 8 L12 4 L14 8 L12 10 Z" fill="#fff" opacity={0.6} />
    </svg>
  )
}

export function Crystal({ size = 24, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 36" width={size} height={size * 1.5} className={className} aria-hidden="true" focusable="false">
      <path d="M12 2 L20 10 L20 28 L12 34 L4 28 L4 10 Z" fill={COLORS.crystal} />
      <path d="M12 2 L20 10 L20 28 L12 34 Z" fill={COLORS.crystalLight} opacity={0.7} />
      <path d="M12 2 L12 34" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      <path d="M8 10 L12 5 L14 10 L12 14 Z" fill="#fff" opacity={0.5} />
    </svg>
  )
}

// A carved wooden tiki mask crowned with two palm leaves.
export function TikiMask({ size = 60, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 50 75" width={size} height={size * 1.5} className={className} aria-hidden="true" focusable="false">
      <path d="M25 14 Q8 2 2 12 Q14 10 22 18 Z" fill={COLORS.leaf} />
      <path d="M25 14 Q42 2 48 12 Q36 10 28 18 Z" fill={COLORS.leafLight} />
      <path d="M10 20 Q5 30 7 50 Q10 65 25 70 Q40 65 43 50 Q45 30 40 20 Q35 12 25 12 Q15 12 10 20 Z" fill={COLORS.wood} />
      <path d="M15 25 Q20 28 20 45 M35 25 Q30 28 30 45" stroke={COLORS.woodMid} strokeWidth={0.8} fill="none" opacity={0.5} />
      <path d="M11 28 H22 V36 H11 Z M28 28 H39 V36 H28 Z" fill={COLORS.sun} />
      <rect x={14} y={30} width={5} height={4} fill={COLORS.woodDark} />
      <rect x={31} y={30} width={5} height={4} fill={COLORS.woodDark} />
      <path d="M22 40 L25 50 L28 40 Z" fill={COLORS.woodDark} />
      <rect x={14} y={54} width={22} height={7} rx={2} fill={COLORS.woodDark} />
      <path d="M16 54 V61 M21 54 V61 M26 54 V61 M31 54 V61" stroke={COLORS.sandLight} strokeWidth={1.5} />
      <path d="M20 65 Q25 68 30 65" stroke={COLORS.sun} strokeWidth={1.5} fill="none" />
    </svg>
  )
}

export type CrateVariant = 'wood' | 'bounce' | 'iron' | 'hazard' | 'flag'

const CRATE_LOOK: Record<CrateVariant, { fill: string; stroke: string }> = {
  wood: { fill: COLORS.wood, stroke: COLORS.woodLight },
  bounce: { fill: COLORS.leaf, stroke: COLORS.leafLight },
  iron: { fill: COLORS.iron, stroke: COLORS.ironLight },
  hazard: { fill: COLORS.hazard, stroke: COLORS.hazardDark },
  flag: { fill: COLORS.wood, stroke: COLORS.sun },
}

// What each crate carries on its face: nothing, a bounce arrow, rivets, warning stripes, a checkpoint flag.
const CRATE_MARK: Record<CrateVariant, () => ReactNode> = {
  wood: () => null,
  bounce: () => <path d="M20 10 L28 20 L23 20 L23 30 L17 30 L17 20 L12 20 Z" fill="#fff" />,
  iron: () => (
    <g fill={COLORS.ironLight}>
      <circle cx={10} cy={20} r={2} />
      <circle cx={30} cy={20} r={2} />
      <circle cx={20} cy={10} r={2} />
      <circle cx={20} cy={30} r={2} />
    </g>
  ),
  hazard: () => <path d="M2 30 L30 2 H38 L2 38 Z M14 38 L38 14 V22 L22 38 Z" fill={COLORS.sun} />,
  flag: () => (
    <>
      <path d="M15 10 V31" stroke={COLORS.sun} strokeWidth={2} />
      <path d="M16 10 L28 14 L16 19 Z" fill={COLORS.sun} />
    </>
  ),
}

export function Crate({ size = 40, className = '', variant = 'wood' }: IconProps & { variant?: CrateVariant }) {
  const { fill, stroke } = CRATE_LOOK[variant]
  const Mark = CRATE_MARK[variant]

  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <rect x={2} y={2} width={36} height={36} rx={2} fill={fill} stroke={stroke} strokeWidth={2} />
      <path d="M2 14 H38 M2 26 H38 M14 2 V14 M26 2 V14 M14 26 V38 M26 26 V38" stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
      <g fill="#555">
        <rect x={3} y={3} width={5} height={5} rx={1} />
        <rect x={32} y={3} width={5} height={5} rx={1} />
        <rect x={3} y={32} width={5} height={5} rx={1} />
        <rect x={32} y={32} width={5} height={5} rx={1} />
      </g>
      <Mark />
    </svg>
  )
}

export function TikiTotem({ size = 40, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 30 60" width={size} height={size * 2} className={className} aria-hidden="true" focusable="false">
      <rect x={8} y={50} width={14} height={10} fill={COLORS.wood} />
      <rect x={5} y={10} width={20} height={40} rx={2} fill={COLORS.wood} />
      <rect x={3} y={5} width={24} height={8} rx={2} fill={COLORS.woodMid} />
      <ellipse cx={11} cy={18} rx={3} ry={4} fill={COLORS.sun} />
      <ellipse cx={19} cy={18} rx={3} ry={4} fill={COLORS.sun} />
      <path d="M10 24 Q15 28 20 24" stroke={COLORS.hazard} strokeWidth={2} fill="none" />
      <rect x={5} y={28} width={20} height={3} fill={COLORS.leaf} />
      <ellipse cx={11} cy={38} rx={3} ry={4} fill={COLORS.sun} />
      <ellipse cx={19} cy={38} rx={3} ry={4} fill={COLORS.sun} />
      <path d="M10 42 Q15 46 20 42" stroke={COLORS.hazard} strokeWidth={2} fill="none" />
    </svg>
  )
}

// The warp portal: three dashed rings turning against each other around a bright core.
export function WarpPortal({ size = 100, className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <circle cx={50} cy={50} r={48} fill={COLORS.warp} opacity={0.18} />
      <circle cx={50} cy={50} r={48} fill="none" stroke={COLORS.warp} strokeWidth={4} opacity={0.5} />
      <circle cx={50} cy={50} r={40} fill="none" stroke={COLORS.seaLight} strokeWidth={6} strokeDasharray="25 10" className={world.spin} />
      <circle cx={50} cy={50} r={30} fill="none" stroke={COLORS.warpPink} strokeWidth={5} strokeDasharray="20 8" className={world.spinBack} />
      <circle cx={50} cy={50} r={20} fill="none" stroke={COLORS.warp} strokeWidth={4} strokeDasharray="15 6" className={world.spin} />
      <circle cx={50} cy={50} r={12} fill={COLORS.warp} opacity={0.8} />
      <circle cx={50} cy={50} r={8} fill={COLORS.seaLight} opacity={0.9} />
      <circle cx={50} cy={50} r={4} fill="#fff" />
    </svg>
  )
}
