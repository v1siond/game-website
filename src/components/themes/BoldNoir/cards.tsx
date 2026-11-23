import type { CSSProperties, ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job, Service } from '@/lib/cv/content'
import { newTabHint } from '@/lib/cv/sectionText'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { NOIR_BUTTON, LOOK } from './actions'
import { HitStar } from './backdrop'
import page from './page.module.css'

// The cards each section lists, each a crooked slab whose words sit level so they read. A card that is a
// link kicks out on hover; nothing else moves on its own, the scene behind does the acting.

const BODY = `text-sm text-[color:var(--noir-paper-dim)] ${page.copy}`
const CHIP = `px-2 py-0.5 text-sm font-bold ${page.chip} ${page.copy}`

// Three crooked outlines the cards take in turn, so no two neighbours share their slant.
const CROOKS = [
  'polygon(0 2%, 100% 0, 98.5% 100%, 1.2% 97%)',
  'polygon(1.5% 0, 99% 3%, 100% 96%, 0 100%)',
  'polygon(0 0, 98% 2.5%, 100% 100%, 2% 97.5%)',
]

/** The tilt a card rests at on hover and its crooked outline, by its place in its list. */
export const crookOf = (index: number): CSSProperties => ({ '--tilt': `${index % 2 ? 1.5 : -1.5}deg`, '--crook': CROOKS[index % CROOKS.length] }) as CSSProperties

/** A card's tag chips. */
export const CHIPS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: CHIP,
}

/** Rows behind a red diamond, the highlights or details of a card, in the dim paper of a slab. */
export const BULLETS: MarkedLinesLook = {
  list: 'mt-3 space-y-1.5',
  line: `flex items-start gap-2 ${BODY}`,
  marker: <span className="mt-1 block h-2.5 w-2.5 flex-shrink-0 rotate-45 bg-[color:var(--noir-red)]" aria-hidden="true" />,
}

export function TechSlab({ category, index }: { category: CVData['techStack'][number]; index: number }) {
  const { cards } = useLabels()
  return (
    <div className={`p-5 ${page.slab}`} style={crookOf(index)}>
      <h3 className="flex items-center gap-2 text-2xl uppercase tracking-widest">
        <HitStar className="h-5 w-5" />
        {category.name}
      </h3>
      <TagList items={category.items} label={fillLabel(cards.categoryTechnologies, { name: category.name })} look={CHIPS} />
    </div>
  )
}

// A job as a rank card: the years stamped on its corner in big tilted calendar digits. A phone card is
// too narrow for the title to run beside the stamp, so there the title starts below it.
export function RankCard({ entry, index }: { entry: Job; index: number }) {
  const { cards, years } = useLabels()
  const job = jobCard(entry, years)

  return (
    <article className={`p-6 pt-14 sm:pt-9 ${page.slab} ${page.lift}`} style={crookOf(index)}>
      <p className="absolute -top-1 right-4">
        <span className={`block bg-[color:var(--noir-red-plate)] px-3 py-1 text-2xl text-[color:var(--noir-paper)] ${page.stamp}`}>{job.years}</span>
      </p>
      <h3 className="text-3xl leading-none tracking-wide">{job.title}</h3>
      <p className={`mt-1 text-sm font-bold uppercase tracking-wider text-[color:var(--noir-paper)] ${page.copy}`}>
        <SlashBreaks text={job.company} />
      </p>
      {job.location && <p className={`mt-1 text-sm font-bold text-[color:var(--noir-fog)] ${page.copy}`}>{job.location}</p>}
      {job.description && <p className={`mt-3 ${BODY}`}>{job.description}</p>}
      <MarkedLines items={job.highlights} label={cards.keyAchievements} look={BULLETS} />
      <TagList items={job.skills} label={cards.skillsUsed} look={CHIPS} />
    </article>
  )
}

