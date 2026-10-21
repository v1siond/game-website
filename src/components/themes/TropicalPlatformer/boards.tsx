'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { CVData } from '@/lib/cv/content'
import look from './jungle.module.css'

// The two short sections, read on plain boards with a simple fade (the section's own level sign does
// the arrival): the tech stack as wooden tags per category, the ventures as plank cards that open the
// venture's site.

export function TechBoard({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <div className="grid gap-6 md:grid-cols-2" aria-label={cards.techByCategory} role="group">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className={`mb-3 flex items-center gap-2 text-base uppercase text-[color:var(--tp-sun-gold)] ${look.display}`}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li key={tech} className={`rounded-lg px-3 py-1 text-sm ${look.tag}`}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function VentureBoard({ companies }: { companies: CVData['companies'] }) {
  const { links } = useLabels()

  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {companies.map((company) => (
        <li key={company.id}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
            className={`block h-full rounded-2xl p-5 text-[color:var(--tp-bark-dark)] ${look.plank} ${look.button} ${look.focus}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {company.icon}
              </span>
              <span>
                <span className={`block text-lg ${look.display}`}>{company.name}</span>
                <span className="block text-sm">{company.tagline}</span>
              </span>
            </span>
            <span className="mt-3 block text-sm leading-relaxed">{company.description}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
