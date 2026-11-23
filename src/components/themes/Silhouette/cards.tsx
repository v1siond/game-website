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
import { TYPEWRITER } from './palette'
import page from './page.module.css'

// Silhouette's cards: near black slabs with a hard black offset shadow, the way a silhouette game frames
// its few words, in fog grey type. Every card is opaque, so its words read the same over any frame of the
// forest behind it.

export const CARD_TITLE = 'text-sm font-bold uppercase tracking-wider text-[color:var(--sh-text)]'
export const CARD_META = 'text-sm tracking-wider text-[color:var(--sh-dim-text)]'
export const CARD_BODY = 'text-sm leading-relaxed text-[color:var(--sh-muted-text)]'

/** A slab: the near black card with its black edge on the left. */
export function Slab({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border-l-4 border-[color:var(--sh-black)] p-4 sm:p-5 ${page.card} ${className}`}>{children}</div>
}

/** A list in the card's body type, each line behind the dash every Silhouette card marks its points with. */
export const DASH_LIST: MarkedLinesLook = {
  list: 'mt-2 space-y-1',
  line: `flex items-start gap-1.5 ${CARD_BODY}`,
  marker: (
    <span className="text-[color:var(--sh-dim-text)]" aria-hidden="true">
      -
    </span>
  ),
}

// A job's skills, ruled in the edge grey.
const SKILL_TAGS: TagListLook = {
  list: 'mt-2 flex flex-wrap gap-1.5',
  tag: 'border border-[color:var(--sh-edge)] px-1.5 py-0.5 text-sm uppercase text-[color:var(--sh-dim-text)]',
}

// A project's technologies, on the black.
const TECH_TAGS: TagListLook = {
  list: 'mt-2 flex flex-wrap gap-1.5',
  tag: 'bg-[color:var(--sh-black)] px-1.5 py-0.5 text-sm uppercase tracking-wider text-[color:var(--sh-muted-text)]',
}

// A crate's tools, ruled in fog.
const CRATE_TAGS: TagListLook = {
  list: 'flex flex-wrap gap-1.5',
  tag: 'border border-[color:var(--sh-fog)] px-2 py-1 text-sm uppercase tracking-wider text-[color:var(--sh-muted-text)]',
}

/** Every field of the job's card, the years in the label ("2019 to 2022"). */
export function JobSlab({ entry }: { entry: Job }) {
  const { years, cards } = useLabels()
  const job = jobCard(entry, years)
  return (
    <Slab>
      <article>
        <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={CARD_TITLE}>{job.title}</h3>
            <p className={`mt-0.5 ${CARD_META}`}>
              <SlashBreaks text={job.company} />
            </p>
            {job.location && <p className={`mt-0.5 ${CARD_META}`}>{job.location}</p>}
          </div>
          <span className={`whitespace-nowrap uppercase ${CARD_META}`}>{job.years}</span>
        </div>
        {job.description && <p className={`mt-2 ${CARD_BODY}`}>{job.description}</p>}
        <MarkedLines items={job.highlights} label={cards.keyAchievements} look={DASH_LIST} />
        <TagList items={job.skills} label={cards.skillsUsed} look={SKILL_TAGS} />
      </article>
    </Slab>
  )
}

/** A tool group as a crate of the flooded hold: its planks round a panel with the group and its tools. */
export function TechCrate({ category }: { category: TechCategory }) {
  const { cards } = useLabels()
  return (
    <div className={`border-4 border-[color:var(--sh-black)] p-3 ${page.crate}`}>
      <div className="bg-[color:var(--sh-panel)] p-3">
        <h3 className="mb-2 text-sm uppercase tracking-[0.25em] text-[color:var(--sh-heading)]">{category.name}</h3>
        <TagList items={category.items} label={fillLabel(cards.categoryTechnologies, { name: category.name })} look={CRATE_TAGS} />
      </div>
    </div>
  )
}

/** A service on its slab. */
export function ServiceSlab({ service }: { service: Service }) {
  return (
    <Slab>
      <h3 className={CARD_TITLE}>{service.title}</h3>
      <p className={`mt-2 ${CARD_BODY}`}>{service.line}</p>
    </Slab>
  )
}

/** Every field of the project's card, and the links with their names from the slot. */
export function ProjectSlab({ slot }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const { cards } = labels
  const project = projectCard(slot.project, labels)
  return (
    <Slab>
      <article>
        <div className="flex items-start justify-between gap-2">
          <h3 className={`min-w-0 ${CARD_TITLE}`}>
            <SlashBreaks text={project.name} />
          </h3>
          {project.years && <span className={`whitespace-nowrap ${CARD_META}`}>{project.years}</span>}
        </div>
        <p className="mt-0.5 text-sm text-[color:var(--sh-text)]">{project.role}</p>
        {project.tagline && <p className={`mt-0.5 ${CARD_META}`}>{project.tagline}</p>}
        {project.description && <p className={`mt-1.5 ${CARD_BODY}`}>{project.description}</p>}
        <MarkedLines items={project.details} label={cards.details} look={DASH_LIST} />
        {project.impact && (
          <p className={`mt-1.5 italic ${CARD_BODY}`}>
            <span aria-hidden="true">{'-> '}</span>
            <ImpactLabel />
            {project.impact}
          </p>
        )}
        <TagList items={project.techStack} label={cards.technologiesUsed} look={TECH_TAGS} />
        {slot.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {slot.links.map(({ kind, label, linkProps }) => (
              <a key={kind} {...linkProps} className={`inline-flex min-h-[44px] items-center border-2 border-[color:var(--sh-text)] px-3 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-text)] hover:bg-[color:var(--sh-glow)] hover:text-[color:var(--sh-black)]`}>
                {label}
              </a>
            ))}
          </div>
        )}
      </article>
    </Slab>
  )
}

type Company = CVData['companies'][number]

function SignFace({ company }: { company: Company }) {
  const { cards, sections } = useLabels()
  const venture = ventureCard(company)
  return (
    <div className={`h-full border-2 border-[color:var(--sh-black)] p-4 ${page.card}`}>
      {venture.featured && (
        <p className="mb-3 inline-block border border-[color:var(--sh-rim)] px-2 py-0.5 text-sm uppercase tracking-[0.25em] text-[color:var(--sh-heading)]">{cards.ownProduct}</p>
      )}
      <h3 className={`${CARD_TITLE} group-hover:underline`}>
        <SlashBreaks text={venture.name} />
      </h3>
      {venture.tagline && <p className={`mt-1 ${CARD_META}`}>{venture.tagline}</p>}
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--sh-text)]">{venture.description}</p>
      <TagList items={venture.services} label={sections.services} look={SKILL_TAGS} />
    </div>
  )
}

/** A venture as a sign of the city, the link to its site when it has one. */
export function VentureSign({ company }: { company: Company }) {
  const { links } = useLabels()
  if (!company.url) return <SignFace company={company} />
  return (
    <a href={company.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <SignFace company={company} />
      <span className="sr-only"> {newTabHint(links)}</span>
    </a>
  )
}

/** A band on its steel floor plate: the name, the role and years, the release, the site. */
export function BandPlate({ slot }: { slot: BandSlot }) {
  const { links } = useLabels()
  const { band, years, linkProps, nameFor, release } = slot
  return (
    <article className={`border-2 border-[color:var(--sh-black)] p-4 ${page.plate}`}>
      <h3 className={`text-sm font-bold uppercase tracking-[0.25em] text-[color:var(--sh-heading)] ${TYPEWRITER}`}>{band.name}</h3>
      <p className="mt-1 text-sm tracking-wider text-[color:var(--sh-muted-text)]">
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {release && (
        <p className="mt-2 text-sm text-[color:var(--sh-text)]">
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
        </p>
      )}
      {linkProps && (
        <p className="mt-2">
          <a {...linkProps} aria-label={nameFor(links.website)} className="inline-flex min-h-[44px] items-center text-sm uppercase tracking-[0.2em] text-[color:var(--sh-text)] underline underline-offset-4">
            {links.website}
          </a>
        </p>
      )}
    </article>
  )
}
