import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job, Project } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { BORDERLANDS_COLORS } from './palette'

// Character card with bold outlines - Vault Hunter skill tree selection style. ProfessionSwitch owns
// the order (Musician, System Engineer, Martial Artist), the pick and the keyboard; the card draws.
const HUNTERS: Record<Profession, { icon: string; color: string; actionSkill: string }> = {
  engineer: { icon: '💻', color: BORDERLANDS_COLORS.rare, actionSkill: 'DEPLOY INFRASTRUCTURE' },
  drummer: { icon: '🥁', color: BORDERLANDS_COLORS.legendary, actionSkill: 'RHYTHMIC ASSAULT' },
  fighter: { icon: '🥊', color: BORDERLANDS_COLORS.psychoRed, actionSkill: 'MELEE OVERRIDE' },
}

export function VaultHunterCard({ option, reducedMotion = false }: { option: ProfessionOption; reducedMotion?: boolean }) {
  const { id: profession, label, selected: isActive, optionProps } = option
  const hunter = HUNTERS[profession]

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative focus:outline-none focus:ring-4 focus:ring-yellow-400 ${reducedMotion ? '' : 'transition-all duration-200'} ${
        isActive ? 'scale-110 z-10' : 'hover:scale-105'
      }`}
      style={{
        transform: isActive ? 'scale(1.1) rotate(-2deg)' : '',
      }}
    >
      <div
        className="p-3 sm:p-6 text-center relative overflow-hidden"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${hunter.color} 0%, ${hunter.color}cc 100%)`
            : `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, #ddd5c5 100%)`,
          border: `6px solid ${BORDERLANDS_COLORS.ink}`,
          boxShadow: isActive
            ? `6px 6px 0 ${BORDERLANDS_COLORS.ink}, 0 0 20px ${hunter.color}60`
            : `5px 5px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {/* Cel-shading highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }}
        />

        <span className="text-3xl sm:text-5xl block mb-2 relative z-10" style={{ filter: `drop-shadow(4px 4px 0 ${BORDERLANDS_COLORS.ink})` }} aria-hidden="true">
          {hunter.icon}
        </span>
        <span
          className="text-sm sm:text-lg font-black tracking-wider block relative z-10 uppercase"
          aria-hidden="true"
          style={{
            color: isActive ? '#fff' : BORDERLANDS_COLORS.ink,
            textShadow: isActive ? `2px 2px 0 ${BORDERLANDS_COLORS.ink}` : 'none',
            WebkitTextStroke: isActive ? `1px ${BORDERLANDS_COLORS.ink}` : 'none',
          }}
        >
          {label}
        </span>

        {/* Action skill indicator */}
        <div
          className="mt-3 px-2 py-1 relative z-10 hidden sm:block"
          aria-hidden="true"
          style={{
            background: isActive ? BORDERLANDS_COLORS.ink : 'transparent',
            border: `2px solid ${isActive ? BORDERLANDS_COLORS.clapTrapYellow : hunter.color}`,
          }}
        >
          <span
            className="text-sm font-black tracking-widest"
            style={{ color: isActive ? BORDERLANDS_COLORS.clapTrapYellow : hunter.color }}
          >
            {hunter.actionSkill}
          </span>
        </div>
      </div>

      {/* Selection burst - SELECTED badge */}
      {isActive && (
        <div className="absolute -top-5 -right-5" aria-hidden="true">
          <svg width="55" height="55" viewBox="0 0 55 55">
            <polygon
              points="27.5,0 33,20 55,20 37,31 44,55 27.5,40 11,55 18,31 0,20 22,20"
              fill={BORDERLANDS_COLORS.clapTrapYellow}
              stroke={BORDERLANDS_COLORS.ink}
              strokeWidth="3"
            />
            <text x="27.5" y="32" textAnchor="middle" fill={BORDERLANDS_COLORS.ink} fontSize="8" fontWeight="900" fontFamily="Bangers, Impact, sans-serif">
              ACTIVE
            </text>
          </svg>
        </div>
      )}
    </button>
  )
}

// Tech tag with comic styling - loot item style
function TechTag({ name, color, reducedMotion = false }: { name: string; color: string; reducedMotion?: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-sm font-bold cursor-default ${reducedMotion ? '' : 'transition-transform hover:scale-110 hover:rotate-2'}`}
      style={{
        background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
        color: BORDERLANDS_COLORS.ink,
        border: `2px solid ${BORDERLANDS_COLORS.ink}`,
        boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      {name}
    </span>
  )
}

