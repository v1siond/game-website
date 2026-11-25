import { fadeTo, fx, transformTo } from '../shared/stageNodes'
import { SHADE } from './palette'
import { outline } from './place'

// The giant spider of our own drawing, the hunter of the forest (research notes L45 to L50, [2]): a black
// body, a ridge of hooked spines along its swollen back and a cluster of pale eyes, hung on eight long
// jointed legs that hook down out of the dark much taller than he is, the way the game's spider first comes in
// (C59 frames, f0300). It faces left, toward him. Each leg is a thigh and a shin, its knee lifted high above
// the line from hip to foot, tapering to a point; a scene gives each foot a place every frame and the leg
// bends to reach it, so a leg can stand, step, track him and stab with the same writer. The legs on the far
// side are drawn behind the body, a little thinner and greyed by the fog.
//
// Drawn in its own units round the body's middle; a scene scales it (the spider of Tech Stack is smaller in
// the frame) and places it in run units.

export interface Point {
  x: number
  y: number
}

interface Leg {
  /** Where the leg leaves the body, from the body's middle. */
  hip: Point
  far: boolean
}

// The near legs first, front to back, then the far ones: a scene's feet come in this order.
const LEGS: readonly Leg[] = [
  { hip: { x: -84, y: 14 }, far: false },
  { hip: { x: -58, y: 24 }, far: false },
  { hip: { x: -30, y: 26 }, far: false },
  { hip: { x: -4, y: 20 }, far: false },
  { hip: { x: -76, y: 6 }, far: true },
  { hip: { x: -48, y: 12 }, far: true },
  { hip: { x: -20, y: 14 }, far: true },
  { hip: { x: 6, y: 10 }, far: true },
]

/** A leg's thigh and shin, in the spider's units. */
const THIGH = 380
const SHIN = 420
/** A leg's width at the hip and the knee; the shin tapers from the knee to its point. */
const WIDTH = { hip: 22, knee: 13, far: 0.7 }

/** One frame of the spider: its body's middle, which way it faces (1 left, -1 right), its tilt, where each
 *  foot is (LEGS order), how much of each shin is gone (the tip torn off in the trap), and how bright its eyes
 *  are. */
interface SpiderFrame {
  x: number
  y: number
  facing?: 1 | -1
  tilt?: number
  feet: readonly Point[]
  lost?: readonly number[]
  eyes?: number
}

/** The knee of a leg from `hip` to `foot`: the higher of the two places the thigh and the shin meet. A foot out
 *  of reach is drawn where the straightened leg ends, on the line toward it. */
function kneeOf(hip: Point, foot: Point, thigh: number, shin: number): { knee: Point; foot: Point } {
  const dx = foot.x - hip.x
  const dy = foot.y - hip.y
  const far = Math.hypot(dx, dy) || 1
  const reach = Math.min(far, (thigh + shin) * 0.999, Math.max(far, Math.abs(thigh - shin) * 1.001))
  const ux = dx / far
  const uy = dy / far
  const end = { x: hip.x + ux * reach, y: hip.y + uy * reach }
  const along = (thigh * thigh - shin * shin + reach * reach) / (2 * reach)
  const up = Math.sqrt(Math.max(0, thigh * thigh - along * along))
  const one = { x: hip.x + ux * along - uy * up, y: hip.y + uy * along + ux * up }
  const two = { x: hip.x + ux * along + uy * up, y: hip.y + uy * along - ux * up }
  return { knee: one.y < two.y ? one : two, foot: end }
}

const side = (from: Point, to: Point, half: number): Point => {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1
  return { x: ((from.y - to.y) / length) * half, y: ((to.x - from.x) / length) * half }
}

const pt = ({ x, y }: Point): string => `${x.toFixed(1)} ${y.toFixed(1)}`

/** A leg's outline: the thigh tapering from the hip to a knuckled knee, the shin from the knee to its point,
 *  with a spur bristling off the knee. */