// A project as a case file: its name and years, role, lines, impact on the red panel, details, stack and
// its links as paper buttons.
export function CaseFile({ slot, index }: { slot: ProjectSlot; index: number }) {
  const labels = useLabels()
  const { links, noLink } = slot
  const project = projectCard(slot.project, labels)

  return (
    <article className={`p-6 ${page.slab}`} style={crookOf(index)}>
      <h3 className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="min-w-0 text-3xl leading-none tracking-wide">
          <SlashBreaks text={project.name} />
        </span>
        {project.years && <span className={`whitespace-nowrap text-sm font-bold text-[color:var(--noir-fog)] ${page.copy}`}>{project.years}</span>}
      </h3>
      <p className={`mt-1 font-bold ${BODY}`}>{project.role}</p>
      {project.tagline && <p className={`mt-2 text-base text-[color:var(--noir-paper)] ${page.copy}`}>{project.tagline}</p>}
      {project.description && <p className={`mt-2 ${BODY}`}>{project.description}</p>}
      {project.impact && (
        <p className={`mt-4 inline-block px-3 py-1 text-sm font-bold ${page.heading} ${page.copy}`}>
          <ImpactLabel />
          {project.impact}
        </p>
      )}
      <MarkedLines items={project.details} label={labels.cards.details} look={BULLETS} />
      <TagList items={project.techStack} label={labels.cards.technologiesUsed} look={CHIPS} />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {links.map((link) => (
          <a key={link.kind} {...link.linkProps} className={`${NOIR_BUTTON} ${LOOK.paper}`}>
            {link.label}
          </a>
        ))}
        {noLink && <p className={`text-sm text-[color:var(--noir-fog)] ${page.copy}`}>{noLink}</p>}
      </div>
    </article>
  )
}

// A venture as a crooked slab; one of his own products (featured) carries a paper tag, ink capitals, pinned
// over the name. The link is named by everything the slab shows, its services included, plus the new tab
// note a screen reader alone hears.
export function CompanyTag({ company: entry, index }: { company: CVData['companies'][number]; index: number }) {
  const { links, cards, sections } = useLabels()
  const company = ventureCard(entry)

  return (
    <a href={company.url} target="_blank" rel="noopener noreferrer" className={`block h-full p-5 ${page.slab} ${page.kick}`} style={crookOf(index)}>
      {company.featured && (
        <span className="mb-3 inline-block -rotate-2 bg-[color:var(--noir-paper)] px-2 py-0.5 text-sm font-bold uppercase tracking-widest text-[color:var(--noir-ink)]">{cards.ownProduct}</span>
      )}
      <span className="flex items-center gap-3">
        <span className={company.featured ? 'text-4xl' : 'text-3xl'} aria-hidden="true">
          {company.icon}
        </span>
        <span className="min-w-0">
          <span className={`block tracking-wide ${company.featured ? 'text-3xl' : 'text-2xl'}`}>
            <SlashBreaks text={company.name} />
          </span>
          <span className={`block font-bold ${BODY}`}>{company.tagline}</span>
        </span>
      </span>
      <span className={`mt-2 block ${BODY}`}>{company.description}</span>
      <TagList items={company.services} label={sections.services} look={CHIPS} />
      <span className="sr-only"> {newTabHint(links)}</span>
    </a>
  )
}

// A band as a result panel.
export function BandPanel({ slot, index }: { slot: BandSlot; index: number }) {
  const { band, years, linkProps, release } = slot
  const body: ReactNode = (
    <>
      <span className="block text-3xl leading-none tracking-wide">{band.name}</span>
      <span className={`mt-2 block font-bold ${BODY}`}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </span>
      {release && (
        <span className={`mt-2 block ${BODY}`}>
          {release.label} <cite>&ldquo;{release.title}&rdquo;</cite>
        </span>
      )}
    </>
  )
  const look = `block p-6 ${page.slab} ${page.kick}`

  if (!linkProps)
    return (
      <article className={look} style={crookOf(index)}>
        {body}
      </article>
    )
  return (
    <a {...linkProps} className={look} style={crookOf(index)}>
      {body}
    </a>
  )
}

// A service as a slab, a title and its line, with no link to kick.
export function ServiceSlab({ service, index }: { service: Service; index: number }) {
  return (
    <div className={`p-5 ${page.slab}`} style={crookOf(index)}>
      <h3 className="text-2xl tracking-wide">{service.title}</h3>
      <p className={`mt-2 ${BODY}`}>{service.line}</p>
    </div>
  )
}
