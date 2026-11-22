'use client'

import { memo, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import type { TechCategory } from '@/lib/cv/content'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { VaultSprite } from './sprite'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import cel from './cel.module.css'

// The Tech Stack as the hunter's skill tree, opened by his action skill: when the tree first scrolls
// into view he deploys the turret and works it from the wrist computer. The tree: one branch per category, the category on top as the
// branch's action skill and its tools as the nodes down the tiers, joined by the spine. Pointing at a
// node, or tapping it, lights its branch from the top down to it, the way a tree shows the points it took to get
// there. The light is a pointer extra over a plain list: the nodes are not tab stops (sixty of them
// would bury the page's keyboard path), and a screen reader reads each branch as a titled list. On a
// phone the tiers wrap as rows of chips under the skill, without the spine, so a branch is not a
// screen tall column of one word lines.

type Category = TechCategory & { id: string }

interface Lit {
  branch: string
  depth: number
}

interface BranchProps {
  category: Category
  index: number
  /** How far down this branch is lit: 0 the skill, a tier below it, -1 unlit. */
  depth: number
  onLight: (lit: Lit | null) => void
}

// Memoised on its own depth: lighting a node redraws only the branch it lights and the one it leaves.
const Branch = memo(function Branch({ category, index, depth, onLight }: BranchProps) {
  const { cards } = useLabels()

  return (
    <li className={`relative pb-4 ${MASONRY_ITEM} ${cel.branch}`} style={{ ['--i' as string]: index }} onPointerLeave={() => onLight(null)}>
      <div
        className={`relative z-10 mx-auto w-fit px-4 py-2 text-xl ${cel.display} ${cel.skill}`}
        onPointerEnter={() => onLight({ branch: category.id, depth: 0 })}
        onClick={() => onLight({ branch: category.id, depth: 0 })}
      >
        <span data-on={depth >= 0 || undefined} className={`absolute inset-0 ${cel.skillLit}`} style={{ ['--t' as string]: 0 }} aria-hidden="true" />
        <span className="relative">{category.name}</span>
      </div>
      <div className="relative">
        <span className="absolute bottom-6 left-1/2 top-0 hidden w-2 -translate-x-1/2 border-x-2 sm:block border-[var(--cel-ink)] bg-[var(--cel-ink-soft)]" aria-hidden="true" />
        <ul className="relative flex flex-wrap justify-center gap-2 pt-4 sm:flex-col sm:flex-nowrap sm:items-center sm:gap-3" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
          {category.items.map((item, tier) => (
            <li
              key={item}
              className={`relative px-3 py-1.5 text-base font-bold ${cel.skill}`}
              onPointerEnter={() => onLight({ branch: category.id, depth: tier + 1 })}
              onClick={() => onLight({ branch: category.id, depth: tier + 1 })}
            >
              <span data-on={tier + 1 <= depth || undefined} className={`absolute inset-0 ${cel.skillLit}`} style={{ ['--t' as string]: tier + 1 }} aria-hidden="true" />
              <span className="relative">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
})

export function SkillTree({ categories }: { categories: Category[] }) {
  const { cards } = useLabels()
  const [lit, setLit] = useState<Lit | null>(null)
  const { reduced } = useZoneStageContext()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })

  return (
    <div className={`p-5 sm:p-8 ${cel.darkPaper}`}>
      <div ref={ref} className="mb-8 flex flex-wrap items-end gap-6">
        <div className="h-48 w-28 shrink-0" aria-hidden="true">
          <VaultSprite profession="engineer" motion={triggered || reduced ? 'action' : 'idle'} className="h-full w-full" />
        </div>
      </div>
      <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
        {categories.map((category, index) => (
          <Branch key={category.id} category={category} index={index} depth={lit?.branch === category.id ? lit.depth : -1} onLight={setLit} />
        ))}
      </ul>
    </div>
  )
}
