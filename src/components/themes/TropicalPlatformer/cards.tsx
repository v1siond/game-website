import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import { jobYears } from '@/components/cv/sectionText'
import { COLORS } from './palette'
import { AkuAkuMask, CrashSilhouette, GemIcon, WoodenCrate, WumpaFruit } from './icons'

// Tropical Platformer: the cards for jobs, projects, ventures and bands, the tech crates, the warp zone
// profession button and the header life counter.


// ============================================================================
// TECH CRATES - Engineer tech stack as crate chips
// ============================================================================
export function TechCrates({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3
            className="text-sm tracking-widest mb-3 font-black uppercase flex items-center gap-2"
            style={{ color: COLORS.maskYellow, fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            <WumpaFruit size={18} />
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-2 text-sm font-bold transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.crateWood}, ${COLORS.beachBrown})`,
                  border: `2px solid ${COLORS.cratePeru}`,
                  color: '#fff',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
                  borderRadius: '4px',
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
// EXPERIENCE CARD. Dates are date only strings (UTC midnight), so the year is read in UTC.
// ============================================================================
export function ExperienceCard({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'Present')

  return (
    <article
      className="p-4 rounded-lg transition-transform hover:scale-[1.01]"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateWood}e6, ${COLORS.jungleDark}cc)`,
        border: `2px solid ${COLORS.maskYellow}80`,
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
        <div>
          <h3 className="text-lg font-bold" style={{ color: '#fff' }}>{entry.title}</h3>
          <p className="text-sm font-semibold" style={{ color: COLORS.maskYellow }}>{entry.company}</p>
        </div>
        <span
          className="text-sm px-3 py-1 rounded font-bold"
          style={{ background: '#0a1f5c', color: COLORS.oceanSky, whiteSpace: 'nowrap' }}
        >
          {startDisplay} - {endDisplay}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm mb-3" style={{ color: COLORS.beachTan }}>{entry.description}</p>
      )}
      {entry.highlights.length > 0 && (
        <ul className="space-y-2" aria-label="Key achievements">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: '#fff' }}>
              <WumpaFruit size={14} className="flex-shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Skills used">
          {entry.skills.map((skill) => (
            <li
              key={skill}
              className="text-sm px-2 py-1 rounded"
              style={{ background: COLORS.jungleDark, color: COLORS.nitroBright, border: `1px solid ${COLORS.jungleLime}80` }}
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
// PROJECT CARD - his role, the years, the impact and the links
// ============================================================================
export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <article
      className="h-full p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateWood}f0, ${COLORS.jungleDark}d9)`,
        border: `3px solid ${project.highlight ? COLORS.gemBlue : COLORS.cratePeru}`,
        boxShadow: project.highlight ? `0 0 25px ${COLORS.gemBlue}40` : 'none',
      }}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#fff' }}>
          {project.highlight && <GemIcon size={16} color="blue" />}
          {project.name}
        </h3>
        {years && (
          <span className="text-sm font-bold whitespace-nowrap" style={{ color: COLORS.oceanSky }}>
            {years}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold mt-1" style={{ color: COLORS.maskYellow }}>{project.role}</p>
      <p className="text-sm mt-2" style={{ color: COLORS.beachTan }}>{project.tagline}</p>
      {project.impact && (
        <p className="text-sm mt-2 font-bold flex items-start gap-2" style={{ color: '#fff' }}>
          <WumpaFruit size={16} className="flex-shrink-0 mt-0.5" />
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Technologies used">
          {project.techStack.map((tech) => (
            <li
              key={tech}
              className="text-sm px-2 py-1 rounded"
              style={{ background: COLORS.jungleDark, color: COLORS.nitroBright, border: `1px solid ${COLORS.jungleLime}80` }}
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
              className="inline-flex items-center min-h-[44px] px-4 text-sm font-black tracking-widest transition-all hover:scale-105"
              style={{
                background: `linear-gradient(180deg, ${COLORS.crashOrangeDark}, #a33f00)`,
                border: `3px solid ${COLORS.maskYellow}`,
                color: '#fff',
                textShadow: '1px 1px 0 rgba(0,0,0,0.6)',
                fontFamily: 'Impact, sans-serif',
                borderRadius: '6px',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-4 italic" style={{ color: COLORS.beachTan }}>No public link</p>
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
      className="block h-full p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crateWood}f0, ${COLORS.jungleDark}d9)`,
        border: `2px solid ${COLORS.cratePeru}`,
      }}
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
    >
      <div className="flex items-center gap-3 mb-2">
        <WoodenCrate size={36} variant="checkpoint" />
        <div>
          <h3 className="text-base font-bold" style={{ color: '#fff' }}>
            {company.name}
          </h3>
          <p className="text-sm font-semibold" style={{ color: COLORS.maskYellow }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm" style={{ color: COLORS.beachTan }}>{company.description}</p>
    </a>
  )
}

// ============================================================================
// BAND CARD - his role, the years and the release
// ============================================================================
export function BandCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 rounded-lg transition-all hover:scale-[1.02] group"
      style={{
        background: `linear-gradient(135deg, ${COLORS.cortexPurple}, ${COLORS.crateWood}e6)`,
        border: `2px solid ${COLORS.gemPurple}`,
      }}
    >
      <h3 className="text-base font-bold" style={{ color: '#fff' }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1 font-semibold" style={{ color: COLORS.maskYellow }}>
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years && <span>{years}</span>}
      </p>
      {band.release && (
        <p className="text-sm mt-2" style={{ color: COLORS.beachTan }}>
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}
    </article>
  )

  return linkProps ? (
    <a {...linkProps} className="block h-full">
      {content}
    </a>
  ) : (
    content
  )
}

// ============================================================================
// WARP ZONE - one profession portal of the shared switch
// ============================================================================
export const WARP_ZONES: Record<Profession, { color: string; gem: 'blue' | 'purple' | 'red' }> = {
  engineer: { color: COLORS.gemBlue, gem: 'blue' },
  drummer: { color: COLORS.gemPurple, gem: 'purple' },
  fighter: { color: COLORS.gemRed, gem: 'red' },
}

export function WarpZone({ id, label, selected, optionProps, reducedMotion }: ProfessionOption & { reducedMotion: boolean }) {
  const zone = WARP_ZONES[id]

  return (
    <button
      type="button"
      {...optionProps}
      className="relative group focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl"
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-xl blur-2xl transition-all duration-300 ${
          selected ? 'opacity-70 scale-150' : 'opacity-0 group-hover:opacity-40'
        }`}
        style={{ background: zone.color }}
        aria-hidden="true"
      />

      {/* Warp portal button */}
      <div
        className={`relative w-24 h-28 sm:w-32 sm:h-32 rounded-xl flex flex-col items-center justify-center px-1 transition-all duration-300 ${
          selected ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          background: `linear-gradient(135deg, ${zone.color}40, ${COLORS.crateWood})`,
          border: `4px solid ${selected ? zone.color : COLORS.cratePeru}`,
          boxShadow: selected
            ? `0 0 40px ${zone.color}70, inset 0 0 25px ${zone.color}40`
            : '0 6px 16px rgba(0,0,0,0.5)',
        }}
      >
        <GemIcon size={40} color={zone.gem} />
        <span
          className="text-sm tracking-wide uppercase mt-2 font-black text-center leading-tight"
          style={{
            color: selected ? '#fff' : COLORS.beachSand,
            fontFamily: 'Impact, Arial Black, sans-serif',
            textShadow: '1px 1px 0 #000',
          }}
        >
          {label}
        </span>
      </div>

      {/* Aku Aku appearing when picked */}
      {selected && !reducedMotion && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-aku-bounce" aria-hidden="true">
          <AkuAkuMask size={35} animated={false} />
        </div>
      )}
    </button>
  )
}

// ============================================================================
// LIFE COUNTER - Crash face with lives
// ============================================================================
export function LifeCounter({ lives = 99, className = '' }: { lives?: number; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="img"
      aria-label={`${lives} lives`}
    >
      <CrashSilhouette size={22} />
      <span
        className="font-black text-xl"
        style={{
          color: COLORS.maskYellow,
          textShadow: '2px 2px 0 #000',
          fontFamily: 'Impact, Arial Black, sans-serif',
        }}
      >
        x {lives}
      </span>
    </div>
  )
}
