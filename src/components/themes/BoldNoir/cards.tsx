'use client'

import { useEffect, useState } from 'react'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { AllOutAttackSplash } from './panels'

// Tarot card art per profession: the glyph and the arcana under the label.
export const TAROT: Record<Profession, { icon: string; arcana: string }> = {
  drummer: { icon: '🥁', arcana: 'V - THE HIEROPHANT' },
  engineer: { icon: '💻', arcana: 'XII - THE HANGED MAN' },
  fighter: { icon: '🥊', arcana: 'XI - STRENGTH' },
}

// Persona-style character portrait with Tarot card motif, one option of the shared profession switch
export function CharacterCard({
  id,
  label,
  selected,
  optionProps,
  prefersReducedMotion = false,
}: ProfessionOption & { prefersReducedMotion?: boolean }) {
  const { icon, arcana } = TAROT[id]
  const numeral = arcana.split(' - ')[0]

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
        selected ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      style={{
        transform: prefersReducedMotion
          ? selected ? 'scale(1.05)' : 'none'
          : `skewX(-5deg) ${selected ? 'scale(1.05)' : ''}`,
      }}
    >
      {/* Card background with Tarot styling */}
      <div
        className="px-4 py-5 sm:p-6 relative overflow-hidden"
        style={{
          background: selected
            ? 'linear-gradient(135deg, #ff0033, #990022)'
            : 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
          border: `3px solid ${selected ? '#ff0033' : '#333'}`,
        }}
      >
        {/* Diagonal stripes - Persona 5 pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
          }}
          aria-hidden="true"
        />

        {/* Corner Tarot decorations */}
        <div
          className="absolute top-1 left-1 text-[8px] font-bold"
          style={{ color: selected ? '#000' : '#ff6666' }}
          aria-hidden="true"
        >
          {numeral}
        </div>
        <div
          className="absolute bottom-1 right-1 text-[8px] font-bold rotate-180"
          style={{ color: selected ? '#000' : '#ff6666' }}
          aria-hidden="true"
        >
          {numeral}
        </div>

        {/* Content - counter-skew */}
        <div
          className="relative z-10"
          style={{ transform: prefersReducedMotion ? 'none' : 'skewX(5deg)' }}
        >
          <span className="text-4xl sm:text-5xl block mb-3" aria-hidden="true">{icon}</span>
          <span
            className="text-base sm:text-lg font-black tracking-wider block uppercase"
            style={{ color: selected ? '#000' : '#fff' }}
          >
            {label}
          </span>
          <span
            className="text-sm tracking-widest block mt-1"
            style={{ color: selected ? '#1a0000' : '#ff6666' }}
            aria-hidden="true"
          >
            {arcana}
          </span>
        </div>

        {/* Selection indicator */}
        {selected && !prefersReducedMotion && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2" aria-hidden="true">
            <span className="text-2xl animate-pulse">◀</span>
          </div>
        )}
      </div>
    </button>
  )
}

// Tech stack display for engineer (ALL OUT ATTACK style)
export function TechStackDisplay({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => (
        <div key={category.id} className="relative">
          {/* Category header */}
          <div
            className="flex items-center gap-3 mb-3"
            style={{ transform: 'skewX(-3deg)' }}
          >
            <span className="text-xl" aria-hidden="true">{category.icon}</span>
            <h3
              className="text-sm font-black tracking-wider"
              style={{ color: '#ff0033' }}
            >
              {category.name.toUpperCase()}
            </h3>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #ff0033, transparent)' }} aria-hidden="true" />
          </div>

          {/* Tech items */}
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech, techIndex) => (
              <li
                key={tech}
                className="px-3 py-1 text-sm transition-all hover:scale-105 cursor-default"
                style={{
                  background: `rgba(255,0,51,${0.05 + (techIndex % 3) * 0.05})`,
                  border: '1px solid #ff003340',
                  color: '#fff',
                  transform: 'skewX(-3deg)',
                  animationDelay: `${catIndex * 100 + techIndex * 50}ms`,
                }}
              >
                <span style={{ display: 'inline-block', transform: 'skewX(3deg)' }}>
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Company card with Persona flair
export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <AllOutAttackSplash featured>
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
        className="block relative overflow-hidden group h-full"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
          border: '2px solid #330011',
          transform: 'skewX(-2deg)',
        }}
      >
        {/* Hover effect line */}
        <div
          className="absolute top-0 left-0 w-full h-1 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
          style={{ background: '#ff0033' }}
          aria-hidden="true"
        />

        <div className="p-4" style={{ transform: 'skewX(2deg)' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl" aria-hidden="true">{company.icon}</span>
            <div>
              <h3 className="text-base font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
                {company.name}
              </h3>
              <p className="text-sm" style={{ color: '#ff6666' }}>{company.tagline}</p>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#b8b8b8' }}>{company.description}</p>
        </div>
      </a>
    </AllOutAttackSplash>
  )
}

// Band card with musical flair: his role, the years and the release
export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <div
      className="p-4 relative overflow-hidden group h-full"
      style={{
        background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
        border: '2px solid #330011',
        transform: 'skewX(-2deg)',
      }}
    >
      {/* Musical note decoration */}
      <div
        className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ color: '#ff0033' }}
        aria-hidden="true"
      >
        ♪
      </div>

      <div style={{ transform: 'skewX(2deg)' }}>
        <h3 className="text-base font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
          {band.name}
        </h3>
        <p className="text-sm mt-1" style={{ color: '#ff6666' }}>
          {band.role}
          {years && <span aria-hidden="true"> | </span>}
          {years && <span>{years}</span>}
        </p>
        {band.release && (
          <p className="text-sm mt-2" style={{ color: '#b8b8b8' }}>
            Released <cite>&ldquo;{band.release}&rdquo;</cite>
          </p>
        )}
      </div>
    </div>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full">
      {content}
    </a>
  )
}

