'use client'

import type { ReactNode } from 'react'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { BandList } from '@/components/cv/BandList'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { ProjectList } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { TechList } from '@/components/cv/TechList'
import { cssVars } from '@/lib/cssVars'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { drumsSince, newTabHint } from '@/lib/cv/sectionText'
import { Stage } from '../shared/theatre/Stage'
import { DepthGauge } from './gauge'
import { LAYER_MOTION, type DecoScene } from './scenes'
import page from './page.module.css'

// One section per chamber: a tall head that first shows the chamber alone and then brings its ziggurat
// plaque up from the bottom (its depth gauge reading how deep the chamber is), then the cards on the city's
// brass panels, diary cards, photographs, banners and marquee boards, then a screen of the chamber alone
// before it sinks. The cards a chamber counts sit inside an element marked data-stage-items, which the
// theatre measures for the reading line that sets his act. Every field comes from the shared lists and
// the card view models.

/** How deep each section's chamber sits; the gauge turns one tick a level. */
const DEPTH: Record<SectionId, number> = {
  about: 0,
  work: 1,
  tech: 2,
  services: 2,
  projects: 3,
  ventures: 4,
  bands: 0,
  muayThai: 0,
}

const STACK = 'flex flex-col gap-6'

const diamond = (tone: string) => (
  <svg viewBox="0 0 10 10" className={`mt-1 h-3 w-3 flex-shrink-0 ${tone}`} aria-hidden="true" focusable="false">
    <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
  </svg>
)

const GOLD_DIAMONDS: MarkedLinesLook = {
  list: 'mt-5 space-y-2',
  line: 'flex items-start gap-2 text-sm text-[color:var(--deco-cream)]',
  marker: diamond('text-[color:var(--deco-gold)]'),
}
const BLOOD_DIAMONDS: MarkedLinesLook = {
  list: 'mt-3 space-y-1',
  line: 'flex items-start gap-2 text-sm text-[color:var(--deco-abyss)]',
  marker: diamond('text-[color:var(--deco-blood)]'),
}
const PLATE_FACTS: AboutFactsLook = {
  list: 'mt-5 space-y-1 text-sm',
  fact: 'flex flex-wrap gap-x-2',
  term: 'uppercase tracking-[0.15em] text-[color:var(--deco-gold-bright-text)]',
  value: 'text-[color:var(--deco-mist)]',
}
const GOLD_TAGS: TagListLook = { list: 'mt-4 flex flex-wrap gap-2', tag: 'border border-[color:var(--deco-gold)] px-2 py-1 text-sm text-[color:var(--deco-gold-text)]' }
const SEPIA_TAGS: TagListLook = { list: 'mt-3 flex flex-wrap gap-2', tag: 'border border-[color:var(--deco-sepia)] px-2 py-0.5 text-sm text-[color:var(--deco-sepia)]' }
const PALE_TAGS: TagListLook = { list: 'mt-4 flex flex-wrap justify-center gap-2', tag: 'border border-[color:var(--deco-gold-pale-text)] px-2 py-1 text-sm text-[color:var(--deco-gold-pale-text)]' }

const cardTitle = `text-lg leading-snug ${page.display}`

