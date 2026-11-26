'use client'

import { useMemo } from 'react'
import { Lilita_One } from 'next/font/google'
import { CopyrightLine } from './shared/CopyrightLine'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch } from '@/components/cv/ProfessionSwitch'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { PostsGate } from '@/components/cv/PostsGate'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan } from '@/lib/cv/sectionPlan'
import { headingId } from '@/lib/cv/sectionText'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import Wardrobe, { type WardrobeLook } from '@/components/worlds/Wardrobe'
import { COLORS as C, PALETTE_VARS, TONE_VARS } from './TropicalPlatformer/palette'
import { JungleLinks } from './TropicalPlatformer/buttons'
import { Canopy } from './TropicalPlatformer/canopy'
import { SceneryDefs } from './TropicalPlatformer/scenery'
import { scenesOf, type Scene, type SceneSide } from './TropicalPlatformer/scenes'
import { PostsBoard, SceneSection } from './TropicalPlatformer/sections'
import { Plate } from './TropicalPlatformer/selector'
import { JungleStage, LAYER_MOTION, theatreScene } from './TropicalPlatformer/stage'
import { Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { staggerAt } from './shared/stagger'
import look from './TropicalPlatformer/jungle.module.css'
import paint from './TropicalPlatformer/scenery.module.css'

// The world's own lettering: the root carries its --tp-face variable and the world's css reads it.
const jungleFace = Lilita_One({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--tp-face' })

// His outfit plate: a dark plank sign with sun gold lettering and a plank rim.
const OUTFIT_LOOK: WardrobeLook = { plate: C.barkDark, text: C.sunGold, ring: C.plank }

// The hero offers the CV and his engine beside email and LinkedIn; the contact the CV.
const HERO_SITE_LINKS = ['cv', 'engine'] as const
const CONTACT_SITE_LINKS = ['cv'] as const

// The root's variables: the palette, and the day jungle's tone for the shapes drawn outside a stage (the
// fern under each level's sign, the canopy).
const ROOT_VARS = { ...PALETTE_VARS, ...TONE_VARS.jungle }

// Tropical Platformer, one run of the 3D jungle platformer it comes from, from the stormy night the crocodile
// king's snappers carry off the golden store to the troop riding the gentle giant home: the page composition.
// Its palette, the scenery's shapes, the boards, his drawing, the troop, the crocodiles, the places of the run
// and the per profession levels live in ./TropicalPlatformer.
//
// The hero is his name on a plank over his isle on the night the store is stolen, the king's fortress moored
// off it; he drops from his treehouse in the morning and slams the ground. Then every section of the active
// profession is one full screen world of the run in the game's order (./TropicalPlatformer/places) that rises
// from dark, holds while its sign and boards scroll over it, and sinks back into dark while the next one rises,
// its one to three actions played by the scroll on the shared scene player. The sections take turns: from lg
// the first after the hero reads its cards on the left beside its scene on the right, the next the other way
// round, and so on to Contact, the ride home; below lg each plays in the half it names before its cards come up. Every motion is a function of the scroll position, on the shared
// theatre (./shared/theatre) and its settle: scroll up and it plays back. Under reduced motion there is no
// theatre: each section carries its own picture, still, at its end frame.
//
// The root carries the palette as --tp-* variables and the day tone as --tone-* (the one inline style,
// variables only) and clips sideways overflow with overflow-x: clip, not
// hidden: hidden would make the root a scroll container and break the fixed canopy.

const PHONE_QUERY = '(max-width: 767.98px)'
const SPLIT_QUERY = '(min-width: 1024px)'

const CONTACT_HEADING = headingId('jungle', 'Contact')

// The contact's posts and card: centred below lg, from lg on the half its scene leaves free, as a section's.
const CONTACT_BESIDE: Record<SceneSide, string> = {
  right: 'mx-auto max-w-3xl lg:ml-0 lg:mr-auto lg:max-w-[min(42rem,44vw)]',
  left: 'mx-auto max-w-3xl lg:ml-auto lg:mr-0 lg:max-w-[min(42rem,44vw)]',
}

export default function TropicalPlatformerTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const labels = useLabels()
  const { navigation, sections } = labels
  const { professionalSummary } = useCVData()
  const { highlights } = useAboutBlock()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const split = useMediaQuery(SPLIT_QUERY)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), active, phone, split, highlights.length, labels),
    [view.sections, professionalSummary.bio, active, phone, split, highlights.length, labels],
  )
  const staged = useMemo(() => scenes.map(theatreScene), [scenes])
  const { theatreRef, textRef } = useTheatre(staged, LAYER_MOTION, reduced)
  const scenesWithSlots = scenes.filter((scene): scene is Scene & { slot: NonNullable<Scene['slot']> } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  return (
    <div
      style={ROOT_VARS}
      className={`relative min-h-screen overflow-x-clip [--theatre-ground:var(--tp-jungle-deep)] ${look.root} ${paint.scene} ${jungleFace.variable}`}
    >
      <SkipLink />
      <SceneryDefs />

      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <JungleStage key={scene.id} scene={scene} />
          ))}
        </Theatre>
      )}
      <Canopy />

      <div ref={textRef} className="relative z-20">
        {/* On a phone the name and card start most of a screen down, so the theft and his burst out of the
            treehouse play in view first (the reduced motion still shows there), and the outfit fan below the card
            keeps its room clear of the profession plates. */}
        <header data-scene="hero" data-worlds-hero="" className="relative min-h-[100svh] px-4 pb-16 pt-10 max-md:pb-48 max-md:pt-[62svh] sm:px-8 sm:pt-16 md:px-20">
          {reduced && <JungleStage scene={scenes[0]} settled />}
          <RecruiterHero
            render={({ name, headline, tagline, line, actions }) => (
              <div className="relative mx-auto max-w-3xl text-center">
                <h1 className={`inline-block rounded-2xl px-6 pb-4 pt-6 text-[clamp(1.5rem,7.5vw,3rem)] uppercase text-[color:var(--tp-sun-gold)] ${look.board} ${look.display} ${look.outlined}`}>
                  {name}
                </h1>
                <div className={`relative mt-6 rounded-3xl px-5 pb-14 pt-1 ${look.board}`}>
                  <p className={`mt-5 text-xl text-[color:var(--tp-parchment)] ${look.display} ${staggerAt(0)}`}>{headline}</p>
                  <p className={`mt-2 text-base italic text-[color:var(--tp-sun-gold)] ${staggerAt(1)}`}>{tagline}</p>
                  <p className={`mt-2 text-base text-[color:var(--tp-parchment)] ${staggerAt(2)}`}>{line}</p>
                  <nav className={`mt-7 flex flex-wrap items-center justify-center gap-3 ${staggerAt(3)}`} aria-label={navigation.contactAndCv}>
                    <JungleLinks actions={actions} site={HERO_SITE_LINKS} />
                  </nav>
                  <Wardrobe look={OUTFIT_LOOK} className={`c-wardrobe--fan-down-below-lg c-wardrobe--fan-down-from-lg absolute inset-x-0 -bottom-[34px] z-10 ${look.display} ${staggerAt(3)}`} />
                </div>
              </div>
            )}
          />
        </header>

        {/* the profession switch: a plate per profession on the jungle path, him in each one's clothes */}
        <section className="relative px-4 py-12 sm:px-8 md:px-20" aria-label={navigation.professionSelection}>
          <h2 className="sr-only">{navigation.selectYourProfession}</h2>
          <ProfessionSwitch className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3" label={navigation.profession} renderOption={(option) => <Plate {...option} />} />
        </section>

        <main id="main-content">
          <ProfessionRegion>
            {scenesWithSlots.map((scene) => (
              <SceneSection key={scene.id} scene={scene} slot={scene.slot} still={reduced} />
            ))}
          </ProfessionRegion>

          {/* The space over and under the contact card lets its scene, the gentle giant freed and the troop riding
            him home, play out before the page ends; below lg the space over it is taller, so the posts board and
            the card come up only once he is on his way. From lg the card reads on the half its scene leaves free. */}
          <section data-scene={contact.id} className="relative px-4 pb-[70svh] pt-[60svh] max-md:motion-safe:pt-[110svh] md:max-lg:motion-safe:pt-[220svh] motion-reduce:pb-8 motion-reduce:pt-16 sm:px-6 lg:px-[6vw]" aria-labelledby={CONTACT_HEADING}>
            {reduced && <JungleStage scene={contact} settled />}
            <PostsGate>
              <div className={`relative ${CONTACT_BESIDE[contact.side]}`}>
                <PostsBoard />
              </div>
            </PostsGate>
            <RecruiterHero
              render={({ line, actions }) => (
                <div className={`relative rounded-3xl p-6 sm:p-8 ${look.board} ${CONTACT_BESIDE[contact.side]}`}>
                  <h2 id={CONTACT_HEADING} className={`text-2xl uppercase text-[color:var(--tp-sun-gold)] sm:text-3xl ${look.display} ${look.outlined}`}>
                    {sections.contact}
                  </h2>
                  <p className="mt-4 text-base text-[color:var(--tp-parchment)]">{line}</p>
                  <nav className="mt-6 flex flex-wrap gap-3" aria-label={sections.contact}>
                    <JungleLinks actions={actions} site={CONTACT_SITE_LINKS} />
                  </nav>
                </div>
              )}
            />
          </section>
        </main>

        <footer className="relative bg-[color:var(--tp-night-deep)] py-10 text-center">
          <p className="text-sm text-[color:var(--tp-plank-light)]">
            <CopyrightLine />
          </p>
        </footer>
      </div>
    </div>
  )
}
