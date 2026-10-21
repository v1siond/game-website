'use client'

import { useCallback, useEffect, useState } from 'react'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { NameWords } from '@/components/cv/NameWords'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Profession } from '@/lib/cv/professions'
import { SpartanSprite, type SpriteMotion } from './sprite'
import { ContactActions, SlabButton } from './buttons'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import type { Move } from './rig'
import { useHouse } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The hero entrance, the return through the blood pool: in the great hall the pool stirs, he rises out
// of it with the blood running off him, the tattoo and his eyes light and he roars (the hall shakes),
// then his name is struck onto the gilded plate and the headline unrolls under it like a scroll. It
// plays once when the header first shows, and again each time the visitor returns to the house from the
// last gate; a click on the hall, any key or the skip button ends it at once, and under reduced motion
// it is never played. Once he stands, his figure is a button: a click throws the chain combo.
//
// Each phase reached adds its data attribute to the header and the CSS starts that phase's motion off
// it (underworld.module.css, "the rise from the pool"); data-done holds the end state.

type Phase = 'rise' | 'roar' | 'name' | 'title' | 'done'

const TIMELINE: ReadonlyArray<readonly [Phase, number]> = [
  ['rise', 150],
  ['roar', 1450],
  ['name', 2300],
  ['title', 2700],
  ['done', 3300],
]

const ALL_PHASES = new Set<Phase>(TIMELINE.map(([phase]) => phase))

const NO_PHASES: ReadonlySet<Phase> = new Set()

const phaseFlags = (reached: ReadonlySet<Phase>) =>
  Object.fromEntries(TIMELINE.map(([phase]) => [`data-${phase}`, reached.has(phase) || undefined]))

// His pose through the entrance: still while he comes up, the roar, then his idle.
const entranceMotion = (reached: ReadonlySet<Phase>): SpriteMotion => {
  if (reached.has('title')) return 'idle'
  if (reached.has('roar')) return 'roar'
  return 'still'
}

// What a click on him throws, per kit: the blade combo, two drum hits, the kick.
const HERO_MOVE: Record<Profession, Move> = { engineer: 'combo', drummer: 'drum', fighter: 'kick' }

const DRIPS = [
  { x: 40, y: 34 },
  { x: 62, y: 46 },
  { x: 54, y: 58 },
  { x: 36, y: 66 },
]

// The rise timeline: runs when the header first shows and on every return to the house.
function useRise(reduced: boolean) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.05, rootMargin: '0px' })
  const { rebirths } = useHouse()
  const [reached, setReached] = useState<ReadonlySet<Phase>>(NO_PHASES)
  const skip = useCallback(() => setReached(ALL_PHASES), [])
  const done = reduced || reached.has('done')

  useEffect(() => {
    if (!triggered || reduced) return
    setReached(NO_PHASES)
    const timers = TIMELINE.map(([phase, at]) => window.setTimeout(() => setReached((current) => new Set(current).add(phase)), at))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [triggered, reduced, rebirths])

  useEffect(() => {
    if (done || !triggered) return
    window.addEventListener('keydown', skip, { once: true })
    return () => window.removeEventListener('keydown', skip)
  }, [done, triggered, skip])

  return { ref, shown: done ? ALL_PHASES : reached, done, skip }
}

export function PoolRise({ profession, reduced }: { profession: Profession; reduced: boolean }) {
  const { hud, navigation, myth } = useLabels()
  const { ref, shown, done, skip } = useRise(reduced)
  const { pose, take, play, settle } = usePoseSequence<SpriteMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })

  return (
    <header ref={ref} className={`relative z-20 overflow-hidden ${u.hall}`} onClick={done ? undefined : skip} {...phaseFlags(shown)}>
      <div className={`relative mx-auto grid min-h-[92vh] max-w-6xl items-end gap-8 px-4 pb-16 pt-20 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center ${u.shake}`}>
        <div className="relative mx-auto w-56 sm:w-64">
          {/* the pool he rises from: its far lip behind him, the near lip over his legs */}
          <svg viewBox="0 0 200 60" className="absolute -bottom-2 left-1/2 w-[150%] -translate-x-1/2" aria-hidden="true">
            <ellipse cx={100} cy={30} rx={96} ry={24} fill={MYTH.bloodDeep} stroke={MYTH.inkLine} strokeWidth={3} />
            <ellipse cx={100} cy={30} rx={80} ry={16} fill={MYTH.pool} />
            {[0, 1, 2].map((index) => (
              <ellipse key={index} cx={100} cy={30} rx={60} ry={12} fill="none" stroke={MYTH.poolLight} strokeWidth={2} className={u.ripple} style={{ ['--i' as string]: index }} />
            ))}
          </svg>
          <div className="relative h-72 overflow-hidden sm:h-80">
            <div className={`absolute inset-0 ${u.riser}`}>
              {done ? (
                <button type="button" className={`h-full w-full ${u.heroFigure}`} aria-label={myth.combo} title={myth.comboHint} onClick={() => play(HERO_MOVE[profession])}>
                  <SpartanSprite key={take} profession={profession} motion={pose} onDone={settle} className="h-full w-full" />
                </button>
              ) : (
                <SpartanSprite profession={profession} motion={entranceMotion(shown)} className="h-full w-full" />
              )}
              {DRIPS.map(({ x, y }, index) => (
                <span key={x} className={u.drip} style={{ ['--i' as string]: index, ['--x' as string]: `${x}%`, ['--y' as string]: `${y}%` }} aria-hidden="true" />
              ))}
            </div>
          </div>
          <svg viewBox="0 0 200 30" className="absolute -bottom-2 left-1/2 w-[150%] -translate-x-1/2" aria-hidden="true">
            <path d="M4 4 Q100 40 196 4 L196 30 L4 30 Z" fill={MYTH.bloodDeep} />
            <path d="M4 4 Q100 40 196 4" fill="none" stroke={MYTH.inkLine} strokeWidth={3} />
          </svg>
        </div>

        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="min-w-0">
              <h1 className={u.namePlate}>
                {/* one inner span, so the plate's flex row holds one item that wraps only between the words */}
                <span className={`${u.plate} ${u.display} text-[clamp(1.75rem,0.5rem+4.5vw,3.75rem)] leading-tight`}>
                  <span>
                    <NameWords name={name} />
                  </span>
                </span>
              </h1>
              <p className={`mt-5 inline-block px-5 py-2 text-lg sm:text-xl ${u.parchment} ${u.scroll}`}>{headline}</p>
              <div className={u.heroRest}>
                <p className="mt-4 text-lg italic text-[var(--myth-gold-pale)]">{tagline}</p>
                <p className="mt-2 text-base text-[var(--myth-bone)]">{line}</p>
                <nav className="mt-6 flex flex-wrap gap-3" aria-label={navigation.contactAndCv}>
                  <ContactActions actions={actions} />
                </nav>
                {done && <p className={`mt-6 ${u.hint}`}>{myth.comboHint}</p>}
              </div>
            </div>
          )}
        />
      </div>

      {!done && (
        <SlabButton tone="stone" className="absolute bottom-4 right-4 z-10" onClick={skip}>
          {hud.skipIntro}
        </SlabButton>
      )}
    </header>
  )
}
