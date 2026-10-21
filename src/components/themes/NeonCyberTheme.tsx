'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { CityBackdrop } from './NeonCyber/city'
import { BootHero } from './NeonCyber/boot'
import { QuickhackMenu } from './NeonCyber/quickhack'
import { ScanVeil, useTimeSlow } from './NeonCyber/scanner'
import { SECTION_VIEWS } from './NeonCyber/views'
import { HoloCall } from './NeonCyber/holocall'
import { NEON_VARS } from './NeonCyber/palette'
import world from './NeonCyber/world.module.css'

// Neon Cyber, the default world: a netrunner's night city seen through the optics HUD. The page
// composition: the hero boots the optics (./NeonCyber/boot), the profession switch is the quickhack
// menu over his rig (./NeonCyber/quickhack, ./NeonCyber/rigs), the sections are the braindance of his
// work, the gigs with their breach, the radio and the data tab (./NeonCyber/views), and contact is an
// incoming call (./NeonCyber/holocall). Scan mode (./NeonCyber/scanner) is a flag on the root that
// every card reads.
//
// The root carries the palette as --neon-* variables and the pointer as --mx and --my, the only inline
// styles, variables only. It clips sideways overflow with overflow-x: clip, not hidden: hidden would
// make the root a scroll container.

export default function NeonCyberTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [scanning, setScanning] = useState(false)
  const rootRef = usePointerVars(mounted && !reducedMotion)
  useTimeSlow(rootRef, scanning)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={rootRef} data-scan={scanning ? 'on' : 'off'} className={`relative min-h-screen overflow-x-clip ${world.root}`} style={NEON_VARS}>
      <CityBackdrop />
      <ScanVeil />

      <header className="relative z-30 px-4 pb-8 pt-8 sm:px-6 sm:pt-16">
        <BootHero profession={active} scanning={scanning} onScan={() => setScanning((on) => !on)} />
      </header>

      <section className="relative z-20 px-4 pb-10 sm:px-6" aria-label={navigation.professionSelection}>
        <QuickhackMenu active={active} />
      </section>

      <main className="relative z-20 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <HoloCall profession={active} />

      <footer className="relative z-20 flex items-center justify-center gap-3 pb-10" role="contentinfo">
        <span className={`block w-16 ${world.ticks}`} aria-hidden="true" />
        <p className="text-sm tracking-widest text-[color:var(--neon-ash)]">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
        <span className={`block w-16 ${world.ticks}`} aria-hidden="true" />
      </footer>
    </div>
  )
}
