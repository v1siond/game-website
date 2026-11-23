'use client'

import type { ReactNode } from 'react'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { BandList } from '@/components/cv/BandList'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { ProjectList } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { TechList } from '@/components/cv/TechList'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { drumsSince, newTabHint } from '@/lib/cv/sectionText'
import { Stage } from '../shared/theatre/Stage'
import { JOURNAL_SERIF } from './palette'
import { LAYER_MOTION, type TrailScene } from './scenes'
import page from './page.module.css'

// One section per level: a tall head that first shows the level alone and then brings the HUD title up
// from the bottom, then the cards, the message windows and paper cards of the 16 bit games, then a screen
// of the level alone before it sinks. The cards a level counts sit inside an element marked
// data-stage-items, which the theatre measures for the reading line that sets his beat. Every field comes
// from the shared lists and the card view models.

/** A card: the message window's white page with the black outline and a hard drop. */
const PAPER_CARD = 'rounded-md border-[3px] border-[color:var(--ap-hud)] bg-[color:var(--ap-page)] p-4 text-[color:var(--ap-ink)] shadow-[0_5px_0_var(--ap-hud)]'

/** The black message window with its double white edge. */
const WINDOW = 'rounded-md border-4 border-double border-white bg-[color:var(--ap-hud)] p-5 text-white sm:p-6'

const STACK = 'flex flex-col gap-6'

const coinMarker = (edge: string) => <span className={`mt-1 h-2.5 w-2 shrink-0 rounded-sm border ${edge} bg-[color:var(--ap-coin)]`} aria-hidden="true" />

const WHITE_COINS: MarkedLinesLook = { list: 'mt-4 space-y-1.5', line: 'flex items-start gap-2 text-sm text-white', marker: coinMarker('border-white') }
const COIN_ROWS: MarkedLinesLook = { list: 'mt-3 space-y-1.5', line: 'flex items-start gap-2 text-sm', marker: coinMarker('border-[color:var(--ap-hud)]') }
const LANTERN_ROWS: MarkedLinesLook = {
  list: 'mt-2 space-y-1.5',
  line: 'flex items-start gap-2 text-sm',
  marker: <span className="mt-1.5 h-2 w-2 shrink-0 bg-[color:var(--ap-lantern)]" aria-hidden="true" />,
}
const COIN_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-1 text-sm text-white',
  fact: '',
  term: 'inline font-bold text-[color:var(--ap-coin)]',
  value: 'inline',
  termEnd: ': ',
}
const SKILL_TAGS: TagListLook = { list: 'mt-3 flex flex-wrap gap-1.5', tag: 'rounded-sm border border-dashed border-[color:var(--ap-ink-soft)] px-2 py-0.5 text-sm' }
const COIN_TAGS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: 'flex items-center gap-1.5 rounded-sm border border-[color:var(--ap-hud)] px-2 py-0.5 text-sm',
  marker: <span className="h-2.5 w-2 shrink-0 rounded-sm border border-[color:var(--ap-hud)] bg-[color:var(--ap-coin)]" aria-hidden="true" />,
}

// The four palace colours a project's tech blocks fill with, taken in turn: ink on gold, white on the rest.
const PALACE = [
  'bg-[color:var(--ap-gold)] text-[color:var(--ap-ink)]',
  'bg-[color:var(--ap-forest)] text-white',
  'bg-[color:var(--ap-route-plate)] text-white',
  'bg-[color:var(--ap-blue-plate)] text-white',
] as const

const LINK = 'inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[color:var(--ap-ink)] px-3 text-sm font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none'

const title = `text-lg font-bold ${JOURNAL_SERIF}`

