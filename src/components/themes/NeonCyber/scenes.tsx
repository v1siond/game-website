import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { HERO_IDENTITY } from '@/lib/cv/heroIdentity'
import type { Labels } from '@/lib/cv/labels'
import { ramp } from '@/lib/scroll/stage'
import { walkAlong } from '@/lib/scroll/walkAlong'
import { clamp01, fadeTo, fx, lerp, r1, reached, spread, transformTo } from '../shared/stageNodes'
import type { District } from './city'
import { NEON } from './palette'
import { handAt } from '@/lib/motion/rigPose'
import { RIGHT_ARM, SIT, STAND, dash, drum, hack, hop, kick, mix, scan, slash, walk, type MercPose } from './pose'

// Each part of the page as a scene of the night city: its district, his kit, the props it holds (one per
// card the section counts) and, per frame, what the props and he do at the scene's progress p (0 when its
// stage starts to rise, 1 when it has sunk) with f of its cards reached (0 to count, fractional).
// About: he walks a row of holo tags and scans each one. Work: the braindance edit hangs over the street,
// one clip per job, and he hops on the playhead under each. Tech: one Sandevistan dash with his after
// images, a data shard snapping lit per category. Services: he double jumps from access point to access
// point and jacks in, each screen booting. Projects: he breaches a column of ICE per gig, red to green.
// Ventures: the fixer's contract pins drop on the Badlands road and he cuts each loose with the mantis
// blades. Bands: the car radio's dial over the street, the needle on each band while he drums the neon
// snare. Muay Thai: the ripperdoc installs each achievement while he sits in the chair, then he stands and
// takes the gang punk with the roundhouse. Contact: he sits on his car's rear deck, then drives off into
// the Badlands. The hero: him in Watson under the overpass.

export type SceneId = 'hero' | SectionId | 'contact'

/** The street his boots stand on, in the stage's 1600 by 900 units. */
export const GROUND = 856

/** Where a scene's props stand: one x per card, `cx` the scene's centre, all inside what a phone shows. */
interface Layout {
  count: number
  /** Cards the section counts before its props (the Muay Thai record's facts), taken off before a writer reads f. */
  lead: number
  xs: number[]
  cx: number
  phone: boolean
}

/** Him in a frame: where his boots are, his size, his pose and how visible he is. */
export interface MercState {
  x: number
  y: number
  k: number
  pose: MercPose
  opacity: number
}

type SceneWriter = (p: number, f: number) => MercState

/** What a writer reads its nodes from: a stage, or NO_NODES to compute his place alone (the first paint). */
type StageNodes = Pick<ParentNode, 'querySelector'>

export const NO_NODES: StageNodes = { querySelector: () => null }

export interface SceneDef {
  district: District
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The props behind him and in front of him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  front: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => SceneWriter
}

// The band the props stand in: the right of the screen beside the text column on a wide screen, the middle
// third a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [820, 1380], phone: [640, 960] }

const layoutOf = (count: number, lead: number, phone: boolean): Layout => {
  const [a, b] = BAND[phone ? 'phone' : 'wide']
  return { count, lead, xs: spread(Math.max(count, 1), a, b), cx: (a + b) / 2, phone }
}

const K = 1.6
const NONE = (): ReactNode => null

const fxs = (stage: StageNodes, name: string, count: number): Array<Element | null> => Array.from({ length: count }, (_, i) => fx(stage, `${name}-${i}`))

// He comes in from this far left of the first prop as its card nears the reading line.
const ENTRY = 200

const travel = (xs: readonly number[], f: number, offset: number) => walkAlong(xs, f, offset, ENTRY)

const merc = (x: number, pose: MercPose, k = K, y = GROUND, opacity = 1): MercState => ({ x, y, k, pose, opacity })

/** The city's own motions in every scene, carried by p: the flying car crosses, one sign flickers. */
function cityWriter(stage: StageNodes): (p: number) => void {
  const car = fx(stage, 'car')
  const flicker = fx(stage, 'flicker')
  return (p) => {
    transformTo(car, `translate(${r1(-200 + 2000 * p)} ${r1(-40 * p)})`)
    fadeTo(flicker, Math.sin(p * 40) > 0.2 ? 1 : 0.35)
  }
}

