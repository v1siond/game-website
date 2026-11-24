'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { hop } from '@/lib/motion/arc'
import { mix } from '@/lib/motion/rigPose'
import { elapsedOf, sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { ProfessionStage } from '@/components/themes/shared/professionStage'
import { bell, fadeTo, focusOn, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage, type StageLayer } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { BattleBug, BUG_ASPECT, DeadBugCreature, HIT_FLASH_OPACITY } from './bug'
import { BenchLight, Beetle, Gap, Lectern, MAP_INK, MapSheet, MasksAndVessel, SPIKE_TIP, SpikePit, StationBell, Wall } from './cavern'
import { ArmouredKnight, Bench, Crawler, Flier, SoulBolt } from './foes'
import { HallColumns, HallFloor, HallFront, HallLamps, HallLayer, HallSky } from './hall'
import { DARK_FANTASY } from './palette'
import {
  AIR,
  GUARD,
  HOLD,
  REST,
  SIT,
  cast,
  charge,
  CLING,
  dash,
  downStrike,
  draw,
  focus,
  greatSlash,
  rest,
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

// The wanderer's scenes, one per part of the page: the hero, each section the profession shows and the contact,
// every one the cavern hall (hall.tsx) lit in its own light. Each section is a few of the moves of the hand drawn
// bug kingdom adventure the world is drawn from, played by the shared scene player (src/lib/scroll/player.ts) at
// the scene's own pace, back on the way up, the end frame held: the hero draws the nail and slashes; About
// strikes a crawler for soul and Focuses it into a mended mask; Work bounces on the nail off a spike pit to the
// far side; the Tech Stack dashes over a drop, clings to the wall and jumps up to its ledge; Services takes the
// map off the cartographer's lectern and it draws itself; Projects is the boss, dashed through, struck three times
// and burst; Ventures bursts a crawler with the soul spell and knocks a flier out of the air; Bands rings the
// station bell and the great beetle runs in; the Muay Thai record clashes nails with the armoured knight and
// brings him to his knee with the great slash; the contact rests at the bench. He is the rigged side on figure
// (wanderer.tsx, posed by pose.ts).

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

// The floor line his soles stand on, his scale on it and the middle of his body above his soles.
const FLOOR_Y = 990
const SCALE = 1.9
const BOX = { width: WANDERER.width * SCALE, height: WANDERER.height * SCALE }
const BODY_UP = (WANDERER.soleY - WANDERER.bodyY) * SCALE
// Where he stands in most scenes: right of the text column, what he meets coming from the right.
const HOME_X = 1200

/** How far action `i` has played: all of it before, its eased share while it plays, none after. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** The point `t` of the way along a jump from (x0, lift0) to (x1, lift1) rising `height` over the straight line. */
const arc = (t: number, [x0, y0]: readonly [number, number], [x1, y1]: readonly [number, number], height: number): { x: number; lift: number } => ({
  x: lerp(x0, x1, t),
  lift: lerp(y0, y1, t) + 4 * height * t * (1 - t),
})

// ---- him ----

/** Where he is: his soles' x, how high he is off the floor, his facing and his whole figure's turn about his middle. */
interface Place {
  x: number
  lift?: number
  face?: 1 | -1
  turn?: number
}

const placeOf = ({ x, lift = 0, face = 1, turn = 0 }: Place): string =>
  `translate(${r1(x)} ${r1(FLOOR_Y - lift)}) scale(${face} 1) rotate(${r1(turn)} 0 ${r1(-BODY_UP)}) translate(${r1(-WANDERER.soleX * SCALE)} ${r1(-WANDERER.soleY * SCALE)})`

interface Him {
  root: Element | null
  joints: WandererJoints | null
}

const himIn = (stage: ParentNode): Him => {
  const root = fx(stage, 'wanderer')
  return { root, joints: root ? wandererJoints(root) : null }
}

const poseHim = ({ root, joints }: Him, place: Place, pose: WandererPose): void => {
  transformTo(root, placeOf(place))
  if (joints) setWandererPose(joints, pose, place.lift)
}

/** The wanderer, the one figure of every scene; the hero's is the world's figure. */
function Wanderer({ x, face = 1, figure = false }: { x: number; face?: 1 | -1; figure?: boolean }) {
  return (
    <g data-fx="wanderer" transform={placeOf({ x, face })}>
      <WandererSprite box={BOX} figure={figure} />
    </g>
  )
}

/** A burst of light where a struck thing breaks, in soul white or the infection's orange. */
function Burst({ name, color = DARK_FANTASY.soulBlue }: { name: string; color?: string }) {
  return (
    <g data-fx={name} opacity="0">
      <circle r="70" fill={color} opacity="0.35" />
      <circle r="34" fill={DARK_FANTASY.white} opacity="0.7" />
    </g>
  )
}

const burstAt = (node: Element | null, x: number, y: number, grow: number, shown: number): void => {
  transformTo(node, `translate(${r1(x)} ${r1(y)}) scale(${(0.5 + grow).toFixed(3)})`)
  fadeTo(node, shown)
}

// ---- the scenes ----

interface SceneSpec {
  light: string
  /** Each action's wished length in ms. */
  script: SceneScript
  /** The scene's own layer between the lamps and the columns (the hero's profession stage). */
  stage?: (profession: Profession) => ReactNode
  figure: (scene: DarkScene) => ReactNode
  bind: (stage: HTMLElement, scene: DarkScene) => (play: Playhead) => void
}

// ---- the hero: the nail drawn, the slash ----

const HERO_X = 1640

const hero: SceneSpec = {
  light: DARK_FANTASY.ethereal,
  script: [1300, 1300],
  stage: (profession) => <ProfessionStage profession={profession} p={DARK_FANTASY} />,
  figure: () => <Wanderer x={HERO_X} figure />,
  bind: (stage) => {
    const him = himIn(stage)
    return (play) => {
      const slashed = share(play, 1)
      poseHim(him, { x: HERO_X }, slashed > 0 ? slash(slashed) : draw(share(play, 0)))
    }
  },
}

// ---- About: soul from a strike, then Focus ----

const ABOUT = { hud: [1010, 700] as const, from: 1820, stop: 1400, masks: 4 }

const about: SceneSpec = {
  light: DARK_FANTASY.spiritGold,
  script: [1800, 1800],
  figure: () => (
    <>
      <g transform={`translate(${ABOUT.hud[0]} ${ABOUT.hud[1]})`}>
        <MasksAndVessel count={ABOUT.masks} />
      </g>
      <g data-fx="crawler" opacity="0">
        <Crawler />
      </g>
      <Burst name="burst" />
      <Wanderer x={HOME_X} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const crawler = fx(stage, 'crawler')
    const burst = fx(stage, 'burst')
    const soul = fx(stage, 'soul')
    const mended = fx(stage, 'mended')
    return (play) => {
      const struck = share(play, 0)
      const focused = share(play, 1)
      poseHim(him, { x: HOME_X }, focused > 0 ? focus(focused) : slash(ramp(struck, 0.4, 0.8), mix(REST, GUARD, ramp(struck, 0, 0.3))))
      transformTo(crawler, `translate(${r1(lerp(ABOUT.from, ABOUT.stop, ramp(struck, 0, 0.45)))} ${FLOOR_Y})`)
      fadeTo(crawler, struck > 0 ? 1 - ramp(struck, 0.58, 0.66) : 0)
      burstAt(burst, ABOUT.stop, FLOOR_Y - 50, ramp(struck, 0.58, 0.9), bell(struck, 0.56, 0.92))
      const filled = ramp(struck, 0.65, 0.95) * (1 - ramp(focused, 0.2, 0.8))
      transformTo(soul, `translate(0 -1) scale(${filled.toFixed(3)}) translate(0 1)`)
      fadeTo(mended, ramp(focused, 0.75, 0.85))
    }
  },
}

// ---- Work: bouncing on the nail across the spike pit ----

const PIT = { from: 1160, width: 400 }
// He meets the spikes with the crescent under his soles, so his soles stop this high over the floor.
const ON_SPIKES = SPIKE_TIP + 30
const WORK = { start: 1060, edge: 1140, hits: [1290, 1470] as const, land: 1690 }

const work: SceneSpec = {
  light: DARK_FANTASY.spiritGold,
  script: [1700, 1400, 1400],
  figure: () => (
    <>
      <g transform={`translate(${PIT.from} ${FLOOR_Y})`}>
        <SpikePit width={PIT.width} />
      </g>
      <Wanderer x={WORK.start} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    return (play) => {
      if (play.action === 0) {
        const t = play.t
        const leap = ramp(t, 0.25, 1)
        const at = t < 0.25 ? { x: lerp(WORK.start, WORK.edge, ramp(t, 0, 0.25)), lift: 0 } : arc(leap, [WORK.edge, 0], [WORK.hits[0], ON_SPIKES], 220)
        const pose = t < 0.25 ? run(4 * ramp(t, 0, 0.25)) : leap < 0.5 ? AIR : downStrike(ramp(leap, 0.5, 1))
        poseHim(him, at, pose)
        return
      }
      if (play.action === 1) {
        const at = arc(play.t, [WORK.hits[0], ON_SPIKES], [WORK.hits[1], ON_SPIKES], 260)
        poseHim(him, at, play.t < 0.5 ? mix(downStrike(1), AIR, ramp(play.t, 0, 0.3)) : downStrike(ramp(play.t, 0.5, 1)))
        return
      }
      const t = share(play, 2)
      const at = arc(t, [WORK.hits[1], ON_SPIKES], [WORK.land, 0], 240)
      poseHim(him, at, t < 0.85 ? mix(downStrike(1), AIR, ramp(t, 0, 0.3)) : mix(AIR, REST, ramp(t, 0.85, 1)))
    }
  },
}

// ---- Tech Stack: the dash over the drop, the wall cling and jump ----

const DROP = { from: 1200, width: 280 }
const WALL = { x: 1560, height: 380 }
const TECH = { start: 1080, takeoff: 1180, up: 180, wall: WALL.x - 40, slid: 140, kick: [1430, 300] as const, ledge: 1620 }

const tech: SceneSpec = {
  light: DARK_FANTASY.ethereal,
  script: [1600, 1700],
  figure: () => (
    <>
      <g transform={`translate(${DROP.from} ${FLOOR_Y})`}>
        <Gap width={DROP.width} />
      </g>
      <g transform={`translate(${WALL.x} ${FLOOR_Y})`}>
        <Wall height={WALL.height} />
      </g>
      <Wanderer x={TECH.start} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    return (play) => {
      if (play.action === 0) {
        const t = play.t
        if (t < 0.3) {
          const u = ramp(t, 0, 0.3)
          poseHim(him, { x: lerp(TECH.start, TECH.takeoff, u), lift: TECH.up * Math.sin((Math.PI / 2) * u) }, mix(REST, AIR, u))
          return
        }
        if (t < 0.7) {
          const u = ramp(t, 0.3, 0.7)
          poseHim(him, { x: lerp(TECH.takeoff, TECH.wall, u), lift: TECH.up }, dash(u))
          return
        }
        const u = ramp(t, 0.7, 1)
        poseHim(him, { x: TECH.wall, lift: lerp(TECH.up, TECH.slid, u), face: -1 }, mix(AIR, CLING, ramp(u, 0, 0.4)))
        return
      }
      const t = share(play, 1)
      if (t < 0.45) {
        const u = ramp(t, 0, 0.45)
        poseHim(him, { ...arc(u, [TECH.wall, TECH.slid], TECH.kick, 80), face: -1 }, mix(CLING, AIR, ramp(u, 0, 0.3)))
        return
      }
      const u = ramp(t, 0.45, 1)
      poseHim(him, arc(u, TECH.kick, [TECH.ledge, WALL.height], 120), u < 0.85 ? AIR : mix(AIR, REST, ramp(u, 0.85, 1)))
    }
  },
}

// ---- Services: the map off the cartographer's lectern ----

const SERVICES = { start: 1110, stop: 1340, lectern: 1450, map: [1430, 705] as const }

const services: SceneSpec = {
  light: DARK_FANTASY.brass,
  script: [1700, 2000],
  figure: () => (
    <>
      <g transform={`translate(${SERVICES.lectern} ${FLOOR_Y})`}>
        <Lectern />
      </g>
      <Wanderer x={SERVICES.start} />
      <g data-fx="map" opacity="0">
        <MapSheet />
      </g>
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const rolled = fx(stage, 'rolled')
    const map = fx(stage, 'map')
    const ink = fx(stage, 'ink')
    const pin = fx(stage, 'pin')
    return (play) => {
      const walked = share(play, 0)
      const opened = share(play, 1)
      const x = lerp(SERVICES.start, SERVICES.stop, ramp(walked, 0, 0.6))
      const reach = mix(REST, HOLD, ramp(walked, 0.6, 0.85))
      poseHim(him, { x }, walked < 0.6 ? run(5 * ramp(walked, 0, 0.6)) : opened > 0 ? HOLD : reach)
      fadeTo(rolled, 1 - ramp(walked, 0.8, 0.85))
      const [mx, my] = SERVICES.map
      transformTo(map, `translate(${mx} ${my}) scale(${(0.05 + 0.95 * ramp(opened, 0, 0.3)).toFixed(3)} 1)`)
      fadeTo(map, opened > 0 ? 1 : 0)
      ink?.setAttribute('stroke-dashoffset', (MAP_INK * (1 - ramp(opened, 0.25, 0.9))).toFixed(1))
      fadeTo(pin, ramp(opened, 0.85, 0.95))
    }
  },
}

// ---- Projects: the boss, dashed through, struck and burst ----

const BUG_SIZE = 200
const BUG_H = BUG_SIZE * BUG_ASPECT
const BUG_HOVER = 60
const BOSS = { from: 1660, lunge: 1400, recoil: 34, past: 1610, zoom: 1.15 }
const BUG_DOWN = BOSS.lunge - 3 * BOSS.recoil

const bugAt = (x: number, hover: number, tilt = 0): string =>
  `translate(${r1(x - BUG_SIZE / 2)} ${r1(FLOOR_Y - BUG_H - hover)}) rotate(${r1(tilt)} ${BUG_SIZE / 2} ${r1(BUG_H / 2)})`

const projects: SceneSpec = {
  light: DARK_FANTASY.infected,
  script: [1500, 1700, 1500],
  figure: () => (
    <g data-fx="camera">
      <g data-fx="corpse" opacity="0" transform={`translate(${BUG_DOWN - BUG_SIZE / 2} ${FLOOR_Y - BUG_H * 0.75})`}>
        <DeadBugCreature size={BUG_SIZE} />
      </g>
      <g data-fx="bug" transform={bugAt(BOSS.from, BUG_HOVER)}>
        <BattleBug size={BUG_SIZE} />
      </g>
      <Burst name="burst" color={DARK_FANTASY.infected} />
      <Wanderer x={HOME_X} />
    </g>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const camera = fx(stage, 'camera')
    const bug = fx(stage, 'bug')
    const corpse = fx(stage, 'corpse')
    const burst = fx(stage, 'burst')
    const hit = stage.querySelector('[data-bug-hit]')
    return (play) => {
      const dashed = share(play, 0)
      const struck = share(play, 1)
      const felled = share(play, 2)
      // the three cuts of the combo, each a third of the second action
      const cut = Math.min(2, Math.floor(struck * 3))
      const cutT = struck >= 1 ? 1 : struck * 3 - cut
      const hits = struck >= 1 ? 3 : cut + ramp(cutT, 0.4, 0.5)
      const bugX = lerp(BOSS.from, BOSS.lunge, ramp(dashed, 0, 0.5)) - BOSS.recoil * hits
      const flash = struck > 0 && struck < 1 ? bell(cutT, 0.35, 0.7) : bell(dashed, 0.45, 0.6)
      const through = ramp(dashed, 0.3, 0.55)
      const dashing = through > 0 && through < 1
      const turned = dashed > 0.7
      const pose = play.action > 0 ? (struck < 1 ? slash(cutT) : mix(GUARD, REST, ramp(felled, 0.6, 1))) : dashing ? dash(through, GUARD) : mix(REST, GUARD, ramp(dashed, 0, 0.3))
      poseHim(him, { x: lerp(HOME_X, BOSS.past, through), face: turned ? -1 : 1 }, pose)
      transformTo(bug, bugAt(bugX, BUG_HOVER * (1 - ramp(felled, 0, 0.4)), -12 * ramp(felled, 0, 0.4)))
      fadeTo(bug, 1 - ramp(felled, 0.4, 0.6))
      fadeTo(corpse, ramp(felled, 0.4, 0.6))
      fadeTo(hit, flash * HIT_FLASH_OPACITY)
      burstAt(burst, BUG_DOWN, FLOOR_Y - 90, ramp(felled, 0.35, 0.9), bell(felled, 0.35, 0.9))
      transformTo(camera, focusOn(BUG_DOWN + 120, FLOOR_Y - 160, lerp(1, BOSS.zoom, felled)))
    }
  },
}

// ---- Ventures: the soul spell, the up slash ----

const CRAWLER = { from: 1820, stop: 1440 }
const FLIER = { from: [1780, 260] as const, meet: [HOME_X + 70, FLOOR_Y - 400] as const, down: [HOME_X + 280, FLOOR_Y - 20] as const }
const BOLT_FROM = HOME_X + 60

const ventures: SceneSpec = {
  light: DARK_FANTASY.ethereal,
  script: [1700, 1700],
  figure: () => (
    <>
      <g data-fx="crawler" opacity="0">
        <Crawler />
      </g>
      <g data-fx="flier" opacity="0">
        <Flier />
      </g>
      <g data-fx="bolt" opacity="0">
        <SoulBolt />
      </g>
      <Burst name="burst" />
      <Burst name="burst-air" />
      <Wanderer x={HOME_X} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const crawler = fx(stage, 'crawler')
    const flier = fx(stage, 'flier')
    const bolt = fx(stage, 'bolt')
    const burst = fx(stage, 'burst')
    const burstAir = fx(stage, 'burst-air')
    return (play) => {
      const cast0 = share(play, 0)
      const swung = share(play, 1)
      const jump = ramp(swung, 0.4, 0.9)
      poseHim(him, { x: HOME_X, lift: hop(jump, 90) }, swung > 0 ? upStrike(ramp(swung, 0.4, 0.85)) : cast(ramp(cast0, 0.4, 0.75)))
      transformTo(crawler, `translate(${r1(lerp(CRAWLER.from, CRAWLER.stop, ramp(cast0, 0, 0.45)))} ${FLOOR_Y})`)
      fadeTo(crawler, cast0 > 0 ? 1 - ramp(cast0, 0.63, 0.7) : 0)
      const flight = ramp(cast0, 0.45, 0.65)
      transformTo(bolt, `translate(${r1(lerp(BOLT_FROM, CRAWLER.stop, flight))} ${r1(FLOOR_Y - BODY_UP)})`)
      fadeTo(bolt, flight > 0 && flight < 1 ? 1 : 0)
      burstAt(burst, CRAWLER.stop, FLOOR_Y - 50, ramp(cast0, 0.62, 0.95), bell(cast0, 0.6, 0.97))
      const dive = ramp(swung, 0, 0.5)
      const fall = ramp(swung, 0.6, 1)
      const flierX = fall > 0 ? lerp(FLIER.meet[0], FLIER.down[0], fall) : lerp(FLIER.from[0], FLIER.meet[0], dive)
      const fy = fall > 0 ? lerp(FLIER.meet[1], FLIER.down[1], fall * fall) : lerp(FLIER.from[1], FLIER.meet[1], dive)
      transformTo(flier, `translate(${r1(flierX)} ${r1(fy)}) rotate(${r1(160 * fall)})`)
      fadeTo(flier, swung > 0 ? 1 - ramp(swung, 0.9, 1) : 0)
      burstAt(burstAir, FLIER.meet[0], FLIER.meet[1], ramp(swung, 0.5, 0.7), bell(swung, 0.5, 0.72))
    }
  },
}

// ---- Bands: the station bell, the great beetle ----

// The beetle is drawn at BEETLE_SCALE and stops at beetleAt, so all of it, horns to tail, stays in the part of
// the hall the narrowest wide screen shows (about x 320 to 1590 at 1024 by 768, with the figure layer's push in).
const STATION = { him: 1050, bell: 1140, beetleFrom: 2200, beetleAt: 1410, stepMs: 140 }
const BEETLE_SCALE = 0.7
const beetleAt = (x: number): string => `translate(${r1(x)} ${FLOOR_Y}) scale(${BEETLE_SCALE})`

const bands: SceneSpec = {
  light: DARK_FANTASY.lavender,
  script: [1400, 2200],
  figure: () => (
    <>
      <g data-fx="beetle" transform={beetleAt(STATION.beetleFrom)}>
        <Beetle />
      </g>
      <g transform={`translate(${STATION.bell} ${FLOOR_Y})`}>
        <StationBell />
      </g>
      <g data-fx="ring" opacity="0">
        <circle cx={STATION.bell + 30} cy={FLOOR_Y - 150} r="70" fill="none" stroke={DARK_FANTASY.lavender} strokeWidth="5" />
        <circle cx={STATION.bell + 30} cy={FLOOR_Y - 150} r="120" fill="none" stroke={DARK_FANTASY.lavender} strokeWidth="3" />
      </g>
      <Wanderer x={STATION.him} />
    </>
  ),
  bind: (stage, scene) => {
    const him = himIn(stage)
    const ring = fx(stage, 'ring')
    const bellNode = fx(stage, 'station-bell')
    const beetle = fx(stage, 'beetle')
    const legsA = fx(stage, 'beetle-legs-a')
    const legsB = fx(stage, 'beetle-legs-b')
    const script = scene.script ?? []
    return (play) => {
      const rung = share(play, 0)
      const came = share(play, 1)
      poseHim(him, { x: STATION.him }, slash(rung, REST))
      const swing = ramp(rung, 0.4, 1)
      transformTo(bellNode, `rotate(${r1(16 * Math.sin(Math.PI * 3 * swing) * (1 - swing))} 30 -198)`)
      fadeTo(ring, bell(rung, 0.45, 1) * (1 - came))
      const runIn = ramp(came, 0, 0.85)
      const easedIn = 1 - (1 - runIn) ** 2
      transformTo(beetle, beetleAt(lerp(STATION.beetleFrom, STATION.beetleAt, easedIn)))
      const stepping = runIn > 0 && runIn < 1
      const step = Math.floor(elapsedOf(script, play) / STATION.stepMs) % 2
      fadeTo(legsA, stepping && step === 1 ? 0 : 1)
      fadeTo(legsB, stepping && step === 0 ? 0 : 1)
    }
  },
}

// ---- Muay Thai record: the clash, the great slash ----

const FOE_X = 1540
const DUEL_X = 1260
const FOE_RAISED = -150
const FOE_STRUCK = -40
const CLASH = [1400, FLOOR_Y - 250] as const
// His block: the nail raised high ahead against the falling greatsword.
const BLOCK: WandererPose = { ...GUARD, armRight: -120, foreRight: -45, lean: -4 }

const muayThai: SceneSpec = {
  light: DARK_FANTASY.spiritGold,
  script: [1600, 1900],
  figure: () => (
    <>
      <g data-fx="foe" transform={`translate(${FOE_X} ${FLOOR_Y})`}>
        <ArmouredKnight />
      </g>
      <g data-fx="spark" opacity="0" transform={`translate(${CLASH[0]} ${CLASH[1]})`}>
        <path d="M0,-50 L10,-12 L48,-18 L14,4 L36,40 L0,16 L-32,42 L-12,4 L-50,-14 L-10,-12 Z" fill={DARK_FANTASY.white} />
        <circle r="14" fill={DARK_FANTASY.soulBlue} />
      </g>
      <Wanderer x={DUEL_X} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const foe = fx(stage, 'foe')
    const foeBlade = fx(stage, 'foe-blade')
    const spark = fx(stage, 'spark')
    return (play) => {
      const clashed = share(play, 0)
      const slashed = share(play, 1)
      const push = bell(clashed, 0.45, 0.9)
      const pose = slashed > 0 ? (slashed < 0.45 ? charge(ramp(slashed, 0, 0.45)) : greatSlash(ramp(slashed, 0.45, 0.85))) : mix(GUARD, BLOCK, bell(clashed, 0.2, 0.85))
      poseHim(him, { x: DUEL_X - 30 * push + 60 * ramp(slashed, 0.45, 0.6) }, pose)
      const kneel = ramp(slashed, 0.6, 0.9)
      transformTo(foe, `translate(${r1(FOE_X + 30 * push)} ${FLOOR_Y}) scale(1 ${(1 - 0.22 * kneel).toFixed(3)}) rotate(${r1(-8 * kneel)} 0 -100)`)
      transformTo(foeBlade, `rotate(${r1(kneel > 0 ? lerp(FOE_STRUCK, 80, kneel) : lerp(FOE_RAISED, FOE_STRUCK, ramp(clashed, 0.1, 0.45)))} -30 -120)`)
      transformTo(spark, `translate(${CLASH[0]} ${CLASH[1]}) scale(${(0.6 + 0.6 * ramp(clashed, 0.4, 0.6)).toFixed(3)})`)
      fadeTo(spark, bell(clashed, 0.38, 0.62))
    }
  },
}

// ---- the contact: the bench ----

const CONTACT = { from: 1180, bench: 1420, corpse: 1720 }
// Sat, his hips rest on the bench's seat: he is lifted by the seat's height less his hips' drop in the sit.
const SEAT_LIFT = 74 - (WANDERER.soleY - 95 - SIT.rise) * SCALE

const contact: SceneSpec = {
  light: DARK_FANTASY.infected,
  script: [1600, 1600],
  figure: () => (
    <>
      <g transform={`translate(${CONTACT.corpse - BUG_SIZE / 2} ${FLOOR_Y - BUG_H * 0.75})`}>
        <DeadBugCreature size={BUG_SIZE} />
      </g>
      <g data-fx="light" opacity="0" transform={`translate(${CONTACT.bench} ${FLOOR_Y})`}>
        <BenchLight />
      </g>
      <g transform={`translate(${CONTACT.bench} ${FLOOR_Y})`}>
        <Bench />
      </g>
      <Wanderer x={CONTACT.from} />
    </>
  ),
  bind: (stage) => {
    const him = himIn(stage)
    const light = fx(stage, 'light')
    return (play) => {
      const sat = share(play, 0)
      const rested = share(play, 1)
      const walked = ramp(sat, 0, 0.6)
      const down = ramp(sat, 0.6, 1)
      const x = lerp(CONTACT.from, CONTACT.bench, walked)
      const pose = rested > 0 ? rest(rested) : sat < 0.6 ? run(5 * walked) : mix(REST, SIT, down)
      poseHim(him, { x, lift: SEAT_LIFT * down }, pose)
      fadeTo(light, ramp(rested, 0.1, 0.6))
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

// The soul motes rise this far over a scene.
const MOTE_RISE = 80

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number): DarkScene => {
  const spec = SCENES[id]
  const scene: DarkScene = {
    id,
    slot,
    count,
    script: spec.script,
    bind: (stage): StageWriter => {
      const motes = fx(stage, 'motes')
      const write = spec.bind(stage, scene)
      return (progress, _reached, play) => {
        transformTo(motes, `translate(0 ${(-progress * MOTE_RISE).toFixed(1)})`)
        // drawn settled (reduced motion) there is no playhead, and the scene holds its end frame
        write(play ?? sceneEnd(spec.script))
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
