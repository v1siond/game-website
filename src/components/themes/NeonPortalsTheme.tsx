'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { Arrival } from './NeonPortals/arrival'
import { BandicootDefs } from './NeonPortals/bandicoot'
import { LevelEnd } from './NeonPortals/levelEnd'
import { PORTAL_VARS } from './NeonPortals/palette'
import { PickupDefs } from './NeonPortals/pickups'
import { ScoreBar } from './NeonPortals/scoreBar'
import { WarpScore } from './NeonPortals/score'
import { SECTION_VIEWS } from './NeonPortals/views'
import { WarpRoom } from './NeonPortals/warpRoom'
import ui from './NeonPortals/warped.module.css'

// Neon Portals: the page as one visit to the time machine of the 1998 time travel platformer (Warped,
// named in code only), with him as its orange hero. He beams in on the warp pad and spins open the
// crates beside him (arrival), the warp room's three level buttons change the profession with a slam
// and the warp tunnel (warpRoom), the picked profession's sections are levels played the game's way
// (views: crystals, crates, time trials, a boss), and the contact is the level end that tallies the
// visit. WarpScore keeps the score that the score bar and the floating mask show. Every piece lives in
// ./NeonPortals.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and break the fixed layers inside it.

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
    <WarpScore>
      <div ref={rootRef} style={PORTAL_VARS} className={`relative min-h-screen overflow-x-clip ${ui.root}`}>
        <PickupDefs />
        <BandicootDefs />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[color:var(--np-white)] focus:px-4 focus:py-2 focus:text-[color:var(--np-void)]"
        >
          {navigation.skipToContent}
        </a>

        <div className={`pointer-events-none fixed inset-0 ${ui.night}`} aria-hidden="true" />
        <ScoreBar />

        <header className="relative z-20">
          <Arrival profession={active} />
        </header>

        <section className="relative z-20 mt-16 px-4 sm:px-6" aria-label={navigation.professionSelection}>
          <WarpRoom profession={active} />
        </section>

        <main id="main-content" className="relative z-20 px-4 pt-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <LevelEnd profession={active} />

        <footer className="relative z-20 py-8 text-center">
          <p className="text-sm tracking-[0.2em] text-[color:var(--np-muted)]">
            &copy; {new Date().getFullYear()} {view.hero.name}
          </p>
        </footer>
      </div>
    </WarpScore>
  )
}
