import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import type { Labels } from '@/lib/cv/labels'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { drop, hop } from '@/lib/motion/arc'
import { handAt, type ArmPivots } from '@/lib/motion/rigPose'
import { clamp01, fadeTo, fx, lerp, r1, transformTo, translateTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import type { District } from './city'
import { HeroFigure } from './figure'
import { NEON } from './palette'
import { CROUCH, DASH, GRAB, HOLD_LOW, LAUNCH, STAND, TUCK, aim, call, charge, drum, guard, heroJoints, knee, mix, parry, reach, roundhouse, setHeroPose, slash, sticksUp, walk, type HeroPose } from './pose'

// Each part of the page as one place of the neon city the world comes from, with the merc's own moves: the
// optics, the scanner and the quickhack, the takedown from cover, jacking into a port and breaching its code,
// the double jump, time slowed for a dash and the arm blade, the fixer's call, a club stage, a ring fight and
// the flying cab. Each place keeps its props at fixed places under a fixed camera, and plays a short script of
// one to three different actions the shared scene player moves through (src/lib/scroll/player.ts); every
// frame is a function of the playhead alone, so an action reads the same played backward, and the end frame
// is the one reduced motion shows.
// The hero: his optics light and a scan pulse runs across the street, then the arm blade folds out and he
// takes his guard. About: he raises his hand at the wall camera, the reticle closes and locks on it, then the
// hack's bar fills and the lens turns from red to cyan. Work: crouched behind the crates he lets a guard walk
// up and turn his back, then vaults the crates and takes him down by hand. Tech: he reaches a cable from his
// wrist into a door's port, the code grid lights cell by cell, the door unlocks and opens. Services: his legs
// charge, he jumps, jumps again off the air and lands on the overpass ledge. Projects: a drone aims, time
// slows and the street tints, then he dashes through with his afterimages behind him and cuts it down.
// Ventures: a call opens beside him, then a job marker drops on the highway out and he walks toward it.
// Bands: he counts the band in, then plays the fill as the sign flares and the lasers sweep. Muay Thai: he
// parries the chrome armed fighter's jab, then knees and kicks him down. Contact: the flying cab lands, he
// gets in and it lifts away.
//
// Nothing here copies the game: every person, sign and prop is drawn for this page, and nothing carries words.

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
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** The props behind him and in front of him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  front: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<HeroPose>
}

// The band the scenes play in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [820, 1380], phone: [640, 960] }

const K = 1.6
const NONE = (): ReactNode => null

/** Before the section arrives a scene shows its first frame. */
const START: Playhead = { action: 0, t: 0, done: false }

/** How far action `i` has played at `play`: all of it once a later one plays, `t` while it plays, none before. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** A bump from 0 up to 1 and back over [from, to] of t. */
const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

/** A place on the stage: `wide` right of the text column, `phone` inside the middle a phone shows (about x 530 to 1070). */
const place = ({ phone }: Layout, wide: number, onPhone: number): number => (phone ? onPhone : wide)

const him = (x: number, pose: HeroPose, k = K, y = GROUND, opacity = 1): HeroState => ({ x, y, k, pose, opacity })

// His chrome arm's joints in his viewBox (the origins in figure.module.css), for where his hand reaches.
const NEAR_ARM: ArmPivots = { shoulder: [51, 49], elbow: [51, 67], hand: [51, 88] }

/** His chrome hand on the stage in `state`. */
const handOf = ({ x, y, k, pose }: HeroState): readonly [number, number] => {
  const [hx, hy] = handAt(NEAR_ARM, pose.armLeft, pose.foreLeft)
  return [x + (hx - 52) * k, y + (hy - 144 + pose.rise) * k]
}

/** How many degrees above level a target at (tx, ty) stands from his shoulder at x. */
const upTo = (x: number, tx: number, ty: number): number => (Math.atan2(GROUND - 95 * K - ty, tx - x) * 180) / Math.PI

/** The city's own motions over the scene's script: the flying car crosses, one sign flickers. */
function cityWriter(stage: StageNodes, script: SceneScript): (play: Playhead) => void {
  const car = fx(stage, 'car')
  const flicker = fx(stage, 'flicker')
  return (play) => {
    const p = (Math.min(play.action, script.length - 1) + play.t) / script.length
    transformTo(car, `translate(${r1(-200 + 2000 * p)} ${r1(-40 * p)})`)
    fadeTo(flicker, Math.sin(p * 40) > 0.2 ? 1 : 0.35)
  }
}

/** A scene with the city moving round it: `script` and the bind that plays it. */
const withCity = (script: SceneScript, bind: (stage: StageNodes, layout: Layout) => (play: Playhead) => HeroState): Pick<SceneDef, 'script' | 'bind'> => ({
  script,
  bind: (stage, layout) => {
    const city = cityWriter(stage, script)
    const write = bind(stage, layout)
    return (_p, _f, play = START) => {
      city(play)
      return write(play)
    }
  },
})

// ---------------------------------------------------------------- the hero

// On a phone the hero's text takes the screen from under its first half, so he stands up on a fire escape
// landing over the street, where the hero shows him above the text.
const LANDING_Y = 700

function FireEscape() {
  return (
    <g>
      <path d={`M600 ${LANDING_Y} H1000 V${LANDING_Y + 14} H600 Z`} fill={NEON.steel} stroke={NEON.ink} strokeWidth={3} />
      <path d={`M600 ${LANDING_Y - 70} H1000 M620 ${LANDING_Y - 70} V${LANDING_Y} M980 ${LANDING_Y - 70} V${LANDING_Y}`} stroke={NEON.steel} strokeWidth={6} fill="none" />
      <path d={`M640 ${LANDING_Y + 14} L600 ${GROUND} M960 ${LANDING_Y + 14} L1000 ${GROUND}`} stroke={NEON.steel} strokeWidth={8} />
      <path d={`M600 ${LANDING_Y + 14} H1000`} stroke={NEON.data} strokeOpacity={0.6} strokeWidth={2} />
    </g>
  )
}

