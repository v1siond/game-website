'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import type { Job } from '@/lib/cv/content'
import { FS } from './palette'
import { headingTo, pinFor, type Pin } from './route'
import { WorldMap } from './worldMap'
import { useScene } from './scenes'
import look from './world.module.css'
import living from './living.module.css'

// Work Experience as the arcade tour between stages: the world map rides along at the top of the list,
// a pin on each town he worked in, and the plane flies the dotted route from pin to pin as each job's
// round scrolls into view, turning to its heading on the way, with the job's company and town under
// the map. Scroll back up and it flies back. Each round reports itself through FlightStop.

const FlightContext = createContext<(index: number) => void>(() => undefined)

export function FlightStop({ index, children }: { index: number; children: ReactNode }) {
  const arrive = useContext(FlightContext)
  const { ref, inView } = useSectionTrigger({
    triggerOnce: false,
    threshold: 0.5,
    rootMargin: '-20% 0px -30% 0px',
  })

  useEffect(() => {
    if (inView) arrive(index)
  }, [inView, index, arrive])

  return <div ref={ref}>{children}</div>
}

function Plane({ at, heading }: { at: Pin; heading: number }) {
  return (
    <g className={living.plane} style={{ '--px': `${at[0]}px`, '--py': `${at[1]}px` } as CSSProperties}>
      <g transform={`rotate(${heading})`}>
        <path
          d="M9 0 L-7 -2 L-9 -7 L-11 -7 L-10 -1.5 L-12 0 L-10 1.5 L-11 7 L-9 7 L-7 2 Z"
          fill={FS.flash}
          stroke={FS.ink}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <path d="M2 -1 L-3 -9 L-5 -9 L-3 -1 M2 1 L-3 9 L-5 9 L-3 1" fill={FS.flash} stroke={FS.ink} strokeWidth={1} />
      </g>
    </g>
  )
}

export function FlightMap({ jobs, children }: { jobs: Job[]; children: ReactNode }) {
  const { ref } = useScene('market')
  const [{ stop, from }, setLeg] = useState({ stop: 0, from: 0 })
  const pins = useMemo(() => jobs.map((job) => pinFor(job.location)), [jobs])

  const arrive = useCallback((index: number) => setLeg((leg) => (leg.stop === index ? leg : { stop: index, from: leg.stop })), [])

  const job = jobs[stop]
  const route = pins.map((pin) => `${pin[0]} ${pin[1]}`).join(' L')

  return (
    <FlightContext.Provider value={arrive}>
      <div ref={ref}>
        <div className="sticky top-2 z-30 mb-6">
          <div className="relative mx-auto h-28 max-w-xl overflow-hidden border-2 border-white shadow-[0_0_0_2px_#000] sm:h-36" aria-hidden="true">
            <WorldMap>
              <path d={`M${route}`} fill="none" stroke={FS.flash} strokeWidth={1.4} strokeDasharray="2 3" />
              {pins.map((pin, i) => (
                <circle
                  key={jobs[i].id}
                  cx={pin[0]}
                  cy={pin[1]}
                  r={i === stop ? 3.6 : 2.4}
                  fill={i === stop ? FS.gold : FS.p2}
                  stroke={FS.ink}
                  strokeWidth={1}
                />
              ))}
              <Plane at={pins[stop]} heading={headingTo(pins[from], pins[stop])} />
            </WorldMap>
          </div>
          {job && (
            <p
              className={`mx-auto max-w-xl border-2 border-t-0 border-white bg-black px-3 py-1.5 text-center text-sm uppercase text-white ${look.display}`}
              aria-live="polite"
            >
              {job.company}, {job.location}
            </p>
          )}
        </div>
        {children}
      </div>
    </FlightContext.Provider>
  )
}
