import type { ReactNode } from 'react'
import type { Job } from '@/lib/cv/content'
import { useProfession } from '@/contexts/ProfessionContext'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { DogSprite } from './dog'
import { DwellerSprite } from './dweller'
import { BAKELITE, PHOSPHOR, POSTER_INK, SHELTER_YELLOW } from './palette'
import j from './journey.module.css'

// Two moments the characters play on the content, each once when its stage turns on (data-on on the
// stage, journey.module.css):
// - Fetch (about): the dog runs in from the left with a holotape in its mouth, stops and drops it; the
//   panel above powers on from the tape like the wrist computer's tube.
// - Level up (experience): a poster card stamps down over a slowly turning sunburst, him giving the
//   thumbs up, with his current role as the rank he reached.

export function Fetch({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className={`relative ${j.fetchPanel}`}>{children}</div>
      <div className="pointer-events-none relative mt-2 flex h-14 items-end gap-1" aria-hidden="true">
        <span className={`relative inline-block ${j.fetchDog}`}>
          <DogSprite motion="run" className="h-14 w-20" />
          <svg viewBox="0 0 24 16" className={`absolute -right-1 top-6 h-4 w-6 ${j.fetchTape}`} focusable="false">
            <rect x="1" y="1" width="22" height="14" rx="2" fill={BAKELITE} stroke={POSTER_INK} strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill={PHOSPHOR} />
            <circle cx="16" cy="8" r="3" fill={PHOSPHOR} />
          </svg>
        </span>
      </div>
    </div>
  )
}

export function LevelUp({ job }: { job: Job }) {
  const { active } = useProfession()

  return (
    <div className={`relative mx-auto mb-8 flex max-w-md items-center gap-4 overflow-hidden border-4 border-atomic-poster-ink bg-atomic-cream p-4 ${j.levelUp}`}>
      <svg viewBox="-50 -50 100 100" className={`pointer-events-none absolute -left-10 -top-10 h-56 w-56 opacity-30 ${j.sunburst}`} aria-hidden="true" focusable="false">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M0 0 L-6 -50 L6 -50 Z" fill={SHELTER_YELLOW} transform={`rotate(${i * 30})`} />
        ))}
      </svg>
      <DwellerSprite profession={active} motion="thumbsUp" className="relative h-24 w-16 shrink-0" />
      <p className="relative min-w-0 text-base font-bold uppercase leading-snug tracking-wider text-atomic-poster-ink">
        <span className="block break-words"><SlashBreaks text={job.title} /></span>
        <span className="block text-sm font-semibold normal-case tracking-normal"><SlashBreaks text={job.company} /></span>
      </p>
    </div>
  )
}
