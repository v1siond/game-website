'use client'

import { useCallback, useEffect, useState } from 'react'
import { Luckiest_Guy } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { ZoneStageProvider } from '@/hooks/useZoneStage'
import { Arrival } from './NeonPortals/arrival'
import { BandicootDefs } from './NeonPortals/bandicoot'
import { EraArea, EraBackdrop, type Zone } from './NeonPortals/eraBackdrop'
import { LevelEnd } from './NeonPortals/levelEnd'
import { PORTAL_VARS } from './NeonPortals/palette'
import { PickupDefs } from './NeonPortals/pickups'
import { ScoreBar } from './NeonPortals/scoreBar'
import { WarpScore } from './NeonPortals/score'
import { SECTION_VIEWS } from './NeonPortals/views'
import { WarpRoom } from './NeonPortals/warpRoom'
import ui from './NeonPortals/warped.module.css'

// The world's own lettering: fat rounded cartoon capitals like the game's logo, level names and score
// digits. The root carries its --np-face variable and warped.module.css reads it.
const warpFace = Luckiest_Guy({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--np-face' })

// Neon Portals: the page as one trip through the time machine of the 1998 time travel platformer
// (Warped, named in code only), with him as its orange hero. The page travels through the game's eras
// as it scrolls: the fixed backdrop (eraBackdrop) paints the era of the part in view and warps to the
// next one, the way the game sends you from the hub through each period. He beams in at the hub and
// spins open the crates beside him (arrival), the warp room's three level buttons change the profession
// with a slam and the warp tunnel (warpRoom), each of the picked profession's sections is a level in its
// own era with his own moment there (views, eraScenes: the bridge slide, the tomb run, the scuba swim,
// the T rex ride, the motorbike, the jet ski, the boss), and the contact back at the hub is the level
// end that tallies the visit. WarpScore keeps the score that the score bar and the floating mask show.
// Every piece lives in ./NeonPortals.
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
  const [zone, setZone] = useState<Zone>('hub')
  const onZone = useCallback((next: Zone) => setZone(next), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <WarpScore>
      <div ref={rootRef} style={PORTAL_VARS} data-zone={zone} className={`relative min-h-screen overflow-x-clip ${ui.root} ${warpFace.variable}`}>
        <PickupDefs />
        <BandicootDefs />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[color:var(--np-white)] focus:px-4 focus:py-2 focus:text-[color:var(--np-void)]"
        >
          {navigation.skipToContent}
        </a>

        <EraBackdrop zone={zone} reduced={reducedMotion} />
        <ScoreBar />

        <ZoneStageProvider value={{ reduced: reducedMotion, onZone }}>
          <header className="relative z-20">
            <EraArea zone="hub">
              <Arrival profession={active} />
            </EraArea>
          </header>

          <section className="relative z-20 mt-16 px-4 sm:px-6" aria-label={navigation.professionSelection}>
            <EraArea zone="room">
              <WarpRoom profession={active} />
            </EraArea>
          </section>

          <main id="main-content" className="relative z-20 px-4 pt-16 sm:px-6">
            <div className="mx-auto max-w-5xl">
              <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
            </div>
          </main>

          <EraArea zone="hub">
            <LevelEnd profession={active} />
          </EraArea>
        </ZoneStageProvider>

        <footer className="relative z-20 py-8 text-center">
          <p className={`inline-block text-sm tracking-[0.2em] text-[color:var(--np-white)] ${ui.plate}`}>
            &copy; {new Date().getFullYear()} <NameWords name={view.hero.name} />
          </p>
        </footer>
      </div>
    </WarpScore>
  )
}
