'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { mix } from '@/lib/motion/rigPose'
import { sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage, type StageLayer } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { AreaFront, AreaGround, AreaLayer, AreaMid, AreaSky, CANVAS_H, CANVAS_W, FLOOR_Y, Framing, type AreaName } from './areas'
import {
  Beam,
  Bed,
  BladeFighter,
  Bench,
  Boomerang,
  Chain,
  Champion,
  DenDoor,
  DenSleeper,
  Door,
  DoorInset,
  Duelist,
  FirePillar,
  Gate,
  Giant,
  GlassFloor,
  Hole,
  ImpactRing,
  Lantern,
  LeftCloak,
  Ledge,
  Lighthouse,
  Mage,
  Needle,
  Orb,
  PoleWall,
  DoorLight,
  ShellGuard,
  Shockwave,
  Smoke,
  Stair,
  Tendril,
  Thief,
  VoidFountain,
  WellBack,
  WellFront,
  Web,
} from './foes'
import { DARK_FANTASY as P } from './palette'
import {
  AIR,
  BOUND,
  CLING,
  GUARD,
  KNEEL,
  REST,
  SIT,
  cast,
  charge,
  climb,
  dash,
  downStrike,
  greatSlash,
  looking,
  run,
  setWandererPose,
  slash,
  upStrike,
  wandererJoints,
  type WandererJoints,
  type WandererPose,
} from './pose'
import { WANDERER, WandererSprite } from './wanderer'
import world from './world.module.css'

// The wanderer's descent, one scene per part of the page, told in the game's order as his own (research
// 2026-11-24-deep-hollow-knight/notes.md; the concept, score/C62/dark-fantasy-concept.md): he crosses into a
// fading town and drops down its well (hero); in the stone crossroads a giant in stolen armour falls on him,
// breaks through the floor, and across the hall he sees the great door sealed by three marks (About); a
// duelist in the overgrowth kills him once, and he must cut the dark copy he left where he fell before he can
// win (Work); he reads the blades of a village and the gate opens (Tech Stack); a mage breaks his own glass
// floor under them both (Services); at the top of a spire he strikes the first sleeper's dream and far below
// the first mark goes dark (Projects); a bench in the deep tunnels is a trap, and the last sleeper's marks go
// dark (Ventures). The drummer's descent is the abyss of the shells he came from (Bands), the fighter's the
// chained champion in the temple (Muay Thai). At the contact the door breaks open on the light, he climbs it
// and lands one blow, and the dark takes it back.
//
// Every scene is its own area (areas.tsx) with its own threat and his answer in one to three actions, played by
// the shared scene player (src/lib/scroll/player.ts) at its own pace, back on the way up, the end frame held.
// He is the rigged side on figure (wanderer.tsx, posed by pose.ts), drawn once per scene.

export type SceneId = 'hero' | SectionId | 'contact'

/** Each layer's push in across its scene: the sky moves least, the dark in front most, for the depth. */
export const AREA_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.03], lift: [0, 0] },
  mid: { zoom: [1.01, 1.05], lift: [0, -1] },
  near: { zoom: [1.02, 1.06], lift: [0, -1] },
  figure: { zoom: [1.02, 1.06], lift: [0, -1] },
  fg: { zoom: [1.04, 1.1], lift: [1, -2] },
}

// His scale on the canvas, small against the places the way the game frames its traveller, and the middle of
// his body above his soles.
const SCALE = 2
const BOX = { width: WANDERER.width * SCALE, height: WANDERER.height * SCALE }
const BODY_UP = (WANDERER.soleY - WANDERER.bodyY) * SCALE

/** How far action `i` has played: all of it before, its eased share while it plays, none after. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** The point `t` of the way along a jump from (x0, lift0) to (x1, lift1) rising `height` over the straight line. */
const arc = (t: number, [x0, y0]: readonly [number, number], [x1, y1]: readonly [number, number], height: number): { x: number; lift: number } => ({
  x: lerp(x0, x1, t),
  lift: lerp(y0, y1, t) + 4 * height * t * (1 - t),
})

// ---- him ----

/** Where he is: his soles' x, how high he is off the floor, his facing and his whole figure's turn about his middle. */
interface Spot {
  x: number
  lift?: number
  face?: 1 | -1
  turn?: number
}

const placeOf = ({ x, lift = 0, face = 1, turn = 0 }: Spot): string =>
  `translate(${r1(x)} ${r1(FLOOR_Y - lift)}) scale(${face} 1) rotate(${r1(turn)} 0 ${r1(-BODY_UP)}) translate(${r1(-WANDERER.soleX * SCALE)} ${r1(-WANDERER.soleY * SCALE)})`

interface Him {
  root: Element | null
  joints: WandererJoints | null
}

const himIn = (stage: ParentNode): Him => {
  const root = fx(stage, 'wanderer')
  return { root, joints: root ? wandererJoints(root) : null }
}

const poseHim = ({ root, joints }: Him, spot: Spot, pose: WandererPose): void => {
  transformTo(root, placeOf(spot))
  if (joints) setWandererPose(joints, pose, spot.lift)
}

/** The wanderer, the one figure of every scene; the hero's is the world's figure. */
function Wanderer({ x, lift = 0, face = 1, figure = false }: Spot & { figure?: boolean }) {
  return (
    <g data-fx="wanderer" transform={placeOf({ x, lift, face })}>
      <WandererSprite box={BOX} figure={figure} />
    </g>
  )
}

/** A piece standing on the floor at `x`, `lift` above it, facing left unless `face` turns it. */
const at = (x: number, lift = 0, face: 1 | -1 = 1): string => `translate(${r1(x)} ${r1(FLOOR_Y - lift)}) scale(${face} 1)`

/** A burst of light where a struck thing breaks, in white or the infection's orange. */
function Burst({ name, color = P.soulBlue }: { name: string; color?: string }) {
  return (
    <g data-fx={name} opacity="0">
      <circle r="70" fill={color} opacity="0.35" />
      <circle r="34" fill={P.white} opacity="0.7" />
    </g>
  )
}

const burstAt = (node: Element | null, x: number, y: number, shown: number): void => {
  transformTo(node, `translate(${r1(x)} ${r1(y)}) scale(${(0.5 + shown).toFixed(3)})`)
  fadeTo(node, shown)
}

/** A full canvas of one colour over the scene, hidden until a scene fades it in ([data-fx="{name}"]). */
function Veil({ name, color = P.black }: { name: string; color?: string }) {
  return <rect data-fx={name} x={-600} y={0} width={CANVAS_W + 1200} height={CANVAS_H} fill={color} opacity="0" />
}

/** How far down the canvas the far door's small frame hangs: clear of the bars and notices along the top. */
const INSET_Y = 340

/** The door's marks, `dark` of them gone out from the first, the rest lit. */
const marksTo = (stage: ParentNode, name: string, lit: readonly number[]): void => lit.forEach((on, i) => fadeTo(fx(stage, `${name}-mark-${i}`), on))

// ---- the scenes ----

interface SceneSpec {
  area: AreaName
  /** The canvas x a narrow screen centres on: where the scene plays. */
  phoneX: number
  /** How much smaller what stands in the scene is drawn on a narrow screen, about the floor at phoneX, so he
   *  and the one he meets are whole there; none keeps the wide screen's size. */
  phoneZoom?: number
  /** Each action's wished length in ms. */
  script: SceneScript
  /** What stands in the scene and he, drawn for a screen narrower than lg when `narrow`. */
  figure: (narrow: boolean) => ReactNode
  bind: (stage: HTMLElement) => (play: Playhead) => void
}

