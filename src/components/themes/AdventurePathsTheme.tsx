'use client'

import { useMemo } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { Goal, Hud } from './AdventurePaths/chrome'
import { ExpeditionHero } from './AdventurePaths/hero'
import { TRAIL_VARS } from './AdventurePaths/palette'
import { LAYER_MOTION, scenesOf, type TrailScene } from './AdventurePaths/scenes'
import { LevelSection } from './AdventurePaths/sections'
import map from './AdventurePaths/map.module.css'
import page from './AdventurePaths/page.module.css'

// Adventure Paths: his CV as one world of a 16 bit side view platformer, played from start to finish. The
// hero is his house at the head of the path, under his name plaque and the world map he picks a profession
// on; every section of the shown profession is one place on the map in order (./AdventurePaths/scenes):
// the plains, the cave, the sky, the switch palace, the water, the fortress and the castle, and the goal at
// the end. Each level opens on the map, his marker walking from the last spot to its own, and plays its
// one to three different actions as its section scrolls in, forward on the way down and back on the way up,
// at no more than their own speed (the shared theatre). He is himself as a 16 bit sprite. The cards read in a column on the left, so the levels play
// clear of them on the right. The text is plain HTML in the page flow over the fixed theatre of pictures,
// opaque from its first frame.
//
// The whole world renders on the server: every CV string is in the HTML and the hero's picture shows its
// first frame through CSS before the engine runs. Under reduced motion there is no theatre: each section
// carries its own picture, still, at its end frame.

const PHONE_QUERY = '(max-width: 767.98px)'

const hasSlot = (scene: TrailScene): scene is TrailScene & { slot: SectionSlot } => scene.slot !== null

export default function AdventurePathsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const pointerRef = usePointerVars(!reduced)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), active, phone),
    [view, cv, active, phone],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced)
  const hero = scenes[0]
  const goal = scenes[scenes.length - 1]

  return (
    <div ref={pointerRef} style={TRAIL_VARS} className={`${page.root} ${map.root} ${reduced ? page.still : ''} [--focus-ring:var(--ap-ink)] [--focus-halo:var(--ap-parchment)]`}>
      <SkipLink className={page.skip} />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={page.scrim} />
          ))}
        </Theatre>
      )}
      <Hud anchor={hero.anchor} />
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
