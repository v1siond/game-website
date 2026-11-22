'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { muayThaiFacts } from '@/lib/cv/sectionText'
import { ramp } from '@/lib/scroll/stage'
import { ProfessionStage } from '@/components/themes/shared/professionStage'
import { fadeTo, fx, lerp, spread, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage, type StageLayer } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { BattleBug, BUG_ASPECT, DeadBugCreature, HIT_FLASH_OPACITY } from './bug'
import { HallColumns, HallFloor, HallFront, HallLamps, HallLayer, HallSky } from './hall'
import { KNIGHT_SOLE_Y, KNIGHT_VIEW_WIDTH, KnightCharacter, nailTurn, slashAngle, slashGlow } from './KnightCharacter'
import { FloatingLantern, MechanicalGear, SoulCrystal, SpiritWisp } from './relics'
import { DARK_FANTASY } from './palette'
import world from './world.module.css'

// The knight's scenes, one per part of the page: the hero, each section the profession shows and the
// contact. Every scene is the arena (hall.tsx) lit in its own light, with one relic per card of its section
// on the floor; the knight walks to each relic as its card scrolls up and slashes it free: a spirit wisp
// rises (about, bands), a lantern lights (work), a crystal glows (tech, the Muay Thai record), a gear turns
// (services), a soul lamp burns (ventures). In projects the bug fights back, flashing and recoiling at each
// slash; at the contact the knight ends it. Every pose is a function of the scene's progress and the cards
// reached (the writers below), so it plays back on the way up and rests when the scroll does.

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

// The floor line the knight's soles and every relic stand on, and his size on it.
const FLOOR_Y = 990
const KNIGHT_SCALE = 2.8
const KNIGHT_HALF = (KNIGHT_VIEW_WIDTH * KNIGHT_SCALE) / 2
const KNIGHT_TOP = FLOOR_Y - KNIGHT_SOLE_Y * KNIGHT_SCALE
// He stands this far left of a relic to strike it, and starts this far left of the first one.
const REACH = 110
const LEAD_IN = 60
// The relics stand between these x on the canvas, right of the text column.
const ROW_FROM = 1180
const ROW_TO = 1640
// A relic is drawn whole while its neighbours stand at least RELIC_ROOM apart, and shrinks to fit a closer
// row, down to RELIC_MIN of its size.
const RELIC_ROOM = 130
const RELIC_MIN = 0.45
// Of each card's share of the scroll, the first WALK he walks to its relic, the rest he slashes.
const WALK = 0.4
// A relic is freed over this part of its card's share, after the slash lands.
const FREE_FROM = 0.55
const FREE_TO = 0.85
// His breath while he walks the row: this many bobs over a scene, this high.
const BOBS = 3
const BOB_PX = 3

/** Where the knight stands (his centre x) and how far his slash has played, `reached` cards in. */
export function knightAt(xs: readonly number[], reached: number): { x: number; slash: number } {
  if (xs.length === 0) return { x: ROW_FROM - REACH, slash: 0 }
  const item = Math.min(xs.length - 1, Math.floor(reached))
  const share = Math.min(1, reached - item)
  const from = item === 0 ? xs[0] - LEAD_IN : xs[item - 1]
  const x = lerp(from, xs[item], ramp(share, 0, WALK)) - REACH
  return { x, slash: ramp(share, WALK, 1) }
}

/** How freed relic `i` is, 0 to 1, `reached` cards in. */
export const freed = (reached: number, i: number): number => ramp(reached - i, FREE_FROM, FREE_TO)

/** A bump that peaks at 1 at the strike of each card's slash while cards are still coming: the bug's flash and recoil. */
export const strikeOf = (reached: number, count: number): number => {
  if (reached >= count) return 0
  const share = reached - Math.floor(reached)
  return 1 - Math.min(1, Math.abs(share - 0.6) / 0.12)
}

// ---- the knight ----

interface KnightNodes {
  root: Element | null
  nail: Element | null
  glow: Element | null
}

const knightNodes = (stage: ParentNode): KnightNodes => ({ root: fx(stage, 'knight'), nail: stage.querySelector('[data-nail]'), glow: stage.querySelector('[data-nail-glow]') })

const poseKnight = ({ root, nail, glow }: KnightNodes, x: number, slash: number, bob = 0): void => {
  transformTo(root, `translate(${(x - KNIGHT_HALF).toFixed(1)} ${(KNIGHT_TOP + bob).toFixed(1)})`)
  transformTo(nail, nailTurn(slashAngle(slash)))
  fadeTo(glow, slashGlow(slash))
}

