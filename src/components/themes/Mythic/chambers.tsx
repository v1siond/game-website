'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { jobYears } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { Job } from '@/lib/cv/content'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import { SpartanSprite } from './sprite'
import { BronzeDoors } from './doors'
import { Laurel } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// Work Experience as the chambers of the escape: each job a chamber behind its bronze doors. When a
// chamber first scrolls into view (and the one before it is done) a foe rises in it, he dashes in and
// cleaves it with the chain combo, the cleared stamp strikes, the doors swing open, he walks through them
// and the job is read in the doorway's light. The foe changes from chamber to chamber (a wraith, a
// floating skull, a winged fury), and a cleared chamber is left empty, so the list never shows the same
// fight twice over. Each chamber cleared fills one cell of the counter above them, which says its count
// in words too. Pointing at a chamber lights the laurel over its door.

const INK = MYTH.inkLine

function Wraith() {
  return (
    <>
      <path d="M30 4 Q50 6 50 30 L54 84 Q44 76 38 86 Q30 76 22 86 Q16 76 6 84 L10 30 Q10 6 30 4 Z" fill={MYTH.soul} opacity={0.75} stroke={INK} strokeWidth={2.5} />
      <path d="M20 28 L26 32 M40 28 L34 32" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    </>
  )
}

function FloatingSkull() {
  return (
    <>
      <path d="M30 50 Q44 60 40 74 M30 50 Q16 60 20 74" fill="none" stroke={MYTH.soul} strokeWidth={3} opacity={0.6} />
      <path d="M30 10 Q52 10 52 34 Q52 44 44 48 L44 56 L16 56 L16 48 Q8 44 8 34 Q8 10 30 10 Z" fill={MYTH.bone} stroke={INK} strokeWidth={2.5} />
      <ellipse cx={21} cy={34} rx={6} ry={7} fill={INK} />
      <ellipse cx={39} cy={34} rx={6} ry={7} fill={INK} />
      <circle cx={21} cy={35} r={2} fill={MYTH.soul} />
      <circle cx={39} cy={35} r={2} fill={MYTH.soul} />
      <path d="M22 50 L22 56 M30 50 L30 56 M38 50 L38 56" stroke={INK} strokeWidth={2} />
    </>
  )
}

function WingedFury() {
  return (
    <>
      <path d="M26 30 Q6 14 2 36 Q10 32 14 40 Q18 34 24 40 Z M34 30 Q54 14 58 36 Q50 32 46 40 Q42 34 36 40 Z" fill={MYTH.crimson} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M30 18 Q40 20 38 44 L42 84 L30 74 L18 84 L22 44 Q20 20 30 18 Z" fill={MYTH.terracottaDeep} stroke={INK} strokeWidth={2.5} />
      <path d="M24 12 Q30 4 36 12 L36 22 L24 22 Z" fill={MYTH.inkSoft} stroke={INK} strokeWidth={2} />
      <path d="M26 26 L29 28 M34 26 L31 28" stroke={MYTH.fireCore} strokeWidth={2.4} strokeLinecap="round" />
    </>
  )
}

// The foe each chamber holds, in turn down the list.
const FOES = [Wraith, FloatingSkull, WingedFury]

function Foe({ index }: { index: number }) {
  const Drawing = FOES[index % FOES.length]
  return (
    <svg viewBox="0 0 60 90" className={`absolute bottom-3 right-[14%] h-28 w-20 ${u.shade}`} aria-hidden="true">
      <Drawing />
    </svg>
  )
}

const DOOR_LEAVES = { left: u.doorLeft, right: u.doorRight }

function ChamberScene({ index, on }: { index: number; on: boolean }) {
  const { myth } = useLabels()

  return (
    <div className={`relative h-44 overflow-hidden ${u.chamberScene}`} aria-hidden="true">
      {/* the doorway: gold light behind the bronze doors, the laurel over it */}
      <BronzeDoors
        className="absolute bottom-0 left-1/2 h-32 w-28 -translate-x-1/2 border-2 bg-[radial-gradient(ellipse_at_50%_70%,var(--myth-gold-pale),var(--myth-gold)_40%,var(--myth-gold-deep))]"
        leaves={DOOR_LEAVES}
      />
      <span className={`absolute left-1/2 top-2 flex -translate-x-1/2 gap-6 text-[var(--myth-gold)] ${u.laurel}`}>
        <Laurel />
        <Laurel flip />
      </span>
      <span className={`absolute left-3 top-2 text-sm text-[var(--myth-gold-pale)] ${u.display}`}>{fillLabel(myth.chamberOf, { number: index + 1 })}</span>
      <Foe index={index} />
      <div className={`absolute bottom-0 left-[6%] h-36 w-28 ${u.dasher}`}>
        <SpartanSprite profession="engineer" motion={on ? 'action' : 'still'} className="h-full w-full" />
      </div>
      <p className={`absolute left-1/2 top-1/3 -translate-x-1/2 whitespace-nowrap ${u.stamp}`}>
        <span className={`block border-2 border-[var(--myth-ink)] bg-[var(--myth-blood)] px-3 py-1 text-base text-[var(--myth-bone)] ${u.display}`}>{myth.chamberCleared}</span>
      </p>
    </div>
  )
}

// A company written as two names joined by a slash may wrap after the slash, so the carved capitals of a
// long pair fit a narrow chamber without breaking inside a name.
const withSlashBreaks = (text: string) =>
  text.split('/').map((part, index) => (
    <Fragment key={index}>
      {index > 0 && (
        <>
          /<wbr />
        </>
      )}
      {part}
    </Fragment>
  ))

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
        <h3 className={`text-xl leading-tight text-[var(--myth-gold)] ${u.display}`}>{withSlashBreaks(job.company)}</h3>
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
  const { reduced } = useZoneStageContext()
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
