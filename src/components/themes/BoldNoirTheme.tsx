'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { NoirBackdrop } from './BoldNoir/backdrop'
import { ProfessionCard } from './BoldNoir/cards'
import { CVLink, EngineLink, HeroAction } from './BoldNoir/actions'
import { SECTION_VIEWS } from './BoldNoir/sections'
import { ContactScene } from './BoldNoir/scenes'
import world from './BoldNoir/world.module.css'

// Bold Noir, the graphic novel night (black, white and one red accent, rain, venetian blind light, hard
// shadows): the page composition. Its palette, art, panels, cards, his costume, the profession stages,
// the scroll scenes and the per profession sections live in ./BoldNoir.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' level strips from sticking to the viewport.

export default function BoldNoirTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.root} ${world.focusRing}`}>
      <NoirBackdrop />

      {/* the recruiter first screen */}
      <header className="relative z-30 px-4 py-6 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <h1 className={`break-words text-5xl uppercase tracking-wider sm:text-7xl ${world.title}`}>{name}</h1>
                <p className={`mt-3 inline-block px-3 py-1 text-base font-bold ${world.typed} ${world.caption}`}>{headline}</p>
                <p className={`mt-3 text-base italic text-[#f2efe6] ${world.copy}`}>{tagline}</p>
                <p className={`mt-1 text-sm text-[#a3a3a3] ${world.copy}`}>{line}</p>
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

      {/* the profession switch, a lineup with him in each costume */}
      <section className="relative z-20 px-4 py-6" aria-label="Profession selection">
        <ProfessionSwitch
          className="mx-auto grid max-w-xl grid-cols-3 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-8"
          label="Profession"
          renderOption={(option) => <ProfessionCard {...option} />}
        />
      </section>

      <main className="relative z-20 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl" role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <ContactScene profession={active} />

      <footer className="relative z-20 flex items-center justify-center gap-3 py-10" role="contentinfo">
        <span className="block h-1 w-10 bg-[#ff0033]" aria-hidden="true" />
        <p className={`text-sm text-[#a3a3a3] ${world.copy}`}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
        <span className="block h-1 w-10 bg-[#ff0033]" aria-hidden="true" />
      </footer>
    </div>
  )
}
