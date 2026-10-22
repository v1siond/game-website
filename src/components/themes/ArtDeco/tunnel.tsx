'use client'

import { useState, type ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { useScrollScene } from '@/hooks/useScrollScene'
import { SurvivorSprite, type DecoMotion } from './sprite'
import { DECO_COLORS as C } from './palette'
import tunnel from './tunnel.module.css'

// The tech stack in one of the city's glass tunnels. Brass ribs arch over the glass, the sea is behind
// it with a whale gliding past, and three joints leak: a jet of water spits from each. He walks the
// tunnel floor from one end to the other as the visitor scrolls the section, then stops and rests. A
// leak is a button: a press seals it with a brass patch and the jet stops.
//
// Pattern: the shared scroll engine writes --scene-progress on the tunnel and his walk reads it in its
// translate; React renders only on the phase change (walking while the scene plays, the idle once done).
// The whale and the jets are CSS loops. Reduced motion: the scene starts done, he stands at the far end,
// no whale swim, the jets still; the patches still work.

const LEAKS = ['left-[22%]', 'left-[52%]', 'left-[80%]']
const RIBS = [0, 25, 50, 75, 100]

const MOTION_BY_PHASE: Record<'idle' | 'playing' | 'done', DecoMotion> = {
  idle: 'idle',
  playing: 'walk',
  done: 'idle',
}

function Sea() {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="deco-tunnel-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d5a52" />
          <stop offset="0.6" stopColor="#0e3a3a" />
          <stop offset="1" stopColor={C.abyss} />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#deco-tunnel-sea)" />
      <path d="M0 170 Q60 150 120 168 T260 160 T400 166 V200 H0 Z" fill="#08201f" />
      <path d="M30 170 V120 M36 168 V132 M330 166 V110 M338 164 V128" stroke="#0f3a2e" strokeWidth="3" />
    </svg>
  )
}

function Whale() {
  return (
    <svg viewBox="0 0 200 70" className="h-full w-full" aria-hidden="true" focusable="false">
      <path d="M10 36 Q40 10 110 14 Q150 16 170 30 L192 16 L186 36 L196 54 L168 42 Q140 60 96 58 Q36 56 10 36 Z" fill="#0b2e33" />
      <path d="M30 44 Q80 62 140 50" fill="none" stroke="#1b4a50" strokeWidth="3" />
      <path d="M80 56 L66 68 L96 58 Z" fill="#0b2e33" />
      <circle cx="28" cy="34" r="2" fill={C.waterGlow} opacity="0.6" />
    </svg>
  )
}

// The arched ribs of the tunnel over the glass, each a gold rib with a rivet line.
function Ribs() {
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path d="M0 8 Q200 -6 400 8" fill="none" stroke={C.brassMid} strokeWidth="8" />
      {RIBS.map((x) => (
        <path key={x} d={`M${x * 4} 0 V200`} stroke={C.brassDark} strokeWidth="7" opacity="0.9" />
      ))}
      <path d="M0 196 H400" stroke={C.brassMid} strokeWidth="6" />
    </svg>
  )
}

/** The tech stack's glass tunnel with him walking its floor. */
export function GlassTunnel({ children }: { children: ReactNode }) {
  const { deco } = useLabels()
  const { ref, phase } = useScrollScene<HTMLDivElement>({ start: 0.85, end: 0.05 })
  const [sealed, setSealed] = useState<ReadonlySet<number>>(new Set())

  const seal = (index: number) => setSealed((now) => new Set(now).add(index))

  return (
    <div ref={ref} className={`relative overflow-hidden ${tunnel.tube}`}>
      <Sea />
      <div className={`pointer-events-none absolute left-0 top-[12%] h-24 w-64 ${tunnel.whale}`}>
        <Whale />
      </div>
      <Ribs />

      {LEAKS.map((place, index) => (
        <button
          key={place}
          type="button"
          onClick={() => seal(index)}
          disabled={sealed.has(index)}
          aria-label={deco.sealLeak}
          data-sealed={sealed.has(index) || undefined}
          className={`absolute top-1 z-10 h-11 w-11 -translate-x-1/2 ${place} ${tunnel.leak}`}
        >
          <span className={`absolute left-1/2 top-3 h-10 w-2 -translate-x-1/2 ${tunnel.jet}`} aria-hidden="true" />
          <span className={`absolute left-1/2 top-2 h-4 w-6 -translate-x-1/2 ${tunnel.patch}`} aria-hidden="true" />
        </button>
      ))}

      <div className={`relative z-[5] mx-3 mt-14 p-4 sm:mx-8 sm:p-6 ${tunnel.glass}`}>{children}</div>

      <div className={`relative h-36 ${tunnel.floor}`} aria-hidden="true">
        <div className={`absolute bottom-1 left-0 h-32 w-20 ${tunnel.walker}`}>
          <SurvivorSprite profession="engineer" motion={MOTION_BY_PHASE[phase]} className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}
