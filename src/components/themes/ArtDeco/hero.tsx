'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { Stage } from '../shared/theatre/Stage'
import { DecoLinks } from './actions'
import { VendingMachine } from './machine'
import { LAYER_MOTION, type DecoScene } from './scenes'
import page from './page.module.css'

// The first screen: his name as the station's gold neon sign over his headline, tagline, contact line and
// actions on a brass panel, and the city's vending machine beside it where a profession is picked (its
// outfit plate under his glass), all over the station lobby the bathysphere docks at. Under reduced motion
// the lobby's picture sits still behind the hero.

export function StationHero({ scene, still }: { scene: DecoScene; still: boolean }) {
  const { navigation } = useLabels()

  return (
    <section id={scene.anchor} data-scene={scene.id} data-worlds-hero="" aria-labelledby="deco-hero" className={page.hero}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <RecruiterHero
        render={({ name, headline, tagline, line, actions }) => (
          <div className={page.heroCopy}>
            <h1 id="deco-hero" className={`text-[clamp(1.75rem,7vw,3.25rem)] uppercase leading-tight ${page.sign}`}>
              {name}
            </h1>
            <p className="mt-5 text-lg tracking-wide text-[color:var(--deco-cream)]">{headline}</p>
            <p className="mt-2 text-base italic text-[color:var(--deco-gold-text)]">{tagline}</p>
            <p className="mt-2 text-base text-[color:var(--deco-mist)]">{line}</p>
            <nav className="mt-7 flex flex-wrap items-center gap-3" aria-label={navigation.contactAndCv}>
              <DecoLinks actions={actions} sites={['cv', 'engine']} />
            </nav>
          </div>
        )}
      />
      <section className={page.machine} aria-label={navigation.professionSelection}>
        <VendingMachine />
      </section>
    </section>
  )
}
