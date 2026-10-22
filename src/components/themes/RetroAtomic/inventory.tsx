'use client'

import type { CSSProperties } from 'react'
import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MASONRY_ITEM, MASONRY_LIST, MASONRY_TILES } from '@/components/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import { newTabName } from '@/components/cv/sectionText'
import { BAKELITE, CHROME, CREAM, OLIVE_DARK, RUBBER, STEEL_LIGHT } from './palette'
import atomic from './atomic.module.css'

// Tech Stack as the terminal's inventory screen: every category a pocket packed in masonry columns, its
// name on the picked, inverted row with the item count, its tools as the rows the pick sweeps over on
// hover. Each pocket carries its place as --i, so the footlocker's loot (footlocker.tsx) tumbles them in
// one after another.
//
// Ventures as holotapes on a shelf: each company a cassette with its label sticker, the two reels turning
// while the pointer or focus is on it.

export function Inventory({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <div className={`p-4 sm:p-6 ${atomic.panel}`}>
      <ul className={MASONRY_LIST} aria-label={cards.techByCategory}>
        {categories.map((category, index) => (
          <li key={category.id} data-pocket className={MASONRY_ITEM} style={{ '--i': index } as CSSProperties}>
            <h3
              data-on
              className={`relative flex min-h-[44px] items-center justify-between gap-3 px-3 text-sm font-bold uppercase tracking-widest ${atomic.pickRow}`}
            >
              <span className="relative flex items-center gap-3">
                <span className="text-xl" aria-hidden="true">
                  {category.icon}
                </span>
                {category.name}
              </span>
              <span className="relative" aria-hidden="true">
                {`(${category.items.length})`}
              </span>
            </h3>
            <ul className={`mt-2 gap-1 ${MASONRY_TILES}`} aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
              {category.items.map((item) => (
                <li key={item} className={`relative px-3 py-2 text-base text-atomic-phosphor ${atomic.pickRow}`}>
                  <span className="relative">{item}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
                <p className="text-base font-bold uppercase leading-tight tracking-wide">
                  <SlashBreaks text={company.name} />
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm font-bold text-atomic-yellow">{company.tagline}</p>
            <p className="mt-1 text-sm leading-relaxed text-atomic-ash">{company.description}</p>
          </a>
        </li>
      ))}
    </ul>
  )
}
