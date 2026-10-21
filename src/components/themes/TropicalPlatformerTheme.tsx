'use client'

import { useEffect, useState } from 'react'
import { Lilita_One } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PALETTE_VARS } from './TropicalPlatformer/palette'
import { JungleDefs } from './TropicalPlatformer/barrel'
import { Canopy } from './TropicalPlatformer/canopy'
import { Backdrop, SceneryDefs } from './TropicalPlatformer/scenery'
import { HudProvider } from './TropicalPlatformer/hud'
import { SunsetHero } from './TropicalPlatformer/sunset'
import { PartnerBarrel } from './TropicalPlatformer/partnerBarrel'
import { PostsLevel, SECTION_VIEWS } from './TropicalPlatformer/sections'
import { TreehouseContact } from './TropicalPlatformer/nightfall'
import look from './TropicalPlatformer/jungle.module.css'

// The world's own lettering: the root carries its --tp-face variable and the world's css reads it.
const jungleFace = Lilita_One({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--tp-face' })

// Tropical Platformer, a jungle barrel platformer from sunset to night: the page composition. He is shot
// out of his tree house in the sunset (the hero), picks a profession at the partner barrel, crosses the
// picked profession's levels (./TropicalPlatformer/sections) and ends the run at night by the tree house
// (contact). The root carries the palette as --tp-* variables, the pointer as --mx and --my for the
// sunset's planes, the shared gradients every barrel is drawn with and the scenery's shapes every scene
// is built from. Each part stands in its own scene (the sunset, the dusk, each level's, the night) and
// the banana counter in the top left counts the levels reached (./TropicalPlatformer/hud).
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and break the fixed canopy.

export default function TropicalPlatformerTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions } = useLabels()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()
  const pointer = usePointerVars(mounted && !reducedMotion)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={pointer} style={PALETTE_VARS} className={`relative min-h-screen overflow-x-clip ${look.root} ${jungleFace.variable}`}>
      <HudProvider>
      <JungleDefs />
      <SceneryDefs />
      <Canopy />

      <header className="relative isolate z-30 px-4 pb-10 pt-10 sm:px-8 sm:pt-16 md:px-20">
        <Backdrop kind="sunset" placement="band" />
        <SunsetHero />
      </header>

      <section className="relative isolate z-20 px-4 py-12 sm:px-8 md:px-20" aria-label={navigation.professionSelection}>
        <Backdrop kind="dusk" placement="band" />
        <PartnerBarrel />
      </section>

      <main className="relative z-20 px-4 py-16 sm:px-8 md:px-20">
        <div className="mx-auto max-w-6xl space-y-24" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
          <PostsLevel />
        </div>
      </main>

      <TreehouseContact />

      </HudProvider>

      <footer className="relative z-20 bg-[color:var(--tp-night-deep)] py-10 text-center">
        <p className="text-sm text-[color:var(--tp-plank-light)]">
          © {new Date().getFullYear()} <NameWords name={view.hero.name} />
        </p>
      </footer>
    </div>
  )
}
