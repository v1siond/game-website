import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { ArcadeText } from './badges'
import { COLORS, crtScanlines, metallicTexture } from './palette'

// =============================================================================
// TEAM CARD (VENTURES/COMPANIES)
// =============================================================================
export function TeamCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className="block h-full focus:outline-none focus-visible:ring-4 transition-transform hover:scale-[1.02]"
    >
      <div
        className="relative p-5 h-full"
        style={{
          background: metallicTexture,
          border: `3px solid ${COLORS.specialBlue}`,
          borderRadius: '4px',
          boxShadow: `0 0 15px ${COLORS.specialBlue}40, inset 0 0 20px rgba(0,0,0,0.5)`,
        }}
      >
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        <div className="flex items-center gap-4 relative">
          <span className="text-4xl" aria-hidden="true">{company.icon}</span>
          <div>
            <h3
              className="text-base font-black tracking-wide uppercase"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#FFF',
                textShadow: `0 0 10px ${COLORS.specialBlue}60`,
              }}
            >
              {company.name}
            </h3>
            <p className="text-sm tracking-wider" style={{ color: COLORS.specialBlue }}>
              {company.tagline}
            </p>
          </div>
        </div>

        <p className="text-sm mt-4 leading-relaxed relative" style={{ color: COLORS.chrome }}>
          {company.description}
        </p>
      </div>
    </a>
  )
}

