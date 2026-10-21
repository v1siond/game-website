'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { PIXEL, RPG_VARS } from './RetroRPG/palette'
import { Window } from './RetroRPG/panels'
import { PartyMember } from './RetroRPG/selector'
import { CVLink, FOCUS, HeroActions, PlayLink } from './RetroRPG/actions'
import { SECTION_VIEWS } from './RetroRPG/sections'
import { ContactScene } from './RetroRPG/scenes'
import world from './RetroRPG/world.module.css'

// Retro RPG: the page composition, a 16 bit role playing game at night where every block is a dialogue
// window. Its palette, panels, cards, buttons, party menu, character, profession stages, scroll scenes
// and per profession sections live in ./RetroRPG.
//
// The root sets the palette as CSS variables (RPG_VARS), the only inline style, and clips sideways
// overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container and stop the
// scenes' strips from sticking to the viewport.

export default function RetroRPGTheme() {
  const { active } = useProfession()
  const view = useWorldView()

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.world}`} style={RPG_VARS}>
      <a
        href="#main-content"
        className={`sr-only bg-[color:var(--rpg-gold)] text-[color:var(--rpg-void)] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 ${FOCUS}`}
      >
        Skip to main content
      </a>

      {/* Header - the recruiter first screen, in the title window */}
      <header className="relative z-30 p-4 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <Window className="mx-auto flex max-w-4xl flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className={`break-words text-lg uppercase tracking-[0.15em] text-[color:var(--rpg-text)] sm:text-xl ${PIXEL}`}>{name}</h1>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--rpg-gold)]">{headline}</p>
                <p className="mt-2 text-sm italic leading-relaxed text-[color:var(--rpg-sky)]">{tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--rpg-muted)]">{line}</p>
              </div>

              <nav className="flex flex-wrap items-center gap-3" aria-label="Contact and CV">
                <HeroActions actions={actions} />
                <CVLink />
                <PlayLink />
              </nav>
            </Window>
          )}
        />
      </header>

      {/* The party menu: him once per profession, the switch */}
      <section className="relative z-20 px-4 py-6" aria-label="Select profession view">
        <ProfessionSwitch
          className="flex justify-center gap-3 sm:gap-6"
          label="Select profession view"
          renderOption={(option) => <PartyMember key={option.id} option={option} />}
        />
      </section>

      {/* The picked profession's levels, and only those */}
      <main id="main-content" className="relative z-20">
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </main>

      {/* Contact - the closing window opens on his corner */}
      <ContactScene profession={active} />

      <footer className="relative z-20 py-10 text-center">
        <p className="text-sm text-[color:var(--rpg-muted)]">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
