'use client'

import { useMemo, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { projectLinks } from '@/lib/cv/sectionText'
import { projectCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import type { Project } from '@/lib/cv/content'
import { compareStat, rarityOf, statsOf, type Rarity, type Stat, type StatKey, type Trend } from './loot'
import { InkButton } from './buttons'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { INKED_TAGS, ORANGE_POINTS } from './stage'
import cel from './cel.module.css'

// The projects as loot on the dusk field: each one drops in with a column of its rarity's light
// standing over it, and its card is the looter's item card: the rarity word on its colour band, the
// name, the stats (technologies, details, public links), the impact as the red flavour line. Pointing
// at or focusing a card shows each stat against the equipped project's, up or down by how much, in a
// mark and in words; Equip swaps the equipped project. The rarity rules and the compare are in loot.ts.

const RARITY_LABEL: Record<Rarity, keyof Labels['hud']> = {
  common: 'rarityCommon',
  uncommon: 'rarityUncommon',
  rare: 'rarityRare',
  epic: 'rarityEpic',
  legendary: 'rarityLegendary',
}

const STAT_LABEL: Record<StatKey, (labels: Labels) => string> = {
  tech: (labels) => labels.cards.tech,
  details: (labels) => labels.cards.details,
  links: (labels) => labels.hud.statLinks,
}

const TREND_LABEL: Record<Trend, keyof Labels['hud']> = {
  up: 'compareUp',
  down: 'compareDown',
  same: 'compareSame',
}

const TREND_CLASS: Record<Trend, string> = { up: cel.up, down: cel.down, same: '' }

// The compare mark: a triangle up or down, a bar for the same.
const TREND_MARK: Record<Trend, string> = {
  up: 'M1 9 L6 2 L11 9 Z',
  down: 'M1 3 L6 10 L11 3 Z',
  same: 'M1 5 L11 5 L11 7 L1 7 Z',
}

const statsFor = (project: Project, labels: Labels) => statsOf(project, projectLinks(project, labels.links).length)

function StatRow({ stat, equipped, showCompare }: { stat: Stat; equipped: number; showCompare: boolean }) {
  const labels = useLabels()
  const { trend, diff } = compareStat(stat.value, equipped)

  return (
    <div className="flex items-baseline justify-between gap-3 border-b-2 border-dashed border-[var(--cel-ink)] py-1 last:border-b-0">
      <dt className="text-sm font-bold uppercase tracking-wider">{STAT_LABEL[stat.key](labels)}</dt>
      <dd className="flex items-center gap-2 text-base font-black">
        {stat.value}
        {showCompare && (
          <span className={`flex items-center gap-1 text-sm ${cel.compare} ${TREND_CLASS[trend]}`}>
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <path d={TREND_MARK[trend]} fill="currentColor" />
            </svg>
            <span aria-hidden="true">{trend === 'same' ? '' : diff}</span>
            <span className="sr-only">{fillLabel(labels.hud[TREND_LABEL[trend]], { count: diff })}</span>
          </span>
        )}
      </dd>
    </div>
  )
}

interface LootCardProps {
  slot: ProjectSlot
  index: number
  equippedId: string
  /** The equipped project's stats, worked out once for every card to compare against. */
  equippedStats: Stat[]
  onEquip: (id: string) => void
}

function LootCard({ slot, index, equippedId, equippedStats, onEquip }: LootCardProps) {
  const labels = useLabels()
  const { hud, cards } = labels
  const { links } = slot
  const rarity = rarityOf(slot.project)
  const project = projectCard(slot.project, labels)
  const isEquipped = project.id === equippedId

  return (
    <article data-rarity={rarity} className={`relative ${cel.loot}`} style={{ ['--i' as string]: index }}>
      <div className="relative mx-auto h-16 w-24" aria-hidden="true">
        <span className={`absolute inset-0 ${cel.beam}`} />
        <span className={`absolute inset-0 ${cel.beamGlow}`} />
      </div>
      <div className={cel.lootCard}>
        <p className={`flex items-center justify-between px-4 py-1.5 text-base ${cel.display} [-webkit-text-stroke:0] ${cel.rarityBand}`}>
          <span>{hud[RARITY_LABEL[rarity]]}</span>
          {isEquipped && <span>{hud.equipped}</span>}
        </p>
        <div className="p-4">
          <h3 className={`text-2xl leading-tight ${cel.display} [-webkit-text-stroke:0]`}>
            <SlashBreaks text={project.name} />
          </h3>
          <p className="mt-1 text-sm font-bold">
            {project.role}
            {project.years && ` · ${project.years}`}
          </p>
          {project.tagline && <p className="mt-2 text-base font-bold">{project.tagline}</p>}
          {project.description && <p className="mt-2 text-base leading-relaxed">{project.description}</p>}
          <MarkedLines items={project.details} label={cards.details} look={ORANGE_POINTS} />

          <dl className="mt-4 border-[3px] border-[var(--cel-ink)] bg-[var(--cel-white)] px-3 py-1">
            {statsFor(slot.project, labels).map((stat, statIndex) => (
              <StatRow key={stat.key} stat={stat} equipped={equippedStats[statIndex].value} showCompare={!isEquipped} />
            ))}
          </dl>

          {project.impact && (
            <p className={`mt-3 text-base font-bold italic ${cel.flavour}`}>
              <ImpactLabel />
              {project.impact}
            </p>
          )}

          <TagList
            items={project.techStack}
            label={cards.technologiesUsed}
            look={{ ...INKED_TAGS, tag: 'border-2 border-[var(--cel-ink)] bg-[var(--cel-sun)] px-2 py-0.5 text-sm font-bold' }}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <InkButton
              tone={isEquipped ? 'sun' : 'paper'}
              aria-pressed={isEquipped}
              aria-label={fillLabel(hud.equipItem, { name: project.name })}
              onClick={() => onEquip(project.id)}
            >
              {isEquipped ? hud.equipped : hud.equip}
            </InkButton>
            {links.map((link) => (
              <a key={link.kind} {...link.linkProps} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-base font-bold underline decoration-[3px] underline-offset-4">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export function LootDrops({ projects }: { projects: Project[] }) {
  const labels = useLabels()
  const [equippedId, setEquippedId] = useState(projects[0]?.id)
  const equipped = projects.find((project) => project.id === equippedId) ?? projects[0]
  const equippedStats = useMemo(() => statsFor(equipped, labels), [equipped, labels])

  return (
    <ProjectList
      projects={projects}
      className={MASONRY_LIST}
      itemClassName={MASONRY_ITEM}
      renderProject={(slot, index) => <LootCard slot={slot} index={index} equippedId={equipped.id} equippedStats={equippedStats} onEquip={setEquippedId} />}
    />
  )
}