// ---- the hero: the town above, and the well ----

const WELL_X = 1380
// He stands by the bench at first paint, in full view at 1440 and on a phone, and walks the few steps to the rim.
const TOWN = { from: 1650, rim: 1480, mouth: 64 }
const WELL_CUT = 'df-well-cut'

const hero: SceneSpec = {
  area: 'town',
  phoneX: 1470,
  script: [1300, 1200, 2400],
  figure: () => (
    <>
      <defs>
        {/* the inside of the well's mouth hides him as he drops into it */}
        <clipPath id={WELL_CUT}>
          <path clipRule="evenodd" d={`M-600 -200 H2600 V1300 H-600 Z M${WELL_X - 86} ${FLOOR_Y - TOWN.mouth} H${WELL_X + 86} V1300 H${WELL_X - 86} Z`} />
        </clipPath>
      </defs>
      <g transform={at(1560)}>
        <Bench />
      </g>
      <g transform={at(WELL_X)}>
        <WellBack />
        <WellFront />
      </g>
      {/* under the town: the dark of the shaft, the well's mouth a disc of grey light far above */}
      <g data-fx="below" opacity="0">
        <rect x={-600} width={CANVAS_W + 1200} height={CANVAS_H} fill={P.black} />
        <path d={`M${WELL_X - 100} 210 L${WELL_X - 260} ${CANVAS_H} H${WELL_X + 260} L${WELL_X + 100} 210 Z`} fill={P.dustDark} opacity="0.08" />
        <ellipse cx={WELL_X} cy={200} rx={180} ry={60} fill={P.dustDark} opacity="0.2" />
        <ellipse cx={WELL_X} cy={200} rx={110} ry={28} fill={P.dust} />
      </g>
      {/* clipped only while he sinks through the mouth (bind), so he is a plain figure the rest of the scene */}
      <g data-fx="well-cut">
        <Wanderer x={TOWN.from} face={-1} figure />
      </g>
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const below = fx(stage, 'below')
    const cut = fx(stage, 'well-cut')
    return (play) => {
      const walked = share(play, 0)
      const paused = share(play, 1)
      const dropped = share(play, 2)
      fadeTo(below, ramp(dropped, 0.3, 0.42))
      const sinking = dropped > 0.04 && dropped <= 0.44
      if (cut && cut.hasAttribute('clip-path') !== sinking) {
        if (sinking) cut.setAttribute('clip-path', `url(#${WELL_CUT})`)
        else cut.removeAttribute('clip-path')
      }
      if (dropped > 0.44) {
        // in the shaft: falling, small under the disc of light, slowly turning over
        const fall = ramp(dropped, 0.44, 1)
        poseHim(him, { x: WELL_X, lift: lerp(620, 330, fall), face: -1, turn: 40 * fall }, AIR)
        return
      }
      if (dropped > 0) {
        const hop = ramp(dropped, 0.04, 0.2)
        const sink = ramp(dropped, 0.22, 0.36)
        const { x, lift } = arc(hop, [TOWN.rim, 0], [WELL_X, TOWN.mouth], 50)
        poseHim(him, { x, lift: lift - 300 * sink, face: -1 }, hop > 0 && hop < 1 ? AIR : sink > 0 ? AIR : looking(16))
        return
      }
      if (paused > 0) {
        poseHim(him, { x: TOWN.rim, face: -1 }, looking(16 * ramp(paused, 0.1, 0.5)))
        return
      }
      const step = ramp(walked, 0, 0.9)
      poseHim(him, { x: lerp(TOWN.from, TOWN.rim, step), face: -1 }, step > 0 && step < 1 ? run(2 * step) : REST)
    }
  },
}

// ---- About: the giant in stolen armour, and the door ----

const ABOUT = { him: 1260, strike: 1400, giant: 1720, fallen: 1640, slam: 1530, sink: 220, door: 1450 }
const FLOOR_CUT = 'df-floor-cut'

const about: SceneSpec = {
  area: 'crossroads',
  phoneX: 1550,
  phoneZoom: 0.6,
  script: [1600, 2000, 1400],
  figure: () => (
    <>
      <defs>
        {/* everything above the floor: the giant sinks through the hole he breaks */}
        <clipPath id={FLOOR_CUT}>
          <rect x={-600} y={-200} width={CANVAS_W + 1200} height={FLOOR_Y + 206} />
        </clipPath>
      </defs>
      {/* far back through the arch, the great door and its three marks */}
      <g transform={`translate(${ABOUT.door} ${FLOOR_Y - 190}) scale(0.55)`}>
        <Door name="door" />
      </g>
      <g data-fx="hole" opacity="0" transform={at(ABOUT.fallen)}>
        <Hole />
      </g>
      <g clipPath={`url(#${FLOOR_CUT})`}>
        <g data-fx="giant" transform={at(ABOUT.giant)}>
          <Giant />
        </g>
        <g data-fx="thief" opacity="0">
          <Thief />
        </g>
      </g>
      <g data-fx="wave" opacity="0">
        <Shockwave />
      </g>
      <Burst name="hit" color={P.infectedGlow} />
      <Wanderer x={ABOUT.him} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const giant = fx(stage, 'giant')
    const arm = fx(stage, 'giant-arm')
    const visor = fx(stage, 'giant-visor')
    const wave = fx(stage, 'wave')
    const hole = fx(stage, 'hole')
    const thief = fx(stage, 'thief')
    const hit = fx(stage, 'hit')
    return (play) => {
      const leapt = share(play, 0)
      const struck = share(play, 1)
      const looked = share(play, 2)
      // the mace raised, slammed down at his feet; the wave it sends runs left along the floor
      const raise = ramp(leapt, 0, 0.25) * (1 - ramp(leapt, 0.25, 0.35))
      transformTo(arm, `rotate(${r1(lerp(0, 70, raise) - 6 * ramp(leapt, 0.3, 0.35) * (1 - ramp(struck, 0, 0.2)))} -40 -250)`)
      const travel = ramp(leapt, 0.35, 0.9)
      transformTo(wave, `${at(lerp(ABOUT.slam, 900, travel))} scale(${(0.8 + 0.4 * bell(travel, 0, 1)).toFixed(3)})`)
      fadeTo(wave, travel > 0 && travel < 1 ? 1 - ramp(travel, 0.8, 1) : 0)
      // the stagger: the giant falls forward, the visor lifts on the face; struck twice it breaks through the floor
      const fall = ramp(struck, 0, 0.25)
      const sink = ramp(struck, 0.7, 0.9)
      transformTo(giant, `translate(${r1(lerp(ABOUT.giant, ABOUT.fallen, fall))} ${r1(FLOOR_Y + ABOUT.sink * sink)}) rotate(${r1(-26 * fall + 14 * sink)})`)
      transformTo(visor, `translate(0 ${r1(-60 * ramp(struck, 0.18, 0.3))})`)
      fadeTo(hole, ramp(struck, 0.68, 0.75))
      const fled = ramp(struck, 0.82, 1)
      const away = arc(fled, [ABOUT.fallen, 20], [1980, 0], 120)
      transformTo(thief, at(away.x, away.lift))
      fadeTo(thief, fled > 0 && fled < 1 ? 1 : 0)
      const blow = bell(struck, 0.38, 0.5) + bell(struck, 0.58, 0.7)
      burstAt(hit, ABOUT.fallen - 210, FLOOR_Y - 120, blow)
      // the door far back: its marks glow faintly, then bright as he turns to it
      marksTo(stage, 'door', [0, 1, 2].map(() => 0.35 + 0.65 * ramp(looked, 0.25, 0.8)))
      if (looked > 0) {
        poseHim(him, { x: ABOUT.strike }, looking(-16 * ramp(looked, 0.1, 0.5)))
        return
      }
      if (struck > 0) {
        const step = ramp(struck, 0.15, 0.3)
        const cut = struck < 0.5 ? slash(ramp(struck, 0.3, 0.5)) : slash(ramp(struck, 0.52, 0.72))
        poseHim(him, { x: lerp(ABOUT.him, ABOUT.strike, step) }, step > 0 && step < 1 ? run(3 * step) : cut)
        return
      }
      const jump = ramp(leapt, 0.46, 0.7)
      poseHim(him, { x: ABOUT.him, lift: arc(jump, [ABOUT.him, 0], [ABOUT.him, 0], 170).lift }, jump > 0 && jump < 1 ? AIR : mix(REST, GUARD, ramp(leapt, 0, 0.3)))
    }
  },
}

