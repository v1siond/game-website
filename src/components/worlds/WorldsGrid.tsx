'use client'

import { useState } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { WORLDS, WORLD_CATEGORIES } from '@/themes/worlds'
import type { Theme } from '@/themes/themes'
import WorldCard from './WorldCard'
import { CATEGORY_ICONS, type WorldFilter as Filter } from './categoryIcons'

function FilterChip({
  active,
  label,
  count,
  theme,
  onClick,
}: {
  active: boolean
  label: Filter
  count: number
  theme: Theme
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="ws-chip flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest min-h-11 lg:min-h-[40px] cursor-pointer"
      style={{
        border: `1px solid ${active ? theme.colors.accent : theme.colors.border}`,
        backgroundColor: active ? theme.colors.surfaceHover : 'transparent',
        color: active ? theme.colors.accent : theme.colors.textMuted,
      }}
    >
      {CATEGORY_ICONS[label]()}
      <span>{label}</span>
      <span aria-hidden="true" style={{ color: theme.colors.textMuted }}>
        {count}
      </span>
    </button>
  )
}

/**
 * The functional Worlds grid: category filter chips + a responsive grid of every
 * world as a live-preview card. Chrome (chips, card frames) is styled from the CURRENT
 * theme via `useTheme()`, so it inherits whatever world hosts it. Themes wrap this in
 * their own <section> + heading to provide the signature framing. See WorldCard.
 */
export default function WorldsGrid() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState<Filter>('All')

  // One fixed order (the registry's); the current world is flagged in place, never moved.
  const visibleWorlds = filter === 'All' ? WORLDS : WORLDS.filter((w) => w.category === filter)
  const categoriesWithCounts = WORLD_CATEGORIES.map((cat) => ({
    ...cat,
    count: WORLDS.filter((w) => w.category === cat.name).length,
  })).filter((c) => c.count > 0)

  return (
    <div>
      <div
        role="group"
        aria-label="Filter worlds by category"
        // one row that scrolls sideways on a phone, so the chips never push the worlds below the screen
        className="mb-8 flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
      >
        <FilterChip
          active={filter === 'All'}
          onClick={() => setFilter('All')}
          label="All"
          count={WORLDS.length}
          theme={theme}
        />
        {categoriesWithCounts.map((cat) => (
          <FilterChip
            key={cat.name}
            active={filter === cat.name}
            onClick={() => setFilter(cat.name)}
            label={cat.name}
            count={cat.count}
            theme={theme}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleWorlds.map((world) => (
          <WorldCard key={world.id} world={world} isCurrent={world.id === theme.id} />
        ))}
      </div>
    </div>
  )
}
