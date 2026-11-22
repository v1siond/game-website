import type { ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { Job } from '@/lib/cv/content'
import { jobCard, projectCard } from '@/lib/cv/cvView'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { TYPEWRITER } from './palette'
import world from './world.module.css'

// Silhouette's panels and cards: near black slabs with a hard black offset shadow, the way a silhouette
// game frames its few words, the section header, and the job and project cards the rope (./ropes) and
// the sawmill floor (./mill) hold.

const CARD_TITLE = 'text-sm font-bold uppercase tracking-wider text-[color:var(--sh-text)]'
const CARD_META = 'text-sm tracking-wider text-[color:var(--sh-dim-text)]'
const CARD_BODY = 'text-sm leading-relaxed text-[color:var(--sh-muted-text)]'

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className={`relative border-l-4 border-[color:var(--sh-black)] ${world.panel}`}>
      <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-[color:var(--sh-edge)]" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[color:var(--sh-edge)]" aria-hidden="true" />
      <div className="relative p-5">{children}</div>
    </div>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <div className={`relative h-full border-2 border-[color:var(--sh-black)] p-4 ${world.card}`}>{children}</div>
}

export function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-[color:var(--sh-fog)]" aria-hidden="true" />
      <h2 id={id} className={`text-sm uppercase tracking-[0.4em] text-[color:var(--sh-muted-text)] ${TYPEWRITER}`}>
        {title}
      </h2>
      <div className="h-px flex-1 bg-[color:var(--sh-fog)]" aria-hidden="true" />
    </div>
  )
}

// A list in the card's body type, each line behind the dash every Silhouette card marks its points with.
const DASH_LIST: MarkedLinesLook = {
  list: 'mt-2 space-y-1',
  line: `flex items-start gap-1.5 ${CARD_BODY}`,
  marker: (
    <span className="text-[color:var(--sh-dim-text)]" aria-hidden="true">
      -
    </span>
  ),
}

// Every field of the job's card, the years in the label ("2019 to 2022").
export function ExperienceCard({ entry }: { entry: Job }) {
  const { years, cards } = useLabels()
  const job = jobCard(entry, years)

  return (
    <article className={`border-l-4 border-[color:var(--sh-black)] p-4 ${world.card}`}>
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={CARD_TITLE}>{job.title}</h3>
          <p className={`mt-0.5 ${CARD_META}`}>
            <SlashBreaks text={job.company} />
          </p>
          {job.location && <p className={`mt-0.5 ${CARD_META}`}>{job.location}</p>}
        </div>
        <span className={`whitespace-nowrap uppercase ${CARD_META}`}>
          {job.years}
        </span>
      </div>
      {job.description && <p className={`mt-2 ${CARD_BODY}`}>{job.description}</p>}
      <MarkedLines items={job.highlights} label={cards.keyAchievements} look={DASH_LIST} />
      {job.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <span key={skill} className="border border-[color:var(--sh-edge)] px-1.5 py-0.5 text-sm uppercase text-[color:var(--sh-dim-text)]">
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

// Every field of the project's card, and the links with their names from the slot.
export function ProjectCard({ project: entry, links }: ProjectSlot) {
  const labels = useLabels()
  const { cards } = labels
  const project = projectCard(entry, labels)
  return (
    <Card>
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
          <span className="sr-only">{cards.impact}: </span>
          {project.impact}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span key={tech} className="bg-[color:var(--sh-black)] px-1.5 py-0.5 text-sm uppercase tracking-wider text-[color:var(--sh-muted-text)]">
            {tech}
          </span>
        ))}
      </div>
      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className={`inline-flex min-h-[44px] items-center border-2 border-[color:var(--sh-text)] px-3 text-sm uppercase tracking-[0.2em] text-[color:var(--sh-text)] transition-colors hover:bg-[color:var(--sh-glow)] hover:text-[color:var(--sh-black)]`}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </Card>
  )
}

// His education and languages on the slab, each label in the meta type.
const SLAB_FACTS: AboutFactsLook = {
  list: 'space-y-2',
  fact: '',
  term: `uppercase ${CARD_META}`,
  value: CARD_BODY,
}

// His education, languages and summary highlights under the chase, on the slab the job cards use.
export function AboutSlab() {
  const { cards } = useLabels()
  const { highlights } = useAboutBlock()

  return (
    <div className={`mx-auto mt-6 max-w-prose border-l-4 border-[color:var(--sh-black)] p-4 ${world.card}`}>
      <AboutFacts look={SLAB_FACTS} />
      <MarkedLines items={highlights} label={cards.keyAchievements} look={DASH_LIST} />
    </div>
  )
}
