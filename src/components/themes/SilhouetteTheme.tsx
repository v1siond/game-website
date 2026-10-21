'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { SHADE_VARS, TYPEWRITER } from './Silhouette/palette'
import { Atmosphere } from './Silhouette/backdrop'
import { ProfessionFigure } from './Silhouette/selector'
import { CVLink, HeroActions, PlayLink } from './Silhouette/actions'
import { SECTION_VIEWS } from './Silhouette/sections'
import { ContactScene } from './Silhouette/scenes'
import world from './Silhouette/world.module.css'

// Silhouette: the page composition, black shapes on a lit sky in the fog. Its palette, atmosphere,
// cards, profession figures, buttons, character, profession stages, scroll scenes and per profession
// sections live in ./Silhouette.
//
// The root sets the palette as CSS variables (SHADE_VARS), the only inline style, and clips sideways
// overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container and stop the
// scenes' strips from sticking to the viewport.

export default function SilhouetteTheme() {
  const { active } = useProfession()
  const view = useWorldView()

  return (
    <div className={`relative min-h-screen overflow-x-clip ${TYPEWRITER} ${world.world}`} style={SHADE_VARS}>
      <Atmosphere />

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 p-4 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-3xl flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="break-words text-xl font-normal uppercase tracking-[0.3em] text-[color:var(--sh-heading)] sm:text-2xl sm:tracking-[0.5em]">
                  {name}
                </h1>
                <p className="mt-2 text-sm tracking-[0.2em] text-[color:var(--sh-text)]">{headline}</p>
                <p className="mt-1 text-sm italic tracking-wider text-[color:var(--sh-muted)]">{tagline}</p>
                <p className="mt-2 text-sm tracking-wider text-[color:var(--sh-text)]">{line}</p>
              </div>

              <nav className="flex flex-wrap items-center gap-3" aria-label="Contact and CV">
                <HeroActions actions={actions} />
                <CVLink />
                <PlayLink />
              </nav>
            </div>
          )}
        />
      </header>

      {/* Him three times in the dark, one per profession: the switch */}
      <section className="relative z-20 py-8" aria-label="Select profession view">
        <ProfessionSwitch
          className="flex justify-center gap-6 sm:gap-14"
          label="Select profession view"
          renderOption={(option) => <ProfessionFigure key={option.id} option={option} />}
        />
      </section>

      {/* The picked profession's levels, and only those */}
      <main className="relative z-20">
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </main>

      {/* Contact - the fog lifts and the rocks part on his corner */}
      <ContactScene profession={active} />

      <footer className="relative z-20 py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-3" aria-hidden="true">
          <div className="h-px w-6 bg-[color:var(--sh-edge)]" />
          <p className="text-sm tracking-[0.5em] text-[color:var(--sh-dim)]">. . .</p>
          <div className="h-px w-6 bg-[color:var(--sh-edge)]" />
        </div>
        <p className="text-sm text-[color:var(--sh-dim)]">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
