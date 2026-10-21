'use client'

import { useState, type PointerEvent } from 'react'
import type { Job } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useScrollScene } from '@/hooks/useScrollScene'
import { HeroCharacter } from './character'
import { ExperienceCard } from './cards'
import shade from './shade.module.css'

// His jobs down one long rope into a chasm, the rope swing of the silhouette forest: a single rope runs
// from the cliff edge down the whole section and each job hangs from a knot on it, on alternating sides
// from a tablet up (on a phone the rope runs down the left edge and every job hangs to its right). He
// slides down the rope hand over hand as the visitor scrolls, and stands on the last knot when the
// section has scrolled by. A card the visitor touches swings away from the side the pointer came in,
// then settles. Reduced motion and the World Select preview start with him at the bottom.
//
// Animated: him (moved by --scene-progress) and his parts, the one card being swung.

type Swing = 'left' | 'right'

const SWING: Record<Swing, string> = {
  left: shade.swingLeft,
  right: shade.swingRight,
}

// The pointer came in from the left half: the card swings away, to the right.
const swingAway = (event: PointerEvent<HTMLElement>): Swing => {
  const box = event.currentTarget.getBoundingClientRect()
  return event.clientX < box.left + box.width / 2 ? 'right' : 'left'
}

// The rope's x: 1rem in on a phone, the middle from a tablet up.
const ROPE_X = 'left-4 md:left-1/2'

// Where each job hangs. On a phone every job hangs right of the rope; from a tablet up even jobs hang
// left of it and odd ones right, each a half column wide, its tie and knot on the rope side.
interface Hang {
  item: string
  tie: string
  knot: string
}

const HANG: readonly [Hang, Hang] = [
  {
    item: 'md:mr-[calc(50%+1.5rem)]',
    tie: 'md:left-auto md:-right-6',
    knot: 'md:left-auto md:-right-6 md:translate-x-1/2',
  },
  { item: 'md:ml-[calc(50%+1.5rem)]', tie: 'md:-left-6', knot: 'md:-left-6' },
]

function KnottedJob({ job, index }: { job: Job; index: number }) {
  const [swing, setSwing] = useState<Swing | null>(null)
  const hang = HANG[index % 2]

  return (
    <li className={`relative pl-10 md:pl-0 ${hang.item}`}>
      <span className={`pointer-events-none absolute left-4 top-6 h-px w-6 bg-[color:var(--sh-dim)] ${hang.tie}`} aria-hidden="true" />
      <span className={`pointer-events-none absolute left-4 top-[1.3rem] h-2 w-2 -translate-x-1/2 rounded-full bg-[color:var(--sh-dim)] ${hang.knot}`} aria-hidden="true" />
      <div
        className={`relative ${shade.knotHang} ${swing ? SWING[swing] : ''}`}
        onPointerEnter={(event) => setSwing((current) => current ?? swingAway(event))}
        onAnimationEnd={() => setSwing(null)}
      >
        <ExperienceCard entry={job} />
      </div>
    </li>
  )
}

export function HangingJobs({ jobs }: { jobs: Job[] }) {
  const { shade: words } = useLabels()
  const { ref, phase } = useScrollScene<HTMLDivElement>({
    start: 0.7,
    end: -1.6,
  })

  return (
    <div ref={ref} className="relative">
      <p className="mb-6 text-center text-sm italic tracking-wider text-[color:var(--sh-muted)]">{words.swingHint}</p>
      <div className="relative pb-16">
        <div className="pointer-events-none absolute inset-x-0 -top-2 h-3 border-t-4 border-[color:var(--sh-black)]" aria-hidden="true" />
        <span className={`pointer-events-none absolute -top-2 bottom-0 w-px -translate-x-1/2 bg-[color:var(--sh-dim)] ${ROPE_X}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute -top-2 bottom-16 w-8 -translate-x-1/2 ${ROPE_X}`} aria-hidden="true">
          <div className={`h-full ${shade.slide}`}>
            <HeroCharacter profession="engineer" pose={phase === 'done' ? 'idle' : 'hang'} className="block h-12 w-8" />
          </div>
        </div>
        <ol className="relative space-y-8">
          {jobs.map((job, index) => (
            <KnottedJob key={job.id} job={job} index={index} />
          ))}
        </ol>
      </div>
    </div>
  )
}
