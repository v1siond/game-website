'use client'

import type { Labels } from '@/lib/cv/labels'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { ramp } from '@/lib/scroll/stage'
import { fadeTo, fx, lerp, r1, spread, transformTo } from '@/components/themes/shared/stageNodes'
import { Stage } from '@/components/themes/shared/theatre/Stage'
import type { LayerMotions, StageWriter, TheatreScene } from '@/components/themes/shared/theatre/useTheatre'
import { ChaosLand } from './chaosZone'
import { FrostLand } from './frostZone'
import { GolemRise, RISEN, ROCK_COUNT, riseWriter } from './golem'
import { REALM } from './palette'
import { REALM_OF } from './sections'
import look from './world.module.css'

// The two realms as the page's scenes: the hero on the chaos battlefield with the infernal golem standing
// whole, each section a stage of its realm (REALM_OF), and the contact before the ice throne. On a chaos
// stage the golem rises once more: a meteor falls on the field as the stage rises from the dark and bursts,
// then a card's share of his rocks flies home as each card scrolls up, and he stands whole after the last.
// On a frost stage he waits as the frost king among his spires: one ice spire grows beside him per card, his
// runeblade glinting as it grows. Scroll up and it all plays back.

export type SceneId = 'hero' | SectionId | 'contact'
type Realm = 'chaos' | 'frost'

/** The land pushes in across its scene, the figure a little more than the land behind it. */
export const REALM_MOTION: LayerMotions = {
  land: { zoom: [1.0, 1.05], lift: [0, -1] },
  figure: { zoom: [1.02, 1.08], lift: [0, -2] },
}

// The meteor falls and bursts while the stage rises, before its first card can reach the reading line.
const FALL = [0.02, 0.08] as const
const BURST = [0.08, 0.12] as const

// The spires stand in a 560 by 200 box beside the frost king, on its floor; each grows from a sliver.
const SPIRE_BOX = { width: 560, height: 200, floor: 196 }
const SPIRE_ROW = [40, 520] as const
const SPIRE_SEED = 0.1
// The blade's glow at rest, and how much brighter it glints at the height of a spire's growth.
const GLOW_REST = 0.15
const GLOW_GLINT = 0.45

export interface RealmScene extends TheatreScene {
  id: SceneId
  slot: SectionSlot | null
  realm: Realm
  /** This stage's frost king is the world's figure (data-worlds-figure): the first frost stage only. */
  figure: boolean
  xs: readonly number[]
}

/** A chaos stage's writer: the golem whole on a scene with no cards, else his rise, a card's share at a time. */
const chaosWriter = (stage: HTMLElement, count: number): StageWriter => {
  const rise = riseWriter(stage)
  if (count === 0) return () => rise(RISEN)
  return (progress, reached) =>
    rise({
      fall: ramp(progress, ...FALL),
      burst: ramp(progress, ...BURST),
      built: Math.min(ROCK_COUNT, (reached * ROCK_COUNT) / count),
      whole: ramp(reached, count - 0.25, count),
    })
}

/** A frost stage's writer: a spire grows per card, the runeblade glinting at the height of each one's growth. */
const frostWriter = (stage: HTMLElement, xs: readonly number[]): StageWriter => {
  const glow = fx(stage, 'blade-glow')
  const spires = xs.map((x, i) => ({ x, node: fx(stage, `spire-${i}`) }))
  return (_progress, reached) => {
    let glint = 0
    for (const [i, { x, node }] of spires.entries()) {
      const grown = ramp(reached - i, 0.15, 0.75)
      transformTo(node, `translate(${r1(x)} ${SPIRE_BOX.floor}) scale(${lerp(SPIRE_SEED, 1, grown).toFixed(3)})`)
      fadeTo(node, ramp(grown, 0, 0.15))
      glint = Math.max(glint, Math.sin(Math.PI * grown))
    }
    fadeTo(glow, GLOW_REST + GLOW_GLINT * glint)
  }
}

// The cards a section counts, the shared count (stageItems): the record's facts and its achievements both.
const countOf = (slot: SectionSlot, labels: Labels, highlights: readonly string[]): number => {
  const { lead, count } = stageItems(slot, labels, highlights.length)
  return lead + count
}

/** The page's scenes in order: the hero, the profession's sections, the contact. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: readonly string[]): RealmScene[] {
  const firstFrost = slots.find((slot) => REALM_OF[slot.id] === 'frost')?.id ?? 'contact'
  const sceneOf = (id: SceneId, slot: SectionSlot | null, realm: Realm, count: number): RealmScene => {
    const xs = realm === 'frost' ? spread(count, ...SPIRE_ROW) : []
    const bind = (stage: HTMLElement) => (realm === 'chaos' ? chaosWriter(stage, count) : frostWriter(stage, xs))
    return { id, slot, realm, count, xs, figure: id === firstFrost, bind }
  }
  return [
    sceneOf('hero', null, 'chaos', 0),
    ...slots.map((slot) => sceneOf(slot.id, slot, REALM_OF[slot.id], countOf(slot, labels, highlights))),
    sceneOf('contact', null, 'frost', 0),
  ]
}

/** One ice spire, its foot at the origin: the tall crystal, its lit face and a shard leaning out beside it. */
function Spire({ i }: { i: number }) {
  return (
    <g data-fx={`spire-${i}`} opacity="0">
      <polygon points="0,-150 20,-52 14,0 -14,0 -20,-52" fill={REALM.frostIceMid} opacity="0.9" />
      <polygon points="0,-142 11,-58 9,-6" fill={REALM.frostIceBright} opacity="0.5" />
      <polygon points="-16,-70 -10,-28 -12,0 -26,0 -30,-28" fill={REALM.frostIceDark} opacity="0.8" transform="rotate(-14)" />
    </g>
  )
}

/** A chaos stage's figure: the golem's rise in his own box, his feet on the battlefield. */
function ChaosFigure({ scene }: { scene: RealmScene }) {
  return (
    <div className={look.golem}>
      <svg className="block h-full w-full" viewBox="0 0 160 200" overflow="visible" aria-hidden="true" focusable="false">
        <GolemRise id={`golem-${scene.id}`} />
      </svg>
    </div>
  )
}

/** A frost stage's figure: the section's spires beside the frost king (drawn with his land). */
function FrostFigure({ scene }: { scene: RealmScene }) {
  return (
    <div className={look.spires}>
      <svg className="block h-full w-full" viewBox={`0 0 ${SPIRE_BOX.width} ${SPIRE_BOX.height}`} overflow="visible" aria-hidden="true" focusable="false">
        {scene.xs.map((_, i) => (
          <Spire key={i} i={i} />
        ))}
      </svg>
    </div>
  )
}

/** A scene's picture: its realm's land under the vignette, then the realm's figure. */
export function RealmStage({ scene, settled = false }: { scene: RealmScene; settled?: boolean }) {
  const chaos = scene.realm === 'chaos'
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
              {chaos ? <ChaosLand /> : <FrostLand figure={scene.figure} />}
              <div className={look.vignette} />
            </>
          ),
        },
        { name: 'figure', node: chaos ? <ChaosFigure scene={scene} /> : <FrostFigure scene={scene} /> },
      ]}
    />
  )
}
