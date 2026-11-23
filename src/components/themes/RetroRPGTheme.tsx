'use client'

import { useMemo } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView, useLabels } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { NameWords } from '@/components/cv/NameWords'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { MONO, PIXEL, RPG_VARS } from './RetroRPG/palette'
import { ActionOptions } from './RetroRPG/actions'
import { Box, Mark } from './RetroRPG/panels'
import { CommandOption } from './RetroRPG/selector'
import { Encounter } from './RetroRPG/encounter'
import { SavePoint } from './RetroRPG/savePoint'
import { scenesOf, type Scene } from './RetroRPG/scenes'
import { SceneSection } from './RetroRPG/sections'
import { LAYER_MOTION, RpgStage, theatreScene } from './RetroRPG/stage'
import world from './RetroRPG/world.module.css'

const PHONE_QUERY = '(max-width: 767.98px)'

// Retro RPG, a 16 bit role playing game. The hero is the genre's encounter screen: him on the battle
// field, the window with his name and lines, the stats line, and the command window that switches the
// profession, over the ruins where his critter faces him. Then every section of the active profession is
// one full screen scene of the walk (./RetroRPG/scenes) that rises from dark, holds while its title and
// windows scroll over it, and sinks back into dark while the next one rises: from the stone ruins through
// the snow town, the crystal cave, the volcano and the market town, him making the genre's move once per
// card at the stop it brings. Contact is the save point, which he walks up to back in the ruins. Every motion is a function of the
// scroll position, on the shared theatre (./shared/theatre) and its settle: scroll up and it plays back.
// Under reduced motion there is no theatre: each section carries its own picture, still, at its settled
// frame.
//
// The root sets the palette as CSS variables (RPG_VARS), the only inline style, and clips sideways
// overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container.

const LINE = `text-sm leading-relaxed sm:text-base ${MONO}`

function Said({ children, className }: { children: string; className: string }) {
  return (
    <p className={`flex items-start gap-2 ${LINE} ${className}`}>
      <Mark className="text-[color:var(--rpg-text)]" />
      <span>{children}</span>
    </p>
  )
}

export default function RetroRPGTheme() {
  const labels = useLabels()
  const { active } = useProfession()
  const view = useWorldView()
  const { professionalSummary } = useCVData()
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
    <div className={`relative min-h-screen overflow-x-clip [--theatre-ground:var(--rpg-void)] [--theatre-veil:var(--rpg-void)] ${world.world}`} style={RPG_VARS}>
      <SkipLink className="sr-only bg-[color:var(--rpg-gold)] text-[color:var(--rpg-void)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2" />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <RpgStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}

      <div ref={textRef} className="relative z-20">
        {/* The encounter: him, the window, the stats line and the command window */}
        <header data-scene="hero" data-worlds-hero="" className="relative min-h-[100svh] px-4 pb-16 pt-8 sm:px-6">
          {reduced && <RpgStage scene={scenes[0]} settled />}
          <Encounter profession={active}>
            <RecruiterHero
              render={({ name, headline, tagline, line, actions }) => (
                <Box className="mt-4">
                  <h1 className={`text-[clamp(1.125rem,5.5vw,1.5rem)] uppercase tracking-[0.15em] text-[color:var(--rpg-text)] ${PIXEL}`}>
                    <NameWords name={name} />
                  </h1>
                  <div className="mt-4 space-y-2">
                    <Said className="text-[color:var(--rpg-text)]">{headline}</Said>
                    <Said className="text-[color:var(--rpg-sky)]">{tagline}</Said>
                    <Said className="text-[color:var(--rpg-muted)]">{line}</Said>
                  </div>
                  <nav className="mt-6" aria-label={labels.navigation.contactAndCv}>
                    <ActionOptions actions={actions} />
                  </nav>
                </Box>
              )}
            />

            <div className={`mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 bg-[color:var(--rpg-void)] px-3 py-2 text-sm uppercase tracking-[0.12em] text-[color:var(--rpg-text)] ${PIXEL}`}>
              <span>
                <NameWords name={view.hero.name} />
              </span>
              <span className="text-[color:var(--rpg-gold)]">{labels.professions[active]}</span>
              <span className="h-4 w-24 bg-[color:var(--rpg-gold)]" aria-hidden="true" />
            </div>

            <ProfessionSwitch
              className={`mt-4 grid grid-cols-1 gap-3 p-3 sm:flex sm:justify-between ${world.box}`}
              label={labels.navigation.professionSelection}
              renderOption={(option) => <CommandOption option={option} />}
            />
          </Encounter>
        </header>

        <main id="main-content">
          <ProfessionRegion>
            {sections.map((scene) => (
              <SceneSection key={scene.id} scene={scene} slot={scene.slot} still={reduced} />
            ))}
          </ProfessionRegion>
          <SavePoint profession={active} scene={scenes[scenes.length - 1]} still={reduced} />
        </main>

        <footer className="relative py-10 text-center">
          <p className={`inline-block bg-[color:var(--rpg-void)] px-2 text-sm text-[color:var(--rpg-muted)] ${MONO}`}>
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </div>
  )
}
