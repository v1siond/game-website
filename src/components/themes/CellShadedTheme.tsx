'use client'

import { useMemo } from 'react'
import { Bangers } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { paletteVars } from './shared/paletteVars'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { StationContact, TopBar } from './CellShaded/chrome'
import { IntroHero } from './CellShaded/hero'
import { HatchDefs } from './CellShaded/ink'
import { CEL } from './CellShaded/palette'
import { LAYER_MOTION, scenesOf, type CelScene } from './CellShaded/scenes'
import { PlaceSection } from './CellShaded/sections'
import page from './CellShaded/page.module.css'

// The world's own lettering: the root carries its --cel-face variable and the world's css reads it.
const celFace = Bangers({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--cel-face' })

const ROOT_VARS = paletteVars('cel', CEL)

// A phone frames the desert from higher up, so the sand stays clear of the cards (desert.tsx).
const PHONE_QUERY = '(max-width: 767.98px)'

// Cell Shaded: his CV as one run through an inked desert, drawn like a comic in flat saturated fills under one
// black ink line, the way its looter shooter tells its story. The page keeps the rhythm of the Rockstar VI
// site: a big hero (the intro card, his name in sun letters, the outfit lockers where he picks a profession),
// then every section of the shown profession is one full screen stop of the run that rises from dark, holds
// while its cards scroll over it, and goes dark while the next one rises. He steps off the bus at noon and our
// small robot guide leads him to the town gate as the raider cars tear past and a voice crackles at his ear;
// he blows the gully open and guns down the first boss's beasts; one long shot drops a raider for the part a
// station needs to build his car; he takes a second wind under the mine boss and lifts a strange relic; the
// relic shows a door, a count and a key's three slots; two pieces click in and far off the great door opens
// for someone else; at night the voice's satellite crosses the sky and the map lights with new doors. He is
// side on, facing right, in every action. Every motion is a function of the scroll position
// (the shared theatre on useScrollStage), drawn with the settle: stop and it comes to rest, scroll up and
// it plays back. The text is plain HTML in the page flow over the fixed theatre of pictures, opaque from
// its first frame.
//
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

const hasSlot = (scene: CelScene): scene is CelScene & { slot: SectionSlot } => scene.slot !== null

export default function CellShadedTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active, phone),
    [view, cv, labels, active, phone],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced)
  const hero = scenes[0]
  const contact = scenes[scenes.length - 1]

  return (
    <div style={ROOT_VARS} className={`${page.root} ${reduced ? page.still : ''} ${celFace.variable}`}>
      <SkipLink />
      <HatchDefs />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={page.scrim} />
          ))}
        </Theatre>
      )}
      <TopBar anchor={hero.anchor} />
      <main id="main-content" ref={textRef} className={page.main}>
        <IntroHero scene={hero} still={reduced} />
        <ProfessionRegion>
          {scenes.filter(hasSlot).map((scene) => (
            <PlaceSection key={scene.id} scene={scene} still={reduced} />
          ))}
        </ProfessionRegion>
        <StationContact scene={contact} still={reduced} />
      </main>
      <footer className={page.footer}>
        <p className={page.copyright}>
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
