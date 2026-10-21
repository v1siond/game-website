'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { jobYears } from '@/components/cv/sectionText'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { EraScene, LEVEL_ERAS } from './eras'
import { Crystal, Fruit, Stopwatch } from './pickups'
import { useScore } from './score'
import levels from './warpLevels.module.css'
import ui from './warped.module.css'

// A job as one of the warp room's level portals (Warped, named in code only): a round window into the
// level's time period set in the room's plated frame, the level number on its button pad, the job
// title as the level's name, the time trial clock reading its years, the highlights as the fruit along
// its path. Each level holds a crystal: pointing at the card (or focusing it, or tapping it) takes it,
// the crystal rises out of the window and spins into the score, the boss door gets a lamp, and the
// card's pad shows the crystal from then on. A crystal is taken once.

export function LevelPortal({ entry, index }: { entry: Job; index: number }) {
  const { years, hud } = useLabels()
  const { offer, take, has } = useScore()
  const [rising, setRising] = useState(false)
  const taken = has('crystals', entry.id)
  const { start, end } = jobYears(entry, years.present)

  useEffect(() => {
    offer('crystals', entry.id)
  }, [entry.id, offer])

  const collect = () => {
    if (take('crystals', entry.id)) setRising(true)
  }

  return (
    <article
      tabIndex={0}
      onPointerEnter={collect}
      onFocus={collect}
      onClick={collect}
      aria-labelledby={`np-job-${entry.id}`}
      className={`relative overflow-hidden ${ui.panel} ${ui.rise} focus:outline-none`}
      style={{ '--i': index } as CSSProperties}
    >
      <div className={`relative aspect-[5/3] border-b-[3px] border-[color:var(--np-void)] ${levels.sky}`} aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 aspect-square h-[86%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-[color:var(--np-void)]">
          <EraScene era={LEVEL_ERAS[index % LEVEL_ERAS.length]} className={`h-full w-full ${levels.window}`} />
          <span className={`absolute inset-0 rounded-full ${levels.glass}`} />
        </span>
        {rising && (
          <span className={`absolute left-1/2 top-[22%] h-[44%] w-[16%] -translate-x-1/2 ${levels.rise}`} onAnimationEnd={() => setRising(false)}>
            <Crystal className="h-full w-full" />
          </span>
        )}
      </div>
      <header className="flex items-center gap-3 border-b-[3px] border-[color:var(--np-void)] bg-[color:var(--np-void)] px-5 py-3">
        <span className={`flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-[color:var(--np-void)] px-2 text-lg ${taken ? levels.badgeTaken : levels.badge} ${ui.chunk}`}>
          {taken ? (
            <span className="block h-7 w-5" aria-hidden="true">
              <Crystal className="h-full w-full" />
            </span>
          ) : (
            index + 1
          )}
        </span>
        <div className="min-w-0">
          <p className={`text-sm uppercase tracking-[0.2em] text-[color:var(--np-gold)] ${ui.chunk}`}>{fillLabel(hud.level, { number: index + 1 })}</p>
          <h3 id={`np-job-${entry.id}`} className={`text-xl leading-tight ${ui.display}`}>
            {entry.title}
          </h3>
        </div>
      </header>
      <div className="p-5">
        <p className="text-base font-bold text-[color:var(--np-white)]">{entry.company}</p>
        <p className="mt-2 inline-flex items-center gap-2 rounded-lg border-2 border-[color:var(--np-gold)] bg-[color:var(--np-void)] px-2 py-1">
          <span className="block h-6 w-6" aria-hidden="true">
            <Stopwatch className="h-full w-full" />
          </span>
          <span className={`text-sm uppercase text-[color:var(--np-gold)] ${ui.chunk}`}>{hud.time}</span>
          <span className="text-base font-black tabular-nums text-[color:var(--np-gold)]">{fillLabel(years.range, { start, end })}</span>
        </p>
        {entry.description && <p className="mt-3 text-base text-[color:var(--np-white)]">{entry.description}</p>}
        {entry.highlights.length > 0 && (
          <ul className="mt-3 space-y-2">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-base text-[color:var(--np-white)]">
                <span className="mt-0.5 block h-6 w-6 shrink-0" aria-hidden="true">
                  <Fruit className="h-full w-full" />
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
