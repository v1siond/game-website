'use client'

import type { CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { CVData } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { Board } from './levelSign'
import look from './jungle.module.css'

// The two short sections, read on boards with a simple fade (the section's own level sign does the
// arrival): the tech stack as a masonry of boards, one per category with its wooden tags, so categories
// of different lengths pack without gaps (each board carries its place as --i, for the ground slap's
// jolt in slap.tsx); the ventures as plank cards that open
// the venture's site (also placed by --i, for the rhino's charge in rhino.tsx).

export function TechBoard({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category, index) => (
        <li key={category.id} className={MASONRY_ITEM} style={{ '--i': index } as CSSProperties}>
          <Board>
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
          </Board>
        </li>
      ))}
    </ul>
  )
}

export function VentureBoard({ companies }: { companies: CVData['companies'] }) {
  const { links } = useLabels()

  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {companies.map((company, index) => (
        <li key={company.id} style={{ '--i': index } as CSSProperties}>
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
              <span className="min-w-0">
                <span className={`block text-lg ${look.display}`}>
                  <SlashBreaks text={company.name} />
                </span>
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
