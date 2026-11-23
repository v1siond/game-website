import { useLabels } from '@/components/cv/CVDataProvider'
import type { BandSlot } from '@/components/cv/BandList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import type { ProjectSlot } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import type { CVData, Job, Service, TechCategory } from '@/lib/cv/content'
import { jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { fillLabel } from '@/lib/cv/labels'
import { newTabHint } from '@/lib/cv/sectionText'
import { Starburst } from './ink'
import { rarityOf } from './loot'
import { CEL } from './palette'
import cel from './cel.module.css'

// The cards each section lists, printed the way the inked desert prints everything: paper under a thick
// ink border and a hard drop. A job is a bounty notice pinned to the board, a tool group a branch of the
// skill tree, a project a loot card banded in its rarity's colour, a venture a maker's plate, a band a
// boss card. Nothing moves on its own; a card that is a link answers the pointer.

/** Lines marked with the orange diamond: a job's highlights, a project's details, the About highlights. */
export const ORANGE_POINTS: MarkedLinesLook = {
  heading: `mt-4 text-base ${cel.display} [-webkit-text-stroke:0]`,
  list: 'mt-2 space-y-1.5',
  line: 'flex gap-2 text-base',
  marker: <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[var(--cel-orange)]" aria-hidden="true" />,
}

/** A card's inked tags: a job's skills and a venture's services on white, a project's tools on sun. */
const INKED_TAGS: TagListLook = {
  list: 'mt-3 flex flex-wrap gap-1.5',
  tag: 'border-2 border-[var(--cel-ink)] bg-[var(--cel-white)] px-2 py-0.5 text-sm font-bold',
}

const SUN_TAGS: TagListLook = { ...INKED_TAGS, tag: 'border-2 border-[var(--cel-ink)] bg-[var(--cel-sun)] px-2 py-0.5 text-sm font-bold' }

const heading = `leading-tight ${cel.display} [-webkit-text-stroke:0]`

/** A job as a bounty notice: a running job carries the red Active stamp, a past one Completed. */
export function Notice({ job }: { job: Job }) {
  const { years, cards, navigation, hud } = useLabels()
  const card = jobCard(job, years)
  return (
    <article className={`relative p-5 ${cel.notice}`}>
      <span className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-[var(--cel-ink)] bg-[var(--cel-red)]" aria-hidden="true" />
      <p className={`float-right ml-3 px-2 py-0.5 text-sm ${cel.display} ${cel.stamp} [-webkit-text-stroke:0]`}>{job.current ? navigation.active : hud.completed}</p>
      <h3 className={`text-2xl ${heading}`}>
        <SlashBreaks text={card.company} />
      </h3>
      <p className="mt-1 text-base font-bold">{card.title}</p>
      <p className="text-sm font-bold text-[var(--cel-plank-shade)]">
        {card.years}
        {card.location && ` · ${card.location}`}
      </p>
      <p className="mt-3 text-base leading-relaxed">{card.description}</p>
      <MarkedLines items={card.highlights} label={cards.keyAchievements} look={ORANGE_POINTS} />
      <TagList items={card.skills} label={cards.skillsUsed} look={{ ...INKED_TAGS, list: 'mt-4 flex flex-wrap gap-2' }} />
    </article>
  )
}

/** A tool group as a branch of the skill tree: the group on top as its skill, its tools under it. */
export function Branch({ category }: { category: TechCategory }) {
  const { cards } = useLabels()
  return (
    <div className={`p-5 ${cel.darkPaper}`}>
      <h3 className={`w-fit px-4 py-2 text-xl ${cel.display} ${cel.skill}`}>{category.name}</h3>
      <TagList items={category.items} label={fillLabel(cards.categoryTechnologies, { name: category.name })} look={{ list: 'mt-4 flex flex-wrap gap-2', tag: `px-3 py-1.5 text-base font-bold ${cel.skill}` }} />
    </div>
  )
}

/** A service printed on its paper. */
export function ServicePaper({ service }: { service: Service }) {
  return (
    <div className={`p-5 sm:p-6 ${cel.paper}`}>
      <h3 className="text-lg font-bold">{service.title}</h3>
      <p className="mt-2 text-base leading-relaxed">{service.line}</p>
    </div>
  )
}

/** A project as a loot card, banded in its rarity's colour: name, role and years, its lines, details,
 *  the impact as the red flavour line, its tools and its links. */
export function LootCard({ slot }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const { links, noLink } = slot
  const project = projectCard(slot.project, labels)
  return (
    <article data-rarity={rarityOf(slot.project)} className={cel.lootCard}>
      <div className={`h-4 ${cel.rarityBand}`} aria-hidden="true" />
      <div className="p-4">
        <h3 className={`text-2xl ${heading}`}>
          <SlashBreaks text={project.name} />
        </h3>
        <p className="mt-1 text-sm font-bold">
          {project.role}
          {project.years && ` · ${project.years}`}
        </p>
        {project.tagline && <p className="mt-2 text-base font-bold">{project.tagline}</p>}
        {project.description && <p className="mt-2 text-base leading-relaxed">{project.description}</p>}
        <MarkedLines items={project.details} label={labels.cards.details} look={ORANGE_POINTS} />
        {project.impact && (
          <p className={`mt-3 text-base font-bold italic ${cel.flavour}`}>
            <ImpactLabel />
            {project.impact}
          </p>
        )}
        <TagList items={project.techStack} label={labels.cards.technologiesUsed} look={SUN_TAGS} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <a key={link.kind} {...link.linkProps} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-base font-bold underline decoration-[3px] underline-offset-4">
              {link.label}
            </a>
          ))}
          {noLink && <p className="text-sm font-bold">{noLink}</p>}
        </div>
      </div>
    </article>
  )
}

