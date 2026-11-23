'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { VentureList } from '@/components/cv/VentureList'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { MASONRY_ITEM, MASONRY_COLUMN_LIST } from '@/lib/cv/masonry'
import { drumsSince } from '@/lib/cv/sectionText'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { BandCard, CompanyCard, ExperienceCard, ItemBag, ProjectCard, SAID_LINES } from './cards'
import { BODY, Box, Mark, SectionHeader } from './panels'
import { MONO, PIXEL } from './palette'
import type { Scene } from './scenes'
import { RpgStage } from './stage'

// One section per scene: a tall head that first shows the place alone and then brings the title up on
// its black plate, then the cards (the genre's hard white bordered windows), then a screen of the place
// alone before it sinks. The cards a scene counts sit in an element marked data-stage-items, which the
// shared theatre measures for the reading line that plays each card's beat.

// The About window's stats, each label in the gold the windows name things in.
const STAT_LINES: AboutFactsLook = {
  list: 'mt-4 max-w-prose space-y-1',
  fact: 'flex flex-wrap gap-x-2',
  term: `text-sm uppercase text-[color:var(--rpg-gold)] ${MONO}`,
  value: BODY,
}

const STAT = 'border-2 border-[color:var(--rpg-border-shade)] bg-[color:var(--rpg-window-low)] p-3'

function AboutCards({ slot }: { slot: SlotOf<'about'> }) {
  const { cards } = useLabels()
  const { highlights } = useAboutBlock()
  return (
    <Box>
      <p className={`max-w-prose whitespace-pre-line ${BODY}`}>{slot.bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...SAID_LINES, list: 'mt-4 max-w-prose space-y-2' }} />
      </div>
      <AboutFacts look={STAT_LINES} />
    </Box>
  )
}

// A job window holds the villager's portrait beside its title, so the jobs take the column one under another.
function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return (
    <ul className="space-y-6" data-stage-items="">
      {slot.jobs.map((entry) => (
        <li key={entry.id}>
          <ExperienceCard entry={entry} />
        </li>
      ))}
    </ul>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  // the shared tech list's masonry, held to two columns in the screen column
  return (
    <Box>
      <div data-stage-items="" className="xl:[&>ul]:columns-2">
        <ItemBag categories={slot.categories} />
      </div>
    </Box>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <Box>
      <ul className={MASONRY_COLUMN_LIST} data-stage-items="">
        {slot.services.map((service) => (
          <li key={service.id} className={MASONRY_ITEM}>
            <h3 className={`mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}>
              <Mark />
              {service.title}
            </h3>
            <p className={BODY}>{service.line}</p>
          </li>
        ))}
      </ul>
    </Box>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={slot.projects} className={MASONRY_COLUMN_LIST} itemClassName={MASONRY_ITEM} renderProject={(project) => <ProjectCard {...project} />} />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return (
    <div data-stage-items="">
      <VentureList
        companies={slot.companies}
        className="grid gap-6 md:grid-cols-6"
        itemClassName="md:col-span-3"
        featuredItemClassName="md:col-span-6"
        renderVenture={(venture) => <CompanyCard {...venture} />}
      />
    </div>
  )
}

function BandCards({ slot: { musician, bands } }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <>
      <p className={`mb-6 inline-block bg-[color:var(--rpg-void)] px-3 py-1 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}>
        {drumsSince(musician, years)}
      </p>
      <div data-stage-items="">
        <BandList bands={bands} className={MASONRY_COLUMN_LIST} itemClassName={MASONRY_ITEM} renderBand={(band) => <BandCard {...band} />} />
      </div>
      <p className={`mt-4 bg-[color:var(--rpg-void)] px-3 py-2 text-center ${BODY}`}>{musician.line}</p>
    </>
  )
}

function RecordCards({ slot: { martialArts } }: { slot: SlotOf<'muayThai'> }) {
  return (
    <Box>
      <h3 className={`mb-4 flex items-start gap-2 text-sm uppercase tracking-wide text-[color:var(--rpg-gold)] sm:text-base ${PIXEL}`}>
        <Mark className="" />
        {martialArts.primary.title}
      </h3>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-6 grid gap-3 sm:grid-cols-2',
            fact: STAT,
            term: `text-sm uppercase tracking-widest text-[color:var(--rpg-gold)] ${PIXEL}`,
            value: `mt-2 ${BODY} text-[color:var(--rpg-text)]`,
            achievements: 'space-y-3',
            achievement: BODY,
          }}
          renderAchievement={(achievement) => (
            <span className="flex items-start gap-2 text-[color:var(--rpg-green)]">
              <Mark />
              {achievement}
            </span>
          )}
        />
      </div>
    </Box>
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
  const label = sections[slot.titleKey]
  const title = slot.id === 'projects' ? sections.featuredWork : label
  return (
    <section data-scene={scene.id} aria-label={label} className="relative px-4 pb-[60svh] motion-reduce:pb-16 sm:px-6 lg:px-[6vw]">
      {still && <RpgStage scene={scene} settled />}
      <header className="relative flex min-h-[90svh] items-end pb-4 motion-reduce:min-h-[70svh]">
        <SectionHeader title={title} />
      </header>
      <div className="relative max-w-[42rem]">
        <Cards slot={slot} />
      </div>
    </section>
  )
}
