'use client'

import { useMemo } from 'react'
import { Special_Elite } from 'next/font/google'
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
import { IndexCardContact, CaseBar } from './BoldNoir/chrome'
import { RooftopHero } from './BoldNoir/hero'
import { NOIR_VARS } from './BoldNoir/palette'
import { LAYER_MOTION, scenesOf, type NoirScene } from './BoldNoir/scenes'
import { PlaceSection, READS_BESIDE } from './BoldNoir/sections'
import page from './BoldNoir/page.module.css'

// Bold Noir: his CV as one case of the 1947 detective game the world is drawn from, in its black and white
// mode: ink, smoke, fog and paper, with one red for what is lit. The page keeps the rhythm of the Rockstar VI
// site: a big hero (a street under the City Hall tower, his case file with his name typed on it, the menu
// where he picks a profession), then every section of the shown profession is one full screen place of the
// case that rises from dark, holds while its cards scroll over it, and gives way to the next: the crime
// scene, the call box, the interrogation room, the drive, the foot chase, the newsstand, the jazz club, the
// alley brawl, and the captain's desk where the case is closed. He is the detective, side on, and each place
// plays one to three different steps of that game's case, followed by the scroll at the scene's own pace
// and played back on the way up: the clue's cue, the kneel and the notebook; the call box; the face read
// across the table and the evidence laid down; the siren and the stop; the chase and the tackle; the
// spinning front page; the last hit of the jazz; the slip and the kick; the five stars. The layers' push in
// follows the scroll (the shared theatre on useScrollStage). The text is plain HTML in the page flow over
// the fixed theatre of pictures, opaque from its first frame.
//
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

// The world's typewriter face for what is typed on the case's paper: the main carries its --noir-type
// variable and the world's css reads it.
const noirType = Special_Elite({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--noir-type' })

// A phone sees the middle of the canvas only, so the places stage their steps nearer its middle; from lg the
// cards and the step stand side by side, the sections alternating which half each takes.
const PHONE_QUERY = '(max-width: 767.98px)'
const WIDE_QUERY = '(min-width: 1024px)'

const hasSlot = (scene: NoirScene): scene is NoirScene & { slot: SectionSlot } => scene.slot !== null

export default function BoldNoirTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const phone = useMediaQuery(PHONE_QUERY)
  const wide = useMediaQuery(WIDE_QUERY)
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active, { phone, wide }),
    [view, cv, labels, active, phone, wide],
  )
  const { theatreRef, textRef } = useTheatre(scenes, LAYER_MOTION, reduced)
  const hero = scenes[0]
  const contact = scenes[scenes.length - 1]

  return (
    <div style={NOIR_VARS} className={`${page.root} ${reduced ? page.still : ''}`}>
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef} className={page.theatre}>
          {scenes.map((scene) => (
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={READS_BESIDE[scene.side].scrim} />
          ))}
        </Theatre>
      )}
      <CaseBar anchor={hero.anchor} />
      <main id="main-content" ref={textRef} className={`${page.main} ${noirType.variable}`}>
        <RooftopHero scene={hero} still={reduced} />
        <ProfessionRegion>
          {scenes.filter(hasSlot).map((scene) => (
            <PlaceSection key={scene.id} scene={scene} still={reduced} />
          ))}
        </ProfessionRegion>
        <IndexCardContact scene={contact} still={reduced} />
      </main>
      <footer className={page.footer}>
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
        <p className={page.copyright}>
          <CopyrightLine />
        </p>
        <span className="block h-1 w-10 bg-[color:var(--noir-red)]" aria-hidden="true" />
      </footer>
    </div>
  )
}
