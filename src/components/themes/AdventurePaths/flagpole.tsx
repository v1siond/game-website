'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { Profession } from '@/lib/cv/professions'
import { CVLink, HeroAction, PlayLink } from './actions'
import { Actor, useCourse } from './actor'
import { cssVars } from './art'
import { Castle, Firework } from './blocks'
import type { Course } from './course'
import { TRAIL } from './palette'
import { Banner, Playfield, Region } from './region'
import type { Zone } from './world'
import side from './side.module.css'

// Contact as the end of the course at sunset (research images 05, 08, 31): he runs at the goal pole,
// leaps and grabs it high up, slides down it with the flag coming down beside him, hops off and walks to
// the castle while fireworks go off over it, and the HUD line says the course is cleared. Pressing the
// pole runs it again. His contact actions stand beside the course the whole time, never behind it.

type GoalPose = 'run' | 'leap' | 'slide' | 'off' | 'walk' | 'cheer'

const COURSE: Course<GoalPose> = {
  start: { x: -20, lift: 0 },
  legs: [
    { pose: 'run', frame: 'run', path: 'line', to: { x: 40, lift: 0 }, ms: 560 },
    { pose: 'leap', frame: 'jump', path: 'arc', to: { x: 54, lift: 150 }, ms: 380, peak: 20 },
    { pose: 'slide', frame: 'grab', path: 'line', to: { x: 54, lift: 4 }, ms: 800 },
    { pose: 'off', frame: 'jump', path: 'arc', to: { x: 64, lift: 0 }, ms: 300, peak: 26 },
    { pose: 'walk', frame: 'run', path: 'line', to: { x: 76, lift: 0 }, ms: 420 },
  ],
  rest: { pose: 'cheer', frame: 'cheer' },
}

/** Where the flag is: at the top, coming down with him, or down at the foot of the pole. */
type FlagState = 'up' | 'down' | 'low'

const FIREWORKS = [
  { place: 'right-[6%] bottom-[150px]', delay: 0 },
  { place: 'right-[16%] bottom-[190px]', delay: 260 },
  { place: 'right-[2%] bottom-[210px]', delay: 520 },
]

function GoalScene({ profession, onCleared }: { profession: Profession; onCleared: () => void }) {
  const course = useCourse(COURSE)
  const flag: FlagState = course.past('slide') ? 'low' : course.motion.pose === 'slide' ? 'down' : 'up'

  useEffect(() => {
    if (course.arrived) onCleared()
  }, [course.arrived, onCleared])

  return (
    <div className="absolute inset-0" data-flag={flag} data-cleared={course.arrived}>
      <div className={side.flagOnPole} aria-hidden="true">
        <svg viewBox="0 0 20 15" className={side.flag} aria-hidden="true" focusable="false">
          <path d="M20 1 L1 7.5 L20 14 Z" fill={TRAIL.PAGE} stroke={TRAIL.HUD} strokeWidth={1.4} />
          <circle cx={13} cy={7.5} r={2.6} fill={TRAIL.PIPE} />
        </svg>
      </div>
      {FIREWORKS.map(({ place, delay }) => (
        <div key={place} className={`${side.firework} ${place}`} style={cssVars({ '--delay': `${delay}ms` })} aria-hidden="true">
          <Firework />
        </div>
      ))}
      <Actor motion={course.motion} profession={profession} onAnimationEnd={course.onOwnAnimationEnd} />
    </div>
  )
}

export function GoalPole({ profession }: { profession: Profession }) {
  const { sections, trail } = useLabels()
  const { ref, on } = useZoneStage<Zone>('sunset')
  const [round, setRound] = useState(0)
  const [cleared, setCleared] = useState(false)
  const clear = useCallback(() => setCleared(true), [])

  return (
    <Region title={sections.contact} stageRef={ref} on={on}>
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div>
          <Banner>{cleared ? trail.trailCleared : trail.goal}</Banner>
          <Playfield height="h-72">
            <div className={`absolute bottom-8 right-1 h-16 w-16 sm:h-24 sm:w-24`} aria-hidden="true">
              <Castle />
            </div>
            <button type="button" className={`${side.pole} rounded-sm`} aria-label={trail.grabAgain} onClick={() => setRound((now) => now + 1)}>
              <span className="absolute bottom-0 left-[19px] top-3 w-1.5 border-x-2 border-[color:var(--ap-hud)] bg-[color:var(--ap-pipe-light)]" aria-hidden="true" />
              <span className="absolute left-[14px] top-0 h-4 w-4 rounded-full border-2 border-[color:var(--ap-hud)] bg-[color:var(--ap-pipe)]" aria-hidden="true" />
            </button>
            {on && <GoalScene key={round} profession={profession} onCleared={clear} />}
          </Playfield>
        </div>

        <RecruiterHero
          render={({ line, actions }) => (
            <div className="rounded-md border-4 border-double border-white bg-[color:var(--ap-hud)] p-5 sm:p-6">
              <p className="mb-6 text-base text-white">{line}</p>
              <div className="flex flex-wrap gap-3">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <PlayLink />
              </div>
            </div>
          )}
        />
      </div>
    </Region>
  )
}
