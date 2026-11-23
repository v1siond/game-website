'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { trackAt, trackEase } from '@/lib/scroll/track'
import { ProfessionStage } from '@/components/themes/shared/professionStage'
import { fadeTo, focusOn, fx, lerp, r1, spread, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage, type StageLayer } from '@/components/themes/shared/theatre/Stage'
import { SETTLED_PROGRESS, type LayerMotions, type StageWriter, type TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { BattleBug, BUG_ASPECT, DeadBugCreature, HIT_FLASH_OPACITY } from './bug'
import { ArmouredKnight, Bell, Bench, Crawler, Flier, Pit, SoulBolt, Wings } from './foes'
import { HallColumns, HallFloor, HallFront, HallLamps, HallLayer, HallSky } from './hall'
import { KNIGHT_SOLE_Y, KNIGHT_VIEW_WIDTH, KnightCharacter, bladeTurn, slashAngle, slashGlow } from './KnightCharacter'
import { SpiritWisp } from './relics'
import { DARK_FANTASY } from './palette'
import world from './world.module.css'

// The knight's scenes, one per part of the page: the hero, each section the profession shows and the
// contact, every one the arena (hall.tsx) lit in its own light. Each section is a different moment of a
// side-scrolling dark action adventure, one beat per card: About is the heal, a wisp of soul flowing into
// him per highlight as he kneels; Work crosses the hall room by room, the floor scrolling under him (the
// shared track) as he leaps each pit on pale wings, to sit at a bench; the Tech Stack is a horde, a crawler
// charging in per category and bursting at his strike; Services meets a diving flier per service with the
// up strike; Projects is the boss, the bug lunging and him dashing through it to strike, per project, then the
// execution with the camera pushed in; Ventures rolls under a crawler's charge and casts the soul bolt into
// its back, per venture; Bands casts a bolt per band at the bells under the vault, each ringing lit; the Muay
// Thai record is a duel, his blade meeting the armoured knight's per line until the knight kneels; the contact
// rests at the bench by the dead bug. Every pose is a function of the scene's progress and the cards reached,
// so it plays back on the way up and rests when the scroll does; a scene drawn settled (reduced motion) holds
// its peak.

export type SceneId = 'hero' | SectionId | 'contact'

/** Each layer's push in across its scene: the far wall moves least, the front stones most, for the depth. */
export const HALL_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  far: { zoom: [1.01, 1.07], lift: [0, -1] },
  stage: { zoom: [1.02, 1.09], lift: [0, -1] },
  mid: { zoom: [1.03, 1.11], lift: [0, -2] },
  near: { zoom: [1.04, 1.13], lift: [0, -2] },
  figure: { zoom: [1.04, 1.13], lift: [0, -2] },
  fg: { zoom: [1.1, 1.26], lift: [1, -4] },
}

// The floor line the knight's soles stand on, and his size on it: his drawing's half width and his height
// from sole to horn tip, his mask's middle MASK_UP above his soles.
const FLOOR_Y = 990
const KNIGHT_SCALE = 2.8
const KNIGHT_HALF = (KNIGHT_VIEW_WIDTH * KNIGHT_SCALE) / 2
const KNIGHT_SOLE = KNIGHT_SOLE_Y * KNIGHT_SCALE
const MASK_UP = (KNIGHT_SOLE_Y - 28) * KNIGHT_SCALE
const BODY_UP = KNIGHT_SOLE / 2
// Where he stands in most rounds: right of the text column, the foes coming at him from the right.
const KNIGHT_X = 1200

// The stretches of a scene's progress the lead plays over before the first card, and the close after the last.
const LEAD = [0.06, 0.24] as const
const CLOSE = [0.74, 0.9] as const

/** The card playing `reached` cards in and how far through it (0 to 1), the lead before the first card and
 *  the close after the last (each 0 to 1 over its stretch of the progress). */
interface Beat {
  card: number
  f: number
  lead: number
  close: number
}

