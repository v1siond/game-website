'use client'

import { useMemo } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { HeroSection } from './SurvivalHorror/hall'
import { Letter } from './SurvivalHorror/letter'
import { SH_VARS } from './SurvivalHorror/palette'
import { scenesOf, type Scene } from './SurvivalHorror/scenes'
import { LAYER_MOTION, SurvivorStage, theatreScene } from './SurvivalHorror/stage'
import { SceneSection } from './SurvivalHorror/views'
import look from './SurvivalHorror/world.module.css'

// Below lg the text takes the whole width, so the stage frames the middle of each room and the dark above it.
const PHONE_QUERY = '(max-width: 1023.98px)'

// Survival Horror: an old house at night seen the way the genre shows it, one fixed camera per room. The
// hero is his file card and the inventory that changes profession over the main hall (./SurvivalHorror/hall).
// Then every section of the active profession is one room of the house (./SurvivalHorror/rooms) that
// dissolves in over the one before and holds while its paper panel scrolls over it. In each room he plays a
// short scene of one to three different actions once the section arrives (./SurvivalHorror/scenes): he reads
// a note on the study wall by his flashlight, pulls a file from a cabinet, shoves a crate and climbs it, sets
// a lock's dials, fires one shot as the pursuer appears behind him, runs from it, lights the gallery's lamps,
// blocks and kicks. Contact is a letter by the door of the lit room (./SurvivalHorror/letter), which he runs
// through and shuts the pursuer out of. The scenes play on time and hold their end frame, on the shared
// theatre (./shared/theatre, src/lib/scroll/player.ts); the rooms' push in and the text follow the scroll and
// its settle. Under reduced motion there is no theatre: each section carries its own picture, still, at its
// end frame.
//
// The root carries the palette as --sh-* variables and the pointer as --mx and --my (usePointerVars), the
// only inline styles, variables only. It clips sideways overflow with overflow-x: clip, not hidden, so the
// root never becomes a scroll container.

export default function SurvivalHorrorTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { professionalSummary } = useCVData()
  const labels = useLabels()
  const { facts, highlights } = useAboutBlock()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const rootRef = usePointerVars(!reduced)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), active, phone, facts.length + highlights.length, labels),
    [view.sections, professionalSummary.bio, active, phone, facts.length, highlights.length, labels],
  )
  const staged = useMemo(() => scenes.map(theatreScene), [scenes])
  const { theatreRef, textRef } = useTheatre(staged, LAYER_MOTION, reduced)
  const sections = scenes.filter((scene): scene is Scene & { slot: NonNullable<Scene['slot']> } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  return (
    <div
      ref={rootRef}
      className={`relative min-h-screen overflow-x-clip [--focus-halo:var(--sh-void)] [--focus-ring:var(--sh-flame)] [--theatre-ground:var(--sh-void)] ${look.root}`}
      style={SH_VARS}
    >
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <SurvivorStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}
      <div ref={textRef} className="relative z-20">
        <HeroSection scene={scenes[0]} still={reduced} profession={active} />
        <main id="main-content">
          <ProfessionRegion>
            {sections.map((scene) => (
              <SceneSection key={scene.id} scene={scene} slot={scene.slot} still={reduced} />
            ))}
          </ProfessionRegion>
          <Letter scene={contact} still={reduced} />
        </main>

        <footer className="py-10 text-center">
          <p className={`inline-block bg-[color:var(--sh-void)] px-3 py-1 text-sm text-[color:var(--sh-fog-text)] ${look.typed}`}>
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </div>
  )
}
