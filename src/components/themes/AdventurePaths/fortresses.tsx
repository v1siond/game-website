'use client'

import { useEffect, useState } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePreview } from '@/themes/PreviewContext'
import type { MartialArts } from '@/lib/cv/content'
import { cssVars, LevelTile, TrailBed, TrailDots } from './art'
import { MapBanner, MapFrame, Region } from './region'
import { JOURNAL_SERIF, TRAIL } from './palette'
import { buildTrail, dotsAlong, type Point } from './trail'
import { TrailWalker } from './walker'
import map from './map.module.css'

// The Muay Thai record as the fortresses on his trail, the overworld's castles that crumble into ruins
// once beaten: one fortress per achievement. When the region comes into view each fortress in turn is
// crushed into its ruin (about 40 frames each, as the map's own) while he throws strikes at the trail
// start, and the achievement it stands for is told under the map like the storybook text after a castle.
// Pointing at an achievement shakes its ruin. The record's facts are the map's legend.

const STRIP = { width: 900, height: 220 } as const
const CRUSH_MS = 670
const START: Point = [70, 170]

const fortPoint = (index: number, count: number): Point => [220 + ((STRIP.width - 300) * index) / Math.max(count - 1, 1), index % 2 === 0 ? 150 : 120]

function Fortress({ x, y, crushed, shaking }: { x: number; y: number; crushed: boolean; shaking: boolean }) {
  return (
    <g transform={`translate(${x} ${y - 10})`}>
      <g className={map.shake} data-shaking={shaking}>
        {/* the ruin under it, shown once it falls */}
        <g className={map.ruin} data-crushed={crushed}>
          <path d="M-34 0 L-30 -12 L-20 -10 L-14 -20 L-4 -14 L6 -22 L14 -12 L24 -16 L34 0 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
          <path d="M-20 -4 H-8 M4 -6 H18" stroke={TRAIL.STONE_DARK} strokeWidth={2} />
        </g>
        <g className={map.fort} data-crushed={crushed}>
          <path d="M-30 0 V-52 H-20 V-46 H-12 V-52 H-2 V0 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
          <path d="M2 0 V-52 H12 V-46 H20 V-52 H30 V0 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
          <path d="M-10 0 V-34 H10 V0 Z" fill="url(#ap-stone)" stroke={TRAIL.INK} strokeWidth={2} />
          <path d="M-6 0 V-12 Q0 -20 6 -12 V0 Z" fill={TRAIL.BARK} />
          <rect x={-21} y={-38} width={6} height={8} fill={TRAIL.INK} />
          <rect x={15} y={-38} width={6} height={8} fill={TRAIL.INK} />
          <path d="M0 -34 V-58 L14 -52 L0 -46" fill={TRAIL.ROUTE} stroke={TRAIL.INK} strokeWidth={1.2} />
        </g>
      </g>
    </g>
  )
}

function useCrush(count: number) {
  const { ref, triggered } = useSectionTrigger({ threshold: 0.3 })
  const reduced = useReducedMotion()
  const preview = usePreview()
  const [crushed, setCrushed] = useState(0)

  useEffect(() => {
    if (reduced || preview) {
      setCrushed(count)
      return
    }
    if (!triggered) return
    const timers = Array.from({ length: count }, (_, index) => window.setTimeout(() => setCrushed(index + 1), 500 + index * CRUSH_MS))
    return () => timers.forEach(window.clearTimeout)
  }, [triggered, reduced, preview, count])

  return { ref, crushed, acting: triggered && crushed < count }
}