const beatOf = (progress: number, reached: number, count: number): Beat => {
  const card = Math.max(0, Math.min(count - 1, Math.floor(reached)))
  return { card, f: count === 0 ? 0 : Math.min(1, reached - card), lead: ramp(progress, ...LEAD), close: reached >= count ? ramp(progress, ...CLOSE) : 0 }
}

/** A bump from 0 up to 1 and back over [from, to] of t. */
const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

// ---- the knight ----

/** His pose: where his soles stand, how high he is off the floor, his facing, his whole figure's turn about
 *  his middle and its stretch, his blade's angle on its pommel and its soul light. */
interface Pose {
  x: number
  lift?: number
  face?: 1 | -1
  turn?: number
  sx?: number
  sy?: number
  blade?: number
  glow?: number
}

// The blade at rest, held to the side (KnightCharacter's own rest angle).
const BLADE_REST = slashAngle(0)

interface KnightNodes {
  root: Element | null
  blade: Element | null
  glow: Element | null
}

const knightNodes = (stage: ParentNode): KnightNodes => ({ root: fx(stage, 'knight'), blade: stage.querySelector('[data-blade]'), glow: stage.querySelector('[data-blade-glow]') })

const knightTransform = ({ x, lift = 0, face = 1, turn = 0, sx = 1, sy = 1 }: Pose): string =>
  `translate(${r1(x)} ${r1(FLOOR_Y - lift)}) scale(${(face * sx).toFixed(3)} ${sy.toFixed(3)}) rotate(${r1(turn)} 0 ${r1(-BODY_UP)}) translate(${r1(-KNIGHT_HALF)} ${r1(-KNIGHT_SOLE)})`

const poseKnight = ({ root, blade, glow }: KnightNodes, pose: Pose): void => {
  transformTo(root, knightTransform(pose))
  transformTo(blade, bladeTurn(pose.blade ?? BLADE_REST))
  fadeTo(glow, pose.glow ?? 0)
}

/** The knight, the one figure of every scene. */
function Knight({ x }: { x: number }) {
  return (
    <g data-fx="knight" data-worlds-figure="" transform={knightTransform({ x })}>
      <KnightCharacter scale={KNIGHT_SCALE} />
    </g>
  )
}

/** A strike at `t` of its swing: the blade's angle and light, and a lean into it. */
const strike = (t: number): Pick<Pose, 'blade' | 'glow' | 'turn'> => ({ blade: slashAngle(t), glow: slashGlow(t), turn: 8 * bell(t, 0.15, 0.6) })

// The up strike: the blade swings from rest to straight up past it, and back.
const UP_TOP = -35
const upStrike = (t: number): Pick<Pose, 'blade' | 'glow'> => ({ blade: lerp(BLADE_REST, UP_TOP, bell(t, 0, 1)), glow: t > 0.25 && t < 0.75 ? 0.6 : 0 })

// ---- the scenes ----

interface SceneSpec {
  light: string
  /** The scene's own layer between the lamps and the columns (the hero's profession stage). */
  stage?: (profession: Profession) => ReactNode
  figure: (scene: DarkScene) => ReactNode
  bind: (stage: HTMLElement, scene: DarkScene) => StageWriter
  /** The peak a settled scene holds, as the progress and cards reached it is drawn at. */
  peak: (count: number) => { progress: number; reached: number }
}

// The progress a close's moment t is played at.
const closeAt = (t: number): number => lerp(CLOSE[0], CLOSE[1], t)

// ---- About: the heal ----

const WISP_SIZE = 70
// Where each card's wisp drifts in from, in turn, high in the hall on his right.
const WISP_FROM: ReadonlyArray<readonly [number, number]> = [
  [1640, 420],
  [1780, 560],
  [1560, 300],
]

