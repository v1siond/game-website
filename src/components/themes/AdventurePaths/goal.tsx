'use client'

import { useEffect, useRef, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { RecruiterHero } from '@/components/cv/RecruiterHero'
import type { Profession } from '@/lib/cv/professions'
import { CVLink, HeroAction, PlayLink } from './actions'
import { cssVars } from './art'
import { MapBanner, MapFrame } from './region'
import { JOURNAL_SERIF, TRAIL } from './palette'
import { TrailWalker } from './walker'
import map from './map.module.css'

// Contact as the goal at the end of the trail, the level's end gate: two posts and the tape sliding up
// and down between them. The visitor breaks the tape (a click, or the button by keyboard); the higher the
// tape when it breaks, the more stars burst from it, one to five, the way a high hit on the goal tape
// pays more. He raises a fist, walks through the gate, the banner says the trail is cleared, and the
// reserve box over the gate drops a letter. His contact actions stand beside the gate the
// whole time, never behind the game.

const TAPE_PERIOD_MS = 2400
const MAX_STARS = 5

/** How high the tape stands at a time (0 at the bottom, 1 at the top): a steady climb and fall, the same
 *  curve as the tape's CSS animation, which starts with the gate. */
export function tapeHeight(elapsed: number, period: number = TAPE_PERIOD_MS): number {
  const phase = (elapsed % period) / period
  return phase < 0.5 ? 1 - phase * 2 : (phase - 0.5) * 2
}

/** The stars a break pays: one for the bottom of the gate up to five at the very top. */
export const starsFor = (height: number): number => Math.min(MAX_STARS, 1 + Math.floor(height * MAX_STARS))

function GateArt({ stars }: { stars: number }) {
  return (
    <svg viewBox="0 0 400 260" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <rect width={400} height={260} fill="url(#ap-paper)" />
      <path d="M0 196 Q200 180 400 196 V260 H0 Z" fill="url(#ap-meadow)" stroke={TRAIL.INK} strokeWidth={2.4} />
      <path d="M0 196 Q200 180 400 196 V260 H0 Z" fill="url(#ap-hatch)" />
      {/* the two posts, striped like a finish gate */}
      {[230, 330].map((x) => (
        <g key={x}>
          <rect x={x - 7} y={40} width={14} height={152} fill={TRAIL.PAGE} stroke={TRAIL.INK} strokeWidth={2.4} />
          {[52, 84, 116, 148, 180].map((y) => (
            <rect key={y} x={x - 7} y={y} width={14} height={14} fill={TRAIL.ROUTE} />
          ))}
          <circle cx={x} cy={38} r={9} fill="url(#ap-gold)" stroke={TRAIL.INK} strokeWidth={2} />
        </g>
      ))}
      {/* the reserve box over the gate */}
      <g transform="translate(280 6)">
        <rect x={-20} y={0} width={40} height={30} rx={3} fill={TRAIL.INK} stroke={TRAIL.GOLD} strokeWidth={3} />
        <rect x={-14} y={6} width={28} height={18} rx={2} fill={TRAIL.CANOPY} />
      </g>
      <g className={map.letter}>
        <rect x={268} y={14} width={24} height={16} rx={1.5} fill={TRAIL.PAGE} stroke={TRAIL.INK} strokeWidth={1.6} />
        <path d="M268 14 L280 24 L292 14" fill="none" stroke={TRAIL.INK} strokeWidth={1.6} />
      </g>
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <path
          key={index}
          d="M0 -9 L2.6 -3.6 L8.6 -2.8 L4.3 1.4 L5.3 7.3 L0 4.5 L-5.3 7.3 L-4.3 1.4 L-8.6 -2.8 L-2.6 -3.6 Z"
          fill={TRAIL.LANTERN}
          stroke={TRAIL.INK}
          strokeWidth={1.2}
          className={map.burst}
          data-on={index < stars}
          style={cssVars({ '--i': index, '--dx': `${(index - 2) * 26}px` })}
          transform="translate(280 110)"
        />
      ))}
    </svg>
  )
}

export function GoalGate({ profession }: { profession: Profession }) {
  const { sections, trail } = useLabels()
  const started = useRef(0)

  // The tape's clock starts with the gate, as its CSS animation does.
  useEffect(() => {
    started.current = performance.now()
  }, [])
  const [broken, setBroken] = useState<{ height: number; stars: number } | null>(null)

  const breakTape = () => {
    if (broken) return
    const height = tapeHeight(performance.now() - started.current)
    setBroken({ height, stars: starsFor(height) })
  }

  return (
    <section aria-labelledby="trail-contact-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <MapFrame>
          <MapBanner>{broken ? trail.trailCleared : trail.goal}</MapBanner>
          <div className="relative" data-broken={broken !== null}>
            <GateArt stars={broken?.stars ?? 0} />
            {/* the tape: slides between the posts until it breaks, then its halves fall away */}
            <div
              className={`pointer-events-none absolute left-[58%] top-[18%] h-[56%] w-[24%] ${map.tapeRun}`}
              style={cssVars({ '--period': `${TAPE_PERIOD_MS}ms`, '--held': broken ? `${(1 - broken.height) * 100}%` : '0%' })}
              aria-hidden="true"
            >
              <div className={`h-full w-full ${map.tape}`}>
                <div className="flex h-2.5 w-full">
                  <span className={`h-full w-1/2 border-y-2 border-[color:var(--ap-ink)] bg-[color:var(--ap-gold)] ${map.tapeLeft}`} />
                  <span className={`h-full w-1/2 border-y-2 border-[color:var(--ap-ink)] bg-[color:var(--ap-gold)] ${map.tapeRight}`} />
                </div>
              </div>
            </div>
            <div
              className={`pointer-events-none absolute bottom-[22%] left-[22%] h-[32%] -translate-x-1/2 ${map.goalWalker}`}
              data-cheer={broken !== null}
              aria-hidden="true"
            >
              <TrailWalker profession={profession} className="h-full w-auto" />
            </div>
            <button
              type="button"
              onClick={breakTape}
              disabled={broken !== null}
              className="absolute bottom-3 right-3 min-h-[44px] rounded-sm border-2 border-[color:var(--ap-ink)] bg-[color:var(--ap-gold)] px-4 text-sm font-bold text-[color:var(--ap-ink)] transition-transform hover:-translate-y-0.5 disabled:cursor-default motion-reduce:transition-none"
            >
              {broken ? trail.trailCleared : trail.breakTape}
            </button>
          </div>
        </MapFrame>

        <RecruiterHero
          render={({ line, actions }) => (
            <div>
              <h2 id="trail-contact-heading" className={`mb-3 text-3xl font-bold text-[color:var(--ap-gold)] ${JOURNAL_SERIF}`}>
                {sections.contact}
              </h2>
              <p className="mb-6 text-base text-[color:var(--ap-parchment)]">{line}</p>
              <div className="flex flex-wrap gap-3">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
                <PlayLink />
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
