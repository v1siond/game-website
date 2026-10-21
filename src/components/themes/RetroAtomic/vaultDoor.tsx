'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { usePreview } from '@/themes/PreviewContext'
import { BRASS, INK, SHELTER_YELLOW, STEEL, STEEL_EDGE, STEEL_LIGHT, WARNING_RED, CHROME, RUBBER } from './palette'
import atomic from './atomic.module.css'

// The hero entrance: the shelter's round cog door, closed over the page when it loads. The pattern is
// setTimeout phases, each phase a data-phase value the CSS keys its transitions off (transform and
// opacity only), so the browser runs the motion and React only flips the phase:
//   sealed   0 ms     the two warning beacons turn, the red lamps pulse
//   unbolt   450 ms   the ring of locking bolts pulls into the rim (one group, scaled)
//   pull     800 ms   the door's piston draws it back out of the frame (scale down, the seam ring shows)
//   roll     1300 ms  it rolls aside on its track, turning as it goes (1100 ms, ease in out)
//   enter    2350 ms  the light from the opening floods the screen and the wall falls away past the camera
//   done     2850 ms  the overlay is gone; the wrist terminal boots
// A click, a key or the skip button jumps to done, so a recruiter is never held. Reduced motion and the
// World Select preview start at done. It plays once per visit of the world.

type DoorPhase = 'sealed' | 'unbolt' | 'pull' | 'roll' | 'enter' | 'done'

const PHASES: ReadonlyArray<readonly [DoorPhase, number]> = [
  ['unbolt', 450],
  ['pull', 800],
  ['roll', 1300],
  ['enter', 2350],
  ['done', 2850],
]

const TEETH = 12
const BOLTS = 10

// The cog outline: twelve square teeth round a 180 unit disc, in a 400 by 400 box.
const COG = Array.from({ length: TEETH }, (_, tooth) => {
  const step = (Math.PI * 2) / TEETH
  const at = (angle: number, radius: number) => `${(200 + Math.cos(angle) * radius).toFixed(1)} ${(200 + Math.sin(angle) * radius).toFixed(1)}`
  const start = tooth * step
  return `${tooth === 0 ? 'M' : 'L'}${at(start, 178)} L${at(start + step * 0.12, 196)} L${at(start + step * 0.42, 196)} L${at(start + step * 0.54, 178)} L${at(start + step, 178)}`
}).join(' ').concat(' Z')