function AboutCards() {
  const { bio, highlights } = useAboutBlock()
  const { cards } = useLabels()
  return (
    <div className={page.panel}>
      <p className="text-base leading-relaxed text-[color:var(--deco-cream)]">{bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={GOLD_DIAMONDS} />
      </div>
      <AboutFacts look={PLATE_FACTS} />
    </div>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  const { cards, years } = useLabels()
  return (
    <ol className={STACK} data-stage-items="">
      {slot.jobs.map((job) => {
        const card = jobCard(job, years)
        return (
          <li key={card.id} className={page.diary}>
            <h3 className={`${cardTitle} text-[color:var(--deco-gold-bright-text)]`}>{card.title}</h3>
            <p className="mt-1 text-sm text-[color:var(--deco-cream)]">
              <SlashBreaks text={card.company} />
            </p>
            <p className="mt-1 text-sm text-[color:var(--deco-gold-text)]">{card.years}</p>
            {card.location && <p className="mt-1 text-sm text-[color:var(--deco-mist)]">{card.location}</p>}
            {card.description && <p className="mt-4 text-sm leading-relaxed text-[color:var(--deco-mist)]">{card.description}</p>}
            <MarkedLines items={card.highlights} label={cards.keyAchievements} look={GOLD_DIAMONDS} />
            <TagList items={card.skills} label={cards.skillsUsed} look={GOLD_TAGS} />
          </li>
        )
      })}
    </ol>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  return (
    <div data-stage-items="" className={page.tech}>
      <TechList
        categories={slot.categories}
        headingClassName={`text-sm uppercase tracking-[0.2em] text-[color:var(--deco-gold-bright-text)] ${page.display}`}
        itemsClassName="mt-3 flex flex-wrap gap-2"
        itemClassName="border border-[color:var(--deco-gold)] px-3 py-1.5 text-sm text-[color:var(--deco-cream)]"
        renderItem={(tech) => tech}
      />
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.services.map((service) => (
        <li key={service.id} className={page.panel}>
          <h3 className={`text-sm uppercase tracking-[0.2em] text-[color:var(--deco-gold-bright-text)] ${page.display}`}>{service.title}</h3>
          <p className="mt-2 text-base leading-relaxed text-[color:var(--deco-cream)]">{service.line}</p>
        </li>
      ))}
    </ul>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  const labels = useLabels()
  const { cards } = labels
  return (
    <div data-stage-items="">
      <ProjectList
        projects={slot.projects}
        className={STACK}
        itemClassName={page.print}
        renderProject={({ project: source, links, noLink }) => {
          const project = projectCard(source, labels)
          return (
            <>
              <div className="flex items-start justify-between gap-3">
                <h3 className={`min-w-0 ${cardTitle} text-[color:var(--deco-abyss)]`}>
                  <SlashBreaks text={project.name} />
                </h3>
                {project.years && <span className="whitespace-nowrap text-sm text-[color:var(--deco-sepia)]">{project.years}</span>}
              </div>
              <p className="mt-1 text-sm font-bold text-[color:var(--deco-blood)]">{project.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--deco-abyss)]">{project.tagline}</p>
              {project.description && <p className="mt-2 text-sm leading-relaxed text-[color:var(--deco-sepia)]">{project.description}</p>}
              <MarkedLines items={project.details} label={cards.details} look={BLOOD_DIAMONDS} />
              {project.impact && (
                <p className={`mt-3 px-3 py-2 text-sm italic ${page.impact}`}>
                  <span className="mr-2 not-italic uppercase tracking-[0.12em]">{cards.impact}</span>
                  {project.impact}
                </p>
              )}
              <TagList items={project.techStack} label={cards.technologiesUsed} look={SEPIA_TAGS} />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {links.map(({ kind, label, linkProps }) => (
                  <a key={kind} {...linkProps} className={`inline-flex min-h-[44px] items-center px-3 text-sm uppercase tracking-[0.12em] ${page.printLink}`}>
                    {label}
                  </a>
                ))}
                {noLink && <p className="text-sm text-[color:var(--deco-sepia)]">{noLink}</p>}
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  const { links, cards, sections } = useLabels()
  return (
    <ul className={STACK} data-stage-items="">
      {slot.companies.map(ventureCard).map((company) => (
        <li key={company.id} className={page.banner}>
          <a href={company.url} target="_blank" rel="noopener noreferrer" className="block text-center">
            <span className={`mx-auto mb-4 flex items-center justify-center ${company.featured ? 'h-20 w-20 text-4xl' : 'h-16 w-16 text-3xl'} ${page.medal}`} aria-hidden="true">
              {company.icon}
            </span>
            {company.featured && (
              <span className="mb-3 inline-block bg-[color:var(--deco-gold-bright)] px-3 py-0.5 text-sm uppercase tracking-[0.3em] text-[color:var(--deco-abyss)]">{cards.ownProduct}</span>
            )}
            <h3 className={`text-lg uppercase tracking-[0.12em] text-[color:var(--deco-gold-pale-text)] ${page.display}`}>
              <SlashBreaks text={company.name} />
            </h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[color:var(--deco-gold-pale-text)]">{company.tagline}</p>
            <p className="mt-4 text-base text-[color:var(--deco-cream)]">{company.description}</p>
            <span className="sr-only"> {newTabHint(links)}</span>
          </a>
          <TagList items={company.services} label={sections.services} look={PALE_TAGS} />
        </li>
      ))}
    </ul>
  )
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <>
      <p className={`${page.ticket} text-base uppercase tracking-[0.15em]`}>{drumsSince(slot.musician, years)}</p>
      <div data-stage-items="">
        <BandList
          bands={slot.bands}
          className={STACK}
          itemClassName=""
          renderBand={({ band, years: span, linkProps, release }) => {
            const board = (
              <div className={page.marquee}>
                <h3 className={`text-2xl uppercase tracking-[0.18em] text-[color:var(--deco-gold-bright-text)] ${page.display}`}>{band.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[color:var(--deco-cream)]">{band.role}</p>
                {(span || release) && (
                  <p className="mt-3 border-t border-[color:var(--deco-gold)] pt-2 text-sm text-[color:var(--deco-cream)]">
                    {span}
                    {span && release && ', '}
                    {release && (
                      <>
                        {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
                      </>
                    )}
                  </p>
                )}
              </div>
            )
            if (!linkProps) return board
            return (
              <a {...linkProps} className={`block ${page.lift}`}>
                {board}
              </a>
            )
          }}
        />
      </div>
      {slot.musician.line && <p className={`${page.ticket} text-base italic`}>{slot.musician.line}</p>}
    </>
  )
}

function MuayThaiCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  return (
    <>
      <h3 className={`${page.ticket} text-xl tracking-[0.1em] ${page.display}`}>{slot.martialArts.primary.title}</h3>
      <div data-stage-items="" className={STACK}>
        <MuayThaiRecord
          martialArts={slot.martialArts}
          classNames={{
            facts: `grid gap-3 ${page.panel}`,
            fact: 'border-b border-[color:var(--deco-brass-dark)] pb-2 last:border-b-0',
            term: 'text-sm uppercase tracking-[0.2em] text-[color:var(--deco-gold-bright-text)]',
            value: 'mt-1 text-base text-[color:var(--deco-cream)]',
            achievements: 'space-y-3',
            achievement: '',
          }}
          renderAchievement={(achievement) => <p className={`px-4 py-3 text-base ${page.programme}`}>{achievement}</p>}
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

/** The ziggurat plaque: its three stepped tiers over the board, the depth gauge and the title. */
export function Plaque({ id, title, place, depth }: { id: string; title: string; place: string; depth: number }) {
  return (
    <header className={page.head}>
      <p className={page.place}>{place}</p>
      <div className={page.plaque} style={cssVars({ '--depth': depth })}>
        <span className={page.steps} aria-hidden="true" />
        <div className={page.board}>
          <DepthGauge className="h-12 w-12 flex-shrink-0" needle={page.needle} />
          <h2 id={id} className={`text-xl uppercase tracking-[0.15em] sm:text-3xl sm:tracking-[0.3em] ${page.title}`}>
            {title}
          </h2>
        </div>
      </div>
    </header>
  )
}

/** One chamber: under reduced motion its own stage sits still behind its head. */
export function ChamberSection({ scene, still }: { scene: DecoScene & { slot: SectionSlot }; still: boolean }) {
  const { sections, deco } = useLabels()
  const Cards = CARDS[scene.slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const headingId = `deco-${scene.id}`
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby={headingId} className={page.level}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <Plaque id={headingId} title={sections[scene.slot.titleKey]} place={deco[scene.place]} depth={DEPTH[scene.slot.id]} />
      <div className={page.body}>
        <Cards slot={scene.slot} />
      </div>
    </section>
  )
}
