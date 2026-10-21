import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import type { TechCategory } from '@/lib/cv/content'
import u from './underworld.module.css'

// The Tech Stack as the codex of the house: one parchment page per category, its tools written down the
// page under a gilded rule. The pages only fade in, one after another, when the stage first shows (the
// tech stack is read, not played).

type Category = TechCategory & { id: string }

export function Codex({ categories }: { categories: Category[] }) {
  const { cards } = useLabels()

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label={cards.techByCategory}>
      {categories.map((category, index) => (
        <li key={category.id} className={`p-5 ${u.parchment} ${u.reveal}`} style={{ ['--i' as string]: index }}>
          <h3 className={`border-b-2 border-[var(--myth-gold-deep)] pb-2 text-lg ${u.display}`}>{category.name}</h3>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((item) => (
              <li key={item} className="border border-[var(--myth-ink-soft)] px-2 py-0.5 text-base">
                {item}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
