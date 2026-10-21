'use client'

import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { PORTAL } from './palette'

// ============================================================================
// TECH TERMINAL - Engineer Skills (no proficiency bars)
// ============================================================================

export function TechTerminal({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6" role="list" aria-label="Technical Skills">
      {categories.map((category, catIndex) => (
        <div key={category.id} role="listitem">
          <h3
            className="text-sm tracking-[0.12em] mb-3 flex items-center gap-2 uppercase"
            style={{ color: catIndex % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE }}
          >
            <span className="text-sm" aria-hidden="true">{category.icon}</span>
            <span>{category.name}</span>
            <span
              className="flex-1 h-px ml-1"
              style={{
                background: `linear-gradient(90deg, ${catIndex % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}30, transparent)`
              }}
              aria-hidden="true"
            />
          </h3>
          <div className="flex flex-wrap gap-1.5" role="list">
            {category.items.map((tech, i) => (
              <span
                key={tech}
                className="px-2 py-1 text-sm cursor-default transition-colors hover:brightness-110"
                style={{
                  background: `${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}10`,
                  border: `1px solid ${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}30`,
                  color: PORTAL.PANEL_WHITE,
                }}
                role="listitem"
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

// ============================================================================
// PROJECT CARD - Test Chamber Style
// ============================================================================

export function ProjectCard({ slot: { project, years, links }, index }: { slot: ProjectSlot; index: number }) {
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL.ORANGE : PORTAL.BLUE

  return (
    <article
      className="relative h-full p-4 transition-all hover:scale-[1.01] group"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1.5px solid ${PORTAL.METAL_DARK}`,
      }}
      aria-labelledby={`project-${project.id}`}
    >
      {/* Hover glow edges */}
      <div
        className="absolute top-0 bottom-0 left-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: PORTAL.ORANGE, boxShadow: `0 0 8px ${PORTAL.ORANGE}` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: PORTAL.BLUE, boxShadow: `0 0 8px ${PORTAL.BLUE}` }}
        aria-hidden="true"
      />

      {/* Chamber number */}
      <div
        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
        style={{
          background: color,
          color: PORTAL.CAUTION_BLACK,
          boxShadow: `0 0 12px ${color}60`,
        }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="flex justify-between items-start gap-2 pr-5">
        <h3 id={`project-${project.id}`} className="text-sm font-medium" style={{ color }}>
          {project.name}
        </h3>
        {years && <span className="text-sm whitespace-nowrap text-[#C8C8C8]">{years}</span>}
      </div>
      <p className="text-sm mt-1 text-[#FFCC00]">{project.role}</p>
      <p className="text-sm mt-1 mb-1" style={{ color: PORTAL.PANEL_SCUFFED }}>
        {project.tagline}
      </p>

      {project.impact && (
        <p
          className="text-sm italic mb-2 px-2 py-1"
          style={{
            color: PORTAL.BLUE,
            background: `${PORTAL.BLUE}08`,
            borderLeft: `2px solid ${PORTAL.BLUE}`,
          }}
        >
          {project.impact}
        </p>
      )}

      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={tech}
            className="text-sm px-1.5 py-0.5"
            style={{
              background: `${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}12`,
              color: i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {links.length > 0 ? (
        <div className="flex gap-2 flex-wrap mt-3">
          {links.map(({ kind, label, linkProps }, i) => (
            <a
              key={kind}
              {...linkProps}
              className={`inline-flex items-center min-h-[44px] px-3 text-sm tracking-wider uppercase border-[1.5px] transition-all hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                i % 2 === 0 ? 'border-[#FF9A00] text-[#FF9A00]' : 'border-[#00A2FF] text-[#00A2FF]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-3 italic" style={{ color: PORTAL.PANEL_SCUFFED }}>No public link</p>
      )}
    </article>
  )
}

// ============================================================================
// EXPERIENCE CARD
// Dates are date only strings (UTC midnight), so the year is read in UTC: a January start keeps its
// own year west of UTC.
// ============================================================================

export function ExperienceCard({ entry, index }: { entry: Job; index: number }) {
  const isOrange = index % 2 === 0
  const color = isOrange ? PORTAL.ORANGE : PORTAL.BLUE
  const endDisplay = entry.endDate ? entry.endDate.getUTCFullYear() : 'PRESENT'
  const startDisplay = entry.startDate.getUTCFullYear()

  return (
    <article
      className="p-4"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1px solid ${color}25`,
      }}
      aria-labelledby={`exp-${entry.id}`}
    >
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h4
            id={`exp-${entry.id}`}
            className="text-sm font-medium"
            style={{ color: PORTAL.PANEL_WHITE }}
          >
            {entry.title}
          </h4>
          <p className="text-sm mt-0.5" style={{ color }}>
            {entry.company}
          </p>
        </div>
        <span
          className="text-sm tracking-wider px-1.5 py-0.5"
          style={{ background: `${color}12`, color }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-2" style={{ color: PORTAL.PANEL_SCUFFED }}>
          {entry.description}
        </p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1.5" role="list">
          {entry.highlights.map((highlight, i) => (
            <li
              key={highlight}
              className="text-sm flex items-start gap-2"
              style={{ color: PORTAL.PANEL_WHITE }}
            >
              <span
                className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                style={{
                  background: i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE,
                  boxShadow: `0 0 4px ${i % 2 === 0 ? PORTAL.BLUE : PORTAL.ORANGE}`,
                }}
                aria-hidden="true"
              />
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// VENTURE CARD
// ============================================================================

export function VentureCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 transition-all hover:scale-[1.01] group"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1px solid ${PORTAL.BLUE}25`,
      }}
      aria-label={`${company.name} - ${company.tagline} (opens in a new tab)`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h4
            className="text-sm group-hover:brightness-125 transition-all"
            style={{ color: PORTAL.PANEL_WHITE }}
          >
            {company.name}
          </h4>
          <p className="text-sm" style={{ color: PORTAL.ORANGE }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm mb-2" style={{ color: PORTAL.PANEL_SCUFFED }}>{company.description}</p>
      <div className="flex flex-wrap gap-1">
        {company.services.slice(0, 3).map((service) => (
          <span
            key={service}
            className="text-sm px-1.5 py-0.5"
            style={{ background: `${PORTAL.BLUE}12`, color: PORTAL.BLUE }}
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  )
}

// ============================================================================
// BAND CARD
// ============================================================================

export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-all hover:scale-[1.01] group"
      style={{
        background: `linear-gradient(180deg, ${PORTAL.CHAMBER_BG}, ${PORTAL.VOID})`,
        border: `1px solid ${PORTAL.ORANGE}25`,
      }}
    >
      <h3
        className="text-sm group-hover:brightness-125 transition-all"
        style={{ color: PORTAL.PANEL_WHITE }}
      >
        {band.name}
      </h3>
      <p className="text-sm mt-0.5" style={{ color: PORTAL.ORANGE }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm mt-1.5" style={{ color: PORTAL.PANEL_SCUFFED }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
      {content}
    </a>
  )
}
