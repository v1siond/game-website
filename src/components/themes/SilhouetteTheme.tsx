'use client'

import { useMemo } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { ClearingContact, TopBar } from './Silhouette/chrome'
import { WakeHero } from './Silhouette/hero'
import { SHADE_VARS, TYPEWRITER } from './Silhouette/palette'
import { LAYER_MOTION, scenesOf, type ShadeScene } from './Silhouette/scenes'
import { PlaceSection } from './Silhouette/sections'
import page from './Silhouette/page.module.css'

// Silhouette: his CV as one walk through a black forest in the fog, black shapes against a lit sky, the
// way a monochrome puzzle platformer is drawn. The page keeps the rhythm of the Rockstar VI site: a big
// hero (the forest's edge at dawn, him on his mound, his name as a silent film intertitle, the levers that
// change his profession), then every section of the shown profession is one full screen place of the walk
// that rises from dark, holds while its cards scroll over it, and goes dark while the next one rises: the
// spider's thicket, the ropes over the chasm, the flooded hold, the trap line, the sawmill, the edge of
// the machine city, the live floor, the forest ring, and the clearing with its lamp at the end. He is the
// small black figure in each place and does one thing per card of the section: lights a lantern, hangs off
// a rope, pushes a crate. Every motion is a function of the scroll position (the shared theatre on
// useScrollStage), drawn with the settle: stop and it comes to rest, scroll up and it plays back. The text
// is plain HTML in the page flow over the fixed theatre of pictures, opaque from its first frame.
//
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

const hasSlot = (scene: ShadeScene): scene is ShadeScene & { slot: SectionSlot } => scene.slot !== null

export default function SilhouetteTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active),
    [view, cv, labels, active],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced)
  const hero = scenes[0]
  const contact = scenes[scenes.length - 1]

  return (
    <div style={SHADE_VARS} className={`${page.root} ${reduced ? page.still : ''} ${TYPEWRITER}`}>
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} />
          ))}
        </Theatre>
      )}
      <TopBar anchor={hero.anchor} />
      <main id="main-content" ref={textRef} className={page.main}>
        <WakeHero scene={hero} still={reduced} />
        <ProfessionRegion>
          {scenes.filter(hasSlot).map((scene) => (
            <PlaceSection key={scene.id} scene={scene} still={reduced} />
          ))}
        </ProfessionRegion>
        <ClearingContact scene={contact} still={reduced} />
      </main>
      <footer className={page.footer}>
        <p className={page.copyright}>
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
