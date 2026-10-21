'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import { TRAIL_VARS } from './AdventurePaths/palette'
import { MapDefs } from './AdventurePaths/art'
import { ExpeditionHero } from './AdventurePaths/hero'
import { SECTION_VIEWS } from './AdventurePaths/sections'
import { GoalGate } from './AdventurePaths/goal'
import map from './AdventurePaths/map.module.css'

// Adventure Paths: his CV as an explorer's overworld map. The hub map he arrives on picks the profession
// (hero.tsx); each profession's sections are regions of the map with their own mechanics (sections.tsx);
// contact is the goal gate at the end of the trail (goal.tsx). Every map shares the gradients in MapDefs.
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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      ref={pointerRef}
      className={`relative min-h-screen overflow-x-clip bg-[color:var(--ap-night)] font-['Segoe_UI',system-ui,sans-serif] text-[color:var(--ap-parchment)] ${map.root}`}
      style={TRAIL_VARS}
    >
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

      <main id="trail-main" className="relative z-10">
        <div role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
        <GoalGate profession={active} />
      </main>

      <footer className="relative z-10 py-10 text-center">
        <RecruiterHero
          render={({ name }) => (
            <p className="text-sm text-[color:var(--ap-edge)]">
              © {new Date().getFullYear()} {name}
            </p>
          )}
        />
      </footer>
    </div>
  )
}
