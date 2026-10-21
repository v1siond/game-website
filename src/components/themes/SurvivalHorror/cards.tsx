import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import look from './world.module.css'

// The small marks the house's papers share: the brass bullet of a typed list, the rust date stamp, and the
// Tech Stack as the labels pinned on the desk, one group per category.

export const STAMP = `whitespace-nowrap border border-[color:var(--sh-rust)] px-2 py-1 text-sm text-[color:var(--sh-flame)] ${look.typed}`

export function Mark() {
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[color:var(--sh-brass)]" aria-hidden="true" />
}

export function TechCloud({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category) => (
        <li key={category.id} className={MASONRY_ITEM}>
          <h3 className={`mb-3 text-sm uppercase text-[color:var(--sh-brass)] ${look.typed}`}>{category.name}</h3>
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
