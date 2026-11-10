'use client'

import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MASONRY_ITEM, MASONRY_LIST, MASONRY_TILES } from '@/components/cv/masonry'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { drumsSince, jobYears, newTabName } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { CVData, Job, Service } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import type { Era } from './eras'
import type { Ending } from './level'
import { Level } from './levelWindow'
import css from './portals.module.css'

// The picked profession's sections, each a level in its own era with his moment at its end (level.ts), the
// CV under it on calm panels:
//   About          medieval village   the crate at the end
//   Experience     the tomb           the crate before the sphinx
//   Tech stack     under water        he swims; the crate under the coral arch
//   Services       the great wall     the crate before the watchtower
//   Projects       prehistoric        a crate on the path for each project
//   Ventures       future city        the crate under the neon gate
//   Bands          Arabian rooftops   two beats on the drum crates
//   Muay Thai      oriental courtyard the kick on the gong
// A level's number counts the levels the profession shows.

interface LevelSpec {
  key: string
  title: string
  era: Era
  ending: Ending
  crates?: number
  body: ReactNode
}

function Levels({ levels, profession }: { levels: LevelSpec[]; profession: 'engineer' | 'drummer' | 'fighter' }) {
  return (
    <>
      {levels.map(({ key, title, era, ending, crates, body }, index) => (
        <Level key={key} number={index + 1} title={title} era={era} ending={ending} profession={profession} crates={crates}>
          {body}
        </Level>
      ))}
    </>
  )
}

const FRUIT = <span className="mt-1.5 block h-3 w-3 shrink-0 rounded-full bg-[color:var(--np-fruit)] shadow-[inset_-2px_-2px_0_var(--np-band)]" aria-hidden="true" />

