'use client'

import { useCallback, useEffect, useState } from 'react'
import { Share_Tech_Mono } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { ShelterBackdrop } from './RetroAtomic/backdrop'
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
// wasteland, to a public terminal with its password game (./RetroAtomic/terminal).
//
// The root carries the pointer as --mx and --my (-1 to 1) for the shelter's and the wasteland's
// parallax. It clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container. Under reduced motion the door is skipped and the terminal is on from the start.

export default function RetroAtomicTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [booted, setBooted] = useState(false)
  const rootRef = usePointerVars(mounted && !reducedMotion)
  const onOpened = useCallback(() => setBooted(true), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip ${atomic.root} ${atomicFace.variable}`}>
      <ShelterBackdrop />
      {!reducedMotion && <VaultEntrance onOpened={onOpened} />}

      <header className="relative z-30 px-3 pb-8 pt-6 sm:px-6 sm:pt-10">
        <WristComputer booted={booted} instant={reducedMotion} />
      </header>

      <main className="relative z-20 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <ContactTerminal />

      <footer className="relative z-20 bg-atomic-ink py-8 text-center" role="contentinfo">
        <p className="text-sm text-atomic-ash">
          © {new Date().getFullYear()} <NameWords name={view.hero.name} />
        </p>
      </footer>
    </div>
  )
}