/** The knight, the one figure of every scene, drawn where `x` puts him. */
function Knight({ x }: { x: number }) {
  return (
    <g data-fx="knight" data-worlds-figure="" transform={`translate(${x - KNIGHT_HALF} ${KNIGHT_TOP})`}>
      <KnightCharacter scale={KNIGHT_SCALE} />
    </g>
  )
}

// ---- the relics a section counts, one per card ----

type Relic = 'wisp' | 'lavenderWisp' | 'lantern' | 'crystal' | 'goldCrystal' | 'gear' | 'lamp' | 'orb'

/** A relic as drawn on its base at the floor, unlit. */
const RELIC_ART: Record<Relic, ReactNode> = {
  wisp: <SpiritWisp size={90} color={DARK_FANTASY.spiritGold} x={-45} y={-150} />,
  lavenderWisp: <SpiritWisp size={90} color={DARK_FANTASY.lavender} x={-45} y={-150} />,
  lantern: (
    <>
      <line x1="0" y1="-420" x2="0" y2="-300" stroke={DARK_FANTASY.copper} strokeWidth="2" opacity="0.6" />
      <FloatingLantern size={60} x={-30} y={-300} />
    </>
  ),
  crystal: <SoulCrystal />,
  goldCrystal: <SoulCrystal light={DARK_FANTASY.spiritGold} />,
  gear: <MechanicalGear size={110} x={-55} y={-125} />,
  lamp: (
    <>
      <rect x="-6" y="-170" width="12" height="170" fill={DARK_FANTASY.stoneGrey} opacity="0.6" />
      <path d="M-22,-170 Q0,-200 22,-170 Q0,-160 -22,-170 Z" fill={DARK_FANTASY.voidDeep} stroke={DARK_FANTASY.brass} strokeWidth="2" />
    </>
  ),
  orb: (
    <>
      <circle cx="0" cy="-40" r="10" fill={DARK_FANTASY.spiritGold} opacity="0.4" />
      <circle cx="0" cy="-40" r="20" fill={DARK_FANTASY.spiritGold} opacity="0.1" />
    </>
  ),
}

// Where a relic's light glows above its base, how wide, and its colour.
const RELIC_GLOW: Record<Relic, { y: number; r: number; color: string }> = {
  wisp: { y: -105, r: 90, color: DARK_FANTASY.spiritGold },
  lavenderWisp: { y: -105, r: 90, color: DARK_FANTASY.lavender },
  lantern: { y: -270, r: 90, color: DARK_FANTASY.spiritGold },
  crystal: { y: -50, r: 110, color: DARK_FANTASY.ethereal },
  goldCrystal: { y: -50, r: 110, color: DARK_FANTASY.spiritGold },
  gear: { y: -70, r: 90, color: DARK_FANTASY.brass },
  lamp: { y: -176, r: 70, color: DARK_FANTASY.ethereal },
  orb: { y: -40, r: 60, color: DARK_FANTASY.spiritGold },
}

/** How big the relics of a row are drawn: whole when they have room, smaller in a long row. */
export const relicSize = (xs: readonly number[]): number =>
  xs.length < 2 ? 1 : Math.max(RELIC_MIN, Math.min(1, (xs[1] - xs[0]) / RELIC_ROOM))

const standing = (x: number, size: number, rise = 0): string => `translate(${x.toFixed(1)} ${(FLOOR_Y - rise * size).toFixed(1)}) scale(${size.toFixed(3)})`

/** How a freed relic moves: a wisp rises out of reach, a gear turns, a lantern and an orb lift a little. */
const RELIC_MOTION: Record<Relic, (x: number, size: number, lit: number) => string> = {
  wisp: (x, size, lit) => standing(x, size, lit * 140),
  lavenderWisp: (x, size, lit) => standing(x, size, lit * 140),
  lantern: (x, size, lit) => standing(x, size, lit * 20),
  crystal: (x, size) => standing(x, size),
  goldCrystal: (x, size) => standing(x, size),
  gear: (x, size, lit) => `${standing(x, size)} rotate(${(lit * 120).toFixed(1)} 0 -70)`,
  lamp: (x, size) => standing(x, size),
  orb: (x, size, lit) => standing(x, size, lit * 30),
}

// An unlit relic shows at this opacity; freed, it shows whole.
const UNLIT = 0.45

function RelicRow({ relic, xs }: { relic: Relic; xs: readonly number[] }) {
  const glow = RELIC_GLOW[relic]
  const size = relicSize(xs)
  return (
    <>
      {xs.map((x, i) => (
        <g key={i} data-fx={`relic-${i}`} transform={RELIC_MOTION[relic](x, size, 0)}>
          <g data-fx={`lit-${i}`} opacity="0">
            <circle cx="0" cy={glow.y} r={glow.r} fill={glow.color} opacity="0.22" />
            <circle cx="0" cy={glow.y} r={glow.r * 0.45} fill={glow.color} opacity="0.3" />
          </g>
          <g data-fx={`body-${i}`} opacity={UNLIT}>
            {RELIC_ART[relic]}
          </g>
        </g>
      ))}
    </>
  )
}

