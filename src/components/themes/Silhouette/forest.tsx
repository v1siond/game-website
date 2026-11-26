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
// tall, held in the half of the frame his section's cards leave free (holdOf), so they never cover where he goes.
//
// The camera follows him along the level (src/lib/motion/sideScroll.ts): each layer is one group, data-fx
// pan-<layer>, that the scene's writer moves by its share of the camera's travel, the far trees least and
// the soft black shapes in front most. What stands in a layer is scattered by its place on the level, not by
// scene, so where one scene ends the next one starts on the same trees. The region of the level a shape
// stands in (the forest, the decayed city, the machines) picks what it is. The lit window he searches for
// (Hut) stands far off on a hill in the hero, across a ravine in Projects and close by in the contact.
// Depth is fog, as in the game's frames (C59): the far plane soft and out of focus (page.module.css blurs it),
// a band of fog with soft banks, a grey plane, the darker mid trunks, a low mist over the ground; only the
// ground, what stands on it and the soft masses in front are pure black, under a heavy round vignette.

const W = 1600
export const H = 1000
/** The top of the ground: his soles and every prop stand on it. */
export const FLOOR = 680
/** His drawn height on the canvas: about 11% of the frame, the game's scale. */
export const FIGURE_H = 110
const FIGURE_W = (FIGURE_H * FIGURE_VIEW.width) / FIGURE_VIEW.height
/** Where the camera holds him on the canvas when it has caught up on the right: well right of the cards'
 *  column, so the obstacle he has just crossed stays in the clear part of the screen behind him. */
export const HOLD = 1150
/** Where he lies in the grass when the page opens, left of the hero's panel; on a phone the hold. */
const WAKE_X = 360

/** Whether the canvas is drawn for a phone's narrow, tall screen. */
export const PhoneView = createContext(false)

/** The half of the screen a stretch plays on: right of its section's cards, or left of them. */
export type Side = 'right' | 'left'

// Where the camera holds him on each side. From lg the cards stand on the other side, so on the left he holds
// as far into the free half (canvas 0 to about 790 from 1024 to 1440 wide) as he holds into the right one,
// and what he meets ahead of him still fits before the cards. A phone keeps its one slice round HOLD and
// holds him in the half the section names: on the right at HOLD, a little right of its middle, where what
// he crosses still has room ahead of him, on the left near its left edge.
const WIDE_HOLD: Record<Side, number> = { right: HOLD, left: 420 }
const PHONE_HOLD: Record<Side, number> = { right: HOLD, left: HOLD - 130 }

// An lg screen narrower than 6:5 (`tall`) cuts the canvas to its height and shows only its middle, x 425 to 1175
// on a 3:4 tablet, so there his centre is kept where he stands whole on that screen: every spot the camera holds
// him at, and wherever he runs ahead of the camera or falls behind it in mid action (cameraWindowOf). Any other
// screen from lg shows the canvas wide enough for every hold and leaves the camera open.
const TALL_WINDOW: readonly [number, number] = [470, 1125]
const OPEN: readonly [number, number] = [-Infinity, Infinity]

/** `x` kept inside what a tall screen shows of the canvas, as it is on any other. */
const onScreen = (x: number, tall: boolean): number => (tall ? Math.min(TALL_WINDOW[1], Math.max(TALL_WINDOW[0], x)) : x)

/** How far he lies head first to the left of where he wakes, in the grass the page opens on. */
const LYING = 110

/** Where he wakes: on a tall screen far enough in from its edge that he lies whole on it. */
const wakeOf = (tall: boolean): number => (tall ? Math.max(WAKE_X, TALL_WINDOW[0] + LYING) : WAKE_X)

/** Where the camera holds him at a stretch's end on its side: a stretch beside the cards may hold him where
 *  its own `split` says, so what it leaves behind him (or has ahead of him) stays clear of the cards. */
export const holdOf = (side: Side, phone: boolean, tall: boolean, split?: Partial<Record<Side, number>>): number => {
  if (phone) return PHONE_HOLD[side]
  return onScreen(split?.[side] ?? WIDE_HOLD[side], tall)
}

