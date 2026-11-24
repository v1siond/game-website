'use client'

import { memo } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import type { TechCategory } from '@/lib/cv/content'
import u from './underworld.module.css'

// The Tech Stack as the pages of the codex: each group a parchment page with its name over its tools. His
// climb up the chain plays on the section's stage behind them (scenes.tsx), one reach per group.

type Category = TechCategory & { id: string }

// Memoised: the list re-renders with the section, and a page only draws again when its group changes.
const Page = memo(function Page({ category }: { category: Category }) {
  const { cards } = useLabels()

  return (
    <li className={`p-5 ${u.parchment}`}>
      <h3 className={`border-b-2 border-[var(--myth-iron)] pb-2 text-lg ${u.display}`}>{category.name}</h3>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
        {category.items.map((item) => (
          <li key={item} className="border border-[var(--myth-ink-soft)] px-2 py-0.5 text-base">
            {item}
          </li>
        ))}
      </ul>
    </li>
  )
})

export function Codex({ categories }: { categories: Category[] }) {
  const { cards } = useLabels()

  return (
    <ul className="grid gap-4 md:grid-cols-2" aria-label={cards.techByCategory} data-stage-items="">
      {categories.map((category) => (
        <Page key={category.id} category={category} />
      ))}
    </ul>
  )
}
