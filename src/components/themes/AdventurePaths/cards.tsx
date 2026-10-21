import type { ProjectSlot } from '@/components/cv/ProjectList'
import type { BandSlot } from '@/components/cv/BandList'
import type { CVData, Job } from '@/lib/cv/content'
import { jobYears } from '@/components/cv/sectionText'
import { MARIO_COLORS } from './palette'
import { BrickBlock, Coin, GreenPipe, QuestionBlock, Starman } from './icons'

// Tech inventory - Question block style
export function TechInventory({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="text-sm tracking-wider mb-2 flex items-center gap-2" style={{ color: MARIO_COLORS.groundBrown }}>
            <span aria-hidden="true"><Coin size={16} /></span>
            <span style={{ fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{category.name.toUpperCase()}</span>
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1.5 text-sm transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
                  border: `2px solid ${MARIO_COLORS.pipeMid}`,
                  color: '#FFF',
                  borderRadius: '2px',
                  boxShadow: `0 2px 0 ${MARIO_COLORS.pipeDark}`,
                  textShadow: '1px 1px 0 #000',
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

// Project card - Star style: his role, the result line and the links that open the project
export function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <article
      className="relative h-full p-4"
      style={{
        background: `linear-gradient(180deg, #FFF9E6, #FFF3CC)`,
        border: `3px solid ${MARIO_COLORS.groundBrown}`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 ${MARIO_COLORS.groundDarkest}`,
      }}
    >
      {project.highlight && (
        <div className="absolute -top-3 -right-3" aria-hidden="true">
          <Starman size={28} />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-sm font-bold" style={{ color: MARIO_COLORS.groundDarkest }}>
            {project.name}
          </h3>
          {years && (
            <span className="text-sm whitespace-nowrap" style={{ color: MARIO_COLORS.groundDark }}>{years}</span>
          )}
        </div>
        <p className="text-sm font-semibold mb-1" style={{ color: MARIO_COLORS.marioDarkRed }}>
          {project.role}
        </p>
        <p className="text-sm mb-2" style={{ color: MARIO_COLORS.groundDark }}>
          {project.tagline}
        </p>
        {project.impact && (
          <p className="text-sm mb-2 italic flex items-start gap-1" style={{ color: MARIO_COLORS.pipeDark }}>
            <span className="shrink-0 mt-0.5" aria-hidden="true"><Coin size={10} /></span>
            {project.impact}
          </p>
        )}
        {project.techStack.length > 0 && (
          <ul className="flex gap-1 flex-wrap" aria-label="Technologies used">
            {project.techStack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="text-sm px-2 py-0.5 rounded"
                style={{
                  background: MARIO_COLORS.pipeDark,
                  color: '#FFF',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {links.map(({ kind, label, linkProps }) => (
              <a
                key={kind}
                {...linkProps}
                className="inline-flex items-center min-h-[44px] px-3 text-sm font-bold transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                style={{
                  background: `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`,
                  border: `2px solid ${MARIO_COLORS.groundBrown}`,
                  color: '#FFF',
                  borderRadius: '4px',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm mt-3" style={{ color: MARIO_COLORS.groundDark }}>No public link</p>
        )}
      </div>
    </article>
  )
}

// Company card - Pipe style
export function PipeCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className="block p-4 transition-transform hover:scale-[1.02] group focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
        border: `3px solid ${MARIO_COLORS.pipeMid}`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 ${MARIO_COLORS.pipeDark}`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <GreenPipe height={40} width={32} />
          <div>
            <h3 className="text-sm text-white group-hover:text-yellow-200 transition-colors">
              {company.name}
            </h3>
            <p className="text-sm" style={{ color: MARIO_COLORS.coinGold }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm" style={{ color: '#C8E8C8' }}>{company.description}</p>
      </div>
    </a>
  )
}

// Band card - Music note style
export function MusicCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group relative"
      style={{
        background: `linear-gradient(180deg, #FFF9E6, #FFF3CC)`,
        border: `3px solid ${MARIO_COLORS.groundBrown}`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 ${MARIO_COLORS.groundDarkest}`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span aria-hidden="true"><Starman size={24} /></span>
          <h3 className="text-sm font-bold" style={{ color: MARIO_COLORS.groundDarkest }}>
            {band.name}
          </h3>
        </div>
        <p className="text-sm mt-1" style={{ color: MARIO_COLORS.groundDark }}>
          {band.role}
          {years && <span aria-hidden="true"> | </span>}
          {years && <span>{years}</span>}
        </p>
        {band.release && (
          <p className="text-sm mt-2" style={{ color: MARIO_COLORS.groundDarkest }}>
            Released <cite>&ldquo;{band.release}&rdquo;</cite>
          </p>
        )}
      </div>
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400">
      {content}
    </a>
  )
}

// Experience entry - Quest log style. Dates are date only strings (UTC midnight), so the year is read in UTC.
export function QuestEntry({ entry }: { entry: Job }) {
  const { start: startDisplay, end: endDisplay } = jobYears(entry, 'NOW')

  return (
    <article
      className="p-4 transition-transform hover:scale-[1.01] relative"
      style={{
        background: `linear-gradient(180deg, #3A3A8A, ${MARIO_COLORS.undergroundBlack})`,
        border: `3px solid #5A5A9A`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 #1A1A4A`,
      }}
      aria-label={`${entry.title} at ${entry.company}, ${startDisplay} to ${endDisplay}`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
          <div className="flex items-start gap-2">
            <span aria-hidden="true"><Coin size={18} /></span>
            <div>
              <h3 className="text-sm font-bold text-white">{entry.title}</h3>
              <p className="text-sm" style={{ color: MARIO_COLORS.coinGold }}>{entry.company}</p>
            </div>
          </div>
          <span
            className="text-sm px-2 py-1"
            style={{
              background: MARIO_COLORS.pipeDark,
              color: '#FFF',
              border: `1px solid ${MARIO_COLORS.pipeMid}`,
              borderRadius: '2px',
            }}
          >
            {startDisplay}-{endDisplay}
          </span>
        </div>
        {entry.description && <p className="text-sm mb-2" style={{ color: '#D8D8F8' }}>{entry.description}</p>}
        {entry.highlights.length > 0 && (
          <ul className="space-y-1 mt-2" aria-label="Key achievements">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: '#D8D8F8' }}>
                <span style={{ color: MARIO_COLORS.coinGold }} aria-hidden="true">*</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

// Divider with Mario elements
export function MarioDivider() {
  return (
    <div className="flex justify-center items-center py-6 gap-3" aria-hidden="true">
      <Coin size={20} />
      <BrickBlock size={32} />
      <QuestionBlock size={36} />
      <Coin size={20} />
      <Coin size={20} />
      <QuestionBlock size={36} />
      <BrickBlock size={32} />
      <Coin size={20} />
    </div>
  )
}
