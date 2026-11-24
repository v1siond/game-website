'use client'

import type { ReactNode } from 'react'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { BandList } from '@/components/cv/BandList'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { ProjectList } from '@/components/cv/ProjectList'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { drumsSince } from '@/lib/cv/sectionText'
import { Stage } from '../shared/theatre/Stage'
import { InkStamp } from './backdrop'
import { BULLETS, BandPanel, CaseFile, CompanyTag, RankCard, ServiceSlab, TechSlab, crookOf } from './cards'
import { LAYER_MOTION, type NoirScene } from './scenes'
import page from './page.module.css'

// One section per place of the night: a tall head that first shows the place alone and then brings up the
// section's title on the red panel, then the cards on crooked slabs, then a screen of the
// place alone before it goes dark. The cards a place counts sit inside an element marked data-stage-items,
// which the theatre measures for the reading line that sets his act. Every field comes from the shared
// lists and the card view models.

const STACK = 'flex flex-col gap-8'

// The facts under the statement, each label in the red capitals.
const STATEMENT_FACTS: AboutFactsLook = {
  list: 'mt-4 max-w-prose space-y-1',
  fact: `text-sm ${page.copy}`,
  term: 'inline font-bold uppercase tracking-wider text-[color:var(--noir-red-plate)]',
  value: 'inline',
  termEnd: ': ',
}

function AboutCards() {
  const { bio, highlights } = useAboutBlock()
  const { cards } = useLabels()
  return (
    <div className={`px-6 pb-14 pt-8 sm:px-8 ${page.speech}`}>
      <p className={`whitespace-pre-line text-base leading-relaxed ${page.copy}`}>{bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...BULLETS, list: 'mt-4 space-y-1.5', line: `flex items-start gap-2 text-sm ${page.copy}` }} />
      </div>
      <AboutFacts look={STATEMENT_FACTS} />
    </div>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.jobs.map((entry, index) => (
        <li key={entry.id}>
          <RankCard entry={entry} index={index} />
        </li>
      ))}
    </ul>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  const { cards } = useLabels()
  return (
    <ul className={STACK} data-stage-items="" aria-label={cards.techByCategory}>
      {slot.categories.map((category, index) => (
        <li key={category.id}>
          <TechSlab category={category} index={index} />
        </li>
      ))}
    </ul>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.services.map((service, index) => (
        <li key={service.id}>
          <ServiceSlab service={service} index={index} />
        </li>
      ))}
    </ul>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={slot.projects} className={STACK} itemClassName="" renderProject={(project, index) => <CaseFile slot={project} index={index} />} />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.companies.map((company, index) => (
        <li key={company.id}>
          <CompanyTag company={company} index={index} />
        </li>
      ))}
    </ul>
  )
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <>
      <p className={`${page.ticket} ${page.copy}`}>{drumsSince(slot.musician, years)}</p>
      <div data-stage-items="">
        <BandList bands={slot.bands} className={STACK} itemClassName="" renderBand={(panel, index) => <BandPanel slot={panel} index={index} />} />
      </div>
      {slot.musician.line && <p className={`${page.ticket} italic ${page.copy}`}>{slot.musician.line}</p>}
    </>
  )
}

function MuayThaiCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  return (
    <>
      <h3 className={`${page.ticket} text-3xl tracking-wide`}>{slot.martialArts.primary.title}</h3>
      <div data-stage-items="" className={STACK}>
        <MuayThaiRecord
          martialArts={slot.martialArts}
          classNames={{
            facts: `grid gap-4 p-5 ${page.slab} ${page.copy}`,
            fact: 'border-b border-[color:var(--noir-smoke)] pb-2 last:border-b-0',
            term: 'text-sm font-bold uppercase tracking-widest text-[color:var(--noir-fog)]',
            value: 'mt-1 text-sm text-[color:var(--noir-paper)]',
            achievements: `space-y-4 ${page.copy}`,
            achievement: 'text-base text-[color:var(--noir-paper)]',
          }}
          renderAchievement={(achievement, index) => (
            <span className="flex items-center gap-4">
              <span className="block h-12 w-12 flex-shrink-0" aria-hidden="true">
                <InkStamp className="h-full w-full" />
              </span>
              <span className={`block flex-1 px-4 py-3 ${page.slab}`} style={crookOf(index)}>
                {achievement}
              </span>
            </span>
          )}
        />
      </div>
    </>
  )
}

const CARDS: { [Id in SectionId]: (props: { slot: SlotOf<Id> }) => ReactNode } = {
  about: AboutCards,
  work: WorkCards,
  tech: TechCards,
  services: ServiceCards,
  projects: ProjectCards,
  ventures: VentureCards,
  bands: BandCards,
  muayThai: MuayThaiCards,
}

/** A section's head: its title on the red panel. */
export function SceneHead({ id, title }: { id: string; title: string }) {
  return (
    <header className={page.head}>
      <h2 id={id} className={`inline-block px-5 py-2 text-3xl uppercase tracking-widest sm:text-4xl ${page.heading}`}>
        {title}
      </h2>
    </header>
  )
}

/** One place: under reduced motion its own stage sits still behind its head. */
export function PlaceSection({ scene, still }: { scene: NoirScene & { slot: SectionSlot }; still: boolean }) {
  const { sections } = useLabels()
  const Cards = CARDS[scene.slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const headingId = `noir-${scene.id}`
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby={headingId} className={page.level}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <SceneHead id={headingId} title={sections[scene.slot.titleKey]} />
      <div className={page.body}>
        <Cards slot={scene.slot} />
      </div>
    </section>
  )
}
