import type { ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import look from './world.module.css'

// The brass card a venture sits on, and the tech stack's tag cloud: the two short sections that are
// read, not played (the long lists have their own machines next to this file).

// The card: still caustic light, the deco top rule with its corner brackets, and a gleam on hover.
function BrassCard({ children }: { children: ReactNode }) {
  return (
    <article className={`group relative h-full overflow-hidden border border-[color:var(--deco-gold)]/40 p-5 ${look.card}`}>
      <div className={`pointer-events-none absolute inset-0 opacity-[0.12] ${look.cardLight}`} aria-hidden="true" />

      <div className="absolute left-0 right-0 top-0 flex items-center" aria-hidden="true">
        <div className="h-4 w-4 border-l-2 border-t-2 border-[color:var(--deco-gold)]" />
        <div className="h-px flex-1 bg-[color:var(--deco-gold)] opacity-60" />
        <div className="h-4 w-4 border-r-2 border-t-2 border-[color:var(--deco-gold)]" />
      </div>

      <div className="relative z-10 pt-3">{children}</div>

      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity ${look.cardGleam}`}
        aria-hidden="true"
      />
    </article>
  )
}

export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <li key={category.id} className={MASONRY_ITEM}>
          <h3 className={`mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.2em] ${look.neon}`}>
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li key={tech} className="border border-[color:var(--deco-gold)]/45 bg-[color:var(--deco-gold)]/10 px-3 py-1.5 text-sm text-[color:var(--deco-cream)]">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export function CompanyCard({ company }: { company: CVData['companies'][number] }) {
  const { links } = useLabels()
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
      className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--deco-gold-bright)]"
    >
      <BrassCard>
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {company.icon}
          </span>
          <div className="min-w-0">
            <h3 className={`text-base ${look.cardTitle}`}>
              <SlashBreaks text={company.name} />
            </h3>
            <p className="text-sm text-[color:var(--deco-mist)]">{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm text-[color:var(--deco-cream)]">{company.description}</p>
      </BrassCard>
    </a>
  )
}
