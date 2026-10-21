'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ATOMIC_YELLOW, PHOSPHOR_GREEN, PHOSPHOR_GREEN_DIM } from './RetroAtomic/palette'
import { AtomSymbol, RadiationSymbol, Starburst } from './RetroAtomic/icons'
import { ProfessionTab } from './RetroAtomic/cards'
import { BUTTON_LOOK, CVLink, HeroAction, TERMINAL_BUTTON } from './RetroAtomic/actions'
import { SECTION_VIEWS } from './RetroAtomic/sections'
import { ContactScene } from './RetroAtomic/scenes'
import world from './RetroAtomic/world.module.css'

// Retro Atomic: the page composition. Its palette, icons, panels, art separators, cards, character,
// profession stages, scroll scenes and per profession sections live in ./RetroAtomic.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and stop the scenes' strips from sticking to the viewport.

// The faint hazard trefoils behind the page: place and size of each.
const BACKDROP_TREFOILS = [
  { place: 'left-[10%] top-[15%]', size: 60 },
  { place: 'left-[26%] top-[40%]', size: 70 },
  { place: 'left-[42%] top-[65%]', size: 80 },
  { place: 'left-[58%] top-[15%]', size: 90 },
  { place: 'left-[74%] top-[40%]', size: 100 },
  { place: 'left-[90%] top-[65%]', size: 110 },
]

export default function RetroAtomicTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative min-h-screen overflow-x-clip ${world.root}`}>
      {!reducedMotion && <div className={`pointer-events-none fixed inset-0 z-[100] ${world.scanlines}`} aria-hidden="true" />}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.04]" aria-hidden="true">
        {BACKDROP_TREFOILS.map(({ place, size }) => (
          <div key={place} className={`absolute ${place}`}>
            <RadiationSymbol size={size} color={PHOSPHOR_GREEN} />
          </div>
        ))}
      </div>

      {/* the recruiter first screen */}
      <header className="relative z-30 p-4 md:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto max-w-6xl">
              <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
                <div>
                  <div className="mb-3 flex items-center gap-4 border-b-2 border-atomic-yellow pb-3">
                    <RadiationSymbol size={36} color={ATOMIC_YELLOW} />
                    <h1 className={`text-xl font-bold uppercase tracking-wider text-atomic-phosphor md:text-3xl ${world.glowGreen}`}>{name}</h1>
                  </div>
                  <p className="max-w-xl text-base text-atomic-phosphor">{headline}</p>
                  <p className="mt-1 text-sm italic text-atomic-amber">{tagline}</p>
                  <p className="mt-1 text-sm text-atomic-phosphor">{line}</p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <Starburst size={24} color={ATOMIC_YELLOW} />
                  <nav className="flex flex-wrap gap-2 md:justify-end" aria-label="Contact and CV">
                    {actions.map((action) => (
                      <HeroAction key={action.id} action={action} />
                    ))}
                    <CVLink />
                    <Link href="/personal-projects/game-engine" className={`${TERMINAL_BUTTON} ${BUTTON_LOOK.green}`}>
                      Nebulith
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          )}
        />
      </header>

      {/* the profession switch, System Engineer in the centre */}
      <section className="relative z-20 px-4 py-4" aria-label="Profession selection">
        <ProfessionSwitch
          className="mx-auto grid max-w-xl grid-cols-3 gap-2 md:flex md:max-w-none md:justify-center md:gap-6"
          label="Profession"
          renderOption={(option) => <ProfessionTab {...option} />}
        />
      </section>

      <div role="region" aria-label={`${active} profession details`}>
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </div>

      {/* contact: the round shelter hatch rolls aside to his corner */}
      <ContactScene profession={active} />

      <footer className="relative z-20 py-12 text-center" role="contentinfo">
        <div className="mb-4 flex justify-center gap-4">
          <AtomSymbol size={40} color={PHOSPHOR_GREEN_DIM} />
        </div>
        <p className="font-mono text-sm text-atomic-ash">
          © {new Date().getFullYear()} {view.hero.name}
        </p>
      </footer>
    </div>
  )
}