// =============================================================================
// BAND CARD - his role, the years and the release
// =============================================================================
export function BandCard({ band, years, linkProps }: BandSlot) {
  const bandColor = COLORS.neonPink

  const content = (
    <article
      className="relative p-5 h-full"
      style={{
        background: metallicTexture,
        border: `3px solid ${bandColor}`,
        borderRadius: '4px',
        boxShadow: `0 0 15px ${bandColor}40, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        aria-hidden="true"
        style={{ background: crtScanlines }}
      />

      <h3
        className="text-base font-black tracking-wide uppercase relative"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          color: '#FFF',
          textShadow: `0 0 10px ${bandColor}60`,
        }}
      >
        {band.name}
      </h3>

      <p className="text-sm mt-2 relative" style={{ color: bandColor }}>
        {band.role}
        {years && <span aria-hidden="true"> {'//'} </span>}
        {years && <span>{years}</span>}
      </p>

      {band.release && (
        <p className="text-sm mt-3 leading-relaxed relative" style={{ color: COLORS.chrome }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a
      {...linkProps}
      className="block h-full focus:outline-none focus-visible:ring-4 transition-transform hover:scale-[1.02]"
    >
      {content}
    </a>
  )
}

// =============================================================================
// EXPERIENCE CARD - FIGHT RECORD STYLE. Dates are date only strings (UTC midnight), so the year is read in UTC.
// =============================================================================
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'NOW')
  const isActive = !entry.endDate
  const color = isActive ? COLORS.healthGreen : COLORS.specialBlue

  return (
    <article
      className="relative"
      style={{
        background: metallicTexture,
        border: `3px solid ${color}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        boxShadow: `0 0 20px ${color}40, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="p-5 relative">
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-4 relative flex-wrap">
          <div>
            <h3
              className="text-base font-black uppercase"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#FFF',
              }}
            >
              {entry.title}
            </h3>
            <p className="text-sm tracking-wider" style={{ color }}>
              {entry.company}
            </p>
          </div>
          <span
            className="text-sm px-4 py-1.5 font-black tracking-wider"
            style={{
              background: isActive ? `linear-gradient(90deg, ${COLORS.healthGreen}, ${COLORS.healthGreenDark})` : COLORS.chromeDark,
              color: isActive ? '#000' : '#FFF',
              borderRadius: '2px',
              boxShadow: isActive ? `0 0 12px ${COLORS.healthGreen}80` : 'none',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>

        {/* Description */}
        {entry.description && (
          <p className="text-sm mb-4 leading-relaxed relative" style={{ color: COLORS.chrome }}>
            {entry.description}
          </p>
        )}

        {/* Highlights with HIT markers */}
        {entry.highlights.length > 0 && (
          <ul className="space-y-2 mb-4 relative" aria-label="Key achievements">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="text-sm flex items-start gap-3" style={{ color: '#FFF' }}>
                <span aria-hidden="true">
                  <ArcadeText text="HIT" type="combo" size="sm" />
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Skills/tech tags */}
        {entry.skills.length > 0 && (
          <ul className="flex flex-wrap gap-2 relative" aria-label="Skills used">
            {entry.skills.slice(0, 5).map((skill) => (
              <li
                key={skill}
                className="text-sm px-3 py-1"
                style={{
                  background: `${color}25`,
                  border: `1px solid ${color}40`,
                  borderRadius: '2px',
                  color,
                }}
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6"
        aria-hidden="true"
        style={{
          background: `linear-gradient(135deg, ${color}, ${COLORS.gold})`,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </article>
  )
}

// =============================================================================
// PROJECT CARD - CHAMPIONSHIP VICTORY STYLE: his role, the result line and the links
// =============================================================================
export function FightCard({ project, years, links }: ProjectSlot) {
  const isHighlight = project.highlight
  const color = isHighlight ? COLORS.gold : COLORS.specialBlue

  return (
    <article
      className="relative h-full"
      style={{
        background: metallicTexture,
        border: `3px solid ${color}`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        boxShadow: isHighlight
          ? `0 0 30px ${COLORS.gold}60, inset 0 0 25px ${COLORS.gold}15`
          : `0 0 15px ${color}30, inset 0 0 20px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="p-5 relative">
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          aria-hidden="true"
          style={{ background: crtScanlines }}
        />

        {/* Header */}
        <div className="flex justify-between items-start gap-2 mb-2 relative">
          <h3
            className="text-base font-black tracking-wide uppercase"
            style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              color: isHighlight ? COLORS.gold : '#FFF',
              textShadow: isHighlight ? `0 0 12px ${COLORS.gold}` : 'none',
            }}
          >
            {project.name}
          </h3>
          {years && (
            <span className="text-sm font-black tracking-wider whitespace-nowrap" style={{ color }}>
              {years}
            </span>
          )}
        </div>

        <p className="text-sm font-bold mb-2 relative" style={{ color: '#FFF' }}>
          {project.role}
        </p>

        {/* Tagline */}
        <p className="text-sm mb-3 relative" style={{ color: COLORS.chrome }}>
          {project.tagline}
        </p>

        {/* Impact statement with K.O. styling */}
        {project.impact && (
          <div
            className="text-sm py-2.5 px-4 mb-4 relative flex items-start gap-2"
            style={{
              background: `linear-gradient(90deg, ${color}25, transparent)`,
              borderLeft: `4px solid ${color}`,
            }}
          >
            <span aria-hidden="true">
              <ArcadeText text="K.O." type="ko" size="sm" />
            </span>
            <span style={{ color }}>{project.impact}</span>
          </div>
        )}

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <ul className="flex flex-wrap gap-2 relative" aria-label="Technologies used">
            {project.techStack.slice(0, 5).map((tech) => (
              <li
                key={tech}
                className="text-sm px-3 py-1"
                style={{
                  background: `${color}20`,
                  border: `1px solid ${color}35`,
                  borderRadius: '2px',
                  color,
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {/* Links */}
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-3 mt-4 relative">
            {links.map(({ kind, label, linkProps }) => (
              <a
                key={kind}
                {...linkProps}
                className="inline-flex items-center min-h-[44px] text-sm px-4 font-black tracking-wider uppercase focus:outline-none focus-visible:ring-2 transition-transform hover:scale-105"
                style={{
                  background: color,
                  color: '#000',
                  borderRadius: '2px',
                  boxShadow: `0 0 12px ${color}80`,
                }}
              >
                {label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm mt-4 relative" style={{ color: COLORS.chrome }}>No public link</p>
        )}
      </div>

      {/* Corner cut decoration */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6"
        aria-hidden="true"
        style={{
          background: color,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </article>
  )
}
