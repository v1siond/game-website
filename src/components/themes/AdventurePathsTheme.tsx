'use client'

import { useCallback, useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ZoneStageProvider } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
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

export default function AdventurePathsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { fullName } = useCVData()
  const { navigation, professions } = useLabels()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const pointerRef = usePointerVars(mounted && !reducedMotion)
  const [zone, setZone] = useState<Zone>('plains')
  const onZone = useCallback((next: Zone) => setZone(next), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      ref={pointerRef}
      className={`relative min-h-screen overflow-x-clip bg-[color:var(--ap-sky-high)] font-['Segoe_UI',system-ui,sans-serif] text-[color:var(--ap-parchment)] ${map.root}`}
      style={TRAIL_VARS}
    >
      <LivingWorld zone={zone} />
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

      <ZoneStageProvider value={{ reduced: reducedMotion, onZone }}>
        <main id="trail-main" className="relative z-10 pb-16">
          <div role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
          <GoalPole profession={active} />
        </main>
      </ZoneStageProvider>

      <footer className="relative z-10 pb-14 pt-4 text-center">
        <RecruiterHero
          render={({ name }) => (
            <p className="inline-block rounded-md bg-[color:var(--ap-hud)] px-3 py-1 text-sm text-white">
              © {new Date().getFullYear()} <NameWords name={name} />
            </p>
          )}
        />
      </footer>
    </div>
  )
}
