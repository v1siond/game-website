'use client'

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { createValueStore, useStoreValue, useZoneStage, type ValueStore } from '@/hooks/useZoneStage'
import { Survivor } from './survivor'
import { STALKER_BOX, Stalker } from './stalker'
import { RoomArt } from './rooms'
import { Magazine, Props } from './props'
import { ENTRANCE_MS } from './door'
import type { Condition } from './ecg'
import { FAR_SCALE, apply, lastFrame, playKey, scriptFor, startFrame, type Frame, type Zone } from './scripts'
import look from './world.module.css'
import stage from './stage.module.css'

// The house behind the page, the way the genre is played: one fixed camera per room and a hard cut between
// rooms. The stage is fixed under the whole page; each part of the page is a window onto it (RoomWindow,
// a gap of bare stage above the part), and the part in view picks the room (useZoneStage). In each room
// he, and the pursuer when the room has him, play the room's script once (./scripts) and then hold still
// (one breath as the house first shows, ./rig). The page's panels sit over the stage, so the figures are seen in the gaps as the visitor
// scrolls, never over the text.
//
// Layers, back to front: the room (./rooms), the night behind the corridor glass, the pursuer far behind
// it, the glass, the props (./props), the pursuer near, him, the camera vignette and grain, the black cut.
// Everything is placed from his feet at the left of the screen in his body widths; nothing here takes the
// pointer, and the whole stage is hidden from assistive technology (the page carries every fact).

// The herbs used: none, the green one, then the red one mixed into it.
export type Herbs = 0 | 1 | 2

interface StageTally {
  herbs: Herbs
  saves: number
}

interface StageState {
  tally: ValueStore<StageTally>
  takeHerbs(count: Herbs): void
  save(): void
}

/**
 * The herbs used in the gym and the saves at the typewriter, kept in a store per mount of the world so a
 * herb or a save re-renders only the stage and the two panels that read them, not the whole page.
 */
export function createStageState(): StageState {
  const tally = createValueStore<StageTally>({ herbs: 0, saves: 0 })

  return {
    tally,
    takeHerbs: (herbs) => {
      if (herbs === tally.read().herbs) return
      tally.write({ ...tally.read(), herbs })
    },
    save: () => tally.write({ ...tally.read(), saves: tally.read().saves + 1 }),
  }
}

const StageContext = createContext<StageState | null>(null)

export const StageProvider = StageContext.Provider

/** The herbs and the saves the stage plays, with the two ways to change them. */
export function useStageState() {
  const state = useContext(StageContext)
  if (state === null) throw new Error('useStageState must be used within a StageProvider (SurvivalHorrorTheme renders it)')
  const { herbs, saves } = useStoreValue(state.tally)
  return { herbs, saves, takeHerbs: state.takeHerbs, save: state.save }
}

// His condition after each count of herbs, indexed by the count.
const CONDITION = ['danger', 'caution', 'fine'] as const satisfies readonly Condition[]

export const conditionAfter = (herbs: Herbs): Condition => CONDITION[herbs]

/** A part of the page as a window onto its room: a gap of bare stage, then the part. */
export function RoomWindow({ zone, children, className = '' }: { zone: Zone; children: ReactNode; className?: string }) {
  const { ref } = useZoneStage<Zone>(zone)

  return (
    <div ref={ref} className={className}>
      <div className="h-[34vh]" aria-hidden="true" />
      {children}
    </div>
  )
}

// The corridor rooms, where the pursuer passes behind the long window.
const GLASS: ReadonlySet<Zone> = new Set(['experience', 'bands'])

const heroVars = (frame: Frame) => ({ '--x': frame.x, '--move': `${frame.move}ms`, '--tempo': `${frame.tempo}ms` }) as CSSProperties
const foeVars = (frame: Frame) =>
  ({
    '--x': frame.fx,
    '--move': `${frame.fmove}ms`,
    '--tempo': `${frame.ftempo}ms`,
    '--foe-w': STALKER_BOX.width,
    '--foe-h': STALKER_BOX.height,
    '--far': FAR_SCALE,
  }) as CSSProperties

interface StageProps {
  zones: ValueStore<Zone>
  profession: Profession
  reduced: boolean
  // The World Select preview: the hall's last frame, nothing played.
  still: boolean
}

export function Stage({ zones, profession, reduced, still }: StageProps) {
  const inView = useStoreValue(zones)
  const zone = still ? 'hall' : inView
  const { herbs, saves } = useStageState()
  const condition = conditionAfter(herbs)
  const played = useRef(new Set<string>())
  const [frame, setFrame] = useState<Frame>(() => lastFrame(scriptFor('hall', { profession, condition, saves, entrance: 0 })))
  // The room shows its last frame without playing (seen before, the preview, reduced motion): its one shot
  // swings stay at rest instead of playing again on the remount.
  const [replayed, setReplayed] = useState(false)

  useEffect(() => {
    const context = { profession, condition, saves, entrance: ENTRANCE_MS - 200 }
    const script = scriptFor(zone, context)
    const key = playKey(zone, context)
    if (still || reduced || played.current.has(key)) {
      setFrame(lastFrame(script))
      setReplayed(true)
      return
    }
    played.current.add(key)
    setReplayed(false)
    setFrame(startFrame(script))
    const timers = script.beats.map((beat) => window.setTimeout(() => setFrame((current) => apply(current, beat)), beat.at))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [zone, profession, condition, saves, reduced, still])

  const glass = GLASS.has(zone)
  const foe = frame.foe && (
    <div className={`${stage.actor} ${stage.walker}`} style={foeVars(frame)}>
      <div className={`${stage.foe} ${frame.far ? stage.far : ''}`}>
        <Stalker pose={frame.foe} className={`h-full w-full ${frame.fface < 0 ? '-scale-x-100' : ''}`} />
      </div>
    </div>
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <RoomArt zone={zone} flags={frame.flags} replayed={replayed} />
      {glass && (
        <div className={stage.anchor}>
          <div className={stage.night} />
        </div>
      )}
      <div className={stage.anchor}>{frame.far && foe}</div>
      {glass && (
        <div className={stage.anchor}>
          <div className={stage.glass} />
        </div>
      )}
      <div className={stage.anchor}>
        <Props zone={zone} flags={frame.flags} />
        {!frame.far && foe}
        <div data-worlds-figure="" className={`${stage.actor} ${stage.walker} ${frame.gone ? stage.gone : ''}`} style={heroVars(frame)}>
          <Survivor profession={profession} pose={frame.hero} laser={frame.flags.laser} className={`h-full w-full ${frame.face < 0 ? '-scale-x-100' : ''}`} />
          {zone === 'tech' && <Magazine dropped={frame.flags.dropped} />}
        </div>
      </div>
      <div className={`absolute inset-0 ${look.vignette}`} />
      <div className={`absolute inset-0 ${look.grain}`} />
      <div key={`${zone}-${frame.flags.inside}`} className={stage.cut} />
    </div>
  )
}
