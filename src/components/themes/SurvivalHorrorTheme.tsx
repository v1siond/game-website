'use client'

import { useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { CopyrightLine } from './shared/CopyrightLine'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ZoneStageProvider, useZoneStore } from '@/hooks/useZoneStage'
import { usePreview } from '@/themes/PreviewContext'
import { SH_VARS } from './SurvivalHorror/palette'
import { DoorProvider } from './SurvivalHorror/door'
import { HallHero } from './SurvivalHorror/hall'
import { ItemBox } from './SurvivalHorror/itemBox'
import { SECTION_VIEWS } from './SurvivalHorror/views'
import { SafeRoom } from './SurvivalHorror/saferoom'
import { RoomWindow, Stage, StageProvider, createStageState } from './SurvivalHorror/stage'
import type { Zone } from './SurvivalHorror/scripts'
import look from './SurvivalHorror/world.module.css'

// Survival Horror: an old house at night, played the way the fixed camera survival horror games are played.
// The page opens on the door loading screen (./SurvivalHorror/door). Behind the whole page is the house
// (./SurvivalHorror/stage): one room per part of the page, cut to as that part scrolls into view, where he
// and the pursuer act the room out once (./SurvivalHorror/scripts) and then hold, breathing, until the
// visitor changes what the room shows. The parts themselves are the genre's screens: the hall's file card
// (hall), the item box that changes profession (itemBox), the papers and files, the attache case, the
// trader's wares, the suit doors, the herb recovery (views), and the safe room's typewriter (saferoom).
//
// The root carries the palette as --sh-* variables and the pointer as --mx and --my (usePointerVars), the
// only inline styles, variables only; the door sits inside it so its overlay reads them. It clips sideways
// overflow with overflow-x: clip, not hidden, so the root never becomes a scroll container.

export default function SurvivalHorrorTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const reduced = useReducedMotion()
  const preview = usePreview()
  const rootRef = usePointerVars(!reduced)
  const { zones, stage } = useZoneStore<Zone>('hall', reduced)
  const [state] = useState(createStageState)

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip [--focus-ring:var(--sh-flame)] [--focus-halo:var(--sh-void)] ${look.root}`} style={SH_VARS}>
      <DoorProvider>
        <ZoneStageProvider value={stage}>
          <StageProvider value={state}>
            <Stage zones={zones} profession={active} reduced={reduced} still={preview} />

            <div className="relative z-10">
              <RoomWindow zone="hall">
                <header data-worlds-hero="">
                  <HallHero profession={active} />
                </header>
              </RoomWindow>

              <RoomWindow zone="store">
                <ItemBox />
              </RoomWindow>

              <main className="px-4 sm:px-6">
                <ProfessionRegion className="mx-auto max-w-6xl">
                  <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
                </ProfessionRegion>
              </main>

              <RoomWindow zone="contact">
                <SafeRoom />
              </RoomWindow>

              <footer className="py-10 text-center">
                <p className={`inline-block bg-[color:var(--sh-void)] px-3 py-1 text-sm text-[color:var(--sh-fog-text)] ${look.typed}`}>
                  <CopyrightLine />
                </p>
              </footer>
            </div>
          </StageProvider>
        </ZoneStageProvider>
      </DoorProvider>
    </div>
  )
}