const about: SceneSpec = {
  light: DARK_FANTASY.spiritGold,
  figure: () => (
    <>
      <circle data-fx="aura" cx={KNIGHT_X} cy={FLOOR_Y - BODY_UP} r="150" fill={DARK_FANTASY.soulBlue} opacity="0" />
      <circle data-fx="ring" cx={KNIGHT_X} cy={FLOOR_Y - BODY_UP} r="150" fill="none" stroke={DARK_FANTASY.soulBlue} strokeWidth="6" opacity="0" />
      <Knight x={KNIGHT_X} />
      <g data-fx="wisp" opacity="0">
        <SpiritWisp size={WISP_SIZE} color={DARK_FANTASY.spiritGold} x={-WISP_SIZE / 2} y={-WISP_SIZE / 2} />
      </g>
    </>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const aura = fx(stage, 'aura')
    const ring = fx(stage, 'ring')
    const wisp = fx(stage, 'wisp')
    return (progress, reached) => {
      const { card, f, lead, close } = beatOf(progress, reached, count)
      const kneel = lead * (1 - close)
      poseKnight(knight, { x: KNIGHT_X, sx: 1 + 0.06 * kneel, sy: 1 - 0.12 * kneel, blade: lerp(BLADE_REST, 80, kneel), glow: 0.5 * bell(f, 0.7, 1) * (1 - close) })
      const [fromX, fromY] = WISP_FROM[card % WISP_FROM.length]
      const flown = ramp(f, 0.1, 0.85)
      const x = lerp(fromX, KNIGHT_X, flown)
      const y = lerp(fromY, FLOOR_Y - MASK_UP, flown) - 80 * Math.sin(Math.PI * flown)
      transformTo(wisp, `translate(${r1(x)} ${r1(y)}) scale(${(1 - 0.5 * flown).toFixed(3)})`)
      fadeTo(wisp, count > 0 && reached < count && f > 0.05 && f < 0.9 ? 1 : 0)
      fadeTo(aura, (0.08 + 0.3 * Math.min(1, reached / Math.max(1, count))) * lead * (1 - close))
      transformTo(ring, `translate(${KNIGHT_X} ${FLOOR_Y - BODY_UP}) scale(${(0.7 + 0.9 * close).toFixed(3)}) translate(${-KNIGHT_X} ${-(FLOOR_Y - BODY_UP)})`)
      fadeTo(ring, bell(close, 0, 1) * 0.8)
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 0.2 }),
}

// ---- Work: crossing the hall ----

// The pits stand ROOM apart on the floor, the first PIT_AHEAD in front of him; the bench past the last.
const ROOM = 540
const PIT_AHEAD = 150
const LEAP = { height: 200, run: 0.7, wings: [0.45, 0.85] as const }
const BENCH_PAST = 320
const WORK_X = 1150

const work: SceneSpec = {
  light: DARK_FANTASY.spiritGold,
  figure: ({ count }) => (
    <>
      <g data-fx="floor">
        {Array.from({ length: count }, (_, i) => (
          <g key={i} transform={`translate(${WORK_X + PIT_AHEAD + i * ROOM} ${FLOOR_Y})`}>
            <Pit />
          </g>
        ))}
        <g transform={`translate(${WORK_X + count * ROOM + BENCH_PAST} ${FLOOR_Y})`}>
          <Bench />
        </g>
      </g>
      <g data-fx="wings" opacity="0">
        <Wings />
      </g>
      <Knight x={WORK_X} />
    </>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const floor = fx(stage, 'floor')
    const wings = fx(stage, 'wings')
    return (progress, reached) => {
      const { close } = beatOf(progress, reached, count)
      const { offset, run, act } = count > 0 ? trackAt(reached, count, ROOM, LEAP.run) : { offset: 0, run: 0, act: 0 }
      const leaping = reached > 0 && reached < count
      const lift = leaping ? hop(run, LEAP.height) : 0
      const toBench = BENCH_PAST * trackEase(close)
      transformTo(floor, `translate(${r1(-(offset + toBench))} 0)`)
      const sit = ramp(close, 0.8, 1)
      poseKnight(knight, { x: WORK_X, lift: lift + 74 * sit, sy: 1 - 0.1 * bell(act, 0, 1) * (leaping ? 1 : 0) - 0.08 * sit, turn: -6 * bell(run, 0.1, 0.9) * (leaping ? 1 : 0) })
      transformTo(wings, `translate(${WORK_X - 10} ${r1(FLOOR_Y - lift - BODY_UP)})`)
      fadeTo(wings, leaping ? bell(run, ...LEAP.wings) : 0)
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + LEAP.run * 0.55 }),
}

