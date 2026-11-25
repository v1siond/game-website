'use client'

import { useMemo } from 'react'
import { Bangers } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { paletteVars } from './shared/paletteVars'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { StationContact, TopBar } from './CellShaded/chrome'
import { IntroHero } from './CellShaded/hero'
import { HatchDefs } from './CellShaded/ink'
import { CEL } from './CellShaded/palette'
import { LAYER_MOTION, SCRIM_CLASS, scenesOf, type CelScene } from './CellShaded/scenes'
import { PlaceSection } from './CellShaded/sections'
import page from './CellShaded/page.module.css'

// The world's own lettering: the root carries its --cel-face variable and the world's css reads it.
const celFace = Bangers({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--cel-face' })

const ROOT_VARS = paletteVars('cel', CEL)

// A phone frames the wasteland from higher up, so the ground stays clear of the cards (desert.tsx).
const PHONE_QUERY = '(max-width: 767.98px)'
// From lg the cards and the scene sit side by side, so there the sections take turns: cards left, then right.
const SPLIT_QUERY = '(min-width: 1024px)'

// Cell Shaded: his CV as the hunt for the vault in the looter shooter it comes from, told in the game's order
// and drawn the way it looks, a comic book in thick ink with hatching over a dusty wasteland (research notes,
// What makes it unique). The page keeps the rhythm of the Rockstar VI site: a big hero (the intro card, his
// name in sun letters, the outfit lockers where he picks a profession), then every section of the shown
// profession is one full screen stop of the hunt that rises from dark, holds while its cards scroll over it,
// and goes dark while the next one rises. From lg the stops take turns, the first right of its cards, the next
// left of them, up to the contact. He steps off the bus and our little robot leads him on; runner cars tear
// past the town gate and a bounty comes in over the voice; he blows the gully, guns down the hounds and the
// first boss, whose card freezes the frame, and catches a green gun with its stat card; through the scope he
// drops the raider with the station's part and drives off in a car built in light; the mine boss lays him
// down and a kill brings him back up, and the relic floats out of the chest; the relic shows the vault and
// its key; two pieces click in; on the salt flats the drummer drums the raiders off the deck and finds the
// chest empty; at the vault the fighter breaks its monster; at night the voice turns out to be a satellite and
// the map lights with more vaults. Damage numbers fly off every hit. Every motion is a function of the
// scene's playhead (the shared theatre), drawn with the settle: stop and it comes to rest, scroll up and it
// plays back. The text is plain HTML in the page flow over the fixed theatre of pictures, opaque from its
// first frame.
//
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

const hasSlot = (scene: CelScene): scene is CelScene & { slot: SectionSlot } => scene.slot !== null

export default function CellShadedTheme() {
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
    <div style={ROOT_VARS} className={`${page.root} ${reduced ? page.still : ''} ${celFace.variable}`}>
      <SkipLink />
      <HatchDefs />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={SCRIM_CLASS[scene.side]} />
          ))}
        </Theatre>
      )}
      <TopBar anchor={hero.anchor} />
      <main id="main-content" ref={textRef} className={page.main}>
        <IntroHero scene={hero} still={reduced} />
        <ProfessionRegion>
          {scenes.filter(hasSlot).map((scene) => (
            <PlaceSection key={scene.id} scene={scene} still={reduced} />
          ))}
        </ProfessionRegion>
        <StationContact scene={contact} still={reduced} />
      </main>
      <footer className={page.footer}>
        <p className={page.copyright}>
          <CopyrightLine />
        </p>
      </footer>
    </div>
  )
}