// ---- Work: the duelist, and the copy he leaves behind ----

const WORK = { bench: 1210, fell: 1440, duel: 1660, lunge: 1500, cut: 1330, needle: 1390, land: 1560, cloak: 1640 }
// Sat, his hips rest on the bench's seat: he is lifted by the seat's height less his hips' drop in the sit.
const SEAT_LIFT = 52 - (WANDERER.soleY - 95 - SIT.rise) * SCALE

const work: SceneSpec = {
  area: 'overgrowth',
  phoneX: 1465,
  phoneZoom: 0.72,
  script: [2000, 1400, 1600],
  figure: () => (
    <>
      <g transform={at(WORK.bench)}>
        <Bench />
      </g>
      <g data-fx="cloak" opacity="0" transform={at(WORK.cloak)}>
        <LeftCloak />
      </g>
      <g data-fx="copy" opacity="0" transform={placeOf({ x: WORK.fell })}>
        <WandererSprite box={BOX} shade />
      </g>
      <g data-fx="duelist" transform={at(WORK.duel)}>
        <Duelist />
      </g>
      <rect data-fx="thread" x={0} y={-1} width={1} height={2} fill={P.bone} opacity="0" />
      <g data-fx="needle" opacity="0">
        <Needle />
      </g>
      <g transform={`translate(${WORK.fell} ${FLOOR_Y - 90})`}>
        <Smoke name="smoke" />
      </g>
      <Burst name="reclaim" color={P.white} />
      <Burst name="hit" />
      <Wanderer x={WORK.fell} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const duelist = fx(stage, 'duelist')
    const held = fx(stage, 'duelist-needle')
    const needle = fx(stage, 'needle')
    const thread = fx(stage, 'thread')
    const smoke = fx(stage, 'smoke')
    const copy = fx(stage, 'copy')
    const cloak = fx(stage, 'cloak')
    const reclaim = fx(stage, 'reclaim')
    const hit = fx(stage, 'hit')
    return (play) => {
      const fell = share(play, 0)
      const won = share(play, 1)
      const bounced = share(play, 2)
      // her lunge, back to her place; the needle thrown, pulled back; at the end she withdraws into the green
      const lunge = bell(fell, 0.12, 0.55)
      const gone = ramp(bounced, 0.78, 0.98)
      transformTo(duelist, `${at(lerp(WORK.duel, WORK.lunge, ramp(lunge, 0, 0.6)) + 260 * gone)} rotate(${r1(-14 * lunge)})`)
      fadeTo(duelist, 1 - gone)
      const flight = ramp(bounced, 0, 0.22)
      const thrown = flight > 0 && bounced < 0.42
      fadeTo(held, thrown ? 0 : 1)
      const tip = lerp(WORK.duel - 150, WORK.needle - 70, flight)
      transformTo(needle, `translate(${r1(tip)} ${FLOOR_Y - 34})`)
      fadeTo(needle, thrown ? 1 : 0)
      transformTo(thread, `translate(${r1(tip + 140)} ${FLOOR_Y - 34}) scale(${r1(Math.max(1, WORK.duel - 20 - tip - 140))} 1)`)
      fadeTo(thread, thrown ? 0.8 : 0)
      fadeTo(smoke, bell(fell, 0.24, 0.52))
      // the dark copy where he fell, holding what he lost, until he cuts it and the light flows back
      fadeTo(copy, ramp(fell, 0.6, 0.85) * (1 - ramp(won, 0.5, 0.7)))
      burstAt(reclaim, WORK.fell, FLOOR_Y - 100, bell(won, 0.5, 0.95))
      fadeTo(cloak, ramp(bounced, 0.8, 0.92))
      fadeTo(him.root, fell > 0 && won === 0 ? 1 - ramp(fell, 0.26, 0.32) + ramp(fell, 0.55, 0.65) : 1)
      if (bounced > 0) {
        const jump = ramp(bounced, 0.14, 0.32)
        const spring = ramp(bounced, 0.4, 0.78)
        burstAt(hit, WORK.duel - 30, FLOOR_Y - 210, bell(bounced, 0.62, 0.76))
        if (spring > 0) {
          const { x, lift } = arc(spring, [WORK.needle, 50], [WORK.land, 0], 300)
          poseHim(him, { x, lift }, spring < 1 ? downStrike(ramp(spring, 0.55, 0.9)) : mix(GUARD, REST, ramp(bounced, 0.85, 1)))
          return
        }
        const { x, lift } = arc(jump, [WORK.cut, 0], [WORK.needle, 50], 90)
        poseHim(him, { x, lift }, jump === 0 ? GUARD : jump < 1 ? AIR : downStrike(ramp(bounced, 0.32, 0.4)))
        return
      }
      if (won > 0) {
        const step = ramp(won, 0, 0.4)
        poseHim(him, { x: lerp(WORK.bench, WORK.cut, step) }, step < 1 ? run(5 * step) : { ...slash(ramp(won, 0.4, 0.75)), focus: 0.8 * bell(won, 0.6, 1) })
        return
      }
      if (fell > 0.5) {
        // awake at the bench: sat, then up on his feet
        const up = ramp(fell, 0.72, 0.88)
        poseHim(him, { x: WORK.bench, lift: SEAT_LIFT * (1 - up) }, mix(SIT, REST, up))
        return
      }
      poseHim(him, { x: WORK.fell }, GUARD)
    }
  },
}

// ---- Tech Stack: the blades of the village ----

const TECH = { wall: 1230, cling: 1264, him: 1330, aside: 1440, fighter: 1660, gate: 1740, second: 1790, drop: 1560 }
const CLING_LIFT = 210

