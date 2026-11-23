'use client'

import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { useProfession } from '@/contexts/ProfessionContext'
import { Stage } from '../shared/theatre/Stage'
import { ContactActions } from './buttons'
import { CEL } from './palette'
import { LAYER_MOTION, type CelScene } from './scenes'
import { CommandoSprite } from './sprite'
import cel from './cel.module.css'
import page from './page.module.css'

// The first screen, at noon on the mesa top: the comic's intro card with him in his box (the wardrobe at
// its foot), his name slammed in sun letters, his headline, tagline, line and actions, then the outfit
// lockers where he picks a profession, each tab showing him in that gear. Under reduced motion the mesa
// top's picture sits still behind the hero.

// The wardrobe's inked name card under his box: ink on paper, outlined thick in ink.
const OUTFIT_LOOK: WardrobeLook = { plate: CEL.paper, text: CEL.ink, ring: CEL.ink }

function OutfitTab({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`flex min-h-[44px] w-full min-w-0 cursor-pointer flex-col items-center gap-2 border-4 border-[var(--cel-ink)] px-1 pb-3 pt-2 shadow-[4px_4px_0_var(--cel-ink)] sm:px-3 ${cel.outfit} ${
        selected ? 'bg-[var(--cel-sun)]' : 'bg-[var(--cel-paper)]'
      }`}
    >
      <CommandoSprite profession={id} className="h-24 w-14" />
      <span className={`text-center text-sm sm:text-base ${cel.display} [-webkit-text-stroke:0]`}>{label}</span>
    </button>
  )
}

export function IntroHero({ scene, still }: { scene: CelScene; still: boolean }) {
  const { navigation } = useLabels()
  const { active } = useProfession()

  return (
    <section id={scene.anchor} data-scene={scene.id} data-worlds-hero="" aria-labelledby="cel-hero" className={page.hero}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <div className="relative mx-auto grid max-w-6xl items-end gap-6 px-4 pb-12 pt-24 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
        {/* his box, with the wardrobe at its foot */}
        <div className="relative flex flex-col items-center gap-4">
          <div data-worlds-figure="" className="relative mx-auto h-64 w-40 sm:h-80 sm:w-48" aria-hidden="true">
            <CommandoSprite profession={active} className="h-full w-full" />
          </div>
          <Wardrobe look={OUTFIT_LOOK} className="c-wardrobe--fan-down-below-md absolute inset-x-0 bottom-[calc(100%_+_1rem)] z-10 md:bottom-auto md:top-[calc(100%_+_1rem)]" />
        </div>

        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className={`relative min-w-0 p-5 sm:p-6 ${cel.darkPaper}`}>
              {/* the size runs with the viewport between 3rem and 6rem, so the longest word fits a 320px
                  screen and the whole name sits on one line from about 1024px; it only wraps between words */}
              <h1 id="cel-hero" className={`text-[clamp(3rem,2rem+5vw,6rem)] leading-none ${cel.display}`}>
                <span className={`inline-block ${cel.nameLetters}`}>
                  <NameWords name={name} />
                </span>
              </h1>
              <p className={`mt-5 inline-block px-4 py-2 text-lg font-bold text-[var(--cel-ink)] ${cel.subtitleCard}`}>{headline}</p>
              <p className="mt-4 text-base font-bold italic text-[var(--cel-sun)]">{tagline}</p>
              <p className="mt-2 text-base font-bold">{line}</p>
              <nav className="mt-6 flex flex-wrap gap-3" aria-label={navigation.contactAndCv}>
                <ContactActions actions={actions} />
              </nav>
            </div>
          )}
        />
      </div>

      <section className="relative px-4 pb-16 sm:px-6" aria-label={navigation.professionSelection}>
        <div className={`mx-auto max-w-3xl p-3 sm:p-6 ${cel.darkPaper}`}>
          <h2 className="sr-only">{navigation.selectYourProfession}</h2>
          <ProfessionSwitch className="grid grid-cols-3 gap-2 sm:gap-3" label={navigation.profession} renderOption={(option) => <OutfitTab {...option} />} />
        </div>
      </section>
    </section>
  )
}
