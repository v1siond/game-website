import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { pixelRuns } from '@/lib/pixelRuns'
import { PixelRuns } from '../../shared/PixelRuns'
import { frames, fx, r1, transformTo } from '../../shared/stageNodes'
import { FOE, HERO, HERO_OUTFITS, HERO_POSES, FOE_COLOURS, foeRows, heroParts, type FoeFrame, type HeroPose } from '../side'
import { TRAIL } from '../palette'

// The drawing kit of the side view levels behind the page. Every level is a stack of SVG layers on one
// 1600 by 1000 canvas anchored to its bottom centre (xMidYMax slice), so a phone, which sees about x 570
// to 1030, and a desktop crop the same art. The ground's top is at GROUND. He and the foes are the pixel
// sprites of side.ts, every frame drawn once and one shown at a time by the scene's writer.

export const W = 1600
export const H = 1000
export const GROUND = 880

/** One sprite pixel on the canvas: he is 16 by 26 pixels, so 96 by 156 units. */
export const PX = 6

/** A block (24 by 24 in its own box) on the canvas: as wide as he is. */
export const BLOCK = 4

const TILE = 24 * BLOCK
const GRASS_STEP = 104

export function Canvas({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The sky: a gradient over the whole canvas and its overscan. */
export function Sky({ id, top, low }: { id: string; top: string; low: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      <rect x={-200} y={0} width={W + 400} height={H} fill={`url(#${id})`} />
    </>
  )
}

/** A few square stars over a night sky. */
export function Stars({ at }: { at: ReadonlyArray<readonly [number, number]> }) {
  return (
    <>
      {at.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={8} height={8} fill={TRAIL.PAGE} opacity={0.8} />
      ))}
    </>
  )
}

// The far pill hills along the canvas: left edge, width and height.
const PILLS: ReadonlyArray<readonly [number, number, number]> = [
  [-160, 160, 300],
  [40, 120, 260],
  [150, 150, 340],
  [420, 110, 220],
  [520, 160, 300],
  [800, 130, 380],
  [1010, 120, 250],
  [1240, 150, 320],
  [1380, 110, 210],
  [1560, 150, 300],
]

/** The far range of tall pill hills, their feet at `base`. */
export function PillHills({ base, fill, edge }: { base: number; fill: string; edge: string }) {
  return (
    <g>
      {PILLS.map(([x, width, height]) => (
        <g key={x}>
          <rect x={x} y={base - height} width={width} height={height + 60} rx={width / 2} fill={fill} stroke={edge} strokeWidth={5} />
          <rect x={x + width * 0.16} y={base - height + width * 0.3} width={width * 0.1} height={height * 0.4} rx={width * 0.05} fill={TRAIL.PAGE} opacity={0.35} />
        </g>
      ))}
    </g>
  )
}

// The near round hills: centre, width and height.
const DOMES: ReadonlyArray<readonly [number, number, number]> = [
  [-40, 300, 150],
  [200, 300, 150],
  [420, 220, 110],
  [760, 340, 170],
  [1100, 260, 130],
  [1400, 320, 160],
  [1700, 260, 140],
]

/** The near range of round hills, their feet at `base`. */
export function DomeHills({ base, fill, edge }: { base: number; fill: string; edge: string }) {
  return (
    <g>
      {DOMES.map(([cx, width, height]) => (
        <g key={cx}>
          <path d={`M${cx - width / 2} ${base + 20} V${base - height * 0.5} A${width / 2} ${height * 0.5} 0 0 1 ${cx + width / 2} ${base - height * 0.5} V${base + 20} Z`} fill={fill} stroke={edge} strokeWidth={5} />
        </g>
      ))}
    </g>
  )
}

/** A cloud, 96 by 40 at `scale`, from its top left. */
export function Cloud({ x, y, scale = 2, fill = TRAIL.CLOUD }: { x: number; y: number; scale?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={3} y={8} width={90} height={28} rx={14} fill={fill} stroke={TRAIL.CLOUD_SHADE} strokeWidth={3} />
    </g>
  )
}

/** A low bush at a canvas edge in the foreground, its foot under the canvas. */
export function Bush({ x, fill }: { x: number; fill: string }) {
  return <path d={`M${x - 140} 1010 Q${x - 100} 910 ${x - 20} 920 Q${x + 40} 870 ${x + 120} 940 Q${x + 170} 930 ${x + 210} 1010 Z`} fill={fill} />
}

/** The plains ground along the canvas: grass on soil, its soil pattern panned with the camera. */
export function GrassGround({ shade }: { shade?: string }) {
  return (
    <>
      <rect x={-200} y={GROUND} width={W + 400} height={H - GROUND} fill={TRAIL.SOIL} />
      <rect x={-200} y={GROUND} width={W + 400} height={22} fill={TRAIL.GRASS} />
      <rect x={-200} y={GROUND + 22} width={W + 400} height={6} fill={TRAIL.HILL_NEAR_DARK} />
      <g data-fx="ground">
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={-160 + i * GRASS_STEP} y={GROUND + 54} width={30} height={12} rx={4} fill={TRAIL.SOIL_DARK} opacity={0.6} />
        ))}
      </g>
      {shade && <rect x={-200} y={GROUND} width={W + 400} height={H - GROUND} fill={shade} opacity={0.35} />}
    </>
  )
}