/** Binds a relic row and returns its writer: each relic moves, glows and shows whole as it is freed. */
function relicWriter(stage: ParentNode, relic: Relic, xs: readonly number[]): (reached: number) => void {
  const rows = xs.map((_, i) => ({ relic: fx(stage, `relic-${i}`), lit: fx(stage, `lit-${i}`), body: fx(stage, `body-${i}`) }))
  const size = relicSize(xs)
  return (reached) =>
    rows.forEach((row, i) => {
      const lit = freed(reached, i)
      transformTo(row.relic, RELIC_MOTION[relic](xs[i], size, lit))
      fadeTo(row.lit, lit)
      fadeTo(row.body, UNLIT + (1 - UNLIT) * lit)
    })
}

// ---- the scenes ----

interface SceneSpec {
  light: string
  /** The scene's own layer between the lamps and the columns (the hero's profession stage). */
  stage?: (profession: Profession) => ReactNode
  figure: (xs: readonly number[]) => ReactNode
  bind: (stage: HTMLElement, xs: readonly number[]) => StageWriter
}

/** A relic section: the knight frees one relic per card. */
function relicScene(relic: Relic, light: string): SceneSpec {
  return {
    light,
    figure: (xs) => (
      <>
        <RelicRow relic={relic} xs={xs} />
        <Knight x={knightAt(xs, 0).x} />
      </>
    ),
    bind: (stage, xs) => {
      const knight = knightNodes(stage)
      const relics = relicWriter(stage, relic, xs)
      return (progress, reached) => {
        const { x, slash } = knightAt(xs, reached)
        poseKnight(knight, x, slash, Math.sin(progress * Math.PI * 2 * BOBS) * BOB_PX)
        relics(reached)
      }
    },
  }
}

const BUG_SIZE = 180
const BUG_H = BUG_SIZE * BUG_ASPECT
const BUG_X = 1700
const BUG_HOVER = 60
const BUG_SWAY_PX = 10
const BUG_RECOIL_PX = 40

/** Projects: the bug hovers at the end of the row and takes a slash per project, flashing and recoiling,
 *  while that project's soul orb lights. */
const projectsScene: SceneSpec = {
  light: DARK_FANTASY.infected,
  figure: (xs) => (
    <>
      <RelicRow relic="orb" xs={xs} />
      <g data-fx="bug" transform={`translate(${BUG_X - BUG_SIZE / 2} ${FLOOR_Y - BUG_H - BUG_HOVER})`}>
        <BattleBug size={BUG_SIZE} />
      </g>
      <Knight x={knightAt(xs, 0).x} />
    </>
  ),
  bind: (stage, xs) => {
    const knight = knightNodes(stage)
    const relics = relicWriter(stage, 'orb', xs)
    const bug = fx(stage, 'bug')
    const hit = stage.querySelector('[data-bug-hit]')
    return (progress, reached) => {
      const { x, slash } = knightAt(xs, reached)
      poseKnight(knight, x, slash)
      relics(reached)
      const strike = strikeOf(reached, xs.length)
      const sway = Math.sin(progress * Math.PI * 8) * BUG_SWAY_PX
      const bx = BUG_X - BUG_SIZE / 2 + strike * BUG_RECOIL_PX
      const by = FLOOR_Y - BUG_H - BUG_HOVER + sway - strike * 12
      transformTo(bug, `translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${(strike * 8).toFixed(1)} ${BUG_SIZE / 2} ${BUG_H / 2})`)
      fadeTo(hit, strike * HIT_FLASH_OPACITY)
    }
  },
}

// The final battle over the contact's progress: the bug closes in, he walks up, slashes, the bug bleaches
// white and falls, and its corpse lies where it fell.
const FIGHT = { approach: [0.05, 0.35], slash: [0.35, 0.6], hit: 0.5, hitWidth: 0.05, die: [0.55, 0.68] } as const
const CONTACT_BUG = { from: 1820, to: 1560 }
const CONTACT_KNIGHT = { from: 1080, to: 1380 }
const CONTACT_HOVER = 40

