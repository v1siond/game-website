'use client'

import { useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { fillLabel } from '@/lib/cv/labels'
import type { MartialArts } from '@/lib/cv/content'
import { VaultSprite, type SpriteMotion } from './sprite'
import { Starburst } from './ink'
import { InkButton } from './buttons'
import { CEL } from './palette'
import { useZoneStageContext } from '@/hooks/useZoneStage'
import cel from './cel.module.css'

// Muay Thai at the heavy bag: when the section first shows he throws a kick, a knee and an elbow, and
// each hit floats one of his achievements up out of the bag the way the shooter floats damage numbers,
// the last one under the red critical. Strike throws the next hit by hand. The record card beside him
// holds the facts and every achievement, each marked once its hit has landed; the count is said in
// words in a live line.

const STRIKES: readonly SpriteMotion[] = ['kick', 'knee', 'elbow']
const FIRST_HIT_MS = 500
const HIT_GAP_MS = 750

function Bag({ swing }: { swing: number }) {
  return (
    <svg viewBox="0 0 80 220" className={`h-full w-full overflow-visible ${cel.inked}`} aria-hidden="true">
      <path d="M40 0 L40 26" stroke={CEL.steel} strokeWidth={4} />
      <g key={swing} className={`${cel.bag} ${swing > 0 ? cel.bagSwing : ''}`}>
        <path d="M24 26 L56 26 L40 40 Z" fill={CEL.steelDark} />
        <path d="M14 40 Q40 32 66 40 L66 196 Q40 206 14 196 Z" fill={CEL.red} />
        <path d="M50 38 Q60 39 66 40 L66 196 Q60 200 52 202 Q58 120 50 38 Z" fill="#9e2219" data-bare />
        <path d="M14 70 L66 70 M14 166 L66 166" stroke={CEL.ink} strokeWidth={4} />
      </g>
    </svg>
  )
}

export function HeavyBag({ martialArts, on }: { martialArts: MartialArts; on: boolean }) {
  const { hud } = useLabels()
  const { reduced } = useZoneStageContext()
  const achievements = martialArts.primary.achievements
  const total = achievements.length
  const [strikes, setStrikes] = useState(0)
  // Under reduced motion nothing is thrown on entry, so every hit counts as landed from the start.
  const landed = reduced ? total : Math.min(strikes, total)
  const current = strikes > 0 ? (strikes - 1) % total : -1
  const strike = () => setStrikes((count) => count + 1)

  useEffect(() => {
    if (!on || reduced) return
    const timers = achievements.map((_, index) => window.setTimeout(() => setStrikes((count) => count + 1), FIRST_HIT_MS + index * HIT_GAP_MS))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [on, reduced, achievements])

  const motion: SpriteMotion = strikes > 0 && !reduced ? STRIKES[(strikes - 1) % STRIKES.length] : 'idle'
  const critical = current === total - 1

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div>
        <div className="relative mx-auto flex h-72 max-w-sm items-end justify-center gap-2">
          <VaultSprite key={strikes} profession="fighter" motion={motion} className="h-60 w-36" />
          <div className="relative h-64 w-24">
            <Bag swing={reduced ? 0 : strikes} />
            {current >= 0 && !reduced && (
              <div key={strikes} className="pointer-events-none absolute left-1/2 top-1/3" aria-hidden="true">
                <div className={`absolute -left-8 -top-8 h-16 w-16 ${cel.impact}`}>
                  <Starburst fill={critical ? CEL.crit : CEL.sun} />
                </div>
                <p className={`absolute -left-28 bottom-6 w-56 text-center text-base font-black ${cel.pop}`}>
                  {critical && <span className={`block text-3xl ${cel.display} ${cel.crit}`}>{hud.critical}</span>}
                  <span className="bg-[var(--cel-paper)] px-1 text-[var(--cel-ink)]">{achievements[current]}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <InkButton tone="orange" onClick={strike}>
            {hud.strike}
          </InkButton>
          <p className="text-base font-bold" role="status">
            {fillLabel(hud.hitLog, { count: landed, total })}
          </p>
        </div>
      </div>

      <div className={`p-5 sm:p-6 ${cel.paper}`}>
        <h3 className={`mb-4 text-2xl ${cel.display} [-webkit-text-stroke:0]`}>{martialArts.primary.title}</h3>
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'mb-5 grid gap-3 sm:grid-cols-2',
            fact: 'border-[3px] border-[var(--cel-ink)] bg-[var(--cel-white)] p-3',
            term: 'text-sm font-black uppercase tracking-wider',
            value: 'mt-1 text-base',
            achievements: 'space-y-3',
            achievement: 'text-base font-bold',
          }}
          renderAchievement={(achievement) => (
            <span className="flex items-start gap-3">
              <span
                data-on={achievements.indexOf(achievement) < landed || undefined}
                className={`mt-0.5 inline-block h-5 w-5 shrink-0 bg-[var(--cel-crit)] [clip-path:polygon(50%_0,62%_35%,100%_38%,70%_60%,80%_100%,50%_76%,20%_100%,30%_60%,0_38%,38%_35%)] ${cel.hitMark}`}
                aria-hidden="true"
              />
              <span>{achievement}</span>
            </span>
          )}
        />
      </div>
    </div>
  )
}