/** A ground of tiles along the canvas, two rows deep (the cave's bricks, the fortress's gold blocks). */
export function TileGround({ children }: { children: ReactNode }) {
  const xs = Array.from({ length: Math.ceil((W + 600) / TILE) }, (_, i) => -200 + i * TILE)
  return (
    <g data-fx="ground">
      {[GROUND, GROUND + TILE].flatMap((y) =>
        xs.map((x) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${BLOCK})`}>
            {children}
          </g>
        )),
      )}
    </g>
  )
}

/** A piece (pieces.tsx) with its top left at (x, y), `scale` times its own size; `name` marks it for the writer. */
export function Placed({ x, y, scale = BLOCK, name, children }: { x: number; y: number; scale?: number; name?: string; children: ReactNode }) {
  return (
    <g data-fx={name} transform={`translate(${r1(x)} ${r1(y)})`}>
      <g transform={`scale(${scale})`}>{children}</g>
    </g>
  )
}

function Pixels({ parts, colours }: { parts: ReadonlyArray<{ rows: readonly string[]; top: number }>; colours: Record<string, string> }) {
  return (
    <>
      {parts.map(({ rows, top }, part) => (
        <PixelRuns key={part} runs={pixelRuns(rows, top)} colours={colours} />
      ))}
    </>
  )
}

/** Him, every pose drawn once from his feet's centre; `stand` shows until the writer picks another. */
export function HeroRig({ profession, name = 'hero' }: { profession: Profession; name?: string }) {
  const { headgear, colours } = HERO_OUTFITS[profession]
  return (
    <g data-fx={name}>
      <g data-fx={`${name}-face`}>
        <g transform={`scale(${PX}) translate(${-HERO.width / 2} ${-HERO.height})`} shapeRendering="crispEdges">
          {HERO_POSES.map((pose) => (
            <g key={pose} data-frame={pose} visibility={pose === 'stand' ? 'visible' : 'hidden'}>
              <Pixels parts={heroParts(pose, headgear)} colours={colours} />
            </g>
          ))}
        </g>
      </g>
    </g>
  )
}

/** A foe, every frame of `kinds` drawn once from its feet's centre; the first shows until the writer picks another. */
export function FoeRig({ name, kinds }: { name: string; kinds: readonly FoeFrame[] }) {
  return (
    <g data-fx={name}>
      <g transform={`scale(${PX}) translate(${-FOE.width / 2} ${-FOE.height})`} shapeRendering="crispEdges">
        {kinds.map((frame, i) => (
          <g key={frame} data-frame={frame} visibility={i === 0 ? 'visible' : 'hidden'}>
            <Pixels parts={[{ rows: foeRows(frame), top: 0 }]} colours={FOE_COLOURS} />
          </g>
        ))}
      </g>
    </g>
  )
}

/** A rig's writer: where its feet stand, which frame shows, whether it faces left, and how far it is turned
 *  round its middle (a roll, a slide, a swing on a rope). */
export type RigWriter = (x: number, y: number, frame: string, left?: boolean, spin?: number) => void

// The middle of his sprite above his feet, which a spin turns round.
const MIDDLE = (HERO.height * PX) / 2

export function rigOf(stage: ParentNode, name: string, first: string): RigWriter {
  const node = fx(stage, name)
  const face = fx(stage, `${name}-face`)
  const show = frames(node, first)
  let facing = false
  return (x, y, frame, left = false, spin = 0) => {
    transformTo(node, `translate(${r1(x)} ${r1(y)})${spin ? ` rotate(${r1(spin)} 0 ${-MIDDLE})` : ''}`)
    show(frame)
    if (left === facing) return
    facing = left
    transformTo(face, left ? 'scale(-1 1)' : '')
  }
}

// He changes run frames every this many canvas units he moves, the way a sprite steps.
const STRIDE = 34

/** His run frame at x along the ground. */
export const runFrame = (x: number): HeroPose => (Math.floor(x / STRIDE) % 2 === 0 ? 'runA' : 'runB')

/** How tall he stands on the canvas, feet to the top of his head. */
export const HERO_TALL = HERO.height * PX

/** How tall a foe's frame is on the canvas. */
export const FOE_TALL = FOE.height * PX

/** The critter's walk frames and its squashed and tipped frames, for a FoeRig. */
export const CRITTER_FRAMES = ['critterA', 'critterB', 'critterFlat', 'critterTipped'] as const

// The critter changes step frames every this many canvas units it walks.
const CRITTER_STEP = 30

/** The critter's step frame at x along its walk. */
export const critterStep = (x: number): FoeFrame => (Math.floor(x / CRITTER_STEP) % 2 === 0 ? 'critterA' : 'critterB')
