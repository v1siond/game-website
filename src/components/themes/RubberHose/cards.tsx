'use client'

import { useState } from 'react'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import { jobYears } from '@/components/cv/sectionText'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CUPHEAD_COLORS } from './palette'
import { InkSplash } from './art'

// Rubber Hose's cards: the tech bubbles, the posters for ventures, bands, jobs and projects.

// ============================================================================
// COMPONENT: Tech Stack Cloud
// ============================================================================
export function TechBubbleCloud({ categories }: { categories: CVData['techStack'] }) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="space-y-6">
      {categories.map((category, catIdx) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-widest mb-3 flex items-center gap-2"
            style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}
          >
            <span className="text-lg" aria-hidden="true">{category.icon}</span>
            <span aria-hidden="true">--</span> {category.name.toUpperCase()} <span aria-hidden="true">--</span>
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech, i) => (
              <li
                key={tech}
                className={`px-3 py-1 text-sm transition-all hover:scale-110 cursor-default ${reducedMotion ? '' : 'cuphead-pop-in'}`}
                style={{
                  animationDelay: reducedMotion ? '0s' : `${(catIdx * 0.1) + (i * 0.03)}s`,
                  background: CUPHEAD_COLORS.inkBlack,
                  color: CUPHEAD_COLORS.paperCream,
                  borderRadius: '20px',
                  boxShadow: '2px 2px 0 #1a1510',
                  fontFamily: 'serif',
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

// The ink splash a poster throws when the pointer lands on it.
function useInkSplash() {
  const [splash, setSplash] = useState<{ x: number; y: number } | null>(null)
  const reducedMotion = useReducedMotion()

  const onMouseEnter = (e: React.MouseEvent) => {
    if (reducedMotion) return
    setSplash({ x: e.clientX, y: e.clientY })
    setTimeout(() => setSplash(null), 400)
  }

  return { splash, onMouseEnter }
}

export const POSTER_STYLE: React.CSSProperties = {
  background: CUPHEAD_COLORS.paperDark,
  border: `4px solid ${CUPHEAD_COLORS.inkBlack}`,
  boxShadow: `4px 4px 0 ${CUPHEAD_COLORS.shadowBrown}`,
}

// ============================================================================
// COMPONENT: Company Poster (vintage advertisement style)
// ============================================================================
export function CompanyPoster({ company }: { company: CVData['companies'][number] }) {
  const { splash, onMouseEnter } = useInkSplash()

  return (
    <>
      {splash && <InkSplash x={splash.x} y={splash.y} />}
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full p-4 relative group transition-all hover:scale-[1.02]"
        style={POSTER_STYLE}
        onMouseEnter={onMouseEnter}
        aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      >
        {/* Corner stars - vintage poster decoration */}
        {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} text-lg`}
            style={{ color: CUPHEAD_COLORS.accentRedDark }}
            aria-hidden="true"
          >
            ★
          </span>
        ))}

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden="true">{company.icon}</span>
          <div>
            <h3
              className="text-base font-bold group-hover:text-red-800 transition-colors"
              style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
            >
              {company.name}
            </h3>
            <p className="text-sm" style={{ color: CUPHEAD_COLORS.accentRedDark }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>{company.description}</p>
      </a>
    </>
  )
}

// ============================================================================
// COMPONENT: Band Record (vinyl record label style): his role, the years and the release
// ============================================================================
export function BandRecord({ band, years, linkProps }: BandSlot) {
  const reducedMotion = useReducedMotion()
  const { splash, onMouseEnter } = useInkSplash()

  const content = (
    <article
      className={`h-full p-4 relative group transition-all hover:scale-[1.02] ${!reducedMotion ? 'hover:rotate-1' : ''}`}
      style={POSTER_STYLE}
      onMouseEnter={onMouseEnter}
    >
      {/* Vinyl record decoration */}
      <div
        className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: CUPHEAD_COLORS.inkBlack }}
        aria-hidden="true"
      >
        <div className="w-4 h-4 rounded-full" style={{ background: CUPHEAD_COLORS.accentRedDark }} />
      </div>

      <h3
        className="text-base font-bold group-hover:text-red-800 transition-colors"
        style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
      >
        <span aria-hidden="true">♫ </span>
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: CUPHEAD_COLORS.accentRedDark }}>
        {band.role}
        {years && <span aria-hidden="true"> • </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  return (
    <>
      {splash && <InkSplash x={splash.x} y={splash.y} />}
      {linkProps ? (
        <a {...linkProps} className="block h-full">
          {content}
        </a>
      ) : (
        content
      )}
    </>
  )
}

// ============================================================================
// COMPONENT: Experience Card (vintage ticket/poster style). Dates are date only strings (UTC midnight),
// so the year is read in UTC.
// ============================================================================
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article className="p-4 relative" style={POSTER_STYLE}>
      {/* Corner decorations - art deco style */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />

      <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
        <div>
          <h3 className="text-base font-bold" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
            {entry.title}
          </h3>
          <p className="text-sm" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
            {entry.company}
          </p>
        </div>
        <span
          className="text-sm px-2 py-1"
          style={{
            background: CUPHEAD_COLORS.inkBlack,
            color: CUPHEAD_COLORS.paperCream,
            fontFamily: 'serif',
          }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-2" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          {entry.description}
        </p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li
              key={highlight}
              className="text-sm flex items-start gap-2"
              style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}
            >
              <span style={{ color: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true">★</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="flex gap-1 flex-wrap mt-3" aria-label="Skills used">
          {entry.skills.slice(0, 4).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-0.5 rounded-full"
              style={{ background: CUPHEAD_COLORS.inkBlack, color: CUPHEAD_COLORS.paperCream }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ============================================================================
// COMPONENT: Project Poster (vintage movie/show poster style): his role, the result line and the links
// ============================================================================
export function VintagePoster({ project, years, links }: ProjectSlot) {
  const reducedMotion = useReducedMotion()

  return (
    <article
      className={`h-full p-4 relative group transition-all hover:scale-[1.02] ${!reducedMotion ? 'hover:-rotate-1' : ''}`}
      style={POSTER_STYLE}
    >
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: CUPHEAD_COLORS.accentRedDark }} aria-hidden="true" />

      <div className="flex justify-between items-start gap-2 mt-1">
        <h3 className="text-base font-bold" style={{ color: CUPHEAD_COLORS.accentRedDark, fontFamily: 'serif' }}>
          {project.name.toUpperCase()}
        </h3>
        {years && (
          <span className="text-sm whitespace-nowrap" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
            {years}
          </span>
        )}
      </div>
      <p className="text-sm font-bold mb-1" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
        {project.role}
      </p>
      <p className="text-sm mb-2" style={{ color: CUPHEAD_COLORS.inkBlack }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p
          className="text-sm mb-2 italic px-2 py-1 rounded"
          style={{
            color: CUPHEAD_COLORS.inkBlack,
            background: `${CUPHEAD_COLORS.accentGold}30`,
            border: `1px solid ${CUPHEAD_COLORS.accentGold}50`,
          }}
        >
          <span aria-hidden="true">→ </span>
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex gap-1 flex-wrap" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-0.5 rounded-full"
              style={{
                background: CUPHEAD_COLORS.inkBlack,
                color: CUPHEAD_COLORS.paperCream,
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
              className="inline-flex items-center min-h-[44px] px-4 text-sm tracking-wider transition-all hover:scale-105"
              style={{
                background: CUPHEAD_COLORS.accentRedDark,
                color: CUPHEAD_COLORS.paperCream,
                border: `3px solid ${CUPHEAD_COLORS.inkBlack}`,
                fontFamily: 'serif',
                boxShadow: '3px 3px 0 #5a0000',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-4 italic" style={{ color: CUPHEAD_COLORS.inkBlack, fontFamily: 'serif' }}>
          No public link
        </p>
      )}
    </article>
  )
}