// ---- Tech Stack: the horde ----

const CRAWLER_FROM = 1960
const CRAWLER_STOP = KNIGHT_X + 200

/** The soul a struck foe bursts into, a pale puff over the floor. */
function Burst({ name }: { name: string }) {
  return (
    <g data-fx={name} opacity="0">
      <circle r="70" fill={DARK_FANTASY.soulBlue} opacity="0.35" />
      <circle r="34" fill={DARK_FANTASY.white} opacity="0.7" />
    </g>
  )
}

const tech: SceneSpec = {
  light: DARK_FANTASY.ethereal,
  figure: () => (
    <>
      <g data-fx="crawler" opacity="0">
        <Crawler />
      </g>
      <Burst name="burst" />
      <Knight x={KNIGHT_X} />
    </>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const crawler = fx(stage, 'crawler')
    const burst = fx(stage, 'burst')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, count)
      const playing = reached > 0 && reached < count
      poseKnight(knight, { x: KNIGHT_X, ...(playing ? strike(ramp(f, 0.4, 0.8)) : { glow: 0.5 * bell(close, 0, 1) }) })
      const x = lerp(CRAWLER_FROM, CRAWLER_STOP, ramp(f, 0, 0.45))
      transformTo(crawler, `translate(${r1(x)} ${FLOOR_Y - Math.abs(Math.sin(f * Math.PI * 6)) * 6})`)
      fadeTo(crawler, playing ? 1 - ramp(f, 0.6, 0.7) : 0)
      transformTo(burst, `translate(${CRAWLER_STOP} ${FLOOR_Y - 50}) scale(${(0.5 + ramp(f, 0.58, 0.9)).toFixed(3)})`)
      fadeTo(burst, playing ? bell(f, 0.56, 0.92) : 0)
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.58 }),
}

// ---- Services: the flier ----

const FLIER_FROM = [1780, 260] as const
const FLIER_MEET = [KNIGHT_X + 70, FLOOR_Y - 420] as const
const FLIER_DOWN = [KNIGHT_X + 260, FLOOR_Y - 20] as const

const services: SceneSpec = {
  light: DARK_FANTASY.brass,
  figure: () => (
    <>
      <g data-fx="flier" opacity="0">
        <Flier />
      </g>
      <Burst name="burst" />
      <Knight x={KNIGHT_X} />
    </>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const flier = fx(stage, 'flier')
    const burst = fx(stage, 'burst')
    return (progress, reached) => {
      const { f } = beatOf(progress, reached, count)
      const playing = reached > 0 && reached < count
      const swing = playing ? ramp(f, 0.38, 0.85) : 0
      poseKnight(knight, { x: KNIGHT_X, lift: hop(swing, 70), ...upStrike(swing) })
      const dive = ramp(f, 0, 0.5)
      const fall = ramp(f, 0.58, 1)
      const x = fall > 0 ? lerp(FLIER_MEET[0], FLIER_DOWN[0], fall) : lerp(FLIER_FROM[0], FLIER_MEET[0], dive)
      const y = fall > 0 ? lerp(FLIER_MEET[1], FLIER_DOWN[1], fall * fall) : lerp(FLIER_FROM[1], FLIER_MEET[1], dive)
      transformTo(flier, `translate(${r1(x)} ${r1(y)}) rotate(${r1(160 * fall)})`)
      fadeTo(flier, playing ? 1 - ramp(f, 0.88, 1) : 0)
      transformTo(burst, `translate(${FLIER_MEET[0]} ${FLIER_MEET[1]}) scale(${(0.4 + 0.6 * ramp(f, 0.5, 0.7)).toFixed(3)})`)
      fadeTo(burst, playing ? bell(f, 0.5, 0.72) : 0)
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.55 }),
}

// ---- Projects: the boss ----

