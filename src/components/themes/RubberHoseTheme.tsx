'use client'

import { Abril_Fatface } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { CopyrightLine } from './shared/CopyrightLine'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useSiteLinks } from '@/components/cv/SiteLinks'
import { ProfessionSectionsView } from '@/components/cv/ProfessionSectionsView'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePointerVars } from '@/hooks/usePointerVars'
import { ZoneStageProvider, useZoneStore } from '@/hooks/useZoneStage'
import { HOSE, HOSE_VARS } from './RubberHose/palette'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { FilmFrame, FilmGrain, RisingNotes } from './RubberHose/backdrop'
import { CUE_THRESHOLD, CartoonTitle } from './RubberHose/art'
import { CartoonCharacter } from './RubberHose/selector'
import { HoseLink } from './RubberHose/actions'
import { SECTION_VIEWS } from './RubberHose/sections'
import { IrisWipe, SunWatcher, TitleCardIntro } from './RubberHose/scenes'
import { staggerAt } from './shared/stagger'
import { ProfessionSet } from './RubberHose/sets'
import { IsleStage, Isles, type Isle } from './RubberHose/isles'
import { InView } from './shared/held'
import { HeroCharacter } from './RubberHose/cup'
import { headingId } from '@/lib/cv/sectionText'
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

// Rubber Hose, a 1930s rubber hose cartoon in sepia (one ink line, pie eyed props, film grain, the iris,
// everything bobbing on the beat): the page composition. Its palette, backdrop, art, cards, his costume,
// the profession sets, the scroll scenes and the per profession sections live in ./RubberHose.
//
// Behind it all the painted isles (./RubberHose/isles), fixed like the game's watercolour sets and walking
// from the meadow to the carnival to the casino as the visitor scrolls: each section hands its isle up
// through the shared ZoneStageProvider. He acts in every section (./RubberHose/stages).
//
// The hero is the boss intro title card with him popping up beside it finger gun first, a profession switch opens that profession's set and sections
// on a new iris (./RubberHose/sets), the contact frame closes on the iris out round him waving under the
// pie eyed sun (./RubberHose/scenes).
//
// The root carries the palette as --hose-* variables (the one inline style, variables only), the pointer
// as --mx and --my (usePointerVars, read by the sets' parallax and the sun's pupils), and clips
// sideways overflow with overflow-x: clip, not hidden: hidden would make the root a scroll container and
// stop sticky children from sticking to the viewport.

const CONTACT_HEADING = headingId('hose', 'Contact')

export default function RubberHoseTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const { navigation, sections } = useLabels()
  const { cv, engine } = useSiteLinks('engine')
  const reducedMotion = useReducedMotion()
  const rootRef = usePointerVars(!reducedMotion)
  const { zones, stage } = useZoneStore<Isle>('meadow', reducedMotion)

  return (
    <div ref={rootRef} className={`relative min-h-screen overflow-x-clip [--focus-ring:var(--hose-ink)] [--focus-halo:var(--hose-paper)] ${world.root} ${hoseLettering.variable}`} style={HOSE_VARS}>
      <SkipLink className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 ${world.chip}`} />

      <ZoneStageProvider value={stage}>
        <Isles zones={zones} />
        <FilmFrame />
        <FilmGrain />
        <RisingNotes />

        {/* the page sits inside the film frame */}
        <div className="mx-6 sm:mx-14">
          {/* the recruiter first screen */}
          {/* the first screen is not cued: it plays as the page loads */}
          <IsleStage isle="meadow" cued={false}>
            <header data-worlds-hero="" className="relative z-30 px-2 py-6 sm:p-6">
              <RecruiterHero
                render={({ name, headline, tagline, line, actions }) => (
                  <TitleCardIntro>
                    {(look) => (
                      <div className={`relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-8 text-center sm:px-10 ${world.titleCard} ${look.card}`}>
                        <div data-worlds-figure="" className={`pointer-events-none absolute -bottom-2 -left-10 hidden h-36 w-24 lg:block ${look.word}`} aria-hidden="true">
                          <HeroCharacter profession={active} pose="idle" className="h-full w-full" />
                        </div>
                        <div>
                          <CartoonTitle text={name} />
                          <p className={`mt-4 text-base tracking-[0.1em] ${world.muted} ${staggerAt(0)} ${look.word}`}>{headline}</p>
                          <p className={`mt-2 text-sm italic tracking-widest ${world.red} ${staggerAt(1)} ${look.word}`}>{tagline}</p>
                          <p className={`mt-2 text-sm ${world.ink} ${staggerAt(2)} ${look.word}`}>{line}</p>
                        </div>

                        <nav className={`flex flex-wrap items-center justify-center gap-3 ${staggerAt(3)} ${look.word}`} aria-label={navigation.contactAndCv}>
                          {[...actions, cv, engine].map((slot) => (
                            <HoseLink key={slot.id} slot={slot} />
                          ))}
                        </nav>
                        {/* out of the flow, across the card's bottom edge; from lg his figure stands at the card's left edge, so the
                            plate leaves the centre and stands at his side */}
                        <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--fan-down-below-lg sm:max-lg:[--wd-fan-gap:225px] absolute inset-x-0 -bottom-[34px] z-10 lg:right-auto lg:left-16 ${staggerAt(3)} ${look.word}`} />
                      </div>
                    )}
                  </TitleCardIntro>
                )}
              />
            </header>
          </IsleStage>

          {/* the profession switch, a row of cast badges with him in each costume */}
          <section className="relative z-20 py-8" aria-label={navigation.professionSelection}>
            <InView threshold={CUE_THRESHOLD}>
              <ProfessionSwitch
                className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-8 md:gap-12"
                label={navigation.profession}
                renderOption={(option) => <CartoonCharacter {...option} />}
              />
            </InView>
          </section>

          <main id="main-content" className="relative z-20 px-2 py-8 md:px-8">
            <ProfessionRegion className="mx-auto max-w-6xl">
              <IrisWipe key={active}>
                <ProfessionSet profession={active} />
                <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
              </IrisWipe>
            </ProfessionRegion>
          </main>

          <IsleStage isle="casino">
            <section className="relative z-20 mx-auto max-w-3xl px-2 py-8" aria-labelledby={CONTACT_HEADING}>
              <SunWatcher key={active} profession={active} />
              <RecruiterHero
                render={({ line, actions }) => (
                  <div className={`relative mt-6 p-6 text-center sm:text-left ${world.titleCard}`}>
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
          </IsleStage>

          <footer className="relative z-20 py-8 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="h-0.5 w-8 shrink-0 bg-[var(--hose-ink)] sm:w-16" aria-hidden="true" />
              <p className={`px-3 py-1 text-sm tracking-widest ${world.chip}`}>
                <CopyrightLine />
              </p>
              <div className="h-0.5 w-8 shrink-0 bg-[var(--hose-ink)] sm:w-16" aria-hidden="true" />
            </div>
          </footer>
        </div>
      </ZoneStageProvider>
    </div>
  )
}
