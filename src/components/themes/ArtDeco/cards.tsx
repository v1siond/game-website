import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job } from '@/lib/cv/content'
import { RAPTURE_COLORS } from './palette'
import { jobYears } from '@/components/cv/sectionText'

// The brass card every list entry sits on: caustic shimmer, deco top line and hover gleam.
export function BrassCard({
  children,
  reducedMotion,
  className = '',
}: {
  children: React.ReactNode
  reducedMotion: boolean
  className?: string
}) {
  return (
    <article
      className={`relative h-full p-5 group overflow-hidden ${className}`}
      style={{
        background: `
          linear-gradient(180deg, ${RAPTURE_COLORS.deepSeaMid}f5, ${RAPTURE_COLORS.abyss}fa),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            ${RAPTURE_COLORS.gold}02 10px,
            ${RAPTURE_COLORS.gold}02 20px
          )
        `,
        border: `1px solid ${RAPTURE_COLORS.gold}60`,
        boxShadow: `inset 0 0 40px ${RAPTURE_COLORS.abyss}70`,
      }}
    >
      <div
        className={`absolute inset-0 pointer-events-none ${reducedMotion ? 'opacity-[0.06]' : 'animate-card-caustics opacity-[0.12]'}`}
        style={{
          background: `
            radial-gradient(ellipse 45% 35% at 25% 20%, ${RAPTURE_COLORS.waterGlow}25 0%, transparent 50%),
            radial-gradient(ellipse 35% 45% at 75% 80%, ${RAPTURE_COLORS.gold}18 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="absolute top-0 left-0 right-0 flex items-center" aria-hidden="true">
        <div className="w-4 h-4 border-l-2 border-t-2" style={{ borderColor: RAPTURE_COLORS.gold }} />
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${RAPTURE_COLORS.gold}, ${RAPTURE_COLORS.gold}40, ${RAPTURE_COLORS.gold})` }} />
        <div className="w-4 h-4 border-r-2 border-t-2" style={{ borderColor: RAPTURE_COLORS.gold }} />
      </div>

      <div className="relative z-10 pt-3">{children}</div>

      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: `inset 0 0 50px ${RAPTURE_COLORS.gold}30`,
            background: `linear-gradient(180deg, ${RAPTURE_COLORS.gold}08 0%, transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}
    </article>
  )
}

export const CARD_TITLE_STYLE: React.CSSProperties = {
  color: RAPTURE_COLORS.gold,
  fontFamily: '"Playfair Display", serif',
  textShadow: `0 0 15px ${RAPTURE_COLORS.gold}30`,
}

// ============================================================================
// EXPERIENCE CARD - Work history with Rapture styling. Dates are date only strings (UTC midnight),
// so the year is read in UTC.
// ============================================================================
export function ExperienceCard({ entry, reducedMotion }: { entry: Job; reducedMotion: boolean }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <BrassCard reducedMotion={reducedMotion}>
      <div className="flex justify-between items-start gap-3 mb-3 flex-wrap">
        <div>
          <h3 className="text-lg" style={CARD_TITLE_STYLE}>{entry.title}</h3>
          <p className="text-sm mt-1" style={{ color: RAPTURE_COLORS.parchment }}>{entry.company}</p>
        </div>
        <span
          className="text-sm px-3 py-1"
          style={{
            background: `${RAPTURE_COLORS.gold}20`,
            border: `1px solid ${RAPTURE_COLORS.gold}50`,
            color: RAPTURE_COLORS.gold,
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>

      {entry.description && <p className="text-sm mb-4" style={{ color: RAPTURE_COLORS.warmWhite }}>{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="space-y-1.5 mb-4" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: RAPTURE_COLORS.parchment }}>
              <span style={{ color: RAPTURE_COLORS.gold }} aria-hidden="true">{'>'}</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {entry.skills.length > 0 && (
        <ul className="flex gap-2 flex-wrap" aria-label="Skills used">
          {entry.skills.slice(0, 4).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-1"
              style={{
                background: `${RAPTURE_COLORS.gold}15`,
                border: `1px solid ${RAPTURE_COLORS.gold}30`,
                color: RAPTURE_COLORS.gold,
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </BrassCard>
  )
}

// ============================================================================
// TECH CLOUD - Engineer tech stack
// ============================================================================
export function TechCloud({ categories, reducedMotion }: { categories: CVData['techStack']; reducedMotion: boolean }) {
  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-[0.2em] mb-3 flex items-center gap-2"
            style={{
              color: RAPTURE_COLORS.gold,
              textShadow: `0 0 10px ${RAPTURE_COLORS.gold}40`,
            }}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className={`text-sm px-3 py-1.5 ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
                style={{
                  background: `${RAPTURE_COLORS.gold}18`,
                  border: `1px solid ${RAPTURE_COLORS.gold}45`,
                  color: RAPTURE_COLORS.parchment,
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
}

// ============================================================================
// PROJECT CARD - Vintage Rapture poster style: his role, the result line and the links
// ============================================================================
export function ProjectCard({ project, years, links, reducedMotion }: ProjectSlot & { reducedMotion: boolean }) {
  return (
    <BrassCard reducedMotion={reducedMotion}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-lg" style={CARD_TITLE_STYLE}>{project.name}</h3>
        {years && <span className="text-sm whitespace-nowrap" style={{ color: RAPTURE_COLORS.gold }}>{years}</span>}
      </div>
      <p className="text-sm mb-2 tracking-wider" style={{ color: RAPTURE_COLORS.goldBright }}>{project.role}</p>
      <p className="text-sm mb-3" style={{ color: RAPTURE_COLORS.warmWhite }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mb-3 flex items-start gap-2" style={{ color: RAPTURE_COLORS.parchment }}>
          <span style={{ color: RAPTURE_COLORS.goldBright }} aria-hidden="true">{'>'}</span>
          <span className="italic">{project.impact}</span>
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex gap-2 flex-wrap" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-1"
              style={{
                background: `${RAPTURE_COLORS.gold}25`,
                border: `1px solid ${RAPTURE_COLORS.gold}50`,
                color: RAPTURE_COLORS.gold,
              }}
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className={`inline-flex items-center min-h-[44px] px-4 text-sm tracking-wider ${reducedMotion ? '' : 'transition-all hover:scale-105'}`}
              style={{ border: `2px solid ${RAPTURE_COLORS.gold}`, color: RAPTURE_COLORS.gold }}
            >
              {label.toUpperCase()}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-4" style={{ color: RAPTURE_COLORS.warmWhite }}>No public link</p>
      )}
    </BrassCard>
  )
}

// ============================================================================
// COMPANY CARD - Ventures display
// ============================================================================
export function CompanyCard({ company, reducedMotion }: { company: CVData['companies'][number]; reducedMotion: boolean }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className="block h-full"
    >
      <BrassCard reducedMotion={reducedMotion}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl" aria-hidden="true">{company.icon}</span>
          <div>
            <h3 className="text-base" style={CARD_TITLE_STYLE}>{company.name}</h3>
            <p className="text-sm" style={{ color: RAPTURE_COLORS.warmWhite }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm" style={{ color: RAPTURE_COLORS.parchment }}>{company.description}</p>
      </BrassCard>
    </a>
  )
}

// ============================================================================
// BAND CARD - Musical projects display
// ============================================================================
export function BandCard({ band, years, linkProps, reducedMotion }: BandSlot & { reducedMotion: boolean }) {
  const content = (
    <BrassCard reducedMotion={reducedMotion}>
      <h3 className="text-base" style={CARD_TITLE_STYLE}>{band.name}</h3>
      <p className="text-sm mt-1" style={{ color: RAPTURE_COLORS.warmWhite }}>
        {band.role}
        {years && <span aria-hidden="true"> - </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: RAPTURE_COLORS.parchment }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </BrassCard>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full">
      {content}
    </a>
  )
}