const BUG_SIZE = 200
const BUG_H = BUG_SIZE * BUG_ASPECT
const BUG_X = 1660
const BUG_HOVER = 60
const BUG_SWAY_PX = 10
// Per project the bug lunges this far toward him and he dashes this far through it, then steps back.
const LUNGE = 260
const DASH = 340
// The execution: he walks in to EXECUTE_X, the bug sinks to the floor, the camera pushes in on it.
const EXECUTE_X = 1440
const EXECUTE_ZOOM = 1.15
const WIND_UP = -150
const DOWN_STROKE = 110
const EXECUTION = { walk: [0, 0.3], raise: [0.3, 0.5], strike: [0.55, 0.62], die: [0.62, 0.85] } as const

const bugAt = (x: number, hover: number, tilt = 0): string =>
  `translate(${r1(x - BUG_SIZE / 2)} ${r1(FLOOR_Y - BUG_H - hover)}) rotate(${r1(tilt)} ${BUG_SIZE / 2} ${r1(BUG_H / 2)})`

const projects: SceneSpec = {
  light: DARK_FANTASY.infected,
  figure: () => (
    <g data-fx="camera">
      <g data-fx="corpse" opacity="0" transform={`translate(${BUG_X - BUG_SIZE / 2} ${FLOOR_Y - BUG_H * 0.75})`}>
        <DeadBugCreature size={BUG_SIZE} />
      </g>
      <g data-fx="bug" transform={bugAt(BUG_X, BUG_HOVER)}>
        <BattleBug size={BUG_SIZE} />
      </g>
      <rect data-fx="streak" x="-200" y="-30" width="200" height="60" rx="30" fill={DARK_FANTASY.soulBlue} opacity="0" />
      <Knight x={KNIGHT_X} />
    </g>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const camera = fx(stage, 'camera')
    const bug = fx(stage, 'bug')
    const corpse = fx(stage, 'corpse')
    const streak = fx(stage, 'streak')
    const hit = stage.querySelector('[data-bug-hit]')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, count)
      const sway = Math.sin(progress * Math.PI * 8) * BUG_SWAY_PX
      if (reached >= count) {
        const walk = ramp(close, ...EXECUTION.walk)
        const raised = ramp(close, ...EXECUTION.raise)
        const struck = ramp(close, ...EXECUTION.strike)
        const death = ramp(close, ...EXECUTION.die)
        poseKnight(knight, { x: lerp(KNIGHT_X, EXECUTE_X, walk), blade: struck > 0 ? lerp(WIND_UP, DOWN_STROKE, struck) : lerp(BLADE_REST, WIND_UP, raised), glow: raised, turn: 10 * struck })
        transformTo(bug, bugAt(BUG_X, BUG_HOVER * (1 - walk)))
        fadeTo(bug, 1 - death)
        fadeTo(corpse, death)
        fadeTo(hit, bell(close, EXECUTION.strike[0], EXECUTION.die[0] + 0.08) * HIT_FLASH_OPACITY)
        fadeTo(streak, 0)
        transformTo(camera, focusOn(BUG_X - 60, FLOOR_Y - 160, lerp(1, EXECUTE_ZOOM, walk)))
        return
      }
      const playing = reached > 0
      const lunge = playing ? bell(f, 0, 0.5) : 0
      const dash = playing ? ramp(f, 0.3, 0.5) : 0
      const back = playing ? ramp(f, 0.72, 1) : 0
      const x = KNIGHT_X + DASH * (dash - back)
      const dashing = dash > 0 && dash < 1
      poseKnight(knight, { x, sx: dashing ? 1.35 : 1, sy: dashing ? 0.82 : 1, ...(playing ? strike(ramp(f, 0.48, 0.72)) : {}) })
      transformTo(streak, `translate(${r1(x)} ${FLOOR_Y - BODY_UP}) scale(${(1 + 1.5 * dash).toFixed(3)} 1)`)
      fadeTo(streak, dashing ? 0.6 : 0)
      const recoil = playing ? bell(f, 0.55, 0.8) : 0
      transformTo(bug, bugAt(BUG_X - LUNGE * lunge + 40 * recoil, BUG_HOVER + sway - 12 * recoil, 8 * recoil))
      fadeTo(bug, 1)
      fadeTo(corpse, 0)
      fadeTo(hit, recoil * HIT_FLASH_OPACITY)
      transformTo(camera, focusOn(BUG_X, FLOOR_Y - 160, 1))
    }
  },
  peak: (count) => ({ progress: closeAt(0.6), reached: count }),
}

