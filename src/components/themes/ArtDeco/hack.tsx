'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { prefersReducedMotion, useReducedMotion } from '@/hooks/useReducedMotion'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import { SurvivorSprite, type DecoMotion } from './sprite'
import { DECO_COLORS as C } from './palette'
import hack from './hack.module.css'

// Projects behind the city's security shutter, opened by the hacking pipe puzzle. A brass hack panel
// sits over the shutter: a valve, a row of pipe tiles and the lock. When the panel comes into view the
// water starts along the row, a tile every FLOW_MS. Some tiles start turned across the line and the
// water stops there with a spark; he steps up with the wrench and, after a beat, knocks the tile back
// into line (the autohack), or the visitor turns it first with a click or Enter. Turning a tile the
// water already passed cuts the flow there again. When the water reaches the lock it clicks open and
// the shutter rolls up on the project board, and the board's own arrival plays from that first opening
// (the board is a render prop that gets the opened flag).
//
// Pattern: React state for the turned tiles and how far the water got, one setTimeout per step (the
// flow, or his knock); his swing is the shared usePoseSequence move. The visuals (tile turn, water
// fill, spark, lock, shutter) are CSS off data attributes. The board stays in the document under the
// shutter, so screen readers read it from the start. Reduced motion: every tile in line, the lock open
// and the shutter up at once; turning still works without the motion.

const FLOW_MS = 450
const KNOCK_MS = 900
const TILES = 5
const TURNED_AT_START: ReadonlySet<number> = new Set([1, 3])

const startTurned = (): boolean[] => Array.from({ length: TILES }, (_, i) => !prefersReducedMotion() && TURNED_AT_START.has(i))

function PipeTile({ index, turned, flowed, stopped, onTurn, label }: { index: number; turned: boolean; flowed: boolean; stopped: boolean; onTurn: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onTurn}
      aria-label={label}
      aria-pressed={!turned}
      data-turned={turned || undefined}
      data-flowed={flowed || undefined}
      className={`relative h-11 w-11 flex-shrink-0 sm:h-16 sm:w-16 ${hack.tile}`}
      style={{ '--i': index } as CSSProperties}
    >
      <svg viewBox="0 0 64 64" className={`h-full w-full ${hack.pipe}`} aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="60" height="60" rx="6" fill={C.abyss} stroke={C.brassDark} strokeWidth="2" />
        <path d="M0 32 H64" stroke={C.brassMid} strokeWidth="16" />
        <path d="M0 32 H64" stroke={C.waterGlow} strokeWidth="8" className={hack.water} />
        <path d="M14 20 V44 M50 20 V44" stroke={C.gold} strokeWidth="4" />
        <circle cx="32" cy="32" r="7" fill={C.brassDark} stroke={C.gold} strokeWidth="2" />
      </svg>
      {stopped && <span className={`pointer-events-none absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full ${hack.spark}`} aria-hidden="true" />}
    </button>
  )
}

// The lock at the end of the line: a brass padlock whose shackle lifts once the water reaches it.
function Lock({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 40 52" className="h-12 w-10 flex-shrink-0 sm:h-14 sm:w-11" aria-hidden="true" focusable="false">
      <g className={hack.shackle} data-open={open || undefined}>
        <path d="M10 24 V14 Q10 4 20 4 Q30 4 30 14 V24" fill="none" stroke={C.steel} strokeWidth="5" />
      </g>
      <rect x="4" y="22" width="32" height="28" rx="4" fill={C.gold} stroke={C.brassDark} strokeWidth="2" />
      <circle cx="20" cy="34" r="4" fill={open ? C.vita : C.abyss} />
      <path d="M20 36 V44" stroke={open ? C.vita : C.abyss} strokeWidth="3" />
    </svg>
  )
}

// The shutter's crest: a brass sunburst over the top slats. A fixed size, the slats are CSS at a fixed pitch
// so a tall board keeps them shutter sized.
function ShutterCrest() {
  return (
    <svg viewBox="0 0 160 80" className="absolute left-1/2 top-6 h-20 w-40 -translate-x-1/2" aria-hidden="true" focusable="false">
      <path d="M10 80 A70 70 0 0 1 150 80 Z" fill={C.sepia} stroke={C.gold} strokeWidth="2" />
      {[-72, -48, -24, 0, 24, 48, 72].map((angle) => (
        <path key={angle} d="M80 80 V22" stroke={C.gold} strokeWidth="2" transform={`rotate(${angle} 80 80)`} />
      ))}
      <path d="M50 80 A30 30 0 0 1 110 80 Z" fill={C.gold} />
    </svg>
  )
}

/** The project board under a shutter that the pipe hack lifts; the board learns when the shutter first opened. */
export function HackedShutter({ children }: { children: (opened: boolean) => ReactNode }) {
  const { deco } = useLabels()
  const reduced = useReducedMotion()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.6 })
  const [turned, setTurned] = useState(startTurned)
  const [flow, setFlow] = useState(0)
  const { pose, play, advance } = usePoseSequence<DecoMotion>({ entrance: [], rest: 'idle', still: 'still', policy: 'always' })

  const done = flow >= TILES
  // Latched: knocking a tile out again closes the shutter but the board, once arrived, stays arrived.
  const [opened, setOpened] = useState(false)
  if (done && !opened) setOpened(true)
  const stopped = triggered && !done && turned[flow]

  const turn = (index: number) => {
    setTurned((current) => current.map((value, i) => (i === index ? !value : value)))
    setFlow((current) => Math.min(current, index))
  }

  useEffect(() => {
    if (!triggered || done || turned[flow]) return
    const timer = window.setTimeout(() => setFlow(flow + 1), reduced ? 0 : FLOW_MS)
    return () => window.clearTimeout(timer)
  }, [triggered, flow, done, turned, reduced])

  // His autohack: stopped at a turned tile, he knocks it back into line with the wrench after a beat.
  useEffect(() => {
    if (!stopped) return
    const timer = window.setTimeout(() => {
      play('swing')
      setTurned((current) => current.map((value, i) => (i === flow ? false : value)))
    }, KNOCK_MS)
    return () => window.clearTimeout(timer)
  }, [stopped, flow, play])

  const status = done ? deco.flowDone : stopped ? deco.flowWaiting : ''

  return (
    <div data-on={triggered || undefined} data-open={done || undefined} className={hack.works}>
      <div ref={ref} className={`relative mx-auto mb-6 flex max-w-2xl flex-col items-center gap-2 p-3 sm:flex-row sm:items-end sm:gap-4 sm:p-5 ${hack.panel}`}>
        <div className="h-28 w-[4.7rem] flex-shrink-0 sm:h-32 sm:w-20" aria-hidden="true">
          <SurvivorSprite profession="engineer" motion={pose} onDone={advance} className="h-full w-full" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex items-center">
            <span className={`h-4 w-3 flex-shrink-0 ${hack.valve}`} aria-hidden="true" />
            {turned.map((isTurned, index) => (
              <PipeTile
                key={index}
                index={index}
                turned={isTurned}
                flowed={flow > index}
                stopped={stopped && flow === index}
                onTurn={() => turn(index)}
                label={fillLabel(deco.turnPipe, { n: index + 1 })}
              />
            ))}
            <Lock open={done} />
          </div>
          <p role="status" aria-live="polite" className={`min-h-[1.5rem] text-center text-sm uppercase tracking-[0.15em] ${hack.status}`}>
            {status}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {children(opened)}
        <div className={`pointer-events-none absolute inset-0 ${hack.shutter}`} aria-hidden="true">
          <ShutterCrest />
        </div>
      </div>
    </div>
  )
}
