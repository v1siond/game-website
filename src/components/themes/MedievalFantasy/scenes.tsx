'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { drop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, focusOn, fx, lerp, r1, spread, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import { SETTLED_PROGRESS, type LayerMotions, type StageWriter, type TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { ChaosLand } from './chaosZone'
import { FrostLand } from './frostZone'
import { GolemRise, RISEN, ROCK_COUNT, riseWriter } from './golem'
import { King, KING_BLADE_AT, KING_FEET, KING_HAND_AT } from './hero'
import { REALM } from './palette'
import { REALM_OF } from './sections'
import {
  AuraRing,
  Barracks,
  Champion,
  Creep,
  Glint,
  GoldMine,
  Hall,
  HALL_STAGES,
  IceShard,
  LevelColumn,
  OrderMarker,
  RallyFlag,
  SelectBox,
  SelectRing,
  Soldier,
  Worker,
} from './units'
import look from './world.module.css'

// The two realms as the page's scenes, each section a moment of a real time strategy match with him as the
// hero unit: the frost king, selected with his ring, on the field in every scene. Each card's beat opens with
// his gesture, his free hand raised for an order or his blade pointed or raised for a spell, and then his
// units answer. The hero: he selects the golem standing beside him. About is the economy, a worker's trip from
// the mine to the hall with gold per highlight. Work builds the hall a card's share at a time, a worker
// hammering, until the banner goes up. The Tech Stack trains a soldier from the barracks to the rally flag per
// category, then box selects the rank and orders it on. Services clears a creep camp, a creep per service,
// and he levels up in the gold column with the camera pushed in. Projects calls ice down on an enemy column per
// project, then raises the fallen as his own. Ventures sends a dead worker to claim a gold mine per venture.
// Bands pulses his aura once per band, his raised soldiers marching a step to it. The Muay Thai record is his
// duel with a champion, a blow per line, closed by the meteor he summons, the golem standing from its crater.
// The contact: he waits, selected, for the next order. Every pose is a function of the scene's progress and
// the cards reached, so it plays back on the way up and rests when the scroll does; a scene drawn settled
// (reduced motion) holds its peak.

export type SceneId = 'hero' | SectionId | 'contact'
type Realm = 'chaos' | 'frost'

/** The land pushes in across its scene, the field a little more than the land behind it. */
export const REALM_MOTION: LayerMotions = {
  land: { zoom: [1.0, 1.05], lift: [0, -1] },
  figure: { zoom: [1.02, 1.08], lift: [0, -2] },
}

// The field: a 1920 by 1080 picture cut to the screen from its foot, the units' feet on FLOOR. On a chaos stage
// they play right of the text column, on a frost stage left of it (world.module.css moves both bands to the
// middle under 1024 px).
const FIELD = { width: 1920, height: 1080 }
const FLOOR = 1000

// The stretches of a scene's progress the close after the last card plays over.
const CLOSE = [0.74, 0.9] as const
const closeAt = (t: number): number => lerp(CLOSE[0], CLOSE[1], t)

/** The card playing `reached` cards in, how far through it (0 to 1) and the close after the last card. */
interface Beat {
  card: number
  f: number
  close: number
}

const beatOf = (progress: number, reached: number, count: number): Beat => {
  const card = Math.max(0, Math.min(count - 1, Math.floor(reached)))
  return { card, f: count === 0 ? 0 : Math.min(1, reached - card), close: reached >= count ? ramp(progress, ...CLOSE) : 0 }
}

/** A bump from 0 up to 1 and back over [from, to] of t. */
const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

/** His gesture over a beat: up over its first fifth, held while the unit answers, down over its last fifth. */
const gesture = (f: number): number => ramp(f, 0, 0.2) * (1 - ramp(f, 0.8, 1))

/** A unit's feet at (x, y), facing right (1) or left (-1), at `size`. */
const place = (x: number, face: 1 | -1 = 1, y = FLOOR, size = 1): string => `translate(${r1(x)} ${r1(y)}) scale(${(face * size).toFixed(3)} ${size.toFixed(3)})`

/** The small hop of a walk, by how far the unit has walked. */
const stride = (x: number): number => -3 * Math.abs(Math.sin(x / 14))

// ---- the king ----