// ---- Ventures: roll and spell ----

// He rolls between his two places, LEFT and RIGHT, a crawler charging him from the side he faces.
const LEFT = 1150
const RIGHT = 1560
const BOLT = { from: 0.58, to: 0.76 } as const

const ventures: SceneSpec = {
  light: DARK_FANTASY.ethereal,
  figure: () => (
    <>
      <g data-fx="crawler" opacity="0">
        <Crawler />
      </g>
      <g data-fx="bolt" opacity="0">
        <SoulBolt />
      </g>
      <Burst name="burst" />
      <Knight x={LEFT} />
    </>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const crawler = fx(stage, 'crawler')
    const bolt = fx(stage, 'bolt')
    const burst = fx(stage, 'burst')
    return (progress, reached) => {
      const { card, f } = beatOf(progress, reached, count)
      const playing = reached > 0 && reached < count
      // An even card starts him on the left facing right; an odd one on the right facing left.
      const fromLeft = card % 2 === 0
      const [start, end] = fromLeft ? [LEFT, RIGHT] : [RIGHT, LEFT]
      const side: 1 | -1 = fromLeft ? 1 : -1
      const roll = playing ? ramp(f, 0.25, 0.5) : reached >= count ? 1 : 0
      const turned = roll >= 0.5
      const at = reached >= count && count % 2 === 0 ? LEFT : reached >= count ? RIGHT : lerp(start, end, roll)
      const face: 1 | -1 = reached >= count ? (count % 2 === 0 ? 1 : -1) : turned ? (side === 1 ? -1 : 1) : side
      const cast = playing ? bell(f, 0.52, 0.66) : 0
      poseKnight(knight, { x: at - face * 16 * cast, face, turn: 360 * roll * side * (playing ? 1 : 0), sy: playing ? 1 - 0.2 * bell(roll, 0, 1) : 1, lift: playing ? 30 * bell(roll, 0, 1) : 0, glow: 0.6 * cast })
      const charge = ramp(f, 0, 0.45)
      const target = (start + end) / 2 - side * 40
      const crawlerX = lerp(start + side * 760, target, charge)
      transformTo(crawler, `translate(${r1(crawlerX)} ${FLOOR_Y}) scale(${-side} 1)`)
      fadeTo(crawler, playing ? 1 - ramp(f, BOLT.to, BOLT.to + 0.06) : 0)
      const flight = ramp(f, BOLT.from, BOLT.to)
      transformTo(bolt, `translate(${r1(lerp(end, target, flight))} ${FLOOR_Y - BODY_UP}) scale(${-side} 1)`)
      fadeTo(bolt, playing && flight > 0 && flight < 1 ? 1 : 0)
      transformTo(burst, `translate(${r1(target)} ${FLOOR_Y - 50}) scale(${(0.5 + ramp(f, BOLT.to, 0.95)).toFixed(3)})`)
      fadeTo(burst, playing ? bell(f, BOLT.to - 0.02, 0.98) : 0)
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.68 }),
}

// ---- Bands: the bells ----

const BELLS = { from: 1360, to: 1780, y: 330 } as const

