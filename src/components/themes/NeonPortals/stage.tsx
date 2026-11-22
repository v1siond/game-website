'use client'

import { useCallback, useMemo, useState, type AnimationEvent, type ReactNode, type Ref } from 'react'
import { useProfession } from '@/contexts/ProfessionContext'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { cssVars } from '@/lib/cssVars'
import { headingId } from '@/lib/cv/sectionText'
import { motionAt, type Motion, type Scene } from './choreography'
import { Character } from './character'
import { ART_PLATE, FACE } from './cards'
import { Tally } from './tally'
import stage from './stage.module.css'

// The level every section is: its title on the game's level name plate with the tally beside it when the
// section holds finds, a scene he plays his part in (a strip of the level or a row above the cards), and
// the cards. The section is the zone stage (useZoneStage), so one observer both hands its era to the
// backdrop and starts its scene.
//
// A scene is the beats of choreography.ts played by usePoseSequence: his rig carries him from where one
// beat ended to where the next ends (stage.module.css, the beat's --ms), and the rig's own animationend
// steps the sequence, so the beats are the only clock. Before the section shows, the rig is held on its
// first frame (data-run false); under reduced motion or in a preview it rests on the last frame.

interface RegionProps {
  title: string
  stageRef: Ref<HTMLElement>
  on: boolean
  /** The section holds finds, so the tally stands beside its title. */
  tally?: boolean
  children: ReactNode
}

export function Region({ title, stageRef, on, tally = false, children }: RegionProps) {
  const id = headingId('portals', title)
  return (
    <section ref={stageRef} data-on={on} aria-labelledby={id} className="relative z-10 mx-auto max-w-6xl scroll-mt-8 px-4 py-10 sm:px-6">
      <header className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 id={id} className={`${FACE} ${ART_PLATE} ${stage.levelName} text-3xl tracking-wide text-[color:var(--np-gold)] sm:text-4xl`}>
          {title}
        </h2>
        {tally && <Tally />}
      </header>
      {children}
    </section>
  )
}

/** A strip of the level, its art aria-hidden: `size` is its box (aspect-[3/1], h-56, h-40). */
export function Strip({ size, children }: { size: string; children: ReactNode }) {
  return (
    <div className={`relative mb-6 overflow-hidden rounded-xl ${size} ${stage.strip}`} aria-hidden="true">
      {children}
    </div>
  )
}

/** The row above a grid of cards where he does his part: no strip, he stands on the cards' top edge. */
export function FigureRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative mb-4 h-16 ${stage.row} ${className}`} aria-hidden="true">
      {children}
    </div>
  )
}

/** His size on a stage: a quarter of a strip's height (48 of 200), or the whole height of a figure row. */
export type RigSize = 'strip' | 'row'

const BODY_SIZE: Record<RigSize, string> = { strip: stage.inStrip, row: stage.inRow }

const motionVars = (motion: Motion) =>
  cssVars({ '--from-x': motion.from.x, '--from-lift': motion.from.lift, '--to-x': motion.to.x, '--to-lift': motion.to.lift, '--ms': motion.ms })

interface RigProps {
  motion: Motion
  /** The beat's key: a new beat restarts the rig's animation. */
  step: number
  run: boolean
  size: RigSize
  onAnimationEnd?: (event: AnimationEvent<HTMLDivElement>) => void
  /** A track of the scene's own in place of the beats' travel (a path scrubbed by scroll). */
  track?: string
  children?: ReactNode
}

/** His rig: the track carries him across the stage, the figure inside plays the pose. */
export function Rig({ motion, step, run, size, onAnimationEnd, track = stage.rig, children }: RigProps) {
  const { active } = useProfession()
  return (
    <div key={step} className={track} data-run={run} data-moving={motion.ms > 0} style={motionVars(motion)} onAnimationEnd={onAnimationEnd}>
      <div className={`${stage.body} ${BODY_SIZE[size]}`}>
        <Character profession={active} pose={motion.pose} />
      </div>
      {children}
    </div>
  )
}

interface ScenePlayOptions {
  /** Reduced motion or a preview: the scene rests on its last frame. */
  still: boolean
  /** The last beat has played out. */
  onDone?: () => void
}

export interface ScenePlay {
  motion: Motion
  step: number
  /** Whether a beat has started (or the scene is over). */
  reached: (name: string) => boolean
  onRigEnd: (event: AnimationEvent<HTMLDivElement>) => void
}

const REST = 'rest'

/** A scene's beats played by the shared pose sequence, each ended by the rig's own animationend. */
export function useScene(scene: Scene, { still, onDone }: ScenePlayOptions): ScenePlay {
  const names = useMemo(() => scene.beats.map((beat) => beat.name), [scene])
  const sequence = usePoseSequence<string>({ entrance: names, rest: REST })
  const last = names.length - 1
  const playing = names.indexOf(sequence.pose)
  const step = still || playing < 0 ? names.length : playing

  const onRigEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (step === last) onDone?.()
    sequence.advance()
  }

  return {
    motion: motionAt(scene, step),
    step,
    reached: (name) => step >= names.indexOf(name),
    onRigEnd,
  }
}

/** A scene the visitor can play again: the round keys the scene, and its button waits for it to end. */
export function useReplay(on: boolean, still: boolean) {
  const [round, setRound] = useState(0)
  const [ended, setEnded] = useState(-1)
  const end = useCallback(() => setEnded(round), [round])
  const replay = useCallback(() => setRound((now) => now + 1), [])
  return { round, playing: on && !still && ended !== round, end, replay }
}