// The hero, under the overpass: his optics light and a scan pulse runs out over the street from his eye; then
// the arm blade folds out of his chrome forearm and he takes his guard.
const hero: SceneDef = {
  district: 'overpass',
  kit: null,
  back: ({ phone }) => (phone ? <FireEscape /> : null),
  front: () => <ellipse data-fx="pulse" rx={1} ry={1} fill="none" stroke={NEON.data} strokeWidth={4} opacity={0} />,
  ...withCity([1400, 1800], (stage, { phone }) => {
    const pulse = fx(stage, 'pulse')
    const [x, y, k] = phone ? [800, LANDING_Y, 1.7] : [1200, GROUND, 2.3]
    const eye: readonly [number, number] = [x + 7 * k, y - 121 * k]
    return (play) => {
      const lit = share(play, 0)
      const drawn = share(play, 1)
      const out = ramp(lit, 0.3, 1)
      pulse?.setAttribute('rx', r1(20 + 900 * out).toString())
      pulse?.setAttribute('ry', r1(8 + 260 * out).toString())
      translateTo(pulse, eye[0], eye[1])
      fadeTo(pulse, 0.8 * bell(lit, 0.25, 1))
      return him(x, { ...guard(drawn), optics: Math.max(ramp(lit, 0, 0.3), drawn) }, k, y)
    }
  }),
}

// ---------------------------------------------------------------- About: the hacked camera

/** Where the wall camera hangs: high on the lantern street, right of him. */
const cameraAt = (layout: Layout): readonly [number, number] => [place(layout, 1270, 920), place(layout, 320, 610)]

// A wall camera on its bracket, its lens toward him on the left: red while it watches, cyan once hacked.
function WallCamera() {
  return (
    <>
      <path d="M22 -60 V-8 M10 -8 H34" stroke={NEON.steel} strokeWidth={6} />
      <g data-fx="cam" transform="rotate(-20)">
        <path d="M-34 -14 H30 L36 -6 V10 H-34 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={3} />
        <circle cx={-34} cy={-2} r={10} fill={NEON.ink} />
        <circle cx={-34} cy={-2} r={6} fill={NEON.chromeRed} />
        <circle data-fx="lens" cx={-34} cy={-2} r={6} fill={NEON.data} opacity={0} />
      </g>
    </>
  )
}

// The scanner's reticle: four corner brackets that close in on what it locks, and the hack's bar under them.
function Reticle() {
  return (
    <g data-fx="reticle" opacity={0} fill="none" stroke={NEON.hud} strokeWidth={4}>
      {[0, 90, 180, 270].map((turn) => (
        <path key={turn} d="M-60 -36 V-60 H-36" transform={`rotate(${turn})`} />
      ))}
      <rect x={-50} y={74} width={100} height={10} stroke={NEON.hud} strokeWidth={2} />
      <rect data-fx="bar" x={-48} y={76} width={96} height={6} fill={NEON.data} stroke="none" transform="scale(0 1)" />
    </g>
  )
}

const about: SceneDef = {
  district: 'lanterns',
  kit: 'engineer',
  back: (layout) => {
    const [cx, cy] = cameraAt(layout)
    return (
      <>
        <rect data-fx="scan" x={-200} y={0} width={2000} height={1400} fill={NEON.hud} opacity={0} />
        <g transform={`translate(${cx} ${cy}) scale(1.4)`}>
          <WallCamera />
          <Reticle />
          <g data-fx="burst" opacity={0} fill={NEON.data}>
            <rect x={-70} y={-30} width={30} height={6} />
            <rect x={30} y={10} width={40} height={6} />
            <rect x={-20} y={30} width={24} height={6} />
          </g>
        </g>
      </>
    )
  },
  front: NONE,
  ...withCity([1800, 1800], (stage, layout) => {
    const x = place(layout, 980, 690)
    const [cx, cy] = cameraAt(layout)
    const up = upTo(x, cx, cy)
    const scan = fx(stage, 'scan')
    const reticle = fx(stage, 'reticle')
    const bar = fx(stage, 'bar')
    const cam = fx(stage, 'cam')
    const lens = fx(stage, 'lens')
    const burst = fx(stage, 'burst')
    return (play) => {
      const locked = share(play, 0)
      const hacked = share(play, 1)
      fadeTo(scan, 0.1 * ramp(locked, 0, 0.3) * (1 - ramp(hacked, 0.7, 1)))
      const close = ramp(locked, 0.3, 0.85)
      transformTo(reticle, `scale(${(2.2 - 1.2 * close).toFixed(3)})`)
      fadeTo(reticle, ramp(locked, 0.3, 0.45) * (1 - ramp(hacked, 0.8, 1)))
      transformTo(bar, `scale(${ramp(hacked, 0, 0.6).toFixed(3)} 1)`)
      const turned = ramp(hacked, 0.6, 0.75)
      fadeTo(lens, turned)
      transformTo(cam, `rotate(${r1(lerp(-20, 14, turned))})`)
      fadeTo(burst, bell(hacked, 0.58, 0.8))
      return him(x, aim(ramp(locked, 0, 0.35) * (1 - ramp(hacked, 0.8, 1)), up))
    }
  }),
}

// ---------------------------------------------------------------- Work: the takedown from cover

