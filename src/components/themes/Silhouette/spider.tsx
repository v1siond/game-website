import type { CSSProperties } from 'react'
import { SHADE } from './palette'
import spider from './spider.module.css'

// The giant spider of the monochrome forest, the one foe of this world, drawn the way the game draws it:
// legs first. Each leg is two straight tapering blades, a thick thigh rising from the body to a sharp knee
// high above it and a long shin narrowing to a needle tip on the ground; the body is a low round lump
// slung between the knees. The three near legs and the foreleg are black and move; the two far legs sit
// behind in the fog colour and stay still. It faces right, toward him.
//
// Poses (spider.module.css): lurk (a slow breath), stalk (the legs step out of turn), stab (the foreleg
// rears and drives its tip into the ground, dust at the tip), flinch (it jerks back on its legs). Lame
// draws the foreleg as a torn stump, after the trap line has taken it.
// viewBox units: 240 by 160, the tips on y 158.

export type SpiderPose = 'lurk' | 'stalk' | 'stab' | 'flinch'

interface Point {
  x: number
  y: number
}

interface Leg {
  hip: Point
  knee: Point
  tip: Point
}

const GROUND = 158

// A straight blade from a to b, half widths wa at a and wb at b.
function blade(a: Point, b: Point, wa: number, wb: number): string {
  const length = Math.hypot(b.x - a.x, b.y - a.y)
  const nx = -(b.y - a.y) / length
  const ny = (b.x - a.x) / length
  const at = (p: Point, w: number, side: 1 | -1) => `${(p.x + nx * w * side).toFixed(1)} ${(p.y + ny * w * side).toFixed(1)}`
  return `M${at(a, wa, 1)} L${at(b, wb, 1)} L${at(b, wb, -1)} L${at(a, wa, -1)} Z`
}

const at = (x: number, y: number): Point => ({ x, y })

const FORELEG: Leg = { hip: at(116, 104), knee: at(152, 28), tip: at(222, GROUND) }

// Near legs behind the foreleg, front to back.
const NEAR_LEGS: readonly Leg[] = [
  { hip: at(106, 100), knee: at(124, 20), tip: at(176, GROUND) },
  { hip: at(90, 96), knee: at(62, 16), tip: at(40, GROUND) },
  { hip: at(80, 100), knee: at(34, 36), tip: at(6, GROUND) },
]

const FAR_LEGS: readonly Leg[] = [
  { hip: at(110, 98), knee: at(140, 36), tip: at(200, GROUND) },
  { hip: at(86, 96), knee: at(50, 28), tip: at(22, GROUND) },
]

const THIGH = 4.2
const KNEE = 2.4
const TIP = 0.4

// The lump: a big abdomen behind, the smaller head and thorax in front, a ragged underside.
const BODY =
  'M50 104 C46 82 66 72 86 74 C100 75 108 84 112 92 C120 88 132 94 132 106 C132 118 120 122 110 118 C102 126 88 130 74 128 L70 132 L66 127 L60 130 L58 124 C50 120 50 112 50 104 Z'

// The foreleg torn off half way up the thigh, its ragged end.
const STUMP_END = at(140, 54)
const STUMP = `${blade(FORELEG.hip, STUMP_END, THIGH, 3.4)} M135 52 L139 44 L142 51 L148 49 L144 57 Z`

const DUST = [at(-6, -2), at(0, -5), at(6, -1), at(-3, -9), at(4, -11)]

const joint = (point: Point) => `${point.x}px ${point.y}px`

function LegShape({ leg, fill }: { leg: Leg; fill: string }) {
  return (
    <>
      <path d={blade(leg.hip, leg.knee, THIGH, KNEE)} fill={fill} />
      <circle cx={leg.knee.x} cy={leg.knee.y} r={KNEE} fill={fill} />
      <path d={blade(leg.knee, leg.tip, KNEE, TIP)} fill={fill} />
    </>
  )
}

// A moving leg: the thigh turns round the hip and carries the shin, which turns round the knee.
function MovingLeg({ leg, className, kneeClassName = '', index }: { leg: Leg; className: string; kneeClassName?: string; index: number }) {
  return (
    <g className={`${spider.hip} ${className}`} style={{ '--hip': joint(leg.hip), '--i': index } as CSSProperties}>
      <path d={blade(leg.hip, leg.knee, THIGH, KNEE)} fill={SHADE.black} />
      <circle cx={leg.knee.x} cy={leg.knee.y} r={KNEE} fill={SHADE.black} />
      <g className={`${spider.knee} ${kneeClassName}`} style={{ '--knee': joint(leg.knee) } as CSSProperties}>
        <path d={blade(leg.knee, leg.tip, KNEE, TIP)} fill={SHADE.black} />
      </g>
    </g>
  )
}

function Foreleg({ lame }: { lame: boolean }) {
  if (lame) return <path d={STUMP} fill={SHADE.black} className={spider.stump} style={{ '--hip': joint(FORELEG.hip) } as CSSProperties} />
  return (
    <>
      <MovingLeg leg={FORELEG} className={spider.fore} kneeClassName={spider.foreKnee} index={0} />
      <g className={spider.dust}>
        {DUST.map((speck) => (
          <circle key={`${speck.x} ${speck.y}`} cx={FORELEG.tip.x + speck.x} cy={GROUND + speck.y} r={1.3} fill={SHADE.black} />
        ))}
      </g>
    </>
  )
}

// Where it stands inside a scene's own svg: the left edge of its box at x, its tips on y, its height.
export interface SpiderPlace {
  x: number
  y: number
  height: number
}

interface GiantSpiderProps {
  pose: SpiderPose
  place: SpiderPlace
  lame?: boolean
}

export function GiantSpider({ pose, place, lame = false }: GiantSpiderProps) {
  return (
    <svg
      x={place.x}
      y={place.y - place.height}
      width={(place.height * 240) / 160}
      height={place.height}
      viewBox="0 0 240 160"
      className={`${spider.spider} ${spider[pose]}`}
      aria-hidden="true"
      focusable="false"
    >
      <g className={spider.whole}>
        {FAR_LEGS.map((leg) => (
          <LegShape key={leg.hip.x} leg={leg} fill={SHADE.fog} />
        ))}
        {NEAR_LEGS.map((leg, index) => (
          <MovingLeg key={leg.hip.x} leg={leg} className={spider.step} index={index + 1} />
        ))}
        <path d={BODY} fill={SHADE.black} className={spider.body} />
        <Foreleg lame={lame} />
      </g>
    </svg>
  )
}

// The foreleg's shin as the trap keeps it: the piece torn off, lying in the jaws, the tip up.
export const TORN_SHIN = blade(at(0, 0), at(62, -26), 3.2, TIP)

// Only its two forelegs, reaching down over a cliff edge from the body above it: viewBox 120 by 80, the
// hips above the top edge, the knees bent out to each side, the needle tips at the bottom.
const REACH: readonly Leg[] = [
  { hip: at(58, -12), knee: at(26, 22), tip: at(46, 78) },
  { hip: at(66, -12), knee: at(98, 26), tip: at(80, 76) },
]

export function ReachingLegs({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      {REACH.map((leg) => (
        <LegShape key={leg.knee.x} leg={leg} fill={SHADE.black} />
      ))}
    </svg>
  )
}
