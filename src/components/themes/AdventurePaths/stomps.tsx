'use client'

import { useCallback, useMemo, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useZoneStage } from '@/hooks/useZoneStage'
import type { MartialArts } from '@/lib/cv/content'
import { Actor, useCourse, usePassed } from './actor'
import type { Course, Leg } from './course'
import { JOURNAL_SERIF } from './palette'
import { AgainButton, Banner, Playfield, Region, StompFoe } from './region'
import type { Zone } from './world'

// The Muay Thai record as the fortress (research images 15, 26, 27): gold blocks on the dark, and one
// mushroom foe walking toward him for each of his titles. He runs in and stomps them in one chain
// without touching the ground, each foe flattened under his feet with its score popping up, doubling
// as the chain goes on (100, 200, 400), and each title beside it is marked cleared as its foe falls.
// The stomp again button runs the chain again. Under reduced motion every title shows cleared.

const LAND = 18

const foeX = (index: number, count: number) => (count === 1 ? 50 : 34 + (index * 40) / (count - 1))

const stompPose = (index: number) => `stomp-${index}`

/** The run in, one stomp per foe in a chain, and the hop off the last one. */
function chainCourse(count: number): Course {
  const stomps: Leg[] = Array.from({ length: count }, (_, index) => ({
    pose: stompPose(index),
    frame: 'stomp',
    path: 'arc',
    to: { x: foeX(index, count), lift: LAND },
    ms: 400,
    peak: 46,
  }))
  return {
    start: { x: -20, lift: 0 },
    legs: [
      { pose: 'run', frame: 'run', path: 'line', to: { x: 14, lift: 0 }, ms: 480 },
      ...stomps,
      { pose: 'off', frame: 'jump', path: 'arc', to: { x: 86, lift: 0 }, ms: 400, peak: 36 },
    ],
    rest: { pose: 'cheer', frame: 'cheer' },
  }
}

const scoreOf = (index: number) => 100 * 2 ** index

function ChainScene({ count, onStomped }: { count: number; onStomped: (stomped: number) => void }) {
  const course = useCourse(useMemo(() => chainCourse(count), [count]))
  const stomped = Array.from({ length: count }, (_, index) => course.past(stompPose(index))).filter(Boolean).length
  usePassed(stomped, onStomped)

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <StompFoe key={index} x={foeX(index, count)} scored={index < stomped} score={scoreOf(index)} />
      ))}
      <Actor motion={course.motion} profession="fighter" onAnimationEnd={course.onOwnAnimationEnd} />
    </>
  )
}

export function StompLevel({ martialArts }: { martialArts: MartialArts }) {
  const { sections, trail: labels } = useLabels()
  const { ref, on, reduced } = useZoneStage<Zone>('fortress')
  const count = martialArts.primary.achievements.length
  const [round, setRound] = useState(0)
  const [cleared, setCleared] = useState(0)
  const stomped = useCallback((now: number) => setCleared((before) => Math.max(before, now)), [])
  const all = cleared >= count

  return (
    <Region title={sections.muayThai} stageRef={ref} on={on}>
      <h3 className={`mb-4 inline-block rounded-md bg-[color:var(--ap-hud)] px-3 py-1.5 text-xl font-bold text-white ${JOURNAL_SERIF}`}>{martialArts.primary.title}</h3>
      <Banner>{all ? labels.fortressCleared : sections.muayThai}</Banner>
      <Playfield ground="gold">{on && <ChainScene key={round} count={count} onStomped={stomped} />}</Playfield>
      {!reduced && (
        <AgainButton onAgain={() => setRound((now) => now + 1)} ready={all}>
          {labels.stompAgain}
        </AgainButton>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'order-2 grid content-start gap-3 rounded-md border-[3px] border-white bg-[color:var(--ap-hud)] p-4 lg:order-1',
            fact: 'border-b border-white/30 pb-2 last:border-b-0',
            term: 'text-sm font-bold tracking-wide text-[color:var(--ap-coin)]',
            value: 'mt-1 text-sm text-white',
            achievements: 'order-1 space-y-3 lg:order-2',
            achievement: '',
          }}
          renderAchievement={(achievement, index) => {
            const done = index < cleared
            return (
              <div className="flex items-start gap-3 rounded-md border-[3px] border-[color:var(--ap-hud)] bg-[color:var(--ap-page)] p-3 text-[color:var(--ap-ink)] shadow-[0_4px_0_var(--ap-hud)]">
                <span
                  className={`mt-0.5 flex h-8 min-w-[2rem] shrink-0 items-center justify-center rounded-sm border-2 border-[color:var(--ap-hud)] px-1 text-sm font-bold ${
                    done ? 'bg-[color:var(--ap-fort-gold)] text-[color:var(--ap-ink)]' : 'bg-[color:var(--ap-page)]'
                  }`}
                  aria-hidden="true"
                >
                  {done ? scoreOf(index) : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-base">{achievement}</span>
                  {done && <span className="mt-1 block text-sm font-bold text-[color:var(--ap-route-text)]">{labels.cleared}</span>}
                </span>
              </div>
            )
          }}
        />
      </div>
    </Region>
  )
}
