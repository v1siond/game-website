'use client'

import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { Beat } from './bout'
import { Fighter } from './fighter'
import { StageBackdrop } from './stages'
import living from './living.module.css'

// The ring a bout plays in: one of the fight stages, him on the left in the beat's pose and his sparring
// partner on the right facing him (the same rig mirrored, in his red gi), both stepping to their marks
// for the beat. Scenes lay their own props and calls over it (children). The visitor's replay is a real
// button over the whole ring, so a tap or Enter runs the bout again; it is left out under reduced
// motion, when a bout shows its last beat and takes no replay.

const SPRITE = 'h-36 w-[8.5rem] sm:h-52 sm:w-[12.25rem]'

// Static classes for where each fighter stands, so Tailwind sees each one.
export type Mark = 'corner' | 'mid' | 'close'

const HERO_AT: Record<Mark, string> = {
  corner: 'translate-x-0',
  mid: 'translate-x-[18cqw]',
  close: 'translate-x-[30cqw]',
}

const PARTNER_AT: Record<Mark, string> = {
  corner: 'translate-x-0',
  mid: '-translate-x-[14cqw]',
  close: '-translate-x-[22cqw]',
}

interface RingProps {
  profession: Profession
  stage: Profession
  beat: Beat
  take: number
  heroAt?: Mark
  partnerAt?: Mark
  // A ring without the partner (the car smash).
  solo?: boolean
  replayLabel?: string
  onReplay?: () => void
  className?: string
  children?: ReactNode
}

export function Ring({
  profession,
  stage,
  beat,
  take,
  heroAt = 'corner',
  partnerAt = 'corner',
  solo = false,
  replayLabel,
  onReplay,
  className = 'h-40 sm:h-56',
  children,
}: RingProps) {
  return (
    <div className={`relative overflow-hidden border-2 border-white shadow-[0_0_0_2px_#000] ${living.ring} ${className}`}>
      <StageBackdrop profession={stage} />
      <div className={`absolute bottom-0 left-[2%] ${living.slide} ${HERO_AT[heroAt]}`} aria-hidden="true">
        <Fighter profession={profession} pose={beat.hero} take={take} className={SPRITE} />
      </div>
      {!solo && (
        <div className={`absolute bottom-0 right-[2%] ${living.slide} ${PARTNER_AT[partnerAt]}`} aria-hidden="true">
          <div className={living.mirror}>
            <Fighter profession={profession} who="partner" pose={beat.partner ?? 'stance'} take={take} className={SPRITE} />
          </div>
        </div>
      )}
      {children}
      {onReplay && replayLabel && (
        <button
          type="button"
          onClick={onReplay}
          aria-label={replayLabel}
          className="absolute inset-0 z-30 cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[color:var(--fs-gold)]"
        />
      )}
    </div>
  )
}
