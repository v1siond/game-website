'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabHint } from '@/lib/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { CVData, Service } from '@/lib/cv/content'
import { ventureCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import type { MarkedLinesLook } from '@/components/cv/MarkedLines'
import { TagList, type TagListLook } from '@/components/cv/TagList'
import { cssVars } from '@/lib/cssVars'
import { Board } from './levelSign'
import look from './jungle.module.css'

// The two short sections, read on boards with a simple fade (the section's own level sign does the
// arrival): the tech stack as a masonry of boards, one per category with its wooden tags, so categories
// of different lengths pack without gaps (each board carries its place as --i, for the ground slap's
// jolt in slap.tsx); the ventures as plank cards that open
// the venture's site (also placed by --i, for the rhino's charge in rhino.tsx). The services read as a
// masonry of plain boards, a title and its line, under the shared fade. His own products (featured)
// are the two wide planks of the first row, a bark tag in sun gold over the name; the other ventures
// follow three to a row. A plank's link is named by the words it shows (the description and services
// included) plus the new tab note a screen reader alone hears.

/** Lines read on a dark board, each after a sun gold dot: a job's highlights, a project's details, the
 *  About highlights. */
export const SUN_POINTS: MarkedLinesLook = {
  list: 'mt-4 space-y-2',
  line: 'flex items-start gap-2 text-sm text-[color:var(--tp-parchment)]',
  marker: (
    <svg viewBox="0 0 10 10" className="mt-1 h-3 w-3 flex-shrink-0" aria-hidden="true" focusable="false">
      <circle cx="5" cy="5" r="4" fill="var(--tp-sun-gold)" />
    </svg>
  ),
}

/** A card's tags on the wood: a job's skills, a project's technologies, a venture's services. */
export const WOOD_TAGS: TagListLook = {
  list: 'mt-4 flex flex-wrap gap-2',
  tag: `rounded-lg px-2 py-1 text-sm ${look.tag}`,
}

// `itemClassName` is the class the section's motion gives each top level card (the ground slap's jolt, the
// rhino's ram), so the motion's module never reaches into this markup.
interface BoardListProps {
  itemClassName?: string
}

export function TechBoard({ categories, itemClassName = '' }: BoardListProps & { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category, index) => (
        <li key={category.id} className={`${MASONRY_ITEM} ${itemClassName}`} style={cssVars({ '--i': index })}>
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

export function VentureBoard({ companies, itemClassName = '' }: BoardListProps & { companies: CVData['companies'] }) {
  const { links, cards, sections } = useLabels()

  return (
    <ul className="grid gap-5 md:grid-cols-6">
      {companies.map(ventureCard).map((company, index) => (
        <li key={company.id} className={`${company.featured ? 'md:col-span-3' : 'md:col-span-2'} ${itemClassName}`} style={cssVars({ '--i': index })}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block h-full rounded-2xl p-5 text-[color:var(--tp-bark-dark)] ${look.plank} ${look.plankText} ${look.button} ${look.focus}`}
          >
            {company.featured && (
              <span className={`mb-3 inline-block rounded-lg bg-[color:var(--tp-bark-dark)] px-3 py-0.5 text-sm uppercase text-[color:var(--tp-sun-gold)] ${look.display}`}>
                {cards.ownProduct}
              </span>
            )}
            <span className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {company.icon}
              </span>
              <span className="min-w-0">
                <span className={`block ${company.featured ? 'text-xl' : 'text-lg'} ${look.display}`}>
                  <SlashBreaks text={company.name} />
                </span>
                <span className="block text-sm">{company.tagline}</span>
              </span>
            </span>
            <span className="mt-3 block text-sm leading-relaxed">{company.description}</span>
            <TagList items={company.services} label={sections.services} look={{ ...WOOD_TAGS, list: 'mt-3 flex flex-wrap gap-2' }} />
            <span className="sr-only"> {newTabHint(links)}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function ServiceBoard({ services }: { services: Service[] }) {
  return (
    <ul className={MASONRY_LIST}>
      {services.map((service) => (
        <li key={service.id} className={MASONRY_ITEM}>
          <Board>
            <h3 className={`mb-3 text-base uppercase text-[color:var(--tp-sun-gold)] ${look.display}`}>{service.title}</h3>
            <p className="text-base leading-relaxed text-[color:var(--tp-parchment)]">{service.line}</p>
          </Board>
        </li>
      ))}
    </ul>
  )
}
