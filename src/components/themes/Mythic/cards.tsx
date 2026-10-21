import { memo } from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { GOW } from './palette'

// =============================================================================
// TECH CLOUD (Engineer skills)
// =============================================================================
export const TechCloud = memo(function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-[0.15em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: GOW.silver }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1 text-sm transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `${GOW.gold}12`,
                  border: `1px solid ${GOW.gold}30`,
                  color: GOW.bone,
                  borderRadius: '3px',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
})

// =============================================================================
// PROJECT CARD - his role, the years, the result and the links
// =============================================================================
export const ProjectCard = memo(function ProjectCard({ slot: { project, years, links } }: { slot: ProjectSlot }) {
  return (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${GOW.void}, ${GOW.voidWarm}50)`,
        border: `1px solid ${GOW.stormBrown}`,
        borderRadius: '4px',
      }}
    >
      <h3 className="text-lg transition-colors" style={{ color: GOW.bone }}>
        {project.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: GOW.gold }}>
        {project.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      <p className="text-sm mt-2" style={{ color: GOW.silver }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 italic" style={{ color: GOW.goldBright }}>
          <span className="sr-only">Impact: </span>{project.impact}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3" aria-label="Technologies used">
        {project.techStack.map((tech) => (
          <span key={tech} className="text-sm px-1 py-0.5" style={{ background: `${GOW.gold}12`, color: GOW.silver }}>
            {tech}
          </span>
        ))}
      </div>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-sm tracking-[0.15em] uppercase transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c040] border border-[#c9a227]/40 text-[#c9a227] bg-black/80 rounded-[3px]"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </article>
  )
})

// =============================================================================
// COMPANY CARD
// =============================================================================
export const CompanyCard = memo(function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-transform hover:scale-[1.02] group min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        background: `linear-gradient(135deg, ${GOW.void}, ${GOW.voidWarm}40)`,
        border: `1px solid ${GOW.stormBrown}`,
        borderRadius: '4px',
      }}
      aria-label={`${company.name}, ${company.tagline} (opens in a new tab)`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-lg transition-colors" style={{ color: GOW.bone }}>
            {company.name}
          </h3>
          <p className="text-sm" style={{ color: GOW.gold }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: GOW.silver }}>{company.description}</p>
    </a>
  )
})

// =============================================================================
// BAND CARD
// =============================================================================
export const BandCard = memo(function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${GOW.void}, ${GOW.fire}15)`,
        border: `1px solid ${GOW.fire}40`,
        borderRadius: '4px',
      }}
    >
      <h3 className="text-lg transition-colors" style={{ color: GOW.bone }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: GOW.fireGlow }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: GOW.silver }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a
      {...linkProps}
      className="block h-full min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e05000] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {content}
    </a>
  )
})

// =============================================================================
// EXPERIENCE CARD. Dates are date only strings (UTC midnight), so the year is read in UTC: a
// January start keeps its own year west of UTC.
// =============================================================================
export const ExperienceCard = memo(function ExperienceCard({ entry, isLast }: { entry: Job; isLast?: boolean }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article className="py-4">
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-medium" style={{ color: GOW.bone }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: GOW.gold }}>{entry.company}</p>
        </div>
        <span className="text-sm" style={{ color: GOW.gold }}>
          <time>{startDisplay}</time> - <time>{endDisplay}</time>
        </span>
      </div>
      {entry.description && <p className="text-sm mb-2" style={{ color: GOW.silver }}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: GOW.bone }}>
              <span style={{ color: GOW.bloodBright }} aria-hidden="true">◆</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {!isLast && (
        <div
          className="mt-4"
          style={{ borderBottom: `1px solid ${GOW.stormBrown}40` }}
        />
      )}
    </article>
  )
})
