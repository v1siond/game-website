'use client'

import type { CSSProperties } from 'react'
import type { CVData } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useScrollScene } from '@/hooks/useScrollScene'
import { HeroCharacter } from './character'
import shade from './shade.module.css'
import world from './world.module.css'

// The tech stack as crates afloat in a flooded hold, the boxes a silhouette puzzle platformer floats in
// its rising water to stand on: each category is a braced wooden crate riding its own ripple, the
// crates bobbing out of step with each other, laid in the shared masonry columns (one on a phone, two
// on a tablet, three on a wide screen). Under them runs the waterline, where he leans his whole weight
// into one more crate and shoves it across the hold as the visitor scrolls, the puzzle every flooded
// room asks of him; when the hold has scrolled by he stands beside it at the far side. The bob stops
// under reduced motion, and reduced motion and the World Select preview start him at the far side.
//
// Animated: one bob per category, him and the crate he pushes (moved by --scene-progress), his parts.

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

// The waterline under the crates: him and his crate ride a track one push wide short of the line, so
// moving the track by its own width brings them to the far end.
function Waterline() {
  const { ref, phase } = useScrollScene<HTMLDivElement>({ start: 0.9, end: 0.2 })

  return (
    <div ref={ref} className="relative mt-6 h-20" aria-hidden="true">
      <div className={`absolute inset-x-0 bottom-0 h-4 ${world.ripple}`} />
      <div className={`absolute bottom-3 left-0 right-28 flex items-end ${shade.pushAlong}`}>
        <HeroCharacter profession="engineer" pose={phase === 'done' ? 'idle' : 'push'} className="block h-16 w-10" />
        <div className={`relative -ml-1 h-12 w-14 border-4 border-[color:var(--sh-black)] ${world.crate}`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" focusable="false">
            <path d={BRACE} stroke="var(--sh-edge)" strokeWidth={6} vectorEffect="non-scaling-stroke" fill="none" opacity={0.6} />
          </svg>
        </div>
      </div>
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
      <Waterline />
    </div>
  )
}
