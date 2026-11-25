'use client'

import { useCallback, useMemo, useRef } from 'react'
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
import { SceneSides, StillStages, type Side, type Zone } from './Mythic/stage'
import u from './Mythic/underworld.module.css'

// The carved inscriptional capitals, Cinzel: the root carries its --myth-display variable and the world's css
// reads it.
const mythDisplay = Cinzel({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--myth-display',
})

// Mythic, the Greek war god games of 2005 and 2007 retold as his own run: the storm sea and the serpent's
// king head, burning Athens and the seer on her ropes, the desert Titan with the temple on his back, the rings
// of the architect's temple, the last duel with the war god, the bronze giant of the harbour, the winged horse
// and the stone steeds, the undead king's hammer in the bog, the winged man of the great chasm and the earth
// Titan's hand under him on the mountain of the gods (score/C75/story.md). The fixed depths behind the page
// fade to the place in view (data-zone), in that order. Over them, on the shared theatre (./shared/theatre),
// every part of the page has its scene (./Mythic/scenes), one to three actions played by the scroll at the
// scene's own pace and back on the way up. From lg the sections take turns: the first after the hero reads on
// the left with its scene on the right, the next the other way round, up to the contact (each scene's side
// comes from scenesOf and reaches the sections through SceneSides); under lg each scene plays in a gap under
// its title before the cards, his action in the half of the screen its side names. Under reduced motion there
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
  // the pointer drifts the painting only (Depths), so its writes restyle that box and not the page
  const pointerRef = usePointerVars(!reduced)
  const rootRef = useRef<HTMLDivElement>(null)
  const { zones, stage } = useZoneStore<Zone>('sea', reduced)
  useZoneAttribute(zones, rootRef)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), labels, highlights, active),
    [view.sections, professionalSummary.bio, labels, highlights, active],
  )
  const sides = useMemo(() => Object.fromEntries(scenes.map((scene) => [scene.id, scene.side])) as Record<string, Side>, [scenes])
  const { theatreRef, textRef } = useTheatre(scenes, FIELD_MOTION, reduced)
  const still = useCallback(
    (id: string) => {
      const scene = reduced ? scenes.find((each) => each.id === id) : undefined
      return scene ? <MythStage scene={scene} settled /> : null
    },
    [reduced, scenes],
  )

  return (
    <div ref={rootRef} style={MYTH_VARS} data-zone={zones.first()} className={`relative min-h-screen overflow-x-clip [--theatre-ground:transparent] ${u.root} ${mythDisplay.variable}`}>
      <SkipLink />
      <Depths pointerRef={pointerRef} />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <MythStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}
      <ZoneStageProvider value={stage}>
        <SceneSides value={sides}>
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
        </SceneSides>
      </ZoneStageProvider>

      <footer className="relative z-20 py-8 text-center">
        <p className="inline-block bg-[var(--myth-ink)] px-3 py-1 text-base text-[var(--myth-bone)]">
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
