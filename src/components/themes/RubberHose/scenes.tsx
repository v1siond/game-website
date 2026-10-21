'use client'

import { useEffect, useState, type ReactNode, type PointerEvent } from 'react'
import { usePreview } from '@/themes/PreviewContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Profession } from '@/lib/cv/professions'
import { IrisRing, PieEyes } from './art'
import { HeroCharacter } from './character'
import { HOSE } from './palette'
import world from './world.module.css'
import styles from './scenes.module.css'

// Rubber Hose's own scenes, each a move of a 1930s rubber hose run and gun:
// - TitleCardIntro: the boss intro card. setTimeout phases, because it is a fixed sequence on page load
//   for the first screen only: the iris opens (0 ms), the framed card drops and squashes (250 ms), its
//   words pop in one by one (800 ms). Plays once; reduced motion or a World Select preview start at the end.
// - IrisWipe: the scene change. Keyed on the profession by the caller, so every switch opens a new iris.
// - Reveal: one scroll trigger (the shared useSectionTrigger, once only) handing a wait or play class to
//   its children, for the phase cards, the knockout and the hit stars.
// - SunWatcher: the pie eyed sun over the contact card, its pupils following the pointer through two CSS
//   variables written on pointer move (no React render per move).

type IntroPhase = 'wait' | 'drop' | 'pop'

const INTRO_TIMING: Record<Exclude<IntroPhase, 'wait'>, number> = { drop: 250, pop: 800 }

export interface IntroLook {
  card: string
  word: string
}

const INTRO_LOOK: Record<IntroPhase, IntroLook> = {
  wait: { card: styles.cardWait, word: styles.wordWait },
  drop: { card: styles.cardDrop, word: styles.wordWait },
  pop: { card: '', word: styles.wordPop },
}

export function TitleCardIntro({ children }: { children: (look: IntroLook) => ReactNode }) {
  const reducedMotion = useReducedMotion()
  const isPreview = usePreview()
  const [phase, setPhase] = useState<IntroPhase>('wait')
  const skip = reducedMotion || isPreview

  useEffect(() => {
    if (skip) {
      setPhase('pop')
      return
    }
    const timers = [
      setTimeout(() => setPhase('drop'), INTRO_TIMING.drop),
      setTimeout(() => setPhase('pop'), INTRO_TIMING.pop),
    ]
    return () => timers.forEach(clearTimeout)
  }, [skip])

  return (
    <div className={`relative ${styles.scene}`}>
      {!skip && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
          <IrisRing className={`${styles.iris} ${styles.irisOpen}`} />
        </div>
      )}
      {children(INTRO_LOOK[phase])}
    </div>
  )
}

export function IrisWipe({ children }: { children: ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${styles.scene}`}>
      {children}
      <IrisRing className={`z-30 ${styles.iris} ${styles.irisOpen}`} />
    </div>
  )
}

export interface RevealLook {
  played: boolean
}

export function Reveal({ children, className = '' }: { children: (look: RevealLook) => ReactNode; className?: string }) {
  const { ref, triggered } = useSectionTrigger()

  return (
    <div ref={ref} className={`${styles.scene} ${className}`}>
      {children({ played: triggered })}
    </div>
  )
}

// The --i variable a staggered item reads for its delay, as literal classes for the build.
export const STAGGER = ['[--i:0]', '[--i:1]', '[--i:2]', '[--i:3]', '[--i:4]', '[--i:5]', '[--i:6]', '[--i:7]']
export const staggerAt = (index: number) => STAGGER[Math.min(index, STAGGER.length - 1)]

function Sun() {
  return (
    <svg viewBox="0 0 80 80" className={`h-24 w-24 sm:h-28 sm:w-28 ${world.inked}`} aria-hidden="true" focusable="false">
      <g className={styles.sunRays}>
        {[0, 30, 60, 90, 120, 150].map((angle) => (
          <path key={angle} d="M37 2 Q40 -2 43 2 L41 78 Q40 80 39 78 Z" fill={HOSE.gold} transform={`rotate(${angle} 40 40)`} />
        ))}
      </g>
      <circle cx={40} cy={40} r={22} fill={HOSE.gold} />
      <ellipse cx={34} cy={30} rx={7} ry={4} fill={HOSE.highlight} opacity={0.5} />
      <g className={styles.pupils}>
        <PieEyes cx={40} cy={37} size={20} paper={HOSE.gold} />
      </g>
      <path d="M30 48 Q40 57 50 48" fill="none" stroke={HOSE.ink} strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  )
}

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value))

// The contact frame: the iris closes round him waving under the sun, whose eyes follow the pointer.
export function SunWatcher({ profession }: { profession: Profession }) {
  const look = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--look-x', String(clampUnit(((event.clientX - box.left) / box.width) * 2 - 1)))
    event.currentTarget.style.setProperty('--look-y', String(clampUnit(((event.clientY - box.top) / box.height) * 2 - 1)))
  }

  return (
    <div onPointerMove={look} className={`relative h-48 overflow-hidden ${world.titleCard} ${styles.scene}`} aria-hidden="true">
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" focusable="false">
        <defs>
          <linearGradient id="hose-contact-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={HOSE.highlight} />
            <stop offset="1" stopColor={HOSE.paperSepia} />
          </linearGradient>
        </defs>
        <rect width={400} height={120} fill="url(#hose-contact-sky)" />
        <path d="M0 92 Q60 70 130 88 T260 84 T400 80 V120 H0 Z" fill={HOSE.paperDark} />
        <path d="M0 104 Q100 92 200 102 T400 98 V120 H0 Z" fill={HOSE.shadow} opacity={0.6} />
      </svg>
      <div className="absolute right-[12%] top-2">
        <Sun />
      </div>
      <div className={`absolute bottom-2 left-[18%] h-28 w-20 ${styles.heroBob}`}>
        <HeroCharacter profession={profession} wave className="h-full w-full" />
      </div>
      <IrisRing className={`${styles.iris} ${styles.irisClose}`} />
    </div>
  )
}
