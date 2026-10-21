'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { jobYears } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { SpartanSprite } from './sprite'
import { useWorldMotion } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// Work Experience as the chambers of the escape: each job a chamber behind its bronze doors. When a
// chamber first scrolls into view (and the one before it is done) a shade rises in it, he dashes in and
// cleaves it with the chain combo, the cleared stamp strikes, the doors swing open and the job is read in
// the doorway's light. Each chamber cleared fills one cell of the counter above them, which says its
// count in words too. Pointing at a chamber lights the laurel over its door.

function Shade() {
  return (
    <svg viewBox="0 0 60 90" className={`absolute bottom-3 right-[14%] h-28 w-20 ${u.shade}`} aria-hidden="true">
      <path d="M30 4 Q50 6 50 30 L54 84 Q44 76 38 86 Q30 76 22 86 Q16 76 6 84 L10 30 Q10 6 30 4 Z" fill={MYTH.soul} opacity={0.75} stroke={MYTH.inkLine} strokeWidth={2.5} />
      <path d="M20 28 L26 32 M40 28 L34 32" stroke={MYTH.inkLine} strokeWidth={3} strokeLinecap="round" />
    </svg>
  )
}

function ChamberScene({ index, on }: { index: number; on: boolean }) {
  const { myth } = useLabels()

  return (
    <div className={`relative h-44 overflow-hidden ${u.chamberScene}`} aria-hidden="true">
      {/* the doorway: an arch of brick, gold light behind the doors */}
      <div className="absolute bottom-0 left-1/2 h-32 w-28 -translate-x-1/2 overflow-hidden rounded-t-full border-2 border-[var(--myth-ink)] bg-[radial-gradient(ellipse_at_50%_70%,var(--myth-gold-pale),var(--myth-gold)_40%,var(--myth-gold-deep))]">
        <div className={`absolute inset-y-0 left-0 w-1/2 border-r-2 border-[var(--myth-ink)] bg-[linear-gradient(90deg,var(--myth-bronze),var(--myth-gold-deep))] ${u.doorLeft}`} />
        <div className={`absolute inset-y-0 right-0 w-1/2 border-l-2 border-[var(--myth-ink)] bg-[linear-gradient(270deg,var(--myth-bronze),var(--myth-gold-deep))] ${u.doorRight}`} />
      </div>
      <svg viewBox="0 0 80 24" className={`absolute left-1/2 top-2 h-6 w-20 -translate-x-1/2 ${u.laurel}`}>
        <path d="M6 18 Q40 30 74 18" fill="none" stroke={MYTH.gold} strokeWidth={2} />
        {[10, 20, 30, 50, 60, 70].map((x) => (
          <ellipse key={x} cx={x} cy={x < 40 ? 14 - (x - 10) / 6 : 14 - (70 - x) / 6} rx={5} ry={2.5} fill={MYTH.gold} transform={`rotate(${x < 40 ? -30 : 30} ${x} 14)`} />
        ))}
      </svg>
      <span className={`absolute left-3 top-2 text-sm text-[var(--myth-gold-pale)] ${u.display}`}>{fillLabel(myth.chamberOf, { number: index + 1 })}</span>
      <Shade />
      <div className={`absolute bottom-0 left-[6%] h-36 w-28 ${u.dasher}`}>
        <SpartanSprite profession="engineer" motion={on ? 'action' : 'still'} className="h-full w-full" />
      </div>
      <p className={`absolute left-1/2 top-1/3 -translate-x-1/2 whitespace-nowrap ${u.stamp}`}>
        <span className={`block border-2 border-[var(--myth-ink)] bg-[var(--myth-blood)] px-3 py-1 text-base text-[var(--myth-bone)] ${u.display}`}>{myth.chamberCleared}</span>
      </p>
    </div>
  )
}