const tech: SceneSpec = {
  area: 'village',
  phoneX: 1520,
  phoneZoom: 0.7,
  script: [1800, 1700, 1500],
  figure: () => (
    <>
      <g transform={at(TECH.gate)}>
        <Gate />
      </g>
      <g transform={at(TECH.wall)}>
        <PoleWall height={560} />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} data-fx={`fighter-${i}`} transform={at(TECH.fighter)}>
          <BladeFighter />
        </g>
      ))}
      <g data-fx="blade" opacity="0">
        <Boomerang />
      </g>
      <Burst name="hit" color={P.spore} />
      <Wanderer x={TECH.him} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const fighters = [0, 1, 2].map((i) => fx(stage, `fighter-${i}`))
    const blade = fx(stage, 'blade')
    const gateL = fx(stage, 'gate-l')
    const gateR = fx(stage, 'gate-r')
    const hit = fx(stage, 'hit')
    return (play) => {
      const clung = share(play, 0)
      const stepped = share(play, 1)
      const cut = share(play, 2)
      // the first throws its blade low along the floor, out and back
      const thrown = ramp(clung, 0.15, 0.85)
      transformTo(blade, `translate(${r1(TECH.fighter - 60 - 520 * Math.sin(Math.PI * thrown))} ${FLOOR_Y - 46}) rotate(${r1(1440 * thrown)})`)
      fadeTo(blade, thrown > 0 && thrown < 1 ? 1 : 0)
      // the second rises over him, hangs one beat, and drops blade first where he stood
      const rise = ramp(stepped, 0.1, 0.35)
      const drop = ramp(stepped, 0.6, 0.68)
      const over = arc(rise, [TECH.second, 0], [TECH.him, 360], 80)
      transformTo(fighters[1], `${at(over.x, over.lift * (1 - drop) + 8 * bell(stepped, 0.35, 0.6), -1)} rotate(${r1(-20 * drop)})`)
      // the third drops from above where he waits, and he cuts it as it lands
      const third = ramp(cut, 0, 0.25)
      transformTo(fighters[2], at(TECH.drop + 40, 700 * (1 - third)))
      fadeTo(fighters[2], (cut > 0 ? 1 : 0) * (1 - ramp(cut, 0.4, 0.55)))
      burstAt(hit, TECH.drop, FLOOR_Y - 140, bell(cut, 0.28, 0.48))
      const bow = ramp(cut, 0.45, 0.65)
      fadeTo(fighters[0], 1 - bow)
      fadeTo(fighters[1], (stepped > 0 || cut > 0 ? 1 : 0) * (1 - bow))
      transformTo(fighters[0], at(TECH.fighter + 60 * bow))
      // the gate swings open on the dark beyond
      const open = 1 - 0.88 * ramp(cut, 0.55, 0.95)
      transformTo(gateL, `translate(-150 0) scale(${open.toFixed(3)} 1) translate(150 0)`)
      transformTo(gateR, `translate(150 0) scale(${open.toFixed(3)} 1) translate(-150 0)`)
      if (cut > 0) {
        poseHim(him, { x: TECH.aside }, cut < 0.2 ? GUARD : slash(ramp(cut, 0.2, 0.5)))
        return
      }
      if (stepped > 0) {
        const down = ramp(stepped, 0, 0.15)
        const aside = ramp(stepped, 0.45, 0.6)
        if (down < 1) {
          poseHim(him, { x: lerp(TECH.cling, TECH.him, down), lift: CLING_LIFT * (1 - down) }, AIR)
          return
        }
        poseHim(him, { x: lerp(TECH.him, TECH.aside, aside) }, aside > 0 && aside < 1 ? run(3 * aside) : GUARD)
        return
      }
      const jump = ramp(clung, 0.2, 0.38)
      const { x, lift } = arc(jump, [TECH.him, 0], [TECH.cling, CLING_LIFT], 50)
      poseHim(him, { x, lift, face: jump > 0.5 ? -1 : 1 }, jump === 0 ? REST : jump < 1 ? AIR : CLING)
    }
  },
}

// ---- Services: the mage of the rain city ----

const CITY = { glass: 350, glassFrom: 1060, glassW: 800, him: 1240, wall: 1840, turn: 1720, back: 1300, mage: 1640, slam: 1440, dive: 1420 }
const SHARDS = 10
const ORBS = [0, 1]

const services: SceneSpec = {
  area: 'city',
  phoneX: 1460,
  script: [1900, 1600, 1500],
  figure: () => (
    <>
      <g transform={`translate(${CITY.glassFrom} ${FLOOR_Y - CITY.glass})`}>
        <GlassFloor width={CITY.glassW} shards={SHARDS} />
      </g>
      <g transform={at(CITY.dive)}>
        <ImpactRing name="ring" />
      </g>
      <g data-fx="mage" transform={at(CITY.mage, CITY.glass + 120)}>
        <Mage />
      </g>
      {ORBS.map((i) => (
        <g key={i} data-fx={`orb-${i}`} opacity="0">
          <Orb />
        </g>
      ))}
      <Burst name="pop-0" color={P.rain} />
      <Burst name="pop-1" color={P.rain} />
      <Burst name="hit" color={P.white} />
      <Wanderer x={CITY.him} lift={CITY.glass} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const mage = fx(stage, 'mage')
    const glass = fx(stage, 'glass')
    const shards = Array.from({ length: SHARDS }, (_, i) => fx(stage, `shard-${i}`))
    const orbs = ORBS.map((i) => fx(stage, `orb-${i}`))
    const pops = ORBS.map((i) => fx(stage, `pop-${i}`))
    const ring = fx(stage, 'ring')
    const hit = fx(stage, 'hit')
    // his x through the weave: to the wall, then back under the orbs
    const hisX = (t: number): number => (t < 0.45 ? lerp(CITY.him, CITY.turn, ramp(t, 0.1, 0.45)) : lerp(CITY.turn, CITY.back, ramp(t, 0.45, 0.58)))
    return (play) => {
      const wove = share(play, 0)
      const plunged = share(play, 1)
      const dove = share(play, 2)
      // the orbs follow him, overshoot when he turns and burst on the wall
      ORBS.forEach((i) => {
        const lag = 0.06 * (i + 1)
        const chase = lerp(CITY.mage - 40, hisX(Math.min(wove, 0.45) - lag), ramp(wove, 0.1, 0.45))
        const into = ramp(wove, 0.45, 0.6 + 0.06 * i)
        const x = lerp(chase, CITY.wall, into)
        transformTo(orbs[i], `translate(${r1(x)} ${r1(FLOOR_Y - CITY.glass - 150 - 40 * i)})`)
        fadeTo(orbs[i], wove > 0.06 && into < 1 ? 1 : 0)
        burstAt(pops[i], CITY.wall, FLOOR_Y - CITY.glass - 150 - 40 * i, bell(wove, 0.58 + 0.06 * i, 0.72 + 0.06 * i))
      })
      // the mage: gone, above him, the slam through the glass, both down; struck by the dive and gone
      const blink = bell(wove, 0.68, 0.86)
      const above = ramp(wove, 0.77, 0.78)
      const slam = ramp(plunged, 0.05, 0.22)
      const down = ramp(plunged, 0.3, 0.7)
      const mx = lerp(lerp(CITY.mage, CITY.back + 20, above), CITY.slam + 60, slam)
      const mLift = lerp(lerp(CITY.glass + 120, CITY.glass + 320, above), CITY.glass, slam) * (1 - down)
      transformTo(mage, `${at(mx, mLift)} scale(1 ${(1 - 0.5 * ramp(dove, 0.58, 0.85)).toFixed(3)})`)
      fadeTo(mage, (1 - blink) * (1 - ramp(dove, 0.6, 0.85)))
      // the glass gives and falls in shards round them
      const broke = ramp(plunged, 0.22, 0.26)
      fadeTo(glass, 1 - broke)
      shards.forEach((shard, i) => {
        const fall = ramp(plunged, 0.25 + 0.02 * (i % 4), 0.75)
        const x = (i + 0.5) * (CITY.glassW / SHARDS)
        transformTo(shard, `translate(${r1(x)} ${r1(8 + (CITY.glass - 14) * fall)}) rotate(${r1((i % 2 ? 1 : -1) * 70 * fall)})`)
        fadeTo(shard, broke)
      })
      fadeTo(ring, ramp(dove, 0.55, 0.62))
      burstAt(hit, CITY.dive + 40, FLOOR_Y - 60, bell(dove, 0.52, 0.8))
      if (dove > 0) {
        const up = ramp(dove, 0, 0.35)
        const drive = ramp(dove, 0.45, 0.56)
        if (drive > 0) {
          poseHim(him, { x: CITY.dive, lift: 440 * (1 - drive) }, drive < 1 ? downStrike(0.5) : mix(downStrike(1), GUARD, ramp(dove, 0.7, 1)))
          return
        }
        const { x, lift } = arc(up, [CITY.back, 0], [CITY.dive, 440], 60)
        poseHim(him, { x, lift }, up < 1 ? AIR : { ...AIR, focus: 0.6 * bell(dove, 0.35, 0.47) })
        return
      }
      if (plunged > 0) {
        poseHim(him, { x: CITY.back, lift: CITY.glass * (1 - down) }, down > 0 && down < 1 ? AIR : down === 1 ? GUARD : mix(GUARD, REST, bell(plunged, 0.1, 0.3)))
        return
      }
      const turned = wove >= 0.45
      const moving = (wove > 0.1 && wove < 0.45) || (wove > 0.45 && wove < 0.58)
      poseHim(him, { x: hisX(wove), lift: CITY.glass, face: turned ? -1 : 1 }, !moving ? GUARD : turned ? dash(ramp(wove, 0.45, 0.58), GUARD) : run(6 * ramp(wove, 0.1, 0.45)))
    }
  },
}

