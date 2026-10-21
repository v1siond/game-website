import type { CSSProperties } from 'react'
import type { Job } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { fillLabel } from '@/lib/cv/labels'
import { jobYears } from '@/components/cv/sectionText'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import atomic from './atomic.module.css'

// Experience as the terminal's quest log: each job an entry with its state box (the current one a
// blinking diamond and "Active", an ended one a ticked box and "Completed"), the title, the company and
// the years, its achievements as the objective rows. The cards sit in masonry; when the section's
// trigger fires (data-on on the section, sections.tsx) each card powers on like the tube, a bright line
// opening to the full card, staggered by --i. Under the pointer an objective row inverts the way the
// wrist terminal marks its pick, the phosphor bar filling in from the left.

function QuestState({ current }: { current: boolean }) {
  const { navigation, hud } = useLabels()

  return (
    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-atomic-phosphor-dim">
      <span className={current ? atomic.questActive : atomic.questDone} aria-hidden="true" />
      {current ? navigation.active : hud.completed}
    </p>
  )
}

function QuestCard({ job, index }: { job: Job; index: number }) {
  const { years, cards } = useLabels()
  const { start, end } = jobYears(job, years.present)

  return (
    <article className={`relative p-5 ${atomic.panel} ${atomic.cardOn}`} style={{ '--i': index } as CSSProperties}>
      <QuestState current={job.current} />
      <h3 className="mt-3 text-lg font-bold uppercase tracking-wide text-atomic-phosphor">{job.title}</h3>
      <p className="mt-1 text-base text-atomic-yellow">{job.company}</p>
      <p className="mt-1 text-sm text-atomic-phosphor-dim">{fillLabel(years.range, { start, end })}</p>

      {job.description && <p className="mt-3 text-sm leading-relaxed text-atomic-ash">{job.description}</p>}

      {job.highlights.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-atomic-phosphor/30 pt-3" aria-label={cards.keyAchievements}>
          {job.highlights.map((highlight) => (
            <li key={highlight} className={`relative flex gap-2 px-2 py-1 text-sm text-atomic-phosphor ${atomic.pickRow}`}>
              <span className="relative" aria-hidden="true">
                +
              </span>
              <span className="relative">{highlight}</span>
            </li>
          ))}
        </ul>
      )}

      {job.skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={cards.skillsUsed}>
          {job.skills.map((skill) => (
            <li key={skill} className="border border-atomic-phosphor/40 px-2 py-0.5 text-sm text-atomic-phosphor-dim">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function QuestLog({ jobs }: { jobs: Job[] }) {
  return (
    <ul className={MASONRY_LIST}>
      {jobs.map((job, index) => (
        <li key={job.id} className={MASONRY_ITEM}>
          <QuestCard job={job} index={index} />
        </li>
      ))}
    </ul>
  )
}
