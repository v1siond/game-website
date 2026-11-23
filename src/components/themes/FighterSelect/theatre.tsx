'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, focusOn, fx, lerp, r1, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import { SETTLED_PROGRESS, type LayerMotions, type StageWriter, type TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { beatAt, planOf, type Beat, type Bout, type Place, type Plan } from './bout'
import { H, W, ZONE_ART, type Zone } from './backdrop'
import { KiBall, ScrubFighter, scrubWriter } from './fighter'
import { CELL, type FighterPose, type Pt } from './poses'
import { FS } from './palette'
import look from './world.module.css'

// The arcade tour as the page's scenes: the hero on the castle rooftop, each section a round on its own
// stage of the tour, and the contact on the temple ring. In every round he stands in the arena against his
// sparring partner and each card is one exchange of a fight (bout.ts): the lead while the scene rises, one
// exchange per card as that card scrolls up, the close after the last card. About chains a jab, a strong
// punch and a roundhouse, a link per highlight, and cancels into the energy wave; Work blocks the partner's
// attack and punishes it, per job, ending on the rising uppercut; the Tech Stack trades energy waves that
// clash in the middle, per category, until his gets through; Services meets every jump in with the rising
// uppercut; Projects is the super, the screen dimmed and the partner juggled a hit per project into a wall
// splat; Ventures parries the partner's punch per venture and counters with the spinning kick; Bands spins
// kicks into the partner's guard until it cracks and he is dizzy; the Muay Thai record is the clinch, a knee
// per line, and the throw. The pair stays in the arena: hits push them a step along it and the camera pans
// with them, pushing in on the super and the wall splat. Scroll up and the round plays back. A scene drawn
// settled (reduced motion) holds its exchange at its peak.

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
// He stands at HERO_X; his partner faces him GAP further on, close for blows, in the clinch for knees, at
// range for waves and jump ins.
const HERO_X = 900
const GAP = { clinch: 70, close: 110, mid: 220, range: 330 } as const
// Hits push the pair along the arena a step per card, at most MAX_DRIFT in a round, the camera panning
// PAN of the way with them; a hurt partner rocks back KNOCK at the height of the hit.
const STEP = 40
const MAX_DRIFT = 160
const PAN = 0.6
const KNOCK = 22

// Points of a fighter's own 160 by 170 cell: the hands where a wave leaves, the chest where it lands, the
// raised guard where a kick cracks it.
const HAND: Pt = [116, 72]
const CHEST: Pt = [70, 80]
const GUARD_AT: Pt = [84, 52]

/** Where on the canvas a point of his cell is, or of his partner's mirrored one. */
const heroAt = (x: number, [cx, cy]: Pt): Pt => [x + cx * SIZE, TOP + cy * SIZE]
const partnerAt = (x: number, [cx, cy]: Pt): Pt => [x + (CELL.width - cx) * SIZE, TOP + cy * SIZE]

const standAt = (x: number, lift = 0): string => `translate(${r1(x)} ${r1(TOP - lift)}) scale(${SIZE})`

/** What a scene's writers know of the moment: the beat, where in the bout it is, and where the two stand. */
interface Moment {
  beat: Beat
  place: Place
  count: number
  reached: number
  heroX: number
  partnerX: number
}

interface SceneSpec {
  zone: Zone
  bout: Bout
  gap: number
  /** The beat a settled scene holds and how far through it: the exchange at its peak. In the lead (a scene
   *  with no cards), in the last card's exchange, or in the close. */
  peak: { in: 'lead' | 'card' | 'close'; beat: number; t: number }
  /** The partner's step off his place and how high he flies this beat. */
  partner?: (m: Moment) => { dx: number; lift: number }
  /** How far the camera pushes in on the pair. */
  zoom?: (m: Moment) => number
  /** The scene throws energy waves. */
  waves?: boolean
  props?: () => ReactNode
  write?: (stage: HTMLElement) => (m: Moment) => void
}

const posesOf = (beats: readonly Beat[], who: 'hero' | 'partner'): FighterPose[] =>
  Array.from(new Set(beats.map((beat) => (who === 'hero' ? beat.hero : (beat.partner ?? 'stance')))))

// ---- the energy waves: his from his hands, the partner's from his, meeting in the middle on a clash ----

// A wave flies over this stretch of its beat, bursts where it lands over the next.
const WAVE = { from: 0.35, to: 0.6, gone: 0.62, burst: 0.52, fade: [0.62, 0.8] as const }

