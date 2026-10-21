import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { CT_COLORS } from './palette'

// =============================================================================
// CONTENT CARDS
// =============================================================================

// Experience Card. Dates are date only strings (UTC midnight), so the year is read in UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article
      className="p-4 transition-all hover:bg-white/5"
      style={{
        border: `2px solid ${CT_COLORS.portalBlue}40`,
        background: `linear-gradient(180deg, ${CT_COLORS.voidMid}40 0%, ${CT_COLORS.voidDark} 100%)`,
      }}
      aria-label={`${entry.title} at ${entry.company}, ${startDisplay} to ${endDisplay}`}
    >
      <div className="flex justify-between items-start gap-3 mb-3 flex-wrap">
        <div>
          <h3 className="text-sm tracking-wide flex items-center gap-2" style={{ color: CT_COLORS.white }}>
            <span style={{ color: CT_COLORS.medievalGreen }} aria-hidden="true">▸</span>
            {entry.title}
          </h3>
          <p className="text-sm mt-1" style={{ color: CT_COLORS.gold }}>
            @ {entry.company}
          </p>
        </div>
        <span className="text-sm tabular-nums tracking-wider px-2 py-1"
          style={{
            color: CT_COLORS.futureChrome,
            background: CT_COLORS.voidDark,
            border: `1px solid ${CT_COLORS.futureChrome}40`,
          }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-3 leading-relaxed" style={{ color: CT_COLORS.silver }}>
          {entry.description}
        </p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: CT_COLORS.atbGreen }}>
              <span style={{ color: CT_COLORS.portalMagenta }} aria-hidden="true">◇</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1 mt-3" aria-label="Skills used">
          {entry.skills.slice(0, 5).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-1"
              style={{
                color: CT_COLORS.portalBlueBright,
                border: `1px solid ${CT_COLORS.portalBlue}40`,
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Project Card: his role, the result line and the links that open the project, each a menu command
export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <article
      className="h-full p-4"
      style={{
        border: `2px solid ${CT_COLORS.white}`,
        background: CT_COLORS.voidDark,
      }}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-sm flex items-center gap-2 tracking-wide" style={{ color: CT_COLORS.white }}>
          <span style={{ color: CT_COLORS.cronoOrange }} aria-hidden="true">◈</span>
          {project.name}
        </h3>
        {years && (
          <span className="text-sm whitespace-nowrap" style={{ color: CT_COLORS.futureChrome }}>
            {years}
          </span>
        )}
      </div>
      <p className="text-sm mb-2" style={{ color: CT_COLORS.gold }}>
        {project.role}
      </p>
      <p className="text-sm mb-2" style={{ color: CT_COLORS.silver }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-sm flex items-start gap-2 mb-3" style={{ color: CT_COLORS.atbGreen }}>
          <span style={{ color: CT_COLORS.gold }} aria-hidden="true">★</span>
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex flex-wrap gap-1" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-1"
              style={{
                border: `1px solid ${CT_COLORS.portalBlue}60`,
                color: CT_COLORS.portalBlueBright,
              }}
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-sm tracking-wide transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2"
              style={{ border: `2px solid ${CT_COLORS.portalBlue}`, color: CT_COLORS.portalBlueBright }}
            >
              <span className="mr-2" aria-hidden="true">▶</span>
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-3" style={{ color: CT_COLORS.silver }}>No public link</p>
      )}
    </article>
  )
}

// Company Card (Ventures)
export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all group hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        border: `2px solid ${CT_COLORS.futureChrome}`,
        background: `linear-gradient(180deg, ${CT_COLORS.voidMid} 0%, ${CT_COLORS.voidDark} 100%)`,
        '--tw-ring-color': CT_COLORS.futureChrome,
      } as React.CSSProperties}
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-sm tracking-wide" style={{ color: CT_COLORS.white }}>
            {company.name}
          </h3>
          <p className="text-sm mt-1" style={{ color: CT_COLORS.gold }}>
            {company.tagline}
          </p>
        </div>
      </div>
      <p className="text-sm mb-3" style={{ color: CT_COLORS.silver }}>
        <span aria-hidden="true">◇ </span>
        {company.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {company.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-sm px-2 py-1"
            style={{
              border: `1px solid ${CT_COLORS.futureChrome}50`,
              color: CT_COLORS.futureChrome,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// Band Card
export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-all"
      style={{
        border: `2px solid ${CT_COLORS.portalPurple}`,
        background: `linear-gradient(180deg, ${CT_COLORS.lavosPurple}20 0%, ${CT_COLORS.voidDark} 100%)`,
      }}
    >
      <h3 className="text-sm tracking-wide flex items-center gap-2" style={{ color: CT_COLORS.white }}>
        <span style={{ color: CT_COLORS.portalMagenta }} aria-hidden="true">♫</span>
        {band.name}
      </h3>
      <p className="text-sm mt-2" style={{ color: CT_COLORS.portalMagenta }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: CT_COLORS.silver }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps}
      className="block h-full hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': CT_COLORS.portalPurple } as React.CSSProperties}>
      {content}
    </a>
  )
}

// Tech Inventory (Engineer tech stack)
export function TechInventory({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="text-sm mb-3 flex items-center gap-2 tracking-widest" style={{ color: CT_COLORS.futureChrome }}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="text-sm px-3 py-2 flex items-center gap-2 transition-colors hover:bg-white/10"
                style={{
                  border: `1px solid ${CT_COLORS.portalBlue}60`,
                  color: CT_COLORS.white,
                }}
              >
                <span style={{ color: CT_COLORS.atbGreen, fontSize: '6px' }} aria-hidden="true">●</span>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