// ---- Projects: the tower of the first sleeper ----

const SPIRE = { wall: 1250, him: 1350, ball: 1500, stair: 1480, steps: 5, rise: 50, run: 40, top: 250, past: 1700, guard: 1660, bed: 1820 }
const stairTop = SPIRE.stair + SPIRE.steps * SPIRE.run

/** His lift on the spire's floor, stair and landing at `x`. */
const spireLift = (x: number): number => SPIRE.top * Math.min(1, Math.max(0, (x - SPIRE.stair) / (stairTop - SPIRE.stair)))

const projects: SceneSpec = {
  area: 'spire',
  phoneX: 1580,
  phoneZoom: 0.64,
  script: [1800, 1400, 1800],
  figure: () => (
    <>
      <rect x={SPIRE.wall - 140} y={-600} width={140} height={FLOOR_Y + 600} fill={P.stoneDark} stroke={P.black} strokeWidth={3} />
      <g transform={at(SPIRE.stair)}>
        <Stair steps={SPIRE.steps} rise={SPIRE.rise} run={SPIRE.run} />
      </g>
      <rect x={stairTop} y={FLOOR_Y - SPIRE.top} width={400} height={SPIRE.top} fill={P.stoneDark} stroke={P.black} strokeWidth={3} />
      <g transform={at(SPIRE.bed, SPIRE.top)}>
        <Bed name="sleeper" />
      </g>
      <g data-fx="g2" transform={at(SPIRE.guard + 220, SPIRE.top)}>
        <ShellGuard name="g2" curled />
      </g>
      <g data-fx="g1" transform={at(SPIRE.ball)}>
        <ShellGuard name="g1" curled />
      </g>
      <Burst name="hit" />
      <Wanderer x={SPIRE.him} />
      <g transform={`translate(${SPIRE.wall + 40} ${INSET_Y})`}>
        <DoorInset name="inset" />
      </g>
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const g1 = fx(stage, 'g1')
    const g1Spin = fx(stage, 'g1-spin')
    const g1Ball = fx(stage, 'g1-ball')
    const g1Open = fx(stage, 'g1-open')
    const g2Ball = fx(stage, 'g2-ball')
    const g2Open = fx(stage, 'g2-open')
    const dream = fx(stage, 'sleeper-dream')
    const inset = fx(stage, 'inset')
    const hit = fx(stage, 'hit')
    return (play) => {
      const jumped = share(play, 0)
      const climbed = share(play, 1)
      const pierced = share(play, 2)
      // the shell rolls at him, hits the wall, opens, and is struck
      const roll = ramp(jumped, 0.1, 0.5)
      const gx = lerp(SPIRE.ball, SPIRE.wall + 70, roll)
      transformTo(g1, at(gx))
      transformTo(g1Spin, `rotate(${r1(-360 * 2 * roll)} 0 -70)`)
      const opened = ramp(jumped, 0.55, 0.6)
      fadeTo(g1Ball, 1 - opened)
      fadeTo(g1Open, opened * (1 - ramp(jumped, 0.8, 0.92)))
      burstAt(hit, SPIRE.wall + 70, FLOOR_Y - 90, bell(jumped, 0.68, 0.86))
      // the next one on the landing uncurls only after he is past it
      const uncurl = ramp(climbed, 0.85, 1) + ramp(pierced, 0, 0.2)
      fadeTo(g2Ball, 1 - Math.min(1, uncurl))
      fadeTo(g2Open, Math.min(1, uncurl))
      fadeTo(dream, bell(pierced, 0.3, 0.75))
      fadeTo(inset, ramp(pierced, 0.5, 0.6))
      marksTo(stage, 'inset', [1 - 0.9 * ramp(pierced, 0.65, 0.85), 1, 1])
      if (pierced > 0) {
        const raised = ramp(pierced, 0, 0.3)
        const pose = pierced < 0.3 ? { ...mix(REST, cast(0.5), raised), focus: 0.5 * raised } : { ...slash(ramp(pierced, 0.3, 0.55)), focus: 0.5 * (1 - ramp(pierced, 0.4, 0.6)) }
        poseHim(him, { x: SPIRE.past, lift: SPIRE.top }, pose)
        return
      }
      if (climbed > 0) {
        const step = ramp(climbed, 0, 0.6)
        const hop = ramp(climbed, 0.6, 0.85)
        if (hop > 0) {
          const { x, lift } = arc(hop, [stairTop - 20, SPIRE.top], [SPIRE.past, SPIRE.top], 120)
          poseHim(him, { x, lift }, hop < 1 ? AIR : REST)
          return
        }
        const x = lerp(SPIRE.wall + 100, stairTop - 20, step)
        poseHim(him, { x, lift: spireLift(x) }, run(6 * step))
        return
      }
      const jump = ramp(jumped, 0.3, 0.5)
      const back = ramp(jumped, 0.5, 0.6)
      if (jumped >= 0.6) {
        poseHim(him, { x: SPIRE.wall + 100, face: -1 }, slash(ramp(jumped, 0.62, 0.86)))
        return
      }
      const { x, lift } = arc(jump, [SPIRE.him, 0], [SPIRE.him - 30, 0], 190)
      poseHim(him, { x: x - 30 * back, lift, face: back > 0.5 ? -1 : 1 }, jump > 0 && jump < 1 ? AIR : GUARD)
    }
  },
}

// ---- Ventures: the rest that was a trap ----