// A guard in his patrol armour in profile facing right: the helmet with its red visor slit on his neck, the
// plated chest, a rifle held across it, each leg turning at its hip for his walk; feet on (0, 0).
function Guard() {
  const edge = { stroke: NEON.chrome, strokeWidth: 1.4, strokeLinejoin: 'round' as const }
  return (
    <g transform="translate(-25 -144)">
      <g data-fx="guard-back">
        <path d="M20 92 L30 92 L29 138 L20 138 Z" fill={NEON.alley} {...edge} />
        <path d="M18 135 H30 Q37 137 37 144 H18 Z" fill={NEON.ink} {...edge} />
      </g>
      <path d="M21 38 H31 V48 H21 Z" fill={NEON.panel} {...edge} />
      <path d="M13 46 Q26 40 38 46 L39 98 L12 98 Z" fill={NEON.steel} {...edge} />
      <path d="M14 70 H38 M24 48 V96" stroke={NEON.ink} strokeWidth={1.4} />
      <g data-fx="guard-front">
        <path d="M22 92 L32 92 L31 138 L22 138 Z" fill={NEON.panel} {...edge} />
        <path d="M20 135 H32 Q39 137 39 144 H20 Z" fill={NEON.ink} {...edge} />
      </g>
      <path d="M15 22 Q15 8 26 8 Q35 8 37 20 L38 34 Q27 42 15 36 Z" fill={NEON.steel} {...edge} />
      <path d="M28 19 H38" stroke={NEON.chromeRed} strokeWidth={2.8} />
      <path d="M24 50 L30 68 L40 66" fill="none" stroke={NEON.steel} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 76 L50 64" stroke={NEON.chrome} strokeWidth={4.5} strokeLinecap="round" />
    </g>
  )
}

// The crates he waits behind: two stacked, taller than him crouched.
function Crates() {
  return (
    <g>
      <rect x={-64} y={-100} width={128} height={100} fill={NEON.panel} stroke={NEON.ink} strokeWidth={4} />
      <rect x={-52} y={-180} width={104} height={80} fill={NEON.panel} stroke={NEON.ink} strokeWidth={4} />
      <path d="M-64 -50 H64 M-52 -140 H52 M-64 -100 L64 0" stroke={NEON.steel} strokeWidth={3} />
      <path d="M-52 -176 H52" stroke={NEON.hud} strokeOpacity={0.5} strokeWidth={2} />
    </g>
  )
}

const WORK = { crate: 1030, stop: 1230, from: 1640, phone: { crate: 690, stop: 800, from: 1120 } }

const work: SceneDef = {
  district: 'slab',
  kit: 'engineer',
  back: NONE,
  front: (layout) => (
    <>
      <g data-fx="guard">
        <Guard />
      </g>
      <g transform={`translate(${place(layout, WORK.crate, WORK.phone.crate)} ${GROUND})`}>
        <Crates />
      </g>
    </>
  ),
  ...withCity([2000, 2200], (stage, layout) => {
    const crate = place(layout, WORK.crate, WORK.phone.crate)
    const stop = place(layout, WORK.stop, WORK.phone.stop)
    const from = place(layout, WORK.from, WORK.phone.from)
    const cover = crate - 120
    const behind = stop - 58
    const guardNode = fx(stage, 'guard')
    const legs = [fx(stage, 'guard-back'), fx(stage, 'guard-front')]
    return (play) => {
      const patrol = share(play, 0)
      const taken = share(play, 1)
      // the guard walks in facing left, stops, looks about, and turns his back to the crates
      const walked = ramp(patrol, 0, 0.6)
      const gx = lerp(from, stop, walked)
      const facing = patrol < 0.8 ? -1 : 1
      const stride = walked > 0 && walked < 1 ? Math.sin(walked * Math.PI * 7) : 0
      legs.forEach((leg, i) => transformTo(leg, `rotate(${r1((i ? 1 : -1) * 22 * stride)} 26 96)`))
      // he rises, vaults the crates, lands behind the guard and holds him; the guard sinks and goes down forward
      const rise = ramp(taken, 0, 0.15)
      const over = ramp(taken, 0.15, 0.45)
      const grab = ramp(taken, 0.45, 0.6)
      const slump = ramp(taken, 0.6, 1)
      transformTo(guardNode, `translate(${r1(gx + 30 * slump)} ${GROUND}) scale(${(facing * K).toFixed(2)} ${K}) rotate(${r1(84 * slump * slump)})`)
      if (over <= 0) return him(cover, mix(CROUCH, STAND, rise))
      if (over < 1) return him(lerp(cover, behind, over), TUCK, K, GROUND - hop(over, 260))
      return him(behind + 25 * slump, mix(mix(CROUCH, GRAB, grab), HOLD_LOW, slump))
    }
  }),
}

// ---------------------------------------------------------------- Tech stack: the breach

const TECH = { stand: 1000, door: 1250, phone: { stand: 660, door: 900 } }
const PORT_Y = GROUND - 150
const GRID = 4

// The door in the slab's wall: a heavy panel that slides up, its lock light, and the port beside it.
function Door({ portX }: { portX: number }) {
  return (
    <g>
      <rect x={-90} y={-300} width={180} height={300} fill={NEON.ink} stroke={NEON.steel} strokeWidth={6} />
      <g data-fx="door">
        <rect x={-84} y={-294} width={168} height={294} fill={NEON.panel} stroke={NEON.ink} strokeWidth={3} />
        <path d="M-84 -200 H84 M-84 -100 H84" stroke={NEON.steel} strokeWidth={4} />
        <rect x={-60} y={-260} width={120} height={8} fill={NEON.hud} fillOpacity={0.6} />
      </g>
      <rect x={-20} y={-326} width={40} height={14} fill={NEON.ink} stroke={NEON.steel} strokeWidth={2} />
      <rect data-fx="lock" x={-14} y={-322} width={28} height={6} fill={NEON.chromeRed} />
      <g transform={`translate(${portX} ${PORT_Y - GROUND})`}>
        <rect x={-14} y={-20} width={28} height={40} fill={NEON.ink} stroke={NEON.data} strokeWidth={3} />
        <rect data-fx="port" x={-6} y={-6} width={12} height={12} fill={NEON.chromeRed} />
      </g>
    </g>
  )
}