// Tech stack cloud for engineer (Borderlands weapon manufacturer style)
export function TechStackCloud({ categories, reducedMotion = false }: { categories: CVData['techStack']; reducedMotion?: boolean }) {
  const colors = [
    BORDERLANDS_COLORS.legendary,
    BORDERLANDS_COLORS.rare,
    BORDERLANDS_COLORS.psychoRed,
    BORDERLANDS_COLORS.clapTrapYellow,
    BORDERLANDS_COLORS.uncommon,
    BORDERLANDS_COLORS.eridium,
  ]

  return (
    <div className="space-y-5" role="list" aria-label="Technical skills by category">
      {categories.map((category, catIndex) => (
        <div key={category.id} className="mb-3" role="listitem">
          <h3
            className="text-sm tracking-widest mb-2 flex items-center gap-2 font-black"
            style={{ color: colors[catIndex % colors.length] }}
          >
            <span className="text-lg" aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <TechTag key={tech} name={tech} color={colors[catIndex % colors.length]} reducedMotion={reducedMotion} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Experience Card - work history styled as mission briefing / ECHO log. Dates are date only strings
// (UTC midnight), so the year is read in UTC: a January start keeps its own year west of UTC.
export function ExperienceCard({ entry, index, reducedMotion = false }: { entry: Job; index: number; reducedMotion?: boolean }) {
  const borderColors = [BORDERLANDS_COLORS.legendary, BORDERLANDS_COLORS.rare, BORDERLANDS_COLORS.psychoRed]
  const color = borderColors[index % 3]
  const { start: startYear, end: endYear } = jobYears(entry, 'ACTIVE')

  return (
    <article
      className={`relative p-4 mb-4 ${reducedMotion ? '' : 'transition-transform hover:scale-[1.01]'}`}
      aria-label={`${entry.title} at ${entry.company}, ${startYear} to ${endYear}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, ${color}08 100%)`,
        border: `5px solid ${BORDERLANDS_COLORS.ink}`,
        boxShadow: `4px 4px 0 ${BORDERLANDS_COLORS.ink}`,
        transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`,
      }}
    >
      {/* Cel-shading edge */}
      <div
        className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
        aria-hidden="true"
        style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)` }}
      />

      {/* Mission date badge */}
      <div
        className="absolute top-0 left-0 px-3 py-1 text-sm font-black tracking-wider"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          color: '#fff',
          border: `3px solid ${BORDERLANDS_COLORS.ink}`,
          transform: 'translate(-8px, -8px) rotate(-3deg)',
          textShadow: `1px 1px 0 ${BORDERLANDS_COLORS.ink}`,
          boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {startYear} - {endYear}
      </div>

      <h3
        className="text-lg font-black mt-5 mb-1"
        style={{
          color: BORDERLANDS_COLORS.ink,
          textShadow: `2px 2px 0 ${color}`,
          WebkitTextStroke: `0.5px ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {entry.title}
      </h3>
      <p className="text-sm font-bold mb-2 text-[#1a1a1a]">{entry.company}</p>

      {entry.description && (
        <p className="text-sm mb-2 font-sans text-[#1a1a1a]">{entry.description}</p>
      )}

      {entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5 font-sans" aria-label="Key accomplishments">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2 text-[#1a1a1a]">
              <span className="text-[8px] mt-[3px]" style={{ color }} aria-hidden="true">
                ◆
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

type Rarity = 'common' | 'rare' | 'legendary' | 'pearlescent'

const RARITY_LOOK: Record<Rarity, { color: string; label: string; glow: boolean }> = {
  common: { color: BORDERLANDS_COLORS.common, label: 'COMMON', glow: false },
  rare: { color: BORDERLANDS_COLORS.rare, label: 'RARE', glow: false },
  legendary: { color: BORDERLANDS_COLORS.legendary, label: 'LEGENDARY', glow: true },
  pearlescent: { color: BORDERLANDS_COLORS.pearlescent, label: 'PEARLESCENT', glow: true },
}

// The loot rarity is only a colour: the first project glows pearlescent, a featured one legendary.
export const rarityFor = (project: Project, index: number): Rarity => {
  if (index === 0) return 'pearlescent'
  if (project.featured) return 'legendary'
  return index < 3 ? 'rare' : 'common'
}

// Loot card for projects - Borderlands weapon card style: his role, the result line and the links
export function LootCard({ slot: { project, years, links }, rarity, reducedMotion = false }: { slot: ProjectSlot; rarity: Rarity; reducedMotion?: boolean }) {
  const config = RARITY_LOOK[rarity]

  return (
    <article
      className={`relative h-full p-4 group ${reducedMotion ? '' : 'transition-transform hover:scale-[1.02] hover:rotate-1'}`}
      aria-labelledby={`loot-${project.id}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, ${config.color}10 100%)`,
        border: `5px solid ${config.color}`,
        boxShadow: config.glow
          ? `4px 4px 0 ${BORDERLANDS_COLORS.ink}, 0 0 25px ${config.color}50`
          : `4px 4px 0 ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      {/* Cel-shading highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
        }}
      />

      {/* Rarity banner */}
      <div
        className="absolute -top-3 left-4 px-3 py-0.5 text-sm font-black tracking-wider"
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, ${config.color} 0%, ${config.color}cc 100%)`,
          color: '#fff',
          border: `3px solid ${BORDERLANDS_COLORS.ink}`,
          transform: 'rotate(-2deg)',
          textShadow: `1px 1px 0 ${BORDERLANDS_COLORS.ink}`,
          boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {config.label}
      </div>

      <div className="flex justify-between items-start gap-2 mt-4 mb-1 relative z-10">
        <h3 id={`loot-${project.id}`} className="text-sm font-black" style={{ color: BORDERLANDS_COLORS.ink }}>
          {project.name}
        </h3>
        {years && <span className="text-sm font-bold whitespace-nowrap text-[#444]">{years}</span>}
      </div>
      <p className="text-sm font-bold mb-1 relative z-10 text-[#1a1a1a]">{project.role}</p>
      <p className="text-sm mb-2 relative z-10 font-sans text-[#444]">{project.tagline}</p>

      {/* Impact statement - the key achievement */}
      {project.impact && (
        <p
          className="text-sm mb-2 font-bold relative z-10 px-2 py-1"
          style={{
            color: config.color,
            background: `${BORDERLANDS_COLORS.ink}`,
            border: `1px solid ${config.color}`,
          }}
        >
          +{project.impact}
        </p>
      )}

      {/* Tech as weapon elements */}
      <div className="flex gap-1 flex-wrap relative z-10">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={tech}
            className="text-sm px-2 py-0.5 font-bold"
            style={{
              background: i === 0 ? config.color : BORDERLANDS_COLORS.ink,
              color: i === 0 ? BORDERLANDS_COLORS.ink : BORDERLANDS_COLORS.paper,
              border: `1px solid ${BORDERLANDS_COLORS.ink}`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {links.length > 0 ? (
        <div className="flex gap-2 flex-wrap mt-3 relative z-10">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className={`inline-flex items-center min-h-[44px] px-3 text-sm font-black tracking-wider uppercase bg-white text-[#1a1a1a] border-4 border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 ${reducedMotion ? '' : 'transition-transform hover:-rotate-2'}`}
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-3 italic relative z-10 text-[#444]">No public link</p>
      )}

      {/* Hover action lines - only if not reduced motion */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          aria-hidden="true"
          style={{
            background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${config.color}15 10px, ${config.color}15 20px)`,
          }}
        />
      )}
    </article>
  )
}

// Company card - Borderlands vendor / weapon manufacturer style
export function CompanyCard({ company, reducedMotion = false }: { company: CVData['companies'][number]; reducedMotion?: boolean }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${company.name} - ${company.tagline} (opens in a new tab)`}
      className={`block relative p-4 group ${reducedMotion ? '' : 'transition-all hover:scale-[1.02] hover:-rotate-1'}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, ${BORDERLANDS_COLORS.clapTrapYellow}10 100%)`,
        border: `5px solid ${BORDERLANDS_COLORS.clapTrapYellow}`,
        boxShadow: `5px 5px 0 ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      {/* Cel-shading highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%)',
        }}
      />

      {/* Marcus-style vendor banner */}
      <div
        className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1"
        style={{
          background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.clapTrapYellow} 0%, ${BORDERLANDS_COLORS.wastelandYellow} 100%)`,
          border: `3px solid ${BORDERLANDS_COLORS.ink}`,
          boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        <span className="text-sm font-black tracking-wider" style={{ color: BORDERLANDS_COLORS.ink }}>
          VENDOR
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2 mt-3 relative z-10">
        <span
          className="text-3xl"
          aria-hidden="true"
          style={{ filter: `drop-shadow(2px 2px 0 ${BORDERLANDS_COLORS.ink})` }}
        >
          {company.icon}
        </span>
        <div>
          <h3 className={`text-sm font-black ${reducedMotion ? '' : 'group-hover:text-[#ff6600] transition-colors'}`} style={{ color: BORDERLANDS_COLORS.ink }}>
            {company.name}
          </h3>
          <p className="text-sm font-bold text-[#1a1a1a]">{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm relative z-10 font-sans text-[#444]">{company.description}</p>

      {/* Services as weapon bonuses */}
      <div className="mt-3 space-y-1 relative z-10">
        {company.services.slice(0, 2).map((service) => (
          <div key={service} className="flex items-center gap-1">
            <span className="text-sm font-black" style={{ color: BORDERLANDS_COLORS.legendary }} aria-hidden="true">+</span>
            <span className="text-sm font-bold" style={{ color: BORDERLANDS_COLORS.ink }}>{service}</span>
          </div>
        ))}
      </div>
    </a>
  )
}

// Band card - Borderlands Echo device / audio log style
export function BandCard({ slot: { band, years, linkProps }, reducedMotion = false }: { slot: BandSlot; reducedMotion?: boolean }) {
  const content = (
    <article
      className={`relative h-full p-4 group ${reducedMotion ? '' : 'transition-all hover:scale-[1.02] hover:rotate-1'}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.ink} 0%, #252535 100%)`,
        border: `5px solid ${BORDERLANDS_COLORS.eridium}`,
        boxShadow: `5px 5px 0 ${BORDERLANDS_COLORS.ink}, 0 0 20px ${BORDERLANDS_COLORS.eridium}40`,
      }}
    >
      {/* Cel-shading edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        aria-hidden="true"
        style={{ background: `linear-gradient(90deg, ${BORDERLANDS_COLORS.eridium}40 0%, transparent 50%, ${BORDERLANDS_COLORS.eridium}20 100%)` }}
      />

      {/* Echo device top bar */}
      <div className="flex items-center gap-2 mb-3" aria-hidden="true">
        <div
          className={`w-3 h-3 rounded-full ${reducedMotion ? '' : 'animate-pulse'}`}
          style={{ background: BORDERLANDS_COLORS.uncommon, boxShadow: `0 0 10px ${BORDERLANDS_COLORS.uncommon}` }}
        />
        <span className="text-sm tracking-widest font-bold" style={{ color: BORDERLANDS_COLORS.eridium }}>ECHO RECORDING</span>
      </div>

      <h3 className={`text-sm font-black ${reducedMotion ? '' : 'group-hover:text-[#ff6600] transition-colors'}`} style={{ color: BORDERLANDS_COLORS.paper }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1 font-bold text-[#c9a6ff]">
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm mt-2 font-sans text-[#ccc]">
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}

      {/* Audio wave decoration */}
      <div className="absolute bottom-2 right-2 flex items-end gap-0.5" aria-hidden="true">
        {[3, 5, 2, 6, 4, 3, 5].map((h, i) => (
          <div
            key={i}
            className={`w-1 ${reducedMotion ? '' : 'animate-pulse'}`}
            style={{
              height: h * 2.5,
              background: BORDERLANDS_COLORS.eridium,
              animationDelay: reducedMotion ? '0s' : `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400">
      {content}
    </a>
  )
}