/** The door itself, drawn in depth: cog rim, hazard ring, the recessed face with its plates, the hub wheel. */
export function DoorArt({ className = '' }: { className?: string }) {
  const id = `atomic-door${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const face = `${id}-face`
  const rim = `${id}-rim`
  const hazard = `${id}-hazard`
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={face} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={STEEL_EDGE} />
          <stop offset="55%" stopColor={STEEL_LIGHT} />
          <stop offset="100%" stopColor={STEEL} />
        </radialGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={CHROME} />
          <stop offset="45%" stopColor={STEEL_LIGHT} />
          <stop offset="100%" stopColor={RUBBER} />
        </linearGradient>
        <pattern id={hazard} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="24" height="24" fill={INK} />
          <rect width="12" height="24" fill={SHELTER_YELLOW} />
        </pattern>
      </defs>
      <path d={COG} fill={`url(#${rim})`} stroke={RUBBER} strokeWidth="3" />
      <circle cx="200" cy="200" r="168" fill={`url(#${hazard})`} />
      <circle cx="200" cy="200" r="150" fill={`url(#${face})`} stroke={RUBBER} strokeWidth="4" />
      {/* the face's welded plates and their rivets */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 200 200)`}>
          <path d="M200 58 L200 128" stroke={RUBBER} strokeWidth="3" opacity="0.6" />
          <circle cx="200" cy="66" r="4" fill={CHROME} stroke={RUBBER} strokeWidth="1.5" />
          <circle cx="200" cy="112" r="3" fill={CHROME} stroke={RUBBER} strokeWidth="1.5" />
        </g>
      ))}
      <circle cx="200" cy="200" r="96" fill="none" stroke={RUBBER} strokeWidth="5" opacity="0.55" />
      <circle cx="200" cy="200" r="92" fill="none" stroke={STEEL_EDGE} strokeWidth="2" />
      {/* the hub wheel the piston turns: rim, four spokes, the brass centre */}
      <circle cx="200" cy="200" r="58" fill="none" stroke={CHROME} strokeWidth="9" />
      {[0, 45, 90, 135].map((angle) => (
        <rect key={angle} x="194" y="140" width="12" height="120" rx="4" fill={STEEL_EDGE} stroke={RUBBER} strokeWidth="2" transform={`rotate(${angle} 200 200)`} />
      ))}
      <circle cx="200" cy="200" r="22" fill={BRASS} stroke={RUBBER} strokeWidth="3" />
      <circle cx="193" cy="193" r="7" fill={SHELTER_YELLOW} opacity="0.6" />
    </svg>
  )
}

/** The ring of locking bolts round the frame, pulled in as one group at unbolt. */
function Bolts() {
  return (
    <svg viewBox="0 0 400 400" className={`absolute inset-0 h-full w-full ${atomic.doorBolts}`} aria-hidden="true" focusable="false">
      {Array.from({ length: BOLTS }, (_, bolt) => (
        <rect key={bolt} x="192" y="0" width="16" height="30" rx="3" fill={CHROME} stroke={RUBBER} strokeWidth="2" transform={`rotate(${(360 / BOLTS) * bolt} 200 200)`} />
      ))}
    </svg>
  )
}

function Beacon({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`absolute top-[8%] h-14 w-14 sm:h-20 sm:w-20 ${side === 'left' ? 'left-[6%]' : 'right-[6%]'}`} aria-hidden="true">
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full" focusable="false">
        <rect x="18" y="58" width="44" height="14" rx="3" fill={STEEL} stroke={RUBBER} strokeWidth="2" />
        <path d="M22 58 Q22 18 40 18 Q58 18 58 58 Z" fill={WARNING_RED} opacity="0.85" />
      </svg>
      <span className={`absolute inset-0 ${atomic.beaconSweep}`} />
    </div>
  )
}

interface VaultEntranceProps {
  onOpened: () => void
}

export function VaultEntrance({ onOpened }: VaultEntranceProps) {
  const { hud } = useLabels()
  const preview = usePreview()
  const [phase, setPhase] = useState<DoorPhase>(preview ? 'done' : 'sealed')
  const opened = useRef(false)

  // Report done exactly once, whichever way it got there (timer, skip, preview).
  useEffect(() => {
    if (phase !== 'done' || opened.current) return
    opened.current = true
    onOpened()
  }, [phase, onOpened])

  useEffect(() => {
    if (preview) return
    const timers = PHASES.map(([next, at]) => window.setTimeout(() => setPhase(next), at))
    const skip = () => setPhase('done')
    window.addEventListener('keydown', skip)
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener('keydown', skip)
    }
  }, [preview])

  if (phase === 'done') return null

  return (
    <div className={`fixed inset-0 z-[90] overflow-hidden ${atomic.doorWall}`} data-phase={phase} onClick={() => setPhase('done')} role="presentation">
      <Beacon side="left" />
      <Beacon side="right" />
      <div className={`absolute inset-0 ${atomic.doorLight}`} aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 aspect-square w-[min(82vw,74vh)] -translate-x-1/2 -translate-y-1/2">
        <div className={`absolute -inset-[6%] rounded-full ${atomic.doorFrame}`} aria-hidden="true" />
        <Bolts />
        <div className={`absolute inset-0 ${atomic.door}`}>
          <DoorArt className="h-full w-full" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPhase('done')}
        className={`absolute bottom-6 right-6 min-h-[44px] border-2 border-atomic-yellow bg-atomic-ink px-4 text-sm font-bold uppercase tracking-widest text-atomic-yellow ${atomic.focusRing}`}
      >
        {hud.skipIntro}
      </button>
    </div>
  )
}
