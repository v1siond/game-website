'use client'

import { useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Labels } from '@/lib/cv/labels'
import type { MartialArts } from '@/lib/cv/content'
import { SpartanSprite, type SpriteMotion } from './sprite'
import { nextStrike, type Strike } from './fates'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { SlabButton } from './buttons'
import u from './underworld.module.css'

// Muay Thai in the arena of the green fields: he stands in his shorts, wraps and mongkhon, and Strike
// throws his next move (knee, elbow, kick, then the rage roar, and round again), the move's name called
// over the arena as it lands. Beside him the record is the stone tablet of facts and his achievements are
// the prophecies on the list, each stamped fulfilled in turn when the stage first shows.

const STRIKE_NAME: Record<Strike, (labels: Labels['myth']) => string> = {
  knee: (myth) => myth.strikeKnee,
  elbow: (myth) => myth.strikeElbow,
  kick: (myth) => myth.strikeKick,
  roar: (myth) => myth.strikeRoar,
}

function Arena() {
  const { myth } = useLabels()
  const { pose, take, play, settle } = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })
  const [last, setLast] = useState<Strike | null>(null)

  const strike = () => {
    const next = nextStrike(last)
    setLast(next)
    play(next)
  }

  return (
    <div className={`relative flex flex-col items-center p-5 ${u.arena}`}>
      <p className="h-10 text-center" role="status">
        {last && (
          <span key={take} className={`inline-block text-2xl text-[var(--myth-gold-pale)] ${u.display} ${u.strikeName}`}>
            {STRIKE_NAME[last](myth)}
          </span>
        )}
      </p>
      <div className="h-64 w-52" aria-hidden="true">
        <SpartanSprite key={take} profession="fighter" motion={pose} onDone={settle} className="h-full w-full" />
      </div>
      <SlabButton tone="blood" className="mt-4" onClick={strike}>
        {myth.strike}
      </SlabButton>
      <p className={`mt-4 ${u.hint}`}>{myth.strikeHint}</p>
    </div>
  )
}

export function Prophecies({ martialArts }: { martialArts: MartialArts }) {
  const { myth } = useLabels()
  const { achievements } = martialArts.primary

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <Arena />
      <div className="min-w-0">
        <h3 className={`mb-4 text-xl text-[var(--myth-gold)] ${u.display}`}>{martialArts.primary.title}</h3>
        <div className="grid gap-6">
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: `grid gap-3 p-5 sm:grid-cols-2 ${u.parchment}`,
              fact: 'min-w-0',
              term: `text-sm text-[var(--myth-ink-soft)] ${u.display}`,
              value: 'text-base',
              achievements: `space-y-3 p-5 ${u.panel}`,
              achievement: 'flex items-start justify-between gap-4 border-b border-[var(--myth-gold-deep)] pb-3 last:border-b-0 last:pb-0',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-base">{achievement}</span>
                <span className={`shrink-0 border-2 border-[var(--myth-ink)] bg-[var(--myth-blood)] px-2 py-0.5 text-sm text-[var(--myth-bone)] ${u.display} ${u.fulfilled}`} style={{ ['--i' as string]: achievements.indexOf(achievement) }}>
                  {myth.fulfilled}
                </span>
              </>
            )}
          />
        </div>
      </div>
    </div>
  )
}
