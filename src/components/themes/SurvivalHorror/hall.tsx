'use client'

import type { Profession } from '@/lib/cv/professions'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import { NameWords } from '@/components/cv/NameWords'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { SH } from './palette'
import { ContactPlates } from './actions'
import { Inventory } from './inventory'
import type { Scene } from './scenes'
import { SurvivorStage } from './stage'
import look from './world.module.css'

// The first screen: his file card and the inventory that changes profession, over the main hall, where he
// switches his flashlight on as the page starts to scroll (./scenes). His outfit plate sits beside him from
// lg, its fan opening down over the hall; below lg it sits under the inventory, its fan opening down into the
// hero's own bottom space. Under reduced motion the hall's picture sits still behind it.

// The wardrobe's plate beside him: lamp flame on the void, 9.6 to 1.
const OUTFIT_LOOK: WardrobeLook = { plate: SH.void, text: SH.flame, ring: SH.void }

/** His file card: the name, the headline, the tagline, his line and the ways to reach him. */
function FileCard() {
  const { navigation } = useLabels()
  return (
    <RecruiterHero
      render={({ name, headline, tagline, line, actions }) => (
        <div className={`p-6 ${look.panel}`}>
          <h1 className={`text-[clamp(1.5rem,7vw,2.25rem)] uppercase tracking-[0.15em] text-[color:var(--sh-ivory)] ${look.typed}`}>
            <NameWords name={name} />
          </h1>
          <p className="mt-3 text-base text-[color:var(--sh-cream)]">{headline}</p>
          <p className={`mt-2 text-sm italic text-[color:var(--sh-brass-text)] ${look.typed}`}>{tagline}</p>
          <p className="mt-2 text-sm text-[color:var(--sh-cream)]">{line}</p>
          <nav className="mt-5 flex flex-wrap items-center gap-3" aria-label={navigation.contactAndCv}>
            <ContactPlates actions={actions} sites={['cv', 'engine']} />
          </nav>
        </div>
      )}
    />
  )
}

export function HeroSection({ scene, still, profession }: { scene: Scene; still: boolean; profession: Profession }) {
  return (
    <header data-scene="hero" data-worlds-hero="" className="relative min-h-[100svh] px-4 pb-[14rem] pt-8 sm:px-6 sm:pt-16 lg:px-[4vw] lg:pb-16">
      {still && <SurvivorStage scene={scene} settled />}
      {/* below lg the first half screen is his: up on the hall's gallery (scenes.tsx) */}
      <div className="h-[44svh] lg:hidden" aria-hidden="true" />
      <div className="max-w-[44rem] lg:max-w-[min(42rem,46vw)]">
        <FileCard />
        <Inventory profession={profession} />
      </div>
      <Wardrobe
        look={OUTFIT_LOOK}
        className="c-wardrobe--fan-down-below-lg c-wardrobe--fan-down-from-lg absolute bottom-[8.5rem] left-1/2 z-10 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-[4vw] lg:top-24 lg:translate-x-0"
      />
    </header>
  )
}
