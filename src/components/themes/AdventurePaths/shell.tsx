'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { useZoneStage } from '@/hooks/useZoneStage'
import { fillLabel } from '@/lib/cv/labels'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { Profession } from '@/lib/cv/professions'
import { Actor, FoeSprite, useCourse } from './actor'
import { cssVars } from './art'
import { Brick } from './blocks'
import type { Course } from './course'
import { JOURNAL_SERIF } from './palette'
import { PAPER_CARD, Playfield, POP_CARD, Region } from './region'
import type { Zone } from './world'
import side from './side.module.css'

// The tech stack as a night stretch with a turtle shell on the ground (research images 13, 22, 25): he
// runs up and kicks the shell, it slides along the ground and breaks one brick per category, and each
// category's card pops up as its brick breaks, the way a kicked shell clears a row of bricks. The kick
// again button sends him back for another kick (the cards stay). Under reduced motion every card shows.

type TechPose = 'run' | 'kick' | 'stand'

const COURSE: Course<TechPose> = {
  start: { x: -20, lift: 0 },
  legs: [
    { pose: 'run', frame: 'run', path: 'line', to: { x: 16, lift: 0 }, ms: 520 },
    { pose: 'kick', frame: 'kick', path: 'line', to: { x: 17, lift: 0 }, ms: 280 },
  ],
  rest: { pose: 'stand', frame: 'stand' },
}

// The shell starts at 26% and slides to 110% in 900 ms, 120 ms after the kick starts (side.module.css).
const SHELL = { from: 26, to: 110, ms: 900, wait: 120 }

/** A brick's place along the ground, and when the shell reaches it after the kick. */
function brickOf(index: number, count: number) {
  const x = count === 1 ? 60 : 36 + (index * 54) / (count - 1)
  const delay = SHELL.wait + ((x - SHELL.from) / (SHELL.to - SHELL.from)) * SHELL.ms
  return { x, delay: Math.round(delay) }
}

function KickScene({ count, profession, onKick }: { count: number; profession: Profession; onKick: () => void }) {
  const course = useCourse(COURSE)
  const kicked = course.past('run')

  useEffect(() => {
    if (kicked) onKick()
  }, [kicked, onKick])

  return (
    <div className="absolute inset-0" data-kicked={kicked}>
      {Array.from({ length: count }, (_, index) => {
        const { x, delay } = brickOf(index, count)
        return (
          <div key={x} className={side.brick} style={cssVars({ '--x': x, '--delay': `${delay}ms` })} aria-hidden="true">
            <Brick />
          </div>
        )
      })}
      <div className={side.shellTrack} aria-hidden="true">
        <FoeSprite look="shell" className="h-12 w-9" />
      </div>
      <Actor motion={course.motion} profession={profession} onAnimationEnd={course.onOwnAnimationEnd} />
    </div>
  )
}

export function ShellLevel({ categories, profession }: { categories: SectionsOf<'engineer'>['techStack']; profession: Profession }) {
  const { sections, cards, trail } = useLabels()
  const { ref, on, reduced } = useZoneStage<Zone>('night')
  const [round, setRound] = useState(0)
  const [kicked, setKicked] = useState(false)
  const kick = useCallback(() => setKicked(true), [])

  return (
    <Region title={sections.techStack} stageRef={ref} on={on}>
      <Playfield>{on && <KickScene key={round} count={categories.length} profession={profession} onKick={kick} />}</Playfield>
      {!reduced && (
        <button
          type="button"
          onClick={() => setRound((now) => now + 1)}
          disabled={!kicked}
          className={`-mt-3 mb-6 min-h-[44px] rounded-md border-[3px] border-white bg-[color:var(--ap-hud)] px-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:transition-none ${JOURNAL_SERIF}`}
        >
          {trail.kickAgain}
        </button>
      )}
      <ul className={MASONRY_LIST} aria-label={cards.techByCategory} data-shown={kicked || reduced}>
        {categories.map((category, index) => (
          <li key={category.id} className={`${MASONRY_ITEM} ${POP_CARD}`} style={cssVars({ '--delay': `${brickOf(index, categories.length).delay}ms` })}>
            <div className={PAPER_CARD}>
              <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>{category.name}</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={fillLabel(cards.categoryTechnologies, { name: category.name })}>
                {category.items.map((item) => (
                  <li key={item} className="rounded-sm border-2 border-[color:var(--ap-hud)] bg-[color:var(--ap-block)] px-2 py-0.5 text-sm font-semibold text-[color:var(--ap-ink)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Region>
  )
}
