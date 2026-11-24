'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { ImpactLabel } from '@/components/cv/ImpactLabel'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { projectCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import type { Project } from '@/lib/cv/content'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { BLOOD_POINTS, IRON_TAGS } from './stage'
import u from './underworld.module.css'

// The projects as the sagas of his deeds: each one a card on an iron rimmed board over the magma, its name,
// role and years, line, details, impact, tools and links. Spartan Rage plays on the section's stage behind
// them (scenes.tsx).

function SagaCard({ slot }: { slot: ProjectSlot }) {
  const labels = useLabels()
  const { cards } = labels
  const { links } = slot
  const project = projectCard(slot.project, labels)

  return (
    <article className="relative">
      <div className={`p-5 ${u.panel}`}>
        <h3 className={`text-lg leading-tight text-[var(--myth-frost)] ${u.display}`}>
          <SlashBreaks text={project.name} />
        </h3>
        <p className="mt-1 text-sm text-[var(--myth-bone-shade)]">
          {project.role}
          {project.years && ` · ${project.years}`}
        </p>
        {project.tagline && <p className="mt-2 text-base italic text-[var(--myth-frost-core)]">{project.tagline}</p>}
        {project.description && <p className="mt-2 text-base leading-relaxed">{project.description}</p>}
        <MarkedLines items={project.details} label={cards.details} look={BLOOD_POINTS} />
        {project.impact && (
          <p className="mt-3 border-l-4 border-[var(--myth-frost)] pl-3 text-base">
            <ImpactLabel />
            {project.impact}
          </p>
        )}
        <TagList items={project.techStack} label={cards.technologiesUsed} look={IRON_TAGS} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <a key={link.kind} {...link.linkProps} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-base text-[var(--myth-frost-core)] underline decoration-2 underline-offset-4">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}

export function Sagas({ projects }: { projects: Project[] }) {
  return (
    <div data-stage-items="">
      <ProjectList projects={projects} className={MASONRY_LIST} itemClassName={MASONRY_ITEM} renderProject={(slot) => <SagaCard slot={slot} />} />
    </div>
  )
}
