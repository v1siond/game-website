'use client'

import { useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import type { TechCategory } from '@/lib/cv/content'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { VaultSprite } from './sprite'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import cel from './cel.module.css'

// The Tech Stack as the hunter's skill tree, opened by his action skill: when the tree first scrolls
// into view he deploys the turret and works it from the wrist computer. The tree: one branch per category, the category on top as the
// branch's action skill and its tools as the nodes down the tiers, joined by the spine. Pointing at a
// node lights its branch from the top down to it, the way a tree shows the points it took to get
// there. The light is a pointer extra over a plain list: the nodes are not tab stops (sixty of them
// would bury the page's keyboard path), and a screen reader reads each branch as a titled list.

type Category = TechCategory & { id: string }

interface Lit {
  branch: string
  depth: number
}

function Branch({ category, index, lit, onLight }: { category: Category; index: number; lit: Lit | null; onLight: (lit: Lit | null) => void }) {
  const { cards } = useLabels()
  const depth = lit?.branch === category.id ? lit.depth : -1

  return (
    <li className={`relative ${cel.branch}`} style={{ ['--i' as string]: index }} onPointerLeave={() => onLight(null)}>
      <div
        className={`relative z-10 mx-auto w-fit px-4 py-2 text-xl ${cel.display} ${cel.skill}`}
        onPointerEnter={() => onLight({ branch: category.id, depth: 0 })}
      >
        <span data-on={depth >= 0 || undefined} className={`absolute inset-0 ${cel.skillLit}`} style={{ ['--t' as string]: 0 }} aria-hidden="true" />
        <span className="relative">{category.name}</span>
      </div>
      <div className="relative">
        <span className="absolute bottom-6 left-1/2 top-0 w-2 -translate-x-1/2 border-x-2 border-[var(--cel-ink)] bg-[var(--cel-ink-soft)]" aria-hidden="true" />
        <ul className="relative flex flex-col items-center gap-3 pt-4" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
          {category.items.map((item, tier) => (
            <li
              key={item}
              className={`relative px-3 py-1.5 text-base font-bold ${cel.skill}`}
              onPointerEnter={() => onLight({ branch: category.id, depth: tier + 1 })}
            >
              <span data-on={tier + 1 <= depth || undefined} className={`absolute inset-0 ${cel.skillLit}`} style={{ ['--t' as string]: tier + 1 }} aria-hidden="true" />
              <span className="relative">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function SkillTree({ categories }: { categories: Category[] }) {
  const { cards, hud } = useLabels()
  const [lit, setLit] = useState<Lit | null>(null)
  const { reduced } = useZoneStageContext()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })

  return (
    <div className={`p-5 sm:p-8 ${cel.darkPaper}`}>
      <div ref={ref} className="mb-8 flex flex-wrap items-end gap-6">
        <div className="h-48 w-28 shrink-0" aria-hidden="true">
          <VaultSprite profession="engineer" motion={triggered || reduced ? 'action' : 'idle'} className="h-full w-full" />
        </div>
        <p className="mb-4 w-full min-w-0 text-base text-[var(--cel-paper)] sm:ml-28 sm:w-auto sm:flex-1">{hud.treeHint}</p>
      </div>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" aria-label={cards.techByCategory}>
        {categories.map((category, index) => (
          <Branch key={category.id} category={category} index={index} lit={lit} onLight={setLit} />
        ))}
      </ul>
    </div>
  )
}
