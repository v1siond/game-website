'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { hop } from '@/lib/motion/arc'
import { sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, focusOn, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { H, W, ZONE_ART, type Zone } from './backdrop'
import { beatIn, hitsUpTo, type Action, type Beat } from './fight'
import { KiBall, ScrubFighter, scrubWriter, type Rival } from './fighter'
import { CELL, type FighterPose, type Pt } from './poses'
import { FS } from './palette'
import look from './world.module.css'

// The arcade world tour as the page's scenes: every section is a round on a stage of its own (backdrop.tsx)
// against a rival of its own (fighter.tsx RIVALS), and every round shows a different kind of the genre's
// moves, one to three actions played by the shared scene player at their own pace (src/lib/scroll/player.ts):
// the scroll sets where the round should be and the round follows no faster than it plays, forward on the
// way down and back on the way up; reduced motion and a settled stage hold the round's last frame.
//   Hero, the castle rooftop: he walks in and squares up to the rival of his school.
//   About, the dojo hall: the special's command lights (down, down forward, forward, punch), then the
//     energy wave flies and bursts on the school rival.
//   Work, the street market: the brawler rushes in swinging and he blocks every blow, then counters with
//     the strong punch and the rising uppercut.
//   Tech Stack, the factory floor: the combo on the kickboxer, the hit counter climbing, finished by the
//     spinning kick.
//   Services, the subway platform: the masked wrestler walks into range and he throws him across the platform.
//   Projects, the harbour: the super on the old master, the screen dimmed and flared, a juggle a hit at a
//     time, the rising uppercut splatting him on the wall.
//   Ventures, the neon plaza: he parries the commando's punches in the blue flash, then counters with the
//     spinning kick.
//   Bands, the concert stage: the dancer jumps in from range and the rising uppercut, its command lit,
//     meets him in the air.
//   Muay Thai, the temple ring: the clinch, two knees, the last knee for the knockout, then the win pose.
//   Contact, the castle rooftop: the win pose over the fallen rival.

export type SceneId = 'hero' | SectionId | 'contact'

/** The stage pushes in across its scene, the fighters a little more than the stage behind them. */
export const TOUR_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.05], lift: [0, -1] },
  figure: { zoom: [1.03, 1.1], lift: [0, -2] },
}

// The floor line their feet stand on, and their size on the canvas.
const FLOOR = 860
const SIZE = 2
const TOP = FLOOR - CELL.ground * SIZE
// He stands at HERO_X; the rival faces him GAP further on: in the clinch for knees, close for blows, at range
// for waves and jump ins.
const HERO_X = 900
const GAP = { clinch: 70, close: 110, mid: 220, range: 330 } as const
// A hurt rival rocks back KNOCK at the height of the hit.
const KNOCK = 22

// Points of a fighter's own 160 by 170 cell: the hands where a wave leaves, the chest where it lands.
const HAND: Pt = [116, 72]
const CHEST: Pt = [70, 80]

/** Where on the canvas a point of his cell is, or of the rival's mirrored one. */
const heroAt = (x: number, [cx, cy]: Pt): Pt => [x + cx * SIZE, TOP + cy * SIZE]
const rivalAt = (x: number, [cx, cy]: Pt): Pt => [x + (CELL.width - cx) * SIZE, TOP + cy * SIZE]

const standAt = (x: number, lift = 0): string => `translate(${r1(x)} ${r1(TOP - lift)}) scale(${SIZE})`

/** Where the round is: the action, how far through it, its beat and how far through that, the hits landed. */
interface Moment {
  play: Playhead
  beat: Beat
  index: number
  t: number
  hits: number
}

/** How a scene moves the pair off their places this moment: his step, the rival's step and lift. */
interface Steps {
  hero: number
  rival: number
  lift: number
}

const STILL: Steps = { hero: 0, rival: 0, lift: 0 }

interface SceneSpec {
  zone: Zone
  rival: Rival
  gap: number
  actions: readonly Action[]
  steps?: (m: Moment) => Partial<Steps>
  /** How far the camera pushes in on the pair. */
  zoom?: (m: Moment) => number
  /** The scene throws an energy wave. */
  wave?: boolean
  /** The special's command shown over him, lit button by button. */
  command?: readonly Command[]
  /** The hit counter shown over the rival. */
  counter?: boolean
  props?: () => ReactNode
  write?: (stage: HTMLElement) => (m: Moment, x: { hero: number; rival: number }) => void
}

const scriptOf = (actions: readonly Action[]): SceneScript => actions.map((action) => action.ms)

