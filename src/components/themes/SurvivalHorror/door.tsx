'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import { SH } from './palette'
import horror from './horror.module.css'

// The world's one transition, the genre's door loading screen: the screen goes black on a single panelled
// door, it creaks a little, then swings open away from the camera, and the view passes through it into the
// next room. The page opens with it (the hero's entrance), and every profession change goes through it:
// door(change) runs the change while the screen is covered, so the new room is already there when the
// door opens. Reduced motion and the World Select preview make the change with no door.
//
// Phases by setTimeout: cover (the black and the shut door fade in, or start in place for the entrance),
// shut (the creak), open (the swing), through (the dolly through the frame), clear.

type DoorPhase = 'clear' | 'cover' | 'shut' | 'open' | 'through'

const COVER_MS = 260
const SHUT_MS = 520
const OPEN_MS = 1000
const THROUGH_MS = 600

/** How long the page's opening door takes, so the hall can start its own beat when it ends. */
export const ENTRANCE_MS = SHUT_MS + OPEN_MS + THROUGH_MS

const PHASE_LOOK: Record<DoorPhase, string> = {
  clear: 'hidden',
  cover: horror.doorCover,
  shut: '',
  open: horror.doorOpen,
  through: `${horror.doorOpen} ${horror.doorThrough}`,
}

type Door = (behind?: () => void) => void

const DoorContext = createContext<Door>((behind) => behind?.())

export const useDoor = () => useContext(DoorContext)

function DoorArt() {
  return (
    <div className={horror.doorWay}>
      <svg viewBox="0 0 120 200" className="absolute inset-0 h-full w-full" focusable="false">
        <defs>
          <radialGradient id="sh-door-beyond" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor={SH.flame} stopOpacity={0.55} />
            <stop offset="100%" stopColor={SH.void} />
          </radialGradient>
        </defs>
        <rect x={8} y={6} width={104} height={194} fill={SH.wood} />
        <rect x={14} y={12} width={92} height={188} fill="url(#sh-door-beyond)" />
        <path d="M8 6 H112 V12 H8 Z" fill={SH.sepia} />
      </svg>
      <div className={horror.doorLeaf}>
        <svg viewBox="0 0 92 188" className="h-full w-full" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="sh-door-wood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={SH.rust} />
              <stop offset="50%" stopColor={SH.wood} />
              <stop offset="100%" stopColor={SH.sepia} />
            </linearGradient>
          </defs>
          <rect width={92} height={188} fill="url(#sh-door-wood)" />
          <rect x={10} y={12} width={72} height={70} fill="none" stroke={SH.sepia} strokeWidth={3} />
          <rect x={10} y={98} width={72} height={78} fill="none" stroke={SH.sepia} strokeWidth={3} />
          <rect x={16} y={18} width={60} height={58} fill={SH.sepia} opacity={0.35} />
          <rect x={16} y={104} width={60} height={66} fill={SH.sepia} opacity={0.35} />
          <circle cx={80} cy={96} r={4} fill={SH.brass} />
          <circle cx={79} cy={95} r={1.4} fill={SH.ivory} opacity={0.7} />
          <rect x={77} y={102} width={5} height={8} rx={1} fill={SH.void} opacity={0.6} />
        </svg>
      </div>
    </div>
  )
}

export function DoorProvider({ children }: { children: ReactNode }) {
  const preview = usePreview()
  const [phase, setPhase] = useState<DoorPhase>(preview ? 'clear' : 'shut')
  const timers = useRef<number[]>([])

  const play = useCallback((from: number) => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = [
      window.setTimeout(() => setPhase('open'), from + SHUT_MS),
      window.setTimeout(() => setPhase('through'), from + SHUT_MS + OPEN_MS),
      window.setTimeout(() => setPhase('clear'), from + SHUT_MS + OPEN_MS + THROUGH_MS),
    ]
  }, [])

  // The page's entrance: the door is already shut on the black when the page paints.
  useEffect(() => {
    if (preview || prefersReducedMotion()) {
      setPhase('clear')
      return
    }
    play(0)
  }, [preview, play])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const door = useCallback<Door>(
    (behind) => {
      if (preview || prefersReducedMotion()) {
        behind?.()
        return
      }
      setPhase('cover')
      play(COVER_MS)
      timers.current.push(
        window.setTimeout(() => {
          setPhase('shut')
          behind?.()
        }, COVER_MS),
      )
    },
    [preview, play],
  )

  return (
    <DoorContext.Provider value={door}>
      {children}
      <div className={`pointer-events-none fixed inset-0 z-[70] bg-[color:var(--sh-void)] ${horror.door} ${PHASE_LOOK[phase]}`} aria-hidden="true">
        <DoorArt />
      </div>
    </DoorContext.Provider>
  )
}
