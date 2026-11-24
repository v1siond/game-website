import type { ReactNode } from 'react'
import type { BandSlot } from '@/components/cv/BandList'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import type { CVData, Job, Service, TechCategory } from '@/lib/cv/content'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { newTabHint } from '@/lib/cv/sectionText'
import { CARVED } from './palette'
import page from './page.module.css'

// Soul Map's cards: the game's menu panel, dark stone in a thin worn gold frame, carved capitals for the
// titles and warm parchment white for the words, the points behind small ember diamonds. Every panel is
// opaque, so its words read the same over any frame of the ruins behind it.

export const CARD_TITLE = `${CARVED} text-base uppercase tracking-[0.14em] text-[color:var(--soul-text)]`
export const CARD_META = 'text-sm tracking-wide text-[color:var(--soul-text-soft)]'
export const CARD_BODY = 'text-sm leading-relaxed text-[color:var(--soul-text)]'

/** A card's item slots: a job's skills, a project's technologies, a venture's services, a group's tools. */
const TAGS: TagListLook = { list: 'mt-3 flex flex-wrap gap-1.5', tag: `${page.slot} inline-block px-2 py-0.5 text-sm text-[color:var(--soul-text-soft)]` }

/** A list in the card body type, each line behind the small ember diamond the world marks its points with. */
export const EMBER_LIST: MarkedLinesLook = {
  list: 'mt-3 space-y-1.5',
  line: `flex gap-2 ${CARD_BODY}`,
  marker: <span className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-[color:var(--soul-ember)]" aria-hidden="true" />,
}

/** The menu panel. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${page.panel} p-5 sm:p-6 ${className}`}>{children}</div>
}

/** Every field of the job's card, the years in the label ("2019 to 2022"). */
export function JobPanel({ entry }: { entry: Job }) {
  const { years, cards } = useLabels()
  const job = jobCard(entry, years)
  return (
    <Panel>
      <article>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={CARD_TITLE}>{job.title}</h3>
            <p className={`mt-1 ${CARD_META}`}>
              <SlashBreaks text={job.company} />
            </p>
            {job.location && <p className={CARD_META}>{job.location}</p>}
          </div>
          <span className={`whitespace-nowrap ${CARD_META}`}>{job.years}</span>
        </div>
        {job.description && <p className={`mt-3 ${CARD_BODY}`}>{job.description}</p>}
        <MarkedLines items={job.highlights} label={cards.keyAchievements} look={EMBER_LIST} />
        <TagList items={job.skills} label={cards.skillsUsed} look={TAGS} />
      </article>
    </Panel>
  )
}

/** A tool group as an equipment screen: the group in gold capitals, its tools in item slots. */
export function TechPanel({ category }: { category: TechCategory }) {
  const { cards } = useLabels()
  return (
    <Panel>
      <h3 className={`${CARVED} text-sm uppercase tracking-[0.22em] text-[color:var(--soul-glow)]`}>{category.name}</h3>
      <TagList items={category.items} label={fillLabel(cards.categoryTechnologies, { name: category.name })} look={TAGS} />
    </Panel>
  )
}

/** A service on its panel. */
export function ServicePanel({ service }: { service: Service }) {
  return (
    <Panel>
      <h3 className={CARD_TITLE}>{service.title}</h3>
      <p className={`mt-2 ${CARD_BODY}`}>{service.line}</p>
    </Panel>
  )
}

/** Every field of the project's card, and the links with their names from the slot. */
export function ProjectPanel({ slot }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const { cards } = labels
  const project = projectCard(slot.project, labels)
  return (
    <Panel>
      <article>
        <div className="flex items-start justify-between gap-2">
          <h3 className={`min-w-0 ${CARD_TITLE}`}>
            <SlashBreaks text={project.name} />
          </h3>
          {project.years && <span className={`whitespace-nowrap ${CARD_META}`}>{project.years}</span>}
        </div>
        <p className="mt-1 text-sm text-[color:var(--soul-glow)]">{project.role}</p>
        {project.tagline && <p className={CARD_META}>{project.tagline}</p>}
        {project.description && <p className={`mt-2 ${CARD_BODY}`}>{project.description}</p>}
        <MarkedLines items={project.details} label={cards.details} look={EMBER_LIST} />
        {project.impact && (
          <p className={`mt-2 italic ${CARD_BODY}`}>
            <ImpactLabel />
            {project.impact}
          </p>
        )}
        <TagList items={project.techStack} label={cards.technologiesUsed} look={TAGS} />
        {slot.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {slot.links.map(({ kind, label, linkProps }) => (
              <a key={kind} {...linkProps} className={`${page.button} inline-flex min-h-[44px] items-center px-4 text-sm uppercase tracking-[0.2em] text-[color:var(--soul-text)]`}>
                {label}
              </a>
            ))}
          </div>
        )}
      </article>
    </Panel>
  )
}

type Company = CVData['companies'][number]

function VentureFace({ company }: { company: Company }) {
  const { cards, sections } = useLabels()
  const venture = ventureCard(company)
  return (
    <Panel className="h-full">
      {venture.featured && <p className={`mb-2 inline-block border border-[color:var(--soul-glow-deep)] px-2 py-0.5 text-sm uppercase tracking-[0.2em] text-[color:var(--soul-glow)]`}>{cards.ownProduct}</p>}
      <h3 className={`${CARD_TITLE} group-hover:underline`}>
        <SlashBreaks text={venture.name} />
      </h3>
      {venture.tagline && <p className={`mt-1 ${CARD_META}`}>{venture.tagline}</p>}
      <p className={`mt-2 ${CARD_BODY}`}>{venture.description}</p>
      <TagList items={venture.services} label={sections.services} look={TAGS} />
    </Panel>
  )
}

/** A venture on its panel, the link to its site when it has one. */
export function VenturePanel({ company }: { company: Company }) {
  const { links } = useLabels()
  if (!company.url) return <VentureFace company={company} />
  return (
    <a href={company.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <VentureFace company={company} />
      <span className="sr-only"> {newTabHint(links)}</span>
    </a>
  )
}

/** A band on its panel: the name in carved capitals, the role and years, the release, the site. */
export function BandPanel({ slot }: { slot: BandSlot }) {
  const { links } = useLabels()
  const { band, years, linkProps, nameFor, release } = slot
  return (
    <Panel>
      <article>
        <h3 className={`${CARVED} text-lg uppercase tracking-[0.2em] text-[color:var(--soul-glow)]`}>{band.name}</h3>
        <p className={`mt-1 ${CARD_META}`}>
          {band.role}
          {years && ` · ${years}`}
        </p>
        {release && (
          <p className={`mt-2 ${CARD_BODY}`}>
            {release.label}: <cite>{release.title}</cite>
          </p>
        )}
        {linkProps && (
          <p className="mt-2">
            <a {...linkProps} aria-label={nameFor(links.website)} className="inline-flex min-h-[44px] items-center text-sm uppercase tracking-[0.2em] text-[color:var(--soul-text)] underline underline-offset-4">
              {links.website}
            </a>
          </p>
        )}
      </article>
    </Panel>
  )
}
