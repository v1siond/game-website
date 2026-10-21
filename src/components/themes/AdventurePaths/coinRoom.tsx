'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabName } from '@/components/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { Profession } from '@/lib/cv/professions'
import { Actor, useCourse } from './actor'
import { cssVars } from './art'
import { Coin } from './blocks'
import type { Course } from './course'
import { JOURNAL_SERIF } from './palette'
import { PAPER_CARD, Playfield, POP_CARD, Region } from './region'
import { Pipe, type Zone } from './world'
import side from './side.module.css'

// The ventures as the underground room under the pipe (research images 10, 14, 24): black, with teal
// bricks. He drops out of the pipe in the ceiling, lands, and runs across the room through a row of
// coins, each one gone with a flick as he takes it, and the ventures' cards pop up one after another as
// he runs. Under reduced motion he stands at the far side and every card shows.

type RoomPose = 'drop' | 'run' | 'stand'

const DROP_MS = 460
const RUN = { from: 10, to: 80, ms: 1100 }

const COURSE: Course<RoomPose> = {
  start: { x: RUN.from, lift: 190 },
  legs: [
    { pose: 'drop', frame: 'jump', path: 'line', to: { x: RUN.from, lift: 0 }, ms: DROP_MS, ease: 'ease-in' },
    { pose: 'run', frame: 'run', path: 'line', to: { x: RUN.to, lift: 0 }, ms: RUN.ms },
  ],
  rest: { pose: 'stand', frame: 'stand' },
}

const COINS = [22, 32, 42, 52, 62, 72]

/** When he reaches a spot on his run, counted from the start of the run. */
const reachedAt = (x: number) => Math.round(((x - RUN.from) / (RUN.to - RUN.from)) * RUN.ms)

function RoomScene({ profession }: { profession: Profession }) {
  const course = useCourse(COURSE)
  return (
    <div className="absolute inset-0" data-shown={course.past('drop')}>
      {COINS.map((x) => (
        <div key={x} className={side.coin} style={cssVars({ '--x': x, '--delay': `${reachedAt(x)}ms` })} aria-hidden="true">
          <Coin className="h-full w-full" />
        </div>
      ))}
      <Actor motion={course.motion} profession={profession} onAnimationEnd={course.onOwnAnimationEnd} />
    </div>
  )
}

export function CoinRoom({ companies, profession }: { companies: SectionsOf<'engineer'>['companies']; profession: Profession }) {
  const { sections, links } = useLabels()
  const { ref, on, reduced } = useZoneStage<Zone>('underground')
  // The cards come up as he runs through the room: spread over the run, after the drop.
  const cardDelay = (index: number) => DROP_MS + Math.round(((index + 1) * RUN.ms) / (companies.length + 1))

  return (
    <Region title={sections.ventures} stageRef={ref} on={on}>
      <Playfield ground="brick">
        <div className={side.pipeCeiling} aria-hidden="true">
          <Pipe className="h-full w-full" />
        </div>
        {on && <RoomScene profession={profession} />}
      </Playfield>
      <ul className="grid gap-6 md:grid-cols-3" data-shown={on || reduced}>
        {companies.map((company, index) => (
          <li key={company.id} className={POP_CARD} style={cssVars({ '--delay': `${cardDelay(index)}ms` })}>
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={newTabName(links, `${company.name}: ${company.tagline}`)}
              className="block h-full transition-transform hover:-translate-y-1 motion-reduce:transition-none"
            >
              <article className={`${PAPER_CARD} h-full border-t-8 border-t-[color:var(--ap-cave-brick)]`}>
                <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>
                  <SlashBreaks text={company.name} />
                </h3>
                <p className="text-sm font-semibold text-[color:var(--ap-route)]">{company.tagline}</p>
                <p className="mt-2 text-sm text-[color:var(--ap-ink-soft)]">{company.description}</p>
              </article>
            </a>
          </li>
        ))}
      </ul>
    </Region>
  )
}