/** Where the hero starts him on screen and where the camera holds him at its end. */
export const framingOf = (wakes: boolean, phone: boolean, tall: boolean): Framing => ({
  start: wakes && !phone ? wakeOf(tall) : HOLD,
  hold: onScreen(HOLD, tall),
})

// The phone's slice: 460 wide round the hold, him a little right of its middle so what he has just crossed
// shows behind him, and by default its top 550 above the ground, so the ground sits a little below the middle
// of the screen, clear of the shared bars and notices along its top. A stretch whose end frame plays under a
// card standing high on the phone sets its top further up (PhoneTop), which brings the ground down.
export const PHONE_TOP = 550
export const PhoneTop = createContext(PHONE_TOP)
const PHONE_W = 460
const PHONE_LEFT = HOLD - 260
const phoneView = (top: number): string => `${PHONE_LEFT} ${FLOOR - top} ${PHONE_W} ${H}`
const PHONE_MID = PHONE_LEFT + PHONE_W / 2

// Where his centre may stand in the phone's slice while a stretch plays, on each side: in the half the
// section names and a figure's width in from the slice's edge. The camera's ease trails him while he runs
// and its look ahead pans past him, which alone would carry him across the middle in mid action; the camera
// keeps him inside this window instead, the way a side scroller's camera window does.
const PHONE_WINDOW: Record<Side, readonly [number, number]> = {
  right: [PHONE_MID + 20, PHONE_LEFT + PHONE_W - FIGURE_W],
  left: [PHONE_LEFT + FIGURE_W, PHONE_MID - FIGURE_W / 2],
}

/** The window his centre stays in on the screen: on a phone the half the stretch's side names, on a tall screen
 *  what it shows of the canvas, elsewhere anywhere. */
export const cameraWindowOf = (side: Side, phone: boolean, tall: boolean): readonly [number, number] => {
  if (phone) return PHONE_WINDOW[side]
  return tall ? TALL_WINDOW : OPEN
}

