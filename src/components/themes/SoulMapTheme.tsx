'use client'

import { useEffect, useState } from 'react'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import type { Profession } from '@/lib/cv/professions'
import { SOUL_VARS } from './SoulMap/palette'
import { CavernBackdrop } from './SoulMap/backdrop'
import { RestPoint } from './SoulMap/art'
import { ZoneHud, ZoneNode, zoneState } from './SoulMap/selector'
import { CVLink, EngineLink, HeroAction } from './SoulMap/actions'
import { SECTION_VIEWS } from './SoulMap/sections'
import { ContactScene } from './SoulMap/scenes'
import world from './SoulMap/world.module.css'

// Soul Map, the map of a map exploration game (deep blue caverns, rooms that reveal as he enters them,
// glowing paths between zones, a rest point at each stop): the page composition. Its palette, art,
// backdrop, panels, cards, his costume, the zone map, the profession stages, the scroll scenes and the
// per profession sections live in ./SoulMap.
//
// The root sets the palette as --soul-* custom properties (its only inline style) and clips sideways
// overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container and stop the
// scenes' level strips from sticking to the viewport.

export default function SoulMapTheme() {
  const view = useWorldView()
  const active = view.profession
  const [mounted, setMounted] = useState(false)
  const [explored, setExplored] = useState<ReadonlySet<Profession>>(() => new Set([active]))

  useEffect(() => {
    setMounted(true)
  }, [])

  // A zone counts as explored once its profession has been picked.
  useEffect(() => {
    setExplored((seen) => (seen.has(active) ? seen : new Set([...seen, active])))
  }, [active])

  if (!mounted) return null

  const stateOf = (id: Profession) => zoneState(id === active, explored.has(id))

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.root} ${world.focusRing}`} style={SOUL_VARS}>
      <CavernBackdrop />

      {/* the recruiter first screen */}
      <header className="relative z-30 px-4 py-8 sm:p-8">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6">
              <div className="flex min-w-0 items-center gap-4">
                <RestPoint className="hidden h-16 w-16 flex-shrink-0 sm:block" />
                <div className="min-w-0">
                  <h1 className={`break-words text-3xl uppercase text-[var(--soul-text)] sm:text-5xl ${world.lettering} ${world.title}`}>{name}</h1>
                  <p className="mt-3 text-base text-[var(--soul-glow)]">{headline}</p>
                  <p className="mt-2 text-base italic text-[var(--soul-text-soft)]">{tagline}</p>
                  <p className="mt-1 text-sm text-[var(--soul-text-soft)]">{line}</p>
                </div>
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

      {/* the profession switch, the world map's three zones */}
      <section className="relative z-20 px-4 pb-12 pt-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="mx-auto grid max-w-xl grid-cols-3 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-16"
          label="Profession"
          renderOption={(option) => <ZoneNode option={option} state={stateOf(option.id)} />}
        />
      </section>

      <main className="relative z-20 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl" role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <ContactScene profession={active} />

      <ZoneHud stateOf={stateOf} />

      <footer className="relative z-20 flex flex-col items-center gap-3 py-10" role="contentinfo">
        <RestPoint className="h-10 w-10" />
        <p className="text-sm text-[var(--soul-text-soft)]">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
