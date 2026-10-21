'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { newTabName } from '@/components/cv/sectionText'
import { BAKELITE, CHROME, CREAM, OLIVE_DARK, RUBBER, STEEL_LIGHT } from './palette'
import atomic from './atomic.module.css'

// Tech Stack as the terminal's inventory screen: the categories down the left as the item list (the
// pick inverted), the picked category's tools on the right. A tablist: arrows move the pick, as on the
// device's dial. The section itself only fades in (the plain reveal Tech Stack gets in every world).
//
// Ventures as holotapes on a shelf: each company a cassette with its label sticker, the two reels turning
// while the pointer or focus is on it.

const STEP: Readonly<Record<string, -1 | 1>> = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }

export function Inventory({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()
  const [picked, setPicked] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const category = categories[picked]

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = STEP[event.key]
    if (!step) return
    event.preventDefault()
    const next = (picked + step + categories.length) % categories.length
    setPicked(next)
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }

  if (!category) return null

  return (
    <div className={`grid gap-4 p-4 sm:p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] ${atomic.panel}`}>
      <div ref={listRef} role="tablist" aria-label={cards.techByCategory} aria-orientation="vertical" onKeyDown={onKeyDown} className="flex flex-col gap-1">
        {categories.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            id={`atomic-inv-${entry.id}`}
            aria-selected={index === picked}
            aria-controls="atomic-inv-panel"
            tabIndex={index === picked ? 0 : -1}
            onClick={() => setPicked(index)}
            className={`relative flex min-h-[44px] items-center justify-between gap-3 px-3 text-left text-sm font-bold uppercase tracking-widest text-atomic-phosphor ${atomic.pickRow} ${atomic.focusRing}`}
            data-on={index === picked || undefined}
          >
            <span className="relative">{entry.name}</span>
            <span className="relative" aria-hidden="true">
              {`(${entry.items.length})`}
            </span>
          </button>
        ))}
      </div>

      <div id="atomic-inv-panel" role="tabpanel" aria-labelledby={`atomic-inv-${category.id}`} className="border-t border-atomic-phosphor/30 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <div key={category.id} className={atomic.powerOn}>
          <p className="mb-4 flex items-center gap-3 text-base font-bold uppercase tracking-widest text-atomic-yellow">
            <span className="text-2xl" aria-hidden="true">
              {category.icon}
            </span>
            {category.name}
          </p>
          <ul className="grid gap-1 sm:grid-cols-2" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
            {category.items.map((item) => (
              <li key={item} className={`relative px-3 py-2 text-base text-atomic-phosphor ${atomic.pickRow}`}>
                <span className="relative">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Cassette() {
  return (
    <svg viewBox="0 0 160 100" className="h-auto w-full" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="156" height="96" rx="8" fill={OLIVE_DARK} stroke={RUBBER} strokeWidth="3" />
      <rect x="14" y="10" width="132" height="42" rx="3" fill={CREAM} />
      <rect x="40" y="58" width="80" height="30" rx="12" fill={RUBBER} />
      {[62, 98].map((cx) => (
        <g key={cx} className={atomic.reel}>
          <circle cx={cx} cy="73" r="11" fill={BAKELITE} stroke={CHROME} strokeWidth="2" />
          {[0, 60, 120].map((angle) => (
            <rect key={angle} x={cx - 1.5} y="64" width="3" height="18" fill={STEEL_LIGHT} transform={`rotate(${angle} ${cx} 73)`} />
          ))}
        </g>
      ))}
      <circle cx="10" cy="90" r="3" fill={CHROME} />
      <circle cx="150" cy="90" r="3" fill={CHROME} />
    </svg>
  )
}

export function Holotapes({ companies }: { companies: CVData['companies'] }) {
  const { links } = useLabels()

  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {companies.map((company) => (
        <li key={company.id}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
            className={`group relative block ${atomic.holotape} ${atomic.focusRing}`}
          >
            <div className="relative">
              <Cassette />
              <div className="absolute inset-x-[11%] top-[12%] flex h-[38%] flex-col justify-center px-2 text-atomic-poster-ink">
                <p className="truncate text-base font-bold uppercase tracking-wide">{company.name}</p>
                <p className="truncate text-sm">{company.tagline}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-atomic-ash">{company.description}</p>
          </a>
        </li>
      ))}
    </ul>
  )
}
