import type { ReactNode } from 'react'
import type { Project } from '@/lib/cv/content'
import { fillLabel, type Labels } from '@/lib/cv/labels'
import { useLabels } from './CVDataProvider'
import { newTabName, projectLinks, yearSpan, type ProjectLink } from './sectionText'

// The projects of a world (R4) as a list without a look: one item per project in the order viewFor
// gives, each with its year span and its links ready to spread on an anchor (new tab, a name that says
// which project it opens). The world draws each card through `renderProject`.

export interface ProjectLinkSlot extends ProjectLink {
  linkProps: { href: string; target: '_blank'; rel: string; 'aria-label': string }
}

export interface ProjectSlot {
  project: Project
  years: string
  links: ProjectLinkSlot[]
}

interface ProjectListProps {
  projects: Project[]
  renderProject: (slot: ProjectSlot) => ReactNode
  className?: string
  itemClassName?: string
}

const slotFor = (project: Project, labels: Labels): ProjectSlot => ({
  project,
  years: yearSpan(project, labels.years),
  links: projectLinks(project, labels.links).map((link) => ({
    ...link,
    linkProps: {
      href: link.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': newTabName(labels.links, fillLabel(labels.links.linkOf, { link: link.label, project: project.name })),
    },
  })),
})

export function ProjectList({ projects, renderProject, className, itemClassName }: ProjectListProps) {
  const labels = useLabels()
  return (
    <ul className={className}>
      {projects.map((project) => (
        <li key={project.id} className={itemClassName}>
          {renderProject(slotFor(project, labels))}
        </li>
      ))}
    </ul>
  )
}