const withCity =
  (bind: SceneDef['bind']): SceneDef['bind'] =>
  (stage, layout) => {
    const city = cityWriter(stage)
    const write = bind(stage, layout)
    return (p, f) => {
      city(p)
      return write(p, f)
    }
  }

// ---------------------------------------------------------------- the hero

const hero: SceneDef = {
  district: 'watson',
  kit: null,
  back: NONE,
  front: NONE,
  bind: withCity((_stage, { phone }) => (p) => merc(phone ? 800 : 1200, { ...STAND, rise: -1.5 * Math.sin(p * 12) }, phone ? 2 : 2.3)),
}

// ---------------------------------------------------------------- About: the holo tags

const TAG_Y = 500

const about: SceneDef = {
  district: 'japantown',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${TAG_Y})`}>
          <path d={`M0 30 V${GROUND - TAG_Y - 120}`} stroke={NEON.hud} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="6 8" />
          <g data-fx={`tag-${i}`} opacity={0.25}>
            <path d="M-46 -28 H34 L46 -16 V28 H-46 Z" fill={NEON.ink} fillOpacity={0.8} stroke={NEON.hud} strokeWidth={3} />
            <path d="M-34 -10 H22 M-34 6 H8" stroke={NEON.hud} strokeWidth={5} />
          </g>
        </g>
      ))}
      <path data-fx="beam" d="M0 0" stroke={NEON.hud} strokeWidth={3} strokeDasharray="10 6" opacity={0} />
    </>
  ),
  front: NONE,
  bind: withCity((stage, { xs, count }) => {
    const tags = fxs(stage, 'tag', count)
    const beam = fx(stage, 'beam')
    return (p, f) => {
      tags.forEach((tag, i) => fadeTo(tag, 0.25 + 0.75 * reached(f, i)))
      const { x, at, act } = travel(xs, f, -110)
      const pose = mix(walk(f * 3 + p * 2), scan(1), act)
      // the beam leaves from his hand at the temple, where the reticle locks
      const [hx, hy] = handAt(RIGHT_ARM, pose.armRight, pose.foreRight)
      beam?.setAttribute('d', `M${r1(x + (hx - 50) * K)} ${r1(GROUND + (hy - 144) * K)} L${r1(xs[at] - 40)} ${TAG_Y + 10}`)
      fadeTo(beam, act * 0.9)
      return merc(x, pose)
    }
  }),
}

// ---------------------------------------------------------------- Work: the braindance edit

const EDIT_Y = 430

const work: SceneDef = {
  district: 'japantown',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      <rect x={r1(xs[0] - 90)} y={EDIT_Y + 52} width={r1(xs[xs.length - 1] - xs[0] + 180)} height={10} fill={NEON.ink} stroke={NEON.chromeRed} strokeWidth={2} />
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${EDIT_Y})`}>
          <rect x={-46} y={-34} width={92} height={64} fill={NEON.ink} stroke={NEON.data} strokeWidth={3} />
          <rect data-fx={`clip-${i}`} x={-38} y={-26} width={76} height={48} fill={NEON.data} opacity={0.12} />
          <path d="M-30 -12 H18 M-30 2 H30 M-30 14 H6" stroke={NEON.ice} strokeOpacity={0.5} strokeWidth={4} />
        </g>
      ))}
      <g data-fx="head">
        <path d={`M0 ${EDIT_Y + 44} V${GROUND - 250}`} stroke={NEON.hud} strokeWidth={3} />
        <path d={`M0 ${EDIT_Y + 40} l12 14 l-12 14 l-12 -14 Z`} fill={NEON.hud} />
      </g>
    </>
  ),
  front: NONE,
  bind: withCity((stage, { xs, count }) => {
    const clips = fxs(stage, 'clip', count)
    const head = fx(stage, 'head')
    return (p, f) => {
      clips.forEach((clip, i) => fadeTo(clip, 0.12 + 0.78 * reached(f, i)))
      const { x, moving, act } = travel(xs, f, 0)
      transformTo(head, `translate(${r1(x)} 0)`)
      // the hop on the playhead under each clip: up and tucked while he is at it
      return merc(x, mix(walk(f * 3 + p * 2), hop(Math.sin(Math.PI * act) * (1 - moving)), act))
    }
  }),
}

// ---------------------------------------------------------------- Tech stack: the Sandevistan dash

