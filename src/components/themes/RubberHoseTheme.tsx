'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { HOSE_VARS } from './RubberHose/palette'
import { FilmFrame, FilmGrain, RisingNotes } from './RubberHose/backdrop'
import { CartoonTitle } from './RubberHose/art'
import { CartoonCharacter } from './RubberHose/selector'
import { CVLink, EngineLink, HeroAction } from './RubberHose/actions'
import { SECTION_VIEWS } from './RubberHose/sections'
import { ContactScene } from './RubberHose/scenes'
import world from './RubberHose/world.module.css'

// Rubber Hose, a 1930s rubber hose cartoon in sepia (one ink line, pie eyed props, film grain, the iris,
// everything bobbing on the beat): the page composition. Its palette, backdrop, art, cards, his costume,
// the profession stages, the scroll scenes and the per profession sections live in ./RubberHose.
//
// The root carries the palette as --hose-* variables (the one inline style, variables only) and clips
// sideways overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container and
// stop the scenes' level strips from sticking to the viewport.

export default function RubberHoseTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.root} ${world.focusRing}`} style={HOSE_VARS}>
      <a href="#main-content" className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 ${world.chip}`}>
        Skip to main content
      </a>

      <FilmFrame />
      <FilmGrain />
      <RisingNotes />

      {/* the page sits inside the film frame */}
      <div className="mx-6 sm:mx-14">
        {/* the recruiter first screen */}
        <header className="relative z-30 px-2 py-6 sm:p-6">
          <RecruiterHero
            render={({ name, headline, tagline, line, actions }) => (
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
                <div>
                  <CartoonTitle text={name.toUpperCase()} />
                  <p className={`mt-4 text-base tracking-[0.1em] ${world.muted}`}>{headline}</p>
                  <p className={`mt-2 text-sm italic tracking-widest ${world.red}`}>{tagline}</p>
                  <p className={`mt-2 text-sm ${world.ink}`}>{line}</p>
                </div>

                <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                  <EngineLink />
                </nav>
              </div>
            )}
          />
        </header>

        {/* the profession switch, a row of cast badges with him in each costume */}
        <section className="relative z-20 py-8" aria-label="Profession selection">
          <ProfessionSwitch
            className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-8 md:gap-12"
            label="Profession"
            renderOption={(option) => <CartoonCharacter {...option} />}
          />
        </section>

        <main id="main-content" className="relative z-20 px-2 py-8 md:px-8">
          <div className="mx-auto max-w-4xl" role="region" aria-label={`${active} profession details`}>
            <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          </div>
        </main>

        <ContactScene profession={active} />

        <footer className="relative z-20 py-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="h-0.5 w-16 bg-[var(--hose-ink)]" aria-hidden="true" />
            <p className={`text-sm tracking-widest ${world.muted}`}>
              © {new Date().getFullYear()} {view.hero.name}
            </p>
            <div className="h-0.5 w-16 bg-[var(--hose-ink)]" aria-hidden="true" />
          </div>
        </footer>
      </div>
    </div>
  )
}
