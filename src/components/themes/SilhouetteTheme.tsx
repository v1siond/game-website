'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SHADE_VARS, TYPEWRITER } from './Silhouette/palette'
import { Atmosphere } from './Silhouette/backdrop'
import { CutProvider } from './Silhouette/cut'
import { WakeHero } from './Silhouette/wake'
import { LeverSwitch } from './Silhouette/levers'
import { SECTION_VIEWS } from './Silhouette/views'
import { Clearing } from './Silhouette/clearing'
import world from './Silhouette/world.module.css'

// Silhouette: a black forest in the fog, played the way a monochrome puzzle platformer is played. He
// wakes at the forest's edge (./Silhouette/wake), pulls a lever to change profession and respawns in
// its place (levers), and each profession's sections are its own mechanic (views): jobs hanging on
// ropes, projects under a spider's webbing, bands and ventures as rooftop signs, the Muay Thai record
// in a gravity room. Contact is a clearing with a trap to spring. Every change of scene is the genre's
// death cut to black (cut).
//
// The root carries the palette as --sh-* variables and the pointer as --mx and --my (usePointerVars),
// the only inline styles, variables only. It clips sideways overflow with overflow-x: clip, not hidden:
// hidden would make the root a scroll container and stop the projects' lantern from sticking.

export default function SilhouetteTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const rootRef = usePointerVars(mounted && !reducedMotion)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CutProvider>
      <div ref={rootRef} className={`relative min-h-screen overflow-x-clip ${TYPEWRITER} ${world.world}`} style={SHADE_VARS}>
        <Atmosphere />

        <header className="relative z-30">
          <WakeHero profession={active} />
        </header>

        <div className="relative z-20 pt-12">
          <LeverSwitch />
        </div>

        <main className="relative z-20">
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </main>

        <Clearing profession={active} />

        <footer className="relative z-20 py-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3" aria-hidden="true">
            <div className="h-px w-6 bg-[color:var(--sh-edge)]" />
            <p className="text-sm tracking-[0.5em] text-[color:var(--sh-dim)]">. . .</p>
            <div className="h-px w-6 bg-[color:var(--sh-edge)]" />
          </div>
          <p className="text-sm text-[color:var(--sh-dim)]">
            © {new Date().getFullYear()} <NameWords name={view.hero.name} />
          </p>
        </footer>
      </div>
    </CutProvider>
  )
}
