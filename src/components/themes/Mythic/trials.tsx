'use client'

import { memo } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { TagList } from '@/components/cv/TagList'
import { jobCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM } from '@/lib/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import type { Job } from '@/lib/cv/content'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { BLOOD_POINTS, IRON_TAGS } from './stage'
import u from './underworld.module.css'

// Work Experience as his trials in the desert: each job a card on the dark panel, its company in gold over its
// role, years, place, line, highlights and skills. He calls the chained Titan on the section's stage beside
// them (scenes.tsx).

// Memoised: the list re-renders with the section, and a card only draws again when its job changes.
const TrialCard = memo(function TrialCard({ job }: { job: Job }) {
  const { years, cards } = useLabels()
  const card = jobCard(job, years)

  return (
    <article className={`relative p-5 ${u.panel} ${u.trial}`}>
      <h3 className={`text-xl leading-tight text-[var(--myth-gold)] ${u.display}`}><SlashBreaks text={card.company} /></h3>
      <p className="mt-1 text-base font-bold">{card.title}</p>
      <p className="text-sm text-[var(--myth-bone-shade)]">
        {card.years}
        {card.location && ` · ${card.location}`}
      </p>
      <p className="mt-3 text-base leading-relaxed">{card.description}</p>
      <MarkedLines items={card.highlights} label={cards.keyAchievements} look={BLOOD_POINTS} />
      <TagList items={card.skills} label={cards.skillsUsed} look={{ ...IRON_TAGS, list: 'mt-4 flex flex-wrap gap-2' }} />
    </article>
  )
})

export function Trials({ jobs }: { jobs: Job[] }) {
  return (
    <ul className="columns-1 gap-6 xl:columns-2" data-stage-items="">
      {jobs.map((job) => (
        <li key={job.id} className={MASONRY_ITEM}>
          <TrialCard job={job} />
        </li>
      ))}
    </ul>
  )
}
