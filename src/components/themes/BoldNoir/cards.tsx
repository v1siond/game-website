import type { CSSProperties, ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job, Service } from '@/lib/cv/content'
import { newTabHint } from '@/lib/cv/sectionText'
import { jobCard, ventureCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { HitStar } from './backdrop'
import world from './world.module.css'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'

// The cards each section lists, each a crooked slab whose words sit level so they read. Every card sits
// in two layers: the outer one plays the entrance once when its stage fires (rank flip, result slide),
// the inner one answers the pointer (lift, kick), so the entrance's held final frame never fights the
// hover.

const BODY = `text-sm text-[color:var(--noir-paper-dim)] ${world.copy}`
const CHIP = `px-2 py-0.5 text-sm font-bold ${world.chip} ${world.copy}`

// Three crooked outlines the cards take in turn, so no two neighbours share their slant.
const CROOKS = [
  'polygon(0 2%, 100% 0, 98.5% 100%, 1.2% 97%)',
  'polygon(1.5% 0, 99% 3%, 100% 96%, 0 100%)',
  'polygon(0 0, 98% 2.5%, 100% 100%, 2% 97.5%)',
]

/** The --i the stage staggers an entrance by, the tilt a card rests at on hover and its crooked outline. */
export const orderVars = (index: number): CSSProperties =>
  ({ '--i': index, '--tilt': `${index % 2 ? 1.5 : -1.5}deg`, '--crook': CROOKS[index % CROOKS.length] }) as CSSProperties

/** A card's tag chips. */
export const CHIPS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: CHIP,
}

/** Rows behind a red diamond, the highlights or details of a card, in the dim paper of a slab (the About
 *  statement sets the ink of its speech box over it). */
export const BULLETS: MarkedLinesLook = {
  list: 'mt-3 space-y-1.5',
  line: `flex items-start gap-2 ${BODY}`,
  marker: <span className="mt-1 block h-2.5 w-2.5 flex-shrink-0 rotate-45 bg-[color:var(--noir-red)]" aria-hidden="true" />,
}

export function TechStackBoard({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <li key={category.id} className={MASONRY_ITEM}>
          <h3 className="flex items-center gap-2 text-2xl uppercase tracking-widest">
            <HitStar className="h-5 w-5" />
            {category.name}
          </h3>
          <TagList items={category.items} label={fillLabel(cards.categoryTechnologies, { name: category.name })} look={CHIPS} />
        </li>
      ))}
    </ul>
  )
}

// A job as a rank card: the years stamped on its corner in big tilted calendar digits. A phone card is
// too narrow for the title to run beside the stamp, so there the title starts below it.
export function RankCard({ entry, index }: { entry: Job; index: number }) {
  const { cards, years } = useLabels()
  const job = jobCard(entry, years)

  return (
    <div className={world.rank} style={orderVars(index)}>
      <article className={`p-6 pt-14 sm:pt-9 ${world.slab} ${world.lift}`}>
        <p className={`absolute -top-1 right-4 ${world.stamp}`}>
          <span className={`block bg-[color:var(--noir-red-plate)] px-3 py-1 text-2xl text-[color:var(--noir-paper)] ${world.stampRest}`}>
            {job.years}
          </span>
        </p>
        <h3 className="text-3xl leading-none tracking-wide">{job.title}</h3>
        <p className={`mt-1 font-bold uppercase tracking-wider text-[color:var(--noir-paper)] ${world.copy} text-sm`}>
          <SlashBreaks text={job.company} />
        </p>
        {job.location && <p className={`mt-1 text-sm font-bold text-[color:var(--noir-fog)] ${world.copy}`}>{job.location}</p>}
        {job.description && <p className={`mt-3 ${BODY}`}>{job.description}</p>}
        <MarkedLines items={job.highlights} label={cards.keyAchievements} look={BULLETS} />
        <TagList items={job.skills} label={cards.skillsUsed} look={CHIPS} />
      </article>
    </div>
  )
}

// A project as a case card: a button that opens the project's finish card through the all-out rush.
export function CaseCard({ slot, index, onOpen }: { slot: ProjectSlot; index: number; onOpen: (slot: ProjectSlot, trigger: HTMLButtonElement) => void }) {
  const { project, years } = slot

  return (
    <div className={world.result} style={orderVars(index)}>
      <button
        type="button"
        onClick={(event) => onOpen(slot, event.currentTarget)}
        aria-haspopup="dialog"
        className={`group block w-full bg-transparent p-6 text-left text-[color:var(--noir-paper)] ${world.slab} ${world.kick}`}
      >
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="min-w-0 text-3xl leading-none tracking-wide">
            <SlashBreaks text={project.name} />
          </span>
          {years && <span className={`whitespace-nowrap text-sm font-bold text-[color:var(--noir-fog)] ${world.copy}`}>{years}</span>}
        </span>
        <span className={`mt-1 block font-bold ${BODY}`}>{project.role}</span>
        {project.tagline && <span className={`mt-2 block ${BODY}`}>{project.tagline}</span>}
        <span className="mt-4 flex justify-end" aria-hidden="true">
          <HitStar className="h-8 w-8 transition-transform duration-150 group-hover:rotate-45 group-hover:scale-125 motion-reduce:transition-none" />
        </span>
      </button>
    </div>
  )
}

// A venture as a crooked slab; one of his own products (featured) is a wider slab with a paper tag, ink
// capitals, pinned over the name. The link is named by everything the slab shows, its services included,
// plus the new tab note a screen reader alone hears.
export function CompanyTag({ company: entry }: { company: CVData['companies'][number] }) {
  const { links, cards, sections } = useLabels()
  const company = ventureCard(entry)

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block h-full p-5 ${world.slab} ${world.kick}`}
    >
      {company.featured && (
        <span className="mb-3 inline-block -rotate-2 bg-[color:var(--noir-paper)] px-2 py-0.5 text-sm font-bold uppercase tracking-widest text-[color:var(--noir-ink)]">
          {cards.ownProduct}
        </span>
      )}
      <span className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
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

// A band as a result panel sliding in from the side.
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
  const look = `block p-6 ${world.slab} ${world.kick}`

  return (
    <div className={world.result} style={orderVars(index)}>
      {linkProps ? (
        <a {...linkProps} className={look}>
          {body}
        </a>
      ) : (
        <article className={look}>{body}</article>
      )}
    </div>
  )
}

// A service on the ventures' slab, a title and its line, with no link to kick.
export function ServiceSlab({ service }: { service: Service }) {
  return (
    <div className={`p-5 ${world.slab}`}>
      <h3 className="text-2xl tracking-wide">{service.title}</h3>
      <p className={`mt-2 ${BODY}`}>{service.line}</p>
    </div>
  )
}