// His size on the field (his 200 by 320 drawing at 0.62 stands about 200 high) and the turns of his arms: the
// free hand raised for an order, the blade pointed at a target, the blade raised over his head for a spell.
const KING_SCALE = 0.62
const HAND_UP = 125
const BLADE_POINT = -95
const BLADE_UP = -160
const GLOW_REST = 0.15
const GLOW_CAST = 0.8

interface KingPose {
  x: number
  hand?: number
  blade?: number
  glow?: number
  ring?: number
}

interface KingNodes {
  root: Element | null
  hand: Element | null
  blade: Element | null
  glow: Element | null
  ring: Element | null
}

const kingNodes = (stage: ParentNode): KingNodes => ({
  root: fx(stage, 'king'),
  hand: fx(stage, 'king-hand'),
  blade: fx(stage, 'king-blade'),
  glow: fx(stage, 'blade-glow'),
  ring: fx(stage, 'king-ring'),
})

const kingAt = (x: number): string => `translate(${r1(x - KING_FEET.x * KING_SCALE)} ${r1(FLOOR - KING_FEET.y * KING_SCALE)}) scale(${KING_SCALE})`

const poseKing = (nodes: KingNodes, { x, hand = 0, blade = 0, glow = GLOW_REST, ring = 1 }: KingPose): void => {
  transformTo(nodes.root, kingAt(x))
  transformTo(nodes.hand, `rotate(${r1(hand)} ${KING_HAND_AT.x} ${KING_HAND_AT.y})`)
  transformTo(nodes.blade, `rotate(${r1(blade)} ${KING_BLADE_AT.x} ${KING_BLADE_AT.y})`)
  fadeTo(nodes.glow, glow)
  transformTo(nodes.ring, place(x))
  fadeTo(nodes.ring, ring)
}

/** An order: the free hand raised over the beat's gesture. */
const order = (f: number): Pick<KingPose, 'hand'> => ({ hand: HAND_UP * gesture(f) })
/** A spell: the blade raised and lit over the beat's gesture. */
const cast = (f: number): Pick<KingPose, 'blade' | 'glow'> => ({ blade: BLADE_UP * gesture(f), glow: lerp(GLOW_REST, GLOW_CAST, gesture(f)) })
/** A target named: the blade pointed over the beat's gesture. */
const point = (f: number): Pick<KingPose, 'blade'> => ({ blade: BLADE_POINT * gesture(f) })

/** Him, the hero unit, and his ring under him. */
function KingUnit({ x, figure = false }: { x: number; figure?: boolean }) {
  return (
    <>
      <SelectRing name="king-ring" rx={74} />
      <g data-fx="king" transform={kingAt(x)}>
        <King figure={figure} />
      </g>
    </>
  )
}

// ---- small units ----

interface UnitNodes {
  root: Element | null
  arm: Element | null
}

const unitNodes = (stage: ParentNode, name: string): UnitNodes => ({ root: fx(stage, name), arm: fx(stage, `${name}-arm`) })

// The tool arm turns about the shoulder the small units share (units.tsx), swung by this much at a blow.
const SHOULDER = { x: 15, y: -46 }
const swingArm = (arm: Element | null, angle: number): void => transformTo(arm, `rotate(${r1(angle)} ${SHOULDER.x} ${SHOULDER.y})`)

/** A blow's swing over t: back, then down through the strike, and home. */
const blow = (t: number): number => (t < 0.4 ? -70 * ramp(t, 0, 0.4) : lerp(-70, 30, ramp(t, 0.4, 0.7)) * (1 - ramp(t, 0.7, 1)))

// ---- the scenes ----

interface Peak {
  progress: number
  reached: number
}

interface SceneSpec {
  realm: Realm
  figure: (scene: RealmScene) => ReactNode
  bind: (stage: HTMLElement, scene: RealmScene) => StageWriter
  peak: (count: number) => Peak
}

// The hero: he stands by the golem; as the page starts to scroll his ring lights, he raises his hand and the
// golem's ring lights, the golem nodding to the order.
const HERO = { king: 1130, golem: 1460, golemSize: 1.1 }
const GOLEM_BOX = { feetX: 80, feetY: 190 }
const golemAt = (x: number, size: number, lift = 0): string =>
  `translate(${r1(x - GOLEM_BOX.feetX * size)} ${r1(FLOOR - GOLEM_BOX.feetY * size + lift)}) scale(${size})`

