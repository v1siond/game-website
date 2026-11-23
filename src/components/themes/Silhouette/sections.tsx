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
import { BandPlate, CARD_BODY, CARD_META, DASH_LIST, JobSlab, ProjectSlab, ServiceSlab, Slab, TechCrate, VentureSign } from './cards'
import { TYPEWRITER } from './palette'
import { LAYER_MOTION, type ShadeScene } from './scenes'
import page from './page.module.css'

// One section per place of the forest: a tall head that first shows the place alone and then brings up
// the section's title on its black plate, then the cards, then a screen of the place alone before it goes
// dark. The cards a place counts sit inside an element marked data-stage-items, which the theatre measures
// for the reading line that sets his act. Every field comes from the shared lists and the card view models.

const STACK = 'flex flex-col gap-6'

// His education and languages under the highlights, each label in the meta type.
const SLAB_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-2',
  fact: '',
  term: `uppercase ${CARD_META}`,
  value: CARD_BODY,
}

function AboutCards() {
  const { bio, highlights } = useAboutBlock()
  const { cards } = useLabels()
  return (
    <Slab>
      <p className="text-sm leading-relaxed text-[color:var(--sh-text)]">{bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={DASH_LIST} />
      </div>
      <AboutFacts look={SLAB_FACTS} />
    </Slab>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.jobs.map((job) => (
        <li key={job.id}>
          <JobSlab entry={job} />
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
          <TechCrate category={category} />
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
          <ServiceSlab service={service} />
        </li>
      ))}
    </ul>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={slot.projects} className={STACK} itemClassName="" renderProject={(project) => <ProjectSlab slot={project} />} />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.companies.map((company) => (
        <li key={company.id}>
          <VentureSign company={company} />
        </li>
      ))}
    </ul>
  )
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <>
      <Slab>
        <p className="text-sm tracking-wider text-[color:var(--sh-text)]">{drumsSince(slot.musician, years)}</p>
        {slot.musician.line && <p className="mt-2 text-sm italic text-[color:var(--sh-muted-text)]">{slot.musician.line}</p>}
      </Slab>
      <div data-stage-items="">
        <BandList bands={slot.bands} className={STACK} itemClassName="" renderBand={(band) => <BandPlate slot={band} />} />
      </div>
    </>
  )
}

function MuayThaiCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  const { martialArts } = slot
  return (
    <Slab>
      <h3 className={`mb-4 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-heading)] ${TYPEWRITER}`}>{martialArts.primary.title}</h3>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-4 grid gap-3',
            fact: 'border-l-2 border-[color:var(--sh-black)] bg-[color:var(--sh-panel)] p-3',
            term: 'text-sm uppercase tracking-[0.25em] text-[color:var(--sh-dim-text)]',
            value: 'mt-1 text-sm text-[color:var(--sh-text)]',
            achievements: 'space-y-2',
            achievement: 'text-sm text-[color:var(--sh-muted-text)]',
          }}
          renderAchievement={(achievement) => (
            <span className="flex items-start gap-1.5 border-l-2 border-[color:var(--sh-rim)] bg-[color:var(--sh-night)] p-2">
              <span className="text-[color:var(--sh-dim-text)]" aria-hidden="true">
                -
              </span>
              {achievement}
            </span>
          )}
        />
      </div>
    </Slab>
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

/** A section's title as a silent film intertitle on its black plate, ruled above and below. */
export function SectionTitle({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className={`${page.titlePlate} text-base uppercase tracking-[0.4em] text-[color:var(--sh-heading)] sm:text-xl ${TYPEWRITER}`}>
      {title}
    </h2>
  )
}

/** One place: under reduced motion its own stage sits still behind its head. */
export function PlaceSection({ scene, still }: { scene: ShadeScene & { slot: SectionSlot }; still: boolean }) {
  const { sections } = useLabels()
  const Cards = CARDS[scene.slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const headingId = `sh-${scene.id}`
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby={headingId} className={page.level}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled />}
      <header className={page.head}>
        <SectionTitle id={headingId} title={sections[scene.slot.titleKey]} />
      </header>
      <div className={page.body}>
        <Cards slot={scene.slot} />
      </div>
    </section>
  )
}