const SHARD_Y = 700
const ECHOES = [0.5, 0.32, 0.18]

const tech: SceneDef = {
  district: 'megablock',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${SHARD_Y})`}>
          <path d="M0 -30 L20 0 L0 30 L-20 0 Z" fill={NEON.ink} stroke={NEON.hack} strokeWidth={3} />
          <path data-fx={`shard-${i}`} d="M0 -22 L14 0 L0 22 L-14 0 Z" fill={NEON.hack} opacity={0.15} />
        </g>
      ))}
      {ECHOES.map((_, i) => (
        <g key={i} data-fx={`echo-${i}`} opacity={0}>
          <use href="#nc-merc-tech" />
        </g>
      ))}
    </>
  ),
  front: () => <rect data-fx="slow" width={1600} height={900} fill={NEON.hack} opacity={0} />,
  bind: withCity((stage, { xs, count }) => {
    const shards = fxs(stage, 'shard', count)
    const echoes = fxs(stage, 'echo', ECHOES.length)
    const slow = fx(stage, 'slow')
    const start = xs[0] - 260
    const end = xs[xs.length - 1] + 160
    return (p, f) => {
      shards.forEach((shard, i) => fadeTo(shard, 0.15 + 0.85 * reached(f, i)))
      const speed = ramp(f, 0, 0.3) * (1 - ramp(f, count - 0.3, count))
      const x = lerp(start, end, clamp01(f / Math.max(count, 1)))
      echoes.forEach((echo, i) => {
        transformTo(echo, `translate(${r1(x - 46 * (i + 1) * speed)} ${GROUND}) scale(${K})`)
        fadeTo(echo, ECHOES[i] * speed)
      })
      fadeTo(slow, 0.1 * speed)
      return merc(x, mix(STAND, dash(f * 4), Math.max(speed, ramp(f, 0, 0.1))))
    }
  }),
}

// ---------------------------------------------------------------- Services: the access points

const services: SceneDef = {
  district: 'watson',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${GROUND})`}>
          <rect x={-8} y={-110} width={16} height={110} fill={NEON.steel} />
          <rect x={-40} y={-200} width={80} height={96} fill={NEON.ink} stroke={NEON.data} strokeWidth={3} />
          <g data-fx={`screen-${i}`} opacity={0.1}>
            <rect x={-32} y={-192} width={64} height={60} fill={NEON.data} fillOpacity={0.5} />
            <path d="M-26 -178 H18 M-26 -164 H26 M-26 -150 H4" stroke={NEON.ice} strokeWidth={4} />
          </g>
          <rect x={-32} y={-126} width={64} height={12} fill={NEON.hack} fillOpacity={0.5} />
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: withCity((stage, { xs, count }) => {
    const screens = fxs(stage, 'screen', count)
    return (_p, f) => {
      screens.forEach((screen, i) => fadeTo(screen, 0.1 + 0.9 * reached(f, i)))
      const { x, moving, act } = travel(xs, f, -120)
      // the double jump on the cyberlegs from one access point to the next
      return merc(x, mix(hop(moving), hack(1, (f * 2) % 1), act), K, GROUND - 120 * moving * Math.min(1, f * 2))
    }
  }),
}

// ---------------------------------------------------------------- Projects: the ICE