const hero: SceneSpec = {
  realm: 'chaos',
  figure: (scene) => (
    <>
      <g transform={place(HERO.golem)}>
        <SelectRing name="golem-ring" rx={96} />
      </g>
      <g data-fx="golem-at" transform={golemAt(HERO.golem, HERO.golemSize)}>
        <GolemRise id={`golem-${scene.id}`} />
      </g>
      <KingUnit x={HERO.king} />
    </>
  ),
  bind: (stage) => {
    const king = kingNodes(stage)
    const rise = riseWriter(stage)
    const ring = fx(stage, 'golem-ring')
    const golem = fx(stage, 'golem-at')
    return (progress) => {
      rise(RISEN)
      poseKing(king, { x: HERO.king, ring: ramp(progress, 0.04, 0.1), hand: HAND_UP * ramp(progress, 0.1, 0.2) })
      fadeTo(ring, ramp(progress, 0.2, 0.26))
      transformTo(golem, golemAt(HERO.golem, HERO.golemSize, 8 * bell(progress, 0.26, 0.36)))
    }
  },
  peak: () => ({ progress: 0.4, reached: 0 }),
}

// About, the economy: per highlight he orders a worker to the mine, the worker walks out, mines, and carries the
// gold back to the hall, a glint at the drop. After the last a second worker comes out to join him.
const ABOUT = { king: 1100, hall: 1280, hallSize: 0.55, mine: 1600, mineSize: 0.8, from: 1360, to: 1510, second: 1420 }

const about: SceneSpec = {
  realm: 'chaos',
  figure: () => (
    <>
      <g transform={place(ABOUT.hall, 1, FLOOR, ABOUT.hallSize)}>
        <Hall name="hall" />
      </g>
      <g transform={place(ABOUT.mine, 1, FLOOR, ABOUT.mineSize)}>
        <GoldMine name="mine" light={REALM.chaosFireBright} />
      </g>
      <g transform={place(ABOUT.mine)}>
        <OrderMarker name="marker" />
      </g>
      <g transform={`translate(${ABOUT.hall} ${FLOOR - 130})`}>
        <Glint name="drop" size={18} />
      </g>
      <g data-fx="second-at" opacity="0">
        <Worker name="second" />
      </g>
      <Worker name="worker" />
      <KingUnit x={ABOUT.king} />
    </>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const worker = unitNodes(stage, 'worker')
    const sack = fx(stage, 'worker-sack')
    const marker = fx(stage, 'marker')
    const glint = fx(stage, 'drop')
    const second = fx(stage, 'second-at')
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      const out = ramp(f, 0.2, 0.5)
      const back = ramp(f, 0.6, 0.9)
      const x = lerp(ABOUT.from, ABOUT.to, out - back)
      const home = back > 0
      poseKing(king, { x: ABOUT.king, ...order(f) })
      fadeTo(marker, bell(f, 0.05, 0.35))
      transformTo(worker.root, `${place(x, home ? -1 : 1)} translate(0 ${r1(stride(x))})`)
      swingArm(worker.arm, blow(ramp(f, 0.5, 0.6)))
      fadeTo(sack, home ? 1 : 0)
      fadeTo(glint, bell(f, 0.88, 1))
      transformTo(second, place(lerp(ABOUT.hall, ABOUT.second, close)))
      fadeTo(second, ramp(close, 0, 0.2))
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.75 }),
}

// Work, the base going up: per job he orders the build, the worker hammers under the scaffold and the hall rises
// a card's share of its five stages. After the last the banner goes up on its top.
const WORK = { king: 1100, worker: 1270, hall: 1450, bannerRise: 40 }

