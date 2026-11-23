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
import { BossCard, Branch, LootCard, MakersPlate, Notice, ORANGE_POINTS, ServicePaper } from './cards'
import { LAYER_MOTION, type CelScene } from './scenes'
import cel from './cel.module.css'
import page from './page.module.css'

// One section per place of the desert's day: a tall head that first shows the place alone and then brings
// up the section's title on its ink slab, then the cards, then a screen of the place alone before it goes
// dark. The cards a place counts sit inside an element marked data-stage-items, which the theatre measures
// for the reading line that sets his act. Every field comes from the shared lists and the card view models.

const STACK = 'flex flex-col gap-6'

// His education and languages under the highlights, each label in the inked capitals.
const INKED_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-1',
  fact: 'text-base',
  term: 'inline font-bold uppercase tracking-wider',
  value: 'inline',
  termEnd: ': ',
}

function AboutCards() {
  const { bio, highlights } = useAboutBlock()
  const { cards } = useLabels()
  return (
    <div className={`p-5 sm:p-6 ${cel.paper}`}>
      <p className="text-base leading-relaxed">{bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={ORANGE_POINTS} />
      </div>
      <AboutFacts look={INKED_FACTS} />
    </div>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return (
    <ul className={`${STACK} p-4 sm:p-6 ${cel.board}`} data-stage-items="">
      {slot.jobs.map((job) => (
        <li key={job.id} className="pt-3">
          <Notice job={job} />
        </li>
      ))}
    </ul>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  const { cards } = useLabels()
  return (
    <ul className={STACK} data-stage-items="" aria-label={cards.techByCategory}>
      {slot.categories.map((category) => (
        <li key={category.id}>
          <Branch category={category} />
        </li>
      ))}
    </ul>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.services.map((service) => (
        <li key={service.id}>
          <ServicePaper service={service} />
        </li>
      ))}
    </ul>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={slot.projects} className={STACK} itemClassName="" renderProject={(project) => <LootCard slot={project} />} />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.companies.map((company, index) => (
        <li key={company.id}>
          <MakersPlate company={company} index={index} />
        </li>
      ))}
    </ul>
  )
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <>
      <div className={`p-5 ${cel.darkPaper}`}>
        <p className={`text-2xl text-[var(--cel-sun)] ${cel.display} [-webkit-text-stroke:0]`}>{drumsSince(slot.musician, years)}</p>
        {slot.musician.line && <p className="mt-2 text-base font-bold">{slot.musician.line}</p>}
      </div>
      <div data-stage-items="">
        <BandList bands={slot.bands} className={STACK} itemClassName="" renderBand={(band) => <BossCard slot={band} />} />
      </div>
    </>
  )
}

function MuayThaiCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  const { martialArts } = slot
  return (
    <div className={`p-5 sm:p-6 ${cel.paper}`}>
      <h3 className={`mb-4 text-2xl ${cel.display} [-webkit-text-stroke:0]`}>{martialArts.primary.title}</h3>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-5 grid gap-3',
            fact: 'border-[3px] border-[var(--cel-ink)] bg-[var(--cel-white)] p-3',
            term: 'text-sm font-black uppercase tracking-wider',
            value: 'mt-1 text-base',
            achievements: 'space-y-3',
            achievement: 'text-base font-bold',
          }}
          renderAchievement={(achievement) => (
            <span className="flex items-start gap-3">
              <span className="mt-0.5 inline-block h-5 w-5 shrink-0 bg-[var(--cel-crit)] [clip-path:polygon(50%_0,62%_35%,100%_38%,70%_60%,80%_100%,50%_76%,20%_100%,30%_60%,0_38%,38%_35%)]" aria-hidden="true" />
              <span>{achievement}</span>
            </span>
          )}
        />
      </div>
    </div>
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

/** A section's title on its ink slab, cut on a slant. */
export function SectionTitle({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className={`text-3xl sm:text-4xl ${cel.display}`}>
      <span className={cel.titleSlab}>
        <span>{title}</span>
      </span>
    </h2>
  )
}

/** One place: under reduced motion its own stage sits still behind its head. */
export function PlaceSection({ scene, still }: { scene: CelScene & { slot: SectionSlot }; still: boolean }) {
  const { sections } = useLabels()
  const Cards = CARDS[scene.slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const headingId = `cel-${scene.id}`
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby={headingId} className={page.level}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <header className={page.head}>
        <SectionTitle id={headingId} title={sections[scene.slot.titleKey]} />
      </header>
      <div className={page.body}>
        <Cards slot={scene.slot} />
      </div>
    </section>
  )
}