function AboutCards() {
  const { bio, highlights } = useAboutBlock()
  const { cards } = useLabels()
  return (
    <div className={WINDOW}>
      <p className={`text-lg leading-relaxed ${JOURNAL_SERIF}`}>{bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={WHITE_COINS} />
      </div>
      <AboutFacts look={COIN_FACTS} />
    </div>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  const { cards, years } = useLabels()
  return (
    <ol className={STACK} data-stage-items="">
      {slot.jobs.map((job, index) => {
        const card = jobCard(job, years)
        return (
          <li key={card.id} className={`relative ${PAPER_CARD}`}>
            <span className={`absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-md border-[3px] border-[color:var(--ap-hud)] bg-[color:var(--ap-block)] text-base font-bold ${JOURNAL_SERIF}`} aria-hidden="true">
              {index + 1}
            </span>
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2 pl-4">
              <div className="min-w-0">
                <h3 className={title}>{card.title}</h3>
                <p className="text-sm font-semibold text-[color:var(--ap-route-text)]">
                  <SlashBreaks text={card.company} />
                </p>
                {card.location && <p className="text-sm text-[color:var(--ap-ink-soft)]">{card.location}</p>}
              </div>
              <span className="rounded-sm bg-[color:var(--ap-hud)] px-2 py-1 text-sm text-white">{card.years}</span>
            </div>
            {card.description && <p className="text-sm text-[color:var(--ap-ink-soft)]">{card.description}</p>}
            <MarkedLines items={card.highlights} label={cards.keyAchievements} look={COIN_ROWS} />
            <TagList items={card.skills} label={cards.skillsUsed} look={SKILL_TAGS} />
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
        headingClassName={title}
        itemsClassName="mt-2 flex flex-wrap gap-1.5"
        itemClassName="rounded-sm border-2 border-[color:var(--ap-hud)] bg-[color:var(--ap-block)] px-2 py-0.5 text-sm font-semibold text-[color:var(--ap-ink)]"
        renderItem={(tech) => tech}
      />
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <ul className={STACK} data-stage-items="">
      {slot.services.map((service) => (
        <li key={service.id} className={`${PAPER_CARD} border-t-8 border-t-[color:var(--ap-route)]`}>
          <h3 className={title}>{service.title}</h3>
          <p className="mt-2 text-base text-[color:var(--ap-ink-soft)]">{service.line}</p>
        </li>
      ))}
    </ul>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  const labels = useLabels()
  const { cards, trail } = labels
  return (
    <div data-stage-items="">
      <ProjectList
        projects={slot.projects}
        className={STACK}
        itemClassName={PAPER_CARD}
        renderProject={({ project: source, links, noLink }, index) => {
          const project = projectCard(source, labels)
          const [main, ...secret] = links
          return (
            <>
              <h3 className={title}>
                <SlashBreaks text={project.name} />
              </h3>
              <p className="text-sm font-semibold text-[color:var(--ap-route-text)]">{project.role}</p>
              {project.years && <p className="text-sm text-[color:var(--ap-ink-soft)]">{project.years}</p>}
              <p className="mt-2 text-sm text-[color:var(--ap-ink-soft)]">{project.tagline}</p>
              {project.impact && (
                <p className="mt-2 text-sm font-semibold text-[color:var(--ap-forest)]">
                  <ImpactLabel />
                  {project.impact}
                </p>
              )}
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={cards.technologiesUsed}>
                {project.techStack.map((item) => (
                  <li key={item} className={`rounded-sm border-2 border-[color:var(--ap-ink)] px-2 py-1 text-sm font-semibold ${PALACE[index % PALACE.length]}`}>
                    {item}
                  </li>
                ))}
              </ul>
              {(project.description || project.details.length > 0) && (
                <div className="mt-4 rounded-sm border-4 border-double border-[color:var(--ap-ink)] bg-[color:var(--ap-ink)] p-4 text-[color:var(--ap-page)]">
                  {project.description && <p className="text-sm">{project.description}</p>}
                  <MarkedLines items={project.details} label={cards.details} look={LANTERN_ROWS} />
                </div>
              )}
              {noLink && <p className="mt-3 text-sm text-[color:var(--ap-ink-soft)]">{noLink}</p>}
              {main && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <a {...main.linkProps} className={`${LINK} bg-[color:var(--ap-gold)] text-[color:var(--ap-ink)]`}>
                    {main.label}
                  </a>
                  {secret.map(({ kind, label, linkProps }) => (
                    <a key={kind} {...linkProps} className={`${LINK} bg-[color:var(--ap-route-plate)] text-white`}>
                      <span className="h-3 w-3 rounded-full border-2 border-white bg-[color:var(--ap-route-plate)]" aria-hidden="true" />
                      {label}
                      <span className="text-sm font-normal">{trail.secretExit}</span>
                    </a>
                  ))}
                </div>
              )}
            </>
          )
        }}
      />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  const { sections, links, cards } = useLabels()
  return (
    <ul className={STACK} data-stage-items="">
      {slot.companies.map(ventureCard).map((company) => (
        <li key={company.id}>
          <a href={company.url} target="_blank" rel="noopener noreferrer" className="block h-full transition-transform hover:-translate-y-1 motion-reduce:transition-none">
            <article className={`${PAPER_CARD} h-full border-t-8 ${company.featured ? 'border-t-[color:var(--ap-coin)]' : 'border-t-[color:var(--ap-cave-brick)]'}`}>
              {company.featured && <p className="mb-2 inline-block rounded-sm bg-[color:var(--ap-hud)] px-2 py-0.5 text-sm font-bold text-[color:var(--ap-coin)]">{cards.ownProduct}</p>}
              <h3 className={title}>
                <SlashBreaks text={company.name} />
              </h3>
              <p className="text-sm font-semibold text-[color:var(--ap-route-text)]">{company.tagline}</p>
              <p className="mt-2 text-sm text-[color:var(--ap-ink-soft)]">{company.description}</p>
              <TagList items={company.services} label={sections.services} look={COIN_TAGS} />
              <span className="sr-only"> {newTabHint(links)}</span>
            </article>
          </a>
        </li>
      ))}
    </ul>
  )
}

function BandCards({ slot }: { slot: SlotOf<'bands'> }) {
  const { years } = useLabels()
  return (
    <>
      <p className={`${WINDOW} text-lg ${JOURNAL_SERIF}`}>{drumsSince(slot.musician, years)}</p>
      <div data-stage-items="">
        <BandList
          bands={slot.bands}
          className={STACK}
          itemClassName=""
          renderBand={({ band, years: span, linkProps, release }) => {
            const body = (
              <article className={`${PAPER_CARD} h-full`}>
                <h3 className={title}>{band.name}</h3>
                <p className="mt-1 text-sm text-[color:var(--ap-ink-soft)]">
                  {band.role}
                  {span && <span>, {span}</span>}
                </p>
                {release && (
                  <p className="mt-2 text-sm">
                    {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
                  </p>
                )}
              </article>
            )
            if (!linkProps) return body
            return (
              <a {...linkProps} className="block h-full transition-transform hover:-translate-y-1 motion-reduce:transition-none">
                {body}
              </a>
            )
          }}
        />
      </div>
      {slot.musician.line && <p className="rounded-md bg-[color:var(--ap-hud)] px-3 py-1.5 text-base italic text-[color:var(--ap-coin)]">{slot.musician.line}</p>}
    </>
  )
}

function MuayThaiCards({ slot }: { slot: SlotOf<'muayThai'> }) {
  return (
    <>
      <h3 className={`${WINDOW} text-xl font-bold ${JOURNAL_SERIF}`}>{slot.martialArts.primary.title}</h3>
      <div data-stage-items="" className={STACK}>
        <MuayThaiRecord
          martialArts={slot.martialArts}
          classNames={{
            facts: 'grid content-start gap-3 rounded-md border-[3px] border-white bg-[color:var(--ap-hud)] p-4',
            fact: 'border-b border-white/30 pb-2 last:border-b-0',
            term: 'text-sm font-bold tracking-wide text-[color:var(--ap-coin)]',
            value: 'mt-1 text-sm text-white',
            achievements: 'space-y-3',
            achievement: '',
          }}
          renderAchievement={(achievement, index) => (
            <div className="flex items-start gap-3 rounded-md border-[3px] border-[color:var(--ap-hud)] bg-[color:var(--ap-page)] p-3 text-[color:var(--ap-ink)] shadow-[0_4px_0_var(--ap-hud)]">
              <span className="mt-0.5 flex h-8 min-w-[2rem] shrink-0 items-center justify-center rounded-sm border-2 border-[color:var(--ap-hud)] bg-[color:var(--ap-fort-gold)] px-1 text-sm font-bold" aria-hidden="true">
                {index + 1}
              </span>
              <span className="min-w-0 text-base">{achievement}</span>
            </div>
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

/** One level: under reduced motion its own stage sits still behind its head. */
export function LevelSection({ scene, still }: { scene: TrailScene & { slot: SectionSlot }; still: boolean }) {
  const { sections } = useLabels()
  const Cards = CARDS[scene.slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const headingId = `trail-${scene.id}`
  return (
    <section id={scene.anchor} data-scene={scene.id} aria-labelledby={headingId} className={page.level}>
      {still && <Stage scene={scene} layers={scene.layers} motion={LAYER_MOTION} settled className={page.scrim} />}
      <header className={page.head}>
        <h2 id={headingId} className={`${page.title} ${JOURNAL_SERIF}`}>
          {sections[scene.slot.titleKey]}
        </h2>
      </header>
      <div className={page.body}>
        <Cards slot={scene.slot} />
      </div>
    </section>
  )
}
