'use client'

import { useEffect, useState } from 'react'
import { Poiret_One } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { usePointerVars } from '@/hooks/usePointerVars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { DECO_COLORS as C, DECO_VARS } from './ArtDeco/palette'
import { DecoPatternBackground, DecoSVGDefs, UnderwaterBubbles, UnderwaterRays, WaterCaustics } from './ArtDeco/backdrop'
import { BathysphereHero } from './ArtDeco/descent'
import { VendingMachine } from './ArtDeco/machine'
import { BrassPanel, Chamber } from './ArtDeco/plaque'
import { POSTS_DEPTH, SECTION_VIEWS } from './ArtDeco/sections'
import { ContactHatch } from './ArtDeco/hatch'
import look from './ArtDeco/world.module.css'

// The world's own lettering: the root carries its --deco-face variable and the world's css reads it.
const decoFace = Poiret_One({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--deco-face' })

// Art Deco, the 1920s city at the bottom of the sea in brass, gold and lamplight: the page composition.
// The visitor arrives in the bathysphere as it sinks past the lighthouse to the city (the hero), picks a
// profession at the city's vending machine, then goes down through the chambers of the picked profession
// (./ArtDeco/sections) and leaves through the bulkhead hatch (contact). The root carries the palette as
// --deco-* variables and the pointer as --mx and --my for the porthole parallax and the camera viewfinder.
//
// The root clips sideways overflow with overflow-x: clip, not hidden: hidden would make the root a
// scroll container and break the fixed viewfinder's place.

export default function ArtDecoTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, professions, sections, cards } = useLabels()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()
  const pointer = usePointerVars(mounted && !reducedMotion)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div ref={pointer} style={DECO_VARS} className={`relative min-h-screen overflow-x-clip ${look.root} ${decoFace.variable}`}>
      <DecoSVGDefs />

      <DecoPatternBackground />
      <UnderwaterRays />
      <WaterCaustics />
      <UnderwaterBubbles />
      <div className={`pointer-events-none fixed inset-0 z-[7] ${look.vignette}`} aria-hidden="true" />

      <header className="relative z-30 px-4 pb-6 pt-10 sm:px-6 sm:pt-16">
        <BathysphereHero />
      </header>

      <section className="relative z-20 px-4 py-8" aria-label={navigation.professionSelection}>
        <VendingMachine />
      </section>

      <main className="relative z-20 px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl" role="region" aria-label={fillLabel(navigation.professionDetails, { profession: professions[active] })}>
          <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />

          <div className="pt-20">
            <FadeInScene>
              <Chamber title={sections.posts} depth={POSTS_DEPTH[active]}>
                <BrassPanel>
                  <p className="py-6 text-center text-base italic text-[color:var(--deco-mist)]">{cards.noPosts}</p>
                </BrassPanel>
              </Chamber>
            </FadeInScene>
          </div>
        </div>
      </main>

      <ContactHatch />

      <footer className="relative z-20 flex justify-center py-12" aria-hidden="true">
        <svg width="50" height="80" viewBox="0 0 50 80" opacity="0.25" focusable="false">
          <path d="M18 80 L13 45 L37 45 L32 80" fill={C.gold} />
          <path d="M15 65 L35 65" stroke={C.bronzeDark} strokeWidth="2" />
          <rect x="10" y="25" width="30" height="20" fill={C.gold} />
          <path d="M8 25 L25 10 L42 25" fill={C.gold} />
          <circle cx="25" cy="35" r="8" fill={C.goldBright} opacity="0.8" />
          <path d="M25 27 L25 12 M17 30 L5 25 M33 30 L45 25" stroke={C.goldBright} strokeWidth="1.5" opacity="0.6" />
        </svg>
      </footer>
    </div>
  )
}
