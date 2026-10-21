'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { CEL } from './CellShaded/palette'
import { CelBackdrop, ImpactBurst } from './CellShaded/backdrop'
import { ProfessionCard } from './CellShaded/cards'
import { CVLink, EngineLink, HeroAction } from './CellShaded/actions'
import { SECTION_VIEWS } from './CellShaded/sections'
import { ContactScene } from './CellShaded/scenes'
import world from './CellShaded/world.module.css'

// Cell Shaded, the toon shaded comic look (flat colour bands, one thick ink line, speed lines and
// impact bursts): the page composition. Its palette, art, panels, cards, his costume, the profession
// stages, the scroll scenes and the per profession sections live in ./CellShaded.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' level strips from sticking to the viewport.

export default function CellShadedTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.root} ${world.focusRing}`}>
      <CelBackdrop />

      {/* the recruiter first screen */}
      <header className="relative z-30 px-4 py-6 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="hidden h-20 w-20 flex-shrink-0 sm:block" aria-hidden="true">
                  <ImpactBurst fill={CEL.sun} />
                </div>
                <div className="min-w-0">
                  <h1 className={`break-words text-4xl uppercase tracking-wider text-[#141414] sm:text-6xl ${world.title}`}>{name}</h1>
                  <p className={`mt-3 inline-block -rotate-1 border-[3px] border-[#141414] bg-white px-3 py-1 text-base font-bold ${world.copy} ${world.drop}`}>
                    {headline}
                  </p>
                  <p className={`mt-3 text-base font-bold italic ${world.copy}`}>{tagline}</p>
                  <p className={`mt-1 text-sm font-bold ${world.copy}`}>{line}</p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-3" aria-label={navigation.contactAndCv}>
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

      {/* the profession switch, a character select with him in each costume */}
      <section className="relative z-20 px-4 py-6" aria-label={navigation.professionSelection}>
        <ProfessionSwitch
          className="mx-auto grid max-w-xl grid-cols-3 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-8"
          label={navigation.profession}
          renderOption={(option) => <ProfessionCard {...option} />}
        />
      </section>

      <main className="relative z-20 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <ContactScene profession={active} />

      <footer className="relative z-20 flex flex-col items-center gap-3 py-10" role="contentinfo">
        <div className="h-12 w-12" aria-hidden="true">
          <ImpactBurst fill={CEL.orange} />
        </div>
        <p className={`text-sm font-bold ${world.copy}`}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
