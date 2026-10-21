'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { NoirBackdrop } from './BoldNoir/backdrop'
import { CallingCardHero } from './BoldNoir/hero'
import { ProfessionMenu } from './BoldNoir/menu'
import { ProfessionSet } from './BoldNoir/sets'
import { SECTION_VIEWS } from './BoldNoir/sections'
import { DeliveredCard } from './BoldNoir/contact'
import { NOIR_VARS } from './BoldNoir/palette'
import world from './BoldNoir/world.module.css'

// Bold Noir, a stylish heist night (black slabs and paper on crooked boxes,
// one loud red, ransom note lettering, star bursts and glass): the page composition. The hero is a
// calling card thrown at the screen, the profession switch is the game's menu with its cut-in over his
// set for that profession (./BoldNoir/sets), a project
// opens through the finisher onto its finish card, contact is the second calling card. The art, the
// cards, his costume and the per profession sections live in ./BoldNoir.
//
// The root carries the palette as --noir-* variables and the pointer as --mx and --my (-1 to 1), the
// only inline styles, variables only. It clips sideways overflow with overflow-x: clip, not hidden:
// hidden would make the root a scroll container.

export default function BoldNoirTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const rootRef = usePointerVars(mounted && !reducedMotion)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip ${world.root} ${world.focusRing}`} style={NOIR_VARS}>
      <NoirBackdrop />

      <header className="relative z-30 px-4 py-10 sm:px-6 sm:py-16">
        <CallingCardHero />
      </header>

      <section className="relative z-20 px-4 py-8" aria-label={navigation.professionSelection}>
        <ProfessionMenu active={active} />
        <div className="mt-10">
          <ProfessionSet key={active} profession={active} />
        </div>
      </section>

      <main className="relative z-20 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <DeliveredCard />

      <footer className="relative z-20 flex items-center justify-center gap-3 py-10" role="contentinfo">
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
        <p className={`text-sm text-[color:var(--noir-fog)] ${world.copy}`}>
          © {new Date().getFullYear()} {view.hero.name}
        </p>
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
      </footer>
    </div>
  )
}
