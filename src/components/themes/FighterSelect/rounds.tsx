'use client'

import type { PointerEvent, ReactNode } from 'react'
import type { BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useLabels } from '@/components/cv/CVDataProvider'
import { jobYears } from '@/components/cv/sectionText'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Job, MartialArts } from '@/lib/cv/content'
import { CallText, HitSpark, WinOrb } from './badges'
import { BandCard, ExperienceCard } from './cards'
import { Cue, LifeBar, RoundPip, staggerAt } from './hud'
import { StageBackdrop } from './stages'
import look from './world.module.css'
import fight from './fight.module.css'

// The fight scenes of the long lists, each a moment of a match. CSS keyframes chained by delay under a
// Cue (played once when the entry scrolls in), except the band cards, which follow the pointer.
// - RoundEntry, a job as a round: the round number slams onto the card in a red KO style badge (0ms, 1100ms
//   with a hold), the card steps in from player two's side (620ms), the two life bars fill from their
//   outer edges with the start and end years under them (900ms, 1000ms). The oldest job is round one.
// - LockIn, a project: the slot closes onto the card with one overshoot, like a pick locking in.
// - ResultRecord, the Muay Thai record as the result screen: the title slams, the facts rise, each
//   achievement is stamped down in turn (180ms apart) and a round win orb lights for each.
// - BandStage, a band: the concert stage over the card, the card leaning with the pointer and the
//   stage's three depth layers sliding against it (CSS variables written on pointer move, no render).

export function RoundEntry({ entry, round }: { entry: Job; round: number }) {
  const { years } = useLabels()
  const { start, end } = jobYears(entry, years.present)

  return (
    <Cue>
      <div className="relative">
        <div className="mb-3 flex items-start gap-2">
          <LifeBar side="p1" label={start} />
          <RoundPip>{round}</RoundPip>
          <LifeBar side="p2" label={end} delay="[--delay:1000ms]" />
        </div>
        <div className={`${fight.enter} ${fight.challengerIn}`}>
          <ExperienceCard entry={entry} />
        </div>
        <span className={`pointer-events-none absolute left-1/2 top-1/2 z-20 ${fight.roundBadge}`} aria-hidden="true">
          <span className="grid h-16 min-w-20 place-items-center border-4 border-white bg-[color:var(--fs-ko)] px-3 text-5xl leading-none shadow-[0_0_0_3px_#000,6px_6px_0_3px_#000]">
            <CallText>{round}</CallText>
          </span>
        </span>
      </div>
    </Cue>
  )
}

export function LockIn({ children }: { children: ReactNode }) {
  return (
    <Cue>
      <div className={`${fight.enter} ${fight.lockIn}`}>{children}</div>
    </Cue>
  )
}

export function ResultRecord({ martialArts }: { martialArts: MartialArts }) {
  const { achievements } = martialArts.primary
  const stampAt = (achievement: string) => staggerAt(achievements.indexOf(achievement))

  return (
    <Cue>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className={`text-[clamp(1.375rem,5vw,1.75rem)] uppercase leading-tight ${fight.enter} ${fight.slam} [--delay:0ms]`}>
          <CallText>{martialArts.primary.title}</CallText>
        </h3>
        <span className="flex gap-3" aria-hidden="true">
          {achievements.map((achievement, index) => (
            <span key={achievement} className={`h-6 w-6 ${fight.pip} ${staggerAt(index)}`}>
              <WinOrb />
            </span>
          ))}
        </span>
      </div>
      <div className={`${fight.enter} ${fight.rise} [--delay:200ms]`}>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid sm:grid-cols-2 gap-4 mb-6',
            fact: 'px-4 py-3 border-l-4 border-[color:var(--fs-hud-yellow)] bg-black',
            term: `text-sm uppercase text-[color:var(--fs-hud-yellow)] ${look.display}`,
            value: 'text-sm mt-1 text-white',
            achievements: 'grid gap-4 sm:grid-cols-2',
            achievement: 'text-sm text-white',
          }}
          renderAchievement={(achievement) => (
            <p className={`flex h-full items-start gap-3 border-2 border-white bg-black p-4 shadow-[0_0_0_2px_#000,4px_4px_0_2px_#000] ${fight.enter} ${fight.stamp} ${stampAt(achievement)}`}>
              <HitSpark />
              <span>{achievement}</span>
            </p>
          )}
        />
      </div>
    </Cue>
  )
}

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value))

const setLean = (element: HTMLElement, x: number, y: number) => {
  element.style.setProperty('--mx', String(x))
  element.style.setProperty('--my', String(y))
}

export function BandStage(slot: BandSlot) {
  const reducedMotion = useReducedMotion()

  const aim = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    const box = event.currentTarget.getBoundingClientRect()
    setLean(
      event.currentTarget,
      clampUnit(((event.clientX - box.left) / box.width) * 2 - 1),
      clampUnit(((event.clientY - box.top) / box.height) * 2 - 1),
    )
  }

  return (
    <div onPointerMove={aim} onPointerLeave={(event) => setLean(event.currentTarget, 0, 0)} className={fight.lean}>
      <div className="relative h-28 overflow-hidden border-2 border-b-0 border-[color:var(--fs-p2)]" aria-hidden="true">
        <StageBackdrop profession="drummer" />
      </div>
      <BandCard {...slot} />
    </div>
  )
}
