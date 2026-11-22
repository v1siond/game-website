'use client'

import { useCallback, useMemo, useRef } from 'react'
import { Poiret_One } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fillLabel } from '@/lib/cv/labels'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { GaugeBar, RevivalContact } from './ArtDeco/chrome'
import { StationHero } from './ArtDeco/hero'
import { DECO_VARS } from './ArtDeco/palette'
import { LAYER_MOTION, scenesOf, type DecoScene } from './ArtDeco/scenes'
import { ChamberSection } from './ArtDeco/sections'
import page from './ArtDeco/page.module.css'

// The world's own lettering: the root carries its --deco-face variable and the world's css reads it.
const decoFace = Poiret_One({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--deco-face' })

// Art Deco: his CV as a descent through the 1920s city at the bottom of the sea, in brass, gold and
// lamplight. The page keeps the rhythm of the Rockstar VI site: a big hero (the station lobby the
// bathysphere docks at, his name in gold neon and the vending machine he picks a profession at), then every
// section of the shown profession is one full screen chamber that rises from dark, holds while its cards
// scroll over it, and sinks into dark while the next chamber rises: the power station, the diary archive,
// the glass tunnel, the telekinesis hall, the pipe works, propaganda square, theatre row, the fight club, and
// the revival chamber at the end. He is the survivor with the wrench and the charged hand in each chamber
// and does one thing per card of the section: throws a bolt into a fuse box, listens to a diary, seals a
// leak, lifts a crate. Every motion is a function of the scroll position (the shared theatre on
// useScrollStage), drawn with the settle: stop and it comes to rest, scroll up and it plays back. The text
// is plain HTML in the page flow over the fixed theatre of pictures, opaque from its first frame; the gauge
// bar names the chamber and counts his deeds.
//
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

const hasSlot = (scene: DecoScene): scene is DecoScene & { slot: SectionSlot } => scene.slot !== null

export default function ArtDecoTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active),
    [view, cv, labels, active],
  )
  const placeRef = useRef<HTMLSpanElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  // The gauge bar follows the chamber the page is in: its place and, where it counts, how many of its cards are read.
  const lead = useCallback(
    (id: string, reached: number) => {
      const scene = scenes.find((each) => each.id === id)
      if (!scene) return
      if (placeRef.current) placeRef.current.textContent = labels.deco[scene.place]
      if (countRef.current) countRef.current.textContent = scene.tally ? fillLabel(labels.deco[scene.tally], { count: reached, total: scene.count }) : ''
    },
    [scenes, labels],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced, lead)
  const hero = scenes[0]
  const contact = scenes[scenes.length - 1]

  return (
    <div style={DECO_VARS} className={`${page.root} ${reduced ? page.still : ''} ${decoFace.variable}`}>
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={page.scrim} />
          ))}
        </Theatre>
      )}
      <GaugeBar placeRef={placeRef} countRef={countRef} anchor={hero.anchor} />
      <main id="main-content" ref={textRef} className={page.main}>
        <StationHero scene={hero} still={reduced} />
        <ProfessionRegion>
          {scenes.filter(hasSlot).map((scene) => (
            <ChamberSection key={scene.id} scene={scene} still={reduced} />
          ))}
        </ProfessionRegion>
        <RevivalContact scene={contact} still={reduced} />
      </main>
      <footer className={page.footer}>
        <p className={page.copyright}>
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
