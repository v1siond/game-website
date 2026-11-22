'use client'

import { useLabels } from '@/components/cv/CVDataProvider'
import { newTabHint } from '@/lib/cv/sectionText'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { useZoneStage } from '@/hooks/useZoneStage'
import { ventureCard, type SectionsOf } from '@/lib/cv/cvView'
import type { Profession } from '@/lib/cv/professions'
import { Actor, useCourse } from './actor'
import { cssVars } from '@/lib/cssVars'
import { Coin } from './blocks'
import type { Course } from './course'
import { JOURNAL_SERIF } from './palette'
import { PAPER_CARD, Playfield, POP_CARD, Region } from './region'
import { Pipe, type Zone } from './world'
import side from './side.module.css'

// The ventures as the underground room under the pipe (research images 10, 14, 24): black, with teal
// bricks. He drops out of the pipe in the ceiling, lands, and runs across the room through a row of
// coins, each one gone with a flick as he takes it, and the ventures' cards pop up one after another as
// he runs. Under reduced motion he stands at the far side and every card shows. His own products
// (featured) pop up first, two wide cards to a row with a coin gold top and the black HUD plate over the
// name; the other ventures follow three to a row. A card's link is named by the words it shows (the
// description and services included) plus the new tab note a screen reader alone hears.

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
  const { sections, links, cards } = useLabels()
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
      <ul className="grid gap-6 md:grid-cols-6" data-shown={on || reduced}>
        {companies.map(ventureCard).map((company, index) => (
          <li key={company.id} className={`${POP_CARD} ${company.featured ? 'md:col-span-3' : 'md:col-span-2'}`} style={cssVars({ '--delay': `${cardDelay(index)}ms` })}>
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full transition-transform hover:-translate-y-1 motion-reduce:transition-none"
            >
              <article
                className={`${PAPER_CARD} h-full border-t-8 ${company.featured ? 'border-t-[color:var(--ap-coin)]' : 'border-t-[color:var(--ap-cave-brick)]'}`}
              >
                {company.featured && (
                  <p className="mb-2 inline-block rounded-sm bg-[color:var(--ap-hud)] px-2 py-0.5 text-sm font-bold uppercase tracking-wider text-[color:var(--ap-coin)]">
                    {cards.ownProduct}
                  </p>
                )}
                <h3 className={`text-lg font-bold ${JOURNAL_SERIF}`}>
                  <SlashBreaks text={company.name} />
                </h3>
                <p className="text-sm font-semibold text-[color:var(--ap-route-text)]">{company.tagline}</p>
                <p className="mt-2 text-sm text-[color:var(--ap-ink-soft)]">{company.description}</p>
                {company.services.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={sections.services}>
                    {company.services.map((service) => (
                      <li key={service} className="flex items-center gap-1.5 rounded-sm border border-[color:var(--ap-hud)] px-2 py-0.5 text-sm">
                        <span className="h-2.5 w-2 shrink-0 rounded-sm border border-[color:var(--ap-hud)] bg-[color:var(--ap-coin)]" aria-hidden="true" />
                        {service}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="sr-only"> {newTabHint(links)}</span>
              </article>
            </a>
          </li>
        ))}
      </ul>
    </Region>
  )
}
