'use client'

import { useMemo } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionSlot } from '@/lib/cv/sectionPlan'
import { CopyrightLine } from './shared/CopyrightLine'
import { SkipLink } from './shared/SkipLink'
import { Stage, Theatre } from './shared/theatre/Stage'
import { useTheatre } from './shared/theatre/useTheatre'
import { CallingCardContact, CaseBar } from './BoldNoir/chrome'
import { RooftopHero } from './BoldNoir/hero'
import { NOIR_VARS } from './BoldNoir/palette'
import { LAYER_MOTION, scenesOf, type NoirScene } from './BoldNoir/scenes'
import { PlaceSection } from './BoldNoir/sections'
import page from './BoldNoir/page.module.css'

// Bold Noir: his CV as one heist night in the city, cut in flat ink, paper and one loud red. The page keeps
// the rhythm of the Rockstar VI site: a big hero (the rooftop, his calling card with his name in ransom
// note cut-outs, the game's menu where he picks a profession), then every section of the shown profession
// is one full screen place of the night that rises from dark, holds while its cards scroll over it, and
// goes dark while the next one rises: the evidence board, the records room, the vault, the case room, the
// gallery, main street, the jazz club, the back alley gym, and the calling card pinned to the wall at the
// end. He is the detective in each place and does one thing per card of the section: marks a clue, pulls a
// file, cracks a safe, stamps a case closed. Every motion is a function of the scroll position (the shared
// theatre on useScrollStage), drawn with the settle: stop and it comes to rest, scroll up and it plays
// back. The text is plain HTML in the page flow over the fixed theatre of pictures, opaque from its first
// frame.
//
// Under reduced motion there is no theatre and no scrub: each section carries its own picture, still, at
// its settled frame.

const hasSlot = (scene: NoirScene): scene is NoirScene & { slot: SectionSlot } => scene.slot !== null

export default function BoldNoirTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const cv = useCVData()
  const labels = useLabels()
  const reduced = useReducedMotion()
  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, cv.professionalSummary.bio), labels, cv.professionalSummary.highlights.length, active),
    [view, cv, labels, active],
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
            <Stage key={scene.id} scene={scene} layers={scene.layers} motion={LAYER_MOTION} className={page.scrim} />
          ))}
        </Theatre>
      )}
      <CaseBar anchor={hero.anchor} />
      <main id="main-content" ref={textRef} className={page.main}>
        <RooftopHero scene={hero} still={reduced} />
        <ProfessionRegion>
          {scenes.filter(hasSlot).map((scene) => (
            <PlaceSection key={scene.id} scene={scene} still={reduced} />
          ))}
        </ProfessionRegion>
        <CallingCardContact scene={contact} still={reduced} />
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