const DEEP = { from: 1220, bench: 1450, web: 1380, webLift: 430, kneel: 1500, sleeper: 1710 }
const DEEP_SEAT = 52 - (WANDERER.soleY - 95 - SIT.rise) * SCALE

const ventures: SceneSpec = {
  area: 'nest',
  phoneX: 1570,
  phoneZoom: 0.66,
  script: [1500, 1800, 1700],
  figure: () => (
    <>
      <g data-fx="village">
        <g transform={at(1150)}>
          <Lantern />
        </g>
        <g transform={at(1660)}>
          <DenDoor />
        </g>
        <g transform={at(1790)}>
          <Lantern />
        </g>
        <g transform={at(DEEP.bench)}>
          <Bench />
        </g>
      </g>
      <g data-fx="den" opacity="0">
        <g transform={`translate(${DEEP.web} ${FLOOR_Y - DEEP.webLift - 110})`}>
          <Web />
        </g>
        <g transform={at(DEEP.sleeper)}>
          <DenSleeper name="sleeper" />
        </g>
      </g>
      <Wanderer x={DEEP.from} />
      <Veil name="black" />
      <g transform={`translate(${DEEP.from + 40} ${INSET_Y})`}>
        <DoorInset name="inset" />
      </g>
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const village = fx(stage, 'village')
    const den = fx(stage, 'den')
    const wrap = fx(stage, 'wrap')
    const black = fx(stage, 'black')
    const dream = fx(stage, 'sleeper-dream')
    const inset = fx(stage, 'inset')
    return (play) => {
      const sat = share(play, 0)
      const torn = share(play, 1)
      const knelt = share(play, 2)
      const inDen = torn > 0 || knelt > 0
      fadeTo(village, inDen ? 0 : 1)
      fadeTo(den, inDen ? 1 : 0)
      fadeTo(black, inDen ? 1 - ramp(torn, 0.02, 0.22) : ramp(sat, 0.68, 0.9))
      fadeTo(wrap, 0.9 * (1 - ramp(torn, 0.5, 0.6)))
      fadeTo(dream, bell(knelt, 0.38, 0.85))
      fadeTo(inset, ramp(knelt, 0.55, 0.65))
      marksTo(stage, 'inset', [0.1, 1 - 0.9 * ramp(knelt, 0.68, 0.82), 1 - 0.9 * ramp(knelt, 0.76, 0.92)])
      if (knelt > 0) {
        const step = ramp(knelt, 0, 0.3)
        const pose = step < 1 ? run(4 * step) : knelt < 0.4 ? mix(GUARD, KNEEL, ramp(knelt, 0.3, 0.4)) : { ...slash(ramp(knelt, 0.4, 0.6), KNEEL), focus: 0.4 * bell(knelt, 0.4, 0.8) }
        poseHim(him, { x: lerp(DEEP.web, DEEP.kneel, step) }, pose)
        return
      }
      if (torn > 0) {
        const struggle = bell(torn, 0.22, 0.5)
        const drop = ramp(torn, 0.6, 0.82)
        const pose = torn < 0.5 ? BOUND : drop < 1 ? AIR : GUARD
        poseHim(him, { x: DEEP.web, lift: DEEP.webLift * (1 - drop), turn: 10 * struggle * Math.sin(torn * 40) }, pose)
        return
      }
      const step = ramp(sat, 0, 0.5)
      const down = ramp(sat, 0.5, 0.65)
      poseHim(him, { x: lerp(DEEP.from, DEEP.bench, step), lift: DEEP_SEAT * down }, step < 1 ? run(5 * step) : mix(REST, SIT, down))
    }
  },
}

// ---- Bands: the abyss he came from ----

const ABYSS = { from: 1120, edge: 1480, ladder: 1572, top: 430, fountain: 1290, house: 1640 }
const TENDRILS = [1240, 1380, 1520]
// The heap of shells with his own outline, at his feet: where each lies, its size and how it lies.
const HEAP = [
  { x: 1160, s: 0.55, turn: -80 },
  { x: 1230, s: 0.5, turn: 95 },
  { x: 1330, s: 0.6, turn: -100 },
  { x: 1420, s: 0.5, turn: 85 },
  { x: 1200, s: 0.45, turn: 20 },
  { x: 1380, s: 0.45, turn: -30 },
]

const bands: SceneSpec = {
  area: 'abyss',
  phoneX: 1420,
  script: [1700, 1700, 1600],
  figure: () => (
    <>
      <g data-fx="heap" opacity="0.55">
        {HEAP.map(({ x, s, turn }) => (
          <g key={`${x}${turn}`} transform={`translate(${x} ${FLOOR_Y + 4}) rotate(${turn}) scale(${s}) translate(${-WANDERER.soleX * SCALE} ${-WANDERER.soleY * SCALE})`}>
            <ellipse cx={WANDERER.soleX * SCALE} cy={WANDERER.bodyY * SCALE} rx={70} ry={110} fill={P.bone} opacity="0.18" />
            <WandererSprite box={BOX} shade />
          </g>
        ))}
      </g>
      <g transform={at(ABYSS.house)}>
        <Lighthouse />
      </g>
      <g transform={at(ABYSS.fountain)}>
        <VoidFountain />
      </g>
      {TENDRILS.map((x, i) => (
        <g key={x} transform={at(x)}>
          <Tendril name={`tendril-${i}`} />
        </g>
      ))}
      <Wanderer x={ABYSS.from} />
      <g transform={`translate(${ABYSS.from + 60} ${INSET_Y})`}>
        <DoorInset name="inset" />
      </g>
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const tendrils = TENDRILS.map((_, i) => fx(stage, `tendril-${i}`))
    const beam = fx(stage, 'beam')
    const lamp = fx(stage, 'lamp')
    const lever = fx(stage, 'switch')
    const heap = fx(stage, 'heap')
    const plume = fx(stage, 'plume')
    const inset = fx(stage, 'inset')
    return (play) => {
      const waded = share(play, 0)
      const lit = share(play, 1)
      const stood = share(play, 2)
      tendrils.forEach((node, i) => {
        const up = ramp(waded, 0.1 + 0.2 * i, 0.35 + 0.2 * i)
        transformTo(node, `rotate(${r1(6 * Math.sin(waded * 9 + i))}) scale(1 ${(up * (1 - 0.6 * ramp(lit, 0.7, 1))).toFixed(3)})`)
      })
      transformTo(lever, `rotate(${r1(lerp(-40, 40, ramp(lit, 0.62, 0.7)))} 40 -440)`)
      const on = ramp(lit, 0.68, 0.76)
      fadeTo(beam, on)
      fadeTo(lamp, 0.2 + 0.8 * on)
      transformTo(beam, `rotate(${r1(lerp(12, -18, ramp(lit, 0.7, 1)))} 0 -470)`)
      fadeTo(heap, 0.55 + 0.45 * on)
      transformTo(plume, `scale(1 ${(0.2 + 0.8 * ramp(stood, 0.42, 0.72)).toFixed(3)})`)
      fadeTo(inset, ramp(stood, 0.78, 0.86))
      marksTo(stage, 'inset', [0, 1, 2].map((i) => 1 - 0.9 * ramp(stood, 0.84 + 0.04 * i, 0.9 + 0.04 * i)))
      if (stood > 0) {
        const off = ramp(stood, 0, 0.28)
        if (off < 1) {
          const { x, lift } = arc(off, [ABYSS.ladder - 10, ABYSS.top], [ABYSS.edge - 60, 0], 40)
          poseHim(him, { x, lift, face: -1 }, AIR)
          return
        }
        const walk = ramp(stood, 0.3, 0.45)
        const onward = ramp(stood, 0.72, 0.92)
        const x = lerp(lerp(ABYSS.edge - 60, ABYSS.fountain, walk), ABYSS.fountain + 50, onward)
        const pose = walk < 1 ? run(4 * walk) : onward > 0 && onward < 1 ? run(2 * onward) : REST
        poseHim(him, { x, face: walk < 1 ? -1 : 1 }, { ...pose, shade: 0.7 * ramp(stood, 0.7, 0.85) })
        return
      }
      if (lit > 0) {
        const walk = ramp(lit, 0, 0.1)
        const up = ramp(lit, 0.1, 0.6)
        const pose = up === 0 ? run(2 * walk) : up < 1 ? climb(4 * up) : cast(bell(lit, 0.6, 0.75))
        poseHim(him, { x: lerp(ABYSS.edge, ABYSS.ladder - 10, walk), lift: ABYSS.top * up }, pose)
        return
      }
      const step = ramp(waded, 0, 0.85)
      poseHim(him, { x: lerp(ABYSS.from, ABYSS.edge, step) }, step > 0 && step < 1 ? run(6 * step) : REST)
    }
  },
}

