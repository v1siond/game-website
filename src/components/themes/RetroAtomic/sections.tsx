'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { MarkedLines } from '@/components/cv/MarkedLines'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { drumsSince } from '@/lib/cv/sectionText'
import { MASONRY_ITEM, MASONRY_COLUMN_LIST } from '@/lib/cv/masonry'
import { atomicId } from './anchors'
import { QuestLog } from './quests'
import { Tapes, Inventory } from './inventory'
import { TargetingSystem } from './targeting'
import { Radio } from './radio'
import { BadgeChart } from './badges'
import { PLUS_ROWS } from './controls'
import type { Scene } from './scenes'
import { AtomicStage } from './stage'
import atomic from './atomic.module.css'

// One section per scene: a tall head that first shows the place alone and then brings the title up on its
// glass plate, then the cards (the terminal's glass panels, the radio, the printed badge chart), then a
// screen of the place alone before it sinks. The cards a scene counts sit in an element marked
// data-stage-items, which the shared theatre measures for the reading line that drives each prop. Every
// heading's id is atomicId of its title, the one the wrist terminal's section tabs jump to.

// The title sits on its own glass plate: the wasteland's pale haze shows behind it, and phosphor on that
// haze reads under 2 to 1.
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={atomicId(title)} className={`flex w-fit max-w-full items-center gap-3 bg-atomic-glass px-3 py-1 text-2xl font-bold uppercase tracking-[0.2em] text-atomic-phosphor sm:text-3xl ${atomic.glow}`}>
      <span className="h-3 w-3 shrink-0 bg-atomic-phosphor" aria-hidden="true" />
      {title}
    </h2>
  )
}

// The terminal's personnel record, each label in the dim phosphor capitals.
const TERMINAL_FACTS: AboutFactsLook = {
  list: 'mt-4 max-w-prose space-y-1 border-t border-atomic-phosphor/30 pt-3 text-sm',
  fact: 'flex flex-wrap gap-x-2',
  term: 'font-bold uppercase tracking-widest text-atomic-phosphor-dim-text',
  value: 'text-atomic-ash',
}

function AboutCards({ slot }: { slot: SlotOf<'about'> }) {
  const { cards } = useLabels()
  const { highlights } = useAboutBlock()
  return (
    <div className={`p-5 sm:p-6 ${atomic.panel}`}>
      <p className="max-w-prose whitespace-pre-line text-base leading-relaxed text-atomic-phosphor">{slot.bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...PLUS_ROWS, list: 'mt-4 max-w-prose space-y-1 border-t border-atomic-phosphor/30 pt-3' }} />
      </div>
      <AboutFacts look={TERMINAL_FACTS} />
    </div>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return (
    <div data-stage-items="">
      <QuestLog jobs={slot.jobs} />
    </div>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  return (
    <div data-stage-items="">
      <Inventory categories={slot.categories} />
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <ul className={MASONRY_COLUMN_LIST} data-stage-items="">
      {slot.services.map((service) => (
        <li key={service.id} className={`${MASONRY_ITEM} p-5 sm:p-6 ${atomic.panel}`}>
          <h3 className="text-lg font-bold uppercase tracking-wider text-atomic-phosphor">{service.title}</h3>
          <p className="mt-2 text-base leading-relaxed text-atomic-phosphor">{service.line}</p>
        </li>
      ))}
    </ul>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return <TargetingSystem projects={slot.projects} />
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return (
    <div data-stage-items="">
      <Tapes companies={slot.companies} />
    </div>
  )
}

function BandCards({ slot: { musician, bands } }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <div className={`p-4 sm:p-6 ${atomic.panel}`}>
      <p className="mb-6 text-base text-atomic-yellow">{drumsSince(musician, years)}</p>
      <Radio bands={bands} />
      <p className="mt-6 text-base italic text-atomic-phosphor-dim-text">{musician.line}</p>
    </div>
  )
}

function RecordCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  return <BadgeChart martialArts={slot.martialArts} />
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

interface SceneSectionProps {
  scene: Scene
  slot: SectionSlot
  still: boolean
}

/** One scene of the page; under reduced motion its own stage sits still behind its head. */
export function SceneSection({ scene, slot, still }: SceneSectionProps) {
  const { sections } = useLabels()
  const Cards = CARDS[slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const title = sections[slot.titleKey]
  return (
    <section data-scene={scene.id} aria-labelledby={atomicId(title)} className="relative scroll-mt-24 px-4 pb-[60svh] motion-reduce:pb-16 sm:px-6 lg:px-[6vw]">
      {still && <AtomicStage scene={scene} settled />}
      <header className="flex min-h-[90svh] items-end pb-10 motion-reduce:min-h-[70svh]">
        <SectionTitle title={title} />
      </header>
      <div className="relative max-w-[42rem]">
        <Cards slot={slot} />
      </div>
    </section>
  )
}
