'use client'

import { useMemo } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { ClearingContact, TopBar } from './Silhouette/chrome'
import { PhoneView } from './Silhouette/forest'
import { WakeHero } from './Silhouette/hero'
import { SHADE_VARS, TYPEWRITER } from './Silhouette/palette'
import { LAYER_MOTION, scenesOf, type ShadeScene } from './Silhouette/scenes'
import { PlaceSection } from './Silhouette/sections'
import page from './Silhouette/page.module.css'

// Silhouette: his CV as one way through a black forest in the fog and on into a city of machines, black
// shapes against a lit sky, the way the monochrome puzzle platformer it comes from is drawn. A big hero (the
// forest's edge at dawn, where he wakes in the grass, his name as a silent film intertitle, the levers that
// change his profession), then every section of the shown profession is one full screen place that rises
// from dark, holds while its cards scroll over it, and goes dark while the next one rises. Each place is
// one of the game's set pieces, a different trap or machine every time: the boulder on the slope, the
// trap that cuts the rope, the flooded hold, the conveyor to the hook, the crusher, the wall gun, the
// turning gear, the gravity room and its saw, and the quiet clearing at the end. The shared scene player
// plays each place's one to three actions at their own pace as the section arrives: scroll up and it plays
// back. The text is plain HTML in the page flow over the fixed theatre of pictures, opaque from its first
// frame.
//
// Under reduced motion there is no theatre: each section carries its own picture, still, at its end frame,
// and he stands awake in the hero.

// A phone frames the forest from higher up (Silhouette/forest PhoneView).
const PHONE_QUERY = '(max-width: 767.98px)'

const hasSlot = (scene: ShadeScene): scene is ShadeScene & { slot: SectionSlot } => scene.slot !== null

export default function SilhouetteTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active),
    [view, cv, labels, active],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced)
  const hero = scenes[0]
  const contact = scenes[scenes.length - 1]

  return (
    <PhoneView.Provider value={phone}>
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
    </PhoneView.Provider>
  )
}
