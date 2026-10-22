'use client'

import { useEffect, useState } from 'react'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { MartialArts } from '@/lib/cv/content'
import { SurvivorSprite, type DecoMotion } from './sprite'
import stage from './stage.module.css'

// The Muay Thai record on the city's theatre stage. When the stage comes into view the maroon curtains
// part, the spotlight drops on him in his gold shorts, and the programme beside the stage lights its
// achievements one by one, each on a knee then round kick he throws under the light. The facts sit on
// the programme's head. Pointing at him (or a tap) makes him throw it again.
//
// Pattern: the shared usePoseSequence plays the strike on every new line; the next line lights when the
// strike ends (the sprite's animationend), so nothing here is timed but the curtain, which is CSS off
// data-on. Reduced motion: curtains open, every line lit, he stands in his guard.

export function TheatreStage({ martialArts }: { martialArts: MartialArts }) {
  const achievements = martialArts.primary.achievements
  const reduced = useReducedMotion()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.25 })
  const [lit, setLit] = useState(0)
  const { pose, play, advance } = usePoseSequence<DecoMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })
  const shown = reduced ? achievements.length : lit

  useEffect(() => {
    if (!triggered || reduced || lit >= achievements.length) return
    play('strike')
  }, [triggered, reduced, lit, achievements.length, play])

  const struck = () => {
    advance()
    setLit((n) => Math.min(n + 1, achievements.length))
  }

  return (
    <div ref={ref} data-on={triggered || undefined} className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className={`relative mx-auto h-64 w-full max-w-xs overflow-hidden sm:h-72 ${stage.box}`} aria-hidden="true">
        <span className={`absolute inset-x-0 top-0 h-full ${stage.light}`} />
        <div className="absolute bottom-3 left-1/2 h-44 w-28 -translate-x-1/2 sm:h-52 sm:w-32" onPointerEnter={() => play('strike')} onPointerDown={() => play('strike')}>
          <SurvivorSprite profession="fighter" motion={pose} onDone={lit < achievements.length ? struck : advance} className="h-full w-full" />
        </div>
        <span className={`absolute inset-y-0 left-0 w-1/2 ${stage.curtain} ${stage.curtainLeft}`} />
        <span className={`absolute inset-y-0 right-0 w-1/2 ${stage.curtain} ${stage.curtainRight}`} />
        <span className={`absolute inset-x-0 top-0 h-6 ${stage.valance}`} />
      </div>

      <div className={`p-5 sm:p-6 ${stage.programme}`}>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-6 grid gap-3 sm:grid-cols-2',
            fact: `px-4 py-3 ${stage.fact}`,
            term: `text-sm uppercase tracking-[0.2em] ${stage.term}`,
            value: 'mt-1 text-base text-[color:var(--deco-cream)]',
            achievements: 'space-y-3',
            achievement: '',
          }}
          renderAchievement={(achievement) => (
            <p data-lit={achievements.indexOf(achievement) < shown || undefined} className={`relative px-4 py-3 text-base ${stage.line}`}>
              <span className={`pointer-events-none absolute inset-0 ${stage.lineGlow}`} aria-hidden="true" />
              <span className="relative">{achievement}</span>
            </p>
          )}
        />
      </div>
    </div>
  )
}
