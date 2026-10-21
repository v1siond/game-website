'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { prefersReducedMotion, useReducedMotion } from '@/hooks/useReducedMotion'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { fillLabel } from '@/lib/cv/labels'
import type { MartialArts } from '@/lib/cv/content'
import { DECO_COLORS as C } from './palette'
import circuit from './circuit.module.css'

// The Muay Thai record as the city's pipe works. The facts sit on brass plaques; the achievements are
// the stations of one pipe line running down from a valve. When the line comes into view the water
// starts down it, a tile every FLOW_MS, and every station it reaches lights up. Some pipe tiles start
// turned across the line: the water stops there with a spark, the status says so, and a click (or Enter)
// turns the tile back into line so the flow goes on. Turning a tile the water already passed cuts the
// flow there again. When the water reaches the end the circuit reads complete.
//
// Pattern: React state for the turned tiles and how far the water got, one setTimeout per step. The
// visuals (tile rotation, water fill, station lamp, spark) are CSS off data attributes. Reduced motion:
// every tile starts in line and the water fills at once; turning still works, without the motion.

const FLOW_MS = 900

const startTurned = (count: number): boolean[] =>
  Array.from({ length: count }, (_, i) => !prefersReducedMotion() && i % 2 === 1)

function PipeTile({ index, turned, flowed, onTurn, label }: { index: number; turned: boolean; flowed: boolean; onTurn: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onTurn}
      aria-label={label}
      data-turned={turned || undefined}
      data-flowed={flowed || undefined}
      className={`relative z-10 h-16 w-16 flex-shrink-0 ${circuit.tile}`}
      style={{ '--i': index } as CSSProperties}
    >
      <svg viewBox="0 0 64 64" className={`h-full w-full ${circuit.pipe}`} aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="60" height="60" rx="6" fill={C.abyss} stroke={C.brassDark} strokeWidth="2" />
        <path d="M32 0 V64" stroke={C.brassMid} strokeWidth="16" />
        <path d="M32 0 V64" stroke={C.waterGlow} strokeWidth="8" className={circuit.water} />
        <path d="M20 14 H44 M20 50 H44" stroke={C.gold} strokeWidth="4" />
        <circle cx="32" cy="32" r="7" fill={C.brassDark} stroke={C.gold} strokeWidth="2" />
      </svg>
    </button>
  )
}

/** The facts on plaques and the achievements on a pipe line the visitor keeps flowing. */
export function PipeCircuit({ martialArts }: { martialArts: MartialArts }) {
  const { deco } = useLabels()
  const achievements = martialArts.primary.achievements
  const count = achievements.length
  const reduced = useReducedMotion()
  const { ref, triggered } = useSectionTrigger()
  const [turned, setTurned] = useState(() => startTurned(count))
  const [flow, setFlow] = useState(0)

  useEffect(() => {
    if (!triggered || flow >= count || turned[flow]) return
    const timer = window.setTimeout(() => setFlow(flow + 1), reduced ? 0 : FLOW_MS)
    return () => window.clearTimeout(timer)
  }, [triggered, flow, count, turned, reduced])

  const turn = (index: number) => {
    setTurned((current) => current.map((value, i) => (i === index ? !value : value)))
    setFlow((current) => Math.min(current, index))
  }

  const stopped = triggered && flow < count && turned[flow]
  const status = flow >= count ? deco.flowDone : stopped ? deco.flowWaiting : ''

  return (
    <div ref={ref} data-on={triggered || undefined} className={circuit.works}>
      <MuayThaiRecord
        martialArts={martialArts}
        classNames={{
          facts: 'mb-10 grid gap-4 sm:grid-cols-2',
          fact: `relative px-5 py-4 ${circuit.plaque}`,
          term: `text-sm uppercase tracking-[0.2em] ${circuit.term}`,
          value: 'mt-1 text-base text-[color:var(--deco-cream)]',
          achievements: `relative ${circuit.line}`,
          achievement: 'relative',
        }}
        renderAchievement={(achievement) => {
          const index = achievements.indexOf(achievement)
          const flowed = flow > index
          return (
            <div data-flowed={flowed || undefined} data-stopped={(stopped && flow === index) || undefined} className={`flex items-center gap-4 py-2 ${circuit.station}`}>
              <span className={`pointer-events-none absolute bottom-0 left-8 top-0 w-2 -translate-x-1/2 ${circuit.main}`} aria-hidden="true">
                <span className={`absolute inset-0 origin-top ${circuit.mainWater}`} />
              </span>
              <div className="relative">
                <PipeTile
                  index={index}
                  turned={turned[index]}
                  flowed={flowed}
                  onTurn={() => turn(index)}
                  label={fillLabel(deco.turnPipe, { achievement })}
                />
                <span className={`pointer-events-none absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full ${circuit.spark}`} aria-hidden="true" />
              </div>
              <p className={`flex-1 px-4 py-3 text-base ${circuit.stationPlate}`}>
                <span className={`mr-3 inline-block h-3 w-3 rounded-full align-middle ${circuit.lamp}`} aria-hidden="true" />
                {achievement}
              </p>
            </div>
          )
        }}
      />
      <p role="status" aria-live="polite" className={`mt-6 min-h-[1.5rem] text-center text-base uppercase tracking-[0.15em] ${circuit.status}`}>
        {status}
      </p>
    </div>
  )
}
