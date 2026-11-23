'use client'

import type { CVData } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MASONRY_ITEM, MASONRY_COLUMN_LIST, MASONRY_TILES } from '@/lib/cv/masonry'
import { fillLabel } from '@/lib/cv/labels'
import { newTabHint } from '@/lib/cv/sectionText'
import { ventureCard } from '@/lib/cv/cvView'
import { TagList } from '@/components/cv/TagList'
import { ATOMIC_CHIPS } from './controls'
import { BAKELITE, CHROME, CREAM, OLIVE_DARK, RUBBER, STEEL_LIGHT } from './palette'
import atomic from './atomic.module.css'

// Tech Stack as the terminal's inventory screen: every category a pocket packed in masonry columns, its
// name on the picked, inverted row with the item count, its tools as the rows the pick sweeps over on
// hover; on the stage he throws open a footlocker per pocket as the page reaches it (scenes.tsx).
//
// Ventures as tapes on a shelf: each company a cassette with its label sticker, the two reels turning
// while the pointer or focus is on it; on the stage the dog digs each tape out of its mound (scenes.tsx).

export function Inventory({ categories }: { categories: CVData['techStack'] }) {
  const { cards } = useLabels()

  return (
    <div className={`p-4 sm:p-6 ${atomic.panel}`}>
      <ul className={MASONRY_COLUMN_LIST} aria-label={cards.techByCategory}>
        {categories.map((category) => (
          <li key={category.id} className={MASONRY_ITEM}>
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
        <g key={cx} className={`motion-safe:group-hover:animate-[spin_1.4s_linear_3] motion-safe:group-focus-visible:animate-[spin_1.4s_linear_3] ${atomic.reel}`}>
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

/**
 * The tape shelf; `dug` is how many tapes the dog has dug up so far (dig.tsx), all of them by default.
 * His own products (featured) are the two big tapes of the first row, a yellow tag over the
 * tagline; the other ventures follow three to a row. Each tape's link is named by everything it shows,
 * its services included, plus the new tab note a screen reader alone hears.
 */
export function Tapes({ companies }: { companies: CVData['companies'] }) {
  const { links, cards, sections } = useLabels()

  return (
    <ul className="grid gap-6 md:grid-cols-6">
      {companies.map(ventureCard).map((company) => (
        <li key={company.id} className={company.featured ? 'md:col-span-3' : 'md:col-span-2'}>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative block ${atomic.tape}`}
          >
            <div className="relative">
              <Cassette />
              <div className="absolute inset-x-[11%] top-[12%] flex h-[38%] flex-col justify-center px-2 text-atomic-poster-ink">
                <p className="text-base font-bold uppercase leading-tight tracking-wide">
                  <SlashBreaks text={company.name} />
                </p>
              </div>
            </div>
            {/* The tape's words pass over the street scene at every width, so they ride on a strip of ink. */}
            <div className="mt-3 rounded bg-atomic-ink/90 p-3">
              {company.featured && (
                <p className="mb-2 inline-block bg-atomic-yellow px-2 py-0.5 text-sm font-bold uppercase tracking-wider text-atomic-ink">{cards.ownProduct}</p>
              )}
              <p className="text-sm font-bold text-atomic-yellow">{company.tagline}</p>
              <p className="mt-1 text-sm leading-relaxed text-atomic-ash">{company.description}</p>
              <TagList items={company.services} label={sections.services} look={ATOMIC_CHIPS} />
              <span className="sr-only"> {newTabHint(links)}</span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
