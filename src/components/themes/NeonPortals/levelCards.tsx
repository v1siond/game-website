'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { jobYears } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { Fruit, FruitGhost } from './art'
import { useHud } from './hud'
import world from './world.module.css'

// A job as a level of the world: a carved level plate with its number, the time trial clock reading its
// years in the yellow digits, and a fruit beside every highlight. Pointing at the level (or focusing
// it, or tapping it) collects its fruit: each one hops and flies up to the score, leaving its outline,
// and the HUD fruit counter drops in and ticks. A level's fruit is collected once.
//
// The levels rise out of the floor in turn when the section scrolls in (the section's data-on, staggered
// by --i in the CSS); the clock digits drop in after the card lands.

function Clock({ start, end }: { start: number; end: number | string }) {
  const { hud, years } = useLabels()
  const text = fillLabel(years.range, { start, end })

  return (
    <p className={`inline-flex items-center gap-2 rounded-lg border-2 border-[color:var(--np-gold)] bg-[color:var(--np-void)] px-2 py-1 ${world.clock}`}>
      <span className="text-sm font-black uppercase text-[color:var(--np-gold)]">{hud.time}</span>
      <span className={`text-base font-black tabular-nums text-[color:var(--np-gold)] ${world.clockDigits}`}>{text}</span>
    </p>
  )
}

export function LevelCard({ entry, index }: { entry: Job; index: number }) {
  const { years, hud } = useLabels()
  const { collectFruit, hasCollected, offerFruit } = useHud()
  const [flying, setFlying] = useState(false)
  const collected = hasCollected(entry.id)
  const { start, end } = jobYears(entry, years.present)

  useEffect(() => {
    offerFruit(entry.id, entry.highlights.length)
  }, [entry.id, entry.highlights.length, offerFruit])

  const collect = () => {
    if (entry.highlights.length === 0) return
    if (collectFruit(entry.id, entry.highlights.length)) setFlying(true)
  }

  return (
    <article
      tabIndex={0}
      onPointerEnter={collect}
      onFocus={collect}
      onClick={collect}
      aria-labelledby={`np-job-${entry.id}`}
      className={`relative rounded-2xl border-4 border-[color:var(--np-stone-dark)] bg-[color:var(--np-panel)] focus:outline-none ${world.levelCard}`}
      style={{ '--i': index } as CSSProperties}
    >
      <header className="rounded-t-xl bg-[color:var(--np-stone)] px-5 pb-3 pt-4">
        <p className={`text-sm font-black uppercase tracking-[0.2em] text-[color:var(--np-void)] ${world.plate}`}>{fillLabel(hud.level, { number: index + 1 })}</p>
        <h3 id={`np-job-${entry.id}`} className={`mt-1 text-xl leading-tight text-[color:var(--np-void)] ${world.display} ${world.displayInk}`}>
          {entry.title}
        </h3>
        <p className="text-base font-bold text-[color:var(--np-void)]">{entry.company}</p>
      </header>
      <div className="p-5">
        <Clock start={start} end={end} />
        {entry.description && <p className="mt-3 text-base text-[color:var(--np-white)]">{entry.description}</p>}
        {entry.highlights.length > 0 && (
          <ul className="mt-3 space-y-2">
            {entry.highlights.map((highlight, i) => (
              <li key={highlight} className="flex items-start gap-3 text-base text-[color:var(--np-white)]">
                <span className="relative mt-0.5 block h-6 w-6 shrink-0" aria-hidden="true">
                  <FruitGhost className="absolute inset-0 h-full w-full" />
                  {!collected || flying ? (
                    <span className={`absolute inset-0 ${flying ? world.fruitFly : ''}`} style={{ '--i': i } as CSSProperties} onAnimationEnd={i === entry.highlights.length - 1 ? () => setFlying(false) : undefined}>
                      <Fruit className="h-full w-full" />
                    </span>
                  ) : null}
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
