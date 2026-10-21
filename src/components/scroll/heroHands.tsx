import { HERO_SKIN } from './HeroFigure'

// His hands in a scroll scene, drawn at the end of HeroArm's forearm (x, y is the hand's centre). A
// world passes only its colours; what the hand wears around it (a cuff, a wrap, a tracker) stays in the
// world's character.tsx.

interface HandProps {
  x: number
  y: number
}

interface FistProps extends HandProps {
  fill?: string
  r?: number
}

export function HeroFist({ x, y, fill = HERO_SKIN, r = 3 }: FistProps) {
  return <circle cx={x} cy={y} r={r} fill={fill} />
}

interface StickProps extends HandProps {
  color: string
  width?: number
}

// The drumstick held in the fist, its tip reaching below the hand; drawn under the fist.
export function HeroStick({ x, y, color, width = 2 }: StickProps) {
  return <line x1={x} y1={y - 2} x2={x} y2={y + 18} stroke={color} strokeWidth={width} strokeLinecap="round" />
}

interface GloveProps extends HandProps {
  fill: string
  r?: number
  stroke?: string
  strokeWidth?: number
}

export function HeroGlove({ x, y, fill, r = 4.8, stroke, strokeWidth }: GloveProps) {
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
}