const projects: SceneDef = {
  district: 'megablock',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${GROUND - 260})`}>
          <rect x={-34} y={0} width={68} height={250} fill={NEON.ink} fillOpacity={0.85} />
          <rect data-fx={`ice-${i}`} x={-34} y={0} width={68} height={250} fill="none" stroke={NEON.chromeRed} strokeWidth={3} />
          <rect data-fx={`open-${i}`} x={-34} y={0} width={68} height={250} fill={NEON.hack} fillOpacity={0.25} stroke={NEON.hack} strokeWidth={3} opacity={0} />
          <path d="M-22 30 H22 M-22 60 H10 M-22 90 H22 M-22 120 H14 M-22 150 H22 M-22 180 H6" stroke={NEON.hud} strokeOpacity={0.55} strokeWidth={5} strokeDasharray="8 5" />
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: withCity((stage, { xs, count }) => {
    const ice = fxs(stage, 'ice', count)
    const open = fxs(stage, 'open', count)
    return (p, f) => {
      ice.forEach((node, i) => fadeTo(node, 1 - reached(f, i)))
      open.forEach((node, i) => fadeTo(node, reached(f, i)))
      const { x, act } = travel(xs, f, -110)
      return merc(x, mix(walk(f * 3 + p * 2), hack(1, (f * 3) % 1), act))
    }
  }),
}

// ---------------------------------------------------------------- Ventures: the fixer's contracts

const PIN_Y = GROUND - 30

const ventures: SceneDef = {
  district: 'badlands',
  kit: 'engineer',
  back: ({ xs }) => (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} 0)`}>
          <g data-fx={`pin-${i}`} transform="translate(0 -300)">
            <path d="M0 30 L-30 -30 A35 35 0 1 1 30 -30 Z" fill={NEON.gold} stroke={NEON.ink} strokeWidth={4} />
            <circle cx={0} cy={-42} r={12} fill={NEON.ink} />
          </g>
          <ellipse data-fx={`ring-${i}`} cx={0} cy={PIN_Y + 32} rx={46} ry={10} fill="none" stroke={NEON.gold} strokeWidth={3} opacity={0} />
        </g>
      ))}
    </>
  ),
  front: NONE,
  bind: withCity((stage, { xs, count }) => {
    const pins = fxs(stage, 'pin', count)
    const rings = fxs(stage, 'ring', count)
    return (p, f) => {
      pins.forEach((pin, i) => {
        const drop = reached(f, i) ** 2
        transformTo(pin, `translate(0 ${r1(lerp(-300, PIN_Y, drop))})`)
        fadeTo(rings[i], drop)
      })
      const { x, act } = travel(xs, f, -120)
      return merc(x, mix(walk(f * 3 + p * 2), slash(1), act))
    }
  }),
}

// ---------------------------------------------------------------- Bands: the car radio's dial

const DIAL_Y = 330
const EQ = [0.5, 0.9, 0.7, 1, 0.6]

