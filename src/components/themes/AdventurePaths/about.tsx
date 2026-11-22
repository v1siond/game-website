'use client'

import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { MarkedLines, type MarkedLinesLook } from '@/components/cv/MarkedLines'
import { aboutBlock } from '@/lib/cv/cvView'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { Profession } from '@/lib/cv/professions'
import { Actor, useCourse } from './actor'
import { Coin, QuestionBlock } from './blocks'
import type { Course } from './course'
import { JOURNAL_SERIF } from './palette'
import { Playfield, Region } from './region'
import type { Zone } from './world'
import side from './side.module.css'

// About as the first stretch of the plains (research images 04, 09, 21): he runs in under the ? block,
// jumps and hits it from below, the block bumps, a coin spins out, the block turns to a used block, and
// his summary unfolds under it in the game's black message window. Pressing the block makes him jump
// and hit it again, and the window unfolds again. Under reduced motion he stands under the used block
// and the window is open. The window holds the whole About block: the bio, his highlights as coin rows,
// then his education and languages.

// The About highlights as coin rows in the white message window.
const COIN_ROWS: MarkedLinesLook = {
  list: 'mt-4 max-w-prose space-y-1.5',
  line: 'flex items-start gap-2 text-sm text-white',
  marker: <span className="mt-1 h-2.5 w-2 shrink-0 rounded-sm border border-white bg-[color:var(--ap-coin)]" aria-hidden="true" />,
}

type AboutPose = 'run' | 'jump' | 'land' | 'stand' | 'bump'

const UP = 'cubic-bezier(0.2, 0.6, 0.4, 1)'
const DOWN = 'cubic-bezier(0.6, 0, 0.8, 0.4)'

const COURSE: Course<AboutPose> = {
  start: { x: -20, lift: 0 },
  legs: [
    { pose: 'run', frame: 'run', path: 'line', to: { x: 44, lift: 0 }, ms: 700 },
    { pose: 'jump', frame: 'jump', path: 'line', to: { x: 44, lift: 64 }, ms: 240, ease: UP },
    { pose: 'land', frame: 'jump', path: 'line', to: { x: 44, lift: 0 }, ms: 300, ease: DOWN },
  ],
  rest: { pose: 'stand', frame: 'stand' },
  moves: [{ pose: 'bump', frame: 'jump', path: 'arc', to: { x: 44, lift: 0 }, ms: 560, peak: 64 }],
}

const BUMP_MS = 600

/** Whether the block shows hit: not yet, hit on his way up, or hit again by a replay (later in the jump). */
type HitState = 'false' | 'true' | 'again'

function hitOf(replays: number, struck: boolean): HitState {
  if (replays > 0) return 'again'
  return struck ? 'true' : 'false'
}

export function AboutLevel({ bio, profession }: { bio: string; profession: Profession }) {
  const { sections, trail, cards, about } = useLabels()
  const { education, languages, highlights } = aboutBlock(useCVData().professionalSummary)
  const facts = [
    { term: about.education, value: education },
    { term: about.languages, value: languages },
  ].filter((fact) => fact.value)
  const { ref, on, reduced } = useZoneStage<Zone>('plains')
  const course = useCourse(COURSE, BUMP_MS)
  const hit = hitOf(course.take, on && course.past('jump'))

  return (
    <Region title={sections.about} stageRef={ref} on={on}>
      <div data-hit={hit}>
        <Playfield>
          {reduced ? (
            <div className={side.qBlock} data-hit={hit} aria-hidden="true">
              <span className={side.qFace}>
                <QuestionBlock />
              </span>
            </div>
          ) : (
            <button type="button" className={`${side.qBlock} rounded-sm`} data-hit={hit} aria-label={trail.hitBlock} onClick={() => course.play('bump')}>
              <Coin key={`coin-${course.take}`} className={side.qCoin} />
              <span key={`face-${course.take}`} className={side.qFace}>
                <QuestionBlock />
              </span>
            </button>
          )}
          {on && <Actor motion={course.motion} profession={profession} take={course.take} onAnimationEnd={course.onOwnAnimationEnd} />}
        </Playfield>
        <div key={course.take} className={`${side.unfold} rounded-md border-4 border-double border-white bg-[color:var(--ap-hud)] p-5 sm:p-6`}>
          <p className={`max-w-prose text-lg leading-relaxed text-white ${JOURNAL_SERIF}`}>{bio}</p>
          <MarkedLines items={highlights} label={cards.keyAchievements} look={COIN_ROWS} />
          {facts.length > 0 && (
            <dl className="mt-4 max-w-prose space-y-1 text-sm text-white">
              {facts.map(({ term, value }) => (
                <div key={term}>
                  <dt className="inline font-bold text-[color:var(--ap-coin)]">{term}: </dt>
                  <dd className="inline">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </Region>
  )
}
