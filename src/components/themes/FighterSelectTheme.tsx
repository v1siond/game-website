'use client'

import { useMemo, type ComponentType } from 'react'
import { Alfa_Slab_One } from 'next/font/google'
import { useProfession } from '@/contexts/ProfessionContext'
import { useCVData, useLabels, useWorldView } from '@/components/cv/CVDataProvider'
import { useAboutBlock } from '@/components/cv/AboutFacts'
import { ProfessionRegion } from '@/components/cv/ProfessionRegion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sectionPlan, type SectionId, type SectionSlot } from '@/lib/cv/sectionPlan'
import type { Profession } from '@/lib/cv/professions'
import type { Labels } from '@/lib/cv/labels'
import { SkipLink } from '@/components/themes/shared/SkipLink'
import { Theatre } from '@/components/themes/shared/theatre/Stage'
import { useTheatre } from '@/components/themes/shared/theatre/useTheatre'
import { FS_VARS } from './FighterSelect/palette'
import { ArcadePanel, type Accent } from './FighterSelect/frames'
import { HeroSplash } from './FighterSelect/versus'
import { SelectScreen } from './FighterSelect/selector'
import { ChallengerScene } from './FighterSelect/challenger'
import { ControlPanel } from './FighterSelect/footer'
import { CARDS } from './FighterSelect/sections'
import { TOUR_MOTION, TourStage, scenesOf, type TourScene } from './FighterSelect/theatre'
import look from './FighterSelect/world.module.css'

// The world's slab lettering for the round calls: the root carries its --fs-face variable and the
// world's css reads it.
const fsFace = Alfa_Slab_One({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--fs-face',
})

// Fighter Select, an early 90s arcade fighting game's select screen and its matches: the page composition. The
// hero is the versus splash (./FighterSelect/versus) and the select grid with the player one cursor
// (./selector) on the castle rooftop. Then each section is a full screen stage of the arcade tour that rises
// from the dark, holds while its arcade screen scrolls over it and sinks as the next rises (the shared
// theatre on the scroll stage engine), and on it he fights the section's bout, one beat per card
// (./FighterSelect/theatre). Contact is the win quote over the temple ring (./challenger). Under reduced
// motion every section carries its own stage, still at its settled frame.
//
// The page stands on the select screen's deep blue under CRT scanlines. The root carries the palette as
// --fs-* variables (the one inline style, variables only) and clips sideways overflow with overflow-x:
// clip, not hidden: hidden would make the root a scroll container and stop the sticky map from sticking.

// Each section's arcade screen: its accent and its heading's id.
const SCREENS: Record<SectionId, { accent: Accent; id: string }> = {
  about: { accent: 'cyan', id: 'about-heading' },
  work: { accent: 'p1', id: 'experience-heading' },
  tech: { accent: 'cyan', id: 'tech-stack-heading' },
  services: { accent: 'p1', id: 'services-heading' },
  projects: { accent: 'gold', id: 'projects-heading' },
  ventures: { accent: 'cyan', id: 'ventures-heading' },
  bands: { accent: 'p2', id: 'bands-heading' },
  muayThai: { accent: 'p2', id: 'muay-thai-heading' },
}

// The column a screen reads in: beside the stage from lg, the fighters on its right; below lg the whole width,
// the stage showing in the screens of picture alone above and below it.
const COLUMN = 'mx-auto max-w-6xl lg:mx-0 lg:w-[min(46rem,52vw)]'
const SIDE = 'px-4 sm:px-6 lg:pl-[clamp(1.5rem,4vw,4rem)]'

interface SectionProps {
  scene: TourScene & { slot: SectionSlot }
  profession: Profession
  labels: Labels
  still: boolean
}

/** One section: a screen of its stage alone, then its arcade screen over the held stage, then the stage again. */
function TourSection({ scene, profession, labels, still }: SectionProps) {
  const Cards = CARDS[scene.slot.id] as ComponentType<{ slot: SectionSlot }>
  const { accent, id } = SCREENS[scene.slot.id]
  return (
    <div data-scene={scene.id} className={`relative pb-[70svh] ${SIDE}`}>
      {still && <TourStage scene={scene} profession={profession} labels={labels} settled />}
      <div className="min-h-[100svh]" />
      <div className={COLUMN}>
        <ArcadePanel accent={accent} title={labels.sections[scene.slot.titleKey]} id={id}>
          <Cards slot={scene.slot} />
        </ArcadePanel>
      </div>
    </div>
  )
}

export default function FighterSelectTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const labels = useLabels()
  const { professionalSummary } = useCVData()
  const { highlights } = useAboutBlock()
  const reduced = useReducedMotion()

  const scenes = useMemo(
    () => scenesOf(sectionPlan(view.sections, professionalSummary.bio), labels, highlights, active),
    [view.sections, professionalSummary.bio, labels, highlights, active],
  )
  const { theatreRef, textRef } = useTheatre(scenes, TOUR_MOTION, reduced)
  const gates = scenes.filter((scene): scene is TourScene & { slot: SectionSlot } => scene.slot !== null)
  const contact = scenes[scenes.length - 1]

  return (
    <div className={`relative min-h-screen overflow-x-clip ${look.root} ${fsFace.variable}`} style={FS_VARS}>
      <SkipLink />
      {!reduced && (
        <Theatre theatreRef={theatreRef}>
          {scenes.map((scene) => (
            <TourStage key={scene.id} scene={scene} profession={active} labels={labels} />
          ))}
        </Theatre>
      )}
      <div className={`pointer-events-none fixed inset-0 z-0 ${look.scanlines}`} aria-hidden="true" />

      <div ref={textRef} className="relative z-10">
        <header className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {reduced && <TourStage scene={scenes[0]} profession={active} labels={labels} settled />}
          <HeroSplash profession={active} />
        </header>

        <main id="main-content">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ArcadePanel accent="cyan">
              <SelectScreen active={active} title={labels.professions[active]} />
            </ArcadePanel>
          </div>

          <ProfessionRegion>
            {gates.map((scene) => (
              <TourSection key={scene.id} scene={scene} profession={active} labels={labels} still={reduced} />
            ))}
          </ProfessionRegion>

          <div data-scene="contact" className="relative pb-[30svh] pt-[60svh]">
            {reduced && <TourStage scene={contact} profession={active} labels={labels} settled />}
            <ChallengerScene profession={active} />
          </div>
        </main>

        <ControlPanel />
      </div>
    </div>
  )
}
