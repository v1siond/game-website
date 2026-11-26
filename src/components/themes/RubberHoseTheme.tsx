'use client'

import { useMemo } from 'react'
import { Abril_Fatface } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { CopyrightLine } from './shared/CopyrightLine'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useSiteLinks } from '@/components/cv/SiteLinks'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { headingId } from '@/lib/cv/sectionText'
import { HOSE, HOSE_VARS } from './RubberHose/palette'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { FilmBackdrop } from './RubberHose/backdrop'
import { CartoonTitle } from './RubberHose/art'
import { CartoonCharacter } from './RubberHose/selector'
import { HoseLink } from './RubberHose/actions'
import { scenesOf, type Scene } from './RubberHose/scenes'
import { SceneSection } from './RubberHose/sections'
import { HoseStage, LAYER_MOTION, theatreScene } from './RubberHose/stage'
import { HeroCharacter } from './RubberHose/toon'
import { Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { staggerAt } from './shared/stagger'
import world from './RubberHose/world.module.css'

// The poster lettering, Abril Fatface: the root carries its --hose-lettering variable and the world's css
// reads it.
const hoseLettering = Abril_Fatface({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--hose-lettering',
})

// His outfit plate: an inked title card, ink lettering on paper with an ink outline.
const OUTFIT_LOOK: WardrobeLook = { plate: HOSE.paper, text: HOSE.ink, ring: HOSE.ink }

// Rubber Hose, a 1930s rubber hose cartoon in sepia (one ink line, bendy hose limbs, film grain): the page
// composition. Its palette, backdrop, art, cards, his drawing, the scenes and the per profession sections
// live in ./RubberHose.
//
// The page is one boss fight in the big top (./RubberHose/scenes), the way the 1930s cartoon run and gun
// plays: the hero is the title card over the isle map, his marker walking up to the big top before the
// iris opens on the ring and the steam calliope rolls in; each section of the active profession is a stage
// of the fight, the calliope changing form as it escalates, and he shoots, jumps, dashes, slaps the pink
// things away and fires his charged shot and his super; Contact is the knockout and his bow. Each scene's
// one to three actions are played by the scroll, forward on the way down and back on the way up, at no more
// than their own speed, on the shared theatre (./shared/theatre). From lg the cards read in a column on the left and the fight plays clear of
// them on the right, then the next section the other way round, up to the contact. Under reduced motion there is no theatre: each section carries its own picture,
// still, at its end frame.
//
// The root carries the palette as --hose-* variables (the one inline style, variables only), the pointer
// as --mx and --my (usePointerVars, read by his title card pose), and clips sideways overflow with
// overflow-x: clip, not hidden: hidden would make the root a scroll container.

const PHONE_QUERY = '(max-width: 767.98px)'
// From lg the cards and the fight sit side by side, so there the sections take turns: cards left, then right.
const SPLIT_QUERY = '(min-width: 1024px)'

const CONTACT_HEADING = headingId('hose', 'Contact')

/** From lg the contact card sits on the side away from the knockout, as every section's cards do. */
const CONTACT_SIDE: Record<Scene['layout']['side'], string> = { right: 'lg:mx-0', left: 'lg:ml-auto lg:mr-0' }

export default function RubberHoseTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, sections } = useLabels()
  const { professionalSummary } = useCVData()
  const { cv, engine } = useSiteLinks('engine')
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const split = useMediaQuery(SPLIT_QUERY)
  const rootRef = usePointerVars(!reduced)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), active, phone, split),
    [view.sections, professionalSummary.bio, active, phone, split],
  )
  const staged = useMemo(() => scenes.map(theatreScene), [scenes])
  const { theatreRef, textRef } = useTheatre(staged, LAYER_MOTION, reduced)
  const scenesWithSlots = scenes.filter((scene): scene is Scene & { slot: NonNullable<Scene['slot']> } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip [--focus-ring:var(--hose-ink)] [--focus-halo:var(--hose-paper)] [--theatre-ground:var(--hose-film)] ${world.root} ${hoseLettering.variable}`} style={HOSE_VARS}>
      <SkipLink className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 ${world.chip}`} />

      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <HoseStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}
      <FilmBackdrop playing={!reduced} />

      {/* the page sits inside the film frame */}
      <div ref={textRef} className="relative z-20 mx-6 sm:mx-14">
        <header data-scene="hero" data-worlds-hero="" className="relative min-h-[100svh] px-2 py-6 sm:p-6">
          {reduced && <HoseStage scene={scenes[0]} settled />}
          <RecruiterHero
            render={({ name, headline, tagline, line, actions }) => (
              <div className={`relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-8 text-center sm:px-10 ${world.titleCard}`}>
                <div data-worlds-figure="" className="pointer-events-none absolute -bottom-2 -left-10 hidden h-36 w-24 lg:block" aria-hidden="true">
                  <HeroCharacter profession={active} pose="idle" className="h-full w-full" />
                </div>
                <div>
                  <CartoonTitle text={name} />
                  <p className={`mt-4 text-base tracking-[0.1em] ${world.muted} ${staggerAt(0)}`}>{headline}</p>
                  <p className={`mt-2 text-sm italic tracking-widest ${world.red} ${staggerAt(1)}`}>{tagline}</p>
                  <p className={`mt-2 text-sm ${world.ink} ${staggerAt(2)}`}>{line}</p>
                </div>

                <nav className={`flex flex-wrap items-center justify-center gap-3 ${staggerAt(3)}`} aria-label={navigation.contactAndCv}>
                  {[...actions, cv, engine].map((slot) => (
                    <HoseLink key={slot.id} slot={slot} />
                  ))}
                </nav>
                {/* out of the flow, across the card's bottom edge; from lg his figure stands at the card's left edge, so the
                    plate leaves the centre and stands at his side */}
                <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--fan-down-below-lg sm:max-lg:[--wd-fan-gap:225px] absolute inset-x-0 -bottom-[34px] z-10 lg:right-auto lg:left-16 ${staggerAt(3)}`} />
              </div>
            )}
          />
        </header>

        {/* the profession switch, a row of cast badges with him in each costume */}
        <section className="relative py-8" aria-label={navigation.professionSelection}>
          <ProfessionSwitch
            className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-8 md:gap-12"
            label={navigation.profession}
            renderOption={(option) => <CartoonCharacter {...option} />}
          />
        </section>

        <main id="main-content">
          <ProfessionRegion>
            {scenesWithSlots.map((scene) => (
              <SceneSection key={scene.id} scene={scene} slot={scene.slot} still={reduced} />
            ))}
          </ProfessionRegion>

          {/* At least a screen tall, so by the page's end its top has reached the top of the screen and the
              knockout's stage has risen whole over the last section's, whose fight would sit under this card. */}
          <section data-scene={contact.id} className="relative min-h-[100svh] px-2 pb-8 pt-[60svh] max-md:pt-[130svh] sm:px-6 lg:px-[6vw]" aria-labelledby={CONTACT_HEADING}>
            {reduced && <HoseStage scene={contact} settled />}
            <RecruiterHero
              render={({ line, actions }) => (
                <div className={`relative mx-auto max-w-3xl p-6 text-center sm:text-left lg:max-w-[40vw] ${CONTACT_SIDE[contact.layout.side]} ${world.titleCard}`}>
                  <h2 id={CONTACT_HEADING} className={`mb-3 text-2xl uppercase ${world.lettering} ${world.dropText}`}>
                    {sections.contact}
                  </h2>
                  <p className={`mb-6 text-base ${world.ink}`}>{line}</p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                    {[...actions, cv].map((slot) => (
                      <HoseLink key={slot.id} slot={slot} />
                    ))}
                  </div>
                </div>
              )}
            />
          </section>
        </main>

        <footer className="relative py-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="h-0.5 w-8 shrink-0 bg-[var(--hose-ink)] sm:w-16" aria-hidden="true" />
            <p className={`px-3 py-1 text-sm tracking-widest ${world.chip}`}>
              <CopyrightLine />
            </p>
            <div className="h-0.5 w-8 shrink-0 bg-[var(--hose-ink)] sm:w-16" aria-hidden="true" />
          </div>
        </footer>
      </div>
    </div>
  )
}