const bands: SceneDef = {
  district: 'japantown',
  kit: 'drummer',
  back: ({ xs }) => (
    <>
      <rect x={r1(xs[0] - 110)} y={DIAL_Y - 80} width={r1(xs[xs.length - 1] - xs[0] + 220)} height={150} fill={NEON.ink} fillOpacity={0.9} stroke={NEON.data} strokeWidth={3} />
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${DIAL_Y})`}>
          <rect x={-3} y={-70} width={6} height={22} fill={NEON.data} />
          <g data-fx={`eq-${i}`} transform="scale(1 0.15)">
            {EQ.map((h, b) => (
              <rect key={b} x={-30 + b * 13} y={-60 * h + 50} width={9} height={60 * h} fill={NEON.hud} />
            ))}
          </g>
        </g>
      ))}
      <rect data-fx="needle" x={-2} y={DIAL_Y - 80} width={4} height={150} fill={NEON.hud} />
    </>
  ),
  front: NONE,
  bind: withCity((stage, { xs, count, cx }) => {
    const eqs = fxs(stage, 'eq', count)
    const needle = fx(stage, 'needle')
    const last = xs.length - 1
    return (p, f) => {
      eqs.forEach((eq, i) => {
        const level = 0.15 + 0.85 * reached(f, i)
        transformTo(eq, `translate(0 ${r1(50 * (1 - level))}) scale(1 ${level.toFixed(3)})`)
      })
      const along = Math.min(last, Math.max(0, f - 0.5))
      const at = Math.floor(along)
      transformTo(needle, `translate(${r1(lerp(xs[at], xs[Math.min(last, at + 1)], along - at))} 0)`)
      return merc(cx, drum(f * 6 + p * 4))
    }
  }),
}

// ---------------------------------------------------------------- Muay Thai: the ripperdoc's chair

const CHAIR_K = 2.4

// The ripperdoc's chair from the side, its back on the left, the seat facing right, the clamp arm with its
// LED row, the cable bundle; over it the clinic's green neon cross. In its own 100 by 150 box.
function Chair() {
  return (
    <g>
      <path data-fx="cross" d="M10 2 H18 V10 H26 V18 H18 V26 H10 V18 H2 V10 H10 Z" fill="none" stroke={NEON.hack} strokeWidth={2.5} strokeLinejoin="round" opacity={0.4} />
      <path d="M8 40 L22 40 L26 112 L12 112 Z" fill={NEON.steel} stroke={NEON.ink} strokeWidth={2} />
      <path d="M12 112 H80 V120 H12 Z" fill={NEON.steel} stroke={NEON.ink} strokeWidth={2} />
      <path d="M40 120 V142 M24 145 H60" stroke={NEON.chrome} strokeWidth={5} />
      <path d="M2 30 H34 L38 38 H2 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={2} />
      <path d="M8 34 H30" stroke={NEON.hack} strokeWidth={2} strokeDasharray="3 2" />
      <path d="M8 104 Q-6 130 10 150" stroke={NEON.data} strokeWidth={2} fill="none" />
    </g>
  )
}

// The gang punk who steps in when he leaves the chair: a dark silhouette facing left with a hot pink
// mohawk, three red optic dots, a studded jacket lit along its edge and a chrome fist up; feet on y 144.
function Punk() {
  return (
    <g>
      <path d="M14 96 L24 96 L22 144 L12 144 Z M27 96 L37 96 L39 144 L29 144 Z" fill={NEON.ink} stroke={NEON.steel} strokeWidth={1.4} />
      <path d="M10 48 Q25 42 40 48 L42 98 L8 98 Z" fill={NEON.alley} stroke={NEON.steel} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M9 50 L8 96" stroke={NEON.chromeRed} strokeWidth={1.4} />
      <path d="M18 58 h2 M18 66 h2 M18 74 h2" stroke={NEON.chrome} strokeWidth={2} />
      <path d="M14 24 Q14 12 25 12 Q36 12 36 25 Q36 38 25 41 Q14 38 14 24 Z" fill={NEON.surface} stroke={NEON.steel} strokeWidth={1.4} />
      <path d="M20 13 Q24 0 28 2 Q29 8 30 13 Z" fill={NEON.hotPink} />
      <g fill={NEON.chromeRed}>
        <circle cx={17} cy={23} r={1.6} />
        <circle cx={21} cy={21.5} r={1.6} />
        <circle cx={20} cy={26} r={1.3} />
      </g>
      <path d="M10 50 L2 64 L6 74" fill="none" stroke={NEON.chrome} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={6} cy={76} r={4} fill={NEON.chrome} stroke={NEON.ink} strokeWidth={1.2} />
      <path data-fx="impact" d="M2 74 L-6 66 M0 82 L-9 82 M2 90 L-6 98" stroke={NEON.hud} strokeWidth={2} strokeLinecap="round" opacity={0} />
    </g>
  )
}

const chairX = ({ cx, phone }: Layout): number => cx - (phone ? 120 : 200)
const SCREEN_W = 300
const CHAIR_TOP = GROUND - 144 * CHAIR_K

const muayThai: SceneDef = {
  district: 'megablock',
  kit: 'fighter',
  back: (layout) => (
    <>
      <g transform={`translate(${r1(chairX(layout) - 60)} ${r1(CHAIR_TOP)}) scale(${CHAIR_K})`}>
        <Chair />
      </g>
      {!layout.phone && (
        <g transform={`translate(${r1(chairX(layout) + 90)} 300)`}>
          <rect width={SCREEN_W} height={40 + layout.count * 34} fill={NEON.ink} fillOpacity={0.9} stroke={NEON.hack} strokeWidth={3} />
          {layout.xs.map((x, i) => (
            <g key={x} transform={`translate(20 ${30 + i * 34})`}>
              <rect width={SCREEN_W - 40} height={12} fill={NEON.glass} />
              <rect data-fx={`bar-${i}`} width={SCREEN_W - 40} height={12} fill={NEON.gold} transform="scale(0 1)" />
            </g>
          ))}
        </g>
      )}
    </>
  ),
  front: (layout) => (
    <g data-fx="punk" transform={`translate(${r1(layout.cx + 600)} ${r1(CHAIR_TOP)}) scale(${CHAIR_K})`}>
      <Punk />
    </g>
  ),
  bind: withCity((stage, layout) => {
    const { count, cx } = layout
    const bars = fxs(stage, 'bar', count)
    const cross = fx(stage, 'cross')
    const punk = fx(stage, 'punk')
    const impact = fx(stage, 'impact')
    const seat = chairX(layout) + 60
    return (p, f) => {
      bars.forEach((bar, i) => transformTo(bar, `scale(${reached(f, i).toFixed(3)} 1)`))
      fadeTo(cross, f > 0 && f < count ? 0.6 + 0.4 * Math.abs(Math.sin(f * 6)) : 0.4)
      const stand = ramp(f, count - 0.35, count)
      const strike = stand * ramp(p, 0.62, 0.8)
      const foeAt = lerp(cx + 600, cx + 40, ramp(f, count - 0.6, count)) + 70 * strike
      transformTo(punk, `translate(${r1(foeAt)} ${r1(CHAIR_TOP)}) scale(${CHAIR_K}) rotate(${r1(14 * strike)} 25 144)`)
      fadeTo(impact, strike > 0.5 ? 1 : 0)
      const pose = stand < 1 ? mix(SIT, kick(0), stand) : kick(strike)
      return merc(lerp(seat, cx - 110, stand), pose, K, lerp(GROUND - 40, GROUND, stand))
    }
  }),
}

// ---------------------------------------------------------------- Contact: the drive off

const CAR_K = 2.6

// His car in profile, low and long: the black body, the cabin glass with him at the wheel (the beard and the
// cyan optic), the wheels lit at the rims, the headlight ahead and the tail light streaks behind. 240 by 80.
function Car() {
  return (
    <g>
      <g data-fx="streaks" opacity={0}>
        <rect x={-160} y={44} width={160} height={4} fill={NEON.chromeRed} />
        <rect x={-110} y={52} width={110} height={3} fill={NEON.hotPink} />
      </g>
      <path d="M6 58 L14 40 L70 34 L104 16 H160 L196 34 L232 40 L236 58 Z" fill={NEON.ink} stroke={NEON.data} strokeWidth={2} />
      <path d="M110 20 H156 L184 34 H96 Z" fill={NEON.data} fillOpacity={0.3} />
      <g data-fx="driver" opacity={0}>
        <circle cx={140} cy={26} r={6} fill={HERO_IDENTITY.hair} />
        <path d="M135 29 Q140 36 145 29" fill={HERO_IDENTITY.hair} />
        <rect x={140} y={24} width={5} height={2} fill={NEON.data} />
      </g>
      <rect x={6} y={44} width={8} height={5} fill={NEON.chromeRed} />
      <rect x={226} y={42} width={10} height={5} fill={NEON.ice} />
      {[52, 190].map((x) => (
        <g key={x}>
          <circle cx={x} cy={60} r={14} fill={NEON.ink} stroke={NEON.chrome} strokeWidth={3} />
          <circle cx={x} cy={60} r={8} fill="none" stroke={NEON.hack} strokeWidth={2} />
        </g>
      ))}
    </g>
  )
}

const carLeft = ({ cx }: Layout): number => cx - 120 * CAR_K
const CAR_TOP = GROUND - 76 * CAR_K

const contact: SceneDef = {
  district: 'badlands',
  kit: null,
  back: NONE,
  front: (layout) => (
    <g data-fx="ride" transform={`translate(${r1(carLeft(layout))} ${r1(CAR_TOP)}) scale(${CAR_K})`}>
      <Car />
    </g>
  ),
  bind: (stage, layout) => {
    const ride = fx(stage, 'ride')
    const streaks = fx(stage, 'streaks')
    const driver = fx(stage, 'driver')
    const left = carLeft(layout)
    return (p) => {
      const off = ramp(p, 0.55, 0.95) ** 2
      transformTo(ride, `translate(${r1(left + 1500 * off)} ${r1(CAR_TOP)}) scale(${CAR_K})`)
      fadeTo(streaks, ramp(p, 0.55, 0.7))
      const inside = ramp(p, 0.42, 0.52)
      fadeTo(driver, inside)
      return merc(left + 48 * CAR_K, SIT, 1.2, CAR_TOP + 52 * CAR_K, 1 - inside)
    }
  },
}

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  layout: Layout
  /** His kit here: the scene's own, or the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

type RecordWords = Pick<Labels, 'record' | 'years'>

const sceneOf = (id: SceneId, slot: SectionSlot | null, { lead, count }: StageItems, profession: Profession, phone: boolean): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: layoutOf(count, lead, phone), kit: def.kit ?? profession, slot }
}

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, aboutTags: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, aboutTags), profession, phone)),
  sceneOf('contact', null, NO_ITEMS, profession, phone),
]
