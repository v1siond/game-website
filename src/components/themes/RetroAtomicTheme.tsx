'use client'

import { useCallback, useState } from 'react'
import { Share_Tech_Mono } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { CopyrightLine } from './shared/CopyrightLine'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { ZoneStageProvider, useZoneStore } from '@/hooks/useZoneStage'
import { JourneyBackdrop, Wanderer, type Zone } from './RetroAtomic/journey'
import { VaultEntrance } from './RetroAtomic/vaultDoor'
import { WristComputer } from './RetroAtomic/wristComputer'
import { SECTION_VIEWS } from './RetroAtomic/sections'
import { ContactTerminal } from './RetroAtomic/terminal'
import atomic from './RetroAtomic/atomic.module.css'

// The world's own lettering: the root carries its --atomic-face variable and the world's css reads it.
const atomicFace = Share_Tech_Mono({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--atomic-face' })

// Retro Atomic, a fallout shelter of the atomic age seen through his wrist terminal: the page
// composition. The visit opens on the shelter's cog door rolling aside (./RetroAtomic/vaultDoor); behind
// it the wrist terminal boots and types his name, its screen tabs and selector dial switch the
// profession (./RetroAtomic/wristComputer); the picked profession's sections follow on the terminal's
// glass, the radio and the printed perk chart (./RetroAtomic/sections); contact steps outside into the
// wasteland, to a public terminal with its password game (./RetroAtomic/terminal). Each section hands
// its zone (shelter, wasteland, town) up through the shared ZoneStageProvider; the backdrop crossfades to
// it and he walks there with the dog along the foot of the screen (./RetroAtomic/journey).
//
// The root carries the pointer as --mx and --my (-1 to 1) for the shelter's and the wasteland's
// parallax. It clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container. Under reduced motion the door is skipped and the terminal is on from the start.
//
// The whole world renders on the server, the default world's contract (docs/CV-THEME-SYSTEM.md): the
// browser only parts start in effects (the door's timeline, the pointer parallax, the password game's
// random seed), and the sealed door the server draws is hidden by CSS under reduced motion until the
// client drops it.

export default function RetroAtomicTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reducedMotion = useReducedMotion()
  const [booted, setBooted] = useState(false)
  const rootRef = usePointerVars(!reducedMotion)
  const onOpened = useCallback(() => setBooted(true), [])
  const { zones, stage } = useZoneStore<Zone>('shelter', reducedMotion)

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip [--focus-ring:theme(colors.atomic.yellow)] [--focus-halo:theme(colors.atomic.ink)] ${atomic.root} ${atomicFace.variable}`}>
      <JourneyBackdrop zones={zones} />
      {!reducedMotion && <VaultEntrance onOpened={onOpened} />}

      <header className="relative z-30 px-3 pb-8 pt-14 sm:px-6 sm:pt-10">
        <WristComputer booted={booted} instant={reducedMotion} />
      </header>

      <ZoneStageProvider value={stage}>
        <main className="relative z-20 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <ContactTerminal />
      </ZoneStageProvider>

      <Wanderer zones={zones} />

      <footer className="relative z-20 bg-atomic-ink py-8 text-center" role="contentinfo">
        <p className="text-sm text-atomic-ash">
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
