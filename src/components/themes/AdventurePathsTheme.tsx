'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { JOURNAL_SERIF, TRAIL_VARS } from './AdventurePaths/palette'
import { NightBackdrop } from './AdventurePaths/backdrop'
import { CompassRose } from './AdventurePaths/icons'
import { TrailSign } from './AdventurePaths/selector'
import { CVLink, HeroAction, PlayLink } from './AdventurePaths/actions'
import { SECTION_VIEWS } from './AdventurePaths/sections'
import { ContactScene } from './AdventurePaths/scenes'

// Adventure Paths: the page composition, an expedition on foot through ruins, clearings and temples. Its
// palette, backdrop, marks, trail signs, panels, cards, character, profession stages, scroll scenes and
// per profession sections live in ./AdventurePaths.
//
// The root sets the palette as CSS variables (TRAIL_VARS), the only inline style, and clips sideways
// overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container and stop the
// scenes' strips from sticking to the viewport.

export default function AdventurePathsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[color:var(--ap-night)] font-['Segoe_UI',system-ui,sans-serif] text-[color:var(--ap-parchment)]"
      style={TRAIL_VARS}
    >
      <NightBackdrop />

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 py-5 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 md:flex-row">
              <div className="flex min-w-0 items-start gap-4">
                <CompassRose className="hidden h-14 w-14 shrink-0 sm:block" />
                <div className="min-w-0">
                  <h1 className={`break-words text-2xl font-bold tracking-wide sm:text-3xl ${JOURNAL_SERIF}`}>{name}</h1>
                  <p className="mt-2 text-base font-semibold text-[color:var(--ap-gold)]">{headline}</p>
                  <p className="mt-1 text-sm italic text-[color:var(--ap-edge)]">{tagline}</p>
                  <p className="mt-1 text-sm">{line}</p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-3" aria-label="Contact and CV">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <PlayLink />
              </nav>
            </div>
          )}
        />
      </header>

      {/* The trail fork: one sign per profession, System Engineer in the centre */}
      <section className="relative z-20 px-4 py-6 sm:py-8" aria-label="Profession selection">
        <ProfessionSwitch
          className="mx-auto grid max-w-xl grid-cols-3 gap-2 sm:gap-6"
          label="Profession"
          renderOption={(option) => <TrailSign {...option} />}
        />
      </section>

      {/* The picked profession's levels, and only those */}
      <div role="region" aria-label={`${active} profession details`}>
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </div>

      {/* Contact - the temple door sinks to his corner */}
      <ContactScene profession={active} />

      <footer className="relative z-20 py-10 text-center">
        <RecruiterHero
          render={({ name }) => (
            <p className="text-sm text-[color:var(--ap-edge)]">
              © {new Date().getFullYear()} {name}
            </p>
          )}
        />
      </footer>
    </div>
  )
}
