import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { COLORS } from './palette'
import { Darksign } from './art'

// Save room style project card - bonfire checkpoint with his role, the years, the result and the links
export function SaveRoomCard({ slot: { project, years, links } }: { slot: ProjectSlot }) {
  return (
    <article
      className="h-full p-4 group transition-all relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
    >
      {/* Ember glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${COLORS.bonfire}10, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Save point indicator - small ember */}
      <div className="flex items-center gap-2 mb-1 relative">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{
            background: project.featured
              ? `radial-gradient(circle, ${COLORS.gold}, ${COLORS.bonfire})`
              : `radial-gradient(circle, #666, ${COLORS.ash})`,
            boxShadow: project.featured ? `0 0 10px ${COLORS.bonfire}60` : 'none',
          }}
          aria-hidden="true"
        />
        <h3 className="text-sm tracking-wide" style={{ color: project.featured ? '#ffaa66' : '#c0b0a0' }}>
          {project.name}
        </h3>
      </div>
      <p className="text-sm mb-2 relative" style={{ color: COLORS.ember }}>
        {project.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      <p className="text-sm mb-2 leading-relaxed relative" style={{ color: '#a09080' }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-sm mb-3 leading-relaxed relative" style={{ color: '#b0a090' }}>
          {project.impact}
        </p>
      )}
      <div className="flex gap-1 flex-wrap mb-3 relative">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="text-sm px-2 py-0.5 tracking-wide"
            style={{ background: '#1a1815', color: '#a09080', border: `1px solid ${COLORS.ash}` }}
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 relative">
        {links.map(({ kind, label, linkProps }) => (
          <a
            key={kind}
            {...linkProps}
            className="inline-flex items-center min-h-[44px] px-3 text-sm tracking-[0.15em] uppercase transition-all hover:bg-[#1a1815] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6a00] border border-[#ff6a00]/40 text-[#ff8c42] bg-[#252321]"
          >
            {label}
          </a>
        ))}
      </div>
    </article>
  )
}

// Company card - Dark Souls merchant style
export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 group transition-all relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
      aria-label={`${company.name}, ${company.tagline} (opens in a new tab)`}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${COLORS.bonfire}10, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3 mb-2 relative">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-sm tracking-wide group-hover:text-orange-300 transition-colors" style={{ color: '#c0a080' }}>
            {company.name}
          </h3>
          <p className="text-sm" style={{ color: COLORS.bonfire }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed relative" style={{ color: '#a09080' }}>{company.description}</p>

      {/* External link indicator */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
        <span className="text-sm" style={{ color: `${COLORS.bonfire}60` }}>TRAVEL</span>
      </div>
    </a>
  )
}

// Band card - Dark Souls covenant style
export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 group transition-all relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
    >
      {/* Hover glow - purple for music */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, #9966ff10, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <h3 className="text-sm tracking-wide group-hover:text-purple-300 transition-colors relative" style={{ color: '#c0a0e0' }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1 relative" style={{ color: '#b090ff' }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm mt-2 leading-relaxed relative" style={{ color: '#a09080' }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9966ff]">
      {content}
    </a>
  )
}

// Work experience card - Dark Souls item description style. Dates are date only strings (UTC
// midnight), so the year is read in UTC: a January start keeps its own year west of UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article
      className="p-4 relative"
      style={{
        background: `linear-gradient(180deg, #12100f, #0a0908)`,
        border: `1px solid ${COLORS.ash}`,
      }}
    >
      {/* Ember accent on left */}
      <div
        className="absolute left-0 top-4 bottom-4 w-1"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.bonfire}00, ${COLORS.bonfire}, ${COLORS.bonfire}00)`,
          boxShadow: `0 0 8px ${COLORS.bonfire}40`,
        }}
        aria-hidden="true"
      />

      <div className="flex justify-between items-start gap-3 mb-2 pl-3">
        <div>
          <h3 className="text-sm tracking-wide" style={{ color: '#c0a080' }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: COLORS.bonfire }}>{entry.company}</p>
        </div>
        <span className="text-sm tracking-wide whitespace-nowrap" style={{ color: '#a09080' }}>
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-2 pl-3 leading-relaxed" style={{ color: '#a09080' }}>{entry.description}</p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="pl-3 space-y-1" aria-label="Achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: '#b0a090' }}>
              <span style={{ color: `${COLORS.bonfire}80` }} aria-hidden="true">◆</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Tech stack for engineer - Dark Souls attribute style
export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="flex items-center gap-2 mb-2">
            <Darksign size={12} />
            <h3 className="text-sm tracking-[0.2em] uppercase" style={{ color: '#b08850' }}>
              {category.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm transition-all hover:scale-105 cursor-default"
                style={{ background: '#12100f', border: `1px solid ${COLORS.ash}`, color: '#a09080' }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