function JobCard({ entry }: { entry: Job }) {
  const { years } = useLabels()
  const { start, end } = jobYears(entry, years.present)

  return (
    <article aria-labelledby={`np-job-${entry.id}`} className={`p-5 ${css.panel}`}>
      <h3 id={`np-job-${entry.id}`} className={`text-xl leading-tight text-[color:var(--np-gold)] ${css.display}`}>
        {entry.title}
      </h3>
      <p className="mt-1 text-base font-bold text-[color:var(--np-white)]">
        <SlashBreaks text={entry.company} />
      </p>
      <p className="mt-1 text-sm font-bold tabular-nums text-[color:var(--np-muted)]">{fillLabel(years.range, { start, end })}</p>
      {entry.description && <p className="mt-3 text-base text-[color:var(--np-white)]">{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-2">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 text-base text-[color:var(--np-white)]">
              {FRUIT}
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function TechStack({ categories }: { categories: CVData['techStack'] }) {
  return (
    <ul className={MASONRY_LIST}>
      {categories.map((category) => (
        <li key={category.id} className={`${MASONRY_ITEM} p-5 ${css.panel}`}>
          <h3 className={`mb-3 flex items-center gap-2 text-lg text-[color:var(--np-gold)] ${css.display}`}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className={`${MASONRY_TILES} gap-1.5`}>
            {category.items.map((tech) => (
              <li key={tech} className="rounded-md bg-[color:var(--np-band)] px-2 py-1 text-sm text-[color:var(--np-white)]">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function Services({ services }: { services: Service[] }) {
  return (
    <ul className={MASONRY_LIST}>
      {services.map((service) => (
        <li key={service.id} className={`${MASONRY_ITEM} p-5 ${css.panel}`}>
          <h3 className={`mb-2 text-lg text-[color:var(--np-gold)] ${css.display}`}>{service.title}</h3>
          <p className="text-base text-[color:var(--np-white)]">{service.line}</p>
        </li>
      ))}
    </ul>
  )
}

function ProjectCard({ slot }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const { project, years, links } = slot

  return (
    <article aria-labelledby={`np-project-${project.id}`} className={`p-5 ${css.panel}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={`np-project-${project.id}`} className={`min-w-0 text-xl leading-tight text-[color:var(--np-gold)] ${css.display}`}>
          <SlashBreaks text={project.name} />
        </h3>
        {years && <span className="text-sm font-bold text-[color:var(--np-muted)]">{years}</span>}
      </div>
      <p className="mt-1 text-sm font-bold text-[color:var(--np-orange)]">{project.role}</p>
      <p className="mt-3 text-base text-[color:var(--np-white)]">{project.tagline}</p>
      {project.impact && (
        <p className="mt-3 rounded-lg border-l-4 border-[color:var(--np-orange)] bg-[color:var(--np-band)] px-3 py-2 text-base text-[color:var(--np-white)]">
          <span className="sr-only">{labels.cards.impact}: </span>
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={labels.cards.technologiesUsed}>
          {project.techStack.map((tech) => (
            <li key={tech} className="rounded-md bg-[color:var(--np-band)] px-2 py-0.5 text-sm text-[color:var(--np-white)]">
              {tech}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {links.length > 0 ? (
          links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={`${css.button} ${css.quiet}`}>
              {label}
            </a>
          ))
        ) : (
          <p className="text-sm text-[color:var(--np-muted)]">{labels.links.noPublicLink}</p>
        )}
      </div>
    </article>
  )
}

// His own products (featured) are the two wide panels of the first row with the own product badge; the
// other ventures follow three to a row.
function Ventures({ companies }: { companies: CVData['companies'] }) {
  const { links, cards } = useLabels()
  return (
    <ul className="grid gap-6 md:grid-cols-6">
      {companies.map((company) => (
        <li key={company.id} className={company.featured ? 'md:col-span-3' : 'md:col-span-2'}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={newTabName(links, `${company.featured ? `${cards.ownProduct}, ` : ''}${company.name}: ${company.tagline}`)}
            className={`block h-full p-5 ${css.panel}`}
          >
            {company.featured && <span className={`mb-3 inline-block px-3 py-0.5 text-sm ${css.chip}`}>{cards.ownProduct}</span>}
            <span className="flex items-center gap-3">
              <span className={company.featured ? 'text-3xl' : 'text-2xl'} aria-hidden="true">
                {company.icon}
              </span>
              <span>
                <span className={`block text-[color:var(--np-gold)] ${company.featured ? 'text-2xl' : 'text-xl'} ${css.display}`}>{company.name}</span>
                <span className="block text-sm text-[color:var(--np-muted)]">{company.tagline}</span>
              </span>
            </span>
            <span className="mt-3 block text-base text-[color:var(--np-white)]">{company.description}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function EngineerLevels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const labels = useLabels()
  const levels: LevelSpec[] = [
    {
      key: 'about',
      title: labels.sections.about,
      era: 'medieval',
      ending: 'crate',
      body: <p className={`max-w-prose p-6 text-lg leading-relaxed text-[color:var(--np-white)] ${css.panel}`}>{professionalSummary.bio}</p>,
    },
    ...(sections.jobs.length > 0
      ? [
          {
            key: 'jobs',
            title: labels.sections.workExperience,
            era: 'tomb' as const,
            ending: 'crate' as const,
            body: (
              <ul className={MASONRY_LIST}>
                {sections.jobs.map((entry) => (
                  <li key={entry.id} className={MASONRY_ITEM}>
                    <JobCard entry={entry} />
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    { key: 'tech', title: labels.sections.techStack, era: 'underwater', ending: 'crate', body: <TechStack categories={sections.techStack} /> },
    ...(sections.services.length > 0 ? [{ key: 'services', title: labels.sections.services, era: 'wall' as const, ending: 'crate' as const, body: <Services services={sections.services} /> }] : []),
    {
      key: 'projects',
      title: labels.sections.projects,
      era: 'prehistoric',
      ending: 'crates',
      crates: sections.projects.length,
      body: <ProjectList projects={sections.projects} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderProject={(slot) => <ProjectCard key={slot.project.id} slot={slot} />} />,
    },
    { key: 'ventures', title: labels.sections.ventures, era: 'future', ending: 'crate', body: <Ventures companies={sections.companies} /> },
  ]
  return <Levels levels={levels} profession="engineer" />
}

function BandCard({ slot }: { slot: BandSlot }) {
  const { links } = useLabels()
  const band = slot.band
  const { years, linkProps } = slot

  return (
    <article aria-labelledby={`np-band-${band.id}`} className={`p-5 ${css.panel}`}>
      <h3 id={`np-band-${band.id}`} className={`text-xl leading-tight text-[color:var(--np-gold)] ${css.display}`}>
        {linkProps ? (
          <a {...linkProps} className="underline decoration-[color:var(--np-orange)] decoration-4 underline-offset-4">
            {band.name}
          </a>
        ) : (
          band.name
        )}
      </h3>
      <p className="mt-1 text-sm font-bold text-[color:var(--np-orange)]">{band.role}</p>
      {years && <p className="mt-1 text-sm text-[color:var(--np-muted)]">{years}</p>}
      {band.release && (
        <p className="mt-2 text-base text-[color:var(--np-white)]">
          {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )
}

function MusicianLevels({ sections }: { sections: SectionsOf<'drummer'> }) {
  const labels = useLabels()
  const { musician, bands } = sections
  const body = (
    <>
      <p className={`mb-4 w-fit px-4 py-2 text-lg font-bold text-[color:var(--np-gold)] ${css.panel}`}>{drumsSince(musician, labels.years)}</p>
      <BandList
        bands={bands}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderBand={(slot) => <BandCard slot={slot} />}
      />
      <p className={`mt-2 w-fit max-w-full px-4 py-2 text-base italic text-[color:var(--np-white)] ${css.panel}`}>{musician.line}</p>
    </>
  )
  return <Levels levels={[{ key: 'bands', title: labels.sections.bands, era: 'arabian', ending: 'drum', body }]} profession="drummer" />
}

function MartialArtistLevels({ sections }: { sections: SectionsOf<'fighter'> }) {
  const labels = useLabels()
  const { martialArts } = sections
  const body = (
    <>
      <h3 className={`mb-5 w-fit max-w-full px-4 py-2 text-2xl text-[color:var(--np-gold)] ${css.display} ${css.panel}`}>{martialArts.primary.title}</h3>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'mb-8 grid gap-4 sm:grid-cols-2',
          fact: `${css.panel} p-4`,
          term: 'text-sm font-black uppercase tracking-wide text-[color:var(--np-gold)]',
          value: 'mt-1 text-base text-[color:var(--np-white)]',
          achievements: 'space-y-3',
        }}
        renderAchievement={(achievement) => (
          <span className={`flex items-start gap-3 px-4 py-3 text-base text-[color:var(--np-white)] ${css.panel}`}>
            {FRUIT}
            {achievement}
          </span>
        )}
      />
    </>
  )
  return <Levels levels={[{ key: 'muayThai', title: labels.sections.muayThai, era: 'courtyard', ending: 'gong', body }]} profession="fighter" />
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerLevels,
  drummer: MusicianLevels,
  fighter: MartialArtistLevels,
}