const contactScene: SceneSpec = {
  light: DARK_FANTASY.infected,
  figure: () => (
    <>
      <g data-fx="corpse" opacity="0" transform={`translate(${CONTACT_BUG.to - BUG_SIZE / 2} ${FLOOR_Y - BUG_H * 0.75})`}>
        <DeadBugCreature size={BUG_SIZE} />
      </g>
      <g data-fx="bug" transform={`translate(${CONTACT_BUG.from - BUG_SIZE / 2} ${FLOOR_Y - BUG_H - CONTACT_HOVER})`}>
        <BattleBug size={BUG_SIZE} />
      </g>
      <Knight x={CONTACT_KNIGHT.from} />
    </>
  ),
  bind: (stage) => {
    const knight = knightNodes(stage)
    const bug = fx(stage, 'bug')
    const corpse = fx(stage, 'corpse')
    const hit = stage.querySelector('[data-bug-hit]')
    return (progress) => {
      const close = ramp(progress, ...FIGHT.approach)
      const death = ramp(progress, ...FIGHT.die)
      poseKnight(knight, lerp(CONTACT_KNIGHT.from, CONTACT_KNIGHT.to, close), ramp(progress, ...FIGHT.slash))
      const bx = lerp(CONTACT_BUG.from, CONTACT_BUG.to, close) - BUG_SIZE / 2
      const by = FLOOR_Y - BUG_H - CONTACT_HOVER + death * CONTACT_HOVER
      transformTo(bug, `translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${(death * 90).toFixed(1)} ${BUG_SIZE / 2} ${BUG_H / 2})`)
      fadeTo(hit, (1 - Math.min(1, Math.abs(progress - FIGHT.hit) / FIGHT.hitWidth)) * HIT_FLASH_OPACITY)
      fadeTo(bug, 1 - death)
      fadeTo(corpse, death)
    }
  },
}

// The hero: the knight waits in the arena before the profession's boss stage, and salutes with his nail as
// the page starts to scroll.
const HERO_KNIGHT_X = 1640

const heroScene: SceneSpec = {
  light: DARK_FANTASY.ethereal,
  stage: (profession) => <ProfessionStage profession={profession} p={DARK_FANTASY} />,
  figure: () => <Knight x={HERO_KNIGHT_X} />,
  bind: (stage) => {
    const knight = knightNodes(stage)
    return (progress) => poseKnight(knight, HERO_KNIGHT_X, ramp(progress, 0.05, 0.6))
  },
}

const SCENES: Record<SceneId, SceneSpec> = {
  hero: heroScene,
  about: relicScene('wisp', DARK_FANTASY.spiritGold),
  work: relicScene('lantern', DARK_FANTASY.spiritGold),
  tech: relicScene('crystal', DARK_FANTASY.ethereal),
  services: relicScene('gear', DARK_FANTASY.brass),
  projects: projectsScene,
  ventures: relicScene('lamp', DARK_FANTASY.ethereal),
  bands: relicScene('lavenderWisp', DARK_FANTASY.lavender),
  muayThai: relicScene('goldCrystal', DARK_FANTASY.spiritGold),
  contact: contactScene,
}

// How many cards each section counts, read off the slot its cards are drawn from: one relic per card. The
// Muay Thai record counts its facts and its achievements, one strike per line.
const COUNT_FOR: { [Id in SectionId]: (slot: SlotOf<Id>, labels: Labels, highlights: readonly string[]) => number } = {
  about: (_slot, _labels, highlights) => highlights.length,
  work: ({ jobs }) => jobs.length,
  tech: ({ categories }) => categories.length,
  services: ({ services }) => services.length,
  projects: ({ projects }) => projects.length,
  ventures: ({ companies }) => companies.length,
  bands: ({ bands }) => bands.length,
  muayThai: ({ martialArts }, labels) => muayThaiFacts(martialArts, labels).length + martialArts.primary.achievements.length,
}

const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number =>
  (COUNT_FOR[slot.id] as (slot: SectionSlot, labels: Labels, highlights: readonly string[]) => number)(slot, labels, highlights)

export interface DarkScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  xs: readonly number[]
}

// The soul motes rise this far over a scene.
const MOTE_RISE = 80

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number): DarkScene => {
  const xs = spread(count, ROW_FROM, ROW_TO)
  const bind = (stage: HTMLElement): StageWriter => {
    const motes = fx(stage, 'motes')
    const write = SCENES[id].bind(stage, xs)
    return (progress, reached) => {
      transformTo(motes, `translate(0 ${(-progress * MOTE_RISE).toFixed(1)})`)
      write(progress, reached)
    }
  }
  return { id, slot, count, xs, bind }
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
          <g className={world.troupe}>{spec.figure(scene.xs)}</g>
        </HallLayer>
      ),
    },
    { name: 'fg', node: <HallFront /> },
  ]
  return <Stage scene={scene} layers={layers} motion={HALL_MOTION} settled={settled} className={world.stage} />
}
