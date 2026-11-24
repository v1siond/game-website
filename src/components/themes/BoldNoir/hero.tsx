'use client'

import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSiteLinks } from '@/components/cv/SiteLinks'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { Stage } from '../shared/theatre/Stage'
import { InkStamp, PaperClip } from './backdrop'
import { NoirLink } from './actions'
import { ProfessionMenu } from './menu'
import { NOIR } from './palette'
import { LAYER_MOTION, type NoirScene } from './scenes'
import page from './page.module.css'

// The first screen, over the street where the call comes in: his case file lying crooked, his name typed on
// it, clipped shut and stamped in red ink, and his headline, his lines and actions beside it, the wardrobe on
// the header's foot, then the menu where he picks a profession. Under reduced motion the street's picture sits still behind the hero.

// The wardrobe's crooked cut-out slab over the menu: paper on ink, ringed in the red.
const OUTFIT_LOOK: WardrobeLook = { plate: NOIR.ink, text: NOIR.paper, ring: NOIR.red }

export function RooftopHero({ scene, still }: { scene: NoirScene; still: boolean }) {
  const { navigation } = useLabels()
  const { cv, engine } = useSiteLinks('engine')

  return (
    <section id={scene.anchor} data-scene={scene.id} data-worlds-hero="" aria-labelledby="noir-hero" className={page.hero}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <header className="relative z-30 px-4 pb-24 pt-16 sm:px-6 sm:py-16">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="relative">
                <div className={`relative px-5 pb-6 pt-8 sm:px-8 sm:pb-10 sm:pt-12 ${page.card} ${page.file}`}>
                  <PaperClip className="absolute -top-6 right-10 h-16 w-6" />
                  <InkStamp className="absolute -bottom-6 -right-4 h-20 w-20 rotate-12 opacity-90" />
                  <h1 id="noir-hero" className={`text-[clamp(1.5rem,7.5vw,3rem)] uppercase md:text-[clamp(2.25rem,4.5vw,3.5rem)] ${page.typed}`}>
                    {name}
                  </h1>
                  <p className={`mt-5 inline-block px-3 py-1 text-xl uppercase tracking-widest ${page.heading}`}>{headline}</p>
                </div>
              </div>

              <div className={`p-5 ${page.slab}`}>
                <p className={`text-lg italic text-[color:var(--noir-paper)] ${page.copy}`}>{tagline}</p>
                <p className={`mt-2 text-base text-[color:var(--noir-paper-dim)] ${page.copy}`}>{line}</p>
                <nav className="mt-6 flex flex-wrap items-center gap-3" aria-label={navigation.contactAndCv}>
                  {[...actions, cv, engine].map((slot) => (
                    <NoirLink key={slot.id} slot={slot} />
                  ))}
                </nav>
              </div>
            </div>
          )}
        />
        {/* out of the flow, in the header so it stacks over the menu section (z-20): on a phone slim at the
            right of the card's last link row, from sm centred on the header's foot, over the slabs, as wide as the
            plate so a fan beside it opens from the plate's edge */}
        <Wardrobe
          look={OUTFIT_LOOK}
          className="c-wardrobe--slim-below-lg c-wardrobe--fan-down-below-sm max-sm:[--wd-fan-gap:-60px] c-wardrobe--fan-level-md-to-lg c-wardrobe--fan-left-md-to-lg c-wardrobe--fan-left-from-lg absolute bottom-10 right-4 z-10 sm:-bottom-[5px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
        />
      </header>

      <section className="relative z-20 px-4 py-8" aria-label={navigation.professionSelection}>
        <ProfessionMenu />
      </section>
    </section>
  )
}
