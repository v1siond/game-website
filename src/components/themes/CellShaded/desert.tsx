import { createContext, useContext, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { fx, transformTo } from '../shared/stageNodes'
import { HATCH } from './ink'
import { CEL } from './palette'
import { CommandoSprite, SPRITE_VIEW } from './sprite'
import cel from './cel.module.css'

// The drawing kit of the inked desert behind the page, drawn like a comic: flat saturated fills under one
// black ink line, hatching on the shadow sides. Every scene is a stack of SVG layers on one 1600 by 1000
// canvas anchored to its bottom centre (xMidYMax slice) on a wide screen; a phone frames it from y 280 down
// past its foot (PHONE_VIEW), so it sees about x 520 to 1080 with the sand half way down the screen and the
// sand and the sky's low band run on below the canvas to fill it: the sky in three hard bands of the scene's hour with its sun, the far mesas,
// the near dunes, the packed sand he runs, and the scrub and dust in front. He is the commando
// (sprite.tsx) drawn into the canvas and posed by the scene's writer (pose.ts).

export const W = 1600
export const H = 1000
/** The top of the packed sand: his soles and every prop stand on it. */
export const FLOOR = 880
/** How far the sand runs on below the canvas, for a phone's taller view. */
const BELOW = 500
const VIEW = `0 0 ${W} ${H}`
const PHONE_VIEW = `0 280 ${W} 1200`

/** Whether the scene's canvas is framed for a phone; its layers are drawn inside the scene's own value. */
export const PhoneView = createContext(false)

/** His drawn height on the canvas, about a third of the view. */
export const FIGURE_H = 300
const FIGURE_W = (FIGURE_H * SPRITE_VIEW.width) / SPRITE_VIEW.height

/** The hour of the desert a scene stands in: its three sky bands, high to low, and its sun. */
export interface Hour {
  high: string
  mid: string
  low: string
  sun: { x: number; y: number; fill: string } | null
}

export const HOURS = {
  noon: { high: CEL.noonHigh, mid: CEL.noonMid, low: CEL.noonLow, sun: { x: 1260, y: 170, fill: CEL.sun } },
  town: { high: CEL.townHigh, mid: CEL.sand, low: CEL.orange, sun: { x: 1300, y: 260, fill: CEL.sun } },
  dusk: { high: CEL.duskHigh, mid: CEL.magenta, low: CEL.duskLow, sun: { x: 1180, y: 520, fill: CEL.orange } },
  night: { high: CEL.nightHigh, mid: CEL.night, low: CEL.nightLow, sun: null },
} as const satisfies Record<string, Hour>

export function Canvas({ children, inked = true }: { children: ReactNode; inked?: boolean }) {
  const phone = useContext(PhoneView)
  return (
    <svg viewBox={phone ? PHONE_VIEW : VIEW} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} className={inked ? cel.inked : undefined} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const STARS = [
  [120, 90], [300, 200], [460, 60], [640, 160], [820, 80], [980, 220], [1140, 110], [1320, 60], [1480, 180], [220, 320], [760, 300], [1400, 320],
]

/** The sky in three hard bands of the hour, its sun with the shadow side cut in, or the stars at night. */
export function Sky({ hour }: { hour: Hour }) {
  return (
    <Canvas inked={false}>
      <rect x={-200} width={W + 400} height={380} fill={hour.high} />
      <rect x={-200} y={380} width={W + 400} height={240} fill={hour.mid} />
      <rect x={-200} y={620} width={W + 400} height={H + BELOW - 620} fill={hour.low} />
      {hour.sun && (
        <g>
          <circle cx={hour.sun.x} cy={hour.sun.y} r={90} fill={hour.sun.fill} stroke={CEL.ink} strokeWidth="5" />
          <path d={`M${hour.sun.x + 40} ${hour.sun.y - 80} A90 90 0 0 1 ${hour.sun.x + 40} ${hour.sun.y + 80} A104 104 0 0 0 ${hour.sun.x + 40} ${hour.sun.y - 80} Z`} fill={CEL.orange} />
        </g>
      )}
      {!hour.sun && STARS.map(([x, y], i) => <circle key={`${x}-${y}`} cx={x} cy={y} r={i % 3 ? 3 : 5} fill={CEL.paper} />)}
    </Canvas>
  )
}

/** The far ridge of mesas, their shadow sides hatched. */
export function Mesas() {
  return (
    <Canvas>
      <path d="M-200 1000 L-200 640 L40 640 L80 520 L340 520 L380 630 L640 630 L680 470 L960 470 L1000 610 L1260 610 L1300 500 L1560 500 L1600 600 L1800 600 L1800 1000 Z" fill={CEL.mesa} />
      <path d="M300 520 L340 520 L380 630 L340 630 Z M920 470 L960 470 L1000 610 L960 610 Z M1520 500 L1560 500 L1600 600 L1560 600 Z" fill={CEL.mesaShade} data-bare />
      <path d="M300 520 L340 520 L380 630 L340 630 Z M920 470 L960 470 L1000 610 L960 610 Z M1520 500 L1560 500 L1600 600 L1560 600 Z" fill={HATCH} opacity="0.45" data-bare />
    </Canvas>
  )
}

/** The near dunes rolling under the mesas. */
export function Dunes() {
  return (
    <Canvas>
      <path d="M-200 1000 L-200 760 Q100 700 400 750 Q700 800 1000 730 Q1300 680 1800 760 L1800 1000 Z" fill={CEL.dune} />
      <path d="M1000 730 Q1300 680 1800 760 L1800 800 Q1300 730 1000 770 Z" fill={CEL.duneShade} data-bare />
    </Canvas>
  )
}

/** The packed sand he walks: its ink edge and the cracks across it. */
export function Ground() {
  return (
    <Canvas>
      <rect x={-200} y={FLOOR} width={W + 400} height={H + BELOW - FLOOR} fill={CEL.sand} />
      <rect x={-200} y={FLOOR + 60} width={W + 400} height={H + BELOW - FLOOR - 60} fill={CEL.duneShade} data-bare />
      <path d="M-40 920 L40 900 L90 930 M520 940 L600 910 L660 935 M1160 925 L1230 905 L1300 930" fill="none" strokeWidth="4" stroke={CEL.ink} />
    </Canvas>
  )
}

const SCRUB = [
  [40, 1000, 1.2],
  [1540, 1000, 1.4],
  [220, 1000, 0.8],
] as const

/** In front: scrub at the edges and the dust blowing across; the scene's writer drifts the dust. */
export function Front() {
  return (
    <Canvas>
      {SCRUB.map(([x, y, size]) => (
        <path key={x} d="M0 0 L-30 -70 M0 0 L0 -90 M0 0 L34 -64 M0 0 L-50 -36 M0 0 L56 -30" transform={`translate(${x} ${y}) scale(${size})`} fill="none" stroke={CEL.scrub} strokeWidth="10" strokeLinecap="round" data-bare />
      ))}
      <g data-fx="dust" opacity="0.5">
        {[180, 520, 900, 1260].map((x, i) => (
          <circle key={x} cx={x} cy={820 + (i % 2) * 40} r={14 + (i % 3) * 6} fill={CEL.dune} />
        ))}
      </g>
    </Canvas>
  )
}

/** The dust drifts this far across a scene. */
const DUST_DRIFT = 260

/** Drifts the dust over the scene's script, `played` 0 to 1 of it. */
export function dustWriter(stage: ParentNode): (played: number) => void {
  const dust = fx(stage, 'dust')
  return (played) => transformTo(dust, `translate(${(played * DUST_DRIFT).toFixed(1)} 0)`)
}

const figureAt = (x: number, lift = 0): string =>
  `translate(${(x - FIGURE_W / 2).toFixed(1)} ${(FLOOR - lift - FIGURE_H * (SPRITE_VIEW.soles / SPRITE_VIEW.height)).toFixed(1)})`

/** Him on the sand at `x` (his centre), in a profession's kit; the scene's writer moves and poses him. */
export function Commando({ x, profession }: { x: number; profession: Profession }) {
  return (
    <g data-fx="commando" transform={figureAt(x)}>
      <CommandoSprite profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}

/** Moves him to `x` on the sand, `lift` above it. */
export const placeCommando = (node: Element | null, x: number, lift = 0): void => transformTo(node, figureAt(x, lift))

/** Where his rifle's muzzle is on the canvas when he aims it level, standing at `x` and `lift` above the
 *  sand: his shoulder (60, 60 in the sprite's units) and the arm and the rifle held out along it to x 190. */
export const muzzleAt = (x: number, lift = 0): { x: number; y: number } => {
  const scale = FIGURE_H / SPRITE_VIEW.height
  return { x: x - FIGURE_W / 2 + 190 * scale, y: FLOOR - lift - (SPRITE_VIEW.soles - 60) * scale }
}
