'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { drop } from '@/lib/motion/arc'
import { sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, focusOn, fx, lerp, r1, spread, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { ChaosLand } from './chaosZone'
import { FrostLand } from './frostZone'
import { GolemRise, RISEN, ROCK_COUNT, riseWriter } from './golem'
import { King, KING_BLADE_AT, KING_FEET, KING_HAND_AT } from './hero'
import { REALM } from './palette'
import {
  AuraRing,
  Barracks,
  Champion,
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

// The two realms as the page's scenes, a real time strategy campaign told in order with him as the hero unit:
// the frost king, selected with his ring, on the field in every scene. First the chaos field, his warband
// against the kingdom: the hero selects the golem, About gathers gold, Work raises the hall, the Tech Stack
// trains the rank and sends it on, and Services is the clash, the kingdom's blue line falling to his warband.
// Then the frost: in Projects his ice kills the kingdom's column and he raises its fallen as his own dead,
// Ventures sends a dead worker to claim the mines, Bands spreads his aura and the dead march to it, and the
// contact waits for the next order. The Muay Thai record is a duel with a champion closed by the meteor and the
// golem. Each scene is a short script of one to three actions the shared scene player moves through
// (src/lib/scroll/player.ts), each at its own pace and never per card; every frame is a function of the
// playhead alone, so an action reads the same played backward, and the end frame is the one a scene drawn
// settled (reduced motion) shows.

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

/** How far action `i` has played at `play`: all of it once a later one plays, `t` while it plays, none before. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** A bump from 0 up to 1 and back over [from, to] of t. */
const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

/** His gesture over an action: up over its first fifth, held while his units answer, down over its last fifth. */
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

/** An order: the free hand raised over the action's gesture. */
const order = (f: number): Pick<KingPose, 'hand'> => ({ hand: HAND_UP * gesture(f) })
/** A spell: the blade raised and lit over the action's gesture. */
const cast = (f: number): Pick<KingPose, 'blade' | 'glow'> => ({ blade: BLADE_UP * gesture(f), glow: lerp(GLOW_REST, GLOW_CAST, gesture(f)) })

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

/** A scene's writer: the frame at the playhead. The land's push in is the theatre's own. */
type SceneWriter = (play: Playhead) => void

interface SceneSpec {
  realm: Realm
  script: SceneScript
  figure: (scene: RealmScene) => ReactNode
  bind: (stage: HTMLElement, scene: RealmScene) => SceneWriter
}

// The hero: he stands by the golem. His ring lights and he raises his hand for an order, then the golem's ring
// lights and the golem nods to it as his hand comes down.
const HERO = { king: 1130, golem: 1460, golemSize: 1.1 }
const GOLEM_BOX = { feetX: 80, feetY: 190 }
const golemAt = (x: number, size: number, lift = 0): string =>
  `translate(${r1(x - GOLEM_BOX.feetX * size)} ${r1(FLOOR - GOLEM_BOX.feetY * size + lift)}) scale(${size})`

const hero: SceneSpec = {
  realm: 'chaos',
  script: [1400, 1600],
  figure: (scene) => (
    <>
      <g transform={place(HERO.golem)}>
        <SelectRing name="golem-ring" rx={96} />
      </g>
      <g data-fx="golem-at" transform={golemAt(HERO.golem, HERO.golemSize)}>
        <GolemRise id={`golem-${scene.id}`} />
      </g>
      <KingUnit x={HERO.king} figure={scene.figure} />
    </>
  ),
  bind: (stage) => {
    const king = kingNodes(stage)
    const rise = riseWriter(stage)
    const ring = fx(stage, 'golem-ring')
    const golem = fx(stage, 'golem-at')
    return (play) => {
      const ordered = share(play, 0)
      const answered = share(play, 1)
      rise(RISEN)
      poseKing(king, { x: HERO.king, ring: ramp(ordered, 0, 0.4), hand: HAND_UP * ramp(ordered, 0.3, 1) * (1 - ramp(answered, 0.6, 1)) })
      fadeTo(ring, ramp(answered, 0, 0.3))
      transformTo(golem, golemAt(HERO.golem, HERO.golemSize, 8 * bell(answered, 0.2, 0.8)))
    }
  },
}

// About, the economy: he orders a worker to the mine and the worker walks out to it, mines two blows of gold and
// carries it back to the hall, a glint at the drop, while a second worker steps out to join him.
const ABOUT = { king: 1100, hall: 1280, hallSize: 0.55, mine: 1600, mineSize: 0.8, from: 1360, to: 1510, second: 1420 }

const about: SceneSpec = {
  realm: 'chaos',
  script: [1800, 1400, 1800],
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
  bind: (stage) => {
    const king = kingNodes(stage)
    const worker = unitNodes(stage, 'worker')
    const sack = fx(stage, 'worker-sack')
    const marker = fx(stage, 'marker')
    const glint = fx(stage, 'drop')
    const second = fx(stage, 'second-at')
    return (play) => {
      const out = share(play, 0)
      const mined = play.action === 1 ? play.t : 0
      const back = share(play, 2)
      const home = play.action === 2
      const x = lerp(ABOUT.from, ABOUT.to, out - back)
      const walking = (out > 0 && out < 1) || (back > 0 && back < 1)
      poseKing(king, { x: ABOUT.king, hand: HAND_UP * bell(out, 0, 0.6) })
      fadeTo(marker, bell(out, 0, 0.5))
      transformTo(worker.root, `${place(x, home ? -1 : 1)} translate(0 ${r1(walking ? stride(x) : 0)})`)
      swingArm(worker.arm, blow((mined * 2) % 1))
      fadeTo(sack, home ? 1 : 0)
      fadeTo(glint, bell(back, 0.8, 1))
      transformTo(second, place(lerp(ABOUT.hall, ABOUT.second, ramp(back, 0.4, 1))))
      fadeTo(second, ramp(back, 0.4, 0.6))
    }
  },
}

// Work, the base going up: he orders the build and the worker hammers under the scaffold while the hall rises
// through its five stages, then the scaffold comes down and the banner goes up on its top.
const WORK = { king: 1100, worker: 1270, hall: 1450, bannerRise: 40 }

const work: SceneSpec = {
  realm: 'chaos',
  script: [2800, 1400],
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
  bind: (stage) => {
    const king = kingNodes(stage)
    const arm = fx(stage, 'worker-arm')
    const parts = Array.from({ length: HALL_STAGES }, (_, i) => fx(stage, `hall-${i}`))
    const scaffold = fx(stage, 'hall-scaffold')
    const banner = fx(stage, 'hall-banner')
    return (play) => {
      const raised = share(play, 0)
      const flown = share(play, 1)
      const built = raised * HALL_STAGES
      poseKing(king, { x: WORK.king, ...order(raised) })
      swingArm(arm, play.action === 0 ? -60 * Math.abs(Math.sin(raised * Math.PI * 8)) : 0)
      for (const [i, part] of parts.entries()) {
        const up = clamp01(built - i)
        transformTo(part, `scale(1 ${up.toFixed(3)})`)
        fadeTo(part, up > 0 ? 1 : 0)
      }
      fadeTo(scaffold, ramp(raised, 0, 0.05) * (1 - ramp(flown, 0, 0.3)))
      transformTo(banner, `translate(0 ${r1(WORK.bannerRise * (1 - flown))})`)
      fadeTo(banner, ramp(flown, 0, 0.3))
    }
  },
}

// The Tech Stack, training: he orders the rank and a soldier per category steps out of the barracks after the
// one before to his place by the rally flag. Then he drags a box over the rank, its rings light, he points it
// on towards the kingdom's line and a marker blinks where it goes, the rank leaning into the march.
const TECH = { king: 1100, flag: 1320, barracks: 1570, rank: [1200, 1450] as const, backRow: 26, march: 1660 }

/** Where soldier i of `count` stands: two rows near the flag, the back row a little up the field. */
const rankSlot = (i: number, count: number): { x: number; y: number } => {
  const columns = Math.ceil(count / 2)
  const xs = spread(columns, ...TECH.rank)
  return { x: xs[Math.floor(i / 2)], y: FLOOR - (i % 2 === 0 ? TECH.backRow : 0) }
}

/** How far soldier i of `count` has walked from the door when the training is `t` through: one after another. */
const trainedOf = (t: number, i: number, count: number): number => {
  const start = (i / Math.max(1, count)) * 0.65
  return ramp(t, start, start + 0.35)
}

const tech: SceneSpec = {
  realm: 'chaos',
  script: [2600, 2000],
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
    return (play) => {
      const trained = share(play, 0)
      const sent = share(play, 1)
      const boxed = ramp(sent, 0, 0.3)
      poseKing(king, { x: TECH.king, hand: play.action === 0 ? HAND_UP * gesture(trained) : HAND_UP * bell(sent, 0.35, 0.75) })
      fadeTo(door, 0.7 * bell(trained, 0, 1))
      transformTo(box, `scale(${boxed.toFixed(3)} 1)`)
      fadeTo(box, boxed * (1 - ramp(sent, 0.6, 0.8)))
      fadeTo(marker, bell(sent, 0.5, 0.9))
      for (const [i, { at, ring, slot }] of soldiers.entries()) {
        const walk = trainedOf(trained, i, scene.count)
        const x = lerp(TECH.barracks, slot.x, walk)
        const y = lerp(FLOOR, slot.y, walk)
        const lean = 6 * ramp(sent, 0.6, 1)
        transformTo(at, `${place(x, walk < 1 ? -1 : 1, y)} translate(0 ${r1(walk > 0 && walk < 1 ? stride(x) : 0)}) rotate(${r1(lean)})`)
        fadeTo(at, ramp(walk, 0, 0.1))
        fadeTo(ring, ramp(sent, 0.3, 0.45))
      }
    }
  },
}

// Services, the clash: the kingdom's blue line marches in from the right, he points his blade at it and his
// warband steps in and strikes, the kingdom's soldiers falling one after another. Then he levels up in the gold
// column with the camera pushed in on him.
const SERVICES = { king: 1100, troop: [1250, 1290, 1330] as const, troopStep: 30, foes: [1400, 1480, 1560] as const, backRow: 22, enter: 260, zoom: 1.25 }

const services: SceneSpec = {
  realm: 'chaos',
  script: [1600, 1800, 1400],
  figure: () => (
    <g data-fx="camera">
      {SERVICES.foes.map((x, i) => (
        <g key={x} data-fx={`foe-at-${i}`} transform={place(x, -1, FLOOR - (i % 2 === 1 ? SERVICES.backRow : 0))}>
          <Soldier name={`foe-${i}`} side="enemy" />
        </g>
      ))}
      {SERVICES.troop.map((x, i) => (
        <g key={x} data-fx={`troop-at-${i}`} transform={place(x)}>
          <Soldier name={`troop-${i}`} side="ours" />
        </g>
      ))}
      <g transform={place(SERVICES.king)}>
        <LevelColumn name="level" />
      </g>
      <KingUnit x={SERVICES.king} />
    </g>
  ),
  bind: (stage) => {
    const king = kingNodes(stage)
    const camera = fx(stage, 'camera')
    const level = fx(stage, 'level')
    const troop = SERVICES.troop.map((x, i) => ({ x, root: fx(stage, `troop-at-${i}`), arm: fx(stage, `troop-${i}-arm`) }))
    const foes = SERVICES.foes.map((x, i) => ({ x, y: FLOOR - (i % 2 === 1 ? SERVICES.backRow : 0), at: fx(stage, `foe-at-${i}`) }))
    return (play) => {
      const marched = share(play, 0)
      const struck = share(play, 1)
      const levelled = share(play, 2)
      const blade = BLADE_POINT * ramp(marched, 0.5, 1) * (1 - ramp(struck, 0.7, 1))
      poseKing(king, { x: SERVICES.king, blade, hand: HAND_UP * ramp(levelled, 0, 0.25) })
      transformTo(camera, focusOn(SERVICES.king, FLOOR - 160, lerp(1, SERVICES.zoom, ramp(levelled, 0, 0.6))))
      fadeTo(level, ramp(levelled, 0.1, 0.4))
      for (const { x, root, arm } of troop) {
        transformTo(root, place(x + SERVICES.troopStep * bell(struck, 0.1, 0.8)))
        swingArm(arm, play.action === 1 ? blow(ramp(struck, 0.2, 0.6)) : 0)
      }
      for (const [i, { x, y, at }] of foes.entries()) {
        const fx0 = x + SERVICES.enter * (1 - marched)
        const down = ramp(struck, 0.45 + 0.1 * i, 0.65 + 0.1 * i)
        transformTo(at, `${place(fx0, -1, y)} translate(0 ${r1(marched < 1 ? stride(fx0) : 0)}) rotate(${r1(-80 * down)})`)
        fadeTo(at, ramp(marched, 0, 0.2) * (1 - 0.5 * down))
      }
    }
  },
}

// Projects, the frost: the kingdom's column marches over the frozen lake, he raises his blade and ice falls on
// it and its soldiers fall. Then he raises his hand, a cold ring glows under each body and the fallen stand up
// as his own dead, turning to face out with him, a trace of the ring left under their feet.
const PROJECTS = { king: 340, column: [690, 750, 810] as const, enter: 190, shardsPer: 2 }

const projects: SceneSpec = {
  realm: 'frost',
  script: [1600, 1600, 1800],
  figure: (scene) => (
    <>
      {PROJECTS.column.map((x, j) => (
        <g key={x} transform={`${place(x)} scale(0.6)`}>
          <AuraRing name={`grave-${j}`} fill={REALM.frostIceBright} />
        </g>
      ))}
      {PROJECTS.column.map((x, j) => (
        <g key={x} data-fx={`foe-at-${j}`} transform={place(x)}>
          <g data-fx={`foe-live-${j}`} opacity="0">
            <Soldier name={`foe-${j}`} side="enemy" />
          </g>
          <g data-fx={`foe-raised-${j}`}>
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
  bind: (stage) => {
    const king = kingNodes(stage)
    const foes = PROJECTS.column.map((x, j) => ({
      x,
      at: fx(stage, `foe-at-${j}`),
      live: fx(stage, `foe-live-${j}`),
      raised: fx(stage, `foe-raised-${j}`),
      grave: fx(stage, `grave-${j}`),
    }))
    const shards = PROJECTS.column.flatMap((x, j) =>
      Array.from({ length: PROJECTS.shardsPer }, (_, k) => ({ x: x + (k === 0 ? -14 : 16), delay: 0.06 * (j + k), at: fx(stage, `shard-at-${j}-${k}`), node: fx(stage, `shard-${j}-${k}`) })),
    )
    return (play) => {
      const march = share(play, 0)
      const frozen = share(play, 1)
      const raising = share(play, 2)
      const fall = ramp(frozen, 0.45, 0.75)
      const rise = ramp(raising, 0.3, 0.7)
      const turn = ramp(raising, 0.75, 0.9)
      poseKing(king, {
        x: PROJECTS.king,
        ...(play.action === 2 ? { hand: HAND_UP * gesture(raising), glow: lerp(GLOW_REST, GLOW_CAST, gesture(raising)) } : cast(frozen)),
      })
      for (const { x, at, live, raised, grave } of foes) {
        const fx0 = x + PROJECTS.enter * (1 - march)
        const lying = fall * (1 - rise)
        transformTo(at, `${place(fx0, turn > 0.5 ? 1 : -1)} translate(0 ${r1(march < 1 ? stride(fx0) : 0)}) rotate(${r1(-75 * lying)})`)
        fadeTo(at, ramp(march, 0, 0.15) * (1 - 0.4 * lying))
        fadeTo(live, 1 - rise)
        fadeTo(raised, rise)
        fadeTo(grave, Math.max(bell(raising, 0, 0.8), 0.4 * ramp(raising, 0.5, 1)))
      }
      for (const { x, delay, at, node } of shards) {
        const t = ramp(frozen, 0.2 + delay, 0.45 + delay)
        transformTo(at, `translate(${r1(x)} ${r1(FLOOR - 40 - 520 + drop(t, 520))})`)
        fadeTo(node, t > 0 && t < 1 ? 1 : 0)
      }
    }
  },
}

// Ventures, claiming the mines: he orders a dead worker out and it walks along the near lane in front of the
// mines, each mine's light rising as it passes, to the last mine's door. Then the claimed mines pulse together.
const VENTURES = { king: 320, start: 420, mines: [540, 800] as const, mineSize: 0.6, lane: 26, door: 80 }

const ventures: SceneSpec = {
  realm: 'frost',
  script: [2600, 1400],
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
    const last = xs[xs.length - 1] - VENTURES.door
    const worker = fx(stage, 'worker')
    const lights = xs.map((_, i) => fx(stage, `mine-${i}-light`))
    return (play) => {
      const walked = share(play, 0)
      const pulse = bell(share(play, 1), 0, 1)
      const x = lerp(VENTURES.start, last, ramp(walked, 0.15, 1))
      poseKing(king, { x: VENTURES.king, ...order(walked) })
      transformTo(worker, `${place(x, 1, FLOOR + VENTURES.lane)} translate(0 ${r1(walked > 0 && walked < 1 ? stride(x) : 0)})`)
      for (const [i, light] of lights.entries()) {
        const claimed = clamp01((x - (xs[i] - VENTURES.door - 60)) / 60)
        transformTo(light, `scale(1 ${claimed.toFixed(3)})`)
        fadeTo(light, claimed * (1 + 0.6 * pulse) * 0.7)
      }
    }
  },
}

// Bands, the aura: he raises his blade and his aura spreads out from him, then his raised soldiers march out in
// step to it and halt in line, the aura held at its widest.
const BANDS = { king: 340, rank: [560, 640, 720, 800] as const, march: 120, steps: 3 }

const bands: SceneSpec = {
  realm: 'frost',
  script: [1600, 2400],
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
  bind: (stage) => {
    const king = kingNodes(stage)
    const aura = fx(stage, 'aura')
    const auraAt = fx(stage, 'aura-at')
    const marchers = BANDS.rank.map((x, i) => ({ x, node: fx(stage, `marcher-${i}`) }))
    return (play) => {
      const raised = share(play, 0)
      const marched = share(play, 1)
      poseKing(king, { x: BANDS.king, blade: BLADE_UP * ramp(raised, 0, 0.4), glow: lerp(GLOW_REST, GLOW_CAST, ramp(raised, 0, 0.4)) })
      transformTo(auraAt, `${place(BANDS.king)} scale(${lerp(0.3, 2.4, ramp(raised, 0.2, 1)).toFixed(3)})`)
      fadeTo(aura, 0.85 * ramp(raised, 0.2, 0.4))
      for (const { x, node } of marchers) {
        transformTo(node, `${place(x + BANDS.march * marched)} translate(0 ${r1(-6 * Math.abs(Math.sin(marched * Math.PI * BANDS.steps)))})`)
      }
    }
  },
}

// The Muay Thai record, a duel of champions: he steps in and cuts at the enemy champion, a stun's spark on it as
// it staggers and swings back. Then he raises his blade and summons the meteor, which falls by the champion and
// fells it, the camera pushed in, and the golem stands from its crater.
const DUEL = { king: 1130, step: 50, champion: 1580, crater: 1390, golemSize: 1.05, zoom: 1.18 }

const muayThai: SceneSpec = {
  realm: 'chaos',
  script: [1800, 1600, 1600],
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
  bind: (stage) => {
    const king = kingNodes(stage)
    const camera = fx(stage, 'camera')
    const champion = fx(stage, 'champion-at')
    const axe = fx(stage, 'champion-arm')
    const spark = fx(stage, 'spark')
    const rise = riseWriter(stage)
    return (play) => {
      const f = play.action === 0 ? play.t : 0
      const summoned = share(play, 1)
      const stood = share(play, 2)
      const lunge = bell(f, 0.1, 0.6)
      const cut = f < 0.3 ? BLADE_UP * 0.7 * ramp(f, 0.05, 0.3) : lerp(BLADE_UP * 0.7, -20, ramp(f, 0.3, 0.45)) * (1 - ramp(f, 0.7, 1))
      const stagger = bell(f, 0.4, 0.8)
      const summon = bell(summoned, 0, 0.6)
      const down = ramp(summoned, 0.6, 1)
      poseKing(king, {
        x: DUEL.king + DUEL.step * lunge,
        blade: play.action === 0 ? cut : BLADE_UP * summon,
        glow: lerp(GLOW_REST, GLOW_CAST, summon),
      })
      transformTo(champion, `${place(DUEL.champion + 24 * stagger)} rotate(${r1(6 * stagger + 80 * down)})`)
      transformTo(axe, `rotate(${r1(50 * bell(f, 0.6, 0.9))} -37 -110)`)
      fadeTo(champion, 1 - 0.4 * down)
      fadeTo(spark, Math.max(bell(f, 0.38, 0.6), bell(summoned, 0.55, 0.85)))
      rise({ fall: ramp(summoned, 0.3, 0.6), burst: ramp(stood, 0, 0.25), built: ROCK_COUNT * ramp(stood, 0.15, 0.6), whole: ramp(stood, 0.6, 0.9) })
      transformTo(camera, focusOn(DUEL.crater, FLOOR - 150, lerp(1, DUEL.zoom, ramp(summoned, 0.2, 0.9))))
    }
  },
}

// The contact: he waits before the ice throne; his ring lights, he lifts his hand and the order marker lights
// at his feet for the next order.
const CONTACT = { king: 340 }

const contact: SceneSpec = {
  realm: 'frost',
  script: [1600],
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
    return (play) => {
      const t = share(play, 0)
      poseKing(king, { x: CONTACT.king, ring: ramp(t, 0, 0.3), hand: 40 * ramp(t, 0.2, 0.6) })
      fadeTo(marker, ramp(t, 0.4, 0.7))
    }
  },
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
  /** This stage's king is the world's figure (data-worlds-figure): the hero's only, the one on screen at first
   *  paint at every width. */
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
    script: spec.script,
    bind: (stage) => {
      const write = spec.bind(stage, scene)
      const end = sceneEnd(spec.script)
      return (_progress, _reached, play = end) => write(play)
    },
  }
  return scene
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[]): RealmScene[] {
  return [
    sceneOf('hero', null, 0, true),
    ...slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights), false)),
    sceneOf('contact', null, 0, false),
  ]
}

/** The band a scene's units stand in (world.module.css): the hero's own, else its realm's. */
const bandOf = ({ id, realm }: RealmScene): string => (id === 'hero' ? look.heroBand : realm === 'chaos' ? look.chaosBand : look.frostBand)

/** A scene's field: its units in the 1920 by 1080 picture, cut from its foot to the screen. */
function Field({ scene }: { scene: RealmScene }) {
  return (
    <svg className="block h-full w-full" viewBox={`0 0 ${FIELD.width} ${FIELD.height}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g className={bandOf(scene)}>{SCENES[scene.id].figure(scene)}</g>
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