const work: SceneSpec = {
  realm: 'chaos',
  figure: () => (
    <>
      <g transform={place(WORK.hall)}>
        <Hall name="hall" />
      </g>
      <g transform={place(WORK.worker)}>
        <Worker name="worker" />
      </g>
      <KingUnit x={WORK.king} />
    </>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const arm = fx(stage, 'worker-arm')
    const parts = Array.from({ length: HALL_STAGES }, (_, i) => fx(stage, `hall-${i}`))
    const scaffold = fx(stage, 'hall-scaffold')
    const banner = fx(stage, 'hall-banner')
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, scene.count)
      const raising = ramp(f, 0.25, 0.85)
      const built = ((card + raising) * HALL_STAGES) / scene.count
      poseKing(king, { x: WORK.king, ...order(f) })
      swingArm(arm, f > 0.2 && f < 0.85 ? -60 * Math.abs(Math.sin(f * Math.PI * 6)) : 0)
      for (const [i, part] of parts.entries()) {
        const up = clamp01(built - i)
        transformTo(part, `scale(1 ${up.toFixed(3)})`)
        fadeTo(part, up > 0 ? 1 : 0)
      }
      fadeTo(scaffold, bell(f, 0.15, 0.9) * (close > 0 ? 0 : 1))
      transformTo(banner, `translate(0 ${r1(WORK.bannerRise * (1 - close))})`)
      fadeTo(banner, ramp(close, 0, 0.3))
    }
  },
  peak: () => ({ progress: CLOSE[1], reached: Number.MAX_SAFE_INTEGER }),
}

// The Tech Stack, training: per category he orders a soldier, the barracks door lights and the soldier steps
// out to his place in the rank by the rally flag. After the last he drags a box over the rank, its rings light,
// he points it on and a marker blinks where it goes, the rank leaning into the march.
const TECH = { king: 1100, flag: 1320, barracks: 1570, rank: [1200, 1450] as const, backRow: 26, march: 1660 }

/** Where soldier i of `count` stands: two rows near the flag, the back row a little up the field. */
const rankSlot = (i: number, count: number): { x: number; y: number } => {
  const columns = Math.ceil(count / 2)
  const xs = spread(columns, ...TECH.rank)
  return { x: xs[Math.floor(i / 2)], y: FLOOR - (i % 2 === 0 ? TECH.backRow : 0) }
}

const tech: SceneSpec = {
  realm: 'chaos',
  figure: (scene) => (
    <>
      <g transform={place(TECH.barracks)}>
        <Barracks name="barracks" />
      </g>
      <g transform={place(TECH.flag, 1, FLOOR - TECH.backRow)}>
        <RallyFlag />
      </g>
      <g transform={place(lerp(...TECH.rank, 0.5), 1, FLOOR + 6)}>
        <SelectBox name="box" width={TECH.rank[1] - TECH.rank[0] + 90} height={110} />
      </g>
      <g transform={place(TECH.march)}>
        <OrderMarker name="marker" />
      </g>
      {Array.from({ length: scene.count }, (_, i) => {
        const slot = rankSlot(i, scene.count)
        return (
          <g key={i}>
            <g transform={`translate(${slot.x} ${slot.y})`}>
              <SelectRing name={`ring-${i}`} rx={24} />
            </g>
            <g data-fx={`soldier-at-${i}`} opacity="0">
              <Soldier name={`soldier-${i}`} side="ours" />
            </g>
          </g>
        )
      })}
      <KingUnit x={TECH.king} />
    </>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const door = fx(stage, 'barracks-door')
    const box = fx(stage, 'box')
    const marker = fx(stage, 'marker')
    const soldiers = Array.from({ length: scene.count }, (_, i) => ({ at: fx(stage, `soldier-at-${i}`), ring: fx(stage, `ring-${i}`), slot: rankSlot(i, scene.count) }))
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, scene.count)
      const boxed = ramp(close, 0, 0.3)
      poseKing(king, { x: TECH.king, ...(close > 0 ? { hand: HAND_UP * bell(close, 0.35, 0.75) } : order(f)) })
      fadeTo(door, 0.7 * bell(f, 0.15, 0.45) * (close > 0 ? 0 : 1))
      transformTo(box, `scale(${boxed.toFixed(3)} 1)`)
      fadeTo(box, boxed * (1 - ramp(close, 0.6, 0.8)))
      fadeTo(marker, bell(close, 0.5, 0.9))
      for (const [i, { at, ring, slot }] of soldiers.entries()) {
        const walk = i < card ? 1 : i === card ? ramp(f, 0.35, 0.9) : 0
        const x = lerp(TECH.barracks, slot.x, walk)
        const y = lerp(FLOOR, slot.y, walk)
        const lean = 6 * ramp(close, 0.6, 1)
        transformTo(at, `${place(x, walk < 1 ? -1 : 1, y)} translate(0 ${r1(walk < 1 ? stride(x) : 0)}) rotate(${r1(lean)})`)
        fadeTo(at, i < card ? 1 : i === card ? ramp(f, 0.25, 0.35) : 0)
        fadeTo(ring, ramp(close, 0.3, 0.45))
      }
    }
  },
  peak: () => ({ progress: closeAt(0.55), reached: Number.MAX_SAFE_INTEGER }),
}

