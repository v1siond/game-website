'use client'

import { useReducedMotion } from './motion'
import { CircuitPattern } from './effects'
import type { BandSlot } from '@/components/cv/BandList'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { CVData, Job } from '@/lib/cv/content'

// Cyber panel with neon border and holographic effect - Arasaka/Militech corporate UI
export function CyberPanel({
  title,
  children,
  accentColor = '#ff00ff',
  holographic = false,
  megacorpStyle = false
}: {
  title: string
  children: React.ReactNode
  accentColor?: string
  holographic?: boolean
  megacorpStyle?: boolean
}) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      className="relative group"
      aria-labelledby={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Glow effect */}
      {!reducedMotion && (
        <div
          className="absolute -inset-0.5 opacity-40 blur-sm group-hover:opacity-60 transition-opacity"
          style={{ background: `linear-gradient(45deg, ${accentColor}, #00ffff)` }}
          aria-hidden="true"
        />
      )}

      {/* Circuit pattern border */}
      {megacorpStyle && <CircuitPattern color={accentColor} />}

      {/* Panel */}
      <div
        className={`relative p-4 ${holographic ? 'backdrop-blur-sm' : ''}`}
        style={{
          background: holographic
            ? `linear-gradient(135deg, rgba(10, 5, 18, 0.85), rgba(20, 10, 30, 0.75))`
            : 'rgba(10, 5, 18, 0.95)',
          border: `1px solid ${accentColor}`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px ${accentColor}30`,
        }}
      >
        {/* Corner accents with circuit lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-2 left-8 w-4 h-px" style={{ background: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-8 left-2 w-px h-4" style={{ background: '#00ffff' }} aria-hidden="true" />

        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-2 right-8 w-4 h-px" style={{ background: '#00ffff' }} aria-hidden="true" />
        <div className="absolute top-8 right-2 w-px h-4" style={{ background: '#00ffff' }} aria-hidden="true" />

        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-2 left-8 w-4 h-px" style={{ background: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-8 left-2 w-px h-4" style={{ background: accentColor }} aria-hidden="true" />

        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-2 right-8 w-4 h-px" style={{ background: accentColor }} aria-hidden="true" />
        <div className="absolute bottom-8 right-2 w-px h-4" style={{ background: accentColor }} aria-hidden="true" />

        {/* Title with data overlay style */}
        <header className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1" aria-hidden="true">
            <div
              className={`w-2 h-2 rounded-full ${reducedMotion ? '' : 'animate-pulse'}`}
              style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
            />
            <div className="w-1 h-1 rounded-full opacity-60" style={{ background: accentColor }} />
            <div className="w-1 h-1 rounded-full opacity-30" style={{ background: accentColor }} />
          </div>
          <h2
            id={`panel-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm tracking-[0.3em] uppercase"
            style={{ color: accentColor }}
          >
            {'//'} {title}
          </h2>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}40, transparent)` }} aria-hidden="true" />
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
      className="block relative group"
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

        {/* Megacorp logo area */}
        <div className="absolute top-1 right-5 text-[6px] text-cyan-400/30 font-mono" aria-hidden="true">
          CORP_ID:{company.id.toUpperCase().slice(0, 4)}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" role="img" aria-hidden="true">{company.icon}</span>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-pink-500">{company.tagline}</p>
          </div>
        </div>
        <p className="text-xs text-white/70 mb-3">{company.description}</p>
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

        {/* External link indicator */}
        <div
          className="absolute top-2 right-6 text-sm text-cyan-400/50 group-hover:text-cyan-400 transition-colors"
          aria-hidden="true"
        >
          [LINK]
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
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
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
  const endDisplay = entry.endDate ? entry.endDate.getUTCFullYear() : 'ACTIVE'
  const startDisplay = entry.startDate.getUTCFullYear()
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
        <p className="text-sm text-white/70 mt-3 font-mono">No public link</p>
      )}
    </article>
  )
}

// Tech category display - cyberware/netrunner deck style
export function TechCategory({ category }: { category: CVData['techStack'][number] }) {
  return (
    <div className="mb-4" role="region" aria-labelledby={`tech-cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
      <header className="flex items-center gap-2 mb-2">
        <span className="text-base" role="img" aria-hidden="true">{category.icon}</span>
        <h3
          id={`tech-cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-xs text-pink-500 tracking-wider font-mono"
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