// The code grid over the port: four by four cells, each a pair of code bars, lit in the order the breach picks.
const PICKS = [
  [0, 1],
  [2, 1],
  [2, 3],
  [1, 3],
]

function CodeGrid() {
  return (
    <g data-fx="grid" opacity={0}>
      <rect x={-112} y={-112} width={224} height={224} fill={NEON.ink} fillOpacity={0.85} stroke={NEON.hud} strokeWidth={3} />
      <rect data-fx="band" x={-104} y={-104} width={208} height={48} fill={NEON.hud} fillOpacity={0.18} />
      {Array.from({ length: GRID * GRID }, (_, i) => {
        const col = i % GRID
        const row = Math.floor(i / GRID)
        return (
          <g key={i} transform={`translate(${-78 + col * 52} ${-78 + row * 52})`}>
            <rect x={-12} y={-6} width={10} height={12} fill={NEON.data} fillOpacity={0.55} />
            <rect x={2} y={-6} width={10} height={12} fill={NEON.data} fillOpacity={0.55} />
          </g>
        )
      })}
      {PICKS.map(([col, row], i) => (
        <rect key={i} data-fx={`pick-${i}`} x={-78 + col * 52 - 20} y={-78 + row * 52 - 18} width={40} height={36} fill="none" stroke={NEON.hack} strokeWidth={4} opacity={0} />
      ))}
    </g>
  )
}

const gridAt = (layout: Layout): readonly [number, number] => [place(layout, TECH.door - 40, TECH.phone.door - 40), place(layout, 380, 620)]

const tech: SceneDef = {
  district: 'slab',
  kit: 'engineer',
  back: (layout) => {
    const door = place(layout, TECH.door, TECH.phone.door)
    const [gx, gy] = gridAt(layout)
    return (
      <>
        <g transform={`translate(${door} ${GROUND})`}>
          <Door portX={place(layout, -150, -130)} />
        </g>
        <path data-fx="cable" d="M0 0" fill="none" stroke={NEON.data} strokeWidth={3} opacity={0} />
        <g transform={`translate(${gx} ${gy})`}>
          <CodeGrid />
        </g>
      </>
    )
  },
  front: NONE,
  ...withCity([1400, 1800, 1400], (stage, layout) => {
    const x = place(layout, TECH.stand, TECH.phone.stand)
    const portX = place(layout, TECH.door - 150, TECH.phone.door - 130)
    const cable = fx(stage, 'cable')
    const port = fx(stage, 'port')
    const grid = fx(stage, 'grid')
    const band = fx(stage, 'band')
    const picks = PICKS.map((_, i) => fx(stage, `pick-${i}`))
    const door = fx(stage, 'door')
    const lock = fx(stage, 'lock')
    return (play) => {
      const jacked = share(play, 0)
      const breached = share(play, 1)
      const open = share(play, 2)
      const arm = ramp(jacked, 0, 0.4) * (1 - ramp(open, 0.5, 0.9))
      const state = him(x, { ...reach(arm), optics: Math.max(arm, ramp(breached, 0, 0.1) * (1 - open)) })
      const [hx, hy] = handOf(state)
      const plug = ramp(jacked, 0.35, 0.8) * (1 - ramp(open, 0.3, 0.6))
      const ex = lerp(hx, portX, plug)
      const ey = lerp(hy, PORT_Y, plug)
      cable?.setAttribute('d', `M${r1(hx)} ${r1(hy)} Q${r1((hx + ex) / 2)} ${r1(Math.max(hy, ey) + 30 * plug)} ${r1(ex)} ${r1(ey)}`)
      fadeTo(cable, plug > 0 ? 1 : 0)
      port?.setAttribute('fill', open > 0.2 ? NEON.hack : jacked >= 0.8 ? NEON.hud : NEON.chromeRed)
      fadeTo(grid, ramp(jacked, 0.8, 1) * (1 - ramp(open, 0, 0.3)))
      // the breach picks a cell, then the next down its column, then along that row, row and column in turn
      const step = Math.min(PICKS.length - 1, Math.floor(breached * PICKS.length))
      const [col, row] = PICKS[step]
      transformTo(band, step % 2 === 0 ? `translate(0 ${-78 + row * 52 + 78})` : `translate(${-78 + col * 52 + 78} 0) rotate(90 -80 -80)`)
      picks.forEach((pick, i) => fadeTo(pick, clamp01(breached * PICKS.length - i)))
      lock?.setAttribute('fill', open > 0.15 ? NEON.hack : NEON.chromeRed)
      transformTo(door, `translate(0 ${r1(-280 * ramp(open, 0.3, 1))})`)
      fadeTo(door, 1 - ramp(open, 0.5, 1))
      return state
    }
  }),
}

// ---------------------------------------------------------------- Services: the double jump

const LEDGE = { x: 1180, y: 600, phone: { x: 860, y: 620 } }

