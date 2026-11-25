'use client'

import { useCallback, useMemo } from 'react'
import { Cinzel } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { ZoneStageProvider, useZoneAttribute, useZoneStore } from '@/hooks/useZoneStage'
import { MYTH_VARS } from './Mythic/palette'
import { Depths } from './Mythic/depths'
import { HallHero } from './Mythic/hero'
import { Altar } from './Mythic/altar'
import { SECTION_VIEWS } from './Mythic/regions'
import { LastGate } from './Mythic/gate'
import { FIELD_MOTION, MythStage, scenesOf } from './Mythic/scenes'
import { StillStages, type Zone } from './Mythic/stage'
import u from './Mythic/underworld.module.css'

// The carved inscriptional capitals, Cinzel: the root carries its --myth-display variable and the world's css
// reads it.
const mythDisplay = Cinzel({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--myth-display',
})

// Mythic, the northern war god game of 2018 retold as his own journey, painted in ink over colour: he burns
// his old mentor's body on a pyre in the snow wood and carries the ashes with a young apprentice to the
// highest peak, as the mentor asked. The fixed depths behind the page fade to the place in view (data-zone),
// in the order they walk it: the snow wood, the old road, the mirror lake, the ring of light, the iron
// mountain, the sea of the dead, the frozen shore and the stair to the peak. Over them, on the shared theatre
// (./shared/theatre), every part of the page has its scene (./Mythic/scenes), one to three actions played by
// the scroll at the scene's own pace and back on the way up: the pyre, the stranger at the door, the axe and
// the gate, the wyrm of the lake, the smith, the light, the seer, the drum of his past, the last duel and the
// ashes on the wind. The sections read in a column on the left from lg, so the scenes play clear of them on
// the right; under lg each scene plays in a gap under its title before the cards. Under reduced motion there
// is no theatre: each part carries its own scene, still, at its end frame.
//
// The root clips sideways overflow with overflow-x: clip, not hidden, so it stays out of the scroll
// container chain.

export default function MythicTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { professionalSummary } = useCVData()
  const labels = useLabels()
  const { highlights } = useAboutBlock()
  const reduced = useReducedMotion()
  const pointerRef = usePointerVars(!reduced)
  const { zones, stage } = useZoneStore<Zone>('wood', reduced)
  useZoneAttribute(zones, pointerRef)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), labels, highlights, active),
    [view.sections, professionalSummary.bio, labels, highlights, active],
  )
  const { theatreRef, textRef } = useTheatre(scenes, FIELD_MOTION, reduced)
  const still = useCallback(
    (id: string) => {
      const scene = reduced ? scenes.find((each) => each.id === id) : undefined
      return scene ? <MythStage scene={scene} settled /> : null
    },
    [reduced, scenes],
  )

  return (
    <div ref={pointerRef} style={MYTH_VARS} data-zone={zones.first()} className={`relative min-h-screen overflow-x-clip [--theatre-ground:transparent] ${u.root} ${mythDisplay.variable}`}>
      <SkipLink />
      <Depths />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <MythStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}
      <ZoneStageProvider value={stage}>
        <StillStages value={still}>
          <div ref={textRef} className="relative z-20">
            <HallHero still={still('hero')} />
            <Altar />

            <main id="main-content" tabIndex={-1} className="relative z-20 px-4 py-8 outline-none sm:px-6">
              <ProfessionRegion className="mx-auto max-w-6xl">
                <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
              </ProfessionRegion>
            </main>

            <LastGate still={still('contact')} />
          </div>
        </StillStages>
      </ZoneStageProvider>

      <footer className="relative z-20 py-8 text-center">
        <p className="inline-block bg-[var(--myth-ink)] px-3 py-1 text-base text-[var(--myth-bone)]">
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
