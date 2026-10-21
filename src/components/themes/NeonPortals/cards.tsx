import type { ReactNode } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears, headingId } from '@/components/cv/sectionText'

// Neon Portals' panels and cards. Static classes only (no blur, no animated glow), so a card costs
// nothing while the page scrolls; the scenes in scenes.tsx move them. Colours are the palette.ts values.

export type PortalSide = 'orange' | 'blue'

// Entries alternate the two portal colours, in then out, down a list.
export const sideOf = (index: number): PortalSide => (index % 2 === 0 ? 'orange' : 'blue')

const SIDE_LOOK: Record<PortalSide, { text: string; border: string; chip: string; dot: string }> = {
  orange: {
    text: 'text-[#ff9a00]',
    border: 'border-[#ff9a00]/40',
    chip: 'bg-[#ff9a00]/10 text-[#ff9a00]',
    dot: 'bg-[#ff9a00]',
  },
  blue: {
    text: 'text-[#00a2ff]',
    border: 'border-[#00a2ff]/40',
    chip: 'bg-[#00a2ff]/10 text-[#00a2ff]',
    dot: 'bg-[#00a2ff]',
  },
}

const panelId = (title: string) => headingId('portal', title)

const LINK_FOCUS = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07060f]'

// A chamber panel: a dark panel framed by an orange seam on its left (where he comes in) and a blue seam
// on its right (where he leaves).
export function ChamberPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="relative" aria-labelledby={panelId(title)}>
      <div className="relative border border-[#2c2a3d] border-l-2 border-l-[#ff9a00] border-r-2 border-r-[#00a2ff] bg-[#12111c]/95 px-4 py-5 sm:px-6">
        <header className="mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#ff9a00]/50" aria-hidden="true" />
          <h2 id={panelId(title)} className="text-sm font-medium uppercase tracking-[0.2em] text-[#00a2ff]">
            {title}
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-[#00a2ff]/50 to-transparent" aria-hidden="true" />
        </header>
        {children}
      </div>
    </section>
  )
}

export function TechCategoryList({ categories }: { categories: CVData['techStack'] }) {
  return (
    <ul className="space-y-6">
      {categories.map((category, index) => {
        const look = SIDE_LOOK[sideOf(index)]
        return (
          <li key={category.id}>
            <h3 className={`mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.12em] ${look.text}`}>
              <span aria-hidden="true">{category.icon}</span>
              {category.name}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {category.items.map((tech) => (
                <li key={tech} className="border border-[#2c2a3d] bg-[#1c1b29] px-2 py-1 text-sm text-[#edebe4]">
                  {tech}
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

export function ExperienceCard({ entry, index }: { entry: Job; index: number }) {
  const look = SIDE_LOOK[sideOf(index)]
  const { start, end } = jobYears(entry, 'Present')

  return (
    <article className={`border bg-[#12111c] p-4 ${look.border}`} aria-labelledby={`portal-exp-${entry.id}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id={`portal-exp-${entry.id}`} className="text-base font-medium text-[#edebe4]">
            {entry.title}
          </h3>
          <p className={`mt-0.5 text-sm ${look.text}`}>{entry.company}</p>
        </div>
        <span className={`px-1.5 py-0.5 text-sm tracking-wider ${look.chip}`}>
          {start} - {end}
        </span>
      </div>
      {entry.description && <p className="mb-2 text-sm text-[#a9a6b8]">{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1.5">
          {entry.highlights.map((highlight, i) => (
            <li key={highlight} className="flex items-start gap-2 text-sm text-[#edebe4]">
              <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${SIDE_LOOK[sideOf(i)].dot}`} aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function ProjectCard({ slot: { project, years, links }, index }: { slot: ProjectSlot; index: number }) {
  const look = SIDE_LOOK[sideOf(index)]

  return (
    <article className="h-full bg-[#12111c] p-4" aria-labelledby={`portal-project-${project.id}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 id={`portal-project-${project.id}`} className={`text-base font-medium ${look.text}`}>
          {project.name}
        </h3>
        {years && <span className="whitespace-nowrap text-sm text-[#a9a6b8]">{years}</span>}
      </div>
      <p className="mt-1 text-sm text-[#b57bff]">{project.role}</p>
      <p className="mb-2 mt-1 text-sm text-[#a9a6b8]">{project.tagline}</p>

      {project.impact && (
        <p className="mb-2 border-l-2 border-[#00a2ff] bg-[#00a2ff]/5 px-2 py-1 text-sm italic text-[#edebe4]">
          {project.impact}
        </p>
      )}

      <ul className="flex flex-wrap gap-1">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <li key={tech} className={`px-1.5 py-0.5 text-sm ${SIDE_LOOK[sideOf(i)].chip}`}>
            {tech}
          </li>
        ))}
      </ul>

      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map(({ kind, label, linkProps }, i) => (
            <a
              key={kind}
              {...linkProps}
              className={`inline-flex min-h-[44px] items-center border-[1.5px] px-3 text-sm uppercase tracking-wider transition-colors hover:bg-white/5 ${LINK_FOCUS} ${
                i % 2 === 0 ? 'border-[#ff9a00] text-[#ff9a00]' : 'border-[#00a2ff] text-[#00a2ff]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

export function VentureCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block h-full border border-[#00a2ff]/30 bg-[#12111c] p-4 transition-colors hover:border-[#00a2ff] ${LINK_FOCUS}`}
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-base text-[#edebe4]">{company.name}</h3>
          <p className="text-sm text-[#ff9a00]">{company.tagline}</p>
        </div>
      </div>
      <p className="mb-2 text-sm text-[#a9a6b8]">{company.description}</p>
      <ul className="flex flex-wrap gap-1">
        {company.services.slice(0, 3).map((service) => (
          <li key={service} className="bg-[#00a2ff]/10 px-1.5 py-0.5 text-sm text-[#00a2ff]">
            {service}
          </li>
        ))}
      </ul>
    </a>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article className="h-full bg-[#12111c] p-4">
      <h3 className="text-base text-[#edebe4]">{band.name}</h3>
      <p className="mt-0.5 text-sm text-[#ff9a00]">
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="mt-1.5 text-sm text-[#a9a6b8]">
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className={`block h-full ${LINK_FOCUS}`}>
      {content}
    </a>
  )
}