// The overpass's edge he lands on: its deck, its rail and the lit strip under the lip.
function Ledge({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={520} height={40} fill={NEON.steel} stroke={NEON.ink} strokeWidth={4} />
      <path d={`M${x} ${y} H${x + 520}`} stroke={NEON.hud} strokeWidth={4} />
      <path d={`M${x} ${y + 44} H${x + 520}`} stroke={NEON.data} strokeOpacity={0.7} strokeWidth={3} />
      <path d={`M${x + 20} ${y} V${y - 40} H${x + 520} M${x + 120} ${y} V${y - 40} M${x + 220} ${y} V${y - 40}`} stroke={NEON.steel} strokeWidth={5} fill="none" />
      <rect x={x + 60} y={y + 40} width={44} height={GROUND - y - 40} fill={NEON.concrete} />
    </g>
  )
}

const services: SceneDef = {
  district: 'overpass',
  kit: 'engineer',
  back: (layout) => <Ledge x={place(layout, LEDGE.x, LEDGE.phone.x)} y={place(layout, LEDGE.y, LEDGE.phone.y)} />,
  front: () => <ellipse data-fx="burst" rx={40} ry={10} fill={NEON.data} fillOpacity={0.25} stroke={NEON.data} strokeWidth={6} opacity={0} />,
  ...withCity([1400, 2400], (stage, layout) => {
    const x0 = place(layout, 960, 680)
    const x1 = place(layout, LEDGE.x + 110, LEDGE.phone.x + 50)
    const top = place(layout, LEDGE.y, LEDGE.phone.y)
    const burst = fx(stage, 'burst')
    return (play) => {
      const wound = share(play, 0)
      const jumped = share(play, 1)
      if (jumped <= 0) return him(x0, charge(wound))
      // the first jump up to its top, the second off the air from there, then down onto the ledge
      const first = ramp(jumped, 0, 0.35)
      const second = ramp(jumped, 0.35, 0.8)
      const landed = ramp(jumped, 0.8, 1)
      const mid = lerp(x0, x1, 0.4)
      const peak = GROUND - 260
      const x = second > 0 ? lerp(mid, x1, second) : lerp(x0, mid, first)
      const y = second > 0 ? lerp(peak, top, second) - hop(second, 160) : GROUND - (GROUND - peak) * Math.sin((first * Math.PI) / 2)
      transformTo(burst, `translate(${r1(mid)} ${r1(peak + 10)}) scale(${(1 + 2 * ramp(second, 0, 0.4)).toFixed(3)})`)
      fadeTo(burst, bell(second, 0, 0.45))
      if (landed > 0) return him(x1, mix(CROUCH, STAND, landed), K, top)
      const air = second > 0 ? mix(LAUNCH, TUCK, ramp(second, 0, 0.4)) : mix({ ...charge(1), charge: 1 }, LAUNCH, ramp(first, 0, 0.3))
      return him(x, mix(air, CROUCH, ramp(second, 0.75, 1)), K, y)
    }
  }),
}

// ---------------------------------------------------------------- Projects: time slowed, the drone cut down

const DRONE = { x: 1290, y: 640, phone: { x: 930, y: 650 } }
const GHOSTS = 3

// A hover drone facing him: a dark hull, its rotor arms and the red eye of its gun, split in two halves that
// part when it is cut.
function Drone() {
  return (
    <g>
      <g data-fx="drone-top">
        <path d="M-60 -18 H-24 M24 -18 H60" stroke={NEON.steel} strokeWidth={5} />
        <ellipse cx={-48} cy={-24} rx={18} ry={4} fill={NEON.data} opacity={0.6} />
        <ellipse cx={48} cy={-24} rx={18} ry={4} fill={NEON.data} opacity={0.6} />
        <path d="M-30 -16 H30 L27 0 H-27 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={3} />
      </g>
      <g data-fx="drone-bottom">
        <path d="M-27 0 H27 L22 16 H-22 Z" fill={NEON.panel} stroke={NEON.ink} strokeWidth={3} />
        <circle cx={-14} cy={8} r={6} fill={NEON.chromeRed} />
      </g>
    </g>
  )
}

