import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import {
  FADED_TEXT,
  NUKA_GLOW_TEXT,
  NUKA_RED,
  PIPBOY_GREEN,
  PIPBOY_GREEN_DIM,
  PIPBOY_GREEN_GLOW,
  TERMINAL_AMBER,
  TERMINAL_BG,
  TERMINAL_TEXT,
  VAULT_BLUE,
  VAULT_YELLOW,
  pipboyScreenBg,
  rustTexture,
  wornPaperBg,
} from './palette'
import { RadiationSymbol } from './icons'

// The selector tab and the cards each section lists.

// The Pip-Boy stat each profession tab carries, a S.P.E.C.I.A.L. letter and no score.
export const PIPBOY_STATS: Record<Profession, string> = {
  drummer: 'AGL',
  engineer: 'INT',
  fighter: 'STR',
}

// One Pip-Boy tab of the shared profession switch.
export function PipBoyTab({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className="relative w-full md:w-auto px-3 md:px-6 py-3 font-mono focus:outline-none focus-visible:ring-2 transition-all"
      style={{
        background: selected ? `linear-gradient(180deg, ${PIPBOY_GREEN}20, ${PIPBOY_GREEN}05)` : 'transparent',
        border: `2px solid ${selected ? PIPBOY_GREEN : PIPBOY_GREEN_DIM}`,
        boxShadow: selected ? `0 0 20px ${PIPBOY_GREEN_GLOW}, inset 0 0 20px ${PIPBOY_GREEN}10` : 'none',
      }}
    >
      <span className="block text-sm mb-1" style={{ color: selected ? VAULT_YELLOW : FADED_TEXT }} aria-hidden="true">
        [{PIPBOY_STATS[id]}]
      </span>
      <span
        className="block text-sm font-bold tracking-wider uppercase"
        style={{
          color: selected ? PIPBOY_GREEN : PIPBOY_GREEN_DIM,
          textShadow: selected ? `0 0 8px ${PIPBOY_GREEN_GLOW}` : 'none',
        }}
      >
        {selected && <span aria-hidden="true">{'> '}</span>}
        {label}
      </span>
    </button>
  )
}

