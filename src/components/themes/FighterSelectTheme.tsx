'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { FS_VARS } from './FighterSelect/palette'
import { ArcadePanel } from './FighterSelect/frames'
import { HeroSplash } from './FighterSelect/versus'
import { SelectScreen } from './FighterSelect/selector'
import { ChallengerScene } from './FighterSelect/challenger'
import { ControlPanel } from './FighterSelect/footer'
import { SECTION_VIEWS } from './FighterSelect/sections'
import look from './FighterSelect/world.module.css'

// Fighter Select, an arcade fighting game's select screen and its matches: the page composition. The
// hero is the versus splash (./FighterSelect/versus), the profession switch is the select grid with the
// player one cursor (./selector), the sections are the match (rounds, hits and combos, the result
// screen, ./sections), and contact is a challenger stepping in (./challenger). Palette, cabinet frames,
// cards, his costume and the stages live in ./FighterSelect too.
//
// The root carries the palette as --fs-* variables (the one inline style, variables only) and clips
// sideways overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container
// and stop the sticky combo counter from sticking to the viewport.

export default function FighterSelectTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const labels = useLabels()

  return (
    <div className={`relative min-h-screen overflow-x-clip ${look.root}`} style={FS_VARS}>
      <div className={`pointer-events-none fixed inset-0 z-0 ${look.glow}`} aria-hidden="true" />
      <div className={`pointer-events-none fixed inset-0 z-0 ${look.scanlines}`} aria-hidden="true" />
      <div className={`pointer-events-none fixed inset-0 z-0 ${look.vignette}`} aria-hidden="true" />

      <div className="relative z-10">
        <header className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <HeroSplash profession={active} />
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6">
          <ArcadePanel accent="cyan">
            <SelectScreen active={active} title={labels.professions[active]} />
          </ArcadePanel>

          <div role="region" aria-label={`${active} profession details`}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <ChallengerScene profession={active} />

        <ControlPanel />
      </div>
    </div>
  )
}
