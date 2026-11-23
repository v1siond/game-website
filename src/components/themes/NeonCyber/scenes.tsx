import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import type { Labels } from '@/lib/cv/labels'
import { ramp } from '@/lib/scroll/stage'
import { trackAt, trackEase } from '@/lib/scroll/track'
import { drop, hop } from '@/lib/motion/arc'
import { handAt, type ArmPivots } from '@/lib/motion/rigPose'
import { clamp01, fadeTo, focusOn, fx, lerp, r1, spread, transformTo } from '../shared/stageNodes'
import { fxs, propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import type { District } from './city'
import { NEON } from './palette'
import { CROUCH, LEAP, SIT, STAND, WIND, cut, deflect, guard, hack, hang, mix, run, takedown, type HeroPose } from './pose'

// Each part of the page as a scene of the neon city: its district, his kit, the props it holds (one per card
// the section counts) and, per frame, what the props and he do at the scene's progress p (0 when its stage
// starts to rise, 1 when it has sunk) with f of its cards reached (0 to count, fractional). One beat per card,
// each a move of the genre and the answer to it, held at its end (trackAt: a short lead in, then the move):
// About: he hacks the wall cameras one by one, each lens turning from red to cyan. Work: from behind a crate
// he takes down each guard who walks past it. Tech: he runs along one lit wall panel per category and leaps
// the gap to the next, the wall carried past on trackAt. Services: per service his grapple line fires to the
// next sign anchor and he swings the gap. Projects: each drone fires, his blade turns the bolt back and the
// drone drops. Ventures: each runner who charges him is held in stasis by his hack. Bands: the heavy walker
// fires a salvo per band, time slows, he dashes through and cuts its leg, the camera pulled out to frame it.
// Muay Thai: the duel with a chrome armed fighter, a parry and a counter per line, the last a finisher with
// the camera pushed in. Contact: a flying cab comes down, he steps in and it lifts away. The hero: he stands
// under the overpass and draws his blade as the page starts to scroll, up on a fire escape on a phone.

export type SceneId = 'hero' | SectionId | 'contact'

/** The street his boots stand on, in the stage's 1600 by 900 units. */
export const GROUND = 856

type Layout = PropLayout

/** Him in a frame: where his boots are, his size, his pose and how visible he is. */
export type HeroState = FigureState<HeroPose>

export interface SceneDef {
  district: District
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The props behind him and in front of him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  front: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<HeroPose>
}

// The band the props stand in: the right of the screen beside the text column on a wide screen, the middle
// third a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [820, 1380], phone: [640, 960] }

const K = 1.6
const NONE = (): ReactNode => null

const him = (x: number, pose: HeroPose, k = K, y = GROUND, opacity = 1): HeroState => ({ x, y, k, pose, opacity })

// His deck hand's joints in his viewBox (the origins in figure.module.css), for where a hack or a line leaves.
const LEFT_ARM: ArmPivots = { shoulder: [68, 48], elbow: [69.5, 66], hand: [69.8, 88] }

/** His deck hand on the stage in `state`. */
const deckHand = ({ x, y, k, pose }: HeroState): readonly [number, number] => {
  const [hx, hy] = handAt(LEFT_ARM, pose.armLeft, pose.foreLeft)
  return [x + (hx - 50) * k, y + (hy - 144 + pose.rise) * k]
}

/** The beat `f` cards in: the card at, its lead in and its move (trackAt on the spot, no floor to scroll). */
const beatOf = (f: number, count: number, lead = 0.3) => trackAt(f, Math.max(count, 1), 0, lead)

/** The move held at its end, or let go over its last stretch when another beat follows. */
const heldIn = (act: number, at: number, count: number): number => (at >= count - 1 ? 1 : 1 - ramp(act, 0.88, 1))

/** How far card `i`'s own beat has played when the beat at `at` is `t` through: done before it, none after. */
const beatShare = (i: number, at: number, t: number): number => (i < at ? 1 : i === at ? t : 0)

/** Where he stands and where the scene's targets stand: him on the left of the band, the targets spread right of him. */
const lineUp = ({ phone, count }: Layout): { stand: number; xs: number[] } =>
  phone ? { stand: 660, xs: spread(Math.max(count, 1), 790, 980) } : { stand: 880, xs: spread(Math.max(count, 1), 1020, 1440) }

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

// On a phone the text panel takes the screen below the first half, so he stands up on a fire escape landing
// in the top half, over the street, where the hero shows him before the panel.
const LANDING_Y = 400

function FireEscape() {
  return (
    <g>
      <path d={`M560 ${LANDING_Y} H1040 V${LANDING_Y + 14} H560 Z`} fill={NEON.steel} stroke={NEON.ink} strokeWidth={3} />
      <path d={`M560 ${LANDING_Y - 70} H1040 M580 ${LANDING_Y - 70} V${LANDING_Y} M1020 ${LANDING_Y - 70} V${LANDING_Y}`} stroke={NEON.steel} strokeWidth={6} fill="none" />
      <path d={`M600 ${LANDING_Y + 14} L520 ${GROUND} M1000 ${LANDING_Y + 14} L1080 ${GROUND}`} stroke={NEON.steel} strokeWidth={8} />
      <path d={`M560 ${LANDING_Y + 14} H1040`} stroke={NEON.data} strokeOpacity={0.6} strokeWidth={2} />
    </g>
  )
}

const hero: SceneDef = {
  district: 'overpass',
  kit: null,
  back: ({ phone }) => (phone ? <FireEscape /> : null),
  front: NONE,
  bind: withCity((_stage, { phone }) => (p) => {
    const stance = guard(ramp(p, 0.04, 0.25))
    return phone ? him(800, stance, 1.7, LANDING_Y) : him(1200, stance, 2.3)
  }),
}

// ---------------------------------------------------------------- About: the hacked cameras

// The cameras hang in two staggered rows, so a long About keeps each one clear of its neighbours.
const camY = (i: number): number => (i % 2 === 0 ? 340 : 460)

// A wall camera on its bracket, its lens toward him on the left: red while it watches, cyan once hacked.
function WallCamera({ i }: { i: number }) {
  return (
    <>
      <path d="M22 -60 V-8 M10 -8 H34" stroke={NEON.steel} strokeWidth={6} />
      <g data-fx={`cam-${i}`} transform="rotate(-24)">
        <path d="M-34 -14 H30 L36 -6 V10 H-34 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={3} />
        <circle cx={-34} cy={-2} r={10} fill={NEON.ink} />
        <circle cx={-34} cy={-2} r={6} fill={NEON.chromeRed} />
        <circle data-fx={`fixed-${i}`} cx={-34} cy={-2} r={6} fill={NEON.data} opacity={0} />
      </g>
    </>
  )
}

const about: SceneDef = {
  district: 'lanterns',
  kit: 'engineer',
  back: (layout) => (
    <>
      {lineUp(layout).xs.map((x, i) => (
        <g key={x} transform={`translate(${r1(x)} ${camY(i)}) scale(0.8)`}>
          <WallCamera i={i} />
        </g>
      ))}
      <path data-fx="line" d="M0 0" stroke={NEON.data} strokeWidth={3} strokeDasharray="10 6" opacity={0} />
    </>
  ),
  front: NONE,
  bind: withCity((stage, layout) => {
    const { count } = layout
    const { stand: x, xs } = lineUp(layout)
    const cams = fxs(stage, 'cam', count)
    const fixed = fxs(stage, 'fixed', count)
    const line = fx(stage, 'line')
    return (_p, f) => {
      const { at, run: lead, act } = beatOf(f, count)
      cams.forEach((cam, i) => transformTo(cam, `rotate(${r1(lerp(-24, 12, beatShare(i, at, lead)))})`))
      fixed.forEach((lens, i) => fadeTo(lens, beatShare(i, at, ramp(act, 0.55, 0.75))))
      const state = him(x, hack(ramp(act, 0, 0.3) * heldIn(act, at, count), act))
      const [hx, hy] = deckHand(state)
      line?.setAttribute('d', `M${r1(hx)} ${r1(hy)} L${r1(lerp(hx, xs[at] - 27, ramp(act, 0.25, 0.55)))} ${r1(lerp(hy, camY(at), ramp(act, 0.25, 0.55)))}`)
      fadeTo(line, ramp(act, 0.25, 0.3) * (1 - ramp(act, 0.8, 0.9)))
      return state
    }
  }),
}

// ---------------------------------------------------------------- Work: the takedowns from cover

// A guard in his patrol armour facing left toward the crate, a rifle across his chest; feet on (0, 0).
function Guard() {
  return (
    <g transform="translate(-25 -144)">
      <path d="M14 96 L24 96 L22 144 L12 144 Z M27 96 L37 96 L39 144 L29 144 Z" fill={NEON.ink} stroke={NEON.steel} strokeWidth={1.4} />
      <path d="M10 48 Q25 42 40 48 L42 98 L8 98 Z" fill={NEON.alley} stroke={NEON.steel} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M14 22 Q14 8 25 8 Q36 8 36 22 L36 34 Q25 40 14 34 Z" fill={NEON.steel} stroke={NEON.ink} strokeWidth={1.4} />
      <path d="M14 22 H28" stroke={NEON.chromeRed} strokeWidth={2.4} />
      <path d="M-4 64 L36 72" stroke={NEON.chrome} strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

const crateX = ({ phone }: Layout): number => (phone ? 780 : 1000)

const work: SceneDef = {
  district: 'slab',
  kit: 'engineer',
  back: (layout) => (
    <g transform={`translate(${crateX(layout)} ${GROUND})`}>
      <rect x={-60} y={-120} width={120} height={120} fill={NEON.panel} stroke={NEON.ink} strokeWidth={4} />
      <path d="M-60 -60 H60 M-60 -120 L60 0" stroke={NEON.steel} strokeWidth={3} />
      <path d="M-60 -116 H60" stroke={NEON.hud} strokeOpacity={0.5} strokeWidth={2} />
    </g>
  ),
  front: () => (
    <g data-fx="guard">
      <Guard />
    </g>
  ),
  bind: withCity((stage, layout) => {
    const { count } = layout
    const crate = crateX(layout)
    const cover = crate - 110
    const out = crate + 40
    const guardNode = fx(stage, 'guard')
    return (_p, f) => {
      const { at, run: lead, act } = beatOf(f, count, 0.45)
      const fall = ramp(act, 0.35, 0.7)
      transformTo(guardNode, `translate(${r1(lerp(crate + 480, crate + 130, lead) + 30 * fall)} ${GROUND}) rotate(${r1(82 * fall)}) scale(${K})`)
      fadeTo(guardNode, 1 - 0.45 * fall)
      const strike = ramp(act, 0, 0.4)
      if (act > 0) return him(lerp(cover, out, strike), mix(CROUCH, takedown(1), strike))
      const back = at > 0 ? ramp(lead, 0, 0.5) : 1
      return him(lerp(out, cover, back), mix(takedown(1), CROUCH, back))
    }
  }),
}

// ---------------------------------------------------------------- Tech stack: the wall run

const WALL = { spacing: 420, width: 300, top: 300, bottom: 690, runY: 660 }
const RUN_SPAN = 180

const wallStart = ({ phone }: Layout): number => (phone ? 640 : 860)

const tech: SceneDef = {
  district: 'slab',
  kit: 'engineer',
  back: (layout) => (
    <g data-fx="wall">
      {Array.from({ length: Math.max(layout.count, 1) }, (_, i) => (
        <g key={i} transform={`translate(${wallStart(layout) - 60 + i * WALL.spacing} 0)`}>
          <rect y={WALL.top} width={WALL.width} height={WALL.bottom - WALL.top} fill={NEON.panel} stroke={NEON.data} strokeOpacity={0.6} strokeWidth={4} />
          <path d={`M0 ${WALL.top + 40} H${WALL.width} M0 ${WALL.bottom - 40} H${WALL.width}`} stroke={NEON.steel} strokeWidth={3} />
          <rect data-fx={`panel-${i}`} x={16} y={WALL.top + 60} width={WALL.width - 32} height={WALL.bottom - WALL.top - 120} fill={NEON.hack} opacity={0.12} />
        </g>
      ))}
    </g>
  ),
  front: NONE,
  bind: withCity((stage, layout) => {
    const count = Math.max(layout.count, 1)
    const x0 = wallStart(layout)
    const wall = fx(stage, 'wall')
    const panels = fxs(stage, 'panel', count)
    return (p, f) => {
      const { offset, at, run: leap, act } = trackAt(f, count, WALL.spacing, 0.35)
      transformTo(wall, `translate(${r1(-offset)} 0)`)
      panels.forEach((panel, i) => fadeTo(panel, 0.12 + 0.5 * beatShare(i, at, ramp(act, 0, 0.2))))
      const land = ramp(p, 0.62, 0.76)
      const airborne = leap > 0 && leap < 1 && act === 0
      const x = airborne ? lerp(x0 + RUN_SPAN, x0, leap) : x0 + RUN_SPAN * act
      const y = WALL.runY - hop(airborne ? leap : 0, 90) + drop(land, GROUND - WALL.runY)
      return him(x, mix(airborne ? LEAP : run(act * 4 + f), CROUCH, land), K, y)
    }
  }),
}

// ---------------------------------------------------------------- Services: the grapple swings

const SWING = { spacing: 440, length: 360, roof: GROUND - 120 }
const ANCHOR_Y = SWING.roof - Math.sqrt(SWING.length ** 2 - (SWING.spacing / 2) ** 2)

const swingAt = ({ phone }: Layout): number => (phone ? 720 : 980)

const services: SceneDef = {
  district: 'overpass',
  kit: 'engineer',
  back: (layout) => (
    <>
      <g data-fx="roofs">
        {Array.from({ length: Math.max(layout.count, 1) + 1 }, (_, i) => {
          const x = swingAt(layout) + i * SWING.spacing
          return (
            <g key={i}>
              <rect x={x - 90} y={SWING.roof} width={180} height={900 - SWING.roof} fill={NEON.alley} stroke={NEON.ink} strokeWidth={4} />
              <path d={`M${x - 90} ${SWING.roof + 6} H${x + 90}`} stroke={NEON.data} strokeOpacity={0.5} strokeWidth={2} />
              {i < Math.max(layout.count, 1) && (
                <g transform={`translate(${x + SWING.spacing / 2} ${r1(ANCHOR_Y)})`}>
                  <rect x={-56} y={-70} width={112} height={56} fill={NEON.ink} stroke={NEON.magenta} strokeWidth={3} />
                  <path d="M-40 -48 H40 M-40 -34 H16" stroke={NEON.magenta} strokeWidth={5} />
                  <circle r={7} fill={NEON.steel} stroke={NEON.data} strokeWidth={2} />
                </g>
              )}
            </g>
          )
        })}
      </g>
      <path data-fx="grapple" d="M0 0" stroke={NEON.data} strokeWidth={3} opacity={0} />
    </>
  ),
  front: NONE,
  bind: withCity((stage, layout) => {
    const count = Math.max(layout.count, 1)
    const x0 = swingAt(layout)
    const roofs = fx(stage, 'roofs')
    const grapple = fx(stage, 'grapple')
    return (_p, f) => {
      const at = Math.min(Math.max(0, Math.floor(f)), count - 1)
      const into = clamp01(f - at)
      const fire = ramp(into, 0, 0.25)
      const swing = trackEase(ramp(into, 0.25, 0.92))
      const offset = SWING.spacing * (at + swing)
      transformTo(roofs, `translate(${r1(-offset)} 0)`)
      const reach = SWING.spacing * (swing - 0.5)
      const y = ANCHOR_Y + Math.sqrt(SWING.length ** 2 - reach ** 2)
      const landed = ramp(into, 0.92, 1)
      const pose = swing > 0 ? mix(hang(lerp(-1, 1, swing)), CROUCH, landed) : mix(CROUCH, hang(-1), fire)
      const state = him(x0, pose, K, swing > 0 ? y : SWING.roof)
      const [hx, hy] = deckHand(state)
      const anchorX = x0 + SWING.spacing / 2 + at * SWING.spacing - offset
      grapple?.setAttribute('d', `M${r1(hx)} ${r1(hy)} L${r1(lerp(hx, anchorX, fire))} ${r1(lerp(hy, ANCHOR_Y, fire))}`)
      fadeTo(grapple, fire * (1 - landed))
      return state
    }
  }),
}

// ---------------------------------------------------------------- Projects: the deflected shots

const DRONE_Y = 430

// A hover drone facing him: a dark hull, its rotor arms and the red eye of its gun under it.
function Drone({ i }: { i: number }) {
  return (
    <g data-fx={`drone-${i}`}>
      <path d="M-60 -18 H-24 M24 -18 H60" stroke={NEON.steel} strokeWidth={5} />
      <ellipse cx={-48} cy={-24} rx={18} ry={4} fill={NEON.data} opacity={0.6} />
      <ellipse cx={48} cy={-24} rx={18} ry={4} fill={NEON.data} opacity={0.6} />
      <path d="M-30 -16 H30 L22 16 H-22 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={3} />
      <circle cx={-14} cy={10} r={6} fill={NEON.chromeRed} />
    </g>
  )
}

// Where each drone comes to hover: one at a time, a little right of the band's middle.
const droneAt = ({ phone, cx }: Layout): number => (phone ? 900 : cx + 160)

const projects: SceneDef = {
  district: 'slab',
  kit: 'engineer',
  back: (layout) => (
    <>
      {Array.from({ length: Math.max(layout.count, 1) }, (_, i) => (
        <g key={i} transform={`translate(${r1(droneAt(layout))} 0)`}>
          <Drone i={i} />
        </g>
      ))}
    </>
  ),
  front: () => <circle data-fx="bolt" r={9} fill={NEON.hotPink} stroke={NEON.ice} strokeWidth={3} opacity={0} />,
  bind: withCity((stage, layout) => {
    const { count } = layout
    const { stand: x } = lineUp(layout)
    const hover = droneAt(layout)
    const drones = fxs(stage, 'drone', count)
    const bolt = fx(stage, 'bolt')
    const target: readonly [number, number] = [x + 60, GROUND - 100 * K]
    return (_p, f) => {
      const { at, act } = beatOf(f, count)
      drones.forEach((drone, i) => {
        // the drone flies in over its card's lead in, drops when its bolt comes back, and its wreck clears for the next
        const shown = i === at ? 1 : 0
        const fall = beatShare(i, at, ramp(act, 0.85, 1))
        const rise = i === at ? (1 - trackEase(ramp(f - at, 0, 0.3))) * 260 : 0
        transformTo(drone, `translate(0 ${r1(DRONE_Y - rise + drop(fall, GROUND - 30 - DRONE_Y))}) rotate(${r1(30 * fall)})`)
        fadeTo(drone, shown * (1 - 0.5 * fall))
      })
      const coming = ramp(act, 0.05, 0.45)
      const going = ramp(act, 0.5, 0.85)
      const from: readonly [number, number] = [hover - 14, DRONE_Y + 10]
      const [bx, by] = going > 0 ? [lerp(target[0], from[0], going), lerp(target[1], from[1], going)] : [lerp(from[0], target[0], coming), lerp(from[1], target[1], coming)]
      transformTo(bolt, `translate(${r1(bx)} ${r1(by)})`)
      fadeTo(bolt, act > 0.05 && act < 0.86 ? 1 : 0)
      return him(x, mix(guard(1), deflect(1), ramp(act, 0.3, 0.48) * heldIn(act, at, count)))
    }
  }),
}

// ---------------------------------------------------------------- Ventures: the stasis hacks

// A runner charging him from the right, mid stride, a short blade low; feet on (0, 0). The lattice of the hack
// closes over him when it lands.
function Runner({ i }: { i: number }) {
  return (
    <g data-fx={`runner-${i}`} opacity={0}>
      <g transform="translate(-25 -144)">
        <path d="M24 96 L12 120 L4 144 L14 144 L24 122 Z M28 96 L40 118 L48 144 L38 144 L30 122 Z" fill={NEON.ink} stroke={NEON.steel} strokeWidth={1.4} />
        <path d="M12 50 Q26 44 40 52 L36 98 L14 98 Z" fill={NEON.alley} stroke={NEON.steel} strokeWidth={1.4} strokeLinejoin="round" />
        <path d="M14 26 Q14 12 25 12 Q36 12 36 26 Q36 38 25 41 Q14 38 14 26 Z" fill={NEON.surface} stroke={NEON.steel} strokeWidth={1.4} />
        <path d="M14 24 H26" stroke={NEON.hotPink} strokeWidth={2.4} />
        <path d="M12 56 L-2 76 M-2 76 L-14 70" stroke={NEON.chrome} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g data-fx={`lattice-${i}`} opacity={0} stroke={NEON.data} strokeWidth={2} fill={NEON.data} fillOpacity={0.12}>
        <rect x={-34} y={-150} width={68} height={150} />
        <path d="M-34 -112 H34 M-34 -75 H34 M-34 -38 H34 M-11 -150 V0 M11 -150 V0" fill="none" />
      </g>
    </g>
  )
}

const ventures: SceneDef = {
  district: 'outskirts',
  kit: 'engineer',
  back: NONE,
  front: (layout) => (
    <>
      {lineUp(layout).xs.map((x, i) => (
        <Runner key={x} i={i} />
      ))}
    </>
  ),
  bind: withCity((stage, layout) => {
    const { count, phone } = layout
    const { stand: x, xs } = lineUp(layout)
    const runners = fxs(stage, 'runner', count)
    const lattices = fxs(stage, 'lattice', count)
    const edge = phone ? 1080 : 1640
    return (p, f) => {
      const { at, act } = beatOf(f, count, 0.2)
      const drops = ramp(p, 0.62, 0.76)
      runners.forEach((runner, i) => {
        const t = beatShare(i, at, act)
        const charge = ramp(t, 0, 0.6)
        transformTo(runner, `translate(${r1(lerp(edge, xs[i], charge))} ${GROUND}) rotate(${r1(-80 * drops)}) scale(${K})`)
        fadeTo(runner, i < at || (i === at && act > 0) ? 1 : 0)
        fadeTo(lattices[i], ramp(t, 0.55, 0.7) * (1 - drops))
      })
      return him(x, hack(ramp(act, 0.35, 0.55) * (1 - drops), act))
    }
  }),
}

// ---------------------------------------------------------------- Bands: the heavy walker

const WALKER_K = 2.4

// The heavy walker in profile facing him: two jointed legs, the armoured hull, the rocket pod over it and the
// red sensor eye. In its own 200 by 220 box, feet on y 220; the near knee's actuator is the cut's target.
function Walker() {
  return (
    <g transform="translate(-100 -220)">
      <path d="M60 120 L30 170 L50 220 M140 120 L170 170 L150 220" fill="none" stroke={NEON.steel} strokeWidth={14} strokeLinejoin="round" />
      <circle data-fx="knee" cx={30} cy={170} r={10} fill={NEON.panel} stroke={NEON.hud} strokeWidth={3} />
      <path d="M30 220 H70 M130 220 H170" stroke={NEON.ink} strokeWidth={10} />
      <path d="M36 60 L164 60 L176 96 L150 128 L50 128 L24 96 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={4} />
      <path d="M40 96 H160" stroke={NEON.magenta} strokeWidth={3} />
      <rect x={70} y={30} width={60} height={30} fill={NEON.tower} stroke={NEON.ink} strokeWidth={3} />
      <circle cx={34} cy={80} r={8} fill={NEON.chromeRed} />
      <path d="M24 70 L-10 64" stroke={NEON.chrome} strokeWidth={8} />
    </g>
  )
}

const ROCKETS = [0, 1, 2]

const walkerAt = ({ phone }: Layout): number => (phone ? 930 : 1300)

const bands: SceneDef = {
  district: 'lanterns',
  kit: 'engineer',
  back: (layout) => (
    <g data-fx="walker" transform={`translate(${walkerAt(layout)} ${GROUND}) scale(${layout.phone ? WALKER_K * 0.7 : WALKER_K})`}>
      <Walker />
    </g>
  ),
  front: () => (
    <>
      {ROCKETS.map((i) => (
        <rect key={i} data-fx={`rocket-${i}`} x={-14} y={-4} width={28} height={8} fill={NEON.hud} stroke={NEON.ink} strokeWidth={2} opacity={0} />
      ))}
      <rect data-fx="spark" x={-26} y={-26} width={52} height={52} fill="none" stroke={NEON.hud} strokeWidth={4} transform="rotate(45)" opacity={0} />
      <rect data-fx="slow" x={-1600} y={-900} width={4800} height={2700} fill={NEON.void} opacity={0} />
    </>
  ),
  bind: withCity((stage, layout) => {
    const { count, cx, phone } = layout
    const scale = phone ? WALKER_K * 0.7 : WALKER_K
    const wx = walkerAt(layout)
    const start = phone ? 660 : 880
    const knee: readonly [number, number] = [wx - 70 * scale, GROUND - 50 * scale]
    const gun: readonly [number, number] = [wx - 110 * scale, GROUND - 156 * scale]
    const walker = fx(stage, 'walker')
    const rockets = fxs(stage, 'rocket', ROCKETS.length)
    const spark = fx(stage, 'spark')
    const slow = fx(stage, 'slow')
    const camera = fx(stage, 'camera')
    return (p, f) => {
      const { at, run: back, act } = beatOf(f, count, 0.25)
      transformTo(camera, focusOn(cx, GROUND, lerp(1, 0.86, ramp(f, 0, 0.4))))
      const kneel = ramp(p, 0.62, 0.78)
      transformTo(walker, `translate(${wx} ${r1(GROUND + 40 * kneel)}) rotate(${r1(-6 * kneel)}) scale(${scale})`)
      const fly = ramp(act, 0, 0.45)
      rockets.forEach((rocket, i) => {
        const tx = lerp(gun[0], start - 40 + 50 * i, fly)
        const ty = lerp(gun[1], GROUND - 60, fly) - hop(fly, 120)
        transformTo(rocket, `translate(${r1(tx)} ${r1(ty)}) rotate(${r1(lerp(10, 40, fly))})`)
        fadeTo(rocket, act > 0 && fly < 1 ? 1 : 0)
      })
      fadeTo(slow, 0.4 * ramp(act, 0.15, 0.25) * (1 - ramp(act, 0.6, 0.7)))
      const dash = ramp(act, 0.25, 0.6)
      const strike = ramp(act, 0.6, 0.85)
      transformTo(spark, `translate(${r1(knee[0])} ${r1(knee[1])}) rotate(45) scale(${(0.6 + strike).toFixed(3)})`)
      fadeTo(spark, strike > 0.5 ? 1 - ramp(strike, 0.9, 1) * 0.5 : 0)
      const reach = knee[0] - 60
      if (act > 0) return him(lerp(start, reach, dash), dash < 1 ? run(act * 6) : cut(strike))
      if (at === 0) return him(start, guard(1))
      return him(lerp(reach, start, back), LEAP, K, GROUND - hop(back, 140))
    }
  }),
}

// ---------------------------------------------------------------- Muay Thai: the duel

// The duelist facing him: a dark fighter with a chrome right arm and a red visor slit, fists up; feet on (0, 0).
function Duelist() {
  return (
    <g transform="translate(-25 -144)">
      <path d="M14 96 L24 96 L20 144 L8 144 Z M27 96 L37 96 L42 144 L30 144 Z" fill={NEON.ink} stroke={NEON.steel} strokeWidth={1.4} />
      <path d="M10 48 Q25 42 40 48 L42 98 L8 98 Z" fill={NEON.alley} stroke={NEON.steel} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M14 24 Q14 12 25 12 Q36 12 36 25 Q36 38 25 41 Q14 38 14 24 Z" fill={NEON.surface} stroke={NEON.steel} strokeWidth={1.4} />
      <path d="M14 23 H27" stroke={NEON.chromeRed} strokeWidth={2.6} />
      <path data-fx="duel-arm" d="M10 50 L-2 62 L2 72" fill="none" stroke={NEON.chrome} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={2} cy={74} r={5} fill={NEON.chrome} stroke={NEON.ink} strokeWidth={1.2} />
    </g>
  )
}

const muayThai: SceneDef = {
  district: 'slab',
  kit: 'fighter',
  back: NONE,
  front: () => (
    <g data-fx="duelist">
      <Duelist />
    </g>
  ),
  bind: withCity((stage, layout) => {
    const { count, cx, phone } = layout
    const x = phone ? cx - 70 : cx - 150
    const rival = phone ? cx + 90 : cx + 170
    const duelist = fx(stage, 'duelist')
    const camera = fx(stage, 'camera')
    return (_p, f) => {
      const { at, act } = beatOf(f, count)
      const last = at === count - 1
      const lunge = ramp(act, 0, 0.35) * (1 - ramp(act, 0.45, 0.6))
      const knocked = ramp(act, 0.55, 0.8)
      const down = last ? ramp(act, 0.6, 0.85) : 0
      transformTo(duelist, `translate(${r1(rival - 70 * lunge + 40 * knocked + 60 * down)} ${GROUND}) rotate(${r1(84 * down)}) scale(${K})`)
      const push = last ? ramp(act, 0.2, 0.6) : 0
      transformTo(camera, focusOn(rival, GROUND - 160, 1 + 0.2 * push))
      if (f <= 0) return him(x, guard(1))
      if (last) return him(x + 120 * ramp(act, 0.35, 0.6), act < 0.35 ? mix(deflect(1), WIND, ramp(act, 0.1, 0.35)) : cut(ramp(act, 0.35, 0.6)))
      const pose = act < 0.45 ? mix(guard(1), deflect(1), ramp(act, 0.2, 0.35)) : cut(ramp(act, 0.5, 0.75))
      return him(x, pose)
    }
  }),
}

// ---------------------------------------------------------------- Contact: the flying cab

const CAB_K = 2.4

// The flying cab in profile: the low body, its lit cabin glass, the yellow roof sign and the cyan thrusters
// under it. In its own 240 by 80 box.
function Cab() {
  return (
    <g>
      <path d="M6 50 L18 34 L70 30 L100 14 H160 L192 30 L234 36 L236 52 Z" fill={NEON.ink} stroke={NEON.data} strokeWidth={2} />
      <path d="M106 18 H156 L182 30 H96 Z" fill={NEON.data} fillOpacity={0.3} />
      <rect x={112} y={4} width={34} height={9} fill={NEON.hud} stroke={NEON.ink} strokeWidth={1.5} />
      <rect x={6} y={40} width={8} height={5} fill={NEON.chromeRed} />
      <rect x={226} y={38} width={10} height={5} fill={NEON.ice} />
      <g data-fx="thrust">
        <ellipse cx={50} cy={58} rx={26} ry={5} fill={NEON.data} opacity={0.7} />
        <ellipse cx={190} cy={58} rx={26} ry={5} fill={NEON.data} opacity={0.7} />
      </g>
    </g>
  )
}

const cabLeft = ({ cx }: Layout): number => cx - 60
const CAB_Y = GROUND - 70 * CAB_K

const contact: SceneDef = {
  district: 'outskirts',
  kit: null,
  back: NONE,
  front: (layout) => (
    <g data-fx="cab" transform={`translate(${r1(cabLeft(layout))} -400) scale(${CAB_K})`}>
      <Cab />
    </g>
  ),
  bind: (stage, layout) => {
    const cab = fx(stage, 'cab')
    const left = cabLeft(layout)
    const x = left - 50
    return (p) => {
      const down = trackEase(ramp(p, 0.08, 0.35))
      const away = ramp(p, 0.55, 0.95) ** 2
      transformTo(cab, `translate(${r1(left + 1300 * away)} ${r1(lerp(-400, CAB_Y, down) - 700 * away)}) scale(${CAB_K})`)
      const step = ramp(p, 0.4, 0.52)
      return him(x + 110 * step, mix(STAND, SIT, step), K, GROUND - 40 * step, 1 - step)
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

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: propLayout(items, BAND[phone ? 'phone' : 'wide'], phone), kit: def.kit ?? profession, slot }
}

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, aboutTags: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, aboutTags), profession, phone)),
  sceneOf('contact', null, NO_ITEMS, profession, phone),
]
