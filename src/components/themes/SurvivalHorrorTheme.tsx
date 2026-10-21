'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SH_VARS } from './SurvivalHorror/palette'
import { HouseBackdrop } from './SurvivalHorror/backdrop'
import { DoorProvider } from './SurvivalHorror/door'
import { HallHero } from './SurvivalHorror/hall'
import { ItemBox } from './SurvivalHorror/itemBox'
import { SECTION_VIEWS } from './SurvivalHorror/views'
import { SafeRoom } from './SurvivalHorror/saferoom'
import look from './SurvivalHorror/world.module.css'

// Survival Horror: an old house at night, played the way the fixed camera survival horror games are played.
// The page opens on the door loading screen (./SurvivalHorror/door) into the main hall, where he walks in
// and takes aim at the visitor's pointer (hall). The item box beside the inventory changes profession, every
// change going through the door into that profession's room (itemBox, rooms). Each profession's sections
// are one of the genre's screens (views): the map and its files, the attache case, the trader, the suit key
// doors, the herb recovery. Contact is the last corridor, the stalker in it, and the safe room past it
// (saferoom).
//
// The root carries the palette as --sh-* variables and the pointer as --mx and --my (usePointerVars), the
// only inline styles, variables only; the door sits inside it so its overlay reads them. It clips sideways
// overflow with overflow-x: clip, not hidden, so the root never becomes a scroll container.

export default function SurvivalHorrorTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const rootRef = usePointerVars(mounted && !reducedMotion)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip ${look.root}`} style={SH_VARS}>
      <DoorProvider>
        <HouseBackdrop />

        <div className="relative z-10">
          <header>
            <HallHero profession={active} />
          </header>

          <div className="py-10">
            <ItemBox />
          </div>

          <main className="px-4 pb-8 sm:px-6">
            <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
              <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
            </div>
          </main>

          <SafeRoom profession={active} />

          <footer className="py-10 text-center">
            <p className={`text-sm text-[color:var(--sh-fog)] ${look.typed}`}>
              © {new Date().getFullYear()} <NameWords name={view.hero.name} />
            </p>
          </footer>
        </div>
      </DoorProvider>
    </div>
  )
}
