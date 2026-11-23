import type { ComponentType, ReactNode } from 'react'
import { PieEyes } from './art'
import { HOSE } from './palette'

// The three painted places of the walk, each as the layers of a scene's stage (stage.tsx), the way a
// 1930s cartoon paints its watercolour sets: the meadow (the pale sky and its faced clouds, the rolling
// hills, the path, the faced flowers in front), the carnival (the far peaks, the ferris wheel, the striped
// tent, the trodden ground) and the casino (the deep red room, the grinning moon, the felt table, the
// curtains). The page gets redder toward the end. Every layer is drawn on a 400 by 300 card and blown up
// to the 1440 by 1080 canvas, and everything with a face holds still: the scroll moves the layers.

export const VIEW = '0 0 1440 1080'

/** One card unit in canvas units. */
export const UNIT = 3.6

export type Zone = 'meadow' | 'carnival' | 'casino'

export interface ZoneArt {
  sky: ComponentType
  far: ComponentType
  mid: ComponentType
  near: ComponentType
}

/** The ground line his shoes stand on in each place, in canvas units. */
export const GROUND: Record<Zone, number> = { meadow: 270 * UNIT, carnival: 252 * UNIT, casino: 252 * UNIT }

/** A layer's art on the card, blown up to the canvas. */
const Card = ({ children }: { children: ReactNode }) => <g transform={`scale(${UNIT})`}>{children}</g>

function FacedCloud({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 30 Q-4 14 12 12 Q16 0 32 4 Q44 -6 56 6 Q72 4 72 20 Q84 24 76 34 Z" fill={HOSE.highlight} stroke={HOSE.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <PieEyes cx={38} cy={20} size={16} paper={HOSE.highlight} />
      <path d="M32 27 Q38 31 44 27" fill="none" stroke={HOSE.ink} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  )
}

function FacedFlower({ x, y, petal }: { x: number; y: number; petal: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 Q-3 20 0 40" fill="none" stroke={HOSE.meadowDark} strokeWidth={3} />
      <path d="M0 26 Q-12 18 -16 24 Q-8 30 0 28" fill={HOSE.meadow} stroke={HOSE.ink} strokeWidth={1.6} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx={0} cy={-9} rx={5} ry={8} fill={petal} stroke={HOSE.ink} strokeWidth={1.6} transform={`rotate(${a})`} />
      ))}
      <circle r={7.5} fill={HOSE.gold} stroke={HOSE.ink} strokeWidth={1.8} />
      <PieEyes cx={0} cy={-1} size={9} paper={HOSE.gold} />
      <path d="M-3 3 Q0 5.5 3 3" fill="none" stroke={HOSE.ink} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  )
}

// ---------------------------------------------------------------- the meadow

function MeadowSky() {
  return (
    <Card>
      <rect width={400} height={300} fill={HOSE.skyWash} />
      <ellipse cx={300} cy={60} rx={160} ry={40} fill={HOSE.highlight} opacity={0.5} />
      <FacedCloud x={20} y={60} scale={0.9} />
      <FacedCloud x={230} y={110} scale={0.6} />
    </Card>
  )
}

function MeadowFar() {
  return (
    <Card>
      <path d="M0 190 Q70 140 150 170 T300 160 T400 150 V300 H0 Z" fill={HOSE.meadow} opacity={0.55} />
    </Card>
  )
}

function MeadowMid() {
  return (
    <Card>
      <path d="M0 220 Q90 180 190 214 T400 200 V300 H0 Z" fill={HOSE.meadow} />
      <path d="M120 214 Q160 230 150 300 H230 Q220 240 260 210" fill={HOSE.paperSepia} opacity={0.7} />
    </Card>
  )
}

function MeadowNear() {
  return (
    <Card>
      <path d="M0 262 Q60 246 120 258 Q180 270 240 256 Q320 246 400 258 V300 H0 Z" fill={HOSE.meadowDark} />
      <FacedFlower x={30} y={250} petal={HOSE.orange} />
      <FacedFlower x={372} y={246} petal={HOSE.red} />
    </Card>
  )
}

// ---------------------------------------------------------------- the carnival

function CarnivalSky() {
  return (
    <Card>
      <rect width={400} height={300} fill={HOSE.carnivalWash} />
      <path d="M0 150 L40 90 L70 140 L110 70 L150 150 Z M250 150 L300 80 L330 130 L360 96 L400 150 Z" fill={HOSE.shadow} opacity={0.35} />
    </Card>
  )
}

function CarnivalFar() {
  return (
    <Card>
      <g transform="translate(320 150)">
        <circle r={56} fill="none" stroke={HOSE.inkSoft} strokeWidth={3} />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M-56 0 H56" stroke={HOSE.inkSoft} strokeWidth={2} transform={`rotate(${a})`} />
        ))}
        <path d="M-30 90 L0 0 L30 90" fill="none" stroke={HOSE.inkSoft} strokeWidth={4} />
      </g>
    </Card>
  )
}

function CarnivalMid() {
  return (
    <Card>
      <path d="M40 210 L90 140 L140 210 Z" fill={HOSE.red} stroke={HOSE.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M65 210 L90 140 L115 210 Z" fill={HOSE.highlight} opacity={0.8} />
      <path d="M0 230 Q100 210 200 228 T400 222 V300 H0 Z" fill={HOSE.paperDark} />
    </Card>
  )
}

function CarnivalNear() {
  return (
    <Card>
      <path d="M0 270 Q120 250 240 268 T400 262 V300 H0 Z" fill={HOSE.shadowDark} />
    </Card>
  )
}

// ---------------------------------------------------------------- the casino

function CasinoSky() {
  return (
    <Card>
      <rect width={400} height={300} fill={HOSE.redDeep} />
      <rect width={400} height={300} fill={HOSE.film} opacity={0.35} />
    </Card>
  )
}

function CasinoFar() {
  return (
    <Card>
      <g transform="translate(200 90)">
        <circle r={26} fill={HOSE.paperSepia} stroke={HOSE.ink} strokeWidth={2.4} />
        <PieEyes cx={0} cy={-3} size={22} paper={HOSE.paperSepia} />
        <path d="M-9 9 Q0 16 9 9" fill="none" stroke={HOSE.ink} strokeWidth={2} strokeLinecap="round" />
      </g>
    </Card>
  )
}

function CasinoMid() {
  return (
    <Card>
      <path d="M0 220 Q200 190 400 220 V300 H0 Z" fill={HOSE.feltGreen} stroke={HOSE.ink} strokeWidth={2.4} />
    </Card>
  )
}

function CasinoNear() {
  return (
    <Card>
      <path d="M0 0 H70 Q40 140 60 300 H0 Z" fill={HOSE.redDark} />
      <path d="M400 0 H330 Q360 140 340 300 H400 Z" fill={HOSE.redDark} />
    </Card>
  )
}

export const ZONE_ART: Record<Zone, ZoneArt> = {
  meadow: { sky: MeadowSky, far: MeadowFar, mid: MeadowMid, near: MeadowNear },
  carnival: { sky: CarnivalSky, far: CarnivalFar, mid: CarnivalMid, near: CarnivalNear },
  casino: { sky: CasinoSky, far: CasinoFar, mid: CasinoMid, near: CasinoNear },
}