export function TechStackTerminal({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6 font-mono">
      {categories.map((cat, idx) => (
        <div key={cat.id}>
          <h3 className="text-sm tracking-wider mb-3 flex items-center gap-2" style={{ color: PIPBOY_GREEN }}>
            <span style={{ color: VAULT_YELLOW }} aria-hidden="true">[{String(idx + 1).padStart(2, '0')}]</span>
            <span aria-hidden="true">{cat.icon}</span>
            {cat.name.toUpperCase()}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${cat.name} technologies`}>
            {cat.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1 text-sm font-bold"
                style={{
                  background: TERMINAL_BG,
                  border: `1px solid ${PIPBOY_GREEN}`,
                  color: PIPBOY_GREEN,
                  textShadow: `0 0 4px ${PIPBOY_GREEN}40`,
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

// Dates are date only strings (UTC midnight), so the year is read in UTC.
export function ExperienceCard({ entry }: { entry: Job }) {
  const startYear = entry.startDate.getUTCFullYear()
  const endYear = entry.endDate ? entry.endDate.getUTCFullYear() : 'PRESENT'
  const isActive = !entry.endDate

  return (
    <article
      className="relative p-4 font-mono"
      style={{
        background: wornPaperBg,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${isActive ? PIPBOY_GREEN : FADED_TEXT}40`,
      }}
    >
      {/* Status stamp */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 text-sm font-bold"
        style={{
          border: `1px solid ${isActive ? PIPBOY_GREEN : FADED_TEXT}`,
          color: isActive ? PIPBOY_GREEN : FADED_TEXT,
          transform: 'rotate(-3deg)',
        }}
        aria-hidden="true"
      >
        {isActive ? 'ACTIVE DUTY' : 'ARCHIVED'}
      </div>

      <div className="pr-28 mb-2">
        <h3 className="text-base font-bold uppercase tracking-wide" style={{ color: PIPBOY_GREEN }}>
          {entry.title}
        </h3>
        <p className="text-sm mt-1" style={{ color: VAULT_YELLOW }}>{entry.company}</p>
      </div>

      <div
        className="inline-block px-2 py-1 text-sm mb-3"
        style={{
          background: `${VAULT_BLUE}30`,
          border: `1px solid ${VAULT_BLUE}`,
          color: VAULT_YELLOW,
        }}
      >
        {startYear} - {endYear}
      </div>

      {entry.description && <p className="text-sm mb-3" style={{ color: FADED_TEXT }}>{entry.description}</p>}

      {entry.highlights.length > 0 && (
        <ul className="space-y-1 border-t pt-2" style={{ borderColor: `${PIPBOY_GREEN}30` }} aria-label="Key achievements">
          {entry.highlights.map((h) => (
            <li key={h} className="text-sm flex items-start gap-2" style={{ color: TERMINAL_TEXT }}>
              <span style={{ color: TERMINAL_AMBER }} aria-hidden="true">+</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {entry.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1 mt-3" aria-label="Skills used">
          {entry.skills.slice(0, 5).map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-0.5"
              style={{ background: `${PIPBOY_GREEN}15`, border: `1px solid ${PIPBOY_GREEN}40`, color: PIPBOY_GREEN_DIM }}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// His role, the result line and the links.
export function ProjectCard({ project, years, links }: ProjectSlot) {
  const isHighlight = project.highlight

  return (
    <article
      className="relative p-4 font-mono h-full"
      style={{
        background: isHighlight ? rustTexture : pipboyScreenBg,
        backgroundColor: isHighlight ? `${VAULT_BLUE}10` : TERMINAL_BG,
        border: `2px solid ${isHighlight ? VAULT_YELLOW : PIPBOY_GREEN}50`,
        boxShadow: isHighlight ? `0 0 15px ${VAULT_YELLOW}15` : 'none',
      }}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-base font-bold uppercase tracking-wide" style={{ color: PIPBOY_GREEN }}>
          {project.name}
        </h3>
        {years && (
          <span className="text-sm whitespace-nowrap" style={{ color: VAULT_YELLOW }}>
            {years}
          </span>
        )}
      </div>
      <p className="text-sm mt-1 font-bold" style={{ color: VAULT_YELLOW }}>{project.role}</p>
      <p className="text-sm mt-1" style={{ color: FADED_TEXT }}>{project.tagline}</p>

      {project.impact && (
        <p
          className="text-sm mt-3 p-2 flex items-start gap-2"
          style={{
            background: `${TERMINAL_AMBER}10`,
            border: `1px solid ${TERMINAL_AMBER}40`,
            color: TERMINAL_AMBER,
          }}
        >
          <RadiationSymbol size={12} color={TERMINAL_AMBER} />
          {project.impact}
        </p>
      )}

      {project.techStack.length > 0 && (
        <ul className="flex flex-wrap gap-1 mt-3" aria-label="Technologies used">
          {project.techStack.slice(0, 5).map((tech) => (
            <li
              key={tech}
              className="text-sm px-1.5 py-0.5 font-bold"
              style={{
                background: `${PIPBOY_GREEN}15`,
                border: `1px solid ${PIPBOY_GREEN}40`,
                color: PIPBOY_GREEN_DIM,
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
              className="inline-flex items-center min-h-[44px] px-4 text-sm font-bold tracking-wider uppercase focus:outline-none focus-visible:ring-2 transition-all hover:scale-105"
              style={{ background: TERMINAL_BG, border: `2px solid ${PIPBOY_GREEN}`, color: PIPBOY_GREEN }}
            >
              [{label}]
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-4" style={{ color: FADED_TEXT }}>No public link</p>
      )}
    </article>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className="block h-full p-4 font-mono transition-all hover:scale-[1.02]"
      style={{
        background: pipboyScreenBg,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${VAULT_BLUE}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" aria-hidden="true">{company.icon}</span>
        <div>
          <h3 className="text-base font-bold uppercase tracking-wide" style={{ color: PIPBOY_GREEN }}>
            {company.name}
          </h3>
          <p className="text-sm" style={{ color: VAULT_YELLOW }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: FADED_TEXT }}>{company.description}</p>
      <div className="mt-2 text-sm" style={{ color: PIPBOY_GREEN_DIM }} aria-hidden="true">
        [ACCESS TERMINAL &gt;]
      </div>
    </a>
  )
}

// His role, the years and the release.
export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="p-4 font-mono h-full"
      style={{
        background: rustTexture,
        backgroundColor: TERMINAL_BG,
        border: `1px solid ${NUKA_RED}50`,
      }}
    >
      <h3 className="text-base font-bold uppercase tracking-wide" style={{ color: NUKA_GLOW_TEXT }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1" style={{ color: VAULT_YELLOW }}>
        {band.role}
        {years && <span aria-hidden="true"> {'//'} </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: FADED_TEXT }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full transition-all hover:scale-[1.02]">
      {content}
    </a>
  )
}