const projects: SceneDef = {
  district: 'slab',
  kit: 'engineer',
  back: () => (
    <>
      <rect data-fx="slow" x={-200} y={0} width={2000} height={1400} fill={NEON.data} opacity={0} />
      {Array.from({ length: GHOSTS }, (_, i) => (
        <g key={i} data-fx={`ghost-${i}`} opacity={0}>
          <svg x={-50} y={-144} width={100} height={150} viewBox="0 0 100 150" overflow="visible">
            <HeroFigure profession="engineer" motion="still" />
          </svg>
        </g>
      ))}
    </>
  ),
  front: (layout) => (
    <>
      <path data-fx="sight" d="M0 0" stroke={NEON.chromeRed} strokeWidth={2} opacity={0} />
      <circle data-fx="bolt" r={9} fill={NEON.hotPink} stroke={NEON.ice} strokeWidth={3} opacity={0} />
      <g data-fx="drone" transform={`translate(${place(layout, DRONE.x, DRONE.phone.x)} ${place(layout, DRONE.y, DRONE.phone.y)})`}>
        <Drone />
      </g>
      <path data-fx="cut" d="M-50 40 Q0 0 50 -50" fill="none" stroke={NEON.ice} strokeWidth={5} strokeLinecap="round" opacity={0} />
    </>
  ),
  ...withCity([1600, 2200], (stage, layout) => {
    const x0 = place(layout, 960, 670)
    const [dx, dy] = [place(layout, DRONE.x, DRONE.phone.x), place(layout, DRONE.y, DRONE.phone.y)]
    const x1 = dx - 100
    const slow = fx(stage, 'slow')
    const sight = fx(stage, 'sight')
    const bolt = fx(stage, 'bolt')
    const drone = fx(stage, 'drone')
    const top = fx(stage, 'drone-top')
    const bottom = fx(stage, 'drone-bottom')
    const cut = fx(stage, 'cut')
    const ghosts = Array.from({ length: GHOSTS }, (_, i) => fx(stage, `ghost-${i}`))
    const ghostJoints = ghosts.map((ghost) => ghost && heroJoints(ghost))
    const chest: readonly [number, number] = [x0 + 6 * K, GROUND - 80 * K]
    return (play) => {
      const aimed = share(play, 0)
      const dashed = share(play, 1)
      // the drone flies down into its hover, its sight finds his chest, it fires and time slows
      const flown = ramp(aimed, 0, 0.35)
      const fall = ramp(dashed, 0.55, 1)
      transformTo(drone, `translate(${r1(dx)} ${r1(dy - 260 * (1 - flown) + 6 * Math.sin(aimed * Math.PI * 3))})`)
      transformTo(top, `translate(${r1(-30 * fall)} ${r1(drop(fall, GROUND - 20 - dy))}) rotate(${r1(-40 * fall)})`)
      transformTo(bottom, `translate(${r1(30 * fall)} ${r1(drop(fall, GROUND - 10 - dy))}) rotate(${r1(30 * fall)})`)
      sight?.setAttribute('d', `M${r1(dx - 14)} ${r1(dy + 8)} L${r1(lerp(dx - 14, chest[0], ramp(aimed, 0.35, 0.6)))} ${r1(lerp(dy + 8, chest[1], ramp(aimed, 0.35, 0.6)))}`)
      fadeTo(sight, ramp(aimed, 0.35, 0.4) * (1 - ramp(aimed, 0.8, 0.9)))
      const shot = ramp(aimed, 0.7, 1) * 0.25 + 0.75 * ramp(dashed, 0, 1)
      translateTo(bolt, lerp(dx - 14, chest[0] - 60, shot), lerp(dy + 8, chest[1], shot))
      fadeTo(bolt, aimed > 0.7 && dashed < 1 ? 1 : 0)
      const slowed = ramp(aimed, 0.75, 1) * (1 - ramp(dashed, 0.75, 1))
      fadeTo(slow, 0.16 * slowed)
      // he dashes through with the blade open, his afterimages left on the way, and cuts it at the end
      const ran = ramp(dashed, 0, 0.45)
      const swing = ramp(dashed, 0.4, 0.6)
      const x = lerp(x0, x1, ran)
      ghosts.forEach((ghost, i) => {
        const back = (i + 1) / (GHOSTS + 1)
        transformTo(ghost, `translate(${r1(lerp(x0, x, 1 - back))} ${GROUND}) scale(${K})`)
        fadeTo(ghost, 0.4 * (1 - back) * ramp(ran, 0, 0.25) * (1 - ramp(dashed, 0.6, 0.9)))
        const joints = ghostJoints[i]
        if (joints) setHeroPose(joints, DASH)
      })
      translateTo(cut, dx, dy)
      fadeTo(cut, bell(dashed, 0.42, 0.7))
      const ready = { ...guard(ramp(aimed, 0.6, 0.9)), optics: Math.max(ramp(aimed, 0.4, 0.6), dashed < 1 ? 1 : 0) }
      if (dashed <= 0) return him(x0, ready)
      if (swing <= 0) return him(x, mix(ready, DASH, ramp(dashed, 0, 0.15)))
      return him(x, mix(slash(swing), guard(1), ramp(dashed, 0.7, 1)))
    }
  }),
}

// ---------------------------------------------------------------- Ventures: the call and the job

// The call beside his head: a lit frame that opens, a face's outline in it (nobody in particular) and the
// voice's bars.
function Holo() {
  return (
    <g data-fx="holo" opacity={0}>
      <rect x={-70} y={-80} width={140} height={160} fill={NEON.data} fillOpacity={0.12} stroke={NEON.data} strokeWidth={3} />
      <path d="M-30 30 Q-30 -6 0 -6 Q30 -6 30 30 Z M0 -10 A20 22 0 1 1 0.1 -10" fill={NEON.data} fillOpacity={0.45} />
      {[-48, -32, -16, 0, 16, 32, 48].map((bx, i) => (
        <rect key={bx} data-fx={`voice-${i}`} x={bx - 5} y={44} width={10} height={24} fill={NEON.hud} />
      ))}
    </g>
  )
}

// The job's marker over the highway out: a yellow diamond on a stem, its ring on the road.
function Marker() {
  return (
    <g data-fx="marker" opacity={0}>
      <ellipse cx={0} cy={0} rx={30} ry={8} fill="none" stroke={NEON.hud} strokeWidth={3} />
      <path d="M0 0 V-60" stroke={NEON.hud} strokeWidth={3} />
      <path d="M0 -110 L22 -84 L0 -58 L-22 -84 Z" fill={NEON.hud} stroke={NEON.ink} strokeWidth={3} />
      <path d="M0 -96 L10 -84 L0 -72 L-10 -84 Z" fill={NEON.ink} />
    </g>
  )
}

const VOICE = 7

