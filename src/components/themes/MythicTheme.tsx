'use client'

import { useCallback, useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { fillLabel } from '@/lib/cv/labels'
import { MYTH_VARS } from './Mythic/palette'
import { Depths } from './Mythic/depths'
import { PoolRise } from './Mythic/poolRise'
import { Mirror } from './Mythic/mirror'
import { SECTION_VIEWS } from './Mythic/regions'
import { LastGate } from './Mythic/gate'
import { WorldMotionProvider, type Zone } from './Mythic/stage'
import u from './Mythic/underworld.module.css'

// Mythic, the underworld escape painted in ink over colour: the page goes down from the great hall to
// the surface. He rises out of the blood pool in the hall, the mirror changes his talent, his work is the
// chambers he clears in the teal brick vaults and the codex there, his projects the boons over the magma
// with his ventures as keepsakes, his bands and his Muay Thai in the green fields, and the last gate of
// the red temple opens on the dawn. The fixed depths fade to the region in view (data-zone); Return to
// the house at the gate scrolls back up and he rises again. Every part is drawn in ./Mythic.
//
// The root clips sideways overflow with overflow-x: clip, not hidden, so it stays out of the scroll
// container chain.

export default function MythicTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [zone, setZone] = useState<Zone>('hall')
  const [rebirths, setRebirths] = useState(0)
  const pointerRef = usePointerVars(mounted && !reduced)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onZone = useCallback((next: Zone) => setZone(next), [])

  const returnToHouse = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    setRebirths((count) => count + 1)
  }, [reduced])

  if (!mounted) return null

  return (
    <div ref={pointerRef} style={MYTH_VARS} data-zone={zone} className={`relative min-h-screen overflow-x-clip ${u.root}`}>
      <SkipLink href="#main-content" />
      <Depths />
      <WorldMotionProvider value={{ reduced, onZone, rebirths, returnToHouse }}>
        <PoolRise profession={active} reduced={reduced} />
        <Mirror profession={active} />

        <main id="main-content" tabIndex={-1} className="relative z-20 px-4 py-8 outline-none sm:px-6">
          <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <LastGate profession={active} />
      </WorldMotionProvider>

      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <p className="inline-block bg-[var(--myth-ink)] px-3 py-1 text-base text-[var(--myth-bone)]">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
