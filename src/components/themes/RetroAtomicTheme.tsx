'use client'

import { useMemo } from 'react'
import { Share_Tech_Mono } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { WristComputer } from './RetroAtomic/wristComputer'
import { scenesOf, type Scene } from './RetroAtomic/scenes'
import { SceneSection } from './RetroAtomic/sections'
import { AtomicStage, LAYER_MOTION, theatreScene } from './RetroAtomic/stage'
import { ContactTerminal } from './RetroAtomic/terminal'
import atomic from './RetroAtomic/atomic.module.css'

// The world's own lettering: the root carries its --atomic-face variable and the world's css reads it.
const atomicFace = Share_Tech_Mono({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--atomic-face' })

const PHONE_QUERY = '(max-width: 767.98px)'

// Retro Atomic: a bomb shelter of the atomic age seen through his wrist terminal, as a walk out of the
// shelter, through the wasteland and into the town at dusk. The hero is the wrist terminal over the
// shelter, its cog door rolling aside and him walking out into the glare (./RetroAtomic/wristComputer); on a
// phone the terminal starts most of a screen down, so the door and his walk play in view above it first (and
// under reduced motion its still shows there); the
// terminal's tabs and dial switch the profession. Then every section of the active profession is one full
// screen place of the walk (./RetroAtomic/scenes) that rises from dark, holds while its title and cards
// scroll over it, and sinks back into dark while the next one rises; at each he plays one to three of the
// game's own moves at their own speed: the bobblehead off its stand, the targeting freeze and its slowed
// shot, the footlocker's lock, the power armour's stomp, the glowing crater and the syringe, the dog's
// fetch, the radio mast, the turn fight with the mutant. Contact is the public terminal and its password
// game (./RetroAtomic/terminal), which he and the dogs walk out to.
// The scroll plays each place's script at no more than its own speed, on the shared theatre
// (./shared/theatre): scroll up and it plays back. Under reduced motion
// there is no theatre and no scrub: each section carries its own picture, still, at its settled frame.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a scroll
// container.

export default function RetroAtomicTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { professionalSummary } = useCVData()
  const labels = useLabels()
  const { highlights } = useAboutBlock()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), active, phone, highlights.length, labels),
    [view.sections, professionalSummary.bio, active, phone, highlights.length, labels],
  )
  const staged = useMemo(() => scenes.map(theatreScene), [scenes])
  const { theatreRef, textRef } = useTheatre(staged, LAYER_MOTION, reduced)
  const sections = scenes.filter((scene): scene is Scene & { slot: NonNullable<Scene['slot']> } => scene.slot !== null)

  return (
    <div
      className={`relative min-h-screen overflow-x-clip [--focus-ring:theme(colors.atomic.yellow)] [--focus-halo:theme(colors.atomic.ink)] [--theatre-ground:theme(colors.atomic.bunker)] ${atomic.root} ${atomicFace.variable}`}
    >
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <AtomicStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}
      <div ref={textRef} className="relative z-20">
        <header data-scene="hero" className="relative min-h-[100svh] px-3 pb-16 pt-14 max-md:!pt-[70svh] sm:px-6 sm:pt-10 lg:px-[4vw]">
          {reduced && <AtomicStage scene={scenes[0]} settled />}
          <WristComputer instant={reduced} />
        </header>

        <main id="main-content">
          <ProfessionRegion>
            {sections.map((scene) => (
              <SceneSection key={scene.id} scene={scene} slot={scene.slot} still={reduced} />
            ))}
          </ProfessionRegion>
          <ContactTerminal scene={scenes[scenes.length - 1]} still={reduced} />
        </main>

        <footer className="bg-atomic-ink py-8 text-center">
          <p className="text-sm text-atomic-ash">
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </div>
  )
}
