'use client'

import { useCallback, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { projectLinks } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import type { Project } from '@/lib/cv/content'
import { BOONS_PER_WAVE, rarityOf, waveOf, type Rarity } from './fates'
import { SlabButton } from './buttons'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The projects as boons: a god's orb hangs over the list and the boons come out of it three at a time,
// the way a god offers three, each card framed in its rarity's colour with the rarity's word on it and
// the project's sigil. Pointing at or focusing a card flares its sigil; Choose sends the sigil up to the
// tray of chosen boons over the list, which counts them in words too. The rarity rule is in fates.ts.

const RARITY_WORD: Record<Rarity, (labels: Labels) => string> = {
  common: (labels) => labels.hud.rarityCommon,
  rare: (labels) => labels.hud.rarityRare,
  epic: (labels) => labels.hud.rarityEpic,
  heroic: (labels) => labels.myth.rarityHeroic,
}

const RARITY_COLOUR: Record<Rarity, string> = {
  common: MYTH.common,
  rare: MYTH.rare,
  epic: MYTH.epic,
  heroic: MYTH.heroic,
}

// The sigil's mark by rarity: a disc, a star, a flame, a crowned laurel.
const SIGIL_MARK: Record<Rarity, string> = {
  common: 'M20 8 A12 12 0 1 1 19.9 8 Z',
  rare: 'M20 4 L24 15 L36 15 L26 22 L30 34 L20 27 L10 34 L14 22 L4 15 L16 15 Z',
  epic: 'M20 4 Q32 16 28 28 Q26 36 20 36 Q14 36 12 28 Q8 16 20 4 Z',
  heroic: 'M6 30 L10 10 L16 20 L20 6 L24 20 L30 10 L34 30 Z',
}

function Sigil({ rarity, className = '' }: { rarity: Rarity; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx={20} cy={20} r={18} fill={MYTH.ink} stroke={RARITY_COLOUR[rarity]} strokeWidth={2.5} />
      <path d={SIGIL_MARK[rarity]} fill={RARITY_COLOUR[rarity]} stroke={MYTH.inkLine} strokeWidth={1.5} transform="translate(20 20) scale(0.62) translate(-20 -20)" />
    </svg>
  )
}

interface BoonCardProps {
  slot: ProjectSlot
  index: number
  chosen: boolean
  onChoose: (id: string) => void
}

function BoonCard({ slot, index, chosen, onChoose }: BoonCardProps) {
  const labels = useLabels()
  const { cards, myth } = labels
  const { project, years, links } = slot
  const rarity = rarityOf(project, links.length)

  return (
    <article data-rarity={rarity} className={`relative ${u.boon}`} style={{ ['--w' as string]: waveOf(index), ['--k' as string]: index % BOONS_PER_WAVE }}>
      <div className={`p-5 ${u.boonFrame}`}>
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm ${u.display} ${u.rarityWord}`}>{RARITY_WORD[rarity](labels)}</p>
          <div className="relative h-14 w-14 shrink-0">
            <span className={`absolute -inset-2 rounded-full bg-[radial-gradient(circle,var(--rarity),transparent_70%)] ${u.sigilGlow}`} aria-hidden="true" />
            <Sigil rarity={rarity} className={`relative h-full w-full ${u.sigil}`} />
            {chosen && <Sigil rarity={rarity} className={`absolute inset-0 h-full w-full ${u.sigilFly}`} />}
          </div>
        </div>
        <h3 className={`mt-1 text-xl leading-tight text-[var(--myth-gold)] ${u.display}`}>
          <SlashBreaks text={project.name} />
        </h3>
        <p className="mt-1 text-sm text-[var(--myth-bone-shade)]">
          {project.role}
          {years && ` · ${years}`}
        </p>
        {project.tagline && <p className="mt-2 text-base italic text-[var(--myth-gold-pale)]">{project.tagline}</p>}
        <p className="mt-2 text-base leading-relaxed">{project.description}</p>
        {project.impact && (
          <p className="mt-3 border-l-4 border-[var(--rarity)] pl-3 text-base">
            <span className="sr-only">{cards.impact}: </span>
            {project.impact}
          </p>
        )}
        {project.techStack.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={cards.technologiesUsed}>
            {project.techStack.map((tech) => (
              <li key={tech} className="border border-[var(--myth-gold-deep)] bg-[var(--myth-ink)] px-2 py-0.5 text-sm">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <SlabButton
            tone={chosen ? 'gold' : 'stone'}
            aria-pressed={chosen}
            aria-label={fillLabel(myth.chooseBoon, { name: project.name })}
            onClick={() => onChoose(project.id)}
          >
            {chosen ? myth.chosen : myth.choose}
          </SlabButton>
          {links.map((link) => (
            <a key={link.kind} {...link.linkProps} className="inline-flex min-h-[44px] items-center text-base text-[var(--myth-gold-pale)] underline decoration-2 underline-offset-4">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

function Tray({ chosen, projects }: { chosen: readonly Project[]; projects: Project[] }) {
  const { myth, links } = useLabels()
  // the same link count the card's rarity is read from
  const linkCount = (project: Project) => projectLinks(project, links).length

  return (
    <div className={`mb-6 flex flex-wrap items-center gap-4 px-4 py-3 ${u.panel}`}>
      <span className={`text-base text-[var(--myth-gold)] ${u.display}`}>{myth.boonTray}</span>
      <ul className="flex min-h-10 flex-1 flex-wrap gap-2" aria-label={myth.boonTray}>
        {chosen.map((project) => (
          <li key={project.id} className={u.trayLand} title={project.name}>
            <Sigil rarity={rarityOf(project, linkCount(project))} className="h-10 w-10" />
            <span className="sr-only">{project.name}</span>
          </li>
        ))}
      </ul>
      <span className="text-base" role="status">
        {fillLabel(myth.boonCount, { count: chosen.length, total: projects.length })}
      </span>
    </div>
  )
}

function GodOrb() {
  return (
    <div className="relative mx-auto mb-6 h-20 w-20" aria-hidden="true">
      <div className={`absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,var(--myth-gold-pale),var(--myth-gold)_35%,var(--myth-blood)_75%)] ${u.orb}`} />
      <div className="absolute inset-0 rounded-full border-2 border-[var(--myth-ink)]" />
    </div>
  )
}

export function Boons({ projects }: { projects: Project[] }) {
  const { myth } = useLabels()
  const [chosenIds, setChosenIds] = useState<readonly string[]>([])

  const toggle = useCallback((id: string) => {
    setChosenIds((current) => (current.includes(id) ? current.filter((each) => each !== id) : [...current, id]))
  }, [])

  const chosen = chosenIds.flatMap((id) => projects.filter((project) => project.id === id))

  return (
    <>
      <Tray chosen={chosen} projects={projects} />
      <p className={`mb-6 ${u.hint}`}>{myth.boonHint}</p>
      <GodOrb />
      <ProjectList
        projects={projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={(slot) => (
          <BoonCard slot={slot} index={projects.indexOf(slot.project)} chosen={chosenIds.includes(slot.project.id)} onChoose={toggle} />
        )}
      />
    </>
  )
}
