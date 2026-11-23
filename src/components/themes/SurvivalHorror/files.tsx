'use client'

import { useState } from 'react'
import type { Job } from '@/lib/cv/content'
import { MASONRY_ITEM } from '@/lib/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { jobCard } from '@/lib/cv/cvView'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { TagList } from '@/components/cv/TagList'
import { CARD_BUTTON } from './actions'
import { COLUMN_LIST, MARK_LIST, PINNED_TAGS, STAMP } from './cards'
import look from './world.module.css'

// Work Experience as the files he finds in the cabinet behind the page (./scenes), one per job: every field
// of the job's card, the years in the stamp ("2019 to 2022"). The key achievements are always in the page,
// hidden until Read file, so the server HTML carries them.

function JobFile({ job: entry }: { job: Job }) {
  const { cards, years, actions } = useLabels()
  const [open, setOpen] = useState(false)
  const job = jobCard(entry, years)
  const bodyId = `survival-horror-job-${job.id}`

  return (
    <article className={`relative p-4 ${look.file}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base text-[color:var(--sh-ivory)]">{job.title}</h3>
          <p className="text-sm text-[color:var(--sh-brass-text)]">
            <SlashBreaks text={job.company} />
          </p>
          {job.location && <p className="text-sm text-[color:var(--sh-fog-text)]">{job.location}</p>}
        </div>
        <span className={STAMP}>{job.years}</span>
      </div>
      {job.description && <p className="mb-3 text-sm leading-relaxed text-[color:var(--sh-fog-text)]">{job.description}</p>}
      {job.highlights.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setOpen((shown) => !shown)}
            aria-controls={bodyId}
            aria-expanded={open}
            className={`${CARD_BUTTON} border-[color:var(--sh-brass)] bg-[color:var(--sh-shadow)] text-[color:var(--sh-flame-text)] hover:border-[color:var(--sh-flame)]`}
          >
            {actions.readFile}
          </button>
          <div id={bodyId} hidden={!open}>
            <MarkedLines items={job.highlights} label={cards.keyAchievements} look={{ ...MARK_LIST, list: 'mt-3 space-y-1 border-t border-[color:var(--sh-wood)] pt-3' }} />
          </div>
        </>
      )}
      <TagList items={job.skills} label={cards.skillsUsed} look={PINNED_TAGS} />
    </article>
  )
}

export function JobFiles({ jobs }: { jobs: Job[] }) {
  return (
    <div data-stage-items="">
      <ul className={COLUMN_LIST}>
        {jobs.map((job) => (
          <li key={job.id} className={MASONRY_ITEM}>
            <JobFile job={job} />
          </li>
        ))}
      </ul>
    </div>
  )
}
