'use client'

import { useCallback, useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { ZoneStageProvider } from '@/hooks/useZoneStage'
import { paletteVars } from './shared/paletteVars'
import { fillLabel } from '@/lib/cv/labels'
import { CEL } from './CellShaded/palette'
import { HatchDefs } from './CellShaded/ink'
import { Wasteland, type Zone } from './CellShaded/wasteland'
import { FreezeIntro } from './CellShaded/freezeIntro'
import { QuickChange } from './CellShaded/quickChange'
import { SECTION_VIEWS } from './CellShaded/sections'
import { RespawnStation } from './CellShaded/respawn'
import cel from './CellShaded/cel.module.css'

// Cell Shaded, the inked wasteland looter shooter: the page is one day in the desert. He arrives in a
// freeze frame intro card at noon, the quick change station switches his outfit, the town's bounty
// board and skill tree hold his work and his tools in the afternoon, his projects drop as loot at dusk
// and the respawn station rebuilds him at night by the contact panel. The fixed sky follows the
// section in view (data-zone). Every part is drawn in ./CellShaded.
//
// The root clips sideways overflow with overflow-x: clip, not hidden, so it stays out of the scroll
// container chain.

const ROOT_VARS = paletteVars('cel', CEL)

export default function CellShadedTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [zone, setZone] = useState<Zone>('noon')
  const pointerRef = usePointerVars(mounted && !reduced)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onZone = useCallback((next: Zone) => setZone(next), [])

  if (!mounted) return null

  return (
    <div ref={pointerRef} style={ROOT_VARS} data-zone={zone} className={`relative min-h-screen overflow-x-clip ${cel.root}`}>
      <HatchDefs />
      <Wasteland />
      <ZoneStageProvider value={{ reduced, onZone }}>
        <FreezeIntro profession={active} reduced={reduced} />
        <QuickChange profession={active} />

        <main className="relative z-20 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <RespawnStation profession={active} />
      </ZoneStageProvider>

      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <p className="inline-block bg-[var(--cel-ink)] px-3 py-1 text-base font-bold text-[var(--cel-paper)]">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
