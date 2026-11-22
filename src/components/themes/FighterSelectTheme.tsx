'use client'

import { Alfa_Slab_One } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { ZoneStageProvider, useZoneStore } from '@/hooks/useZoneStage'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { FS_VARS } from './FighterSelect/palette'
import { ArcadePanel } from './FighterSelect/frames'
import { HeroSplash } from './FighterSelect/versus'
import { SelectScreen } from './FighterSelect/selector'
import { ChallengerScene } from './FighterSelect/challenger'
import { ControlPanel } from './FighterSelect/footer'
import { SECTION_VIEWS } from './FighterSelect/sections'
import { TourBackdrop, type Zone } from './FighterSelect/backdrop'
import look from './FighterSelect/world.module.css'

// The world's slab lettering for the round calls: the root carries its --fs-face variable and the
// world's css reads it.
const fsFace = Alfa_Slab_One({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--fs-face',
})

// Fighter Select, an early 90s arcade fighting game's select screen and its matches: the page composition. The
// hero is the versus splash (./FighterSelect/versus), the profession switch is the select grid with the
// player one cursor (./selector), the sections are the match (rounds, hits and combos, the result
// screen, ./sections), and contact is a challenger stepping in (./challenger). Palette, cabinet frames,
// cards, his costume and the stages live in ./FighterSelect too.
//
// Behind it all the arcade tour's stages cross fade as the visitor scrolls (./FighterSelect/backdrop):
// each section's stage moment hands its zone up through ZoneStageProvider.
//
// The page stands on the select screen's deep blue under CRT scanlines, every section a black arcade
// screen opened by its HUD strip (./FighterSelect/frames).
//
// The root carries the palette as --fs-* variables (the one inline style, variables only) and clips
// sideways overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container
// and stop the sticky combo counter from sticking to the viewport.

export default function FighterSelectTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const { zones, stage } = useZoneStore<Zone>('castle', reduced)

  return (
    <ZoneStageProvider value={stage}>
      <div className={`relative min-h-screen overflow-x-clip ${look.root} ${fsFace.variable}`} style={FS_VARS}>
        <SkipLink />
        <TourBackdrop zones={zones} />
        <div className={`pointer-events-none fixed inset-0 z-0 ${look.scanlines}`} aria-hidden="true" />

        <div className="relative z-10">
          <header className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <HeroSplash profession={active} />
          </header>

          <main id="main-content" className="mx-auto max-w-6xl px-4 sm:px-6">
            <ArcadePanel accent="cyan">
              <SelectScreen active={active} title={labels.professions[active]} />
            </ArcadePanel>

            <ProfessionRegion>
              <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
            </ProfessionRegion>
          </main>

          <ChallengerScene profession={active} />

          <ControlPanel />
        </div>
      </div>
    </ZoneStageProvider>
  )
}
