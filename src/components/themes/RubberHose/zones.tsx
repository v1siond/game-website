import type { ComponentType, ReactNode } from 'react'
import { HOSE } from './palette'

// The three painted places of the walk, each as the layers of a scene's stage (stage.tsx), the way a
// 1930s cartoon paints its watercolour sets: the meadow (the pale sky and its clouds, the rolling hills,
// the path, the flowers in front), the carnival (the far peaks, the ferris wheel, the striped tent, the
// trodden ground) and the theatre (the deep red house, the proscenium arch, the footlights, the boards,
// the curtains). The page gets redder toward the end. Every layer is drawn on a 400 by 300 card and blown
// up to the 1440 by 1080 canvas; the scroll moves the layers.

export const VIEW = '0 0 1440 1080'

/** One card unit in canvas units. */
export const UNIT = 3.6

export type Zone = 'meadow' | 'carnival' | 'theatre'

export interface ZoneArt {
  sky: ComponentType
  far: ComponentType
  mid: ComponentType
  near: ComponentType
}

/** The ground line his shoes stand on in each place, in canvas units. */
export const GROUND: Record<Zone, number> = { meadow: 270 * UNIT, carnival: 252 * UNIT, theatre: 252 * UNIT }

/** A layer's art on the card, blown up to the canvas. */
const Card = ({ children }: { children: ReactNode }) => <g transform={`scale(${UNIT})`}>{children}</g>

function Cloud({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 30 Q-4 14 12 12 Q16 0 32 4 Q44 -6 56 6 Q72 4 72 20 Q84 24 76 34 Z" fill={HOSE.highlight} stroke={HOSE.ink} strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  )
}

function Flower({ x, y, petal }: { x: number; y: number; petal: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 Q-3 20 0 40" fill="none" stroke={HOSE.meadowDark} strokeWidth={3} />
      <path d="M0 26 Q-12 18 -16 24 Q-8 30 0 28" fill={HOSE.meadow} stroke={HOSE.ink} strokeWidth={1.6} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx={0} cy={-9} rx={5} ry={8} fill={petal} stroke={HOSE.ink} strokeWidth={1.6} transform={`rotate(${a})`} />
      ))}
      <circle r={7.5} fill={HOSE.gold} stroke={HOSE.ink} strokeWidth={1.8} />
    </g>
  )
}

// ---------------------------------------------------------------- the meadow

function MeadowSky() {
  return (
    <Card>
      <rect width={400} height={300} fill={HOSE.skyWash} />
      <ellipse cx={300} cy={60} rx={160} ry={40} fill={HOSE.highlight} opacity={0.5} />
      <Cloud x={20} y={60} scale={0.9} />
      <Cloud x={230} y={110} scale={0.6} />
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
      <Flower x={30} y={250} petal={HOSE.orange} />
      <Flower x={372} y={246} petal={HOSE.red} />
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

// ---------------------------------------------------------------- the theatre

function TheatreSky() {
  return (
    <Card>
      <rect width={400} height={300} fill={HOSE.redDeep} />
      <rect width={400} height={300} fill={HOSE.film} opacity={0.35} />
    </Card>
  )
}

function TheatreFar() {
  return (
    <Card>
      <path d="M40 300 V90 Q200 10 360 90 V300" fill="none" stroke={HOSE.gold} strokeWidth={6} />
      <path d="M52 300 V96 Q200 24 348 96 V300" fill="none" stroke={HOSE.ink} strokeWidth={2} />
    </Card>
  )
}

function TheatreMid() {
  return (
    <Card>
      <path d="M0 222 H400 V300 H0 Z" fill={HOSE.boards} stroke={HOSE.ink} strokeWidth={2.4} />
      {[40, 100, 160, 220, 280, 340].map((x) => (
        <g key={x}>
          <path d={`M${x} 222 L${x - 6} 300`} stroke={HOSE.ink} strokeWidth={1.4} opacity={0.5} />
          <ellipse cx={x + 30} cy={226} rx={8} ry={3} fill={HOSE.footlight} stroke={HOSE.ink} strokeWidth={1.4} />
        </g>
      ))}
    </Card>
  )
}

function TheatreNear() {
  return (
    <Card>
      <path d="M0 0 H70 Q40 140 60 300 H0 Z" fill={HOSE.redDark} />
      <path d="M400 0 H330 Q360 140 340 300 H400 Z" fill={HOSE.redDark} />
      <path d="M0 0 H400 V22 Q200 40 0 22 Z" fill={HOSE.redDark} />
    </Card>
  )
}

export const ZONE_ART: Record<Zone, ZoneArt> = {
  meadow: { sky: MeadowSky, far: MeadowFar, mid: MeadowMid, near: MeadowNear },
  carnival: { sky: CarnivalSky, far: CarnivalFar, mid: CarnivalMid, near: CarnivalNear },
  theatre: { sky: TheatreSky, far: TheatreFar, mid: TheatreMid, near: TheatreNear },
}
