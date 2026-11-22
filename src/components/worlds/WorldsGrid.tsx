'use client'

import { useState } from 'react'
import { WORLDS, WORLD_CATEGORIES, type World } from '@/lib/worlds/registry'
import type { PickerEntry } from '@/lib/worlds/nudge'
import WorldCard from './WorldCard'
import { CATEGORY_ICONS, type WorldFilter as Filter } from './categoryIcons'
import { useWorldsLabels, type WorldsText } from './WorldsLabels'

const WORLD_BY_ID = new Map<string, World>(WORLDS.map((world) => [world.id, world]))

// Each filter chip's name in the page's language (labels.json worlds); the registry's names are its keys.
const FILTER_LABEL: Record<Filter, keyof WorldsText> = {
  All: 'pickerFilterAll',
  Fantasy: 'pickerFilterFantasy',
  Retro: 'pickerFilterRetro',
  Neon: 'pickerFilterNeon',
  Action: 'pickerFilterAction',
  Artistic: 'pickerFilterArtistic',
}

// The registry is fixed for the page's life, so each chip's count is counted once, not per render.
const CATEGORIES_WITH_COUNTS = WORLD_CATEGORIES.map((cat) => ({
  ...cat,
  count: WORLDS.filter((w) => w.category === cat.name).length,
})).filter((c) => c.count > 0)

function FilterChip({
  active,
  filter,
  label,
  count,
  onClick,
}: {
  active: boolean
  filter: Filter
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="ws-chip c-worlds-chip flex shrink-0 items-center gap-2 rounded-full px-4 min-h-11 text-base tracking-[0.1em] cursor-pointer"
    >
      {CATEGORY_ICONS[filter]()}
      <span>{label}</span>
      <span aria-hidden="true">{count}</span>
    </button>
  )
}

/**
 * The worlds grid inside the picker: the kind filter chips, then every world as a card in the picker's
 * order (orderForPicker: up next, unseen, seen, here), the up next card first and two columns wide. A
 * filter keeps that order and shows only the worlds of its kind. Painted from the launcher tokens the
 * picker sets (worlds-nudge.css). See WorldCard.
 */
export default function WorldsGrid({ order }: { order: PickerEntry[] }) {
  const labels = useWorldsLabels()
  const [filter, setFilter] = useState<Filter>('All')

  const entries = order.filter((entry) => filter === 'All' || WORLD_BY_ID.get(entry.id)?.category === filter)

  return (
    <div>
      <div
        role="group"
        aria-label={labels.pickerFilterAria}
        // one row that scrolls sideways on a phone, so the chips never push the worlds below the screen
        className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
      >
        <FilterChip active={filter === 'All'} onClick={() => setFilter('All')} filter="All" label={labels[FILTER_LABEL.All]} count={WORLDS.length} />
        {CATEGORIES_WITH_COUNTS.map((cat) => (
          <FilterChip
            key={cat.name}
            active={filter === cat.name}
            onClick={() => setFilter(cat.name)}
            filter={cat.name}
            label={labels[FILTER_LABEL[cat.name]]}
            count={cat.count}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {entries.map((entry) => (
          <WorldCard key={entry.id} id={entry.id} mark={entry.mark} />
        ))}
      </div>
    </div>
  )
}