// Services, a creep camp: per service he points his blade at a creep, his troop strikes and it falls, a coin's
// glint over it. After the last he levels up in the gold column, the camera pushed in on him.
const SERVICES = { king: 1100, troop: [1250, 1290, 1330] as const, troopStep: 30, camp: [1470, 1680] as const, backRow: 22, zoom: 1.25 }

const creepSlot = (i: number, count: number): { x: number; y: number } => ({
  x: spread(count, ...SERVICES.camp)[i],
  y: FLOOR - (i % 2 === 1 ? SERVICES.backRow : 0),
})

const services: SceneSpec = {
  realm: 'chaos',
  figure: (scene) => (
    <g data-fx="camera">
      {Array.from({ length: scene.count }, (_, i) => {
        const slot = creepSlot(i, scene.count)
        return (
          <g key={i}>
            <g data-fx={`creep-at-${i}`} transform={place(slot.x, -1, slot.y)}>
              <Creep name={`creep-${i}`} />
            </g>
            <g transform={`translate(${slot.x} ${slot.y - 90})`}>
              <Glint name={`coin-${i}`} />
            </g>
          </g>
        )
      })}
      {SERVICES.troop.map((x, i) => (
        <g key={x} transform={place(x)}>
          <Soldier name={`troop-${i}`} side="ours" />
        </g>
      ))}
      <g transform={place(SERVICES.king)}>
        <LevelColumn name="level" />
      </g>
      <KingUnit x={SERVICES.king} />
    </g>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const camera = fx(stage, 'camera')
    const level = fx(stage, 'level')
    const troop = SERVICES.troop.map((x, i) => ({ x, ...unitNodes(stage, `troop-${i}`) }))
    const creeps = Array.from({ length: scene.count }, (_, i) => ({ at: fx(stage, `creep-at-${i}`), coin: fx(stage, `coin-${i}`), slot: creepSlot(i, scene.count) }))
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, scene.count)
      const push = ramp(close, 0, 0.5)
      poseKing(king, { x: SERVICES.king, ...(close > 0 ? { hand: HAND_UP * ramp(close, 0, 0.2) } : point(f)) })
      transformTo(camera, focusOn(SERVICES.king, FLOOR - 160, lerp(1, SERVICES.zoom, push)))
      fadeTo(level, ramp(close, 0.1, 0.35))
      for (const { x, root, arm } of troop) {
        const step = SERVICES.troopStep * bell(f, 0.25, 0.75) * (close > 0 ? 0 : 1)
        transformTo(root, place(x + step))
        swingArm(arm, close > 0 ? 0 : blow(ramp(f, 0.3, 0.65)))
      }
      for (const [i, { at, coin, slot }] of creeps.entries()) {
        const down = i < card || close > 0 ? 1 : i === card ? ramp(f, 0.55, 0.8) : 0
        transformTo(at, `${place(slot.x, -1, slot.y)} rotate(${r1(-80 * down)})`)
        fadeTo(at, 1 - 0.65 * down)
        fadeTo(coin, i === card && close === 0 ? bell(f, 0.72, 1) : 0)
      }
    }
  },
  peak: () => ({ progress: closeAt(0.6), reached: Number.MAX_SAFE_INTEGER }),
}

// Projects, the spell: per project an enemy column marches over the frozen lake, he raises his blade, ice shards
// fall on it and it falls. After the last he raises the fallen as his own, standing and turning to face out.
const PROJECTS = { king: 340, column: [690, 750, 810] as const, enter: 190, shardsPer: 2 }

