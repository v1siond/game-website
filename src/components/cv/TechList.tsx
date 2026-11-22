import type { CSSProperties, ReactNode } from 'react'
import type { CVData } from '@/lib/cv/content'
import { fillLabel } from '@/lib/cv/labels'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { useLabels } from './CVDataProvider'

// The tech stack as a list without a look: one masonry item per category, its heading with the icon and
// the name, then its technologies, each list named from the labels. A world passes its classes and draws
// each technology's content with `renderItem`, and may time each category with `categoryStyle`.

interface TechListProps {
  categories: CVData['techStack']
  headingClassName: string
  iconClassName?: string
  itemsClassName: string
  itemClassName: string
  renderItem: (tech: string) => ReactNode
  /** A category item's own style by its place, for a world that times each category (CSS variables only). */
  categoryStyle?: (index: number) => CSSProperties
}

export function TechList({ categories, headingClassName, iconClassName, itemsClassName, itemClassName, renderItem, categoryStyle }: TechListProps) {
  const { cards } = useLabels()

  return (
    <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
      {categories.map((category, index) => (
        <li key={category.id} className={MASONRY_ITEM} style={categoryStyle?.(index)}>
          <h3 className={headingClassName}>
            <span className={iconClassName} aria-hidden="true">
              {category.icon}
            </span>
            {category.name}
          </h3>
          <ul className={itemsClassName} aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((tech) => (
              <li key={tech} className={itemClassName}>
                {renderItem(tech)}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