type Company = CVData['companies'][number]

const PLATE_TONES = [CEL.orange, CEL.sun, CEL.holo]

function PlateFace({ company, tone }: { company: Company; tone: string }) {
  const { cards, sections } = useLabels()
  const venture = ventureCard(company)
  return (
    <div className={`relative h-full p-5 ${cel.paper} ${cel.press}`}>
      <span className="absolute left-2 top-2 h-3 w-3 rounded-full border-2 border-[var(--cel-ink)] bg-[var(--cel-steel)]" aria-hidden="true" />
      <span className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-[var(--cel-ink)] bg-[var(--cel-steel)]" aria-hidden="true" />
      <div className="relative mb-3 h-16 w-16" aria-hidden="true">
        <div className={`absolute -inset-4 ${cel.splat}`}>
          <Starburst fill={tone} />
        </div>
        <svg viewBox="0 0 64 64" className={`relative h-full w-full ${cel.inked}`}>
          <path d="M8 14 L32 4 L56 14 L56 40 L32 60 L8 40 Z" fill={tone} />
          <path d="M32 4 L56 14 L56 40 L32 60 Z" fill={CEL.ink} opacity={0.25} data-bare />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-2xl ${cel.display} [-webkit-text-stroke:0]`}>{venture.name.charAt(0)}</span>
      </div>
      {venture.featured && (
        <p className="mb-2 inline-block -skew-x-6 border-2 border-[var(--cel-ink)] bg-[var(--cel-ink)] px-2 py-0.5 text-sm font-bold uppercase tracking-wider text-[var(--cel-white)]">{cards.ownProduct}</p>
      )}
      <h3 className={`${venture.featured ? 'text-3xl' : 'text-2xl'} ${heading}`}>
        <SlashBreaks text={venture.name} />
      </h3>
      {venture.tagline && <p className={`mt-1 text-base font-bold italic ${cel.flavour}`}>{venture.tagline}</p>}
      <p className="mt-2 text-base leading-relaxed">{venture.description}</p>
      <TagList items={venture.services} label={sections.services} look={INKED_TAGS} />
    </div>
  )
}

/** A venture as a maker's plate stamped with its mark, the link to its site when it has one. */
export function MakersPlate({ company, index }: { company: Company; index: number }) {
  const { links } = useLabels()
  const tone = PLATE_TONES[index % PLATE_TONES.length]
  if (!company.url)
    return (
      <div className={`h-full ${cel.plate}`}>
        <PlateFace company={company} tone={tone} />
      </div>
    )
  return (
    <a href={company.url} target="_blank" rel="noopener noreferrer" className={`block h-full ${cel.plate}`}>
      <PlateFace company={company} tone={tone} />
      <span className="sr-only"> {newTabHint(links)}</span>
    </a>
  )
}

/** A band as a boss card: its name slammed in sun letters, the role and years on paper under it. */
export function BossCard({ slot }: { slot: BandSlot }) {
  const { links } = useLabels()
  const { band, years, linkProps, nameFor, release } = slot
  return (
    <article className={`relative p-5 ${cel.darkPaper}`}>
      <h3 className={`text-3xl leading-none ${cel.display} ${cel.bossLetters}`}>{band.name}</h3>
      <p className="mt-3 inline-block -rotate-1 border-[3px] border-[var(--cel-ink)] bg-[var(--cel-paper)] px-3 py-1 text-base font-bold text-[var(--cel-ink)]">
        {band.role}
        {years && ` · ${years}`}
      </p>
      {release && (
        <p className="mt-3 text-sm font-bold text-[var(--cel-sun)]">
          {release.label}: {release.title}
        </p>
      )}
      {linkProps && (
        <p className="mt-3">
          <a {...linkProps} aria-label={nameFor(links.website)} className="inline-flex min-h-[44px] items-center bg-[var(--cel-paper)] px-2 text-base font-bold text-[var(--cel-ink)] underline decoration-[3px] underline-offset-4">
            {links.website}
          </a>
        </p>
      )}
    </article>
  )
}