const projects: SceneSpec = {
  realm: 'frost',
  figure: (scene) => (
    <>
      {PROJECTS.column.map((x, j) => (
        <g key={x} data-fx={`foe-at-${j}`} transform={place(x, -1)}>
          <g data-fx={`foe-live-${j}`}>
            <Soldier name={`foe-${j}`} side="enemy" />
          </g>
          <g data-fx={`foe-raised-${j}`} opacity="0">
            <Soldier name={`raised-${j}`} side="raised" />
          </g>
        </g>
      ))}
      {PROJECTS.column.flatMap((x, j) =>
        Array.from({ length: PROJECTS.shardsPer }, (_, k) => (
          <g key={`${j}-${k}`} data-fx={`shard-at-${j}-${k}`} transform={`translate(${x} ${FLOOR})`}>
            <IceShard name={`shard-${j}-${k}`} />
          </g>
        )),
      )}
      <KingUnit x={PROJECTS.king} figure={scene.figure} />
    </>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const last = scene.count - 1
    const foes = PROJECTS.column.map((x, j) => ({ x, at: fx(stage, `foe-at-${j}`), live: fx(stage, `foe-live-${j}`), raised: fx(stage, `foe-raised-${j}`) }))
    const shards = PROJECTS.column.flatMap((x, j) =>
      Array.from({ length: PROJECTS.shardsPer }, (_, k) => ({ x: x + (k === 0 ? -14 : 16), delay: 0.06 * (j + k), at: fx(stage, `shard-at-${j}-${k}`), node: fx(stage, `shard-${j}-${k}`) })),
    )
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, scene.count)
      const march = ramp(f, 0, 0.35)
      const fall = close > 0 ? 1 : ramp(f, 0.6, 0.85)
      const gone = card < last ? ramp(f, 0.9, 1) : 0
      const rise = ramp(close, 0.2, 0.6)
      const turn = ramp(close, 0.6, 0.8)
      poseKing(king, { x: PROJECTS.king, ...(close > 0 ? { blade: BLADE_UP * bell(close, 0, 0.6), glow: lerp(GLOW_REST, GLOW_CAST, bell(close, 0, 0.6)) } : cast(f)) })
      for (const { x, at, live, raised } of foes) {
        const fx0 = x + PROJECTS.enter * (1 - march)
        const lying = fall * (1 - rise)
        transformTo(at, `${place(fx0, turn > 0.5 ? 1 : -1)} translate(0 ${r1(march < 1 ? stride(fx0) : 0)}) rotate(${r1(-75 * lying)})`)
        fadeTo(at, close > 0 ? 1 : ramp(f, 0, 0.1) * (1 - 0.5 * fall) * (1 - gone))
        fadeTo(live, 1 - rise)
        fadeTo(raised, rise)
      }
      for (const { x, delay, at, node } of shards) {
        const t = close > 0 ? 0 : ramp(f, 0.4 + delay, 0.6 + delay)
        transformTo(at, `translate(${r1(x)} ${r1(FLOOR - 40 - 520 + drop(t, 520))})`)
        fadeTo(node, t > 0 && t < 1 ? 1 : 0)
      }
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.55 }),
}

// Ventures, claiming the mines: per venture he orders a dead worker to a gold mine, the worker walks to it and the
// mine's light rises over it, the mine his. After the last the mines pulse together.
const VENTURES = { king: 320, start: 420, mines: [540, 800] as const, mineSize: 0.6 }

const ventures: SceneSpec = {
  realm: 'frost',
  figure: (scene) => (
    <>
      {spread(scene.count, ...VENTURES.mines).map((x, i) => (
        <g key={i} transform={place(x, 1, FLOOR, VENTURES.mineSize)}>
          <GoldMine name={`mine-${i}`} light={REALM.frostIceMid} />
        </g>
      ))}
      <Worker name="worker" pale />
      <KingUnit x={VENTURES.king} figure={scene.figure} />
    </>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const xs = spread(scene.count, ...VENTURES.mines)
    const worker = fx(stage, 'worker')
    const lights = xs.map((_, i) => fx(stage, `mine-${i}-light`))
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, scene.count)
      const from = card === 0 ? VENTURES.start : xs[card - 1] - 50
      const x = lerp(from, xs[card] - 50, ramp(f, 0.25, 0.7))
      poseKing(king, { x: VENTURES.king, ...order(f) })
      transformTo(worker, `${place(x)} translate(0 ${r1(stride(x))})`)
      for (const [i, light] of lights.entries()) {
        const claimed = i < card ? 1 : i === card ? ramp(f, 0.6, 0.95) : 0
        transformTo(light, `scale(1 ${claimed.toFixed(3)})`)
        fadeTo(light, claimed * (1 + 0.6 * bell(close, 0, 0.6)) * 0.7)
      }
    }
  },
  peak: (count) => ({ progress: SETTLED_PROGRESS, reached: count - 1 + 0.85 }),
}

