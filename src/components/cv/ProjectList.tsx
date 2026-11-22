import { useMemo, type ReactNode } from 'react'
import type { Project } from '@/lib/cv/content'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { useLabels } from './CVDataProvider'
import { newTabName, projectLinks, yearSpan, type ProjectLink } from '@/lib/cv/sectionText'

// The projects of a world (R4) as a list without a look: one item per project in the order viewFor
// gives, each with its year span and its links ready to spread on an anchor (new tab, a name that says
// which project it opens), and the "no public link" sentence when it has none. The world draws each card
// through `renderProject`.

export interface ProjectLinkSlot extends ProjectLink {
  linkProps: { href: string; target: '_blank'; rel: string; 'aria-label': string }
}

export interface ProjectSlot {
  project: Project
  years: string
  links: ProjectLinkSlot[]
  /** labels.links.noPublicLink when the project has no link, else null. */
  noLink: string | null
}

interface ProjectListProps {
  projects: Project[]
  /** `index` is the project's place in `projects`. */
  renderProject: (slot: ProjectSlot, index: number) => ReactNode
  className?: string
  itemClassName?: string
}

const linkSlot =
  (project: Project, labels: Labels) =>
  (link: ProjectLink): ProjectLinkSlot => ({
    ...link,
    linkProps: {
      href: link.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': newTabName(labels.links, fillLabel(labels.links.linkOf, { link: link.label, project: project.name })),
    },
  })

const slotFor = (project: Project, labels: Labels): ProjectSlot => {
  const links = projectLinks(project, labels.links)
  return {
    project,
    years: yearSpan(project, labels.years),
    links: links.map(linkSlot(project, labels)),
    noLink: links.length === 0 ? labels.links.noPublicLink : null,
  }
}

export function ProjectList({ projects, renderProject, className, itemClassName }: ProjectListProps) {
  const labels = useLabels()
  // One slot object per project for as long as the projects and labels stay, so a memo card fed a slot
  // skips the parent's unrelated renders.
  const slots = useMemo(() => projects.map((project) => slotFor(project, labels)), [projects, labels])
  return (
    <ul className={className}>
      {slots.map((slot, index) => (
        <li key={slot.project.id} className={itemClassName}>
          {renderProject(slot, index)}
        </li>
      ))}
    </ul>
  )
}
