'use client'

import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { usePoseSequence } from '@/hooks/usePoseSequence'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { SurvivorSprite, type DecoMotion } from './sprite'
import { DECO_COLORS as C } from './palette'
import s from './sprite.module.css'
import power from './power.module.css'

// About as a dead room he brings back. The chamber is dark when it scrolls into view: the brass panel is
// unlit and the fuse box beside it cold. He walks in from the edge, throws the electric bolt into the
// box, the box's lamps catch, the panel's lights stutter twice and hold, and the bio shows lit. The box
// is a button: a press makes him zap it again and the lights stutter again.
//
// Pattern: the shared usePoseSequence plays walk then zap then the idle (the walk ends on the wrapper's
// animationend, the zap on the sprite's). Power is derived from the pose, so nothing is timed here; the
// flicker is a CSS keyframe remounted under the take count. Reduced motion: he stands still, the room is
// lit from the start and a press does nothing.

const ENTRANCE: readonly DecoMotion[] = ['walk', 'zap']

function FuseBox({ live }: { live: boolean }) {
  return (
    <svg viewBox="0 0 60 90" className="h-full w-full" aria-hidden="true" focusable="false">
      <path d="M8 6 H52 V84 H8 Z" fill={C.brassDark} stroke={C.gold} strokeWidth="2" />
      <path d="M14 0 H46 L52 6 H8 Z" fill={C.gold} />
      <path d="M16 14 L30 26 L44 14" fill="none" stroke={C.goldBright} strokeWidth="1.5" />
      <rect x="18" y="32" width="24" height="34" fill={C.abyss} stroke={C.brassMid} strokeWidth="1.5" />
      <g className={power.lever} data-live={live || undefined}>
        <path d="M30 60 L30 38" stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
        <circle cx="30" cy="38" r="3.4" fill={C.blood} />
      </g>
      <circle cx="18" cy="76" r="3.5" fill={C.abyss} />
      <circle cx="42" cy="76" r="3.5" fill={C.abyss} />
      <g className={power.lamps} data-live={live || undefined}>
        <circle cx="18" cy="76" r="3.5" fill={C.goldBright} />
        <circle cx="42" cy="76" r="3.5" fill={C.bolt} />
      </g>
      <g className={power.arc} data-live={live || undefined} fill="none" stroke={C.bolt} strokeWidth="1.4" strokeLinecap="round">
        <path d="M2 40 L10 44 L6 48 L14 52" />
        <path d="M4 58 L12 56 L8 62" stroke={C.boltCore} />
      </g>
    </svg>
  )
}

/** The about chamber: dark until he powers it on with the bolt. */
export function PoweredRoom({ children }: { children: ReactNode }) {
  const { deco } = useLabels()
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const { pose, arrived, take, play, advance, onOwnAnimationEnd } = usePoseSequence<DecoMotion>({ entrance: ENTRANCE, rest: 'idle', still: 'still', policy: 'arrived' })
  const live = triggered && (pose === 'still' || pose === 'zap' || arrived)

  return (
    <div ref={ref} className="grid items-end gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
      <div className="flex items-end justify-center gap-1 sm:justify-start" aria-hidden={!triggered || undefined}>
        <div className="h-36 w-24">
          {triggered && (
            <div className={`h-full w-full ${pose === 'walk' ? s.walkIn : ''}`} onAnimationEnd={onOwnAnimationEnd}>
              <SurvivorSprite profession="engineer" motion={pose} onDone={advance} className="h-full w-full" />
            </div>
          )}
        </div>
        <button type="button" onClick={() => play('zap')} aria-label={deco.zapAgain} className="h-24 w-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--deco-gold-bright)]">
          <FuseBox live={live} />
        </button>
      </div>

      <div className={`relative ${power.panel}`} data-live={live || undefined}>
        {children}
        <span key={take} className={`pointer-events-none absolute inset-0 ${power.dark}`} aria-hidden="true" />
      </div>
    </div>
  )
}
