import { createContext, useContext, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { layerLeft, scatter, type Framing } from '@/lib/motion/sideScroll'
import { FIGURE_VIEW, ShadeFigure } from './figure'
import { LIGHTS, SHADE, type Light, type LightName } from './palette'

// The drawing kit of the one level the page runs through, drawn the way the side scrolling puzzle
// platformer it comes from is: black shapes on a pale grey glow, depth by fog, a small figure on a low
// ground line in a wide frame. Every scene is a stack of SVG layers on one 1600 by 1000 canvas anchored to its
// bottom (xMidYMax slice); a phone (PhoneView) frames a 460 wide slice round him with the ground a third of
// the way down its screen. The ground's top edge sits at 68% of the frame and he stands 11% of its height
// tall, held well right of the middle so the cards' column on the left never covers where he goes.
//
// The camera follows him along the level (src/lib/motion/sideScroll.ts): each layer is one group, data-fx
// pan-<layer>, that the scene's writer moves by its share of the camera's travel, the far trees least and
// the soft black shapes in front most. What stands in a layer is scattered by its place on the level, not by
// scene, so where one scene ends the next one starts on the same trees. The region of the level a shape
// stands in (the forest, the decayed city, the machines, the clearing) picks what it is.

const W = 1600
export const H = 1000
/** The top of the ground: his soles and every prop stand on it. */
export const FLOOR = 680
/** His drawn height on the canvas: about 11% of the frame, the game's scale. */
export const FIGURE_H = 110
const FIGURE_W = (FIGURE_H * FIGURE_VIEW.width) / FIGURE_VIEW.height
/** Where the camera holds him on the canvas when it has caught up: well right of the cards' column, so the
 *  obstacle he has just crossed stays in the clear part of the screen behind him. */
export const HOLD = 1150
/** Where he lies in the grass when the page opens, left of the hero's panel; on a phone the hold. */
const WAKE_X = 360

/** Whether the canvas is drawn for a phone's narrow, tall screen. */
export const PhoneView = createContext(false)

/** Where a scene starts him on screen and where the camera holds him at its end. */
export const framingOf = (wakes: boolean, phone: boolean): Framing => ({ start: wakes && !phone ? WAKE_X : HOLD, hold: HOLD })

// The phone's slice: 460 wide round the hold, him a little right of its middle so what he has just crossed
// shows behind him, and its top 550 above the ground, so the ground sits a little below the middle of the
// screen, clear of the shared bars and notices along its top.
const PHONE_VIEW = `${HOLD - 260} ${FLOOR - 550} 460 1000`

export function Canvas({ children }: { children: ReactNode }) {
  const phone = useContext(PhoneView)
  return (
    <svg viewBox={phone ? PHONE_VIEW : `0 0 ${W} ${H}`} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The parts of the level the page runs through, in order. */
export type Region = 'forest' | 'city' | 'machine' | 'clearing'

/** One scene's stretch as its layers draw it: where on the level he starts, how far he goes, where on
 *  screen the scene starts and holds him, and the region of every point of the level. */
export interface Run extends Framing {
  from: number
  length: number
  /** The region the scene's own stretch is in: it picks what stands in the layers behind and in front. */
  region: Region
  /** The region of each point of the level: it picks what grows on the ground, which meets the next
   *  stretch's ground exactly. */
  regionAt: (x: number) => Region
}

/** How far the camera travels over a scene's stretch. */
export const travelOf = ({ start, length, hold }: Run): number => start + length - hold

/** Each layer's share of the camera's travel: the further back, the less it moves. */
export const PAN = { far: 0.3, fog: 0.5, mid: 0.72, near: 1, figure: 1, fg: 1.45 } as const
export type PanLayer = keyof typeof PAN

// The part of a layer's level a scene shows, padded either side, and the shift from level to canvas.
function spanOf(run: Run, share: number) {
  const left = layerLeft(share, run.from - run.start)
  return { from: left - 400, to: left + share * travelOf(run) + W + 400, shift: left }
}

/** One layer's shapes: `draw` gets each scattered shape's canvas x, its share and the region it stands in.
 *  A layer that moves with the ground reads the region at its own point of the level; a layer behind or in
 *  front shows a different stretch of the level at every camera position, so it keeps the scene's region. */
function Scattered({ run, layer, spacing, seed, draw }: { run: Run; layer: PanLayer; spacing: number; seed: number; draw: (x: number, share: number, region: Region) => ReactNode }) {
  const share = PAN[layer]
  const { from, to, shift } = spanOf(run, share)
  return <>{scatter(from, to, spacing, seed).map(({ at, share: s }) => <g key={at}>{draw(at - shift, s, share === 1 ? run.regionAt(at) : run.region)}</g>)}</>
}

/** The sky: the pale glow the game's camera looks into, grey with the light's own tint, darker to the top. */
export function Sky({ light }: { light: LightName }) {
  const { top, low } = LIGHTS[light]
  const id = `sh-sky-${light}`
  return (
    <Canvas>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.7" stopColor={low} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.6" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      <ellipse cx={900} cy={360} rx={760} ry={330} fill={`url(#${id}-glow)`} />
    </Canvas>
  )
}

/** A pine seen far off through fog: one ragged three tier outline from its tip down to the ground line at y,
 *  no bare trunk showing, so no hard bar reads through the fog. */
function pinePath(x: number, height: number, y: number): string {
  const top = y - height
  const tier = (down: number, half: number) => `L${x + half} ${top + height * down} L${x + half * 0.45} ${top + height * (down - 0.02)}`
  const back = (down: number, half: number) => `L${x - half * 0.45} ${top + height * (down - 0.02)} L${x - half} ${top + height * down}`
  return `M${x} ${top} ${tier(0.4, height * 0.14)} ${tier(0.7, height * 0.2)} L${x + height * 0.26} ${y} L${x - height * 0.26} ${y} ${back(0.7, height * 0.2)} ${back(0.4, height * 0.14)} Z`
}

/** A gear outline: `teeth` square teeth round a ring of radius r, with a hub hole. */
export function gearPath(cx: number, cy: number, r: number, teeth: number): string {
  const step = (Math.PI * 2) / teeth
  const outer = r * 1.16
  const points = Array.from({ length: teeth }, (_, index) => {
    const a = index * step
    const corners = [
      [a - step * 0.25, r],
      [a - step * 0.16, outer],
      [a + step * 0.16, outer],
      [a + step * 0.25, r],
    ]
    return corners.map(([angle, radius]) => `${(cx + Math.cos(angle) * radius).toFixed(1)} ${(cy + Math.sin(angle) * radius).toFixed(1)}`).join(' L')
  })
  const hub = r * 0.32
  return `M${points.join(' L')} Z M${cx - hub} ${cy} A${hub} ${hub} 0 1 0 ${cx + hub} ${cy} A${hub} ${hub} 0 1 0 ${cx - hub} ${cy} Z`
}

const FAR_GROUND = FLOOR - 30

// The far shapes of each region, pale with fog: pines, the city's broken blocks, the machines' gears and
// tapered chimneys. Nothing with a bare bar or a crossbar, which reads as hard blocks through the fog.
const FAR_SHAPE: Record<Region, (x: number, s: number) => ReactNode> = {
  forest: (x, s) => <path d={pinePath(x, 240 + s * 260, FAR_GROUND)} />,
  clearing: (x, s) => (s < 0.55 ? null : <path d={pinePath(x, 160 + s * 140, FAR_GROUND)} />),
  city: (x, s) => {
    const w = 70 + s * 90
    const h = 180 + s * 260
    return <path d={`M${x} ${FAR_GROUND} V${FAR_GROUND - h} H${x + w * 0.4} L${x + w * 0.55} ${FAR_GROUND - h + 24} L${x + w * 0.7} ${FAR_GROUND - h + 6} H${x + w} V${FAR_GROUND} Z`} />
  },
  machine: (x, s) =>
    s < 0.35 ? (
      <path d={gearPath(x, FAR_GROUND - 160 - s * 200, 70 + s * 160, 12)} fillRule="evenodd" />
    ) : (
      <path d={`M${x - 40} ${FAR_GROUND} L${x - 16} ${FAR_GROUND - 300 - s * 160} H${x + 16} L${x + 40} ${FAR_GROUND} Z`} />
    ),
}

/** The far layer, pale with fog: a low ridge and the region's far shapes on it. */
export function Far({ run, light }: { run: Run; light: Light }) {
  return (
    <Canvas>
      <g data-fx="pan-far" fill={light.far} opacity={0.75}>
        <Scattered run={run} layer="far" spacing={150} seed={1} draw={(x, s, region) => FAR_SHAPE[region](x, s)} />
        <path d={`M${-W} ${FAR_GROUND + 10} Q${W} ${FAR_GROUND - 30} ${W * 3} ${FAR_GROUND} T${W * 7} ${FAR_GROUND} V${H * 2} H${-W} Z`} />
      </g>
    </Canvas>
  )
}

/** The fog over the ground: thickening from nothing down to the ground line, with soft banks drifting in it,
 *  in the light's own fog. No hard edge anywhere. */
export function Fog({ run, light }: { run: Run; light: Light }) {
  // one gradient per light: the hero's dawn and a profession's light share the page
  const fogId = `sh-fog-${light.fog.slice(1)}`
  return (
    <Canvas>
      <defs>
        <linearGradient id={fogId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light.fog} stopOpacity="0" />
          <stop offset="0.75" stopColor={light.fog} />
          <stop offset="1" stopColor={light.fog} />
        </linearGradient>
      </defs>
      <rect y={FLOOR - 300} width={W} height={330} fill={`url(#${fogId})`} />
      <g data-fx="pan-fog" fill={light.fog}>
        <Scattered run={run} layer="fog" spacing={420} seed={2} draw={(x, s) => <ellipse cx={x} cy={FLOOR - 60 - s * 140} rx={220 + s * 160} ry={40 + s * 30} />} />
      </g>
    </Canvas>
  )
}

// The mid shapes of each region a shade darker: trunks out of the top of the frame, the city's lamp posts,
// the machines' pipes and hanging chains.
const MID_SHAPE: Record<Region, (x: number, s: number) => ReactNode> = {
  forest: (x, s) => {
    const w = 18 + s * 30
    return <path d={`M${x} 0 H${x + w} V${FLOOR} H${x - 6} Q${x + w * 0.3} ${FLOOR * 0.55} ${x} 0 Z M${x + w * 0.5} ${200 + s * 120} Q${x + w + 60} ${240 + s * 120} ${x + w + 90} ${320 + s * 120} L${x + w + 82} ${324 + s * 120} Q${x + w + 50} ${260 + s * 120} ${x + w * 0.5} ${226 + s * 120} Z`} />
  },
  clearing: (x, s) => (s < 0.7 ? null : <path d={`M${x} 0 H${x + 20} V${FLOOR} H${x - 4} Z`} />),
  city: (x, s) => <path d={`M${x - 5} ${FLOOR} V${FLOOR - 380 - s * 80} H${x + 60} V${FLOOR - 370 - s * 80} H${x + 5} V${FLOOR} Z M${x + 48} ${FLOOR - 370 - s * 80} h16 v14 h-16 Z`} />,
  machine: (x, s) =>
    s < 0.5 ? (
      <path d={`M${x} 0 H${x + 26} V${FLOOR} H${x} Z M${x - 8} ${180 + s * 200} h42 v16 h-42 Z M${x - 8} ${420 + s * 100} h42 v16 h-42 Z`} />
    ) : (
      <path d={`M${x} 0 V${260 + s * 200}`} stroke="currentColor" strokeWidth={6} strokeDasharray="14 6" fill="none" />
    ),
}

/** The mid layer a shade darker. */
export function Mid({ run, light }: { run: Run; light: Light }) {
  return (
    <Canvas>
      <g data-fx="pan-mid" fill={light.mid} color={light.mid}>
        <Scattered run={run} layer="mid" spacing={460} seed={3} draw={(x, s, region) => MID_SHAPE[region](x, s)} />
      </g>
    </Canvas>
  )
}

/** A stretch of the ground's run that is open, from its start: a gap he must cross. */
export type Gap = readonly [number, number]

const BLADES = (region: Region) => region === 'forest' || region === 'clearing'

/** The black ground he runs on, open where the scene's gaps are, its edge in a rim of light, grass along
 *  it in the forest. Drawn in the scene's own units: x 0 is where he starts. */
export function Ground({ run, light, gaps = [] }: { run: Run; light: Light; gaps?: readonly Gap[] }) {
  const edges = [-400, ...gaps.flatMap(([a, b]) => [run.start + a, run.start + b]), travelOf(run) + W + 400]
  const solid = Array.from({ length: edges.length / 2 }, (_, i) => [edges[i * 2], edges[i * 2 + 1]] as const)
  const open = (x: number) => gaps.some(([a, b]) => x > run.start + a - 6 && x < run.start + b + 6)
  return (
    <Canvas>
      <g data-fx="pan-near">
        {solid.map(([a, b]) => (
          <g key={a}>
            <rect x={a} y={FLOOR} width={b - a} height={H} fill={SHADE.black} />
            <line x1={a} y1={FLOOR} x2={b} y2={FLOOR} stroke={light.rim} strokeOpacity={0.18} strokeWidth={2} />
          </g>
        ))}
        <g fill={SHADE.black}>
          <Scattered
            run={run}
            layer="near"
            spacing={16}
            seed={4}
            draw={(x, s, region) => (BLADES(region) && !open(x) ? <path d={`M${x - 3} ${FLOOR + 1} L${x} ${FLOOR - 8 - s * 22} L${x + 3} ${FLOOR + 1} Z`} /> : null)}
          />
        </g>
      </g>
    </Canvas>
  )
}

/** A soft edged black shape out of focus: the shape at full dark over a wider, fainter copy of itself. */
function Soft({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill={SHADE.black} opacity={0.35} stroke={SHADE.black} strokeOpacity={0.35} strokeWidth={34} strokeLinejoin="round" />
      <path d={d} fill={SHADE.black} opacity={0.85} />
    </>
  )
}

// The soft shapes hanging into the top of the frame in front of him: boughs and grass in the forest,
// pipes and a hanging chain end in the city and the machines. Nothing in front ever reaches his ground.
const FRONT_SHAPE: Record<Region, (x: number, s: number) => ReactNode> = {
  forest: (x, s) => <Soft d={`M${x - 160} 0 H${x + 200} Q${x + 90} ${70 + s * 60} ${x + 10} ${150 + s * 80} Q${x - 70} ${190 + s * 60} ${x - 160} ${170 + s * 50} Z`} />,
  clearing: (x, s) => (s < 0.5 ? null : <Soft d={`M${x - 120} 0 H${x + 120} Q${x + 40} ${60 + s * 40} ${x - 120} ${110 + s * 40} Z`} />),
  city: (x, s) => <Soft d={`M${x - 30} 0 H${x + 30} V${120 + s * 110} H${x - 30} Z`} />,
  machine: (x, s) => <Soft d={`M${x - 260} ${40 + s * 40} H${x + 260} V${96 + s * 40} H${x - 260} Z M${x + 120} 0 H${x + 150} V${200 + s * 60} H${x + 120} Z`} />,
}

/** In front, out of focus: the region's soft shapes along the top, and the heavy vignette the game's
 *  camera sees every place through. */
export function Front({ run }: { run: Run }) {
  return (
    <Canvas>
      <defs>
        <radialGradient id="sh-vignette" cx="0.55" cy="0.5" r="0.75">
          <stop offset="0.5" stopColor={SHADE.black} stopOpacity="0" />
          <stop offset="1" stopColor={SHADE.black} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <g data-fx="pan-fg">
        <Scattered run={run} layer="fg" spacing={1100} seed={5} draw={(x, s, region) => FRONT_SHAPE[region](x, s)} />
      </g>
      <rect width={W} height={H} fill="url(#sh-vignette)" />
    </Canvas>
  )
}

/** His group's transform: his centre at `x`, his soles `lift` above the floor, turned `over` of a head over
 *  heels flip round his middle seen side on (1 upside down on a ceiling, still facing the way he goes). */
export const figureAt = (x: number, lift = 0, over = 0): string => {
  const top = FLOOR - lift - FIGURE_H * (FIGURE_VIEW.soles / FIGURE_VIEW.height)
  const mid = FIGURE_H / 2
  const turn = over ? ` translate(0 ${mid}) scale(1 ${Math.cos(Math.PI * over).toFixed(3)}) translate(0 ${-mid})` : ''
  return `translate(${(x - FIGURE_W / 2).toFixed(1)} ${top.toFixed(1)})${turn}`
}

/** Him on the ground at `x` (his centre), in a profession's kit; the scene's writer moves and poses him. In
 *  the hero he carries the world's figure mark, which the outfit plate's swipe and the preview read. */
export function Figure({ x, profession, marked = false }: { x: number; profession: Profession; marked?: boolean }) {
  return (
    <g data-fx="figure" data-worlds-figure={marked ? '' : undefined} transform={figureAt(x)}>
      <ShadeFigure profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}
