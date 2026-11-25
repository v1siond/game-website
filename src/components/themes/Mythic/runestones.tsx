'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { cssVars } from '@/lib/cssVars'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { MartialArts } from '@/lib/cv/content'
import u from './underworld.module.css'

// Muay Thai on the frozen shore: the record carved on a runestone of facts, his achievements as the
// deeds cut on the stone beside it, each marked with its frost rune in turn when the stage first shows. His
// duel plays on the section's stage behind them (scenes.tsx).

export function Runestones({ martialArts }: { martialArts: MartialArts }) {
  const { myth } = useLabels()

  return (
    <div className="grid gap-8">
      <div className="min-w-0">
        <h3 className={`mb-4 text-xl text-[var(--myth-frost)] ${u.display}`}>{martialArts.primary.title}</h3>
        <div className="grid gap-6" data-stage-items="">
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: `grid gap-3 p-5 sm:grid-cols-2 ${u.parchment}`,
              fact: 'min-w-0',
              term: `text-sm text-[var(--myth-ink-soft)] ${u.display}`,
              value: 'text-base',
              achievements: `space-y-3 p-5 ${u.panel}`,
              achievement: 'flex items-start justify-between gap-4 border-b border-[var(--myth-iron)] pb-3 last:border-b-0 last:pb-0',
            }}
            renderAchievement={(achievement, index) => (
              <>
                <span className="text-base">{achievement}</span>
                <span className={`shrink-0 border-2 border-[var(--myth-ink)] bg-[var(--myth-blood)] px-2 py-0.5 text-sm text-[var(--myth-bone)] ${u.display} ${u.fulfilled}`} style={cssVars({ '--i': index })}>
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
