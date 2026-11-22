'use client'

import { useState, type ReactNode } from 'react'
import { FS } from './palette'
import wreck from './wreck.module.css'

// About, the wreck's wheel: when the bonus stage car comes apart (CarSmash's wreck beat, its rising
// uppercut) one wheel flies out of the ring's bottom edge, arcs down onto the summary's top edge, bounces
// once and rolls off fading (700 ms); the summary jolts down and back in steps as it lands (240 ms at
// 300 ms). Pattern: mounted on the wreck, keyed on the take the wreck beat played in (CarSmash works it
// out, every beat bumps the take), so a replay of the bout throws it again and the win beat after it does not, and unmounted on its own animationend. The summary is never hidden. CarSmash passes wrecked as
// false under reduced motion, so it shows neither the wheel nor the jolt. Transforms and opacity only (wreck.module.css).

function Wheel({ onDone }: { onDone: () => void }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-20 ${wreck.lane}`} aria-hidden="true">
      <span className={`absolute bottom-0 block h-10 w-10 sm:h-12 sm:w-12 ${wreck.place}`}>
        <svg viewBox="-13 -13 26 26" className={`block h-full w-full ${wreck.wheel}`} onAnimationEnd={onDone} focusable="false">
          <circle r={11.5} fill={FS.ink} stroke={FS.chrome} strokeWidth={1.2} />
          <circle r={5} fill={FS.chrome} />
          <path d="M0 -10 V-6 M0 6 V10 M-10 0 H-6 M6 0 H10" stroke={FS.chrome} strokeWidth={1.6} />
        </svg>
      </span>
    </div>
  )
}

export function WheelStrike({ wrecked, take, children }: { wrecked: boolean; take: number; children: ReactNode }) {
  const [landed, setLanded] = useState(-1)
  const flying = wrecked && landed !== take

  return (
    <div className="relative">
      <div key={`summary-${take}`} className={wrecked ? wreck.jolt : ''}>
        {children}
      </div>
      {flying && <Wheel key={`wheel-${take}`} onDone={() => setLanded(take)} />}
    </div>
  )
}
