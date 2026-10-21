'use client'

import { useState, type CSSProperties } from 'react'
import type { Job } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { jobYears } from '@/components/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { CARD_BUTTON } from './actions'
import { Mark, STAMP } from './cards'
import horror from './horror.module.css'
import look from './world.module.css'

// Work Experience as the house's map and the files found in it. Every job is a room on the map, red while
// its file is unread; Read file opens the file (its key achievements) and turns its room blue, the way the
// genre's map marks a room searched, with the count beside the bar and Search complete once every room is
// blue. Pointing at a file, or tabbing to it, marks its room on the map with the you are here arrow. The
// files land on the desk one after another when the section comes into view (once).
//
// Animated: the files' arrival (once), the arrow, a room's fill when searched.

function useSearch() {
  const [read, setRead] = useState<ReadonlySet<string>>(new Set())
  const toggle = (id: string) =>
    setRead((current) => {
      const next = new Set(current)
      next.add(id)
      return next
    })
  return { read, search: toggle }
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 shrink-0" aria-hidden="true" focusable="false">
      <path d="M2 6.5 L5 9.5 L10 2.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}

function Unsearched() {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-current" aria-hidden="true" />
}

function MapRoom({ job, searched, here }: { job: Job; searched: boolean; here: boolean }) {
  return (
    <li
      className={`relative flex min-h-[56px] min-w-[8rem] flex-1 items-center gap-2 border-2 border-[color:var(--sh-void)] px-3 py-2 text-sm text-[color:var(--sh-ivory)] ${horror.mapRoom} ${searched ? horror.mapRoomSearched : ''}`}
    >
      {searched ? <Check /> : <Unsearched />}
      <span className="min-w-0">{job.company}</span>
      {here && (
        <svg viewBox="0 0 12 12" className={`absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 ${horror.youAreHere}`} aria-hidden="true" focusable="false">
          <path d="M6 12 L0 2 H12 Z" fill="var(--sh-flame)" />
        </svg>
      )}
    </li>
  )
}

function HouseMap({ jobs, read, here }: { jobs: Job[]; read: ReadonlySet<string>; here: string | null }) {
  const { horror: words } = useLabels()
  const searched = jobs.filter((job) => read.has(job.id)).length
  const done = searched === jobs.length

  return (
    <div className="mb-8 border-2 border-[color:var(--sh-sepia)] bg-[color:var(--sh-map-floor)] p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <p className={`text-sm uppercase tracking-[0.2em] text-[color:var(--sh-brass)] ${look.typed}`}>{words.map}</p>
        <p className={`text-sm text-[color:var(--sh-cream)] ${look.typed}`} role="status">
          {done ? words.searchComplete : fillLabel(words.roomsSearched, { count: searched, total: jobs.length })}
        </p>
      </div>
      <ul className="flex flex-wrap gap-1 pt-2" aria-label={words.map}>
        {jobs.map((job) => (
          <MapRoom key={job.id} job={job} searched={read.has(job.id)} here={here === job.id} />
        ))}
      </ul>
      <div className="mt-3 h-2 overflow-hidden bg-[color:var(--sh-void)]" aria-hidden="true">
        <div className={`h-full origin-left bg-[color:var(--sh-room-searched)] ${horror.searchBar}`} style={{ '--searched': searched / Math.max(jobs.length, 1) } as CSSProperties} />
      </div>
      <p className="mt-3 text-sm italic text-[color:var(--sh-fog)]">{words.fileHint}</p>
    </div>
  )
}

function JobFile({ job, isRead, onRead, onPoint }: { job: Job; isRead: boolean; onRead: () => void; onPoint: () => void }) {
  const { cards, years, actions } = useLabels()
  const { start, end } = jobYears(job, years.present)
  const bodyId = `survival-horror-job-${job.id}`

  return (
    <article className={`relative p-4 ${look.file} ${horror.fileSheet}`} onPointerEnter={onPoint} onFocus={onPoint}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base text-[color:var(--sh-ivory)]">{job.title}</h3>
          <p className="text-sm text-[color:var(--sh-brass)]">{job.company}</p>
        </div>
        <span className={STAMP}>
          {start} - {end}
        </span>
      </div>
      {job.description && <p className="mb-3 text-sm leading-relaxed text-[color:var(--sh-fog)]">{job.description}</p>}
      {job.highlights.length > 0 && (
        <>
          <button
            type="button"
            onClick={onRead}
            aria-expanded={isRead}
            aria-controls={bodyId}
            className={`${CARD_BUTTON} border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame)] hover:border-[color:var(--sh-flame)]`}
          >
            {actions.readFile}
          </button>
          {isRead && (
            <ul id={bodyId} className={`mt-3 space-y-1 border-t border-[color:var(--sh-wood)] pt-3 ${horror.fileOpen}`} aria-label={cards.keyAchievements}>
              {job.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-[color:var(--sh-cream)]">
                  <Mark />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </article>
  )
}

export function MapFiles({ jobs }: { jobs: Job[] }) {
  const { read, search } = useSearch()
  const [here, setHere] = useState<string | null>(null)
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })

  // A job with no achievements has nothing more to read: its room counts as searched once it is seen.
  const searched = new Set([...read, ...(triggered ? jobs.filter((job) => job.highlights.length === 0).map((job) => job.id) : [])])

  return (
    <div ref={ref}>
      <HouseMap jobs={jobs} read={searched} here={here} />
      <ul className={MASONRY_LIST}>
        {jobs.map((job, index) => (
          <li key={job.id} className={`${MASONRY_ITEM} ${horror.fileDrop} ${triggered ? horror.fileDropped : ''}`} style={{ '--i': index } as CSSProperties}>
            <JobFile job={job} isRead={read.has(job.id)} onRead={() => search(job.id)} onPoint={() => setHere(job.id)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