const bands: SceneSpec = {
  light: DARK_FANTASY.lavender,
  figure: ({ count }) => (
    <>
      {spread(count, BELLS.from, BELLS.to).map((x, i) => (
        <g key={i} data-fx={`bell-${i}`} transform={`translate(${r1(x)} ${BELLS.y})`}>
          <Bell i={i} />
        </g>
      ))}
      <g data-fx="ring" opacity="0">
        <ellipse cx={(BELLS.from + BELLS.to) / 2} cy={BELLS.y} rx="320" ry="120" fill="none" stroke={DARK_FANTASY.lavender} strokeWidth="6" />
      </g>
      <g data-fx="bolt" opacity="0">
        <SoulBolt />
      </g>
      <Knight x={KNIGHT_X} />
    </>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const xs = spread(count, BELLS.from, BELLS.to)
    const bells = xs.map((_, i) => ({ bell: fx(stage, `bell-${i}`), lit: fx(stage, `bell-lit-${i}`) }))
    const bolt = fx(stage, 'bolt')
    const ring = fx(stage, 'ring')
    const from = [KNIGHT_X + 60, FLOOR_Y - MASK_UP] as const
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, count)
      const playing = reached > 0 && reached < count
      const cast = playing ? bell(f, 0.2, 0.4) : 0
      poseKnight(knight, { x: KNIGHT_X - 16 * cast, turn: -6 * cast, glow: 0.6 * cast })
      const flight = ramp(f, 0.3, 0.6)
      const [toX, toY] = [xs[card] ?? from[0], BELLS.y]
      const angle = (Math.atan2(toY - from[1], toX - from[0]) * 180) / Math.PI
      transformTo(bolt, `translate(${r1(lerp(from[0], toX, flight))} ${r1(lerp(from[1], toY, flight))}) rotate(${r1(angle)})`)
      fadeTo(bolt, playing && flight > 0 && flight < 1 ? 1 : 0)
      bells.forEach(({ bell: node, lit }, i) => {
        const swing = i === card && playing ? 12 * Math.sin(Math.PI * 2 * ramp(f, 0.6, 1)) * (1 - ramp(f, 0.6, 1)) : 0
        transformTo(node, `translate(${r1(xs[i])} ${BELLS.y}) rotate(${r1(swing)} 0 -400)`)
        fadeTo(lit, ramp(reached - i, 0.6, 0.7))
      })
      fadeTo(ring, bell(close, 0, 1))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.62 }),
}

// ---- Muay Thai record: the duel ----

const FOE_X = 1540
const DUEL_X = 1250
const FOE_RAISED = -150
const FOE_STRUCK = -40
const CLASH = [1395, FLOOR_Y - 250] as const

const muayThai: SceneSpec = {
  light: DARK_FANTASY.spiritGold,
  figure: () => (
    <>
      <g data-fx="foe" transform={`translate(${FOE_X} ${FLOOR_Y})`}>
        <ArmouredKnight />
      </g>
      <g data-fx="spark" opacity="0" transform={`translate(${CLASH[0]} ${CLASH[1]})`}>
        <path d="M0,-50 L10,-12 L48,-18 L14,4 L36,40 L0,16 L-32,42 L-12,4 L-50,-14 L-10,-12 Z" fill={DARK_FANTASY.spiritGold} />
        <circle r="14" fill={DARK_FANTASY.white} />
      </g>
      <Knight x={DUEL_X} />
    </>
  ),
  bind: (stage, { count }) => {
    const knight = knightNodes(stage)
    const foe = fx(stage, 'foe')
    const foeBlade = fx(stage, 'foe-blade')
    const spark = fx(stage, 'spark')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, count)
      const playing = reached > 0 && reached < count
      const swing = playing ? ramp(f, 0.1, 0.45) : 0
      const parry = playing ? bell(f, 0.25, 0.75) : 0
      const push = playing ? bell(f, 0.45, 0.9) : 0
      poseKnight(knight, { x: DUEL_X - 24 * push, blade: lerp(BLADE_REST, -10, parry), glow: 0.6 * bell(f, 0.4, 0.6) * (playing ? 1 : 0) })
      const kneel = close
      transformTo(foe, `translate(${r1(FOE_X + 24 * push)} ${r1(FLOOR_Y)}) scale(1 ${(1 - 0.22 * kneel).toFixed(3)}) rotate(${r1(-8 * kneel)} 0 -100)`)
      transformTo(foeBlade, `rotate(${r1(kneel > 0 ? lerp(FOE_STRUCK, 80, kneel) : lerp(FOE_RAISED, FOE_STRUCK, swing))} -30 -120)`)
      transformTo(spark, `translate(${CLASH[0]} ${CLASH[1]}) scale(${(0.6 + 0.6 * ramp(f, 0.4, 0.6)).toFixed(3)})`)
      fadeTo(spark, playing ? bell(f, 0.38, 0.62) : 0)
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.5 }),
}

