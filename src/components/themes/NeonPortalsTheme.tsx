'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { WarpDefs } from './NeonPortals/art'
import { CrystalExit } from './NeonPortals/contact'
import { RunInHero } from './NeonPortals/hero'
import { WarpHub } from './NeonPortals/hub'
import { WarpHud } from './NeonPortals/hud'
import { PORTAL_VARS } from './NeonPortals/palette'
import { SECTION_VIEWS } from './NeonPortals/sectionViews'
import world from './NeonPortals/world.module.css'

// Neon Portals: the page as one run through a warp world. He runs in toward the camera and the name
// lands (hero), the warp room offers a portal per profession and stepping into one warps the page
// (hub), the picked profession's sections are its levels (fruit to collect, crates to break, bonus
// warps, gems), and the crystal at the end is the contact. The score bar (WarpHud) counts what the
// visitor collects on the way. Every piece lives in ./NeonPortals.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and break the sticky and fixed layers inside it.

export default function NeonPortalsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation } = useLabels()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const rootRef = usePointerVars(mounted && !reducedMotion)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <WarpHud>
      <div ref={rootRef} style={PORTAL_VARS} className={`relative min-h-screen overflow-x-clip ${world.root}`}>
        <WarpDefs />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[color:var(--np-white)] focus:px-4 focus:py-2 focus:text-[color:var(--np-void)]"
        >
          {navigation.skipToContent}
        </a>

        <div className={`pointer-events-none fixed inset-0 ${world.night}`} aria-hidden="true" />

        <header className="relative z-20">
          <RunInHero profession={active} />
        </header>

        <section className="relative z-20 px-4 sm:px-6" aria-label={navigation.professionSelection}>
          <WarpHub profession={active} />
        </section>

        <main id="main-content" className="relative z-20 px-4 pt-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <CrystalExit profession={active} />

        <footer className="relative z-20 py-8 text-center">
          <p className="text-sm tracking-[0.2em] text-[color:var(--np-muted)]">
            &copy; {new Date().getFullYear()} {view.hero.name}
          </p>
        </footer>
      </div>
    </WarpHud>
  )
}