// ---- Muay Thai: the chained champion ----

const TEMPLE = { him: 1300, cut: 1480, champion: 1640, hang: 140, left: 1350, right: 1460 }
const PILLARS = [
  { x: 1250, from: 0.05, to: 0.35 },
  { x: 1520, from: 0.25, to: 0.55 },
  { x: 1350, from: 0.58, to: 0.88 },
]

const muayThai: SceneSpec = {
  area: 'temple',
  phoneX: 1460,
  script: [1500, 1900, 1600],
  figure: () => (
    <>
      <g data-fx="chain" transform={`translate(${TEMPLE.champion + 10} ${FLOOR_Y - TEMPLE.hang - 300})`}>
        <Chain length={760} />
      </g>
      <g data-fx="champion" transform={at(TEMPLE.champion, TEMPLE.hang)}>
        <Champion />
      </g>
      {PILLARS.map(({ x }, i) => (
        <g key={x} transform={at(x)}>
          <FirePillar name={`pillar-${i}`} />
        </g>
      ))}
      <Burst name="hit" color={P.infectedGlow} />
      <Wanderer x={TEMPLE.him} />
      <g transform={`translate(${TEMPLE.him - 60} ${INSET_Y})`}>
        <DoorInset name="inset" />
      </g>
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const chain = fx(stage, 'chain')
    const champion = fx(stage, 'champion')
    const blade = fx(stage, 'champion-blade')
    const pillars = PILLARS.map((_, i) => fx(stage, `pillar-${i}`))
    const hit = fx(stage, 'hit')
    const inset = fx(stage, 'inset')
    return (play) => {
      const broke = share(play, 0)
      const slipped = share(play, 1)
      const finished = share(play, 2)
      // the last chain cut, the champion drops to its feet
      const snap = ramp(broke, 0.45, 0.6)
      transformTo(chain, `translate(${TEMPLE.champion + 10} ${r1(FLOOR_Y - TEMPLE.hang - 300 - 500 * snap)})`)
      fadeTo(chain, 1 - snap)
      const dropped = ramp(broke, 0.55, 0.7)
      const kneel = ramp(finished, 0.75, 1)
      transformTo(champion, `${at(TEMPLE.champion, TEMPLE.hang * (1 - dropped))} scale(1 ${(1 - 0.28 * kneel).toFixed(3)}) rotate(${r1(-10 * kneel)})`)
      // its blade: hung low, raised for the fire, held up in its parry, dropped as it kneels
      const parry = bell(finished, 0, 0.55)
      const bladeTurn = kneel > 0 ? lerp(0, 70, kneel) : lerp(lerp(25 * (1 - dropped), -20 * bell(slipped, 0, 1), dropped), 55, parry)
      transformTo(blade, `rotate(${r1(bladeTurn)} -50 -190)`)
      pillars.forEach((node, i) => {
        transformTo(node, `scale(1 ${bell(slipped, PILLARS[i].from, PILLARS[i].to).toFixed(3)})`)
      })
      burstAt(hit, TEMPLE.champion - 60, FLOOR_Y - 200, bell(broke, 0.4, 0.6) + bell(finished, 0.7, 0.9))
      fadeTo(inset, ramp(finished, 0.82, 0.88))
      marksTo(stage, 'inset', [0, 1, 2].map((i) => 1 - 0.9 * ramp(finished, 0.86 + 0.03 * i, 0.92 + 0.03 * i)))
      if (finished > 0) {
        const lunge = ramp(finished, 0.55, 0.85)
        const pose = finished < 0.55 ? mix(GUARD, REST, 0.3 * bell(finished, 0.15, 0.55)) : finished < 0.65 ? charge(ramp(finished, 0.55, 0.65)) : finished < 0.88 ? greatSlash(ramp(finished, 0.65, 0.88)) : GUARD
        poseHim(him, { x: lerp(TEMPLE.right, TEMPLE.right + 50, lunge) }, pose)
        return
      }
      if (slipped > 0) {
        const left = ramp(slipped, 0.12, 0.22)
        const right = ramp(slipped, 0.52, 0.6)
        const x = lerp(lerp(TEMPLE.cut - 40, TEMPLE.left, left), TEMPLE.right, right)
        const moving = (left > 0 && left < 1) || (right > 0 && right < 1)
        poseHim(him, { x, face: left > 0 && right === 0 && left < 1 ? -1 : 1 }, moving ? dash(left < 1 ? left : right, GUARD) : GUARD)
        return
      }
      const runIn = ramp(broke, 0, 0.3)
      const leap = ramp(broke, 0.3, 0.62)
      if (leap > 0) {
        const { x, lift } = arc(leap, [TEMPLE.cut, 0], [TEMPLE.cut - 40, 0], 150)
        poseHim(him, { x, lift }, leap < 1 ? upStrike(ramp(leap, 0.1, 0.7), AIR) : GUARD)
        return
      }
      poseHim(him, { x: lerp(TEMPLE.him, TEMPLE.cut, runIn) }, runIn > 0 && runIn < 1 ? run(5 * runIn) : GUARD)
    }
  },
}

// ---- the contact: the light behind the door ----

const LIGHT = { from: 1300, door: 1560, strike: 1580 }
const LEDGES = [
  { x: 1440, lift: 110 },
  { x: 1670, lift: 210 },
  { x: 1460, lift: 310 },
  { x: 1640, lift: 400 },
]
const TOP = LEDGES[LEDGES.length - 1]
// How far the camera follows him up the climb on a narrow screen: the top ledge ends just under the floor line, his head clear of the card.
const CAMERA_DROP = TOP.lift + 40