// ---- the hero and the contact ----

// The hero: the knight waits in the arena before the profession's boss stage, and salutes with his blade as
// the page starts to scroll.
const HERO_KNIGHT_X = 1640

const hero: SceneSpec = {
  light: DARK_FANTASY.ethereal,
  stage: (profession) => <ProfessionStage profession={profession} p={DARK_FANTASY} />,
  figure: () => <Knight x={HERO_KNIGHT_X} />,
  bind: (stage) => {
    const knight = knightNodes(stage)
    return (progress) => {
      const salute = ramp(progress, 0.05, 0.6)
      poseKnight(knight, { x: HERO_KNIGHT_X, blade: slashAngle(salute), glow: slashGlow(salute) })
    }
  },
  peak: () => ({ progress: 0.3, reached: 0 }),
}

// The contact: he walks to the bench by the dead bug and sits to rest.
const CONTACT = { from: 1180, bench: 1420, corpse: 1720, walk: [0.05, 0.3], sit: [0.3, 0.42] } as const
const SEAT_LIFT = 74

const contact: SceneSpec = {
  light: DARK_FANTASY.infected,
  figure: () => (
    <>
      <g transform={`translate(${CONTACT.corpse - BUG_SIZE / 2} ${FLOOR_Y - BUG_H * 0.75})`}>
        <DeadBugCreature size={BUG_SIZE} />
      </g>
      <g transform={`translate(${CONTACT.bench} ${FLOOR_Y})`}>
        <Bench />
      </g>
      <Knight x={CONTACT.from} />
    </>
  ),
  bind: (stage) => {
    const knight = knightNodes(stage)
    return (progress) => {
      const walk = ramp(progress, ...CONTACT.walk)
      const sit = ramp(progress, ...CONTACT.sit)
      poseKnight(knight, { x: lerp(CONTACT.from, CONTACT.bench, walk), lift: SEAT_LIFT * sit, sy: 1 - 0.08 * sit, blade: lerp(BLADE_REST, 80, sit) })
    }
  },
  peak: () => ({ progress: 1, reached: 0 }),
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

// The soul motes rise this far over a scene.
const MOTE_RISE = 80

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number): DarkScene => {
  const spec = SCENES[id]
  const scene: DarkScene = {
    id,
    slot,
    count,
    bind: (stage) => {
      const motes = fx(stage, 'motes')
      const write = spec.bind(stage, scene)
      const peak = spec.peak(count)
      return (progress, reached) => {
        transformTo(motes, `translate(0 ${(-progress * MOTE_RISE).toFixed(1)})`)
        // Drawn settled (reduced motion), the scene holds its peak.
        if (progress === SETTLED_PROGRESS && reached >= count) write(peak.progress, peak.reached)
        else write(progress, reached)
      }
    },
  }
  return scene
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[]): DarkScene[] {
  return [sceneOf('hero', null, 0), ...slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights))), sceneOf('contact', null, 0)]
}

/** A scene's picture in the arena's layers. */
export function DarkStage({ scene, profession, settled = false }: { scene: DarkScene; profession: Profession; settled?: boolean }) {
  const spec = SCENES[scene.id]
  const layers: StageLayer[] = [
    { name: 'sky', node: <HallSky light={spec.light} /> },
    { name: 'far', node: <HallLamps /> },
    ...(spec.stage ? [{ name: 'stage', node: spec.stage(profession) }] : []),
    { name: 'mid', node: <HallColumns /> },
    { name: 'near', node: <HallFloor /> },
    {
      name: 'figure',
      node: (
        <HallLayer>
          <g className={world.troupe}>{spec.figure(scene)}</g>
        </HallLayer>
      ),
    },
    { name: 'fg', node: <HallFront /> },
  ]
  return <Stage scene={scene} layers={layers} motion={HALL_MOTION} settled={settled} className={world.stage} />
}
