'use client'

import { useMemo } from 'react'
import { Poiret_One } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { GaugeBar, RevivalContact } from './ArtDeco/chrome'
import { StationHero } from './ArtDeco/hero'
import { DECO_VARS } from './ArtDeco/palette'
import { LAYER_MOTION, SIDE_CLASS, scenesOf, type DecoScene } from './ArtDeco/scenes'
import { ChamberSection } from './ArtDeco/sections'
import page from './ArtDeco/page.module.css'

// The world's own lettering: the root carries its --deco-face variable and the world's css reads it.
const decoFace = Poiret_One({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--deco-face' })

// Art Deco: his CV as one descent and return, the story of the undersea deco shooter the world is drawn
// from, in brass, gold and lamplight. The page keeps the rhythm of the Rockstar VI site: a big hero (the crash
// at sea and the lone tower, his name in gold neon and the vending machine he picks a profession at), then
// every section of the shown profession is one full screen room of the drowned city that rises from dark,
// holds while its cards scroll over it, and sinks into dark while the next room rises, in the game's order:
// the sphere's descent, the flooded reception hall, the clinic corridor, the machine gallery, the vaulted
// gallery, the greenhouse, the ballroom, the pump hall, and the way back up into morning at the end. He is a
// passenger in his own shirt, and each room plays one to three different actions of its beat on the shared
// scene player, at its own pace however the page is scrolled, then holds the end frame. The layers' push in
// still follows the scroll (the shared theatre on useScrollStage). The text is plain HTML in the page flow
// over the fixed theatre of pictures, opaque from its first frame.
//
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

// A phone sees the middle of the canvas only, so the chambers stage their fights nearer its middle.
const PHONE_QUERY = '(max-width: 767.98px)'
// From lg the cards and the chamber sit side by side, so there the sections take turns: cards left, then right.
const SPLIT_QUERY = '(min-width: 1024px)'

const hasSlot = (scene: DecoScene): scene is DecoScene & { slot: SectionSlot } => scene.slot !== null

export default function ArtDecoTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const split = useMediaQuery(SPLIT_QUERY)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active, phone, split),
    [view, cv, labels, active, phone, split],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced)
  const hero = scenes[0]
  const contact = scenes[scenes.length - 1]

  return (
    <div style={DECO_VARS} className={`${page.root} ${reduced ? page.still : ''} ${decoFace.variable}`}>
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={`${page.scrim} ${SIDE_CLASS[scene.side]}`} />
          ))}
        </Theatre>
      )}
      <GaugeBar anchor={hero.anchor} />
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