function legPath(hip: Point, knee: Point, foot: Point, hipWidth: number, kneeWidth: number): string {
  const a = side(hip, knee, hipWidth / 2)
  const b = side(knee, foot, kneeWidth / 2)
  const knob = kneeWidth * 0.75
  // the shin bows a little toward the knee's side two thirds down, so its point hooks in like a claw
  const length = Math.hypot(foot.x - knee.x, foot.y - knee.y)
  const bow = side(knee, foot, length * 0.05)
  const hook = { x: knee.x + (foot.x - knee.x) * 0.68 - bow.x, y: knee.y + (foot.y - knee.y) * 0.68 - bow.y }
  const thinAt = { x: b.x * 0.45, y: b.y * 0.45 }
  return [
    `M${pt({ x: hip.x + a.x, y: hip.y + a.y })}`,
    `L${pt({ x: knee.x + a.x * (kneeWidth / hipWidth), y: knee.y + a.y * (kneeWidth / hipWidth) })}`,
    `L${pt({ x: knee.x + b.x, y: knee.y + b.y })}`,
    `L${pt({ x: hook.x + thinAt.x, y: hook.y + thinAt.y })}`,
    `L${pt(foot)}`,
    `L${pt({ x: hook.x - thinAt.x, y: hook.y - thinAt.y })}`,
    `L${pt({ x: knee.x - b.x, y: knee.y - b.y })}`,
    `L${pt({ x: knee.x - a.x * (kneeWidth / hipWidth), y: knee.y - a.y * (kneeWidth / hipWidth) })}`,
    `L${pt({ x: hip.x - a.x, y: hip.y - a.y })} Z`,
    `M${pt({ x: knee.x - knob, y: knee.y })} a${knob.toFixed(1)} ${knob.toFixed(1)} 0 1 0 ${(knob * 2).toFixed(1)} 0 a${knob.toFixed(1)} ${knob.toFixed(1)} 0 1 0 ${(-knob * 2).toFixed(1)} 0 Z`,
    `M${pt({ x: knee.x - 2, y: knee.y - knob * 0.6 })} L${pt({ x: knee.x + 3, y: knee.y - knob * 2.6 })} L${pt({ x: knee.x + 3, y: knee.y - knob * 0.4 })} Z`,
  ].join(' ')
}

// The ridge of hooked spines along the swollen back: one every 14 degrees over its top, each leaning back.
const SPINES = Array.from({ length: 11 }, (_, i) => {
  const a = ((200 + i * 14) * Math.PI) / 180
  const base = (r: number, da: number) => ({ x: 70 + Math.cos(a + da) * 100 * r, y: -14 + Math.sin(a + da) * 72 * r })
  const root = base(0.97, 0)
  const tip = base(1.22 + (i % 3) * 0.05, 0.1)
  const back = base(0.97, 0.09)
  return `M${pt(root)} L${pt(tip)} L${pt(back)} Z`
}).join(' ')

const BODY = {
  abdomen: 'M-6 6 C-10 -60 70 -110 150 -80 C200 -60 190 30 140 52 C90 74 10 60 -6 6 Z',
  thorax: 'M-96 4 C-98 -30 -60 -44 -30 -38 C0 -32 12 -6 8 16 C4 36 -40 44 -70 38 C-88 34 -96 22 -96 4 Z',
  fangs: 'M-90 22 Q-104 44 -88 62 Q-92 46 -78 30 Z M-74 30 Q-84 52 -68 66 Q-72 50 -60 36 Z',
  palps: 'M-92 10 Q-120 18 -126 44 L-121 45 Q-114 26 -90 18 Z M-80 20 Q-100 36 -100 60 L-95 60 Q-92 42 -76 28 Z',
  rim: 'M8 -40 C40 -88 110 -100 160 -74',
}

// The eyes: a crescent of six small pale points across the front of the head, the two middle ones larger.
const EYES = [
  { x: -90, y: -6, r: 4.2 },
  { x: -80, y: -14, r: 5.6 },
  { x: -66, y: -18, r: 5.6 },
  { x: -54, y: -16, r: 3.6 },
  { x: -94, y: 4, r: 3 },
  { x: -46, y: -10, r: 2.8 },
]

/** The spider, its legs `{name}-leg-<i>` and its body `{name}-body`, drawn black with its rim catching the
 *  light; the writer (bindSpider) places and poses every part. */