export function Canvas({ children }: { children: ReactNode }) {
  const phone = useContext(PhoneView)
  const top = useContext(PhoneTop)
  return (
    <svg viewBox={phone ? phoneView(top) : `0 0 ${W} ${H}`} preserveAspectRatio={phone ? 'xMidYMin slice' : 'xMidYMax slice'} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The parts of the level the page runs through, in order. */
export type Region = 'forest' | 'city' | 'machine'

/** One scene's stretch as its layers draw it: where on the level he starts, how far he goes, where on
 *  screen the scene starts and holds him, and the region of every point of the level. */
export interface Run extends Framing {
  from: number
  length: number
  /** The side it plays on: the masses that frame the view stand on its outer edge. */
  side: Side
  /** How far the camera swings over the stretch's first steps, from the side the stretch before held him on
   *  to this one's: `start` less `hold` when the side changes, 0 when it does not or he wakes (the hero). */
  turn: number
  /** The region the scene's own stretch is in: it picks what stands in the layers behind and in front. */
  region: Region
  /** The region of each point of the level: it picks what grows on the ground, which meets the next
   *  stretch's ground exactly. */
  regionAt: (x: number) => Region
}

/** How far the camera travels over a scene's stretch. */
export const travelOf = ({ start, length, hold }: Run): number => start + length - hold

/** Each layer's share of the camera's travel: the further back, the less it moves. */
export const PAN = { far: 0.3, fog: 0.5, back: 0.6, mid: 0.72, mist: 0.85, near: 1, figure: 1, fg: 1.45 } as const
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
          <stop offset="0" stopColor={SHADE.glow} stopOpacity="0.75" />
          <stop offset="1" stopColor={SHADE.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      <ellipse cx={900} cy={380} rx={820} ry={420} fill={`url(#${id}-glow)`} />
      <ellipse cx={1000} cy={330} rx={420} ry={220} fill={`url(#${id}-glow)`} />
    </Canvas>
  )
}

/** A tall trunk out of the top of the frame down to its roots at y, `width` wide, leaning `lean` units over its
 *  height, a little wider at its foot. */
function trunkPath(x: number, width: number, y: number, lean = 0): string {
  const half = width / 2
  return `M${x - half * 1.25} ${y} L${x - half + lean} -40 H${x + half + lean} L${x + half * 1.25} ${y} Z`
}

// A second and third share from one, so a shape's width, shade and lean do not rise together.
const shareOf = (s: number, k: number): number => (s * k) % 1

/** A gear outline: `teeth` square teeth round a ring of radius r, with a hub hole. A turning gear is drawn
 *  once and turned by a transform. */
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

// The far shapes of each region, pale with fog: tall trunks, the city's broken blocks, the machines' gears and
// tapered chimneys. Nothing with a crossbar, which reads as hard blocks through the fog.
const FAR_SHAPE: Record<Region, (x: number, s: number) => ReactNode> = {
  forest: (x, s) => (s < 0.2 ? null : <path d={trunkPath(x, 30 + shareOf(s, 7) * 110, FAR_GROUND, (shareOf(s, 13) - 0.5) * 80)} opacity={0.5 + shareOf(s, 3) * 0.5} />),
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

/** The far layer, pale with fog: a low ridge and the region's far shapes on it, and whatever the scene sets
 *  far off (`distant`, drawn in the canvas's own units where the camera starts). */
export function Far({ run, light, distant }: { run: Run; light: Light; distant?: ReactNode }) {
  return (
    <Canvas>
      <g data-fx="pan-far">
        <g fill={light.far} opacity={0.7}>
          <Scattered run={run} layer="far" spacing={170} seed={1} draw={(x, s, region) => FAR_SHAPE[region](x, s)} />
          <path d={`M${-W} ${FAR_GROUND + 10} Q${W} ${FAR_GROUND - 30} ${W * 3} ${FAR_GROUND} T${W * 7} ${FAR_GROUND} V${H * 2} H${-W} Z`} />
        </g>
        {distant}
      </g>
    </Canvas>
  )
}

/** The small shape on posts with one window and a shut door, the place he searches for: drawn round the foot
 *  of its posts, `w` wide and its posts `legs` of that tall, black, its window lit white (data-fx
 *  `{name}-window`). */
export function Hut({ name, w = 90, fill = SHADE.black, legs = 0.36 }: { name: string; w?: number; fill?: string; legs?: number }) {
  const post = w * legs
  const body = w * 0.8
  const top = -post - body
  return (
    <g fill={fill}>
      <path d={`M${-w * 0.34} 0 V${-post} H${-w * 0.28} V0 Z M${w * 0.28} 0 V${-post} H${w * 0.34} V0 Z`} />
      <rect x={-w / 2} y={top} width={w} height={body} />
      <path d={`M${-w * 0.62} ${top + 4} L0 ${top - w * 0.46} L${w * 0.62} ${top + 4} Z`} />
      <rect data-fx={`${name}-window`} x={w * 0.08} y={top + body * 0.22} width={w * 0.26} height={w * 0.24} fill={SHADE.glow} />
      <rect x={-w * 0.4} y={top + body * 0.2} width={w * 0.34} height={body * 0.8} fill={fill} stroke={SHADE.edge} strokeWidth={1.5} />
    </g>
  )
}

/** A bank of fog: a wide ellipse whose fog thins to nothing at its edge, so no edge shows. */
function bankId(light: Light): string {
  return `sh-bank-${light.fog.slice(1)}`
}

/** The fog's soft bank, one per light: the hero's dawn and a profession's light share the page. */
function BankGradient({ light }: { light: Light }) {
  return (
    <radialGradient id={bankId(light)}>
      <stop offset="0" stopColor={light.fog} />
      <stop offset="0.55" stopColor={light.fog} stopOpacity="0.6" />
      <stop offset="1" stopColor={light.fog} stopOpacity="0" />
    </radialGradient>
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
          <stop offset="0.6" stopColor={light.fog} />
          <stop offset="1" stopColor={light.fog} />
        </linearGradient>
        <BankGradient light={light} />
      </defs>
      <rect y={FLOOR - 420} width={W} height={450} fill={`url(#${fogId})`} />
      <g data-fx="pan-fog" fill={`url(#${bankId(light)})`}>
        <Scattered run={run} layer="fog" spacing={380} seed={2} draw={(x, s) => <ellipse cx={x} cy={FLOOR - 90 - s * 200} rx={360 + s * 220} ry={90 + s * 60} />} />
      </g>
    </Canvas>
  )
}

// The plane between the far shapes and the mid trunks, half lost in the fog: soft grey trunks and leaning
// boughs in the forest, the city's towers, the machines' great wheels and stacks.
const BACK_SHAPE: Record<Region, (x: number, s: number) => ReactNode> = {
  forest: (x, s) => (s < 0.15 ? null : <path d={trunkPath(x, 60 + shareOf(s, 7) * 130, FLOOR, (shareOf(s, 11) - 0.5) * 120)} opacity={0.55 + shareOf(s, 5) * 0.45} />),
  city: (x, s) => <path d={`M${x} ${FLOOR} V${FLOOR - 420 - s * 160} L${x + 40} ${FLOOR - 470 - s * 160} H${x + 120 + s * 60} V${FLOOR} Z`} />,
  machine: (x, s) =>
    s < 0.5 ? (
      <path d={gearPath(x, FLOOR - 220 - s * 120, 150 + s * 120, 16)} fillRule="evenodd" />
    ) : (
      <path d={`M${x - 60} ${FLOOR} L${x - 30} 80 H${x + 30} L${x + 60} ${FLOOR} Z`} />
    ),
}

/** A fill that fades out at a shape's left and right sides, `edge` of its width each: a trunk out of focus. */
function SoftSides({ id, color, edge }: { id: string; color: string; edge: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={color} stopOpacity="0" />
      <stop offset={edge} stopColor={color} />
      <stop offset={1 - edge} stopColor={color} />
      <stop offset="1" stopColor={color} stopOpacity="0" />
    </linearGradient>
  )
}

/** The plane behind the mid trunks, a lighter grey than they are, every shape soft at its sides. */
export function Back({ run, light }: { run: Run; light: Light }) {
  const id = `sh-back-${light.mid.slice(1)}`
  return (
    <Canvas>
      <defs>
        <SoftSides id={id} color={light.mid} edge={0.3} />
      </defs>
      <g data-fx="pan-back" fill={`url(#${id})`} opacity={0.5}>
        <Scattered run={run} layer="back" spacing={330} seed={6} draw={(x, s, region) => BACK_SHAPE[region](x, s)} />
      </g>
    </Canvas>
  )
}

/** The low mist that lies over the ground in front of the mid trunks, deep and soft, so their feet are lost
 *  in it and only he and what stands on his ground are pure black. */
export function Mist({ run, light }: { run: Run; light: Light }) {
  const mistId = `sh-mist-${light.fog.slice(1)}`
  return (
    <Canvas>
      <defs>
        <linearGradient id={mistId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light.fog} stopOpacity="0" />
          <stop offset="1" stopColor={light.fog} />
        </linearGradient>
        <BankGradient light={light} />
      </defs>
      <rect y={FLOOR - 140} width={W} height={150} fill={`url(#${mistId})`} />
      <g data-fx="pan-mist" fill={`url(#${bankId(light)})`}>
        <Scattered run={run} layer="mist" spacing={520} seed={7} draw={(x, s) => <ellipse cx={x} cy={FLOOR - 20 - s * 50} rx={300 + s * 200} ry={50 + s * 30} />} />
      </g>
    </Canvas>
  )
}

// The mid shapes of each region a shade darker: trunks out of the top of the frame, the city's lamp posts,
// the machines' pipes and hanging chains.
const MID_SHAPE: Record<Region, (x: number, s: number) => ReactNode> = {
  forest: (x, s) => {
    const w = 22 + shareOf(s, 7) * 46
    return (
      <>
        <path d={trunkPath(x + w / 2, w, FLOOR, (shareOf(s, 13) - 0.5) * 40)} />
        {s > 0.45 && <path d={`M${x + w * 0.5} ${200 + s * 120} Q${x + w + 60} ${240 + s * 120} ${x + w + 90} ${320 + s * 120} L${x + w + 82} ${324 + s * 120} Q${x + w + 50} ${260 + s * 120} ${x + w * 0.5} ${226 + s * 120} Z`} fill="currentColor" />}
      </>
    )
  },
  city: (x, s) => <path d={`M${x - 5} ${FLOOR} V${FLOOR - 380 - s * 80} H${x + 60} V${FLOOR - 370 - s * 80} H${x + 5} V${FLOOR} Z M${x + 48} ${FLOOR - 370 - s * 80} h16 v14 h-16 Z`} />,
  machine: (x, s) =>
    s < 0.5 ? (
      <path d={`M${x} 0 H${x + 26} V${FLOOR} H${x} Z M${x - 8} ${180 + s * 200} h42 v16 h-42 Z M${x - 8} ${420 + s * 100} h42 v16 h-42 Z`} />
    ) : (
      <path d={`M${x} 0 V${260 + s * 200}`} stroke="currentColor" strokeWidth={6} strokeDasharray="14 6" fill="none" />
    ),
}

/** The mid layer a shade darker, a little soft at its sides. */
export function Mid({ run, light }: { run: Run; light: Light }) {
  const id = `sh-mid-${light.mid.slice(1)}`
  return (
    <Canvas>
      <defs>
        <SoftSides id={id} color={light.mid} edge={0.12} />
      </defs>
      <g data-fx="pan-mid" fill={`url(#${id})`} color={light.mid}>
        <Scattered run={run} layer="mid" spacing={460} seed={3} draw={(x, s, region) => MID_SHAPE[region](x, s)} />
      </g>
    </Canvas>
  )
}

/** A stretch of the ground's run that is open, from its start: a gap he must cross. */
export type Gap = readonly [number, number]

const BLADES = (region: Region) => region === 'forest'

/** A tuft of grass at x: three to five blades of uneven height, each leaning its own way, or nothing (the
 *  ground shows bare between tufts). */
function tuftPath(x: number, s: number): string {
  const count = 3 + Math.floor(shareOf(s, 5) * 3)
  const tall = 10 + s * 34
  return Array.from({ length: count }, (_, i) => {
    const share = shareOf(s, 7 + i * 4)
    const h = tall * (0.35 + share * 0.65)
    const at = x + (i - count / 2) * 3.4
    const lean = (shareOf(s, 11 + i * 3) - 0.5) * h * 0.7
    return `M${(at - 2).toFixed(1)} ${FLOOR + 1} Q${(at + lean * 0.3).toFixed(1)} ${(FLOOR - h * 0.6).toFixed(1)} ${(at + lean).toFixed(1)} ${(FLOOR - h).toFixed(1)} Q${(at + lean * 0.3 + 1.4).toFixed(1)} ${(FLOOR - h * 0.5).toFixed(1)} ${(at + 2).toFixed(1)} ${FLOOR + 1} Z`
  }).join(' ')
}

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
            spacing={26}
            seed={4}
            draw={(x, s, region) => (BLADES(region) && !open(x) && s > 0.22 ? <path d={tuftPath(x, s)} /> : null)}
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

/** A clump hanging from the top of the frame round x: a ragged underside of uneven lobes and, under it, thin
 *  strands of moss or roots of uneven length, each tapering to a point. */
export function hangingPath(x: number, s: number, width: number, depth: number): string {
  const lobes = 5
  const under = Array.from({ length: lobes + 1 }, (_, i) => {
    const at = x + width / 2 - (width * i) / lobes
    const low = depth * (0.45 + shareOf(s, 3 + i * 5) * 0.55) * Math.sin((Math.PI * (i + 0.5)) / (lobes + 1))
    return `Q${(at + width / lobes / 2).toFixed(1)} ${(low * 1.25).toFixed(1)} ${at.toFixed(1)} ${(low * 0.7).toFixed(1)}`
  }).join(' ')
  const strands = Array.from({ length: 6 }, (_, i) => {
    const at = x - width * 0.35 + width * 0.7 * shareOf(s, 17 + i * 7)
    const long = depth * (0.6 + shareOf(s, 23 + i * 3) * 1.1)
    const sway = (shareOf(s, 29 + i) - 0.5) * 40
    return `M${(at - 5).toFixed(1)} ${(depth * 0.3).toFixed(1)} Q${(at + sway).toFixed(1)} ${(long * 0.7).toFixed(1)} ${(at + sway * 1.4).toFixed(1)} ${long.toFixed(1)} Q${(at + sway * 0.6 + 2).toFixed(1)} ${(long * 0.6).toFixed(1)} ${(at + 5).toFixed(1)} ${(depth * 0.3).toFixed(1)} Z`
  }).join(' ')
  return `M${(x - width / 2).toFixed(1)} 0 H${(x + width / 2).toFixed(1)} ${under} Z ${strands}`
}

/** A broken branch reaching in from the top at x, its end snapped off, a twig off it. */
const brokenBranch = (x: number, s: number): string =>
  `M${x - 30} 0 Q${x + 40} ${90 + s * 40} ${x + 210} ${150 + s * 60} L${x + 236} ${142 + s * 60} L${x + 222} ${164 + s * 60} Q${x + 30} ${130 + s * 50} ${x - 70} 0 Z M${x + 120} ${120 + s * 50} Q${x + 150} ${200 + s * 40} ${x + 140} ${250 + s * 40} L${x + 134} ${248 + s * 40} Q${x + 136} ${200 + s * 40} ${x + 106} ${126 + s * 50} Z`

// The soft black masses pressing into the top of the frame in front of him: moss, roots and broken
// branches in the forest, broken beams and hanging cables in the city and the machines. Nothing in front
// ever reaches his ground.
const FRONT_SHAPE: Record<Region, (x: number, s: number) => ReactNode> = {
  forest: (x, s) => <Soft d={s < 0.4 ? brokenBranch(x, s) : hangingPath(x, s, 420 + s * 260, 130 + s * 120)} />,
  city: (x, s) => <Soft d={`${hangingPath(x, s, 300, 70)} M${x - 160} 0 H${x - 100} V${170 + s * 110} L${x - 128} ${200 + s * 110} L${x - 150} ${170 + s * 110} Z`} />,
  machine: (x, s) => <Soft d={`M${x - 300} ${30 + s * 40} H${x + 300} V${110 + s * 40} L${x + 230} ${130 + s * 40} L${x + 180} ${110 + s * 40} H${x - 300} Z M${x + 120} 0 H${x + 170} V${230 + s * 60} H${x + 120} Z M${x - 120} ${110 + s * 40} Q${x - 100} ${260 + s * 60} ${x - 60} ${300 + s * 60} L${x - 64} ${304 + s * 60} Q${x - 108} ${262 + s * 60} ${x - 126} ${110 + s * 40} Z`} />,
}

// What always frames the view at its sides, out of focus: in the forest a near trunk with its roots at the
// right edge and an overhang at the top left; in the city and the machines a broken pillar and a beam.
const EDGE_SHAPE: Record<Region, (box: { x: number; y: number; width: number }) => string> = {
  forest: ({ x, y, width }) => {
    const right = x + width
    return `M${right - 46} ${y} Q${right - 70} ${FLOOR - 260} ${right - 40} ${FLOOR - 40} Q${right - 90} ${FLOOR - 10} ${right - 130} ${FLOOR + 6} L${right - 60} ${FLOOR + 4} Q${right - 30} ${FLOOR - 20} ${right + 10} ${FLOOR} V${y} Z M${x - 10} ${y} H${x + width * 0.22} Q${x + width * 0.14} ${y + 70} ${x + width * 0.06} ${y + 150} Q${x + 30} ${y + 210} ${x - 10} ${y + 260} Z`
  },
  city: ({ x, y, width }) => `M${x + width - 36} ${y} V${FLOOR} H${x + width + 10} V${y} Z M${x - 10} ${y} H${x + width * 0.2} V${y + 50} H${x - 10} Z`,
  machine: ({ x, y, width }) => `M${x + width - 30} ${y} V${FLOOR} H${x + width + 10} V${y} Z M${x + width - 60} ${y + 140} H${x + width} V${y + 170} H${x + width - 60} Z M${x - 10} ${y} H${x + width * 0.25} V${y + 60} H${x - 10} Z`,
}

/** The view the canvas shows: a phone's narrow slice round him, or the whole frame. */
function useView(): { x: number; y: number; width: number; height: number } {
  const phone = useContext(PhoneView)
  const top = useContext(PhoneTop)
  return phone ? { x: HOLD - 260, y: FLOOR - top, width: PHONE_W, height: H } : { x: 0, y: 0, width: W, height: H }
}

/** The dark masses at the view's own edges, which stay as the camera moves, so the bright opening is always
 *  framed. From lg a stretch on the left has them the other way round: the near trunk on the screen's left
 *  edge, where its open half ends, and the overhang at the top right over the cards. */
function Edges({ region, side }: { region: Region; side: Side }) {
  const view = useView()
  const phone = useContext(PhoneView)
  const d = EDGE_SHAPE[region](view)
  if (phone || side === 'right') return <Soft d={d} />
  return (
    <g transform={`translate(${2 * view.x + view.width} 0) scale(-1 1)`}>
      <Soft d={d} />
    </g>
  )
}

/** The heavy round vignette over the view the canvas shows: dark at every corner and edge, the bright
 *  opening a soft oval in the middle. */
function Vignette({ side }: { side: Side }) {
  return <rect {...useView()} fill={`url(#sh-vignette-${side})`} />
}

// The bright oval leans a little toward the half the stretch plays on.
const VIGNETTE_X: Record<Side, number> = { right: 0.52, left: 0.48 }

/** In front, out of focus: the region's soft masses along the top, the masses that frame the view's sides,
 *  and the heavy vignette the game's camera sees every place through. */
export function Front({ run }: { run: Run }) {
  return (
    <Canvas>
      <defs>
        <radialGradient id={`sh-vignette-${run.side}`} cx={VIGNETTE_X[run.side]} cy="0.42" r="0.6">
          <stop offset="0.34" stopColor={SHADE.black} stopOpacity="0" />
          <stop offset="0.66" stopColor={SHADE.black} stopOpacity="0.7" />
          <stop offset="0.92" stopColor={SHADE.black} stopOpacity="1" />
        </radialGradient>
      </defs>
      <g data-fx="pan-fg">
        <Scattered run={run} layer="fg" spacing={700} seed={5} draw={(x, s, region) => FRONT_SHAPE[region](x, s)} />
      </g>
      <Edges region={run.region} side={run.side} />
      <Vignette side={run.side} />
    </Canvas>
  )
}

/** His group's transform: his centre at `x`, his soles `lift` above the floor, turned `over` of a head over
 *  heels flip round his middle seen side on (1 upside down on a ceiling, still facing the way he goes), and
 *  mirrored to face left when he goes `back`. */
export const figureAt = (x: number, lift = 0, over = 0, back = false): string => {
  const top = FLOOR - lift - FIGURE_H * (FIGURE_VIEW.soles / FIGURE_VIEW.height)
  const mid = FIGURE_H / 2
  const turn = over ? ` translate(0 ${mid}) scale(1 ${Math.cos(Math.PI * over).toFixed(3)}) translate(0 ${-mid})` : ''
  const facing = back ? ` translate(${FIGURE_W.toFixed(1)} 0) scale(-1 1)` : ''
  return `translate(${(x - FIGURE_W / 2).toFixed(1)} ${top.toFixed(1)})${turn}${facing}`
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
