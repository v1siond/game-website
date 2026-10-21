'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ZoneStageProvider } from '@/hooks/useZoneStage'
import { usePreview } from '@/themes/PreviewContext'
import { SH_VARS } from './SurvivalHorror/palette'
import { DoorProvider } from './SurvivalHorror/door'
import { HallHero } from './SurvivalHorror/hall'
import { ItemBox } from './SurvivalHorror/itemBox'
import { SECTION_VIEWS } from './SurvivalHorror/views'
import { SafeRoom } from './SurvivalHorror/saferoom'
import { RoomWindow, Stage, StageProvider } from './SurvivalHorror/stage'
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
  const { navigation, professions } = useLabels()
  const reduced = useReducedMotion()
  const preview = usePreview()
  const [mounted, setMounted] = useState(false)
  const [zone, setZone] = useState<Zone>('hall')
  const [herbs, takeHerbs] = useState(0)
  const [saves, setSaves] = useState(0)
  const rootRef = usePointerVars(mounted && !reduced)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onZone = useCallback((next: Zone) => setZone(next), [])
  const save = useCallback(() => setSaves((count) => count + 1), [])
  const zones = useMemo(() => ({ reduced, onZone }), [reduced, onZone])
  const state = useMemo(() => ({ herbs, takeHerbs, saves, save }), [herbs, saves, save])

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip ${look.root}`} style={SH_VARS}>
      <DoorProvider>
        <ZoneStageProvider value={zones}>
          <StageProvider value={state}>
            <Stage zone={preview ? 'hall' : zone} profession={active} reduced={reduced} still={preview} />

            <div className="relative z-10">
              <RoomWindow zone="hall">
                <header>
                  <HallHero profession={active} />
                </header>
              </RoomWindow>

              <RoomWindow zone="store">
                <ItemBox />
              </RoomWindow>

              <main className="px-4 sm:px-6">
                <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
                  <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
                </div>
              </main>

              <RoomWindow zone="contact">
                <SafeRoom />
              </RoomWindow>

              <footer className="py-10 text-center">
                <p className={`inline-block bg-[color:var(--sh-void)] px-3 py-1 text-sm text-[color:var(--sh-fog)] ${look.typed}`}>
                  © {new Date().getFullYear()} <NameWords name={view.hero.name} />
                </p>
              </footer>
            </div>
          </StageProvider>
        </ZoneStageProvider>
      </DoorProvider>
    </div>
  )
}
