import Link from 'next/link'
import type { CVData } from '@/lib/cv/content'
import { UntilHydrated } from './UntilHydrated'

// The worlds draw on the client only, so the server HTML of / would hold no CV text. This block carries
// the CV as plain text for crawlers and readers without JavaScript, visually hidden, and leaves the page
// once the world has taken over (its own h1 and text), so the page never holds two h1s or reads twice.
export function CVTextForCrawlers({ cv }: Readonly<{ cv: CVData }>) {
  const { fullName, professionalSummary, workExperience, featuredProjects, techStack, contact, labels } = cv
  const { sections, actions } = labels

  return (
    <UntilHydrated>
      <main className="sr-only">
        <h1>{fullName}</h1>
        <p>{professionalSummary.headline}</p>
        <p>{professionalSummary.tagline}</p>
        <Link href="/cv">{actions.cv}</Link>

        <h2>{sections.about}</h2>
        <p>{professionalSummary.bio}</p>

        <h2>{sections.workExperience}</h2>
        <ul>
          {workExperience.map((job) => (
            <li key={job.id}>
              {job.title}, {job.company}
            </li>
          ))}
        </ul>

        <h2>{sections.projects}</h2>
        <ul>
          {featuredProjects.map((project) => (
            <li key={project.id}>
              {project.name}: {project.tagline}
            </li>
          ))}
        </ul>

        <h2>{sections.techStack}</h2>
        <ul>
          {techStack.map((category) => (
            <li key={category.id}>
              {category.name}: {category.items.join(', ')}
            </li>
          ))}
        </ul>

        <h2>{sections.contact}</h2>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <a href={contact.linkedin}>{actions.linkedin}</a>
      </main>
    </UntilHydrated>
  )
}
