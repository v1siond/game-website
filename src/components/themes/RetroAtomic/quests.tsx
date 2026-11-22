import type { Job } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { jobCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { TagList } from '@/components/cv/TagList'
import { ATOMIC_CHIPS, PLUS_ROWS } from './controls'
import atomic from './atomic.module.css'

// Experience as the terminal's quest log: each job an entry with its state box (the current one a
// blinking diamond and "Active", an ended one a ticked box and "Completed"), the title, the company and
// the years, its achievements as the objective rows. The cards sit in masonry; on the stage he runs a
// quest flag up per card as the page reaches it (scenes.tsx). Under the pointer an objective row inverts
// the way the wrist terminal marks its pick, the phosphor bar filling in from the left.

function QuestState({ current }: { current: boolean }) {
  const { navigation, hud } = useLabels()

  return (
    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-atomic-phosphor-dim-text">
      <span className={current ? atomic.questActive : atomic.questDone} aria-hidden="true" />
      {current ? navigation.active : hud.completed}
    </p>
  )
}

function QuestCard({ job: entry }: { job: Job }) {
  const { years, cards } = useLabels()
  const job = jobCard(entry, years)

  return (
    <article className={`relative p-5 ${atomic.panel}`}>
      <QuestState current={entry.current} />
      <h3 className="mt-3 text-lg font-bold uppercase tracking-wide text-atomic-phosphor">{job.title}</h3>
      <p className="mt-1 text-base text-atomic-yellow">
        <SlashBreaks text={job.company} />
      </p>
      <p className="mt-1 text-sm text-atomic-phosphor-dim-text">{job.years}</p>
      {job.location && <p className="mt-1 text-sm text-atomic-ash">{job.location}</p>}

      {job.description && <p className="mt-3 text-sm leading-relaxed text-atomic-ash">{job.description}</p>}

      <MarkedLines items={job.highlights} label={cards.keyAchievements} look={PLUS_ROWS} />

      <TagList items={job.skills} label={cards.skillsUsed} look={{ ...ATOMIC_CHIPS, list: 'mt-4 flex flex-wrap gap-2' }} />
    </article>
  )
}

export function QuestLog({ jobs }: { jobs: Job[] }) {
  return (
    <ul className={MASONRY_LIST}>
      {jobs.map((job) => (
        <li key={job.id} className={MASONRY_ITEM}>
          <QuestCard job={job} />
        </li>
      ))}
    </ul>
  )
}
