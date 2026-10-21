'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useScrollScene } from '@/hooks/useScrollScene'
import type { SceneLines } from '@/lib/scroll/progress'
import { TravelScene } from './TravelScene'
import scene from './heroScene.module.css'

// The structure of a world's profession stage in its scroll scenes; the world draws what stands on it.
//
// - LevelScene: a section he crosses, its strip pinned inside it (TravelScene measures the section).
// - LevelStrip: the strip itself, the world's level behind, him on the track in front.
// - SceneEntry: one entry (a job, a project, a band, an achievement) arriving as part of the level, on
//   its own progress as it crosses the lower part of the screen.
// - ContactStage: the closing section, the profession's corner beside the contact panel.

export type LevelZone = 'record' | 'work'

// One profession's stage in a world.
export interface StageLook {
  Level: (props: { zone: LevelZone }) => ReactNode
  // His action on the level and how he travels across it.
  pose: string
  travel: string
  // What moves with him on the track: the kit he plays, the flash of a strike.
  Companion: (() => ReactNode) | null
  Corner: () => ReactNode
}

// A prop's place along the level (0 to 1) as --at: it sets the prop's left edge and when it answers.
export const at = (position: number) => ({ '--at': position }) as CSSProperties

export function LevelScene({ children }: { children: ReactNode }) {
  return <TravelScene className={scene.scene}>{children}</TravelScene>
}

interface LevelStripProps {
  stage: StageLook
  zone: LevelZone
  // The world's height, frame and tempo for the strip.
  className: string
  // Him, placed at the start of the track.
  hero: ReactNode
}

export function LevelStrip({ stage: { Level, pose, travel, Companion }, zone, className, hero }: LevelStripProps) {
  return (
    <div className={`${scene.strip} mb-4 ${className}`} aria-hidden="true">
      <Level zone={zone} />
      <div className={`${scene.track} ${pose}`}>
        <div className={`absolute inset-0 ${travel}`}>
          {hero}
          {Companion && <Companion />}
        </div>
      </div>
    </div>
  )
}

const ENTRY_LINES: SceneLines = { start: 0.95, end: 0.65 }

interface SceneEntryProps {
  // The world's frame the entry arrives in, drawn behind it.
  frame: ReactNode
  // How the entry itself arrives.
  arrival: string
  children: ReactNode
}

export function SceneEntry({ frame, arrival, children }: SceneEntryProps) {
  const { ref, phase } = useScrollScene<HTMLDivElement>(ENTRY_LINES)

  return (
    <div ref={ref} data-scene-phase={phase} className={`relative h-full ${scene.scene}`}>
      {frame}
      <div className={`relative h-full ${arrival}`}>{children}</div>
    </div>
  )
}

const CONTACT_LINES: SceneLines = { start: 0.95, end: 0.4 }

interface ContactStageProps {
  headingId: string
  // The world's framed corner where the profession ends the page.
  corner: ReactNode
  // The contact panel; it reads `arrive` to come in over the last part of the scene.
  children: ReactNode
}

export function ContactStage({ headingId, corner, children }: ContactStageProps) {
  const { ref, phase } = useScrollScene<HTMLElement>(CONTACT_LINES)

  return (
    <section
      ref={ref}
      data-scene-phase={phase}
      aria-labelledby={headingId}
      className={`relative z-20 px-4 py-16 sm:px-6 ${scene.scene}`}
    >
      <div className="mx-auto grid max-w-4xl items-center gap-8 sm:grid-cols-[16rem_1fr]">
        {corner}
        {children}
      </div>
    </section>
  )
}