const ventures: SceneDef = {
  district: 'outskirts',
  kit: 'engineer',
  back: (layout) => (
    <>
      <g transform={`translate(${place(layout, 1360, 930)} ${place(layout, 780, 790)})`}>
        <Marker />
      </g>
      <path data-fx="route" d="M0 0" fill="none" stroke={NEON.hud} strokeWidth={4} strokeDasharray="10 10" opacity={0} />
    </>
  ),
  front: (layout) => (
    <g transform={`translate(${place(layout, 1170, 860)} ${place(layout, 580, 560)})`}>
      <Holo />
    </g>
  ),
  ...withCity([1800, 1800], (stage, layout) => {
    const x0 = place(layout, 960, 680)
    const markX = place(layout, 1360, 930)
    const markY = place(layout, 780, 790)
    const holo = fx(stage, 'holo')
    const voice = Array.from({ length: VOICE }, (_, i) => fx(stage, `voice-${i}`))
    const marker = fx(stage, 'marker')
    const route = fx(stage, 'route')
    return (play) => {
      const called = share(play, 0)
      const set = share(play, 1)
      const shown = ramp(called, 0.15, 0.35) * (1 - ramp(set, 0, 0.2))
      fadeTo(holo, shown)
      transformTo(holo, `scale(1 ${shown.toFixed(3)})`)
      voice.forEach((bar, i) => transformTo(bar, `translate(0 56) scale(1 ${(0.25 + 0.75 * Math.abs(Math.sin(called * 14 + i * 1.3))).toFixed(3)}) translate(0 -56)`))
      const pinned = ramp(set, 0.15, 0.45)
      transformTo(marker, `translate(0 ${r1(-120 * (1 - pinned))})`)
      fadeTo(marker, pinned)
      const walked = ramp(set, 0.45, 1)
      const x = x0 + 90 * walked
      route?.setAttribute('d', `M${r1(x + 40)} ${GROUND} Q${r1((x + markX) / 2)} ${r1(GROUND - 20)} ${r1(markX)} ${r1(markY)}`)
      fadeTo(route, ramp(set, 0.3, 0.5))
      const pose = called < 1 || set <= 0 ? call(ramp(called, 0, 0.25)) : walked > 0 && walked < 1 ? walk(walked * 3) : mix(call(1), STAND, ramp(set, 0, 0.3))
      return him(x, { ...pose, optics: Math.max(ramp(called, 0, 0.2) * (1 - ramp(set, 0.8, 1)), pose.optics) })
    }
  }),
}

// ---------------------------------------------------------------- Bands: the club stage

/** The stage's riser top, where he and his kit stand. */
const RISER = GROUND - 30

// The stage: the riser, the holo sign over it (a ring and bars, no words), two laser beams, the crash cymbal
// and the bass drum before him.
function ClubBack({ x }: { x: number }) {
  return (
    <g>
      <g data-fx="sign" opacity={0.4}>
        <circle cx={x} cy={360} r={70} fill="none" stroke={NEON.hud} strokeWidth={8} />
        <rect x={x - 110} y={450} width={220} height={12} fill={NEON.magenta} />
        <rect x={x - 80} y={472} width={160} height={8} fill={NEON.data} />
      </g>
      <polygon data-fx="laser-0" points={`${x - 300},300 ${x - 290},300 ${x - 120},${GROUND} ${x - 180},${GROUND}`} fill={NEON.data} opacity={0} />
      <polygon data-fx="laser-1" points={`${x + 300},300 ${x + 310},300 ${x + 200},${GROUND} ${x + 140},${GROUND}`} fill={NEON.magenta} opacity={0} />
      <rect x={x - 260} y={RISER} width={520} height={GROUND - RISER} fill={NEON.panel} stroke={NEON.ink} strokeWidth={3} />
      <path d={`M${x - 260} ${RISER} H${x + 260}`} stroke={NEON.hud} strokeWidth={3} />
      <path d={`M${x + 90} ${RISER} V${GROUND - 230}`} stroke={NEON.chrome} strokeWidth={4} />
      <ellipse data-fx="crash" cx={x + 90} cy={GROUND - 230} rx={50} ry={8} fill={NEON.gold} fillOpacity={0.85} />
    </g>
  )
}

function BassDrum({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x + 40} cy={RISER - 46} r={46} fill={NEON.ink} stroke={NEON.chrome} strokeWidth={4} />
      <circle data-fx="kick" cx={x + 40} cy={RISER - 46} r={26} fill="none" stroke={NEON.hud} strokeWidth={5} opacity={0.6} />
    </g>
  )
}

const bandX = (layout: Layout): number => place(layout, 1150, 800)

const bands: SceneDef = {
  district: 'lanterns',
  kit: 'drummer',
  back: (layout) => <ClubBack x={bandX(layout)} />,
  front: (layout) => <BassDrum x={bandX(layout)} />,
  ...withCity([1400, 2400], (stage, layout) => {
    const x = bandX(layout) - 80
    const sign = fx(stage, 'sign')
    const lasers = [fx(stage, 'laser-0'), fx(stage, 'laser-1')]
    const crash = fx(stage, 'crash')
    const kick = fx(stage, 'kick')
    const cx = bandX(layout)
    return (play) => {
      const counted = share(play, 0)
      const fill = share(play, 1)
      const clicks = Math.abs(Math.sin(counted * Math.PI * 4))
      fadeTo(sign, 0.4 + 0.6 * ramp(fill, 0, 0.2) - 0.25 * bell(fill, 0.5, 0.6))
      lasers.forEach((laser, i) => {
        transformTo(laser, `rotate(${r1((i ? -1 : 1) * 24 * Math.sin(fill * Math.PI * 2))} ${cx + (i ? 300 : -300)} 300)`)
        fadeTo(laser, 0.3 * ramp(fill, 0.05, 0.2))
      })
      const hit = ramp(fill, 0.88, 0.95)
      transformTo(crash, `rotate(${r1(12 * hit * (1 - ramp(fill, 0.95, 1) * 0.5))} ${cx + 90} ${GROUND - 230})`)
      fadeTo(kick, 0.6 + 0.4 * Math.abs(Math.sin(fill * Math.PI * 8)))
      const up = ramp(counted, 0, 0.3)
      if (fill <= 0) return him(x, sticksUp(up, clicks), K, RISER)
      const roll = drum(fill * 10)
      return him(x, fill < 0.88 ? mix(sticksUp(1, 0), roll, ramp(fill, 0, 0.1)) : mix(roll, sticksUp(0.7, 0), hit), K, RISER)
    }
  }),
}

