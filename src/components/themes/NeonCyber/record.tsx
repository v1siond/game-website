'use client'

import type { CSSProperties } from 'react'
import type { MartialArts } from '@/lib/cv/content'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { HudPanel } from './hud'
import { Scannable } from './scanner'
import world from './world.module.css'

// The Muay Thai record as the scanner's data tab on a target: the facts in a grid of readouts under
// the tab, and the achievements arriving the way job updates do, gold toasts sliding in from the right
// one after another when the section comes into view (once). Pointing at a toast lights it again.

export function FightRecord({ martialArts }: { martialArts: MartialArts }) {
  const { cyber, sections } = useLabels()
  const { ref, triggered } = useSectionTrigger()
  const { achievements } = martialArts.primary

  return (
    <div ref={ref}>
      <HudPanel title={sections.muayThai}>
        <p className="mb-4 text-base text-[color:var(--neon-hud)]">{martialArts.primary.title}</p>
        <Scannable kind="record" title={sections.muayThai} fact={martialArts.primary.rank}>
          <p className="inline-block bg-[color:var(--neon-data)] px-3 py-1 text-sm uppercase tracking-[0.2em] text-[color:var(--neon-ink)]" aria-hidden="true">
            {cyber.dataTab}
          </p>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: 'grid gap-3 border border-[color-mix(in_srgb,var(--neon-data)_45%,transparent)] bg-[color:var(--neon-ink)] p-4 sm:grid-cols-2',
                fact: 'border-l-2 border-[color:var(--neon-data)] pl-3',
                term: 'text-sm uppercase tracking-wider text-[color:var(--neon-data)]',
                value: 'mt-1 text-sm text-[color:var(--neon-ice)]',
                achievements: `space-y-3 ${triggered ? world.toasting : world.waiting}`,
              }}
              renderAchievement={(achievement) => (
                <span
                  className={`${world.toast} ${world.cut} flex items-start gap-3 border border-[color-mix(in_srgb,var(--neon-gold)_45%,transparent)] bg-[color:var(--neon-glass)] p-3 hover:border-[color:var(--neon-gold)]`}
                  style={{ '--i': achievements.indexOf(achievement) } as CSSProperties}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[color:var(--neon-gold)] text-sm text-[color:var(--neon-ink)]" aria-hidden="true">
                    !
                  </span>
                  <span className="text-sm text-[color:var(--neon-gold)]">{achievement}</span>
                </span>
              )}
            />
          </div>
        </Scannable>
      </HudPanel>
    </div>
  )
}
