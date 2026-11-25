import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { fadeTo, r1, transformTo } from '../../shared/stageNodes'
import type { Move } from '../motion'
import { applyPose, FIGURE_BOX, FIGURE_RASTER, Runner, runnerParts } from '../runner'

// What every era's set piece is made of. A set piece is one place of the run behind its portal: the place
// and who he meets there, drawn in code in the box's units (cover.ts BOX: 640 by 480, the ground at y 400),
// and a writer that poses everything from the scene's playhead. The shared scene player plays its one to
// three actions (src/lib/scroll/player.ts); `u` is the action playing plus how far it has played (0 to 3),
// so every frame is a function of the playhead alone and reads the same played backward, and the end of the
// last action is the frame reduced motion shows. He is the corridor's runner (runner.tsx), drawn once per
// set and turned the way he moves (motion.ts): his back when he runs into the screen, his front when he runs
// at the camera, his side when he runs across it, and every spin a turn in depth. From About on the firefly
// guardian, our own small creature, rides at his shoulder.

/** What a set piece knows of the page: the profession shown and how many cards its section has. */
export interface SetInput {
  profession: Profession
  count: number
}

export interface SetPiece {
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** The sky behind the box, top to bottom. */
  sky: readonly [string, string]
  /** The place and its cast in the box's units, him among them (Hero). */
  art: (input: SetInput) => ReactNode
  /** Finds the nodes it moves once and returns its writer over `u`. */
  bind: (root: Element, input: SetInput) => (u: number) => void
  /** The middle of its action across the box, in box units, which a phone moves to the zigzag's side. */
  focus: number
}

/** The playhead as one number: the action playing plus how far it has played. */
export const uOf = ({ action, t }: Playhead): number => action + t

/** His size in a set, box units per runner unit: about 170 units from his soles to his ears. */
export const HERO_SCALE = 0.58

// The runner's svg stands its soles on this point of its own box once laid out.
const SOLE_X = -FIGURE_BOX.x * FIGURE_RASTER
const SOLE_Y = -FIGURE_BOX.y * FIGURE_RASTER

/** Him in the set: the runner, his soles on the group's origin; heroOf places and poses him. `figure` marks
 *  him as the hero's figure for the previews and the wardrobe. */
export function Hero({ figure = false }: { figure?: boolean }) {
  return (
    <g data-np="hero" {...(figure ? { 'data-worlds-figure': '' } : {})}>
      <g transform={`translate(${-SOLE_X} ${-SOLE_Y})`}>
        <Runner />
      </g>
    </g>
  )
}

/** Where he is: his soles at x, y, his size `s` of HERO_SCALE, a turn in degrees round his middle, and his move. */
export interface HeroAt {
  x: number
  y: number
  s?: number
  turn?: number
  move: Move
}

/** His writer in the set that holds `root`. */
export function heroOf(root: Element): (at: HeroAt) => void {
  const node = root.querySelector('[data-np="hero"]')
  const svg = node?.querySelector('svg')
  if (!node || !svg) return () => {}
  const parts = runnerParts(svg)
  return ({ x, y, s = 1, turn = 0, move }) => {
    const k = (HERO_SCALE * s).toFixed(3)
    transformTo(node, `translate(${r1(x)} ${r1(y)}) rotate(${r1(turn)} 0 -90) scale(${k})`)
    applyPose(parts, move)
  }
}

// ---- the firefly guardian ----

const GUARD = { body: '#fff6a8', glow: '#ffe14d', wing: '#c9f6ff', line: '#3a2a08' }

/** The firefly guardian, our own creature: a round glowing bug with two quick wings and two dark eyes. */
export function Guardian() {
  return (
    <g data-np="guard" opacity={0}>
      <circle r={30} fill={GUARD.glow} opacity={0.18} />
      <circle r={18} fill={GUARD.glow} opacity={0.35} />
      <g data-np="wings">
        <ellipse cx={-9} cy={-12} rx={8} ry={13} fill={GUARD.wing} opacity={0.8} transform="rotate(-30 -9 -12)" />
        <ellipse cx={9} cy={-12} rx={8} ry={13} fill={GUARD.wing} opacity={0.8} transform="rotate(30 9 -12)" />
      </g>
      <circle r={10} fill={GUARD.body} stroke={GUARD.line} strokeWidth={2} />
      <circle cx={-3.5} cy={-2} r={2} fill={GUARD.line} />
      <circle cx={3.5} cy={-2} r={2} fill={GUARD.line} />
    </g>
  )
}

/** The guardian's writer: at x, y, bobbing and beating its wings with `u`, `shown` 0 to 1. */
export function guardOf(root: Element): (x: number, y: number, u: number, shown?: number) => void {
  const node = root.querySelector('[data-np="guard"]')
  const wings = root.querySelector('[data-np="wings"]')
  return (x, y, u, shown = 1) => {
    fadeTo(node, shown)
    transformTo(node, `translate(${r1(x)} ${r1(y + 5 * Math.sin(u * 9))})`)
    transformTo(wings, `scale(1 ${(0.55 + 0.45 * Math.abs(Math.sin(u * 40))).toFixed(2)})`)
  }
}

/** Where the guardian rides: just behind his shoulder, at his size, `ahead` 1 when he faces right, -1 left. */
export const shoulder = (x: number, y: number, s = 1, ahead = 1): [number, number] => [x - 46 * s * ahead, y - 168 * s]

// ---- pieces ----

export const WOOD = { face: '#c8873f', lit: '#e8a95a', shade: '#8a5526', line: '#3b210c' }