export function FortressTrail({ martialArts }: { martialArts: MartialArts }) {
  const { sections, trail: labels } = useLabels()
  const achievements = martialArts.primary.achievements
  const count = achievements.length
  const { ref, crushed, acting } = useCrush(count)
  const [pointed, setPointed] = useState<number | null>(null)
  const route = buildTrail([START, ...achievements.map((_, index) => fortPoint(index, count))])
  const dots = dotsAlong(route, 40)
  const latest = crushed > 0 ? achievements[crushed - 1] : null

  return (
    <Region title={sections.muayThai} hint={labels.fortressHint}>
      <h3 className={`mb-4 text-xl font-bold text-[color:var(--ap-parchment)] ${JOURNAL_SERIF}`}>{martialArts.primary.title}</h3>
      <div ref={ref}>
        <MapFrame>
          <MapBanner>{latest ? labels.fortressCleared : sections.muayThai}</MapBanner>
          <div className="relative">
            <svg viewBox={`0 0 ${STRIP.width} ${STRIP.height}`} className="block h-auto w-full" aria-hidden="true" focusable="false">
              <rect width={STRIP.width} height={STRIP.height} fill="url(#ap-paper)" />
              <path d={`M0 60 Q${STRIP.width / 2} 30 ${STRIP.width} 56 V${STRIP.height} H0 Z`} fill="url(#ap-meadow)" stroke={TRAIL.INK} strokeWidth={2.4} />
              <path d={`M0 60 Q${STRIP.width / 2} 30 ${STRIP.width} 56 V${STRIP.height} H0 Z`} fill="url(#ap-hatch)" />
              <TrailBed trail={route} width={12} />
              <TrailDots dots={dots} r={3.6} className="" />
              <LevelTile x={START[0]} y={START[1]} r={11} kind="exit" />
              {achievements.map((achievement, index) => {
                const [x, y] = fortPoint(index, count)
                return <Fortress key={achievement} x={x} y={y} crushed={index < crushed} shaking={pointed === index} />
              })}
            </svg>
            <div
              className="pointer-events-none absolute left-[var(--x)] top-[var(--y)] h-[34%] -translate-x-1/2 -translate-y-[92%]"
              style={cssVars({ '--x': `${(START[0] / STRIP.width) * 100}%`, '--y': `${(START[1] / STRIP.height) * 100}%` })}
              data-acting={acting}
              aria-hidden="true"
            >
              <TrailWalker profession="fighter" className="h-full w-auto" />
            </div>
          </div>
          {latest && (
            <p key={latest} className={`border-t-4 border-[color:var(--ap-wood)] bg-[color:var(--ap-page)] px-5 py-3 text-center text-base italic text-[color:var(--ap-ink)] ${JOURNAL_SERIF} ${map.nameBox}`}>
              {latest}
            </p>
          )}
        </MapFrame>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_3fr]">
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts:
                'order-2 grid content-start gap-3 rounded-sm border-2 border-[color:var(--ap-edge)] bg-[color:var(--ap-canopy)] p-4 lg:order-1',
              fact: 'border-b border-[color:var(--ap-moss)] pb-2 last:border-b-0',
              term: 'text-sm font-bold uppercase tracking-wider text-[color:var(--ap-gold)]',
              value: 'mt-1 text-sm text-[color:var(--ap-parchment)]',
              achievements: 'order-1 space-y-3 lg:order-2',
              achievement: '',
            }}
            renderAchievement={(achievement) => {
              const index = achievements.indexOf(achievement)
              const cleared = index < crushed
              return (
                <div
                  tabIndex={0}
                  onPointerEnter={() => setPointed(index)}
                  onPointerLeave={() => setPointed(null)}
                  onFocus={() => setPointed(index)}
                  onBlur={() => setPointed(null)}
                  className="flex items-start gap-3 rounded-sm border-2 border-[color:var(--ap-edge)] bg-[color:var(--ap-page)] p-3 text-[color:var(--ap-ink)]"
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--ap-ink)] text-sm font-bold ${
                      cleared ? 'bg-[color:var(--ap-route)] text-white' : 'bg-[color:var(--ap-parchment)]'
                    }`}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base">{achievement}</span>
                    {cleared && <span className="mt-1 block text-sm font-bold uppercase tracking-wider text-[color:var(--ap-route)]">{labels.fortressCleared}</span>}
                  </span>
                </div>
              )
            }}
          />
        </div>
      </div>
    </Region>
  )
}
