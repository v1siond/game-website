'use client'

import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CircuitPattern } from './effects'
import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job } from '@/lib/cv/content'
import { headingId, jobYears, NO_PUBLIC_LINK, RELEASED } from '@/components/cv/sectionText'

export type PanelAccent = 'yellow' | 'green' | 'cyan' | 'magenta' | 'violet' | 'red' | 'orange'

// Each accent as the classes it paints and the hex the circuit pattern strokes with. Static
// classes only: no blur, no animated glow, so a panel costs nothing while the page scrolls.
const PANEL_ACCENT: Record<PanelAccent, { text: string; border: string; dot: string; rule: string; hex: string }> = {
  yellow: { text: 'text-[#ffff00]', border: 'border-[#ffff00]', dot: 'bg-[#ffff00]', rule: 'from-[#ffff00]/40', hex: '#ffff00' },
  green: { text: 'text-[#00ff66]', border: 'border-[#00ff66]', dot: 'bg-[#00ff66]', rule: 'from-[#00ff66]/40', hex: '#00ff66' },
  cyan: { text: 'text-[#00ffff]', border: 'border-[#00ffff]', dot: 'bg-[#00ffff]', rule: 'from-[#00ffff]/40', hex: '#00ffff' },
  magenta: { text: 'text-[#ff00ff]', border: 'border-[#ff00ff]', dot: 'bg-[#ff00ff]', rule: 'from-[#ff00ff]/40', hex: '#ff00ff' },
  violet: { text: 'text-[#b388e6]', border: 'border-[#9966cc]', dot: 'bg-[#9966cc]', rule: 'from-[#9966cc]/40', hex: '#9966cc' },
  orange: { text: 'text-[#ff6600]', border: 'border-[#ff6600]', dot: 'bg-[#ff6600]', rule: 'from-[#ff6600]/40', hex: '#ff6600' },
  red: { text: 'text-[#ff3385]', border: 'border-[#ff0066]', dot: 'bg-[#ff0066]', rule: 'from-[#ff0066]/40', hex: '#ff0066' },
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

      <div className={`relative p-4 border bg-[#0a0512]/95 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] ${look.border}`}>
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
          border: '1px solid #ff00ff50',
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
        border: '1px solid #9966cc50',
        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
      }}
    >
      <h3 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
        {band.name}
      </h3>
      <p className="text-sm mt-1 text-[#c4a3e6]">
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
              background: `${['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5]}15`,
              border: `1px solid ${['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5]}40`,
              color: ['#ff00ff', '#00ffff', '#ffff00', '#00ff66', '#ff6600'][i % 5],
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
