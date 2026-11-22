'use client'

import type { CSSProperties, ReactNode } from 'react'
import { headingId } from '@/lib/cv/sectionText'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { DepthZone } from './backdrop'
import { DECO_COLORS as C } from './palette'
import plaque from './plaque.module.css'

// Every section is a chamber one level deeper in the city. Its title hangs on a stepped ziggurat plaque
// in gold neon, and the depth gauge beside it swings its needle further round for each chamber down
// (depth 0 is the first chamber), so scrolling the page reads as going down through the city. The plaque
// hands the city zone to the page's backdrop while it is in view.
//
// Pattern: CSS off the chamber's own section trigger: the plaque's steps rise one after another and the
// needle swings to its --depth angle once. Reduced motion: the plaque and the needle at rest.

// The city's depth gauges: nine ticks from -120 to 120 degrees round a brass rimmed dial, a needle and its
// hub. The chamber plaque's is a small dark dial; the porthole's on the hero a large cream one, its major
// ticks heavier and a red arc low on the dial. The caller places it and moves the needle with its own class.
export type GaugeSize = 'plaque' | 'porthole'

interface Stroke {
  d: string
  stroke: string
  width: number
}

interface GaugeFace {
  box: number
  dial: { r: number; fill: string; rim: number }
  tick: { d: string; stroke: string; major: number; minor: number }
  arc: Stroke | null
  needle: Stroke
  hub: { r: number; fill: string }
}

const GAUGE_TICKS = Array.from({ length: 9 }, (_, i) => -120 + i * 30)

const GAUGE: Record<GaugeSize, GaugeFace> = {
  plaque: {
    box: 48,
    dial: { r: 22, fill: C.abyss, rim: 3 },
    tick: { d: 'M24 5 V9', stroke: C.gold, major: 1.5, minor: 1.5 },
    arc: null,
    needle: { d: 'M24 24 L24 8', stroke: C.spark, width: 2 },
    hub: { r: 3, fill: C.gold },
  },
  porthole: {
    box: 80,
    dial: { r: 37, fill: C.cream, rim: 5 },
    tick: { d: 'M40 10 V17', stroke: C.sepia, major: 2.5, minor: 1.2 },
    arc: { d: 'M22 58 A24 24 0 0 0 58 58', stroke: C.blood, width: 3 },
    needle: { d: 'M40 40 L40 14', stroke: C.blood, width: 2.5 },
    hub: { r: 4, fill: C.brassDark },
  },
}

export function DepthGauge({ size, className, needle }: { size: GaugeSize; className: string; needle: string }) {
  const { box, dial, tick, arc, needle: hand, hub } = GAUGE[size]
  const centre = box / 2
  return (
    <svg viewBox={`0 0 ${box} ${box}`} className={className} aria-hidden="true" focusable="false">
      <circle cx={centre} cy={centre} r={dial.r} fill={dial.fill} stroke={C.brassMid} strokeWidth={dial.rim} />
      {GAUGE_TICKS.map((angle) => (
        <path key={angle} d={tick.d} stroke={tick.stroke} strokeWidth={angle % 60 === 0 ? tick.major : tick.minor} transform={`rotate(${angle} ${centre} ${centre})`} />
      ))}
      {arc && <path d={arc.d} fill="none" stroke={arc.stroke} strokeWidth={arc.width} />}
      <g className={needle}>
        <path d={hand.d} stroke={hand.stroke} strokeWidth={hand.width} strokeLinecap="round" />
      </g>
      <circle cx={centre} cy={centre} r={hub.r} fill={hub.fill} />
    </svg>
  )
}

/** A titled section of the city: the ziggurat plaque with the depth gauge, then its content. */
export function Chamber({ title, depth, children }: { title: string; depth: number; children: ReactNode }) {
  const id = headingId('deco', title)
  const { ref, triggered } = useSectionTrigger()

  return (
    <section ref={ref} data-on={triggered || undefined} aria-labelledby={id} className="relative" style={{ '--depth': depth } as CSSProperties}>
      <DepthZone zone="city" className="mb-8 flex flex-col items-center">
        <div className="relative flex flex-col items-center" aria-hidden="true">
          {[1, 2, 3].map((step) => (
            <span key={step} className={`block border-2 border-b-0 ${plaque.step}`} style={{ '--s': step } as CSSProperties} />
          ))}
        </div>
        <div className={`relative flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-10 ${plaque.board}`}>
          <DepthGauge size="plaque" className="h-12 w-12 flex-shrink-0" needle={plaque.needle} />
          <h2 id={id} className={`text-lg uppercase tracking-[0.15em] min-[375px]:text-xl sm:text-2xl sm:tracking-[0.3em] ${plaque.title}`}>
            {title}
          </h2>
        </div>
      </DepthZone>
      {children}
    </section>
  )
}

/** The brass panel short sections (about, the tech stack, ventures, posts) sit in. */
export function BrassPanel({ children }: { children: ReactNode }) {
  return <div className={`relative p-5 sm:p-8 ${plaque.panel}`}>{children}</div>
}
