'use client'

import type { ReactNode } from 'react'
import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { muayThaiFacts } from '@/lib/cv/sectionText'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, frames, fx, lerp, spread, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { ImpactBurst } from './badges'
import { beatAt, beatsOf, marksUpTo, reached as markReached, type Beat, type Bout } from './bout'
import { CrowdGroup, H, W, ZONE_ART, type Zone } from './backdrop'
import { ScrubFighter, scrubWriter } from './fighter'
import { CELL, type FighterPose } from './poses'
import { FS } from './palette'
import look from './world.module.css'

// The arcade tour as the page's scenes: the hero on the castle rooftop, each section a stage of the tour
// with its own bout, and the contact on the temple ring. Every bout is the one his section played before,
// now driven by the scroll (bout.ts beatAt): the lead while the scene rises, one beat per card as that
// card scrolls up, the close after the last card. About is the bonus stage, a punch per highlight denting
// the car and the uppercut wrecking it; Work walks him across the market a step per job; the Tech Stack
// throws a ki blast per category, lighting its target; Services launches a crate per service with the
// rising uppercut; Projects is the super move, a hit per project on the combo counter; Ventures is the
// parry, his partner's punch per venture turned aside; Bands is the show on the yacht's deck, a flurry per
// band; the Muay Thai record is the sparring round, K.O. and Perfect. Scroll up and it all plays back.

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
// He stands at HERO_X, a little forward when the bout moves him; his partner faces him from PARTNER_X.
const HERO_X = 980
const HERO_STEP = 120
const PARTNER_X = 1300

const place = (x: number): string => `translate(${x.toFixed(1)} ${TOP}) scale(${SIZE})`

// ---- the calls slammed on the screen: the round call lettering in gold on an ink outline ----

function Call({ x, y, size, name, children }: { x: number; y: number; size: number; name: string; children: string }) {
  return (
    <text
      data-fx={name}
      opacity="0"
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={size}
      fill={FS.hudYellow}
      stroke={FS.ink}
      strokeWidth={size / 10}
      paintOrder="stroke"
      className={`${look.face} uppercase`}
    >
      {children}
    </text>
  )
}

// ---- About's bonus car, side on, in four states of damage (data-frame 0 to 3) ----

function Car({ damage }: { damage: number }) {
  const roofDrop = Math.min(damage, 3) * 5
  const wrecked = damage >= 3
  const sill = wrecked ? 80 : 70
  return (
    <g data-frame={String(damage)} visibility={damage === 0 ? 'visible' : 'hidden'}>
      <ellipse cx={100} cy={86} rx={90} ry={4} fill={FS.ink} opacity={0.4} />
      <path d={`M14 ${sill} L22 44 H58 L76 ${18 + roofDrop} H136 L156 44 H186 L190 ${sill} Z`} fill={FS.p2} stroke={FS.ink} strokeWidth={3} strokeLinejoin="round" />
      <path d="M22 56 H188" stroke={FS.p2Dark} strokeWidth={3} />
      {damage < 2 && <path d={`M80 ${22 + roofDrop} H106 V42 H66 Z M110 ${22 + roofDrop} H132 L148 42 H110 Z`} fill={FS.parry} stroke={FS.ink} strokeWidth={2} />}
      {damage === 1 && <path d="M92 26 L86 36 M92 26 L100 34 M92 26 L96 20 M124 28 L118 38 M124 28 L132 36" stroke={FS.flash} strokeWidth={2} />}
      {damage >= 1 && <path d="M40 48 Q46 58 40 66 M150 50 Q158 56 152 66" stroke={FS.p2Dark} strokeWidth={3} fill="none" />}
      {wrecked ? (
        <path d="M70 30 H110 V52 H70 Z M112 30 H150 V52 H112 Z" fill={FS.p2Dark} stroke={FS.ink} strokeWidth={2} transform="translate(30 -60) rotate(24 110 40)" />
      ) : (
        <>
          <circle cx={52} cy={72} r={13} fill={FS.ink} />
          <circle cx={52} cy={72} r={5} fill={FS.chrome} />
          <circle cx={156} cy={72} r={13} fill={FS.ink} />
          <circle cx={156} cy={72} r={5} fill={FS.chrome} />
        </>
      )}
      <rect x={180} y={50} width={10} height={6} fill={FS.gold} stroke={FS.ink} strokeWidth={1.5} />
    </g>
  )
}

const CAR_X = 1230
const CAR_SCALE = 1.7
const DAMAGES = [0, 1, 2, 3]

// ---- the props a section counts, one per card ----

