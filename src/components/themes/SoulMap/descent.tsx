'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { jobYears } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useScrollScene } from '@/hooks/useScrollScene'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Job } from '@/lib/cv/content'
import { Knight } from './knight'
import { CARD_BODY, CARD_META, CARD_TITLE, TAG } from './menu'
import { CARVED, SOUL } from './palette'
import ashen from './ashen.module.css'
import souls from './souls.module.css'

// Work experience is the ride down the game's lift shafts, the way its one interconnected world folds
// back on itself: a stone shaft runs beside the jobs and the lift carries him down it as the visitor
// scrolls (--scene-progress from the shared scroll engine moves the car, transform only, eased so the car
// carries its weight; once at the bottom it stays there). Each job arrives the way a new area does: its
// company's name surfaces slowly in wide capitals between two rules, then the card under it, neighbours
// one after another. The jobs sit in masonry, newest first.

// How far the visitor scrolls for the full ride: from the section's top at the bottom of the screen to a
// screen and a half past the top of it.
const RIDE = { start: 1, end: -1.5 }

function LiftShaft() {
  return (
    <div className={`relative hidden h-full w-24 lg:block ${souls.shaft}`} aria-hidden="true">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-[18px] bg-[color:var(--soul-stone-light)] opacity-60" />
      <div className="absolute inset-y-0 left-1/2 w-px translate-x-[18px] bg-[color:var(--soul-stone-light)] opacity-60" />
      <div className={`absolute inset-x-0 top-0 h-[calc(100%-8rem)] ${souls.liftRide}`}>
        <div className="absolute left-1/2 top-0 h-32 w-20 -translate-x-1/2">
          <Knight gear="engineer" pose="idle" className="absolute bottom-[14px] left-1/2 h-24 w-[3.75rem] -translate-x-1/2" />
          <svg viewBox="0 0 80 20" className="absolute bottom-0 left-0 h-5 w-20 overflow-visible" focusable="false">
            <rect x={0} y={4} width={80} height={9} fill={SOUL.leather} />
            <path d="M0 8 H80" stroke={SOUL.leatherDark} strokeWidth={1} />
            <rect x={0} y={13} width={80} height={4} fill={SOUL.steelDark} />
            <path d="M4 4 L22 -200 M76 4 L58 -200" stroke={SOUL.steelDark} strokeWidth={1.5} />
          </svg>
        </div>
      </div>
    </div>
  )
}

function JobStop({ job }: { job: Job }) {
  const { years } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.2 })
  const { start, end } = jobYears(job, years.present)

  return (
    <article ref={ref} className={`${souls.stop} ${triggered ? souls.stopOn : ''}`}>
      <div className={`${souls.areaName} mb-3 flex items-center gap-3`}>
        <span className="h-px flex-1 bg-[color:var(--soul-glow-deep)]" aria-hidden="true" />
        <p className={`${CARVED} min-w-0 text-center text-base uppercase tracking-[0.28em] text-[color:var(--soul-text)]`}>
          <SlashBreaks text={job.company} />
        </p>
        <span className="h-px flex-1 bg-[color:var(--soul-glow-deep)]" aria-hidden="true" />
      </div>
      <div className={`${souls.stopCard} ${ashen.panel} p-5`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={CARD_TITLE}>{job.title}</h3>
          <span className={`whitespace-nowrap ${CARD_META}`}>
            {start} - {end}
          </span>
        </div>
        {job.description && <p className={`mt-3 ${CARD_BODY}`}>{job.description}</p>}
        {job.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {job.highlights.map((highlight) => (
              <li key={highlight} className={`flex gap-2 ${CARD_BODY}`}>
                <span className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-[color:var(--soul-ember)]" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        )}
        {job.skills.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 5).map((skill) => (
              <li key={skill} className={TAG}>
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export function LiftDescent({ jobs }: { jobs: Job[] }) {
  const { ref } = useScrollScene<HTMLDivElement>(RIDE)
  const { souls: words } = useLabels()

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-[6rem_minmax(0,1fr)]">
      <LiftShaft />
      <div>
        <p className="mb-6 hidden text-sm italic text-[color:var(--soul-text-soft)] lg:block">{words.liftHint}</p>
        <ul className={MASONRY_LIST}>
          {jobs.map((job) => (
            <li key={job.id} className={MASONRY_ITEM}>
              <JobStop job={job} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
