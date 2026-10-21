'use client'

import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CircuitPattern } from './effects'
import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job } from '@/lib/cv/content'
import { headingId, jobYears, NO_PUBLIC_LINK, RELEASED } from '@/components/cv/sectionText'
import { NEON } from './palette'

// The tube colours a tech chip cycles through, one per chip in order.
const TECH_TINTS = [NEON.magenta, NEON.cyan, NEON.yellow, NEON.green, NEON.orange]

export type PanelAccent = 'yellow' | 'green' | 'cyan' | 'magenta' | 'violet' | 'red' | 'orange'

// Each accent as the classes it paints and the hex the circuit pattern strokes with. Static
// classes only: no blur, no animated glow, so a panel costs nothing while the page scrolls.
const PANEL_ACCENT: Record<PanelAccent, { text: string; border: string; dot: string; rule: string; hex: string }> = {
  yellow: { text: 'text-[color:var(--neon-yellow)]', border: 'border-[color:var(--neon-yellow)]', dot: 'bg-[color:var(--neon-yellow)]', rule: 'from-[color-mix(in_srgb,var(--neon-yellow)_40%,transparent)]', hex: NEON.yellow },
  green: { text: 'text-[color:var(--neon-green)]', border: 'border-[color:var(--neon-green)]', dot: 'bg-[color:var(--neon-green)]', rule: 'from-[color-mix(in_srgb,var(--neon-green)_40%,transparent)]', hex: NEON.green },
  cyan: { text: 'text-[color:var(--neon-cyan)]', border: 'border-[color:var(--neon-cyan)]', dot: 'bg-[color:var(--neon-cyan)]', rule: 'from-[color-mix(in_srgb,var(--neon-cyan)_40%,transparent)]', hex: NEON.cyan },
  magenta: { text: 'text-[color:var(--neon-magenta)]', border: 'border-[color:var(--neon-magenta)]', dot: 'bg-[color:var(--neon-magenta)]', rule: 'from-[color-mix(in_srgb,var(--neon-magenta)_40%,transparent)]', hex: NEON.magenta },
  violet: { text: 'text-[color:var(--neon-violet-text)]', border: 'border-[color:var(--neon-violet)]', dot: 'bg-[color:var(--neon-violet)]', rule: 'from-[color-mix(in_srgb,var(--neon-violet)_40%,transparent)]', hex: NEON.violet },
  orange: { text: 'text-[color:var(--neon-orange)]', border: 'border-[color:var(--neon-orange)]', dot: 'bg-[color:var(--neon-orange)]', rule: 'from-[color-mix(in_srgb,var(--neon-orange)_40%,transparent)]', hex: NEON.orange },
  red: { text: 'text-[color:var(--neon-pink-text)]', border: 'border-[color:var(--neon-hot-pink)]', dot: 'bg-[color:var(--neon-hot-pink)]', rule: 'from-[color-mix(in_srgb,var(--neon-hot-pink)_40%,transparent)]', hex: NEON.hotPink },
}

const panelId = (title: string) => headingId('panel', title)

