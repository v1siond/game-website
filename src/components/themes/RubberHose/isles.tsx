'use client'

import type { ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { PieEyes } from './art'
import { HOSE } from './palette'
import stage from './stage.module.css'

// The painted isles behind the whole page, fixed to the viewport like the game's watercolour sets: a far
// wash, painted hills or tents or a felt table mid, dark foliage or curtains near. The page walks from the
// meadow isle (about, work) to the carnival isle (tech, projects, ventures) to the casino (bands, the ring,
// contact), the way the game's world gets redder toward the end. Each section hands its isle up through the
// shared useZoneStage; the page keeps it and the isles cross fade (opacity only).
//
// Everything has a face and bobs on a two drawing beat (steps timing, 1930s twos): clouds drift past with
// pie eyes, flowers sway, the moon and the dice grin. Only the isle in view animates; the others pause.

export type Isle = 'meadow' | 'carnival' | 'casino'

const ISLES: Isle[] = ['meadow', 'carnival', 'casino']

function FacedCloud({ x, y, scale, className }: { x: number; y: number; scale: number; className: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={className}>
        <path d="M0 30 Q-4 14 12 12 Q16 0 32 4 Q44 -6 56 6 Q72 4 72 20 Q84 24 76 34 Z" fill={HOSE.highlight} stroke={HOSE.ink} strokeWidth={2.4} strokeLinejoin="round" />
        <PieEyes cx={38} cy={20} size={16} paper={HOSE.highlight} />
        <path d="M32 27 Q38 31 44 27" fill="none" stroke={HOSE.ink} strokeWidth={1.8} strokeLinecap="round" />
      </g>
    </g>
  )
}

function FacedFlower({ x, y, petal, className }: { x: number; y: number; petal: string; className: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className}>
        <path d="M0 0 Q-3 20 0 40" fill="none" stroke={HOSE.meadowDark} strokeWidth={3} />
        <path d="M0 26 Q-12 18 -16 24 Q-8 30 0 28" fill={HOSE.meadow} stroke={HOSE.ink} strokeWidth={1.6} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx={0} cy={-9} rx={5} ry={8} fill={petal} stroke={HOSE.ink} strokeWidth={1.6} transform={`rotate(${a})`} />
        ))}
        <circle r={7.5} fill={HOSE.gold} stroke={HOSE.ink} strokeWidth={1.8} />
        <PieEyes cx={0} cy={-1} size={9} paper={HOSE.gold} />
        <path d="M-3 3 Q0 5.5 3 3" fill="none" stroke={HOSE.ink} strokeWidth={1.2} strokeLinecap="round" />
      </g>
    </g>
  )
}

function Meadow() {
  return (
    <>
      <rect width={400} height={300} fill={HOSE.skyWash} />
      <ellipse cx={300} cy={60} rx={160} ry={40} fill={HOSE.highlight} opacity={0.5} />
      <path d="M0 190 Q70 140 150 170 T300 160 T400 150 V300 H0 Z" fill={HOSE.meadow} opacity={0.55} />
      <path d="M0 220 Q90 180 190 214 T400 200 V300 H0 Z" fill={HOSE.meadow} />
      <path d="M120 214 Q160 230 150 300 H230 Q220 240 260 210" fill={HOSE.paperSepia} opacity={0.7} />
      <path d="M0 262 Q60 236 120 258 Q180 280 240 252 Q320 230 400 256 V300 H0 Z" fill={HOSE.meadowDark} />
      <FacedFlower x={60} y={236} petal={HOSE.orange} className={stage.sway} />
      <FacedFlower x={344} y={232} petal={HOSE.red} className={stage.swayLate} />
    </>
  )
}

function Carnival() {
  return (
    <>
      <rect width={400} height={300} fill="#e7d9c4" />
      <path d="M0 150 L40 90 L70 140 L110 70 L150 150 Z M250 150 L300 80 L330 130 L360 96 L400 150 Z" fill={HOSE.shadow} opacity={0.35} />
      <g transform="translate(320 150)">
        <g className={stage.wheel}>
          <circle r={56} fill="none" stroke={HOSE.inkSoft} strokeWidth={3} />
          {[0, 45, 90, 135].map((a) => (
            <path key={a} d="M-56 0 H56" stroke={HOSE.inkSoft} strokeWidth={2} transform={`rotate(${a})`} />
          ))}
        </g>
        <path d="M-30 90 L0 0 L30 90" fill="none" stroke={HOSE.inkSoft} strokeWidth={4} />
      </g>
      <path d="M40 210 L90 140 L140 210 Z" fill={HOSE.red} stroke={HOSE.ink} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M65 210 L90 140 L115 210 Z" fill={HOSE.highlight} opacity={0.8} />
      <path d="M0 230 Q100 210 200 228 T400 222 V300 H0 Z" fill={HOSE.paperDark} />
      <path d="M0 270 Q120 250 240 268 T400 262 V300 H0 Z" fill={HOSE.shadowDark} />
    </>
  )
}

function Casino() {
  return (
    <>
      <rect width={400} height={300} fill={HOSE.redDeep} />
      <rect width={400} height={300} fill={HOSE.film} opacity={0.35} />
      <g transform="translate(200 60)">
        <g className={stage.moon}>
          <circle r={26} fill={HOSE.paperSepia} stroke={HOSE.ink} strokeWidth={2.4} />
          <PieEyes cx={0} cy={-3} size={22} paper={HOSE.paperSepia} />
          <path d="M-9 9 Q0 16 9 9" fill="none" stroke={HOSE.ink} strokeWidth={2} strokeLinecap="round" />
        </g>
      </g>
      <path d="M0 220 Q200 190 400 220 V300 H0 Z" fill="#2f5a3a" stroke={HOSE.ink} strokeWidth={2.4} />
      <path d="M0 0 Q30 120 0 300 H-1 Z M0 0 H70 Q40 140 60 300 H0 Z" fill={HOSE.redDark} />
      <path d="M400 0 H330 Q360 140 340 300 H400 Z" fill={HOSE.redDark} />
    </>
  )
}

const DRAWN: Record<Isle, () => ReactNode> = { meadow: Meadow, carnival: Carnival, casino: Casino }

/** The fixed painted backdrop, showing the isle the page is on. */
export function Isles({ current }: { current: Isle }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {ISLES.map((isle) => {
        const Drawn = DRAWN[isle]
        return (
          <svg key={isle} viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${stage.isle}`} data-on={isle === current || undefined} focusable="false">
            <Drawn />
            <FacedCloud x={20} y={30} scale={0.9} className={stage.drift} />
            <FacedCloud x={220} y={96} scale={0.6} className={stage.driftSlow} />
          </svg>
        )
      })}
    </div>
  )
}

/** A section's place on an isle: hands the isle up while in view, and says when it first came into view. */
export function IsleStage({ isle, className = '', children }: { isle: Isle; className?: string; children: (on: boolean) => ReactNode }) {
  const { ref, on } = useZoneStage<Isle>(isle)
  return (
    <div ref={ref} className={className}>
      {children(on)}
    </div>
  )
}
