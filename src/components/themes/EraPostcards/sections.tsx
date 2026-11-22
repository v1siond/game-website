'use client'

import type { ReactNode } from 'react'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { BandList } from '@/components/cv/BandList'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { ProjectList } from '@/components/cv/ProjectList'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { TechList } from '@/components/cv/TechList'
import { VentureList } from '@/components/cv/VentureList'
import { cssVars } from '@/lib/cssVars'
import { jobCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { drumsSince, shownUrl, yearCount } from '@/lib/cv/sectionText'
import { lookVars, type Scene } from './scenes'
import { Stage } from './stage'
import css from './page.module.css'

// One section per era: a tall head that first shows the picture alone and then brings the gate plate and
// the title up from the bottom, then the cards, then a screen of picture alone before it sinks. The cards
// a scene counts sit in an element marked data-era-items (a list, or the record's facts), which the engine
// measures for the reading line that lights each prop. Every field comes from the shared lists and the
// card view models.

const BULLETS: MarkedLinesLook = { list: css.bullets, line: '', marker: null, heading: css.subhead }
const STONES: MarkedLinesLook = { list: css.stones, line: `${css.card} ${css.stone}`, marker: <span className={css.stoneMark} aria-hidden="true" /> }
const CHIPS: TagListLook = { list: css.chips, tag: css.chip }
const FACTS: AboutFactsLook = { list: css.facts, fact: css.fact, term: css.term, value: css.value }
const RECORD = { facts: css.facts, fact: css.fact, term: css.term, value: css.value, achievements: css.bullets }

const Stamp = ({ children }: { children: string }) => (children ? <p className={css.stamp}>{children}</p> : null)

function AboutCards() {
  const { bio, highlights } = useAboutBlock()
  const { cards } = useLabels()
  return (
    <>
      <article className={`${css.card} ${css.lead}`}>
        <p className={css.bio}>{bio}</p>
        <AboutFacts look={FACTS} />
      </article>
      <div data-era-items="list">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={STONES} />
      </div>
    </>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  const { cards, years } = useLabels()
  return (
    <div data-era-items="list">
      <ul className={css.grid}>
        {slot.jobs.map((job) => {
          const card = jobCard(job, years)
          return (
            <li key={card.id} className={css.card}>
              <Stamp>{card.years}</Stamp>
              <h3 className={`${css.display} ${css.cardTitle}`}>{card.title}</h3>
              <p className={css.meta}>
                <strong>{card.company}</strong>, {card.location}
              </p>
              <p>{card.description}</p>
              <MarkedLines items={card.highlights} label={cards.keyAchievements} look={BULLETS} />
              <TagList items={card.skills} label={cards.skillsUsed} look={CHIPS} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  return (
    <div data-era-items="list" className={css.techList}>
      <TechList
        categories={slot.categories}
        headingClassName={`${css.display} ${css.cardTitle} ${css.cardTitleWide}`}
        iconClassName={css.glyph}
        itemsClassName={css.chips}
        itemClassName={css.chip}
        renderItem={(tech) => tech}
      />
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <div data-era-items="list">
      <ul className={css.grid}>
        {slot.services.map((service) => (
          <li key={service.id} className={css.card}>
            <h3 className={`${css.display} ${css.cardTitle} ${css.cardTitleWide}`}>{service.title}</h3>
            <p>{service.line}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  const { cards } = useLabels()
  return (
    <div data-era-items="list">
      <ProjectList
        projects={slot.projects}
        className={css.grid}
        itemClassName={css.card}
        renderProject={({ project, years, links, noLink }) => (
          <>
            <Stamp>{years}</Stamp>
            <h3 className={`${css.display} ${css.cardTitle}`}>{project.name}</h3>
            <p className={css.meta}>{project.tagline}</p>
            <p className={css.role}>{project.role}</p>
            {project.description && <p>{project.description}</p>}
            {project.impact && (
              <p className={css.impact}>
                <strong>{cards.impact}:</strong> {project.impact}
              </p>
            )}
            <MarkedLines items={project.details} label={cards.details} look={BULLETS} />
            <TagList items={project.techStack} label={cards.technologiesUsed} look={CHIPS} />
            {links.length > 0 && (
              <p className={css.links}>
                {links.map((link) => (
                  <a key={link.kind} {...link.linkProps} className={css.pill}>
                    {link.label}
                  </a>
                ))}
              </p>
            )}
            {noLink && <p className={css.meta}>{noLink}</p>}
          </>
        )}
      />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  const { cards, sections } = useLabels()
  return (
    <div data-era-items="list">
      <VentureList
        companies={slot.companies}
        className={css.grid}
        itemClassName={css.card}
        featuredItemClassName={`${css.card} ${css.featured}`}
        renderVenture={({ venture, linkProps, nameFor }) => (
          <>
            {venture.featured && <Stamp>{cards.ownProduct}</Stamp>}
            <h3 className={`${css.display} ${css.cardTitle}`}>
              <span className={css.glyph} aria-hidden="true">
                {venture.icon}
              </span>
              {venture.name}
            </h3>
            <p className={css.meta}>{venture.tagline}</p>
            <p>{venture.description}</p>
            <TagList items={venture.services} label={sections.services} look={CHIPS} />
            {linkProps && (
              <p className={css.links}>
                <a {...linkProps} aria-label={nameFor(shownUrl(venture.url))} className={css.pill}>
                  {shownUrl(venture.url)}
                </a>
              </p>
            )}
          </>
        )}
      />
    </div>
  )
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  const { years, navigation } = useLabels()
  return (
    <>
      <article className={`${css.card} ${css.lead}`}>
        <p className={css.meta}>
          <strong>{drumsSince(slot.musician, years)}</strong>, {yearCount(slot.musician.yearsPlaying, years)}
        </p>
        <p>{slot.musician.line}</p>
      </article>
      <div data-era-items="list">
        <BandList
          bands={slot.bands}
          className={css.grid}
          itemClassName={css.card}
          renderBand={({ band, years: span, linkProps, nameFor, release }) => (
            <>
              <Stamp>{span}</Stamp>
              <h3 className={`${css.display} ${css.cardTitle}`}>{band.name}</h3>
              <p className={css.meta}>
                {band.role}
                {band.current && `, ${navigation.active}`}
              </p>
              {release && (
                <p>
                  {release.label}: {release.title}
                </p>
              )}
              {linkProps && (
                <p className={css.links}>
                  <a {...linkProps} aria-label={nameFor(shownUrl(band.url))} className={css.pill}>
                    {shownUrl(band.url)}
                  </a>
                </p>
              )}
            </>
          )}
        />
      </div>
    </>
  )
}

function MuayThaiCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  return (
    <article className={`${css.card} ${css.lead}`}>
      <h3 className={`${css.display} ${css.cardTitle} ${css.cardTitleWide}`}>{slot.martialArts.primary.title}</h3>
      <div data-era-items="facts">
        <MuayThaiRecord martialArts={slot.martialArts} classNames={RECORD} />
      </div>
    </article>
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

interface EraSectionProps {
  scene: Scene & { slot: SectionSlot }
  gate: number
  gates: number
  still: boolean
}

/** One gate: under reduced motion its own stage sits still behind its head. */
export function EraSection({ scene, gate, gates, still }: EraSectionProps) {
  const { sections, eras } = useLabels()
  const Cards = CARDS[scene.slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const headingId = `era-${scene.id}`
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby={headingId} className={css.era} style={cssVars(lookVars(scene.look))}>
      {still && <Stage scene={scene} settled />}
      <header className={css.head}>
        <p className={css.plate}>{fillLabel(eras.gate, { number: gate, total: gates, place: eras[scene.place] })}</p>
        <h2 id={headingId} className={`${css.display} ${css.title}`}>
          {sections[scene.slot.titleKey]}
        </h2>
      </header>
      <div className={css.body}>
        <Cards slot={scene.slot} />
      </div>
    </section>
  )
}
