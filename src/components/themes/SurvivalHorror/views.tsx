'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { MarkedLines } from '@/components/cv/MarkedLines'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { PANEL_HEADING, sectionHeadingId } from './panels'
import { MARK_LIST, ServiceNotes, TechCloud } from './cards'
import { JobFiles } from './files'
import { ProjectItems } from './items'
import { VentureBoard } from './board'
import { BandPapers } from './bands'
import { FightRecord } from './record'
import type { Scene } from './scenes'
import { SurvivorStage } from './stage'
import look from './world.module.css'

// One section per scene: a screen of the room alone first, then its paper panel in the text column (on
// the left from lg, the room playing on the right), then a stretch of the room alone before the next. The
// scene plays as the section scrolls in, while its room is still alone on the screen (./scenes). The cards
// sit in an element marked data-stage-items, which the shared theatre counts for its settled frame. Every field comes from the shared lists and the card view
// models.

// His education and languages typed under the bio on the same paper, each label in brass.
const PAPER_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-2',
  fact: '',
  term: 'text-sm uppercase text-[color:var(--sh-brass-text)]',
  value: 'text-sm text-[color:var(--sh-cream)]',
}

function AboutCards({ slot }: { slot: SlotOf<'about'> }) {
  const { cards } = useLabels()
  const { highlights } = useAboutBlock()
  return (
    <>
      <p className="max-w-prose whitespace-pre-line text-base leading-relaxed text-[color:var(--sh-cream)]">{slot.bio}</p>
      <div data-stage-items="">
        <AboutFacts look={PAPER_FACTS} />
        <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...MARK_LIST, list: 'mt-4 space-y-1' }} />
      </div>
    </>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  return (
    <div data-stage-items="">
      <TechCloud categories={slot.categories} />
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <div data-stage-items="">
      <ServiceNotes services={slot.services} />
    </div>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return <JobFiles jobs={slot.jobs} />
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return <ProjectItems projects={slot.projects} />
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return <VentureBoard companies={slot.companies} />
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  return <BandPapers musician={slot.musician} bands={slot.bands} />
}

function RecordCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  return <FightRecord martialArts={slot.martialArts} />
}

const CARDS: { [Id in SectionId]: (props: { slot: SlotOf<Id> }) => ReactNode } = {
  about: AboutCards,
  work: WorkCards,
  tech: TechCards,
  services: ServiceCards,
  projects: ProjectCards,
  ventures: VentureCards,
  bands: BandCards,
  muayThai: RecordCards,
}

/** One scene of the page; under reduced motion its own stage sits still above its panel. */
export function SceneSection({ scene, slot, still }: { scene: Scene; slot: SectionSlot; still: boolean }) {
  const { sections } = useLabels()
  const Cards = CARDS[slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const title = sections[slot.titleKey]
  const id = sectionHeadingId(title)
  return (
    <section data-scene={scene.id} aria-labelledby={id} className="relative px-4 pb-[60svh] motion-reduce:pb-16 sm:px-6 lg:px-[4vw]">
      {still && <SurvivorStage scene={scene} settled />}
      <div className="min-h-[80svh] motion-reduce:min-h-[70svh]" aria-hidden="true" />
      <div className={`relative p-4 sm:p-6 lg:w-[min(42rem,46vw)] ${look.panel}`}>
        <h2 id={id} className={PANEL_HEADING}>
          {title}
        </h2>
        <Cards slot={slot} />
      </div>
    </section>
  )
}
