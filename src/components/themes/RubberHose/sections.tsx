'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { BandList } from '@/components/cv/BandList'
import { ProjectList } from '@/components/cv/ProjectList'
import { VentureList } from '@/components/cv/VentureList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { MASONRY_ITEM, MASONRY_COLUMN_LIST } from '@/lib/cv/masonry'
import { drumsSince, headingId } from '@/lib/cv/sectionText'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { CurlBanner } from './art'
import { BandRecord, CompanyPoster, ExperienceCard, STAR_LINES, TechBubbleCloud, VintagePoster } from './cards'
import type { Scene } from './scenes'
import { HoseStage } from './stage'
import world from './world.module.css'

// One section per stage of the fight: a tall head that first shows the fight alone and then brings the title
// up on its curled banner, then the cards (the title cards and posters under one ink line), then a screen
// of the fight alone. From lg the head and the cards keep to the left 40%, so the fight plays clear of
// them on the right. On a phone the fight fills the lower screen, so the banner rides at the top of the
// head, over the tent, and the cards come up only after a full screen of the fight alone.

const LEAD = `text-center text-base ${world.ink}`

// The About title card's billing, each label in the red lettering.
const BILL_LINES: AboutFactsLook = {
  list: 'mt-4 space-y-1',
  fact: 'flex flex-wrap justify-center gap-x-2 text-sm',
  term: `uppercase tracking-widest ${world.red}`,
  value: world.ink,
}

function AboutCards({ slot }: { slot: SlotOf<'about'> }) {
  const { cards } = useLabels()
  const { highlights } = useAboutBlock()
  return (
    <div className={`p-5 ${world.titleCard}`}>
      <p className={`whitespace-pre-line leading-relaxed ${LEAD}`}>{slot.bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={{ ...STAR_LINES, list: 'mt-4 space-y-1' }} />
      </div>
      <AboutFacts look={BILL_LINES} />
    </div>
  )
}

// Each job's years ride on an ink tab above its card: the room above it keeps the tab inside the item, where
// a column's top edge would cut it.
function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  return (
    <ul className={MASONRY_COLUMN_LIST} data-stage-items="">
      {slot.jobs.map((entry) => (
        <li key={entry.id} className={`${MASONRY_ITEM} pt-4`}>
          <ExperienceCard entry={entry} />
        </li>
      ))}
    </ul>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  // the shared tech list's masonry, held to two columns in the screen column
  return (
    <div className={`p-5 ${world.titleCard}`}>
      <div data-stage-items="" className="xl:[&>ul]:columns-2">
        <TechBubbleCloud categories={slot.categories} />
      </div>
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <ul className={MASONRY_COLUMN_LIST} data-stage-items="">
      {slot.services.map((service) => (
        <li key={service.id} className={`${MASONRY_ITEM} p-5 ${world.poster}`}>
          <h3 className={`text-lg ${world.lettering}`}>{service.title}</h3>
          <p className={`mt-2 text-base leading-relaxed ${world.ink}`}>{service.line}</p>
        </li>
      ))}
    </ul>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={slot.projects} className={MASONRY_COLUMN_LIST} itemClassName={`${MASONRY_ITEM} pl-4 pt-4`} renderProject={(project) => <VintagePoster {...project} />} />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return (
    <div data-stage-items="">
      <VentureList
        companies={slot.companies}
        className="grid gap-4 md:grid-cols-6"
        itemClassName="md:col-span-3"
        featuredItemClassName="md:col-span-6"
        renderVenture={(venture) => <CompanyPoster {...venture} />}
      />
    </div>
  )
}

function BandCards({ slot: { musician, bands } }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <>
      <p className={`mb-6 p-3 ${world.titleCard} ${LEAD}`}>{drumsSince(musician, years)}</p>
      <div data-stage-items="">
        <BandList bands={bands} className={MASONRY_COLUMN_LIST} itemClassName={MASONRY_ITEM} renderBand={(band) => <BandRecord {...band} />} />
      </div>
      <p className={`mt-6 p-3 italic ${world.titleCard} ${LEAD} ${world.red}`}>{musician.line}</p>
    </>
  )
}

function RecordCards({ slot: { martialArts } }: { slot: SlotOf<'muayThai'> }) {
  return (
    <div className={`relative p-6 ${world.poster}`}>
      <h3 className={`mb-6 text-center text-2xl ${world.red} ${world.lettering} ${world.dropText}`}>{martialArts.primary.title}</h3>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-4 mb-6',
            fact: `p-3 ${world.fact}`,
            term: `text-sm tracking-widest uppercase ${world.red}`,
            value: `text-sm mt-1 ${world.ink}`,
            achievements: 'space-y-4',
            achievement: `text-sm ${world.ink}`,
          }}
          renderAchievement={(achievement) => (
            <p className={`flex items-start gap-2 p-4 ${world.titleCard}`}>
              <span className={world.red} aria-hidden="true">
                ★
              </span>
              <span>{achievement}</span>
            </p>
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
  const title = slot.id === 'projects' ? sections.featuredWork : sections[slot.titleKey]
  const id = headingId('hose', title)
  return (
    <section data-scene={scene.id} aria-labelledby={id} className="relative px-4 pb-[60svh] motion-reduce:pb-16 sm:px-6 lg:px-[6vw]">
      {still && <HoseStage scene={scene} settled />}
      <header className="relative flex min-h-[90svh] max-w-[42rem] items-end justify-center pb-4 motion-reduce:min-h-[70svh] max-md:min-h-[110svh] max-md:items-start max-md:pt-16 lg:max-w-[40vw]">
        <CurlBanner id={id}>{title}</CurlBanner>
      </header>
      <div className="relative max-w-[42rem] lg:max-w-[40vw]">
        <Cards slot={slot} />
      </div>
    </section>
  )
}
