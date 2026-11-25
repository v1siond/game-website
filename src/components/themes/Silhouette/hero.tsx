'use client'

import { NameWords } from '@/components/cv/NameWords'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useLabels } from '@/components/cv/CVDataProvider'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { Stage } from '../shared/theatre/Stage'
import { ContactButtons } from './actions'
import { SHADE, TYPEWRITER } from './palette'
import { LAYER_MOTION, type ShadeScene } from './scenes'
import page from './page.module.css'

// The first screen, the edge of the forest at first light: the outfit plate and the three levers he pulls
// to change profession high on the left, his name and title as a silent film intertitle on its black panel
// on the right, his headline, tagline, line and actions under it. He is not drawn here: he lies small in
// the grass on the ground line below them, in the hero's own scene (places/hero.tsx), and wakes as the page
// scrolls. On a phone the plate sits at the top and the ground shows in the gap under it, before the panel.
// Under reduced motion the forest's picture sits still behind the hero.

// Under his waking line: the hero's actions, the CV, and Enter into the engine.
const HERO_SITES = ['cv', 'engine'] as const

// The plate is a black cut-out with the sky's rim of light for its name.
const OUTFIT_LOOK: WardrobeLook = { plate: SHADE.black, text: SHADE.rim, ring: SHADE.dawnRim }

/** A lever: the handle thrown over when its profession is the one shown. */
function Lever({ label, selected, optionProps }: ProfessionOption) {
  return (
    <button type="button" {...optionProps} className={`flex min-h-[44px] items-center gap-3 px-2 py-1 text-left ${page.lever}`}>
      <svg viewBox="0 0 48 64" className="h-14 w-10 shrink-0" aria-hidden="true" focusable="false">
        <g className={`${page.leverHandle} ${selected ? page.leverThrown : ''}`}>
          <line x1={24} y1={46} x2={24} y2={12} stroke="var(--sh-dim)" strokeWidth={3} strokeLinecap="round" />
          <circle cx={24} cy={10} r={5} fill={selected ? 'var(--sh-rim)' : 'var(--sh-dim)'} />
        </g>
        <path d="M10 64 L14 46 H34 L38 64 Z" fill="var(--sh-black)" stroke="var(--sh-dim)" strokeWidth={1.5} />
      </svg>
      <span
        className={`inline-block border-b-2 pb-1 text-sm uppercase tracking-[0.2em] ${selected ? 'border-[color:var(--sh-rim)] text-[color:var(--sh-heading)]' : 'border-transparent text-[color:var(--sh-muted-text)]'} ${TYPEWRITER}`}
      >
        {label}
      </span>
    </button>
  )
}

export function WakeHero({ scene, still }: { scene: ShadeScene; still: boolean }) {
  const { navigation } = useLabels()

  return (
    <section id={scene.anchor} data-scene={scene.id} data-worlds-hero="" aria-labelledby="sh-hero" className={page.hero}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled />}
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 pb-12 pt-16 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:grid-rows-[auto_1fr] md:pt-24">
        {/* the outfit plate high on the left; on a phone the ground and him show in the gap under it */}
        <div className="relative z-10 flex flex-col items-start max-md:mb-[52svh]">
          <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--fan-down-below-md ${TYPEWRITER}`} />
        </div>

        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className={`relative min-w-0 border-l-4 border-[color:var(--sh-black)] p-5 text-center sm:p-8 md:col-start-2 md:row-span-2 md:row-start-1 ${page.panel}`}>
              <div className="mx-auto mb-4 h-px w-24 bg-[color:var(--sh-fog)]" aria-hidden="true" />
              <h1 id="sh-hero" className={`text-[clamp(1.5rem,6vw,2.75rem)] font-normal uppercase tracking-[0.3em] text-[color:var(--sh-heading)] sm:tracking-[0.4em] ${TYPEWRITER}`}>
                <NameWords name={name} />
              </h1>
              <p className="mt-3 text-sm tracking-[0.2em] text-[color:var(--sh-text)] sm:text-base">{headline}</p>
              <p className="mt-1 text-sm italic tracking-wider text-[color:var(--sh-muted-text)]">{tagline}</p>
              <div className="mx-auto mt-4 h-px w-24 bg-[color:var(--sh-fog)]" aria-hidden="true" />
              <p className="mx-auto mt-4 max-w-xl text-sm tracking-wider text-[color:var(--sh-text)]">{line}</p>
              <nav className="mt-6 flex flex-wrap items-center justify-center gap-3" aria-label={navigation.contactAndCv}>
                <ContactButtons actions={actions} sites={HERO_SITES} />
              </nav>
            </div>
          )}
        />

        {/* the levers, under the plate on the left from md, clear of the ground he wakes on */}
        <section className="relative md:col-start-1 md:row-start-2 md:self-start" aria-label={navigation.professionSelection}>
          <div className={`w-fit max-w-full border-l-4 border-[color:var(--sh-black)] px-4 py-3 max-md:mx-auto ${page.panel}`}>
            <h2 className="sr-only">{navigation.selectYourProfession}</h2>
            <ProfessionSwitch className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-start" label={navigation.profession} renderOption={(option) => <Lever {...option} />} />
          </div>
        </section>
      </div>
    </section>
  )
}
