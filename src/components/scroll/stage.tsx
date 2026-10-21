'use client'

import type { ReactNode } from 'react'
import { useScrollScene } from '@/hooks/useScrollScene'
import type { SceneLines } from '@/lib/scroll/progress'
import { TravelScene } from './TravelScene'
import scene from './heroScene.module.css'

// The structure of a world's profession stage in its scroll scenes; the world draws what stands on it.
//
// - LevelScene: a section he crosses, its strip pinned inside it (TravelScene measures the section).
// - LevelStrip: the strip itself, the world's level behind, him on the track in front.
// - LevelArt and LevelGround: the level's stretched 600 by 100 picture and the ground band he stands on.
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
// atClass is the class route, no style object: the place is rounded to hundredths and split into a
// tenths class and a hundredths class (literal Tailwind arbitrary properties, so the build sees all 21),
// and heroScene's .at rule adds the two into --at.

const AT_TENTHS = [
  '[--at-tenths:0]',
  '[--at-tenths:0.1]',
  '[--at-tenths:0.2]',
  '[--at-tenths:0.3]',
  '[--at-tenths:0.4]',
  '[--at-tenths:0.5]',
  '[--at-tenths:0.6]',
  '[--at-tenths:0.7]',
  '[--at-tenths:0.8]',
  '[--at-tenths:0.9]',
  '[--at-tenths:1]',
]

const AT_HUNDREDTHS = [
  '[--at-hundredths:0]',
  '[--at-hundredths:0.01]',
  '[--at-hundredths:0.02]',
  '[--at-hundredths:0.03]',
  '[--at-hundredths:0.04]',
  '[--at-hundredths:0.05]',
  '[--at-hundredths:0.06]',
  '[--at-hundredths:0.07]',
  '[--at-hundredths:0.08]',
  '[--at-hundredths:0.09]',
]

export function atClass(position: number): string {
  const hundredths = Math.round(Math.min(Math.max(position, 0), 1) * 100)
  return `${scene.at} ${AT_TENTHS[Math.floor(hundredths / 10)]} ${AT_HUNDREDTHS[hundredths % 10]}`
}

const FULL_STRIP = 'absolute inset-0 h-full w-full'

// The level's art in its 600 by 100 box, stretched over the strip. `className` replaces the whole strip
// placement, for a parallax layer wider than the strip or a layer with its own motion.
export function LevelArt({ className = FULL_STRIP, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 600 100" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

// The ground band he stands on; `className` gives its fill and its top edge's colour.
export function LevelGround({ className }: { className: string }) {
  return <div className={`absolute inset-x-0 bottom-0 h-3 border-t-2 ${className}`} aria-hidden="true" />
}

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
