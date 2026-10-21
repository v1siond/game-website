'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { PALETTE_VARS } from './TropicalPlatformer/palette'
import { Crate, Crystal, Gem, Mango, TikiMask, TikiTotem } from './TropicalPlatformer/icons'
import { Canopy, JungleFloaters, JungleVine, OceanWaves } from './TropicalPlatformer/backdrop'
import { WarpZone } from './TropicalPlatformer/cards'
import { CVLink, HeroAction, NebulithLink } from './TropicalPlatformer/actions'
import { SECTION_VIEWS } from './TropicalPlatformer/sections'
import { ContactScene } from './TropicalPlatformer/scenes'
import world from './TropicalPlatformer/world.module.css'

// Tropical Platformer: the page composition. Its palette, icons, backdrop, art scenes, panels, cards,
// character, profession stages, scroll scenes and per profession sections live in ./TropicalPlatformer.
//
// The root sets the palette as --tp-* variables (its only inline style) and clips sideways overflow with
// overflow-x: clip, not hidden: hidden would make the root a scroll container and the scenes' strips
// would stop sticking to the viewport.

export default function TropicalPlatformerTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.island}`} style={PALETTE_VARS}>
      <Canopy />
      <JungleVine side="left" />
      <JungleVine side="right" />
      <JungleFloaters profession={active} />
      <OceanWaves />

      <header className="relative z-30 px-4 pb-4 pt-8 sm:px-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
                <div>
                  <h1 className={`text-4xl font-black uppercase tracking-wider md:text-6xl ${world.title}`}>{name}</h1>
                  <p className={`mt-3 text-xl font-bold text-white md:text-2xl ${world.display} ${world.outlined}`}>{headline}</p>
                  <p className={`mt-2 text-base italic text-[var(--tp-sea-light)] md:text-lg ${world.outlined}`}>{tagline}</p>
                  <p className={`mt-2 text-base text-white ${world.outlined}`}>{line}</p>
                </div>

                <nav className="flex flex-wrap items-center gap-3" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                  <NebulithLink />
                </nav>
              </div>
            </div>
          )}
        />
      </header>

      {/* The warp zone gems are the profession switch, System Engineer in the centre. */}
      <section className="relative z-20 py-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="flex justify-center gap-4 py-10 sm:gap-8"
          label="Profession"
          renderOption={(option) => <WarpZone {...option} />}
        />
      </section>

      <main className="relative z-20">
        <div role="region" aria-label={`${active} profession details`}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <ContactScene profession={active} />

      <footer className="relative z-20 py-16 text-center">
        <div className="mb-6 flex justify-center gap-6" aria-hidden="true">
          <Mango size={44} />
          <Crystal size={36} />
          <TikiMask size={44} />
          <Gem size={36} color="blue" />
          <Crate size={40} variant="flag" />
        </div>
        <div className="mb-6 flex justify-center gap-16 opacity-60" aria-hidden="true">
          <TikiTotem size={26} />
          <TikiTotem size={30} />
          <TikiTotem size={26} />
        </div>
        <p className={`text-sm font-bold text-[var(--tp-sand-light)] ${world.outlined}`}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
