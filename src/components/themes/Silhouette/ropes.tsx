'use client'

import { useState, type CSSProperties, type PointerEvent } from 'react'
import type { Job } from '@/lib/cv/content'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { ExperienceCard } from './cards'
import shade from './shade.module.css'

// His jobs hang on ropes in the dark, the hanging crates and bodies of a silhouette forest: when the
// section comes into view they drop in one after the other and bounce on their ropes (once), and a
// card the visitor touches swings away from the side the pointer came in, then settles. The ropes run
// up through the masonry gaps (MASONRY_ITEM's 1.5rem) from the card's top edge.
//
// Animated: one drop per job (once), the one card being swung.

type Swing = 'left' | 'right'

const SWING: Record<Swing, string> = {
  left: shade.swingLeft,
  right: shade.swingRight,
}

const ROPE = 'pointer-events-none absolute -top-6 h-6 w-px bg-[color:var(--sh-dim)]'

// The pointer came in from the left half: the card swings away, to the right.
const swingAway = (event: PointerEvent<HTMLElement>): Swing => {
  const box = event.currentTarget.getBoundingClientRect()
  return event.clientX < box.left + box.width / 2 ? 'right' : 'left'
}

function HangingJob({ job, index, dropped }: { job: Job; index: number; dropped: boolean }) {
  const [swing, setSwing] = useState<Swing | null>(null)

  return (
    <li className={`${MASONRY_ITEM} pt-6 ${shade.drop} ${dropped ? shade.dropped : ''}`} style={{ '--i': index } as CSSProperties}>
      <div
        className={`relative ${shade.hang} ${swing ? SWING[swing] : ''}`}
        onPointerEnter={(event) => setSwing((current) => current ?? swingAway(event))}
        onAnimationEnd={() => setSwing(null)}
      >
        <span className={`${ROPE} left-[22%]`} aria-hidden="true" />
        <span className={`${ROPE} right-[22%]`} aria-hidden="true" />
        <ExperienceCard entry={job} />
      </div>
    </li>
  )
}

export function HangingJobs({ jobs }: { jobs: Job[] }) {
  const { shade: words } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.1 })

  return (
    <>
      <p className="mb-2 text-center text-sm italic tracking-wider text-[color:var(--sh-muted)]">{words.swingHint}</p>
      <ul ref={ref} className={`${MASONRY_LIST} border-t-2 border-[color:var(--sh-dim)]`}>
        {jobs.map((job, index) => (
          <HangingJob key={job.id} job={job} index={index} dropped={triggered} />
        ))}
      </ul>
    </>
  )
}