function Waves() {
  return (
    <>
      <g data-fx="wave-hero" opacity="0">
        <g transform={`scale(${SIZE}) translate(${-HAND[0]} ${-HAND[1]})`}>
          <KiBall kind="ki" className="" />
        </g>
      </g>
      <g data-fx="wave-partner" opacity="0">
        <g transform={`scale(${-SIZE} ${SIZE}) translate(${-HAND[0]} ${-HAND[1]})`}>
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

function wavesWriter(stage: HTMLElement): (m: Moment) => void {
  const hero = fx(stage, 'wave-hero')
  const partner = fx(stage, 'wave-partner')
  const burst = fx(stage, 'burst')
  return ({ beat, place: { t }, heroX, partnerX }) => {
    const [fromX, y] = heroAt(heroX, HAND)
    const [partnerFrom] = partnerAt(partnerX, HAND)
    const clash = beat.mark === 'clash'
    const target = clash ? (fromX + partnerFrom) / 2 : partnerAt(partnerX, CHEST)[0]
    const flight = ramp(t, WAVE.from, WAVE.to)
    const flying = flight > 0 && t < WAVE.gone
    transformTo(hero, `translate(${r1(lerp(fromX, target, flight))} ${r1(y)})`)
    fadeTo(hero, beat.hero === 'fireball' && flying ? 1 : 0)
    transformTo(partner, `translate(${r1(lerp(partnerFrom, target, flight))} ${r1(y)})`)
    fadeTo(partner, beat.partner === 'fireball' && flying ? 1 : 0)
    const landing = beat.hero === 'fireball' ? ramp(t, WAVE.burst, WAVE.to) * (1 - ramp(t, ...WAVE.fade)) : 0
    transformTo(burst, `translate(${r1(target)} ${r1(y)}) scale(${(0.6 + 0.6 * ramp(t, WAVE.burst, WAVE.fade[1])).toFixed(3)})`)
    fadeTo(burst, landing)
  }
}

// ---- the rounds ----

/** About: a chain, a link per highlight (jab, strong, roundhouse in turn), cancelled into the energy wave. */
const about: SceneSpec = {
  zone: 'castle',
  gap: GAP.close,
  waves: true,
  bout: {
    lead: [{ hero: 'walk', partner: 'stance' }],
    cards: [[{ hero: 'punch', partner: 'hurt', mark: 'hit' }], [{ hero: 'strong', partner: 'hurt', mark: 'hit' }], [{ hero: 'roundhouse', partner: 'hurt', mark: 'hit' }]],
    close: [{ hero: 'fireball', partner: 'hurt', mark: 'hit' }, { hero: 'stance', partner: 'down' }],
  },
  peak: { in: 'close', beat: 0, t: 0.58 },
}

/** Work: per job the partner attacks and he blocks it, then punishes with the strong punch; the rising
 *  uppercut ends it. */
const work: SceneSpec = {
  zone: 'market',
  gap: GAP.close,
  bout: {
    lead: [{ hero: 'stance', partner: 'walk' }],
    cards: [[{ hero: 'guard', partner: 'punch' }, { hero: 'strong', partner: 'hurt', mark: 'hit' }]],
    close: [{ hero: 'uppercut', partner: 'down', mark: 'hit' }],
  },
  peak: { in: 'close', beat: 0, t: 0.4 },
}

/** The Tech Stack: energy waves traded at range, a pair per category clashing in the middle, until his gets
 *  through. */
const tech: SceneSpec = {
  zone: 'market',
  gap: GAP.range,
  waves: true,
  bout: {
    lead: [{ hero: 'walkBack', partner: 'stance' }],
    cards: [[{ hero: 'fireball', partner: 'fireball', mark: 'clash' }]],
    close: [{ hero: 'fireball', partner: 'down', mark: 'hit' }],
  },
  peak: { in: 'card', beat: 0, t: 0.6 },
}

// The jump in: the partner leaves from range, meets the uppercut at the top of his arc and falls back.
const JUMP_HEIGHT = 150
const JUMP_IN = GAP.range - GAP.close - 30

/** Services: per service the partner jumps in and he answers with the rising uppercut. */
const services: SceneSpec = {
  zone: 'market',
  gap: GAP.range,
  bout: {
    lead: [{ hero: 'stance', partner: 'walkBack' }],
    cards: [[{ hero: 'stance', partner: 'jump' }, { hero: 'uppercut', partner: 'juggle', mark: 'hit' }]],
    close: [{ hero: 'stance', partner: 'down' }],
  },
  peak: { in: 'card', beat: 1, t: 0.4 },
  partner: ({ beat, place: { t } }) => {
    if (beat.partner === 'jump') return { dx: -JUMP_IN * t, lift: hop(t / 2, JUMP_HEIGHT) }
    if (beat.partner === 'juggle') return { dx: -JUMP_IN + 140 * t, lift: hop(0.5 + t / 2, JUMP_HEIGHT) }
    return { dx: 0, lift: 0 }
  },
}

// The super's juggle: each hit holds the partner higher, to this height, before the wall splat.
const JUGGLE = { base: 90, per: 10, most: 8, bounce: 50 }
const WALL = 120

/** Projects: the super; the screen dims and flashes, then a hit per project juggles the partner, and the
 *  rising uppercut splats him on the wall. */
const projects: SceneSpec = {
  zone: 'harbour',
  gap: GAP.close + 30,
  bout: {
    lead: [{ hero: 'stance', partner: 'stance', mark: 'flash' }],
    cards: [[{ hero: 'punch', partner: 'juggle' }], [{ hero: 'strong', partner: 'juggle' }], [{ hero: 'roundhouse', partner: 'juggle' }], [{ hero: 'spinKick', partner: 'juggle' }]],
    close: [{ hero: 'uppercut', partner: 'splat', mark: 'hit' }],
  },
  peak: { in: 'close', beat: 0, t: 0.3 },
  partner: ({ beat, place: { t, card } }) => {
    if (beat.partner === 'juggle') return { dx: 0, lift: JUGGLE.base + JUGGLE.per * Math.min(card, JUGGLE.most) + hop(t, JUGGLE.bounce) }
    if (beat.partner === 'splat') return { dx: WALL, lift: 0 }
    return { dx: 0, lift: 0 }
  },
  zoom: ({ beat, place: { t, card }, count }) => {
    if (card === -1) return beat.mark === 'flash' ? lerp(1, 1.1, ramp(t, 0.3, 1)) : 1
    if (card < count) return 1.1
    return lerp(1.12, 1, ramp(t, 0.5, 1))
  },
  props: () => (
    <>
      <rect data-fx="dim" x={-W} y={-H} width={W * 3} height={H * 3} fill="#000" opacity="0" />
      <rect data-fx="flash" x={-W} y={-H} width={W * 3} height={H * 3} fill={FS.flash} opacity="0" />
    </>
  ),
  write: (stage) => {
    const dim = fx(stage, 'dim')
    const flash = fx(stage, 'flash')
    return ({ beat, place: { t, card }, count }) => {
      const flashing = beat.mark === 'flash'
      fadeTo(dim, card >= 0 && card < count ? 0.3 : flashing ? 0.3 * ramp(t, 0, 0.3) : 0)
      fadeTo(flash, flashing ? 0.7 * Math.max(0, 1 - Math.abs(t - 0.5) * 3) : 0)
    }
  },
}

/** Ventures: per venture the partner punches and he parries it in a blue flash; the spinning kick counters. */
const ventures: SceneSpec = {
  zone: 'harbour',
  gap: GAP.close,
  bout: {
    lead: [{ hero: 'stance', partner: 'walk' }],
    cards: [[{ hero: 'parry', partner: 'punch' }]],
    close: [{ hero: 'spinKick', partner: 'down', mark: 'hit' }],
  },
  peak: { in: 'card', beat: 0, t: 0.3 },
}

/** Bands: per band a spinning kick into the partner's guard, cracking it a little more each time, until it
 *  breaks and he is dizzy. */
const bands: SceneSpec = {
  zone: 'harbour',
  gap: GAP.close,
  bout: {
    lead: [{ hero: 'stance', partner: 'guard' }],
    cards: [[{ hero: 'spinKick', partner: 'guard', mark: 'hit' }]],
    close: [{ hero: 'stance', partner: 'dizzy' }],
  },
  peak: { in: 'close', beat: 0, t: 0.3 },
  props: () => (
    <g data-fx="crack" opacity="0">
      <path d="M0 -34 L7 -14 L-3 0 L9 16 L0 34 M7 -14 L19 -20 M9 16 L21 22 M-3 0 L-15 -6" fill="none" stroke={FS.flash} strokeWidth={3} strokeLinejoin="round" />
    </g>
  ),
  write: (stage) => {
    const crack = fx(stage, 'crack')
    return ({ beat, count, reached, partnerX }) => {
      const [x, y] = partnerAt(partnerX, GUARD_AT)
      transformTo(crack, `translate(${r1(x)} ${r1(y)}) scale(${SIZE})`)
      fadeTo(crack, beat.partner === 'guard' ? Math.min(1, reached / Math.max(1, count)) : 0)
    }
  },
}

/** The Muay Thai record: the clinch, a knee per line of the record, then the throw and his win pose. */
const muayThai: SceneSpec = {
  zone: 'temple',
  gap: GAP.clinch,
  bout: {
    lead: [{ hero: 'walk', partner: 'stance' }],
    cards: [[{ hero: 'knee', partner: 'hurt', mark: 'hit' }]],
    close: [{ hero: 'throw', partner: 'down' }, { hero: 'win', partner: 'down' }],
  },
  peak: { in: 'close', beat: 0, t: 0.55 },
  partner: ({ beat, place: { t, card }, count }) => ({ dx: card === count && beat.partner === 'down' ? (beat.hero === 'throw' ? 140 * ramp(t, 0.3, 1) : 140) : 0, lift: 0 }),
}

/** The hero: the two of them squared up on the castle rooftop as the page starts. */
const hero: SceneSpec = { zone: 'castle', gap: GAP.mid, bout: { lead: [{ hero: 'stance', partner: 'stance' }], cards: [], close: [] }, peak: { in: 'lead', beat: 0, t: 0 } }

/** The contact: the win screen, him in his win pose over his partner on the temple floor. */
const contact: SceneSpec = { zone: 'temple', gap: GAP.mid, bout: { lead: [{ hero: 'win', partner: 'down' }], cards: [], close: [] }, peak: { in: 'lead', beat: 0, t: 0.99 } }

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

// The cards a section counts, the shared count (stageItems): the record's facts and its achievements both.
const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number => {
  const { lead, count } = stageItems(slot, labels, highlights.length)
  return lead + count
}

export interface TourScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  plan: Plan
}

/** The place a settled scene holds: its peak beat. */
function peakOf({ peak, bout }: SceneSpec, { starts }: Plan, count: number): Place {
  if (peak.in === 'lead' || count === 0) return { index: peak.beat, t: peak.t, card: -1 }
  if (peak.in === 'card') return { index: starts[count - 1] + peak.beat, t: peak.t, card: count - 1 }
  return { index: starts[count] + Math.min(peak.beat, bout.close.length - 1), t: peak.t, card: count }
}

/** The scene's writer: where it is in its round, both fighters posed and placed, the camera, then its props. */
function bindScene(stage: HTMLElement, spec: SceneSpec, scene: Omit<TourScene, 'bind'>, profession: Profession): StageWriter {
  const { plan, count } = scene
  const heroNode = fx(stage, 'hero')
  const partnerNode = fx(stage, 'partner')
  const camera = fx(stage, 'camera')
  const shadow = partnerNode?.querySelector('[data-shadow]') ?? null
  const pose = scrubWriter(heroNode, profession, posesOf(plan.beats, 'hero'))
  const partner = scrubWriter(partnerNode, profession, posesOf(plan.beats, 'partner'))
  const waves = spec.waves ? wavesWriter(stage) : null
  const props = spec.write?.(stage)
  const peak = peakOf(spec, plan, count)
  return (progress, cardsReached) => {
    const settled = progress === SETTLED_PROGRESS && cardsReached >= count
    const place = settled ? peak : beatAt(spec.bout, plan, cardsReached, progress)
    const beat = plan.beats[place.index] ?? plan.beats[plan.beats.length - 1]
    const reached = settled ? count : cardsReached
    const drift = Math.min(MAX_DRIFT, reached * Math.min(STEP, MAX_DRIFT / Math.max(1, count)))
    const base: Moment = { beat, place, count, reached, heroX: HERO_X + drift, partnerX: HERO_X + spec.gap + drift }
    const { dx, lift } = spec.partner?.(base) ?? { dx: 0, lift: 0 }
    const rock = beat.partner === 'hurt' ? Math.sin(Math.PI * place.t) * KNOCK : 0
    const m: Moment = { ...base, partnerX: base.partnerX + dx + rock }
    pose(beat.hero, place.t)
    partner(beat.partner ?? 'stance', place.t)
    transformTo(heroNode, standAt(m.heroX))
    transformTo(partnerNode, standAt(m.partnerX, lift))
    transformTo(shadow, `translate(0 ${r1(lift / SIZE)}) translate(${CELL.width} 0) scale(-1 1)`)
    const focus = (m.heroX + m.partnerX) / 2 + CELL.width
    transformTo(camera, `translate(${r1(-drift * PAN)} 0) ${focusOn(focus, FLOOR - 150, spec.zoom?.(m) ?? 1)}`)
    waves?.(m)
    props?.(m)
  }
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[], profession: Profession): TourScene[] {
  const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number): TourScene => {
    const spec = SCENES[id]
    const base = { id, slot, count, plan: planOf(spec.bout, count) }
    return { ...base, bind: (stage) => bindScene(stage, spec, base, profession) }
  }
  return [sceneOf('hero', null, 0), ...slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights))), sceneOf('contact', null, 0)]
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
                    <ScrubFighter profession={profession} who="partner" mirror poses={posesOf(scene.plan.beats, 'partner')} />
                  </g>
                  <g data-fx="hero" transform={standAt(HERO_X)}>
                    <ScrubFighter profession={profession} poses={posesOf(scene.plan.beats, 'hero')} />
                  </g>
                  {spec.waves && <Waves />}
                </g>
              </g>
            </svg>
          ),
        },
      ]}
    />
  )
}
