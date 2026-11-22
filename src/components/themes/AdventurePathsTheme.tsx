'use client'

import { useLayoutEffect } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { prefersReducedMotion, useReducedMotion } from '@/hooks/useReducedMotion'
import { ZoneStageProvider, useZoneStore } from '@/hooks/useZoneStage'
import { INTRO_ATTR } from '@/themes/introFlag'
import { CopyrightLine } from './shared/CopyrightLine'
import { TRAIL_VARS } from './AdventurePaths/palette'
import { MapDefs } from './AdventurePaths/art'
import { ExpeditionHero } from './AdventurePaths/hero'
import { SECTION_VIEWS } from './AdventurePaths/sections'
import { GoalPole } from './AdventurePaths/flagpole'
import { LivingWorld, type Zone } from './AdventurePaths/world'
import map from './AdventurePaths/map.module.css'

// Adventure Paths: his CV as a side view platform course seen from its overworld map. The hub map he
// arrives on picks the profession (hero.tsx); each profession's sections are levels where he does his own
// thing to open them (sections.tsx); contact is the goal pole at the end of the course (flagpole.tsx).
// Behind it all the living world (world.tsx) runs: hills sliding at two depths, clouds with faces, foes
// on their beat. The section in view hands its zone up (useZoneStage) and the world changes to it:
// plains, sky, night, underground, fortress, sunset. The hub map shares the gradients in MapDefs.
//
// The root sets the palette as CSS variables (TRAIL_VARS) and the pointer as --mx and --my, the only
// inline styles, and clips sideways overflow with overflow-x: clip, not hidden, so it never becomes a
// scroll container.
//
// The whole world renders on the server, the default world's contract (docs/CV-THEME-SYSTEM.md): the
// browser only parts start in effects (the hub map's entrance timeline, his walk, the pointer tilt), and
// under reduced motion the server drawn map shows its resting frame through CSS until the client sets it.
// The entrance hides its pieces only under INTRO_ATTR on <html> (introFlag.ts), so the server HTML is the
// finished map for a visitor with no JavaScript.

// A client side navigation to the home page never runs the page's inline script, so the world marks the
// entrance itself before its first paint (a layout effect), and the entrance plays as on a full load.
function useIntroMark() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    document.documentElement.setAttribute(INTRO_ATTR, '')
  }, [])
}

export default function AdventurePathsTheme() {
  useIntroMark()
  const { active } = useProfession()
  const view = useWorldView()
  const { fullName } = useCVData()
  const { navigation } = useLabels()
  const reducedMotion = useReducedMotion()
  const pointerRef = usePointerVars(!reducedMotion)
  const { zones, stage } = useZoneStore<Zone>('plains', reducedMotion)

  return (
    <div
      ref={pointerRef}
      className={`relative min-h-screen overflow-x-clip [--focus-ring:var(--ap-ink)] [--focus-halo:var(--ap-parchment)] bg-[color:var(--ap-sky-high)] font-['Segoe_UI',system-ui,sans-serif] text-[color:var(--ap-parchment)] ${map.root}`}
      style={TRAIL_VARS}
    >
      <LivingWorld zones={zones} />
      <MapDefs />
      <a
        href="#trail-main"
        className="sr-only z-50 rounded-sm bg-[color:var(--ap-gold)] px-4 py-2 font-bold text-[color:var(--ap-ink)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        {navigation.skipToContent}
      </a>

      <header className="relative z-20">
        <ExpeditionHero name={fullName} />
      </header>

      <ZoneStageProvider value={stage}>
        <main id="trail-main" className="relative z-10 pb-16">
          <ProfessionRegion>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </ProfessionRegion>
          <GoalPole profession={active} />
        </main>
      </ZoneStageProvider>

      <footer className="relative z-10 pb-14 pt-4 text-center">
        <p className="inline-block rounded-md bg-[color:var(--ap-hud)] px-3 py-1 text-sm text-white">
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
