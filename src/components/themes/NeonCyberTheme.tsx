'use client'

import { useMemo, useState } from 'react'
import { Share_Tech_Mono } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { HeroSection } from './NeonCyber/boot'
import { HoloCall } from './NeonCyber/holocall'
import { NEON_VARS } from './NeonCyber/palette'
import { ScanVeil, useTimeSlow } from './NeonCyber/scanner'
import { scenesOf, type Scene } from './NeonCyber/scenes'
import { SceneSection } from './NeonCyber/sections'
import { LAYER_MOTION, NeonStage, theatreScene } from './NeonCyber/stage'
import world from './NeonCyber/world.module.css'

// The world's own lettering: the root carries its --neon-face variable and the world's css reads it.
const neonFace = Share_Tech_Mono({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--neon-face' })

const PHONE_QUERY = '(max-width: 767.98px)'

// Neon Cyber: a netrunner's night city seen through the optics HUD, as a scroll through its districts.
// The hero boots the optics over Watson (./NeonCyber/boot), the profession switch is the quickhack menu
// over his rig (./NeonCyber/quickhack). Then every section of the active profession is one full screen
// scene of the city (./NeonCyber/scenes) that rises from dark, holds while its HUD title and cards scroll
// over it, and sinks back into dark while the next one rises; he is the merc in each scene and does one
// thing per card: scans a tag, hops the braindance playhead, dashes past a shard, jacks into an access
// point, breaches an ICE column, cuts a contract loose, drums a station in, installs a chrome upgrade.
// Contact is an incoming call (./NeonCyber/holocall) after which he drives off into the Badlands. Every
// motion is a function of the scroll position, on the shared theatre (./shared/theatre) and its settle:
// stop and art and text come to rest together, scroll up and it plays back. Scan mode
// (./NeonCyber/scanner) is a flag on the root that every card reads. Under reduced motion there is no
// theatre and no scrub: each section carries its own picture, still, at its settled frame.
//
// The root carries the palette as --neon-* variables and the pointer as --mx and --my, the only inline
// styles, variables only. It clips sideways overflow with overflow-x: clip, not hidden: hidden would
// make the root a scroll container.

export default function NeonCyberTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { professionalSummary } = useCVData()
  const labels = useLabels()
  const { facts, highlights } = useAboutBlock()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const [scanning, setScanning] = useState(false)
  const rootRef = usePointerVars(!reduced)
  useTimeSlow(rootRef, scanning)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), active, phone, facts.length + highlights.length, labels),
    [view.sections, professionalSummary.bio, active, phone, facts.length, highlights.length, labels],
  )
  const staged = useMemo(() => scenes.map(theatreScene), [scenes])
  const { theatreRef, textRef } = useTheatre(staged, LAYER_MOTION, reduced)
  const sections = scenes.filter((scene): scene is Scene & { slot: NonNullable<Scene['slot']> } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  return (
    <div
      ref={rootRef}
      data-scan={scanning ? 'on' : 'off'}
      className={`relative min-h-screen overflow-x-clip [--theatre-ground:var(--neon-void)] [--theatre-veil:var(--neon-ink)] ${world.root} ${neonFace.variable}`}
      style={NEON_VARS}
    >
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <NeonStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}
      <ScanVeil />
      <div ref={textRef} className="relative z-20">
        <main id="main-content">
          <HeroSection scene={scenes[0]} still={reduced} profession={active} scanning={scanning} onScan={() => setScanning((on) => !on)} />
          <ProfessionRegion>
            {sections.map((scene, i) => (
              <SceneSection key={scene.id} scene={scene} slot={scene.slot} number={i + 1} total={sections.length + 1} still={reduced} />
            ))}
          </ProfessionRegion>
          <HoloCall scene={contact} profession={active} number={sections.length + 1} still={reduced} />
        </main>

        <footer className="flex items-center justify-center gap-3 bg-[color:var(--neon-ink)] py-8">
          <span className={`block w-16 ${world.ticks}`} aria-hidden="true" />
          <p className="text-sm tracking-widest text-[color:var(--neon-ash)]">
            <CopyrightLine />
          </p>
          <span className={`block w-16 ${world.ticks}`} aria-hidden="true" />
        </footer>
      </div>
    </div>
  )
}