// Bands, the aura: per band he raises his blade, his aura spreads out from him and his raised soldiers march a
// step in time to it. After the last the march halts in line, the aura held at its widest.
const BANDS = { king: 340, rank: [500, 640, 720, 800] as const, march: 120 }

const bands: SceneSpec = {
  realm: 'frost',
  figure: (scene) => (
    <>
      <g data-fx="aura-at" transform={place(BANDS.king)}>
        <AuraRing name="aura" />
      </g>
      {BANDS.rank.map((x, i) => (
        <g key={x} data-fx={`marcher-${i}`} transform={place(x)}>
          <Soldier name={`raised-${i}`} side="raised" />
        </g>
      ))}
      <KingUnit x={BANDS.king} figure={scene.figure} />
    </>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const aura = fx(stage, 'aura')
    const auraAt = fx(stage, 'aura-at')
    const marchers = BANDS.rank.map((x, i) => ({ x, node: fx(stage, `marcher-${i}`) }))
    const step = BANDS.march / scene.count
    return (progress, reached) => {
      const { card, f, close } = beatOf(progress, reached, scene.count)
      const spreadOut = close > 0 ? 1 : ramp(f, 0.2, 0.7)
      poseKing(king, { x: BANDS.king, ...(close > 0 ? { blade: BLADE_UP, glow: GLOW_CAST } : cast(f)) })
      transformTo(auraAt, `${place(BANDS.king)} scale(${lerp(0.3, close > 0 ? 2.2 : 2.6, spreadOut).toFixed(3)})`)
      fadeTo(aura, close > 0 ? 0.85 * ramp(close, 0, 0.3) : 1 - ramp(f, 0.45, 0.75))
      for (const { x, node } of marchers) {
        const walked = step * (card + ramp(f, 0.45, 0.75))
        transformTo(node, `${place(x + walked)} translate(0 ${r1(-6 * bell(f, 0.45, 0.75))})`)
      }
    }
  },
  peak: () => ({ progress: closeAt(0.5), reached: Number.MAX_SAFE_INTEGER }),
}

// The Muay Thai record, a duel of champions: per line he steps in and cuts at the enemy champion, a stun's spark
// on it as it staggers, and it swings back. After the last he raises his blade and summons the meteor, which
// falls by the champion with a stun, the golem standing from its crater and the champion falling, the camera
// pushed in.
const DUEL = { king: 1130, step: 50, champion: 1580, crater: 1390, golemSize: 1.05, zoom: 1.18 }

const muayThai: SceneSpec = {
  realm: 'chaos',
  figure: (scene) => (
    <g data-fx="camera">
      <g data-fx="champion-at" transform={place(DUEL.champion)}>
        <Champion name="champion" />
      </g>
      <g transform={`translate(${DUEL.champion - 20} ${FLOOR - 150})`}>
        <Glint name="spark" size={22} fill={REALM.frostIceBright} />
      </g>
      <g transform={golemAt(DUEL.crater, DUEL.golemSize)}>
        <GolemRise id={`golem-${scene.id}`} />
      </g>
      <KingUnit x={DUEL.king} />
    </g>
  ),
  bind: (stage, scene) => {
    const king = kingNodes(stage)
    const camera = fx(stage, 'camera')
    const champion = fx(stage, 'champion-at')
    const axe = fx(stage, 'champion-arm')
    const spark = fx(stage, 'spark')
    const rise = riseWriter(stage)
    return (progress, reached) => {
      const { f, close } = beatOf(progress, reached, scene.count)
      const lunge = close > 0 ? 0 : bell(f, 0.1, 0.6)
      const cut = close > 0 ? 0 : f < 0.3 ? BLADE_UP * 0.7 * ramp(f, 0.05, 0.3) : lerp(BLADE_UP * 0.7, -20, ramp(f, 0.3, 0.45)) * (1 - ramp(f, 0.7, 1))
      const stagger = close > 0 ? 0 : bell(f, 0.4, 0.8)
      const summon = bell(close, 0, 0.5)
      const fall = ramp(close, 0.15, 0.35)
      const down = ramp(close, 0.35, 0.6)
      poseKing(king, {
        x: DUEL.king + DUEL.step * lunge,
        blade: close > 0 ? BLADE_UP * summon : cut,
        glow: close > 0 ? lerp(GLOW_REST, GLOW_CAST, summon) : GLOW_REST,
      })
      transformTo(champion, `${place(DUEL.champion + 24 * stagger)} rotate(${r1(6 * stagger + 80 * down)})`)
      transformTo(axe, `rotate(${r1(close > 0 ? 0 : 50 * bell(f, 0.6, 0.9))} -37 -110)`)
      fadeTo(champion, 1 - 0.4 * down)
      fadeTo(spark, close > 0 ? bell(close, 0.33, 0.6) : bell(f, 0.38, 0.6))
      rise({ fall, burst: ramp(close, 0.35, 0.5), built: ROCK_COUNT * ramp(close, 0.45, 0.6), whole: ramp(close, 0.6, 0.75) })
      transformTo(camera, focusOn(DUEL.crater, FLOOR - 150, lerp(1, DUEL.zoom, ramp(close, 0.1, 0.45))))
    }
  },
  peak: () => ({ progress: closeAt(0.42), reached: Number.MAX_SAFE_INTEGER }),
}

