'use client'

import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { useProfession } from '@/contexts/ProfessionContext'
import { Stage } from '../shared/theatre/Stage'
import { Knight } from './knight'
import { ContactButtons } from './links'
import { CARVED, SOUL } from './palette'
import { LAYER_MOTION, type SoulScene } from './scenes'
import page from './page.module.css'

// The first screen, the ruined shrine at dusk: him standing in his armour (the outfit plate at his feet),
// and his name in carved capitals on the game's menu panel, his headline in gold, his tagline, line and
// actions under it. Then the class menu, where he picks a profession. On a phone he and the panel start
// most of a screen down, so the fire catching in the shrine plays in view first. Under reduced motion the
// shrine's picture sits still behind the hero.

// The plate is the menu's dark stone with the banner gold for its name.
const OUTFIT_LOOK: WardrobeLook = { plate: SOUL.panel, text: SOUL.glow, ring: SOUL.glowDeep }

export function ShrineHero({ scene, still }: { scene: SoulScene; still: boolean }) {
  const { navigation } = useLabels()
  const { active } = useProfession()

  return (
    <section id={scene.anchor} data-scene={scene.id} data-worlds-hero="" aria-labelledby="soul-hero" className={page.hero}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled />}
      <div className="relative mx-auto grid max-w-6xl items-end gap-6 px-4 pb-12 pt-32 max-md:pb-48 max-md:pt-[62svh] sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:pt-24">
        {/* his box, with the outfit plate at its foot */}
        <div className="relative flex flex-col items-center">
          <div data-worlds-figure="" className="relative mx-auto h-64 w-40 sm:h-80 sm:w-52" aria-hidden="true">
            <Knight profession={active} className="h-full w-full" />
          </div>
          <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--fan-down-below-md absolute inset-x-0 bottom-[calc(100%_+_1rem)] z-10 md:bottom-auto md:top-[calc(100%_+_1rem)] ${CARVED}`} />
        </div>

        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className={`relative min-w-0 p-5 text-center sm:p-8 ${page.panel}`}>
              <h1 id="soul-hero" className={`${CARVED} text-[clamp(1.75rem,6vw,3.25rem)] uppercase tracking-[0.16em] text-[color:var(--soul-text)]`}>
                <NameWords name={name} />
              </h1>
              <div className="mx-auto mt-3 flex max-w-md items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-[color:var(--soul-glow-deep)]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[color:var(--soul-glow)]" />
                <span className="h-px flex-1 bg-[color:var(--soul-glow-deep)]" />
              </div>
              <p className={`${CARVED} mt-3 text-lg uppercase tracking-[0.2em] text-[color:var(--soul-glow)] sm:text-xl`}>{headline}</p>
              <p className="mt-3 text-base leading-relaxed text-[color:var(--soul-text-soft)]">{tagline}</p>
              <p className="mt-2 text-sm text-[color:var(--soul-text-soft)]">{line}</p>
              <nav className="mt-6 flex flex-wrap justify-center gap-3" aria-label={navigation.contactAndCv}>
                <ContactButtons actions={actions} />
              </nav>
            </div>
          )}
        />
      </div>

      <section className="relative px-4 pb-16 sm:px-6" aria-label={navigation.professionSelection}>
        <div className={`mx-auto w-fit max-w-full px-4 py-3 ${page.panel}`}>
          <h2 className="sr-only">{navigation.selectYourProfession}</h2>
          <ProfessionSwitch
            className="flex flex-wrap justify-center gap-3"
            label={navigation.profession}
            renderOption={({ label, selected, optionProps }) => (
              <button type="button" {...optionProps} className={`${page.button} inline-flex min-h-[44px] items-center px-5 text-sm uppercase tracking-[0.2em] ${selected ? 'text-[color:var(--soul-glow)]' : 'text-[color:var(--soul-text)]'} ${CARVED}`}>
                {label}
              </button>
            )}
          />
        </div>
      </section>
    </section>
  )
}
