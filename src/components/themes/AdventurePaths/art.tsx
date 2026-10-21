import type { CSSProperties, ReactNode } from 'react'
import { TRAIL } from './palette'
import type { Trail, TrailDot } from './trail'
import map from './map.module.css'

// The drawn pieces every map of the expedition shares, lit from the upper left with the gradients in
// MapDefs (rendered once on the root, so every map shares one set of ids): the parchment and its folds,
// the level tile in its three states, the dotted trail, hills, tree clumps, waves and clouds.

/** A CSS variable for an element's own style (the only inline style the world writes). */
export const cssVars = (vars: Record<string, string | number>): CSSProperties => vars as CSSProperties

export function MapDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="ap-paper" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0" stopColor={TRAIL.PAGE} />
          <stop offset="0.7" stopColor={TRAIL.PARCHMENT} />
          <stop offset="1" stopColor={TRAIL.EDGE} />
        </radialGradient>
        <linearGradient id="ap-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TRAIL.SEA} stopOpacity={0.55} />
          <stop offset="1" stopColor={TRAIL.SEA_DEEP} stopOpacity={0.6} />
        </linearGradient>
        <linearGradient id="ap-meadow" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={TRAIL.MEADOW} />
          <stop offset="1" stopColor={TRAIL.MEADOW_DARK} />
        </linearGradient>
        <linearGradient id="ap-fall" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={TRAIL.FALL} />
          <stop offset="1" stopColor={TRAIL.FALL_DARK} />
        </linearGradient>
        <linearGradient id="ap-cliff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TRAIL.CLIFF} />
          <stop offset="1" stopColor={TRAIL.CLIFF_DARK} />
        </linearGradient>
        <radialGradient id="ap-hill" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={TRAIL.MEADOW} />
          <stop offset="0.6" stopColor={TRAIL.MOSS} />
          <stop offset="1" stopColor={TRAIL.FOREST} />
        </radialGradient>
        <linearGradient id="ap-stone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9c1aa" />
          <stop offset="0.55" stopColor={TRAIL.STONE} />
          <stop offset="1" stopColor={TRAIL.STONE_DARK} />
        </linearGradient>
        <linearGradient id="ap-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a06a3a" />
          <stop offset="1" stopColor={TRAIL.BARK} />
        </linearGradient>
        <radialGradient id="ap-gold" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor={TRAIL.LANTERN} />
          <stop offset="0.6" stopColor={TRAIL.GOLD} />
          <stop offset="1" stopColor="#9a6a14" />
        </radialGradient>
        <radialGradient id="ap-red" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#e77a5c" />
          <stop offset="0.6" stopColor={TRAIL.ROUTE} />
          <stop offset="1" stopColor="#6e1f12" />
        </radialGradient>
        <pattern id="ap-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="6" height="6" fill="none" />
          <path d="M0 0 V6" stroke={TRAIL.INK_SOFT} strokeWidth={0.7} opacity={0.35} />
        </pattern>
      </defs>
    </svg>
  )
}

/** A tile's kind, which it keeps for good, as on the overworld map: a plain stop on the trail, a level with
 *  one exit (yellow) or a level with a secret exit (red). */
export type TileKind = 'stop' | 'exit' | 'secret'

const TILE_FILL: Record<TileKind, string> = {
  stop: TRAIL.PAGE,
  exit: 'url(#ap-gold)',
  secret: 'url(#ap-red)',
}

/**
 * A level tile: a round stone set in the ground with a ring of ink and a lit rim. `className` lets a scene
 * fade it in (its reveal) without touching its colour.
 */
export function LevelTile({
  x,
  y,
  r = 13,
  kind,
  className,
  children,
}: {
  x: number
  y: number
  r?: number
  kind: TileKind
  className?: string
  children?: ReactNode
}) {
  return (
    <g className={`${map.tile} ${className ?? ''}`}>
      <ellipse cx={x} cy={y + r * 0.45} rx={r * 1.15} ry={r * 0.55} fill={TRAIL.INK} opacity={0.28} />
      <circle cx={x} cy={y} r={r} fill={TILE_FILL[kind]} stroke={TRAIL.INK} strokeWidth={2.4} />
      <ellipse cx={x - r * 0.3} cy={y - r * 0.35} rx={r * 0.38} ry={r * 0.22} fill={TRAIL.PAGE} opacity={0.7} />
      {children}
    </g>
  )
}

