import type React from 'react'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { LIMBO } from './palette'

// =============================================================================
// LIMBO-STYLE SECTION CARDS - Film grain, fog gradients, industrial textures
// =============================================================================

export function LimboCard({ children, className = '', ariaLabel }: {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      role={ariaLabel ? 'region' : undefined}
      aria-label={ariaLabel}
      style={{
        background: `linear-gradient(135deg, ${LIMBO.darkGrey2} 0%, ${LIMBO.darkGrey3} 50%, ${LIMBO.darkGrey2} 100%)`,
        borderLeft: `4px solid ${LIMBO.black}`,
        boxShadow: `6px 6px 0 ${LIMBO.black}, inset 0 0 30px ${LIMBO.black}60`,
      }}
    >
      {/* Film grain overlay - static for performance */}
      <div
        className="absolute inset-0 pointer-events-none opacity-8"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Torn edge effect - top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${LIMBO.midGrey1} 10%, transparent 15%, ${LIMBO.darkGrey2} 25%, transparent 30%, ${LIMBO.midGrey1} 40%, transparent 50%, ${LIMBO.darkGrey2} 60%, transparent 70%, ${LIMBO.midGrey1} 80%, transparent 90%)`,
        }}
        aria-hidden="true"
      />
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10" aria-hidden="true" />
      {/* Content */}
      <div className="relative z-10 p-5">
        {children}
      </div>
    </div>
  )
}

export function LimboItemCard({ children, href, className = '' }: {
  children: React.ReactNode
  href?: string
  className?: string
}) {
  const cardStyle = {
    background: `linear-gradient(145deg, ${LIMBO.darkGrey2} 0%, ${LIMBO.darkGrey3} 100%)`,
    border: `2px solid ${LIMBO.black}`,
    boxShadow: `4px 4px 0 ${LIMBO.black}, inset 0 0 20px ${LIMBO.black}70`,
  }

  const content = (
    <div className="relative" style={cardStyle}>
      <div className={`relative z-10 p-4 ${className}`}>
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group"
      >
        {content}
      </a>
    )
  }
  return content
}

function TechTag({ name }: { name: string }) {
  return (
    <span
      className="inline-block px-2 py-1 text-xs tracking-wider uppercase transition-colors hover:bg-white hover:text-black"
      style={{ background: 'transparent', border: `1px solid ${LIMBO.midGrey2}`, color: LIMBO.lightGrey2 }}
    >
      {name}
    </span>
  )
}

export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-4" role="list" aria-label="Technical skills by category">
      {categories.map((category) => (
        <div key={category.id} role="listitem">
          <h3 className="text-xs tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: LIMBO.lightGrey1 }}>
            <span className="text-sm grayscale" aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <TechTag key={tech} name={tech} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px" style={{ background: `${LIMBO.midGrey2}40` }} aria-hidden="true" />
      <h2 className="text-xs tracking-[0.4em] uppercase" style={{ color: LIMBO.lightGrey1 }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: `${LIMBO.midGrey2}40` }} aria-hidden="true" />
    </div>
  )
}

// Dates are date only strings (UTC midnight), so the year is read in UTC: a January start keeps its
// own year west of UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startYear, end: endYear } = jobYears(entry, 'Present')

  return (
    <article className="p-4" style={{
      background: `${LIMBO.darkGrey2}`,
      borderLeft: `3px solid ${LIMBO.black}`,
      boxShadow: `4px 4px 0 ${LIMBO.black}`,
    }}>
      <div className="flex justify-between items-start gap-3 mb-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: LIMBO.fogWhite1 }}>{entry.title}</h3>
          <p className="text-xs tracking-wider mt-0.5" style={{ color: LIMBO.lightGrey1 }}>{entry.company}</p>
        </div>
        <span className="text-xs tracking-wider uppercase whitespace-nowrap" style={{ color: LIMBO.lightGrey1 }}>{startYear} - {endYear}</span>
      </div>
      {entry.description && (
        <p className="text-sm leading-relaxed mt-2" style={{ color: LIMBO.lightGrey2 }}>{entry.description}</p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-xs flex items-start gap-1.5" style={{ color: LIMBO.lightGrey2 }}>
              <span style={{ color: LIMBO.midGrey2 }} aria-hidden="true">-</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-2">
          {entry.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="text-xs px-1 py-0.5 uppercase" style={{ border: `1px solid ${LIMBO.midGrey1}`, color: LIMBO.lightGrey1 }}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <LimboItemCard>
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: LIMBO.fogWhite1 }}>{project.name}</h3>
        {years && <span className="text-xs tracking-wider whitespace-nowrap text-[#888888]">{years}</span>}
      </div>
      <p className="text-xs mt-0.5 text-[#CCCCCC]">{project.role}</p>
      <p className="text-xs mt-0.5" style={{ color: LIMBO.lightGrey1 }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-xs mt-1.5 italic" style={{ color: LIMBO.lightGrey2 }}>{'-> '}{project.impact}</p>
      )}
      <div className="flex gap-1.5 flex-wrap mt-2">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-xs px-1.5 py-0.5 uppercase tracking-wider" style={{ background: LIMBO.black, color: LIMBO.lightGrey2 }}>
            {tech}
          </span>
        ))}
      </div>
      {links.length > 0 ? (
        <div className="flex gap-2 flex-wrap mt-3">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-xs tracking-[0.2em] uppercase border-2 border-[#CCCCCC] text-[#CCCCCC] transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs mt-3 uppercase tracking-wider text-[#888888]">[ no public link ]</p>
      )}
    </LimboItemCard>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <LimboItemCard href={company.url || undefined}>
      <div className="flex items-start gap-2 mb-1">
        <span className="text-base grayscale contrast-200" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: LIMBO.fogWhite1 }}>{company.name}</h3>
          <p className="text-xs tracking-wider" style={{ color: LIMBO.lightGrey1 }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: LIMBO.lightGrey2 }}>{company.description}</p>
    </LimboItemCard>
  )
}

export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <LimboItemCard>
      <h3 className="text-xs font-bold uppercase tracking-wider group-hover:underline" style={{ color: LIMBO.fogWhite1 }}>{band.name}</h3>
      <p className="text-xs tracking-wider mt-0.5" style={{ color: LIMBO.lightGrey1 }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm leading-relaxed mt-1.5" style={{ color: LIMBO.lightGrey2 }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </LimboItemCard>
  )

  if (!linkProps) return content
  return (
    <a
      {...linkProps}
      className="block transition-transform hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group"
    >
      {content}
    </a>
  )
}
