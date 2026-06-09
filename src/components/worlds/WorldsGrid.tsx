'use client'

import { useState } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { WORLDS, WORLD_CATEGORIES, type WorldCategory } from '@/themes/worlds'
import type { Theme } from '@/themes/themes'
import WorldCard from './WorldCard'

type Filter = 'All' | WorldCategory

function FilterChip({
  active,
  label,
  icon,
  count,
  theme,
  onClick,
}: {
  active: boolean
  label: string
  icon: string
  count: number
  theme: Theme
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="ws-chip flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest min-h-[40px] cursor-pointer"
      style={{
        border: `1px solid ${active ? theme.colors.accent : theme.colors.border}`,
        backgroundColor: active ? theme.colors.surfaceHover : 'transparent',
        color: active ? theme.colors.accent : theme.colors.textMuted,
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
      <span aria-hidden="true" style={{ color: theme.colors.textMuted }}>
        {count}
      </span>
    </button>
  )
}

/**
 * The functional Worlds grid: category filter chips + a responsive grid of every OTHER
 * world as a live-preview card. Chrome (chips, card frames) is styled from the CURRENT
 * theme via `useTheme()`, so it inherits whatever world hosts it. Themes wrap this in
 * their own <section> + heading to provide the signature framing. See WorldCard.
 */
export default function WorldsGrid() {
  const { theme } = useTheme()
  const [filter, setFilter] = useState<Filter>('All')

  const others = WORLDS.filter((w) => w.id !== theme.id)
  const visibleWorlds = filter === 'All' ? others : others.filter((w) => w.category === filter)
  const categoriesWithCounts = WORLD_CATEGORIES.map((cat) => ({
    ...cat,
    count: others.filter((w) => w.category === cat.name).length,
  })).filter((c) => c.count > 0)

  return (
    <div>
      <div
        role="group"
        aria-label="Filter worlds by category"
        className="mb-8 flex flex-wrap items-center justify-center gap-2"
      >
        <FilterChip
          active={filter === 'All'}
          onClick={() => setFilter('All')}
          label="All"
          icon="✦"
          count={others.length}
          theme={theme}
        />
        {categoriesWithCounts.map((cat) => (
          <FilterChip
            key={cat.name}
            active={filter === cat.name}
            onClick={() => setFilter(cat.name)}
            label={cat.name}
            icon={cat.icon}
            count={cat.count}
            theme={theme}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleWorlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    </div>
  )
}