// The contact: he waits before the ice throne, selected, and the order marker blinks once at his feet.
const CONTACT = { king: 340 }

const contact: SceneSpec = {
  realm: 'frost',
  figure: (scene) => (
    <>
      <g transform={place(CONTACT.king + 120)}>
        <OrderMarker name="marker" />
      </g>
      <KingUnit x={CONTACT.king} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const king = kingNodes(stage)
    const marker = fx(stage, 'marker')
    return (progress) => {
      poseKing(king, { x: CONTACT.king, ring: ramp(progress, 0.05, 0.12), hand: 40 * bell(progress, 0.12, 0.4) })
      fadeTo(marker, bell(progress, 0.12, 0.4))
    }
  },
  peak: () => ({ progress: 0.26, reached: 0 }),
}

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

// The cards a section counts, the shared count (stageItems): the record's facts and its achievements both.
const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number => {
  const { lead, count } = stageItems(slot, labels, highlights.length)
  return lead + count
}

export interface RealmScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  realm: Realm
  /** This stage's king is the world's figure (data-worlds-figure): the first frost stage only. */
  figure: boolean
}

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, figure: boolean): RealmScene => {
  const spec = SCENES[id]
  const scene: RealmScene = {
    id,
    slot,
    realm: spec.realm,
    count,
    figure,
    bind: (stage) => {
      const write = spec.bind(stage, scene)
      const peak = spec.peak(count)
      return (progress, reached) => {
        // Drawn settled (reduced motion), the scene holds its peak.
        if (progress === SETTLED_PROGRESS && reached >= count) write(peak.progress, Math.min(peak.reached, count))
        else write(progress, reached)
      }
    },
  }
  return scene
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[]): RealmScene[] {
  const firstFrost = slots.find((slot) => REALM_OF[slot.id] === 'frost')?.id ?? 'contact'
  return [
    sceneOf('hero', null, 0, false),
    ...slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights), slot.id === firstFrost)),
    sceneOf('contact', null, 0, firstFrost === 'contact'),
  ]
}

/** A scene's field: its units in the 1920 by 1080 picture, cut from its foot to the screen. */
function Field({ scene }: { scene: RealmScene }) {
  return (
    <svg className="block h-full w-full" viewBox={`0 0 ${FIELD.width} ${FIELD.height}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g className={scene.realm === 'chaos' ? look.chaosBand : look.frostBand}>{SCENES[scene.id].figure(scene)}</g>
    </svg>
  )
}

/** A scene's picture: its realm's land under the vignette, then the field. */
export function RealmStage({ scene, settled = false }: { scene: RealmScene; settled?: boolean }) {
  return (
    <Stage
      scene={scene}
      motion={REALM_MOTION}
      settled={settled}
      className={look.stage}
      layers={[
        {
          name: 'land',
          node: (
            <>
              {scene.realm === 'chaos' ? <ChaosLand /> : <FrostLand />}
              <div className={look.vignette} />
            </>
          ),
        },
        { name: 'figure', node: <Field scene={scene} /> },
      ]}
    />
  )
}
