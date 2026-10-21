import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { RE } from './palette'

// Project file - worn paper file style. The name, his role, the years and the links are always on the
// file; opening it reads the description and the result line.
export function ProjectFile({ slot: { project, years, links }, isOpen, onToggle }: { slot: ProjectSlot; isOpen: boolean; onToggle: () => void }) {
  const bodyId = `file-${project.id}`

  return (
    <article style={{ background: RE.sepia, border: `1px solid ${RE.midBrown}` }}>
      <div className="px-4 py-3" style={{ borderBottom: isOpen ? `1px solid ${RE.midBrown}` : 'none' }}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm flex items-center gap-2" style={{ color: RE.cream }}>
            <span style={{ color: RE.warmGlow }} aria-hidden="true">[FILE]</span>
            {project.name}
          </h3>
          {years && <span className="text-sm whitespace-nowrap" style={{ color: RE.candlelight }}>{years}</span>}
        </div>
        <p className="text-sm mt-1" style={{ color: RE.warmGlow }}>{project.role}</p>
        <p className="text-sm mt-1" style={{ color: RE.fog }}>{project.tagline}</p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-sm tracking-wider transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a860] border border-[#c49050] text-[#e8a860] bg-[#6b4030]/40"
            >
              [{label.toUpperCase()}]
            </a>
          ))}
          {links.length === 0 && <span className="text-sm italic" style={{ color: RE.fog }}>No public link</span>}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={bodyId}
            className="inline-flex items-center gap-2 min-h-[44px] px-3 text-sm tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a860] text-[#d8c8a8]"
          >
            <span aria-hidden="true" style={{ color: RE.candlelight }}>{isOpen ? '▼' : '▶'}</span>
            {isOpen ? 'Close file' : 'Read file'}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id={bodyId} className="px-4 py-3" style={{ background: `${RE.darkSepia}cc` }}>
          <p className="text-sm leading-relaxed" style={{ color: RE.fog }}>
            {project.description}
          </p>
          {project.impact && (
            <p className="text-sm mt-2 italic" style={{ color: RE.cream }}>▸ {project.impact}</p>
          )}
        </div>
      )}
    </article>
  )
}

// Tech stack display - sepia inventory style
export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-wider mb-3 flex items-center gap-2 uppercase"
            style={{ color: RE.warmGlow }}
          >
            <span className="text-sm" aria-hidden="true">[{category.icon}]</span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-sm tracking-wider transition-all hover:scale-105 cursor-default"
                style={{ background: `${RE.midBrown}50`, border: `1px solid ${RE.midBrown}`, color: RE.cream }}
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

// Company card - worn paper style
export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name} (opens in a new tab)`}
      className="block p-4 transition-all hover:scale-[1.02] group"
      style={{ background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`, border: `1px solid ${RE.midBrown}` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-sm group-hover:brightness-125 transition-all" style={{ color: RE.cream }}>
            {company.name}
          </h3>
          <p className="text-sm" style={{ color: RE.warmGlow }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: RE.fog }}>{company.description}</p>
    </a>
  )
}

// Band card - worn paper style
export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <div
      className="h-full p-4 transition-all hover:scale-[1.02] group"
      style={{ background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`, border: `1px solid ${RE.midBrown}` }}
    >
      <h3 className="text-sm group-hover:brightness-125 transition-all" style={{ color: RE.cream }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: RE.warmGlow }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: RE.fog }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </div>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a860]">
      {content}
    </a>
  )
}

// Work experience card - worn document style. Dates are date only strings (UTC midnight), so the year
// is read in UTC: a January start keeps its own year west of UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <div
      className="p-4"
      style={{ background: `linear-gradient(135deg, ${RE.sepia}, ${RE.darkSepia})`, border: `1px solid ${RE.midBrown}` }}
    >
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <h3 className="text-sm" style={{ color: RE.cream }}>{entry.title}</h3>
          <p className="text-sm" style={{ color: RE.warmGlow }}>{entry.company}</p>
        </div>
        <span
          className="text-sm px-2 py-1 whitespace-nowrap"
          style={{ color: RE.candlelight, background: `${RE.rust}30`, border: `1px solid ${RE.rust}50` }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && <p className="text-sm mb-2" style={{ color: RE.fog }}>{entry.description}</p>}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: RE.cream }}>
              <span style={{ color: RE.warmGlow }} aria-hidden="true">▸</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
