'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useScrollScene } from '@/hooks/useScrollScene'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { SceneLines } from '@/lib/scroll/progress'
import type { Profession } from '@/lib/cv/professions'
import { HeroCharacter } from './character'
import { PROFESSION_STAGES, type LevelZone } from './professions'
import { CVLink, HeroAction } from './actions'
import styles from './scenes.module.css'

// Neon Cyber's scroll scenes on the shared engine (useScrollScene): scroll position moves the scene,
// once only, and reduced motion or a World Select preview shows the final frame at once.
//
// - TravelScene: a section whose level strip stays pinned while the section scrolls by; he crosses the
//   level from the moment the section enters to just before it leaves.
// - SceneItem: one entry (a job, a project, a band, an achievement) arriving as part of the level, a
//   terminal that boots or a billboard that lights, on its own progress as it enters the screen.
// - ContactScene: the profession's closing corner, then the contact panel powers on.

const TRAVEL_START = 0.85
// He reaches the end of the level a third of a screen before the section ends, so the last entry is
// read with the level finished.
const ARRIVE_EARLY = 0.35
const MIN_TRAVEL = 0.3

const roundLine = (value: number) => Math.round(value * 100) / 100

/** Scene lines that stretch one scene over a section's whole height, in viewport fractions. */
export function travelLines(sectionHeight: number, viewportHeight: number): SceneLines {
  if (viewportHeight <= 0) return { start: TRAVEL_START, end: roundLine(TRAVEL_START - MIN_TRAVEL) }
  const travel = Math.max(MIN_TRAVEL, sectionHeight / viewportHeight - ARRIVE_EARLY)
  return { start: TRAVEL_START, end: roundLine(TRAVEL_START - travel) }
}

// Re-measures when the section's height or the viewport changes; the lines only change on a real
// difference, so the scene is not re-armed on every resize event.
function useTravelLines<T extends HTMLElement>(): [SceneLines, (element: T | null) => void] {
  const [element, setElement] = useState<T | null>(null)
  const [lines, setLines] = useState<SceneLines>(() => travelLines(0, 0))

  useEffect(() => {
    if (!element) return
    const measure = () => {
      const next = travelLines(element.offsetHeight, window.innerHeight)
      setLines((previous) => (previous.start === next.start && previous.end === next.end ? previous : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [element])

  return [lines, setElement]
}

// A wrapper, not a landmark: the panel inside it is the labelled section. `relative z-20` keeps the section above the world's fixed backdrop layers once a transform inside it
// makes a stacking context.
export function TravelScene({ children }: { children: ReactNode }) {
  const [lines, measure] = useTravelLines<HTMLElement>()
  const { ref, phase } = useScrollScene<HTMLElement>(lines)
  const setElement = useCallback(
    (element: HTMLElement | null) => {
      ref(element)
      measure(element)
    },
    [ref, measure],
  )

  return (
    <div ref={setElement} data-scene-phase={phase} className={`relative z-20 mb-8 ${styles.scene}`}>
      {children}
    </div>
  )
}

export function LevelStrip({ profession, zone }: { profession: Profession; zone: LevelZone }) {
  const { Level, pose, travel, Companion } = PROFESSION_STAGES[profession]

  return (
    <div className={`${styles.strip} mb-4 border-y border-pink-500/60 bg-[#0a0512]`} aria-hidden="true">
      <Level zone={zone} />
      <div className={`${styles.track} ${pose}`}>
        <div className={`absolute inset-0 ${travel}`}>
          <div className="absolute bottom-1 left-2">
            <HeroCharacter profession={profession} className={styles.hero} />
          </div>
          {Companion && <Companion />}
        </div>
      </div>
    </div>
  )
}

// Each entry plays as it crosses the lower part of the screen.
const ITEM_LINES: SceneLines = { start: 0.95, end: 0.65 }

export type SceneItemKind = 'terminal' | 'billboard'

const ITEM_LOOK: Record<SceneItemKind, { frame: string; body: string }> = {
  terminal: {
    frame: `${styles.bootFrame} border border-cyan-400`,
    body: styles.bootScreen,
  },
  billboard: {
    frame: `${styles.billboardFrame} border-2 border-pink-500 shadow-[0_0_14px_#ff00ff80]`,
    body: styles.billboardCopy,
  },
}

export function SceneItem({ kind, children }: { kind: SceneItemKind; children: ReactNode }) {
  const { ref, phase } = useScrollScene<HTMLDivElement>(ITEM_LINES)
  const look = ITEM_LOOK[kind]

  return (
    <div ref={ref} data-scene-phase={phase} className={`relative h-full ${styles.scene}`}>
      <div className={`pointer-events-none absolute -inset-1 ${look.frame}`} aria-hidden="true" />
      <div className={`h-full ${look.body}`}>{children}</div>
    </div>
  )
}

const CONTACT_LINES: SceneLines = { start: 0.95, end: 0.4 }

export function ContactScene({ profession }: { profession: Profession }) {
  const { ref, phase } = useScrollScene<HTMLElement>(CONTACT_LINES)
  const { Corner } = PROFESSION_STAGES[profession]

  return (
    <section
      ref={ref}
      data-scene-phase={phase}
      aria-labelledby="neon-contact-heading"
      className={`relative z-20 px-4 py-16 sm:px-6 ${styles.scene}`}
    >
      <div className="mx-auto grid max-w-4xl items-center gap-8 sm:grid-cols-[16rem_1fr]">
        <div className="relative h-44 overflow-hidden border border-cyan-400/60 bg-[#0a0512]" aria-hidden="true">
          <Corner />
        </div>
        <RecruiterHero
          render={({ line, actions }) => (
            <div className={`text-center sm:text-left ${styles.powerOn}`}>
              <h2 id="neon-contact-heading" className="mb-3 font-mono text-xl tracking-wider text-cyan-400">
                Contact
              </h2>
              <p className="mb-6 font-mono text-sm text-pink-400">{line}</p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-start">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