const contact: SceneSpec = {
  area: 'light',
  phoneX: 1560,
  script: [1600, 1900, 1500],
  // On a narrow screen the contact card stands over most of the screen by the climb's end, so the camera
  // follows him up and the top ledge ends low, in the band under the card.
  figure: (narrow) => (
    <g data-fx="camera" data-narrow={narrow ? '' : undefined}>
      <g data-fx="door-light" transform={`translate(${LIGHT.door - 60} 330) scale(0.6)`}>
        <DoorLight />
      </g>
      {LEDGES.slice(0, -1).map(({ x, lift }) => (
        <g key={x + lift} transform={at(x, lift)}>
          <Ledge />
        </g>
      ))}
      <g transform={at(1350, -60)}>
        <Beam name="beam-0" />
      </g>
      <g transform={at(1780, -60)}>
        <Beam name="beam-1" />
      </g>
      {/* the temple's dark round the door, until the door breaks on the light */}
      <g data-fx="shut">
        <rect x={-600} width={CANVAS_W + 1200} height={CANVAS_H} fill={P.void} />
      </g>
      <g data-fx="door" transform={`${at(LIGHT.door)} scale(1.1)`}>
        <Door name="door" />
      </g>
      <Burst name="flare" color={P.white} />
      {/* the dark rising behind him and swallowing the light */}
      <g data-fx="swallow">
        <rect x={-600} y={0} width={CANVAS_W + 1200} height={CANVAS_H + 200} fill={P.void} />
        <rect x={-600} y={-160} width={CANVAS_W + 1200} height={160} fill={P.void} opacity="0.6" />
      </g>
      <g transform={at(TOP.x, TOP.lift)}>
        <Ledge />
      </g>
      <Wanderer x={LIGHT.from} />
    </g>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const camera = fx(stage, 'camera')
    const follows = camera?.hasAttribute('data-narrow') ?? false
    const shut = fx(stage, 'shut')
    const door = fx(stage, 'door')
    const leafL = fx(stage, 'door-leaf-l')
    const leafR = fx(stage, 'door-leaf-r')
    const beams = [fx(stage, 'beam-0'), fx(stage, 'beam-1')]
    const doorLight = fx(stage, 'door-light')
    const flare = fx(stage, 'flare')
    const swallow = fx(stage, 'swallow')
    return (play) => {
      const entered = share(play, 0)
      const climbed = share(play, 1)
      const ended = share(play, 2)
      // the three marks dark; the door shakes, breaks open and is gone in the light
      marksTo(stage, 'door', [0, 0, 0])
      const shake = bell(entered, 0.08, 0.3)
      const burst = ramp(entered, 0.3, 0.5)
      transformTo(leafL, `translate(${r1(-220 * burst + 6 * shake * Math.sin(entered * 90))} 0) rotate(${r1(-24 * burst)} -120 0)`)
      transformTo(leafR, `translate(${r1(220 * burst - 6 * shake * Math.sin(entered * 90))} 0) rotate(${r1(24 * burst)} 120 0)`)
      fadeTo(door, 1 - ramp(entered, 0.4, 0.6))
      fadeTo(shut, 1 - ramp(entered, 0.3, 0.6))
      // beams sweep past him on the climb
      beams.forEach((beam, i) => {
        const sweep = ramp(climbed, 0.1 + 0.45 * i, 0.45 + 0.45 * i)
        transformTo(beam, `rotate(${r1((i ? 1 : -1) * lerp(30, -30, sweep))})`)
        fadeTo(beam, bell(climbed, 0.1 + 0.45 * i, 0.45 + 0.45 * i))
      })
      // one blow: the light flares, fades, and the dark rises up behind him and takes it
      burstAt(flare, LIGHT.strike - 60, 360, bell(ended, 0.28, 0.5))
      fadeTo(doorLight, 1 - ramp(ended, 0.4, 0.7))
      transformTo(swallow, `translate(0 ${r1(lerp(CANVAS_H + 200, 0, ramp(ended, 0.42, 0.92)))})`)
      transformTo(camera, `translate(0 ${follows ? r1(CAMERA_DROP * Math.max(climbed, ended > 0 ? 1 : 0)) : 0})`)
      if (ended > 0) {
        const up = ramp(ended, 0.05, 0.4)
        const { x, lift } = arc(up, [TOP.x, TOP.lift], [TOP.x, TOP.lift], 150)
        poseHim(him, { x, lift }, up > 0 && up < 1 ? upStrike(ramp(up, 0.2, 0.8), AIR) : up === 1 ? mix(GUARD, REST, ramp(ended, 0.6, 1)) : GUARD)
        return
      }
      if (climbed > 0) {
        const hops = LEDGES.length
        const u = Math.min(hops - 1e-6, climbed * hops)
        const i = Math.floor(u)
        const from = i === 0 ? { x: LIGHT.door, lift: 0 } : LEDGES[i - 1]
        const to = LEDGES[i]
        const hop = ramp(u - i, 0.15, 0.85)
        const { x, lift } = arc(hop, [from.x, from.lift], [to.x, to.lift], 90)
        poseHim(him, { x, lift, face: to.x < from.x ? -1 : 1 }, climbed === 1 ? GUARD : hop > 0 && hop < 1 ? AIR : GUARD)
        return
      }
      const walk = ramp(entered, 0.5, 1)
      poseHim(him, { x: lerp(LIGHT.from, LIGHT.door, walk) }, walk > 0 && walk < 1 ? run(5 * walk) : REST)
    }
  },
}

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

// The cards a section counts, the shared count (stageItems): the record's facts and its achievements both.
const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number => {
  const { lead, count } = stageItems(slot, labels, highlights.length)
  return lead + count
}

export interface DarkScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
}

// The motes rise this far over a scene; the rain falls this far.
const MOTE_DRIFT = { motes: -80, rain: 160 }

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number): DarkScene => {
  const spec = SCENES[id]
  const drift = spec.area === 'city' || spec.area === 'spire' ? MOTE_DRIFT.rain : MOTE_DRIFT.motes
  return {
    id,
    slot,
    count,
    script: spec.script,
    bind: (stage): StageWriter => {
      const motes = fx(stage, 'motes')
      const write = spec.bind(stage)
      return (progress, _reached, play) => {
        transformTo(motes, `translate(0 ${(progress * drift).toFixed(1)})`)
        // drawn settled (reduced motion) there is no playhead, and the scene holds its end frame
        write(play ?? sceneEnd(spec.script))
      }
    },
  }
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[]): DarkScene[] {
  return [sceneOf('hero', null, 0), ...slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights))), sceneOf('contact', null, 0)]
}

// Scales about his floor point at x, so everyone scaled still stands on the ground line the near layer draws.
const zoomAbout = (x: number, zoom: number): string => `translate(${x} ${FLOOR_Y}) scale(${zoom}) translate(${-x} ${-FLOOR_Y})`

/** A scene's picture in its area's layers; `narrow` centres a screen narrower than lg on where it plays. */
export function DarkStage({ scene, narrow, settled = false }: { scene: DarkScene; narrow: boolean; settled?: boolean }) {
  const spec = SCENES[scene.id]
  const layers: StageLayer[] = [
    { name: 'sky', node: <AreaSky area={spec.area} /> },
    { name: 'mid', node: <AreaMid area={spec.area} /> },
    { name: 'near', node: <AreaGround area={spec.area} /> },
    {
      name: 'figure',
      node: (
        <AreaLayer>
          <g transform={narrow && spec.phoneZoom ? zoomAbout(spec.phoneX, spec.phoneZoom) : undefined}>{spec.figure(narrow)}</g>
        </AreaLayer>
      ),
    },
    { name: 'fg', node: <AreaFront area={spec.area} /> },
  ]
  return (
    <Framing.Provider value={{ narrow, centerX: spec.phoneX }}>
      <Stage scene={scene} layers={layers} motion={AREA_MOTION} settled={settled} className={world.stage} />
    </Framing.Provider>
  )
}