const posesOf = (actions: readonly Action[], who: 'hero' | 'partner'): FighterPose[] =>
  Array.from(new Set(actions.flatMap((action) => action.beats.map((beat) => beat[who]))))

/** Which action of the round, and how far through, as a share of `i`: 0 before it, 1 once it is done. */
const shareOf = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

// ---- the energy wave: from his hands to the rival's chest, bursting where it lands ----

const WAVE = { from: 0.3, to: 0.62, burst: [0.55, 0.95] as const }

function Wave() {
  return (
    <>
      <g data-fx="wave" opacity="0">
        <g transform={`scale(${SIZE}) translate(${-HAND[0]} ${-HAND[1]})`}>
          <KiBall kind="ki" className="" />
        </g>
      </g>
      <g data-fx="burst" opacity="0">
        <circle r={58} fill={FS.cyan} opacity={0.45} />
        <circle r={34} fill={FS.flash} opacity={0.85} />
        <path d="M0 -70 L8 -14 L64 -24 L16 4 L52 52 L0 18 L-46 56 L-16 4 L-66 -20 L-8 -14 Z" fill={FS.flash} opacity={0.7} />
      </g>
    </>
  )
}

function waveWriter(stage: HTMLElement): (m: Moment, x: { hero: number; rival: number }) => void {
  const wave = fx(stage, 'wave')
  const burst = fx(stage, 'burst')
  return ({ beat, t }, x) => {
    const throwing = beat.hero === 'fireball'
    const [fromX, y] = heroAt(x.hero, HAND)
    const [toX] = rivalAt(x.rival, CHEST)
    const flight = ramp(t, WAVE.from, WAVE.to)
    transformTo(wave, `translate(${r1(lerp(fromX, toX, flight))} ${r1(y)})`)
    fadeTo(wave, throwing && flight > 0 && flight < 1 ? 1 : 0)
    transformTo(burst, `translate(${r1(toX)} ${r1(y)}) scale(${(0.6 + 0.6 * ramp(t, ...WAVE.burst)).toFixed(3)})`)
    fadeTo(burst, throwing ? ramp(t, WAVE.burst[0], 0.62) * (1 - ramp(t, 0.8, WAVE.burst[1])) : 0)
  }
}

// ---- the special's command: the stick's motion and the punch button, lit in turn ----

type Command = 'down' | 'downForward' | 'forward' | 'punch'

const ARROW_TURN: Record<Exclude<Command, 'punch'>, number> = { down: 90, downForward: 45, forward: 0 }
const KEY = { r: 30, gap: 76, y: TOP - 70 }