function Chamber({ job, index, on, onEnter }: { job: Job; index: number; on: boolean; onEnter: (id: string) => void }) {
  const { years, cards } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.35 })
  const { start, end } = jobYears(job, years.present)

  useEffect(() => {
    if (triggered) onEnter(job.id)
  }, [triggered, job.id, onEnter])

  return (
    <article ref={ref} data-on={on || undefined} className={`overflow-hidden ${u.panel} ${u.chamber}`}>
      <ChamberScene index={index} on={on} />
      <div className={`p-5 ${u.chamberText}`}>
        <h3 className={`text-xl leading-tight text-[var(--myth-gold)] ${u.display}`}>{job.company}</h3>
        <p className="mt-1 text-base font-bold">{job.title}</p>
        <p className="text-sm text-[var(--myth-bone-shade)]">
          {fillLabel(years.range, { start, end })}
          {job.location && ` · ${job.location}`}
        </p>
        <p className="mt-3 text-base leading-relaxed">{job.description}</p>
        {job.highlights.length > 0 && (
          <>
            <h4 className={`mt-4 text-sm text-[var(--myth-gold)] ${u.display}`}>{cards.keyAchievements}</h4>
            <ul className="mt-2 space-y-1.5">
              {job.highlights.map((line) => (
                <li key={line} className="flex gap-2 text-base">
                  <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[var(--myth-blood)]" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {job.skills.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={cards.skillsUsed}>
            {job.skills.map((skill) => (
              <li key={skill} className="border border-[var(--myth-gold-deep)] bg-[var(--myth-ink)] px-2 py-0.5 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

function ClearedCounter({ cleared, total }: { cleared: number; total: number }) {
  const { myth } = useLabels()

  return (
    <div className={`mb-8 flex flex-wrap items-center gap-4 px-4 py-3 ${u.panel}`}>
      <div className="flex min-w-[8rem] flex-1 gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={`relative h-4 flex-1 overflow-hidden ${u.counterCell}`}>
            <span data-on={index < cleared || undefined} className={`absolute inset-0 ${u.counterFill}`} />
          </span>
        ))}
      </div>
      <span className={`text-base text-[var(--myth-gold-pale)] ${u.display}`} role="status">
        {fillLabel(myth.chambersCleared, { count: cleared, total })}
      </span>
    </div>
  )
}

// One chamber is cleared at a time, in job order, the next one a fight's length after the last, so a row
// of chambers coming into view together plays one after another and the view keeps few moving parts.
const CLEAR_GAP_MS = 1900

function useClearQueue(jobs: Job[]) {
  const { reduced } = useWorldMotion()
  const [entered, setEntered] = useState<ReadonlySet<string>>(new Set())
  const [cleared, setCleared] = useState<readonly string[]>([])
  const lastClear = useRef(0)
  const next = jobs.find((job) => entered.has(job.id) && !cleared.includes(job.id))

  const enter = useCallback((id: string) => {
    setEntered((current) => (current.has(id) ? current : new Set(current).add(id)))
  }, [])

  useEffect(() => {
    if (!next || reduced) return
    const wait = Math.max(0, lastClear.current + CLEAR_GAP_MS - Date.now())
    const timer = window.setTimeout(() => {
      lastClear.current = Date.now()
      setCleared((current) => [...current, next.id])
    }, wait)
    return () => window.clearTimeout(timer)
  }, [next, reduced])

  const isCleared = (id: string) => reduced || cleared.includes(id)
  return { enter, isCleared, count: reduced ? jobs.length : cleared.length }
}

export function Chambers({ jobs }: { jobs: Job[] }) {
  const { myth } = useLabels()
  const { enter, isCleared, count } = useClearQueue(jobs)

  return (
    <>
      <ClearedCounter cleared={count} total={jobs.length} />
      <p className={`mb-6 ${u.hint}`}>{myth.doorHint}</p>
      <ul className={MASONRY_LIST}>
        {jobs.map((job, index) => (
          <li key={job.id} className={MASONRY_ITEM}>
            <Chamber job={job} index={index} on={isCleared(job.id)} onEnter={enter} />
          </li>
        ))}
      </ul>
    </>
  )
}
