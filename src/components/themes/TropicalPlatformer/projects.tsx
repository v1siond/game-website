'use client'

import { memo } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import type { Project } from '@/lib/cv/content'
import { CartLine, RideButton, STATION } from './mineCart'
import look from './jungle.module.css'

// The projects as a mine cart ride through the cave: one station per project on the rails over the
// list, him in the cart. Each project is a board with a ride button; the cart rolls to it, hopping the
// broken rail between, and the board lifts as the stop (mineCart.tsx).

interface StationProps {
  slot: ProjectSlot
  index: number
  here: boolean
  onRide: (index: number) => void
}

// The slot and the ride are the same on every render, so a ride re-renders only the two stations whose
// `here` flips.
const ProjectStation = memo(function ProjectStation({ slot, index, here, onRide }: StationProps) {
  const labels = useLabels()
  const { project, years, links, noLink } = slot

  return (
    <article data-here={here || undefined} className={`rounded-3xl p-5 ${look.board} ${STATION}`}>
      <h3 className={`text-lg leading-snug text-[color:var(--tp-sun-gold)] ${look.display}`}>
        <SlashBreaks text={project.name} />
      </h3>
      {project.role && <p className="mt-1 text-sm font-bold text-[color:var(--tp-plank-light)]">{project.role}</p>}
      {years && <p className="mt-1 text-sm text-[color:var(--tp-plank-light)]">{years}</p>}
      {project.tagline && <p className="mt-3 text-base leading-relaxed text-[color:var(--tp-parchment)]">{project.tagline}</p>}
      {project.impact && (
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--tp-parchment)]">
          <span className="font-bold text-[color:var(--tp-sun-gold)]">{labels.cards.impact}: </span>
          {project.impact}
        </p>
      )}
      {project.techStack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={labels.cards.technologiesUsed}>
          {project.techStack.map((tech) => (
            <li key={tech} className={`rounded-lg px-2 py-1 text-sm ${look.tag}`}>
              {tech}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map(({ kind, label, linkProps }) => (
          <a key={kind} {...linkProps} className={`inline-flex min-h-[44px] items-center rounded-xl px-4 text-sm ${look.button} ${look.buttonWood} ${look.focus}`}>
            {label}
          </a>
        ))}
        {noLink && <p className="text-sm italic text-[color:var(--tp-plank-light)]">{noLink}</p>}
      </div>
      <RideButton name={project.name} here={here} onRide={() => onRide(index)} />
    </article>
  )
})

/** The projects as stations on the mine cart line. */
export function CartProjects({ projects }: { projects: Project[] }) {
  return (
    <CartLine stops={projects.map((project) => project.name)} profession="engineer">
      {({ stop, rideTo }) => (
        <ProjectList
          projects={projects}
          className={MASONRY_LIST}
          itemClassName={MASONRY_ITEM}
          renderProject={(slot, index) => <ProjectStation slot={slot} index={index} here={index === stop} onRide={rideTo} />}
        />
      )}
    </CartLine>
  )
}