function CommandKeys({ keys }: { keys: readonly Command[] }) {
  return (
    <g data-fx="command" opacity="0">
      {keys.map((key, i) => (
        <g key={`${key}-${i}`} transform={`translate(${i * KEY.gap} 0)`}>
          <circle data-fx={`key-${i}`} r={KEY.r} fill={FS.panel} stroke={FS.ink} strokeWidth={5} />
          {key === 'punch' ? (
            <circle r={KEY.r * 0.55} fill={FS.p2} stroke={FS.ink} strokeWidth={4} />
          ) : (
            <path d="M-16 0 H10 M2 -10 L14 0 L2 10" fill="none" stroke={FS.flash} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${ARROW_TURN[key]})`} />
          )}
        </g>
      ))}
    </g>
  )
}

/** The command over him, lit key by key across `lit` (0 to 1), shown only while `shown`. */
function commandWriter(stage: HTMLElement, count: number): (shown: boolean, lit: number, heroX: number) => void {
  const group = fx(stage, 'command')
  const keys = Array.from({ length: count }, (_, i) => fx(stage, `key-${i}`))
  return (shown, lit, heroX) => {
    transformTo(group, `translate(${r1(heroX + 40)} ${KEY.y})`)
    fadeTo(group, shown ? 1 : 0)
    keys.forEach((key, i) => key?.setAttribute('fill', lit * count > i ? FS.gold : FS.panel))
  }
}

// ---- the hit counter: "4 hits" on a dark plate over the rival ----

function Counter({ label }: { label: string }) {
  return (
    <g data-fx="counter" opacity="0">
      <rect x={-20} y={-62} width={250} height={80} rx={8} fill={FS.night} stroke={FS.gold} strokeWidth={4} />
      <text data-fx="counter-text" x={105} y={-8} textAnchor="middle" fontSize={50} fontWeight={800} fill={FS.gold} className={look.display}>
        {`0 ${label}`}
      </text>
    </g>
  )
}

function counterWriter(stage: HTMLElement, label: string): (hits: number, rivalX: number) => void {
  const group = fx(stage, 'counter')
  const text = fx(stage, 'counter-text')
  let shown = -1
  return (hits, rivalX) => {
    transformTo(group, `translate(${r1(rivalX + 60)} ${TOP - 40})`)
    fadeTo(group, hits >= 2 ? 1 : 0)
    if (hits === shown || !text) return
    shown = hits
    text.textContent = `${hits} ${label}`
  }
}

// ---- the screen effects: the super's dim and flare, the knockout's flash and the KO plate ----

const Screen = ({ name, fill }: { name: string; fill: string }) => <rect data-fx={name} x={-W} y={-H} width={W * 3} height={H * 3} fill={fill} opacity="0" />

function KoPlate() {
  return (
    <g data-fx="ko" opacity="0" transform={`translate(${W / 2} 220)`}>
      <rect x={-130} y={-80} width={260} height={150} rx={10} fill={FS.koPlate} stroke={FS.flash} strokeWidth={8} />
      <text y={40} textAnchor="middle" fontSize={120} fontWeight={800} fill={FS.flash} className={look.display}>
        KO
      </text>
    </g>
  )
}

/** A bump from 0 up to 1 and back over a beat. */
const bump = (t: number): number => Math.sin(Math.PI * Math.min(1, Math.max(0, t)))

// ---- the rounds ----

const hero: SceneSpec = {
  zone: 'castle',
  rival: 'school',
  gap: GAP.mid,
  actions: [{ ms: 1400, beats: [{ hero: 'walk', partner: 'stance', share: 2 }, { hero: 'stance', partner: 'stance' }] }],
  steps: ({ index, t }) => ({ hero: index === 0 ? -180 * (1 - t) : 0 }),
}

const about: SceneSpec = {
  zone: 'dojo',
  rival: 'school',
  gap: GAP.range,
  wave: true,
  command: ['down', 'downForward', 'forward', 'punch'],
  actions: [
    { ms: 1300, beats: [{ hero: 'stance', partner: 'stance', mark: 'input' }] },
    { ms: 1600, beats: [{ hero: 'fireball', partner: 'stance', share: 1.4 }, { hero: 'stance', partner: 'hurt', mark: 'hit' }] },
  ],
}

const work: SceneSpec = {
  zone: 'market',
  rival: 'brawler',
  gap: GAP.close,
  actions: [
    { ms: 1600, beats: [{ hero: 'guard', partner: 'walk' }, { hero: 'guard', partner: 'punch' }, { hero: 'guard', partner: 'strong' }] },
    { ms: 1500, beats: [{ hero: 'strong', partner: 'hurt', mark: 'hit' }, { hero: 'uppercut', partner: 'juggle', mark: 'hit' }, { hero: 'stance', partner: 'down' }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0 && index === 0) return { rival: 200 * (1 - t) }
    if (play.action === 1 && index === 1) return { rival: 60 * t, lift: hop(t, 120) }
    if (play.action === 1 && index === 2) return { rival: 60 }
    return {}
  },
}

const tech: SceneSpec = {
  zone: 'factory',
  rival: 'kickboxer',
  gap: GAP.close,
  counter: true,
  actions: [
    { ms: 1800, beats: [{ hero: 'punch', partner: 'hurt', mark: 'hit' }, { hero: 'strong', partner: 'hurt', mark: 'hit' }, { hero: 'roundhouse', partner: 'hurt', mark: 'hit' }] },
    { ms: 1400, beats: [{ hero: 'spinKick', partner: 'hurt', mark: 'hit' }, { hero: 'stance', partner: 'down' }] },
  ],
  steps: ({ play, index }) => ({ rival: play.action === 1 && index === 1 ? 70 : 0 }),
}

const services: SceneSpec = {
  zone: 'subway',
  rival: 'wrestler',
  gap: GAP.clinch,
  actions: [
    { ms: 1300, beats: [{ hero: 'stance', partner: 'walk' }] },
    { ms: 1600, beats: [{ hero: 'throw', partner: 'juggle', share: 1.4 }, { hero: 'stance', partner: 'down' }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0) return { rival: 260 * (1 - t) }
    if (index === 0) return { rival: 240 * t, lift: hop(t, 170) }
    return { rival: 240 }
  },
}

// The super's juggle: each hit holds the old master higher before the wall splat.
const JUGGLE = { base: 90, per: 14, bounce: 46 }
const WALL = 120

const projects: SceneSpec = {
  zone: 'harbour',
  rival: 'master',
  gap: GAP.close + 30,
  actions: [
    { ms: 1300, beats: [{ hero: 'stance', partner: 'stance', mark: 'flash' }] },
    { ms: 2000, beats: [{ hero: 'punch', partner: 'juggle' }, { hero: 'strong', partner: 'juggle' }, { hero: 'roundhouse', partner: 'juggle' }, { hero: 'spinKick', partner: 'juggle' }] },
    { ms: 1300, beats: [{ hero: 'uppercut', partner: 'splat', mark: 'hit' }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 1) return { lift: JUGGLE.base + JUGGLE.per * index + hop(t, JUGGLE.bounce) }
    if (play.action === 2) return { rival: WALL * ramp(t, 0, 0.4) }
    return {}
  },
  zoom: ({ play }) => lerp(1, 1.1, shareOf(play, 0)) - 0.1 * shareOf(play, 2),
  props: () => (
    <>
      <Screen name="dim" fill="#000" />
      <Screen name="flare" fill={FS.flash} />
    </>
  ),
  write: (stage) => {
    const dim = fx(stage, 'dim')
    const flare = fx(stage, 'flare')
    return ({ play, t }) => {
      fadeTo(dim, play.action === 0 ? 0.35 * ramp(t, 0, 0.3) : play.action === 1 ? 0.35 : 0.35 * (1 - t))
      fadeTo(flare, play.action === 0 ? 0.7 * Math.max(0, 1 - Math.abs(t - 0.5) * 3) : 0)
    }
  },
}

const ventures: SceneSpec = {
  zone: 'plaza',
  rival: 'commando',
  gap: GAP.close,
  actions: [
    { ms: 1600, beats: [{ hero: 'parry', partner: 'punch', mark: 'parry' }, { hero: 'stance', partner: 'stance', share: 0.5 }, { hero: 'parry', partner: 'strong', mark: 'parry' }] },
    { ms: 1400, beats: [{ hero: 'spinKick', partner: 'hurt', mark: 'hit' }, { hero: 'stance', partner: 'down' }] },
  ],
  steps: ({ play, index }) => ({ rival: play.action === 1 && index === 1 ? 70 : 0 }),
}

// The jump in: the dancer leaves from range, meets the uppercut at the top of his arc and falls back.
const JUMP_HEIGHT = 170
const JUMP_IN = GAP.range - GAP.close - 30

const bands: SceneSpec = {
  zone: 'concert',
  rival: 'dancer',
  gap: GAP.range,
  command: ['forward', 'down', 'downForward', 'punch'],
  actions: [
    { ms: 1600, beats: [{ hero: 'stance', partner: 'jump', mark: 'input' }] },
    { ms: 1400, beats: [{ hero: 'uppercut', partner: 'juggle', mark: 'hit' }, { hero: 'stance', partner: 'down' }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 0) return { rival: -JUMP_IN * t, lift: hop(t / 2, JUMP_HEIGHT) }
    if (index === 0) return { rival: -JUMP_IN + 160 * t, lift: hop(0.5 + t / 2, JUMP_HEIGHT) }
    return { rival: -JUMP_IN + 160 }
  },
}

const muayThai: SceneSpec = {
  zone: 'temple',
  rival: 'nakMuay',
  gap: GAP.clinch,
  actions: [
    { ms: 1500, beats: [{ hero: 'knee', partner: 'hurt', mark: 'hit' }, { hero: 'knee', partner: 'hurt', mark: 'hit' }] },
    { ms: 1700, beats: [{ hero: 'knee', partner: 'hurt', mark: 'ko' }, { hero: 'stance', partner: 'down', share: 1.2 }] },
    { ms: 1300, beats: [{ hero: 'win', partner: 'down' }] },
  ],
  steps: ({ play, index, t }) => {
    if (play.action === 1 && index === 1) return { rival: 140 * ramp(t, 0, 0.6) }
    if (play.action === 2) return { rival: 140 }
    return {}
  },
  props: () => (
    <>
      <Screen name="koFlash" fill={FS.flash} />
      <KoPlate />
    </>
  ),
  write: (stage) => {
    const flash = fx(stage, 'koFlash')
    const ko = fx(stage, 'ko')
    return ({ play, beat, t }) => {
      fadeTo(flash, beat.mark === 'ko' ? 0.6 * bump((t - 0.4) / 0.6) : 0)
      fadeTo(ko, play.action === 0 ? 0 : play.action === 1 ? ramp(play.t, 0.3, 0.45) : 1 - ramp(play.t, 0.5, 1))
    }
  },
}

const contact: SceneSpec = {
  zone: 'castle',
  rival: 'school',
  gap: GAP.mid,
  actions: [{ ms: 1400, beats: [{ hero: 'win', partner: 'down' }] }],
}

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface TourScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  script: SceneScript
  /** The hit counter's word ("hits"). */
  hits: string
}

/** The scene's writer: where it is in its round, both fighters posed and placed, the camera, then its props. */
function bindScene(stage: HTMLElement, spec: SceneSpec, scene: Omit<TourScene, 'bind'>, profession: Profession): StageWriter {
  const heroNode = fx(stage, 'hero')
  const rivalNode = fx(stage, 'partner')
  const camera = fx(stage, 'camera')
  const shadow = rivalNode?.querySelector('[data-shadow]') ?? null
  const poseHero = scrubWriter(heroNode, profession, posesOf(spec.actions, 'hero'))
  const poseRival = scrubWriter(rivalNode, profession, posesOf(spec.actions, 'partner'))
  const wave = spec.wave ? waveWriter(stage) : null
  const command = spec.command ? commandWriter(stage, spec.command.length) : null
  const counter = spec.counter ? counterWriter(stage, scene.hits) : null
  const props = spec.write?.(stage)
  return (_progress, _reached, play = sceneEnd(scene.script)) => {
    const action = spec.actions[play.action]
    const { index, t } = beatIn(action, play.t)
    const beat = action.beats[index]
    const m: Moment = { play, beat, index, t, hits: spec.counter ? hitsUpTo(spec.actions, play) : 0 }
    const steps = { ...STILL, ...spec.steps?.(m) }
    const rock = beat.partner === 'hurt' ? bump(t) * KNOCK : 0
    const x = { hero: HERO_X + steps.hero, rival: HERO_X + spec.gap + steps.rival + rock }
    poseHero(beat.hero, t)
    poseRival(beat.partner, t)
    transformTo(heroNode, standAt(x.hero))
    transformTo(rivalNode, standAt(x.rival, steps.lift))
    transformTo(shadow, `translate(0 ${r1(steps.lift / SIZE)}) translate(${CELL.width} 0) scale(-1 1)`)
    const focus = (x.hero + x.rival) / 2 + CELL.width
    transformTo(camera, focusOn(focus, FLOOR - 150, spec.zoom?.(m) ?? 1))
    wave?.(m, x)
    command?.(beat.mark === 'input', t, x.hero)
    counter?.(m.hits, x.rival)
    props?.(m, x)
  }
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, profession: Profession): TourScene[] {
  const sceneOf = (id: SceneId, slot: SectionSlot | null): TourScene => {
    const spec = SCENES[id]
    const base = { id, slot, count: 0, script: scriptOf(spec.actions), hits: labels.hud.hits }
    return { ...base, bind: (stage) => bindScene(stage, spec, base, profession) }
  }
  return [sceneOf('hero', null), ...slots.map((slot) => sceneOf(slot.id, slot)), sceneOf('contact', null)]
}

/** A scene's picture: its stage of the tour, then the two fighters in the arena and the round's props. */
export function TourStage({ scene, profession, settled = false }: { scene: TourScene; profession: Profession; settled?: boolean }) {
  const spec = SCENES[scene.id]
  return (
    <Stage
      scene={scene}
      motion={TOUR_MOTION}
      settled={settled}
      className={look.tourStage}
      layers={[
        {
          name: 'sky',
          node: (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
              {ZONE_ART[spec.zone]}
            </svg>
          ),
        },
        {
          name: 'figure',
          node: (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
              <g className={look.troupe}>
                <g data-fx="camera">
                  {spec.props?.()}
                  <g data-fx="partner" transform={standAt(HERO_X + spec.gap)}>
                    <ScrubFighter profession={profession} who="partner" rival={spec.rival} mirror poses={posesOf(spec.actions, 'partner')} />
                  </g>
                  <g data-fx="hero" transform={standAt(HERO_X)}>
                    <ScrubFighter profession={profession} poses={posesOf(spec.actions, 'hero')} />
                  </g>
                  {spec.wave && <Wave />}
                  {spec.command && <CommandKeys keys={spec.command} />}
                  {spec.counter && <Counter label={scene.hits} />}
                </g>
              </g>
            </svg>
          ),
        },
      ]}
    />
  )
}
