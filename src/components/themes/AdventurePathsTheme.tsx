'use client'

import { useCallback, useMemo, useRef } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { Goal, Hud } from './AdventurePaths/chrome'
import { ExpeditionHero } from './AdventurePaths/hero'
import { MapDefs } from './AdventurePaths/art'
import { TRAIL_VARS } from './AdventurePaths/palette'
import { LAYER_MOTION, scenesOf, type TrailScene } from './AdventurePaths/scenes'
import { LevelSection } from './AdventurePaths/sections'
import map from './AdventurePaths/map.module.css'
import page from './AdventurePaths/page.module.css'

// Adventure Paths: his CV as a side view platform course seen from its overworld map. The page keeps the
// rhythm of the Rockstar VI site: a big hero (his name plaque and the overworld map he picks a profession
// on, over the plains), then every section of the shown profession is one full screen level that rises
// from dark, holds while its cards scroll over it, and sinks into dark while the next level rises: the ?
// blocks, the sky ledges, the shell run, the mushroom path, the switch palace, the coin room, the note
// blocks, the fortress, and the goal pole at the end. He is the plumber styled hero in each level and does
// one thing per card of the section: hits a block, lands on a ledge, stomps a foe. Every motion is a
// function of the scroll position (the shared theatre on useScrollStage), drawn with the settle: stop and
// it comes to rest, scroll up and it plays back. The text is plain HTML in the page flow over the fixed
// theatre of pictures, opaque from its first frame; the HUD bar names the level and counts his deeds.
//
// The whole world renders on the server: every CV string is in the HTML and the hero's picture shows its
// first frame through CSS before the engine runs. Under reduced motion there is no theatre and no scrub:
// each section carries its own picture, still, at its settled frame.

const hasSlot = (scene: TrailScene): scene is TrailScene & { slot: SectionSlot } => scene.slot !== null

export default function AdventurePathsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const pointerRef = usePointerVars(!reduced)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active),
    [view, cv, labels, active],
  )
  const placeRef = useRef<HTMLSpanElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  // The HUD follows the level the page is in: its place and, where it counts, how many of its cards are read.
  const lead = useCallback(
    (id: string, reached: number) => {
      const scene = scenes.find((each) => each.id === id)
      if (!scene) return
      if (placeRef.current) placeRef.current.textContent = labels.trail[scene.place]
      if (countRef.current) countRef.current.textContent = scene.tally ? fillLabel(labels.trail[scene.tally], { count: reached, total: scene.count }) : ''
    },
    [scenes, labels],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced, lead)
  const hero = scenes[0]
  const goal = scenes[scenes.length - 1]

  return (
    <div ref={pointerRef} style={TRAIL_VARS} className={`${page.root} ${map.root} ${reduced ? page.still : ''} [--focus-ring:var(--ap-ink)] [--focus-halo:var(--ap-parchment)]`}>
      <MapDefs />
      <SkipLink className={page.skip} />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={page.scrim} />
          ))}
        </Theatre>
      )}
      <Hud placeRef={placeRef} countRef={countRef} anchor={hero.anchor} />
      <main id="main-content" ref={textRef} className={page.main}>
        <ExpeditionHero scene={hero} name={cv.fullName} still={reduced} />
        <ProfessionRegion>
          {scenes.filter(hasSlot).map((scene) => (
            <LevelSection key={scene.id} scene={scene} still={reduced} />
          ))}
        </ProfessionRegion>
        <Goal scene={goal} still={reduced} />
      </main>
      <footer className={page.footer}>
        <p className={page.copyright}>
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