function Target({ x, i }: { x: number; i: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${FLOOR})`}>
      <rect x={-6} y={-150} width={12} height={150} fill="#6b5a4a" stroke={FS.ink} strokeWidth={3} />
      <circle cy={-180} r={42} fill={FS.gi} stroke={FS.ink} strokeWidth={4} />
      <circle cy={-180} r={26} fill={FS.p2} stroke={FS.ink} strokeWidth={3} />
      <circle cy={-180} r={10} fill={FS.gi} />
      <g data-fx={`lit-${i}`} opacity="0">
        <svg x={-70} y={-250} width={140} height={140} overflow="visible">
          <ImpactBurst className="" />
        </svg>
      </g>
    </g>
  )
}

function Crate({ x, i }: { x: number; i: number }) {
  return (
    <g data-fx={`crate-${i}`} transform={`translate(${x.toFixed(1)} ${FLOOR})`}>
      <rect x={-45} y={-90} width={90} height={90} fill="#c98a3a" stroke={FS.ink} strokeWidth={4} />
      <path d="M-45 -90 L45 0 M45 -90 L-45 0" stroke="#8a5a20" strokeWidth={6} />
      <rect x={-45} y={-90} width={90} height={90} fill="none" stroke={FS.ink} strokeWidth={4} />
    </g>
  )
}

// ---- the scenes ----

interface SceneSpec {
  zone: Zone
  bout: Bout
  /** The poses each fighter plays in the bout, the first shown before the scene's writer runs. */
  props?: (xs: readonly number[], labels: Labels) => ReactNode
  /** The partner stands across from him in this bout. */
  partner?: boolean
  /** Where he stands at beat `index` of `beats`: forward of HERO_X as the bout moves him. */
  heroX?: (beats: readonly Beat[], index: number, t: number) => number
  write?: (stage: HTMLElement, xs: readonly number[]) => (beats: readonly Beat[], index: number, t: number, cardsReached: number) => void
}

const posesOf = (beats: readonly Beat[], who: 'hero' | 'partner'): FighterPose[] =>
  Array.from(new Set(beats.map((beat) => (who === 'hero' ? beat.hero : (beat.partner ?? 'stance')))))

/** About, the bonus stage: he walks up to the car, a punch per highlight dents it, the uppercut wrecks it. */
const about: SceneSpec = {
  zone: 'castle',
  bout: { lead: [{ hero: 'walk' }], item: { hero: 'punch', mark: 'hit' }, close: [{ hero: 'shoryuken', mark: 'wreck' }, { hero: 'win' }] },
  heroX: (_beats, index, t) => HERO_X + (index === 0 ? t : 1) * HERO_STEP,
  props: (_xs, labels) => (
    <>
      <g data-fx="car" transform={`translate(${CAR_X} ${FLOOR - 86 * CAR_SCALE}) scale(${CAR_SCALE})`}>
        {DAMAGES.map((damage) => (
          <Car key={damage} damage={damage} />
        ))}
      </g>
      <Call x={W / 2} y={170} size={64} name="bonus">
        {labels.arcade.bonus}
      </Call>
      <Call x={1320} y={420} size={80} name="perfect">
        {labels.arcade.perfect}
      </Call>
    </>
  ),
  write: (stage, xs) => {
    const car = frames(fx(stage, 'car'), '0')
    const bonus = fx(stage, 'bonus')
    const perfect = fx(stage, 'perfect')
    return (beats, index) => {
      const wrecked = markReached(beats, index, 'wreck')
      car(String(wrecked ? 3 : Math.min(2, Math.ceil((marksUpTo(beats, index, 'hit') * 2) / Math.max(1, xs.length)))))
      fadeTo(bonus, wrecked ? 0 : 1)
      fadeTo(perfect, wrecked ? 1 : 0)
    }
  },
}

/** Work: he walks the market a step per job. */
const work: SceneSpec = {
  zone: 'market',
  bout: { lead: [{ hero: 'stance' }], item: { hero: 'walk' }, close: [{ hero: 'win' }] },
  heroX: (beats, index, t) => {
    const steps = beats.filter((beat) => beat.hero === 'walk').length
    const walked = Math.min(steps, Math.max(0, index - 1 + (beats[index]?.hero === 'walk' ? t : 1)))
    return lerp(HERO_X - 260, HERO_X + 260, steps ? walked / steps : 0)
  },
}

const TARGETS = { from: 1260, to: 1480 }

/** The Tech Stack: a ki blast per category, each lighting its target. */
const tech: SceneSpec = {
  zone: 'market',
  bout: { lead: [{ hero: 'stance' }], item: { hero: 'hadouken', mark: 'light' }, close: [{ hero: 'win' }] },
  props: (xs) => xs.map((x, i) => <Target key={i} x={x} i={i} />),
  write: (stage, xs) => {
    const lits = xs.map((_, i) => fx(stage, `lit-${i}`))
    return (_beats, _index, _t, cardsReached) => lits.forEach((lit, i) => fadeTo(lit, ramp(cardsReached - i, 0.7, 0.85)))
  },
}

/** Services: the rising uppercut launches a crate per service. */
const services: SceneSpec = {
  zone: 'market',
  bout: { lead: [{ hero: 'walk' }], item: { hero: 'shoryuken', mark: 'hit' }, close: [{ hero: 'win' }] },
  props: (xs) => xs.map((x, i) => <Crate key={i} x={x} i={i} />),
  write: (stage, xs) => {
    const crates = xs.map((_, i) => fx(stage, `crate-${i}`))
    return (_beats, _index, _t, cardsReached) =>
      crates.forEach((crate, i) => {
        const launched = ramp(cardsReached - i, 0.4, 0.8)
        transformTo(crate, `translate(${xs[i].toFixed(1)} ${(FLOOR - launched * 520).toFixed(1)}) rotate(${(launched * 200).toFixed(1)} 0 -45)`)
        fadeTo(crate, 1 - ramp(launched, 0.7, 1))
      })
  },
}

/** Projects: the super move; the screen dims to the flash, then a hit per project on the combo counter. */
const projects: SceneSpec = {
  zone: 'harbour',
  bout: { lead: [{ hero: 'stance' }, { hero: 'hadouken', mark: 'flash' }], item: { hero: 'tatsumaki', mark: 'hit' }, close: [{ hero: 'win' }] },
  props: (_xs, labels) => (
    <>
      <rect data-fx="flash" width={W} height={H} fill={FS.flash} opacity="0" />
      <g data-fx="combo" opacity="0">
        <text data-fx="hits" x={1440} y={300} textAnchor="end" fontSize={120} fill={FS.hudYellow} stroke={FS.ink} strokeWidth={12} paintOrder="stroke" className={look.face}>
          0
        </text>
        <text x={1460} y={300} fontSize={48} fill={FS.callTop} stroke={FS.ink} strokeWidth={6} paintOrder="stroke" className={`${look.face} uppercase`}>
          {labels.hud.hits}
        </text>
      </g>
      <Call x={W / 2} y={170} size={64} name="super">
        {labels.arcade.superMove}
      </Call>
    </>
  ),
  write: (stage) => {
    const flash = fx(stage, 'flash')
    const combo = fx(stage, 'combo')
    const hits = fx(stage, 'hits')
    const call = fx(stage, 'super')
    let shown = -1
    return (beats, index, t) => {
      const flashing = beats[index]?.mark === 'flash'
      fadeTo(flash, flashing ? 0.8 * Math.max(0, 1 - Math.abs(t - 0.5) * 3) : 0)
      fadeTo(call, flashing || index < 1 ? 1 : 0)
      const count = marksUpTo(beats, index, 'hit')
      fadeTo(combo, count > 1 ? 1 : 0)
      if (count === shown || !hits) return
      shown = count
      hits.textContent = String(count)
    }
  },
}

/** Ventures: his partner throws a punch per venture and he parries each, then answers with the uppercut. */
const ventures: SceneSpec = {
  zone: 'harbour',
  partner: true,
  bout: {
    lead: [{ hero: 'stance', partner: 'walk' }],
    item: { hero: 'parry', partner: 'punch', mark: 'light' },
    close: [{ hero: 'shoryuken', partner: 'hurt', mark: 'hit' }, { hero: 'win', partner: 'stance' }],
  },
}

/** Bands: the show on the yacht's deck, his flurry on the kit per band, his partner dancing, the crowd at the rail. */
const bands: SceneSpec = {
  zone: 'harbour',
  partner: true,
  bout: { lead: [{ hero: 'stance', partner: 'win' }], item: { hero: 'act', partner: 'win' }, close: [{ hero: 'win', partner: 'win' }] },
  props: () => (
    <g transform={`translate(0 ${FLOOR + 30})`}>
      <CrowdGroup x={120} base={0} count={6} gap={46} scale={1.9} i={0} />
      <CrowdGroup x={640} base={0} count={5} gap={46} scale={1.9} i={1} />
      <CrowdGroup x={1140} base={0} count={7} gap={46} scale={1.9} i={2} />
    </g>
  ),
}

/** The Muay Thai record: the sparring round, a strike per line of his record, K.O., then Perfect. */
const muayThai: SceneSpec = {
  zone: 'temple',
  partner: true,
  bout: {
    lead: [{ hero: 'stance', partner: 'walk' }],
    item: { hero: 'act', partner: 'hurt', mark: 'hit' },
    close: [{ hero: 'act', partner: 'down', mark: 'ko' }, { hero: 'win', partner: 'down', mark: 'perfect' }],
  },
  props: (_xs, labels) => (
    <>
      <Call x={W / 2} y={260} size={110} name="ko">
        {labels.arcade.ko}
      </Call>
      <Call x={W / 2} y={420} size={90} name="perfect">
        {labels.arcade.perfect}
      </Call>
    </>
  ),
  write: (stage) => {
    const ko = fx(stage, 'ko')
    const perfect = fx(stage, 'perfect')
    return (beats, index) => {
      fadeTo(ko, markReached(beats, index, 'ko') ? 1 : 0)
      fadeTo(perfect, markReached(beats, index, 'perfect') ? 1 : 0)
    }
  },
}

/** The hero: he waits on the castle rooftop in his stance, bouncing on his feet as the page starts to scroll. */
const hero: SceneSpec = { zone: 'castle', bout: { lead: [{ hero: 'stance' }], item: { hero: 'stance' }, close: [] } }

/** The contact: the win screen, him in his win pose over his partner on the temple floor. */
const contact: SceneSpec = { zone: 'temple', partner: true, bout: { lead: [{ hero: 'win', partner: 'down' }], item: { hero: 'win', partner: 'down' }, close: [] } }

const SCENES: Record<SceneId, SceneSpec> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

// How many cards each section counts, read off the slot its cards are drawn from: one beat per card.
const COUNT_FOR: { [Id in SectionId]: (slot: SlotOf<Id>, labels: Labels, highlights: readonly string[]) => number } = {
  about: (_slot, _labels, highlights) => highlights.length,
  work: ({ jobs }) => jobs.length,
  tech: ({ categories }) => categories.length,
  services: ({ services: list }) => list.length,
  projects: ({ projects: list }) => list.length,
  ventures: ({ companies }) => companies.length,
  bands: ({ bands: list }) => list.length,
  muayThai: ({ martialArts }, labels) => muayThaiFacts(martialArts, labels).length + martialArts.primary.achievements.length,
}

const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number =>
  (COUNT_FOR[slot.id] as (slot: SectionSlot, labels: Labels, highlights: readonly string[]) => number)(slot, labels, highlights)

export interface TourScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  xs: readonly number[]
  beats: readonly Beat[]
}

/** The scene's writer: where it is in its bout, both fighters posed and stepped, then its own props. */
function bindScene(stage: HTMLElement, spec: SceneSpec, scene: Omit<TourScene, 'bind'>, profession: Profession): StageWriter {
  const { beats, xs, count } = scene
  const heroPoses = posesOf(beats, 'hero')
  const partnerPoses = posesOf(beats, 'partner')
  const heroNode = fx(stage, 'hero')
  const pose = scrubWriter(heroNode, profession, heroPoses)
  const partner = spec.partner ? scrubWriter(fx(stage, 'partner'), profession, partnerPoses) : null
  const props = spec.write?.(stage, xs)
  return (progress, cardsReached) => {
    const { index, t } = beatAt(spec.bout, count, cardsReached, progress)
    const beat = beats[index] ?? beats[beats.length - 1]
    // A scene with no cards (the hero, the contact) plays its pose over the scene itself.
    const at = count === 0 ? progress : t
    pose(beat.hero, at)
    transformTo(heroNode, place(spec.heroX?.(beats, index, at) ?? HERO_X))
    partner?.(beat.partner ?? 'stance', at)
    props?.(beats, index, at, cardsReached)
  }
}

const XS_FOR: Partial<Record<SceneId, readonly [number, number]>> = {
  tech: [TARGETS.from, TARGETS.to],
  services: [1240, 1480],
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[], profession: Profession): TourScene[] {
  const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number): TourScene => {
    const spec = SCENES[id]
    const range = XS_FOR[id]
    const base = { id, slot, count, xs: range ? spread(count, ...range) : [], beats: beatsOf(spec.bout, Math.max(count, 1)) }
    return { ...base, bind: (stage) => bindScene(stage, spec, base, profession) }
  }
  return [sceneOf('hero', null, 0), ...slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights))), sceneOf('contact', null, 0)]
}

/** A scene's picture: its stage of the tour, then the fighters and the section's props. */
export function TourStage({ scene, profession, labels, settled = false }: { scene: TourScene; profession: Profession; labels: Labels; settled?: boolean }) {
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
                {spec.props?.(scene.xs, labels)}
                {spec.partner && (
                  <g data-fx="partner" transform={place(PARTNER_X)}>
                    <ScrubFighter profession={profession} who="partner" mirror poses={posesOf(scene.beats, 'partner')} />
                  </g>
                )}
                <g data-fx="hero" data-worlds-figure="" transform={place(HERO_X)}>
                  <ScrubFighter profession={profession} poses={posesOf(scene.beats, 'hero')} />
                </g>
              </g>
            </svg>
          ),
        },
      ]}
    />
  )
}
