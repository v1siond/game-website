'use client'

import { useEffect, useMemo, useState } from 'react'
import { Share_Tech_Mono } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { ZoneStageProvider } from '@/hooks/useZoneStage'
import { CityBackdrop, type District } from './NeonCyber/city'
import { DistrictStage, DriveOff } from './NeonCyber/life'
import { BootHero } from './NeonCyber/boot'
import { QuickhackMenu } from './NeonCyber/quickhack'
import { ScanVeil, useTimeSlow } from './NeonCyber/scanner'
import { SECTION_VIEWS } from './NeonCyber/views'
import { HoloCall } from './NeonCyber/holocall'
import { NEON_VARS } from './NeonCyber/palette'
import world from './NeonCyber/world.module.css'

// The world's own lettering: the root carries its --neon-face variable and the world's css reads it.
const neonFace = Share_Tech_Mono({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--neon-face' })

// Neon Cyber, the default world: a netrunner's night city seen through the optics HUD. The page
// composition: the hero boots the optics (./NeonCyber/boot), the profession switch is the quickhack
// menu over his rig (./NeonCyber/quickhack, ./NeonCyber/rigs), the sections are the braindance of his
// work, the gigs with their breach, the radio and the data tab (./NeonCyber/views), and contact is an
// incoming call (./NeonCyber/holocall) after which he drives off into the skyline (./NeonCyber/life).
// Scan mode (./NeonCyber/scanner) is a flag on the root that every card reads. The backdrop travels
// through the city's districts as the page scrolls: each section stage hands its district up through
// the shared ZoneStageProvider and the city fades to it.
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
  const [district, setDistrict] = useState<District>('watson')
  const stage = useMemo(() => ({ reduced: reducedMotion, onZone: (zone: District) => setDistrict(zone) }), [reducedMotion])
  const rootRef = usePointerVars(mounted && !reducedMotion)
  useTimeSlow(rootRef, scanning)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={rootRef} data-scan={scanning ? 'on' : 'off'} className={`relative min-h-screen overflow-x-clip ${world.root} ${neonFace.variable}`} style={NEON_VARS}>
      <ZoneStageProvider value={stage}>
      <CityBackdrop district={district} />
      <ScanVeil />

      <DistrictStage district="watson">
        <header className="relative z-30 px-4 pb-8 pt-8 sm:px-6 sm:pt-16">
          <BootHero profession={active} scanning={scanning} onScan={() => setScanning((on) => !on)} />
        </header>

        <section className="relative z-20 px-4 pb-10 sm:px-6" aria-label={navigation.professionSelection}>
          <QuickhackMenu active={active} />
        </section>
      </DistrictStage>

      <main className="relative z-20 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <HoloCall profession={active} />
      <div className="relative z-20 px-4 pb-6 sm:px-6">
        <DriveOff />
      </div>

      <footer className="relative z-20 flex items-center justify-center gap-3 pb-10" role="contentinfo">
        <span className={`block w-16 ${world.ticks}`} aria-hidden="true" />
        <p className="text-sm tracking-widest text-[color:var(--neon-ash)]">
          © {new Date().getFullYear()} <NameWords name={view.hero.name} />
        </p>
        <span className={`block w-16 ${world.ticks}`} aria-hidden="true" />
      </footer>
      </ZoneStageProvider>
    </div>
  )
}
