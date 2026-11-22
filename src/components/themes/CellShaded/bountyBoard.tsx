'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { jobCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { INKED_TAGS, ORANGE_POINTS } from './stage'
import cel from './cel.module.css'

// Work Experience as the town's bounty board: each job a notice pinned to the planks, slapped on when it
// first scrolls into view. Each notice read fills one cell of the XP bar above the board and pops a
// level up, the way a finished mission pays out; the bar shows its count in words, never by colour
// alone. A running job carries the red Active stamp, a past one Completed.

// The tilt of each notice in turn, so the board looks pinned by hand.
const TILTS = ['-1.5deg', '1deg', '-0.6deg', '1.6deg', '-1deg']

function Notice({ job, index, onRead }: { job: Job; index: number; onRead: (id: string) => void }) {
  const { years, cards, navigation, hud } = useLabels()
  const { reduced } = useZoneStageContext()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.4 })
  const on = triggered || reduced
  const card = jobCard(job, years)

  useEffect(() => {
    if (on) onRead(job.id)
  }, [on, job.id, onRead])

  return (
    <article ref={ref} data-on={on || undefined} className={cel.noticeSlot}>
      <div className={`relative p-5 ${cel.notice}`} style={{ ['--tilt' as string]: TILTS[index % TILTS.length] }}>
        <span className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-[var(--cel-ink)] bg-[var(--cel-red)]" aria-hidden="true" />
        <p className={`float-right ml-3 px-2 py-0.5 text-sm ${cel.display} ${cel.stamp} [-webkit-text-stroke:0]`}>
          {job.current ? navigation.active : hud.completed}
        </p>
        <h3 className={`text-2xl leading-tight ${cel.display} [-webkit-text-stroke:0]`}>
          <SlashBreaks text={card.company} />
        </h3>
        <p className="mt-1 text-base font-bold">{card.title}</p>
        <p className="text-sm font-bold text-[var(--cel-plank-shade)]">
          {card.years}
          {card.location && ` · ${card.location}`}
        </p>
        <p className="mt-3 text-base leading-relaxed">{card.description}</p>
        <MarkedLines items={card.highlights} label={cards.keyAchievements} look={ORANGE_POINTS} />
        <TagList items={card.skills} label={cards.skillsUsed} look={{ ...INKED_TAGS, list: 'mt-4 flex flex-wrap gap-2' }} />
      </div>
    </article>
  )
}

function XpBar({ read, total }: { read: number; total: number }) {
  const { hud } = useLabels()
  const { reduced } = useZoneStageContext()

  return (
    <div className={`relative mb-8 flex flex-wrap items-center gap-4 px-4 py-3 ${cel.xpBar}`}>
      <span className={`text-xl text-[var(--cel-sun)] ${cel.display}`}>{hud.xp}</span>
      <div className="flex min-w-[8rem] flex-1 gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={`relative h-5 flex-1 overflow-hidden ${cel.xpCell}`}>
            <span data-on={index < read || undefined} className={`absolute inset-0 ${cel.xpFill}`} />
          </span>
        ))}
      </div>
      <span className="text-base font-bold">
        {fillLabel(hud.level, { number: read })} · {fillLabel(hud.xpBar, { count: read, total })}
      </span>
      {read > 0 && !reduced && (
        <span key={read} className={`pointer-events-none absolute -top-6 right-6 text-2xl text-[var(--cel-sun)] ${cel.display} ${cel.levelUp}`} aria-hidden="true">
          {hud.levelUp}
        </span>
      )}
    </div>
  )
}

export function BountyBoard({ jobs }: { jobs: Job[] }) {
  const [read, setRead] = useState<ReadonlySet<string>>(() => new Set())

  const markRead = useCallback((id: string) => {
    setRead((current) => (current.has(id) ? current : new Set(current).add(id)))
  }, [])

  return (
    <>
      <XpBar read={read.size} total={jobs.length} />
      <div className={`p-4 sm:p-6 ${cel.board}`}>
        <ul className={MASONRY_LIST}>
          {jobs.map((job, index) => (
            <li key={job.id} className={`${MASONRY_ITEM} pt-3`}>
              <Notice job={job} index={index} onRead={markRead} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
