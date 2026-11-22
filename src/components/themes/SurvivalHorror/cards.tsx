import type { CVData, Service } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import type { MarkedLinesLook } from '@/components/cv/MarkedLines'
import look from './world.module.css'

// The small marks the house's papers share: the brass bullet of a typed list, the rust date stamp, and the
// Tech Stack as the labels pinned on the desk, one group per category, and the Services as typed notes.

export const STAMP = `whitespace-nowrap border border-[color:var(--sh-rust)] px-2 py-1 text-sm text-[color:var(--sh-flame-text)] ${look.typed}`

export function Mark() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[color:var(--sh-brass)]" aria-hidden="true" />
}

/** A typed list, each line behind the brass bullet. */
export const MARK_LIST: MarkedLinesLook = {
  list: 'mt-3 space-y-1',
  line: 'flex items-start gap-2 text-sm text-[color:var(--sh-cream)]',
  marker: <Mark />,
}

/** The tags pinned on a paper: a job's skills, a project's tools. */
export function PinnedTags({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="border border-[color:var(--sh-felt-line)] px-2 py-0.5 text-sm text-[color:var(--sh-cream)]">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <li key={category.id} className={MASONRY_ITEM}>
          <h3 className={`mb-3 text-sm uppercase text-[color:var(--sh-brass-text)] ${look.typed}`}>{category.name}</h3>
          <ul className="flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li key={tech} className="border border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)] px-2 py-1 text-sm text-[color:var(--sh-cream)]">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export function ServiceNotes({ services }: { services: Service[] }) {
  return (
    <ul className={MASONRY_LIST}>
      {services.map((service) => (
        <li key={service.id} className={`${MASONRY_ITEM} border border-[color:var(--sh-wood)] bg-[color:var(--sh-shadow)] p-4`}>
          <h3 className="flex gap-3 text-base font-bold text-[color:var(--sh-cream)]">
            <Mark />
            {service.title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-[color:var(--sh-cream)]">{service.line}</p>
        </li>
      ))}
    </ul>
  )
}