/** A plain wooden crate, w wide, its bottom on 0,0; `mark` a number painted on its face. */
export function Crate({ w = 60, mark }: { w?: number; mark?: number }) {
  return (
    <g>
      <rect x={-w / 2} y={-w} width={w} height={w} fill={WOOD.face} stroke={WOOD.line} strokeWidth={3} />
      <rect x={-w / 2 + 5} y={-w + 5} width={w - 10} height={w - 10} fill="none" stroke={WOOD.shade} strokeWidth={4} />
      <path d={`M${-w / 2 + 6} ${-6} L${w / 2 - 6} ${-w + 6}`} stroke={WOOD.shade} strokeWidth={5} />
      <path d={`M${-w / 2} ${-w} h${w}`} stroke={WOOD.lit} strokeWidth={3} />
      {mark !== undefined && (
        <text x={0} y={-w / 2 + 9} textAnchor="middle" fontSize={w * 0.5} fontWeight={700} fontFamily="sans-serif" fill="#fff2b0" stroke={WOOD.line} strokeWidth={2} paintOrder="stroke">
          {mark}
        </text>
      )}
    </g>
  )
}

/** A broken crate's planks flying out, `t` 0 (whole) to 1 (scattered and gone). */
export function planksAt(t: number): Array<{ x: number; y: number; turn: number; opacity: number }> {
  return [-1, -0.4, 0.4, 1].map((side, i) => ({
    x: side * 70 * t,
    y: -40 - 90 * t + 140 * t * t + i * 4,
    turn: side * 220 * t,
    opacity: t <= 0 ? 0 : 1 - t,
  }))
}

/** A crate's planks, each a [data-np="{name}-{i}"] the writer throws (planksAt). */
export function Planks({ name, w = 60 }: { name: string; w?: number }) {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} data-np={`${name}-${i}`} x={-w / 2} y={-6} width={w * 0.7} height={11} fill={i % 2 ? WOOD.lit : WOOD.face} stroke={WOOD.line} strokeWidth={2} opacity={0} />
      ))}
    </>
  )
}

/** Throws a crate's planks at `t`, from its bottom centre x, y. */
export function throwPlanks(root: Element, name: string, x: number, y: number, t: number, s = 1): void {
  planksAt(t).forEach((plank, i) => {
    const node = root.querySelector(`[data-np="${name}-${i}"]`)
    fadeTo(node, plank.opacity)
    transformTo(node, `translate(${r1(x + plank.x * s)} ${r1(y + plank.y * s)}) scale(${s.toFixed(2)}) rotate(${r1(plank.turn)})`)
  })
}

const CORE = { glass: '#d8f6ff', sand: '#ffd34d', frame: '#7a4cff', glow: '#ffe98a' }

/** A core of time: our own small hourglass in a violet frame, glowing, its foot on 0,0. */
export function Hourglass({ size = 1 }: { size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      <circle cy={-30} r={40} fill={CORE.glow} opacity={0.25} />
      <path d="M-16 -56 H16 L2 -30 L16 -4 H-16 L-2 -30 Z" fill={CORE.glass} stroke={CORE.frame} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-9 -50 H9 L1 -36 Z M-11 -6 H11 L1 -18 Z" fill={CORE.sand} />
      <rect x={-20} y={-62} width={40} height={7} rx={3} fill={CORE.frame} />
      <rect x={-20} y={-5} width={40} height={7} rx={3} fill={CORE.frame} />
    </g>
  )
}

/** A soft glow: rings fading out, no filter, so it scales cheaply. */
export function Glow({ r, color, x = 0, y = 0, strength = 1 }: { r: number; color: string; x?: number; y?: number; strength?: number }) {
  return (
    <g opacity={strength}>
      {[1, 0.72, 0.48, 0.28].map((share) => (
        <circle key={share} cx={x} cy={y} r={r * share} fill={color} opacity={0.18} />
      ))}
    </g>
  )
}

/** Puffs of dust or smoke round a point, each a [data-np="{name}-{i}"] the writer spreads (puffsTo). */
export function Puffs({ name, color, n = 5 }: { name: string; color: string; n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} data-np={`${name}-${i}`} r={14} fill={color} opacity={0} />
      ))}
    </>
  )
}

/** Spreads the puffs out from x, y at `t` (0 none, rising and fading to 1), `spread` units wide. */
export function puffsTo(root: Element, name: string, x: number, y: number, t: number, spread = 80, n = 5): void {
  for (let i = 0; i < n; i++) {
    const node = root.querySelector(`[data-np="${name}-${i}"]`)
    const side = n === 1 ? 0 : (i / (n - 1)) * 2 - 1
    fadeTo(node, t <= 0 || t >= 1 ? 0 : 0.7 * (1 - t))
    transformTo(node, `translate(${r1(x + side * spread * t)} ${r1(y - 30 * t - Math.abs(side) * 10 * t)}) scale(${(0.6 + 1.4 * t).toFixed(2)})`)
  }
}

// ---- depth along a road into the screen ----

// How fast things shrink with distance along a road: half size this far ahead.
const FOCUS = 260

/** Where a point `z` ahead on a road into the screen and `x` across it lands in the box, and its scale:
 *  the near end at y `near`, the vanishing point at vx, vy. */
export function along(z: number, x: number, { vx, vy, near }: { vx: number; vy: number; near: number }): { x: number; y: number; s: number } {
  const s = FOCUS / (FOCUS + Math.max(-FOCUS * 0.6, z))
  return { x: vx + x * s, y: vy + (near - vy) * s, s }
}

/** Writes a translate and a scale on a node. */
export const placeTo = (node: Element | null, x: number, y: number, s = 1, turn = 0): void =>
  transformTo(node, `translate(${r1(x)} ${r1(y)}) scale(${s.toFixed(3)})${turn ? ` rotate(${r1(turn)})` : ''}`)

/** A node of the set by its name. */
export const part = (root: Element, name: string): Element | null => root.querySelector(`[data-np="${name}"]`)