/** The dotted trail: an ink dot every step, each carrying its place along the trail for the reveal. */
export function TrailDots({
  dots,
  leg = 0,
  className = map.dot,
  r = 4,
}: {
  dots: TrailDot[]
  leg?: number
  className?: string
  r?: number
}) {
  return (
    <g>
      {dots.map((dot) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={r}
          fill={TRAIL.ROUTE}
          stroke={TRAIL.INK}
          strokeWidth={1.2}
          className={className}
          style={cssVars({ '--at': dot.at, '--leg': leg })}
        />
      ))}
    </g>
  )
}

/** The trail's worn bed under the dots, so the path reads even before it is dotted in. */
export function TrailBed({ trail, width = 14 }: { trail: Trail; width?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={trail.d} stroke={TRAIL.CLIFF_DARK} strokeWidth={width + 3} opacity={0.25} />
      <path d={trail.d} stroke={TRAIL.SAND} strokeWidth={width} opacity={0.85} />
    </g>
  )
}

/** A rounded hill with its light side, two frame breathing on the map. */
export function Hill({ x, y, w, h, i }: { x: number; y: number; w: number; h: number; i: number }) {
  return (
    <g className={map.hill} style={cssVars({ '--i': i })}>
      <path d={`M${x - w / 2} ${y} Q${x - w / 2} ${y - h} ${x} ${y - h} Q${x + w / 2} ${y - h} ${x + w / 2} ${y} Z`} fill="url(#ap-hill)" stroke={TRAIL.INK} strokeWidth={2} />
      <path d={`M${x - w / 4} ${y - h * 0.55} Q${x - w / 6} ${y - h * 0.85} ${x + w * 0.02} ${y - h * 0.86}`} stroke={TRAIL.PAGE} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  )
}

/** A clump of round canopies, dark under and lit on top, with trunks showing. */
export function Trees({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const crowns: Array<readonly [number, number, number]> = [
    [-12, 0, 11],
    [10, 2, 10],
    [0, -9, 12],
  ]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {crowns.map(([dx, dy]) => (
        <rect key={`t${dx}`} x={dx - 1.5} y={dy + 6} width={3} height={8} fill={TRAIL.BARK} />
      ))}
      {crowns.map(([dx, dy, r]) => (
        <g key={`c${dx}`}>
          <circle cx={dx} cy={dy} r={r} fill={TRAIL.FOREST} stroke={TRAIL.INK} strokeWidth={1.6} />
          <circle cx={dx - r * 0.3} cy={dy - r * 0.35} r={r * 0.45} fill={TRAIL.MOSS} />
        </g>
      ))}
    </g>
  )
}

/** Inked wave marks on the sea. */
export function Waves({ points }: { points: ReadonlyArray<readonly [number, number]> }) {
  return (
    <g fill="none" stroke={TRAIL.SEA_DEEP} strokeWidth={2} strokeLinecap="round" opacity={0.75}>
      {points.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} q6 -6 12 0 q6 6 12 0`} />
      ))}
    </g>
  )
}

/** A cloud over the map, leaning toward the pointer by its depth and drifting slowly. */
export function Cloud({ x, y, s, i, depth }: { x: number; y: number; s: number; i: number; depth: string }) {
  return (
    <g className={map.cloud} style={cssVars({ '--depth': depth })}>
      <g className={map.cloudDrift} style={cssVars({ '--i': i })}>
        <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.92}>
          <path d="M-40 10 Q-44 -6 -26 -8 Q-22 -26 0 -22 Q16 -34 30 -18 Q48 -18 44 2 Q50 14 34 14 H-30 Q-44 16 -40 10 Z" fill={TRAIL.PAGE} stroke={TRAIL.INK_SOFT} strokeWidth={1.6} />
          <path d="M-30 12 H34" stroke={TRAIL.EDGE} strokeWidth={3} strokeLinecap="round" />
        </g>
      </g>
    </g>
  )
}
