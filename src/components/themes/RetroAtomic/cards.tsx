import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears, newTabName } from '@/components/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { TERMINAL_AMBER } from './palette'
import { RadiationSymbol } from './icons'
import world from './world.module.css'

// The selector tab and the cards each section lists.

const TAB_LOOK = {
  on: { frame: `border-atomic-phosphor ${world.tabLit}`, lamp: 'bg-atomic-yellow', label: `text-atomic-phosphor ${world.glowGreenSoft}` },
  off: { frame: 'border-atomic-phosphor-dim bg-transparent', lamp: 'bg-atomic-steel-light', label: 'text-atomic-phosphor-dim' },
}

// One tab of the shared profession switch: a panel lamp that lights over the chosen profession.
export function ProfessionTab({ label, selected, optionProps }: ProfessionOption) {
  const look = TAB_LOOK[selected ? 'on' : 'off']

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative w-full border-2 px-3 py-3 font-mono transition-all focus:outline-none focus-visible:ring-2 md:w-auto md:px-6 ${look.frame}`}
    >
      <span className={`mx-auto mb-2 block h-2.5 w-2.5 rounded-full ${look.lamp}`} aria-hidden="true" />
      <span className={`block text-sm font-bold uppercase tracking-wider ${look.label}`}>
        {selected && <span aria-hidden="true">{'> '}</span>}
        {label}
      </span>
    </button>
  )
}

const CHIP = 'border border-atomic-phosphor/25 bg-atomic-phosphor/10 px-2 py-0.5 text-sm text-atomic-phosphor-dim'

export function TechStackTerminal({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <div className="space-y-6 font-mono">
      {categories.map((cat, idx) => (
        <div key={cat.id}>
          <h3 className="mb-3 flex items-center gap-2 text-sm tracking-wider text-atomic-phosphor">
            <span className="text-atomic-yellow" aria-hidden="true">
              [{String(idx + 1).padStart(2, '0')}]
            </span>
            <span aria-hidden="true">{cat.icon}</span>
            {cat.name.toUpperCase()}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: cat.name })}>
            {cat.items.map((tech) => (
              <li key={tech} className="border border-atomic-phosphor bg-atomic-ink px-3 py-1 text-sm font-bold text-atomic-phosphor">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function ExperienceCard({ entry }: { entry: Job }) {
  const { years, cards } = useLabels()
  const { start: startYear, end: endYear } = jobYears(entry, years.present.toUpperCase())
  const frame = entry.endDate ? 'border-atomic-ash/25' : 'border-atomic-phosphor/25'

  return (
    <article className={`relative border p-4 font-mono ${world.wornCard} ${frame}`}>
      <div className="mb-2">
        <h3 className="text-base font-bold uppercase tracking-wide text-atomic-phosphor">{entry.title}</h3>
        <p className="mt-1 text-sm text-atomic-yellow">{entry.company}</p>
      </div>

      <div className="mb-3 inline-block border border-atomic-blue bg-atomic-blue/20 px-2 py-1 text-sm text-atomic-yellow">
        {startYear} - {endYear}
      </div>

      {entry.description && <p className="mb-3 text-sm text-atomic-ash">{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="space-y-1 border-t border-atomic-phosphor/20 pt-2" aria-label={cards.keyAchievements}>
          {entry.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-atomic-phosphor">
              <span className="text-atomic-amber" aria-hidden="true">
                +
              </span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {entry.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1" aria-label={cards.skillsUsed}>
          {entry.skills.slice(0, 5).map((skill) => (
            <li key={skill} className={CHIP}>
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

const LINK_BUTTON =
  'inline-flex min-h-[44px] items-center border-2 border-atomic-phosphor bg-atomic-ink px-4 text-sm font-bold uppercase tracking-wider text-atomic-phosphor transition-all hover:scale-105 focus:outline-none focus-visible:ring-2'

// A highlight project sits on rusted steel in yellow, the others on the phosphor screen in green.
const PROJECT_LOOK = {
  highlight: `${world.rust} ${world.highlightCard} border-atomic-yellow/30`,
  plain: `${world.phosphorScreen} border-atomic-phosphor/30`,
}

// His role, the result line and the links.
export function ProjectCard({ project, years, links }: ProjectSlot) {
  const labels = useLabels()
  return (
    <article className={`relative h-full border-2 p-4 font-mono ${PROJECT_LOOK[project.highlight ? 'highlight' : 'plain']}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold uppercase tracking-wide text-atomic-phosphor">{project.name}</h3>
        {years && <span className="whitespace-nowrap text-sm text-atomic-yellow">{years}</span>}
      </div>
      <p className="mt-1 text-sm font-bold text-atomic-yellow">{project.role}</p>
      <p className="mt-1 text-sm text-atomic-ash">{project.tagline}</p>

      {project.impact && (
        <p className="mt-3 flex items-start gap-2 border border-atomic-amber/25 bg-atomic-amber/5 p-2 text-sm text-atomic-amber">
          <RadiationSymbol size={12} color={TERMINAL_AMBER} />
          {project.impact}
        </p>
      )}

      {project.techStack.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1" aria-label={labels.cards.technologiesUsed}>
          {project.techStack.slice(0, 5).map((tech) => (
            <li key={tech} className={`${CHIP} font-bold`}>
              {tech}
            </li>
          ))}
        </ul>
      )}

      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(({ kind, label, linkProps }) => (
            <a key={kind} {...linkProps} className={LINK_BUTTON}>
              [{label}]
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-atomic-ash">{labels.links.noPublicLink}</p>
      )}
    </article>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  const { links } = useLabels()
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
      className={`block h-full border border-atomic-blue p-4 font-mono transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 ${world.phosphorScreen}`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {company.icon}
        </span>
        <div>
          <h3 className="text-base font-bold uppercase tracking-wide text-atomic-phosphor">{company.name}</h3>
          <p className="text-sm text-atomic-yellow">{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm text-atomic-ash">{company.description}</p>
    </a>
  )
}

// His role, the years and the release.
export function BandCard({ band, years, linkProps }: BandSlot) {
  const { links } = useLabels()
  const content = (
    <article className={`h-full border border-atomic-red/30 p-4 font-mono ${world.rust}`}>
      <h3 className="text-base font-bold uppercase tracking-wide text-atomic-red-light">{band.name}</h3>
      <p className="mt-1 text-sm text-atomic-yellow">
        {band.role}
        {years && <span aria-hidden="true"> {'//'} </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="mt-2 text-sm text-atomic-ash">
          {links.released} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2">
      {content}
    </a>
  )
}