// Work experience card with Persona 5 styling. Dates are date only strings (UTC midnight), so the year is read in UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article
      className="relative overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
        border: '2px solid #330011',
        transform: 'skewX(-2deg)',
      }}
    >
      {/* Red accent line */}
      <div
        className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
        style={{ background: '#ff0033' }}
        aria-hidden="true"
      />

      <div className="p-4 pl-5" style={{ transform: 'skewX(2deg)' }}>
        <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
          <div>
            <h3 className="text-base font-bold group-hover:text-red-500 transition-colors" style={{ color: '#fff' }}>
              {entry.title}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: '#ff6666' }}>
              {entry.company}
            </p>
          </div>
          <span
            className="text-sm px-2 py-1"
            style={{
              background: '#ff003330',
              border: '1px solid #ff003350',
              color: '#fff',
            }}
          >
            {startDisplay} - {endDisplay}
          </span>
        </div>

        {entry.description && (
          <p className="text-sm mb-3" style={{ color: '#b8b8b8' }}>
            {entry.description}
          </p>
        )}

        {entry.highlights.length > 0 && (
          <ul className="space-y-1.5" aria-label="Key achievements">
            {entry.highlights.map((highlight) => (
              <li
                key={highlight}
                className="text-sm flex items-start gap-2"
                style={{ color: '#e0e0e0' }}
              >
                <span style={{ color: '#ff6666' }} aria-hidden="true">▸</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}

        {entry.skills.length > 0 && (
          <ul className="flex flex-wrap gap-1 mt-3" aria-label="Skills used">
            {entry.skills.slice(0, 4).map((skill) => (
              <li
                key={skill}
                className="text-sm px-2 py-0.5"
                style={{ background: '#ff003330', color: '#fff' }}
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

// Project card with reveal effect: his role, the result line and the links
export function ProjectCard({ project, years, links, index }: ProjectSlot & { index: number }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 500 + index * 150)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <AllOutAttackSplash featured={project.highlight}>
      <div
        className={`relative h-full transition-all duration-500 ${
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transform: `skewX(-2deg)`,
        }}
      >
        <article
          className="p-4 relative overflow-hidden group h-full"
          style={{
            background: 'linear-gradient(135deg, #1a0a0a, #0a0a0a)',
            border: `2px solid ${project.highlight ? '#ff0033' : '#330011'}`,
          }}
        >
          {/* Red reveal line */}
          <div
            className="absolute top-0 left-0 w-full h-1 transition-transform duration-300 group-hover:scale-x-100"
            style={{
              background: '#ff0033',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }}
            aria-hidden="true"
          />

          <div style={{ transform: 'skewX(2deg)' }}>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-base font-bold" style={{ color: '#ff0033' }}>
                {project.name}
              </h3>
              {years && (
                <span className="text-sm px-2 py-1 font-bold whitespace-nowrap" style={{ background: '#ff0033', color: '#000' }}>
                  {years}
                </span>
              )}
            </div>
            <p className="text-sm font-bold" style={{ color: '#fff' }}>
              {project.role}
            </p>
            <p className="text-sm mt-1" style={{ color: '#b8b8b8' }}>
              {project.tagline}
            </p>
            {project.impact && (
              <p className="text-sm mt-2 italic" style={{ color: '#ff6666' }}>
                <span aria-hidden="true">→ </span>
                {project.impact}
              </p>
            )}
            {project.techStack.length > 0 && (
              <ul className="flex gap-2 mt-2 flex-wrap" aria-label="Technologies used">
                {project.techStack.slice(0, 4).map((tech) => (
                  <li
                    key={tech}
                    className="text-sm px-2 py-0.5"
                    style={{ background: '#ff003330', color: '#fff' }}
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
                    className="inline-flex items-center min-h-[44px] px-4 text-sm font-bold tracking-wider transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                    style={{ border: '3px solid #ff0033', color: '#ff0033' }}
                  >
                    {label.toUpperCase()}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm mt-4" style={{ color: '#999' }}>No public link</p>
            )}
          </div>
        </article>
      </div>
    </AllOutAttackSplash>
  )
}
