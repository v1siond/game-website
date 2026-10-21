'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView, useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { NameWords } from '@/components/cv/NameWords'
import { MONO, PIXEL, RPG_VARS } from './RetroRPG/palette'
import { ActionOptions, FOCUS } from './RetroRPG/actions'
import { Box, Mark, SHOW_AFTER, Typed } from './RetroRPG/panels'
import { CommandOption } from './RetroRPG/selector'
import { Encounter } from './RetroRPG/encounter'
import { SavePoint } from './RetroRPG/savePoint'
import { SECTION_VIEWS } from './RetroRPG/sections'
import world from './RetroRPG/world.module.css'

// Retro RPG, a lo-fi pixel role playing game's encounter screen: the page composition. It reads top to
// bottom like the game's battle screen: him in the monster area, the box with his name and lines, the
// stats line, and the command row that switches the profession. Under it the profession's sections, each
// a box (the bullet box above the main list), and the save point as the contact. The palette, buttons,
// boxes, cards, the bullet box, the encounter and the save point live in ./RetroRPG.
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

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.world}`} style={RPG_VARS}>
      <a
        href="#main-content"
        className={`sr-only bg-[color:var(--rpg-gold)] text-[color:var(--rpg-void)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 ${FOCUS}`}
      >
        {labels.navigation.skipToContent}
      </a>

      {/* The encounter: him, the box, the stats line and the command row */}
      <header className="relative z-30 px-4 pb-6 pt-8 sm:px-6">
        <Encounter profession={active}>
          <RecruiterHero
            render={({ name, headline, tagline, line, actions }) => (
              <Box className={`mt-4 ${world.opens}`}>
                <h1 className={`text-lg uppercase tracking-[0.15em] text-[color:var(--rpg-text)] sm:text-2xl ${PIXEL}`}>
                  <Typed pace="short" delay="open">
                    <NameWords name={name} />
                  </Typed>
                </h1>
                <div className="mt-4 space-y-2">
                  <Said className={`text-[color:var(--rpg-text)] ${SHOW_AFTER.second}`}>{headline}</Said>
                  <Said className={`text-[color:var(--rpg-sky)] ${SHOW_AFTER.third}`}>{tagline}</Said>
                  <Said className={`text-[color:var(--rpg-muted)] ${SHOW_AFTER.third}`}>{line}</Said>
                </div>
                <nav className={`mt-6 ${SHOW_AFTER.last}`} aria-label={labels.navigation.contactAndCv}>
                  <ActionOptions actions={actions} />
                </nav>
              </Box>
            )}
          />

          <div className={`mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm uppercase tracking-[0.12em] text-[color:var(--rpg-text)] ${PIXEL} ${SHOW_AFTER.last}`}>
            <span>{view.hero.name}</span>
            <span className="text-[color:var(--rpg-gold)]">{labels.professions[active]}</span>
            <span className="h-4 w-24 bg-[color:var(--rpg-gold)]" aria-hidden="true" />
          </div>

          <ProfessionSwitch
            className={`mt-4 grid grid-cols-1 gap-3 sm:flex sm:justify-between ${SHOW_AFTER.last}`}
            label={labels.navigation.professionSelection}
            renderOption={(option) => <CommandOption option={option} />}
          />
        </Encounter>
      </header>

      {/* The picked profession's sections, and only those */}
      <main id="main-content" className="relative z-20">
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </main>

      <SavePoint profession={active} />

      <footer className="relative z-20 py-10 text-center">
        <p className={`text-sm text-[color:var(--rpg-muted)] ${MONO}`}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
