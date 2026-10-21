import type { CSSProperties } from 'react'
import type { CVData } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import shade from './shade.module.css'
import world from './world.module.css'

// The tech stack as crates afloat in a flooded hold, the boxes a silhouette puzzle platformer floats in
// its rising water to stand on: each category is a braced wooden crate riding its own ripple, the
// crates bobbing out of step with each other, laid in the shared masonry columns (one on a phone, two
// on a tablet, three on a wide screen). The bob stops under reduced motion.
//
// Animated: one bob per category.

const BRACE = 'M0 0 L100 100 M100 0 L0 100'

function Crate({ category, index }: { category: CVData['techStack'][number]; index: number }) {
  return (
    <div className={shade.bob} style={{ '--i': index } as CSSProperties}>
      <div className={`relative border-4 border-[color:var(--sh-black)] p-4 ${world.crate}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
          <path d={BRACE} stroke="var(--sh-edge)" strokeWidth={6} vectorEffect="non-scaling-stroke" fill="none" opacity={0.6} />
        </svg>
        <div className="relative bg-[color:var(--sh-panel)] p-3">
          <h3 className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-[color:var(--sh-heading)]">
            <span className="grayscale" aria-hidden="true">
              {category.icon}
            </span>
            {category.name}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <li key={tech} className="border border-[color:var(--sh-fog)] px-2 py-1 text-sm uppercase tracking-wider text-[color:var(--sh-muted)]">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`mx-[-0.5rem] h-3 ${world.ripple}`} aria-hidden="true" />
    </div>
  )
}

export function FloatingCrates({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  return (
    <div className={`relative px-4 pb-4 pt-6 sm:px-6 ${world.hold}`}>
      <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
        {categories.map((category, index) => (
          <li key={category.id} className={MASONRY_ITEM}>
            <Crate category={category} index={index} />
          </li>
        ))}
      </ul>
    </div>
  )
}
