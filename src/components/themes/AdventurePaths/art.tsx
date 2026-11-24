import type { ReactNode } from 'react'
import { cssVars } from '@/lib/cssVars'
import { TRAIL } from './palette'
import type { Trail } from './trail'
import map from './map.module.css'

// The drawn pieces the world map shares, flat and edged in black the way the 16 bit map draws them: the
// level tile in its three states, the sand path and the clouds.

/** A tile's kind, which it keeps for good, as on the world map: a plain stop on the path, a level with
 *  one exit (yellow) or a level with a secret exit (red). */
export type TileKind = 'stop' | 'exit' | 'secret'

const TILE_FILL: Record<TileKind, string> = {
  stop: TRAIL.PAGE,
  exit: TRAIL.BLOCK,
  secret: TRAIL.ROUTE,
}

/** A level tile: a round spot set in the path, edged in black, with a lit top. */
export function LevelTile({
  x,
  y,
  r = 13,
  kind,
  children,
}: {
  x: number
  y: number
  r?: number
  kind: TileKind
  children?: ReactNode
}) {
  return (
    <g className={map.tile}>
      <circle cx={x} cy={y} r={r} fill={TILE_FILL[kind]} stroke={TRAIL.HUD} strokeWidth={3} />
      <rect x={x - r * 0.5} y={y - r * 0.6} width={r * 0.5} height={r * 0.3} fill={TRAIL.PAGE} opacity={0.7} />
      {children}
    </g>
  )
}

/** The path: sand edged in black. */
export function TrailBed({ trail, width = 14 }: { trail: Trail; width?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={trail.d} stroke={TRAIL.HUD} strokeWidth={width + 6} />
      <path d={trail.d} stroke={TRAIL.SAND} strokeWidth={width} />
    </g>
  )
}

/** A cloud over the map, leaning toward the pointer by its depth and drifting slowly. */
export function Cloud({ x, y, s, i, depth }: { x: number; y: number; s: number; i: number; depth: string }) {
  return (
    <g className={map.cloud} style={cssVars({ '--depth': depth })}>
      <g className={map.cloudDrift} style={cssVars({ '--i': i })}>
        <g transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x={-44} y={-14} width={88} height={30} rx={15} fill={TRAIL.CLOUD} stroke={TRAIL.HUD} strokeWidth={3} />
          <rect x={-22} y={-30} width={44} height={30} rx={15} fill={TRAIL.CLOUD} stroke={TRAIL.HUD} strokeWidth={3} />
          <rect x={-40} y={-10} width={80} height={22} rx={11} fill={TRAIL.CLOUD} />
        </g>
      </g>
    </g>
  )
}
