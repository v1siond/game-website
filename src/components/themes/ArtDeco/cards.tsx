import type { CVData, Service } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import look from './world.module.css'

// The tech stack's tag cloud, the one list read rather than played (it sits in the glass tunnel), and the
// services as gold framed cards, a title and its line each, read under the shared fade.

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

export function ServiceCards({ services }: { services: Service[] }) {
  return (
    <ul className={MASONRY_LIST}>
      {services.map((service) => (
        <li key={service.id} className={`${MASONRY_ITEM} border border-[color:var(--deco-gold)]/45 bg-[color:var(--deco-gold)]/10 p-5`}>
          <h3 className={`mb-2 text-sm uppercase tracking-[0.2em] ${look.neon}`}>{service.title}</h3>
          <p className="text-base leading-relaxed text-[color:var(--deco-cream)]">{service.line}</p>
        </li>
      ))}
    </ul>
  )
}
