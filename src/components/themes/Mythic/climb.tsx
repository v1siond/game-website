'use client'

import { useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { fillLabel } from '@/lib/cv/labels'
import type { TechCategory } from '@/lib/cv/content'
import { SpartanSprite, type SpriteMotion } from './sprite'
import { MOVES } from './rig'
import { useTurnQueue } from './track'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The Tech Stack as the climb up the carved chain: a band of carved panels hangs beside the groups, one
// panel per group. Each group that scrolls in queues one reach; he climbs hand over hand with his blades
// on his back, the chain running down a panel per reach, and the panel he grips lights with its group's
// page. Pointing at a page makes its panel glow.

type Category = TechCategory & { id: string }

// The rail is 100 by 480 with 30 more on the left for his body; he stays put and the chain runs down a
// hold per reach, so the panel he grips is always the one at his hands (HOLD_BASE).
const HOLD_STEP = 60
const HOLD_BASE = 300
const holdY = (index: number) => HOLD_BASE - index * HOLD_STEP
// his box: the fists of the hang sit 5 units under the box top, on the gripped panel
const HIM = { x: -19, y: HOLD_BASE - 18, height: 120 }
const LINKS = Array.from({ length: 18 }, (_, index) => -600 + index * 60)
const CLIMB_GAP_MS = MOVES.climb.ms + 250

function Chain({ ids, gripped, glow, take }: { ids: readonly string[]; gripped: number; glow: string | null; take: number }) {
  const { pose, take: moveTake, play, settle } = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })

  useEffect(() => {
    if (take > 0) play('climb')
  }, [take, play])

  const drop = Math.max(0, gripped - 1) * HOLD_STEP
  return (
    <svg viewBox="-30 0 130 480" className="block h-[70vh] max-h-[34rem] w-full" aria-hidden="true">
      <g className={u.chainRun} style={{ transform: `translateY(${drop}px)` }}>
        {/* the oval links either side of the carved band */}
        {LINKS.map((y) => (
          <g key={y}>
            <ellipse cx={22} cy={y + 30} rx={9} ry={26} fill="none" stroke={MYTH.chainSteel} strokeWidth={5} />
            <ellipse cx={78} cy={y + 30} rx={9} ry={26} fill="none" stroke={MYTH.chainSteel} strokeWidth={5} />
          </g>
        ))}
        <rect x={34} y={-600} width={32} height={1080} fill={MYTH.chainBand} />
        {ids.map((id, index) => (
          <g key={id} data-lit={index < gripped || undefined} data-glow={glow === id || undefined} className={u.hold}>
            <rect x={36} y={holdY(index) - 24} width={28} height={28} fill={MYTH.chainPanel} stroke={MYTH.inkLine} strokeWidth={1.5} />
            <circle cx={50} cy={holdY(index) - 10} r={7} fill="none" stroke={MYTH.bronze} strokeWidth={2} />
            <rect x={36} y={holdY(index) - 24} width={28} height={28} fill={MYTH.gold} className={u.holdLight} />
          </g>
        ))}
      </g>
      <SpartanSprite key={moveTake} profession="engineer" motion={pose} place={HIM} onDone={settle} sheathed />
    </svg>
  )
}

function Page({ category, lit, onEnter, onPoint }: { category: Category; lit: boolean; onEnter: (id: string) => void; onPoint: (id: string | null) => void }) {
  const { cards } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.4 })

  useEffect(() => {
    if (triggered) onEnter(category.id)
  }, [triggered, category.id, onEnter])

  return (
    <li
      ref={ref}
      data-lit={lit || undefined}
      onPointerEnter={() => onPoint(category.id)}
      onPointerLeave={() => onPoint(null)}
      className={`p-5 ${u.parchment} ${u.page}`}
    >
      <h3 className={`border-b-2 border-[var(--myth-gold-deep)] pb-2 text-lg ${u.display}`}>{category.name}</h3>
      <ul
        className="mt-3 flex flex-wrap gap-2"
        aria-label={fillLabel(cards.categoryTechnologies, {
          name: category.name,
        })}
      >
        {category.items.map((item) => (
          <li key={item} className="border border-[var(--myth-ink-soft)] px-2 py-0.5 text-base">
            {item}
          </li>
        ))}
      </ul>
    </li>
  )
}

export function Climb({ categories }: { categories: Category[] }) {
  const { cards, myth } = useLabels()
  const { enter, isDone, take, count } = useTurnQueue(categories, CLIMB_GAP_MS)
  const [glow, setGlow] = useState<string | null>(null)
  const ids = categories.map((category) => category.id)

  return (
    <div>
      <p className={`mb-4 ${u.hint}`}>{myth.climbHint}</p>
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 md:grid-cols-[7rem_minmax(0,1fr)]">
        <div className="sticky top-16 self-start">
          <Chain ids={ids} gripped={count} glow={glow} take={take} />
        </div>
        <ul className="grid gap-4 md:grid-cols-2" aria-label={cards.techByCategory}>
          {categories.map((category) => (
            <Page key={category.id} category={category} lit={isDone(category.id)} onEnter={enter} onPoint={setGlow} />
          ))}
        </ul>
      </div>
    </div>
  )
}