// ---------------------------------------------------------------- Muay Thai: the ring fight

// The fighter facing him: a dark fighter with a chrome right arm and a red visor slit, fists up; his jab
// arm reaches out; feet on (0, 0).
function Duelist() {
  return (
    <g transform="translate(-25 -144)">
      <path d="M22 96 L30 96 L36 144 L26 144 Z M16 96 L24 96 L16 144 L6 144 Z" fill={NEON.ink} stroke={NEON.steel} strokeWidth={1.4} />
      <path d="M12 48 Q25 42 38 48 L38 98 L12 98 Z" fill={NEON.alley} stroke={NEON.steel} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M14 24 Q14 12 25 12 Q36 12 36 25 Q36 38 25 41 Q14 38 14 24 Z" fill={NEON.surface} stroke={NEON.steel} strokeWidth={1.4} />
      <path d="M13 23 H24" stroke={NEON.chromeRed} strokeWidth={2.6} />
      <path d="M30 52 L22 62 L14 46" fill="none" stroke={NEON.alley} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <g data-fx="jab">
        <path d="M18 52 L6 62 L2 46" fill="none" stroke={NEON.chrome} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={2} cy={44} r={5} fill={NEON.chrome} stroke={NEON.ink} strokeWidth={1.2} />
      </g>
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
  ...withCity([1400, 2400], (stage, layout) => {
    const x = place(layout, 1000, 680)
    const rival = place(layout, 1150, 830)
    const duelist = fx(stage, 'duelist')
    const jab = fx(stage, 'jab')
    return (play) => {
      const parried = share(play, 0)
      const finished = share(play, 1)
      const thrown = bell(parried, 0.1, 0.7)
      transformTo(jab, `translate(${r1(-22 * thrown)} ${r1(10 * thrown)})`)
      const kneed = bell(finished, 0, 0.4)
      const kicked = bell(finished, 0.4, 0.8)
      const down = ramp(finished, 0.6, 0.95)
      transformTo(duelist, `translate(${r1(rival + 14 * kneed + 30 * down)} ${GROUND}) rotate(${r1(80 * down)}) scale(${K})`)
      if (finished <= 0) return him(x, parry(bell(parried, 0.15, 0.75)))
      if (finished < 0.4) return him(x, knee(kneed))
      return him(x, roundhouse(kicked))
    }
  }),
}

// ---------------------------------------------------------------- Contact: the flying cab

// The flying cab in profile: the low body, its lit cabin glass, the yellow roof light and the cyan thrusters
// under it, its door lifting open. In its own 240 by 80 box.
function Cab() {
  return (
    <g>
      <path d="M6 50 L18 34 L70 30 L100 14 H160 L192 30 L234 36 L236 52 Z" fill={NEON.ink} stroke={NEON.data} strokeWidth={2} />
      <path d="M106 18 H156 L182 30 H96 Z" fill={NEON.data} fillOpacity={0.3} />
      <rect x={112} y={4} width={34} height={9} fill={NEON.hud} stroke={NEON.ink} strokeWidth={1.5} />
      <rect x={6} y={40} width={8} height={5} fill={NEON.chromeRed} />
      <rect x={226} y={38} width={10} height={5} fill={NEON.ice} />
      <path data-fx="cab-door" d="M70 31 L100 15 H124 V48 H70 Z" fill={NEON.panel} stroke={NEON.data} strokeWidth={1.5} />
      <g data-fx="thrust">
        <ellipse cx={50} cy={58} rx={26} ry={5} fill={NEON.data} opacity={0.7} />
        <ellipse cx={190} cy={58} rx={26} ry={5} fill={NEON.data} opacity={0.7} />
      </g>
    </g>
  )
}

const cabK = ({ phone }: Layout): number => (phone ? 1.4 : 2)
const cabLeft = (layout: Layout): number => place(layout, 1060, 700)

const contact: SceneDef = {
  district: 'outskirts',
  kit: null,
  back: NONE,
  front: (layout) => (
    <g data-fx="cab" transform={`translate(${r1(cabLeft(layout))} -400) scale(${cabK(layout)})`}>
      <Cab />
    </g>
  ),
  ...withCity([2000, 2200], (stage, layout) => {
    const cab = fx(stage, 'cab')
    const door = fx(stage, 'cab-door')
    const thrust = fx(stage, 'thrust')
    const k = cabK(layout)
    const left = cabLeft(layout)
    const parked = GROUND - 58 * k
    const x0 = place(layout, 940, 640)
    const doorX = left + 96 * k
    return (play) => {
      const landed = share(play, 0)
      const gone = share(play, 1)
      const down = ramp(landed, 0, 0.7)
      const away = ramp(gone, 0.5, 1) ** 2
      transformTo(cab, `translate(${r1(left + 1300 * away)} ${r1(lerp(-400, parked, 1 - (1 - down) ** 2) - 700 * away)}) scale(${k})`)
      const opened = ramp(landed, 0.75, 1) * (1 - ramp(gone, 0.35, 0.5))
      transformTo(door, `rotate(${r1(-70 * opened)} 70 31)`)
      fadeTo(thrust, 0.5 + 0.5 * (1 - ramp(landed, 0.6, 0.8)) + ramp(gone, 0.5, 0.6))
      const walked = ramp(gone, 0, 0.3)
      const inside = ramp(gone, 0.25, 0.4)
      return him(lerp(x0, doorX, walked), walked > 0 && walked < 1 ? walk(walked * 3) : STAND, K, GROUND, 1 - inside)
    }
  }),
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
