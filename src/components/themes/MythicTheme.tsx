'use client'

import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { SkipLink } from '@/components/themes/shared/AccessibilityStyles'
import { MYTH, MYTH_VARS } from './Mythic/palette'
import { Aegean } from './Mythic/backdrop'
import { GreekKey } from './Mythic/art'
import { ProfessionShrine } from './Mythic/cards'
import { CVLink, EngineLink, HeroAction } from './Mythic/actions'
import { SECTION_VIEWS } from './Mythic/sections'
import { ContactScene } from './Mythic/scenes'
import world from './Mythic/world.module.css'

// Mythic, the myth told on marble and clay (a sunlit Aegean noon, white temples and columns, Greek key
// borders, braziers, figure painted pottery): the page composition. Its palette, art, the Aegean behind
// the page, the cards and shrines, his costume, the profession stages, the scroll scenes and the per
// profession sections live in ./Mythic.
//
// The root sets the palette as CSS variables (MYTH_VARS), the only inline style, and clips sideways
// overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container and stop the
// scenes' level strips from sticking to the viewport.

export default function MythicTheme() {
  const { active } = useProfession()
  const view = useWorldView()

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.root} ${world.focusRing}`} style={MYTH_VARS}>
      <SkipLink href="#main-content" />
      <Aegean />

      {/* the recruiter first screen, carved on the temple's lintel */}
      <header className="relative z-30 px-4 py-6 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <h1 className={`break-words text-3xl sm:text-5xl ${world.carved} ${world.title}`}>{name}</h1>
                <GreekKey className="mt-3 h-3 w-full max-w-md" color={MYTH.ink} />
                <p className="mt-3 text-lg font-bold text-[color:var(--myth-ink)]">{headline}</p>
                <p className="mt-1 text-base italic text-[color:var(--myth-ink)]">{tagline}</p>
                <p className="mt-1 text-sm text-[color:var(--myth-ink)]">{line}</p>
              </div>

              <nav className="flex flex-wrap items-center gap-3" aria-label="Contact and CV">
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

      {/* the profession switch, three shrines with him in each costume */}
      <section className="relative z-20 px-4 py-6" aria-label="Profession selection">
        <ProfessionSwitch
          className="mx-auto grid max-w-xl grid-cols-3 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-8"
          label="Profession"
          renderOption={(option) => <ProfessionShrine {...option} />}
        />
      </section>

      <main id="main-content" tabIndex={-1} className="relative z-20 px-4 py-8 outline-none sm:px-6">
        <div className="mx-auto max-w-5xl" role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <ContactScene profession={active} />

      <footer className="relative z-20 flex items-center justify-center gap-3 py-10" role="contentinfo">
        <p className={`px-3 py-1 text-sm ${world.plaque}`}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
