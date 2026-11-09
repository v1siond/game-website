'use client'

import { useEffect, useState } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
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
import { NOIR, NOIR_VARS } from './BoldNoir/palette'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
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

// The wardrobe's crooked cut-out slab over the menu: paper on ink, ringed in the red.
const OUTFIT_LOOK: WardrobeLook = { plate: NOIR.ink, text: NOIR.paper, ring: NOIR.red }

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

      {/* the first screen: his calling card and the menu where he stands */}
      <div data-worlds-hero="">
        <header className="relative z-30 px-4 pb-10 pt-16 sm:px-6 sm:py-16">
          <CallingCardHero />
          {/* out of the flow, in the header so it stacks over the menu section (z-20): on a phone slim at the
              right of the card's last link row, from sm centred across the header's foot, over the slabs */}
          <Wardrobe look={OUTFIT_LOOK} className="c-wardrobe--slim-below-lg c-wardrobe--fan-down-below-sm max-sm:[--wd-fan-gap:-44px] c-wardrobe--fan-level-md-to-lg c-wardrobe--fan-left-md-to-lg c-wardrobe--fan-left-from-lg absolute bottom-10 right-4 z-10 sm:inset-x-0 sm:-bottom-[5px] md:left-1/2 md:right-auto md:-translate-x-1/2" />
        </header>

        <section className="relative z-20 px-4 py-8" aria-label={navigation.professionSelection}>
          <ProfessionMenu active={active} />
          <div className="mt-10">
            <ProfessionSet key={active} profession={active} />
          </div>
        </section>
      </div>

      <main className="relative z-20 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
        </div>
      </main>

      <DeliveredCard />

      <footer className="relative z-20 flex items-center justify-center gap-3 py-10" role="contentinfo">
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
        <p className={`text-sm text-[color:var(--noir-fog)] ${world.copy}`}>
          © {new Date().getFullYear()} <NameWords name={view.hero.name} />
        </p>
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
      </footer>
    </div>
  )
}