// Cyber panel with neon border and circuit corners - Arasaka/Militech corporate UI
export function CyberPanel({
  title,
  children,
  accent,
  megacorpStyle = false,
}: {
  title: string
  children: ReactNode
  accent: PanelAccent
  megacorpStyle?: boolean
}) {
  const look = PANEL_ACCENT[accent]

  return (
    <section className="relative" aria-labelledby={panelId(title)}>
      {megacorpStyle && <CircuitPattern color={look.hex} />}

      <div className={`relative p-4 border bg-[color-mix(in_srgb,var(--neon-void)_95%,transparent)] shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] ${look.border}`}>
        {/* Corner accents with circuit lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" aria-hidden="true" />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${look.border}`} aria-hidden="true" />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${look.border}`} aria-hidden="true" />

        <header className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <span className="flex items-center gap-1" aria-hidden="true">
            <span className={`w-2 h-2 rounded-full ${look.dot}`} />
            <span className={`w-1 h-1 rounded-full opacity-60 ${look.dot}`} />
            <span className={`w-1 h-1 rounded-full opacity-30 ${look.dot}`} />
          </span>
          <h2 id={panelId(title)} className={`text-sm tracking-[0.3em] uppercase ${look.text}`}>
            {'//'} {title}
          </h2>
          <span className={`flex-1 h-px bg-gradient-to-r to-transparent ${look.rule}`} aria-hidden="true" />
        </header>

        {children}
      </div>
    </section>
  )
}

// Company card - Night City megacorp style (Arasaka, Militech, Kang Tao)
export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  const reducedMotion = useReducedMotion()

  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      aria-label={`${company.name}: ${company.tagline}. ${company.description}`}
    >
      <div
        className={`p-4 transition-all ${!reducedMotion ? 'group-hover:scale-[1.02]' : ''}`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,0,255,0.1), rgba(0,255,255,0.05))',
          border: `1px solid ${NEON.magenta}50`,
          clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
        }}
      >
        {/* Corner cut decorations - megacorp badge style */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/50" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-pink-500/50" aria-hidden="true" />

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" role="img" aria-hidden="true">{company.icon}</span>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-pink-500">{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm text-white/80 mb-3">{company.description}</p>
        <div className="flex flex-wrap gap-1">
          {company.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="text-sm px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}

// Band card - Johnny Silverhand style music legacy
export function BandCard({ band, years, linkProps }: BandSlot) {
  const reducedMotion = useReducedMotion()

  const content = (
    <article
      className={`p-4 h-full transition-all ${!reducedMotion ? 'hover:scale-[1.02]' : ''} group`}
      style={{
        background: 'linear-gradient(135deg, rgba(153,102,204,0.1), rgba(0,255,255,0.05))',
        border: `1px solid ${NEON.violet}50`,
        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
      }}
    >
      <h3 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
        {band.name}
      </h3>
      <p className="text-sm mt-1 text-[color:var(--neon-lilac)]">
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm text-white/80 mt-2">
          {RELEASED} <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
      {linkProps && <div className="text-sm text-cyan-400 mt-2" aria-hidden="true">[STREAM_LINK]</div>}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
      {content}
    </a>
  )
}

// Work experience card - cyber dossier / personnel file style. Dates are date only strings (UTC
// midnight), so the year is read in UTC: a January start shows its own year west of UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'ACTIVE')
  const reducedMotion = useReducedMotion()

  return (
    <article
      className={`relative p-4 border border-white/10 transition-all ${!reducedMotion ? 'hover:border-cyan-400/50' : ''} group`}
      style={{
        background: 'linear-gradient(135deg, rgba(0,255,255,0.05), transparent)',
        clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
      }}
      aria-label={`${entry.title} at ${entry.company}, ${startDisplay} to ${endDisplay}`}
    >
      {/* Header with title and dates */}
      <header className="flex justify-between items-start gap-2 mb-2">
        <div>
          <h3 className="text-sm text-cyan-400 group-hover:text-pink-400 transition-colors font-mono">
            {entry.title}
          </h3>
          <div className="text-sm text-pink-500 mt-0.5">{entry.company}</div>
        </div>
        <span className="text-sm text-white/70 font-mono px-2 py-0.5 bg-white/5 border border-white/10 whitespace-nowrap">
          {startDisplay} - {endDisplay}
        </span>
      </header>

      {entry.description && <p className="text-sm text-white/80 mb-2 font-mono">{entry.description}</p>}

      {/* Highlights as impact statements */}
      {entry.highlights.length > 0 && (
        <ul className="space-y-1 mb-2" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm text-cyan-400 flex items-start gap-2 font-mono">
              <span className="text-pink-500" aria-hidden="true">&gt;</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* Skills tags */}
      {entry.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1 mt-2" aria-label="Skills used">
          {entry.skills.slice(0, 5).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-mono"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// Project card - netrunner gig file: his role, the result line and the links that open the project
export function ProjectCard({ project, years, links }: ProjectSlot) {
  const reducedMotion = useReducedMotion()

  return (
    <article
      className={`h-full p-3 border border-white/10 ${!reducedMotion ? 'hover:border-pink-500/50' : ''} transition-colors group`}
      style={{ background: 'linear-gradient(135deg, rgba(255,0,255,0.05), transparent)' }}
    >
      <header className="flex justify-between items-start gap-2">
        <h3 className="text-sm text-cyan-400 group-hover:text-pink-400 transition-colors font-mono">{project.name}</h3>
        {years && <span className="text-sm text-white/70 font-mono whitespace-nowrap">{years}</span>}
      </header>
      <p className="text-sm text-yellow-300 mt-1 font-mono">{project.role}</p>
      <p className="text-sm text-white/80 mt-1">{project.tagline}</p>
      {project.impact && <p className="text-sm text-pink-400 mt-1 italic">&gt; {project.impact}</p>}
      {project.techStack.length > 0 && (
        <ul className="flex gap-2 mt-2 flex-wrap" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li key={tech} className="text-sm px-1 py-0.5 bg-white/5 text-cyan-400 font-mono">
              {tech}
            </li>
          ))}
        </ul>
      )}
      {links.length > 0 ? (
        <div className="flex gap-3 mt-3 flex-wrap">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className="inline-flex items-center min-h-[44px] px-3 text-sm font-mono border border-cyan-400/60 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              [{label.toUpperCase()}]
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/70 mt-3 font-mono">{NO_PUBLIC_LINK}</p>
      )}
    </article>
  )
}

// Tech category display - cyberware/netrunner deck style
export function TechCategory({ category }: { category: CVData['techStack'][number] }) {
  return (
    <div className="mb-4" role="region" aria-labelledby={headingId('tech-cat', category.name)}>
      <header className="flex items-center gap-2 mb-2">
        <span className="text-base" role="img" aria-hidden="true">{category.icon}</span>
        <h3
          id={headingId('tech-cat', category.name)}
          className="text-sm text-pink-500 tracking-wider font-mono"
        >
          {category.name.toUpperCase()}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-pink-500/30 to-transparent" aria-hidden="true" />
      </header>
      <div className="flex flex-wrap gap-2" role="list" aria-label={`${category.name} technologies`}>
        {category.items.map((tech, i) => (
          <span
            key={tech}
            className="px-2 py-1 text-sm font-mono transition-all hover:scale-105 cursor-default"
            style={{
              background: `${TECH_TINTS[i % TECH_TINTS.length]}15`,
              border: `1px solid ${TECH_TINTS[i % TECH_TINTS.length]}40`,
              color: TECH_TINTS[i % TECH_TINTS.length],
            }}
            role="listitem"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