export function Spider({ name, rim }: { name: string; rim: string }) {
  return (
    <g data-fx={name}>
      <g fill={SHADE.black} opacity={0.82}>
        {LEGS.map((leg, i) => (leg.far ? <path key={i} data-fx={`${name}-leg-${i}`} /> : null))}
      </g>
      <g data-fx={`${name}-body`}>
        <path d={BODY.abdomen} fill={SHADE.black} />
        <path d={SPINES} fill={SHADE.black} />
        <path d={BODY.rim} fill="none" stroke={rim} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
        <rect x={-12} y={-14} width={26} height={24} fill={SHADE.black} />
        <path d={BODY.thorax} fill={SHADE.black} />
        <path d={BODY.palps} fill={SHADE.black} />
        <path d={BODY.fangs} fill={SHADE.black} />
        <g data-fx={`${name}-eyes`} fill={SHADE.glow}>
          {EYES.map(({ x, y, r }) => (
            <circle key={`${x} ${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      </g>
      <g fill={SHADE.black}>
        {LEGS.map((leg, i) => (leg.far ? null : <path key={i} data-fx={`${name}-leg-${i}`} />))}
      </g>
    </g>
  )
}

/** A point of the spider's own drawing (its units, facing left) where it stands in the scene. */
export function toWorld({ x, y, facing = 1, tilt = 0 }: Pick<SpiderFrame, 'x' | 'y' | 'facing' | 'tilt'>, local: Point, scale: number): Point {
  const turn = (tilt * Math.PI) / 180
  const lx = local.x * facing
  return { x: x + (lx * Math.cos(turn) - local.y * Math.sin(turn)) * scale, y: y + (lx * Math.sin(turn) + local.y * Math.cos(turn)) * scale }
}

/** Where its fangs meet, in its own units: the silk it wraps him in comes from there. */
export const MOUTH: Point = { x: -86, y: 44 }

/** Binds a drawn spider: its writer places the body at `scale` and bends each leg to its foot. */
export function bindSpider(stage: ParentNode, name: string, scale: number): (frame: SpiderFrame) => void {
  const body = fx(stage, `${name}-body`)
  const eyes = fx(stage, `${name}-eyes`)
  const legs = LEGS.map((_, i) => fx(stage, `${name}-leg-${i}`))
  return ({ x, y, facing = 1, tilt = 0, feet, lost, eyes: lit = 1 }) => {
    transformTo(body, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${tilt.toFixed(1)}) scale(${facing * scale} ${scale})`)
    fadeTo(eyes, lit)
    LEGS.forEach((leg, i) => {
      const hip = toWorld({ x, y, facing, tilt }, leg.hip, scale)
      const shin = (SHIN - (lost?.[i] ?? 0)) * scale
      const bent = kneeOf(hip, feet[i], THIGH * scale, shin)
      const thin = leg.far ? WIDTH.far : 1
      outline(legs[i], legPath(hip, bent.knee, bent.foot, WIDTH.hip * thin * Math.max(scale, 0.7), WIDTH.knee * thin * Math.max(scale, 0.7)))
    })
  }
}

/** Where each leg's foot rests fore and aft of the body (LEGS order), in units of a walk's `spread`, the
 *  front legs ahead of it when it faces left. */
const RESTS: readonly number[] = [-1.35, -0.55, 0.45, 1.25, -1.0, -0.15, 0.85, 1.6]

/** The feet of a spider walking with its body at `x`: each foot planted while the body passes over it, then
 *  lifted and swung ahead, the legs in two alternating sets of four, every foot on the ground `ground` gives
 *  (its height at x). A negative `spread` turns the legs round for a spider facing right. */
export function walkingFeet(x: number, stride: number, spread: number, ground: (x: number) => number): Point[] {
  return RESTS.map((rest, i) => {
    const set = (i + (i >= 4 ? 1 : 0)) % 2 === 0 ? 0 : 0.5
    const s = x / stride + set
    const step = Math.floor(s)
    const f = s - step
    const swing = Math.max(0, (f - 0.7) / 0.3)
    const planted = (step + 0.6 + swing) * stride - set * stride + rest * spread
    return { x: planted, y: -ground(planted) - Math.sin(swing * Math.PI) * stride * 0.5 }
  })
}
