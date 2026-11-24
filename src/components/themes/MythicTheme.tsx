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

// Mythic, the god of war games in their own style, painted in ink over colour: the page climbs from the
// great hall to the gods' mountain, the Greek past of those games, and he plays their Norse moves in it. The
// fixed depths behind the page fade to the region in view (data-zone): the great hall, the storm sea, the
// magma, the bronze giant's harbour and the summit at dawn. Over them, on the shared theatre
// (./shared/theatre), every part of the page has his scene (./Mythic/scenes), one to three of the games'
// moves played by the scroll at the scene's own pace and back on the way up: the shield out of the
// vambrace, the axe thrown and called back, the shield bash and the heavy blow, the chained blades and the
// swing to the ledge, the frost locking a gear, Spartan Rage, the boat to the realm door, the runic ice
// under the giant, the parry and the finisher, the realm travel light. The sections read in a column on the
// left from lg, so the scenes play clear of them on the right; under lg each scene plays in a gap under its
// title before the cards. Under reduced motion there is no theatre: each part carries its own scene, still,
// at its end frame.
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
  const { zones, stage } = useZoneStore<Zone>('hall', reduced)
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
