import type { ReactNode } from 'react'
import { ERAS, type Era, type EraLook, type GateShape } from './palette'
import { seeded, TH } from './world'

// Every era of the corridor, drawn in code in world units: the shape of its gate (also the shape of its
// tunnel ribs), the ornaments on its gate facade and the decor that turns with the scroll. The place behind
// each gate is the era's set piece (sets/). Our own places and times; nothing here is taken from a game.

const r1 = (n: number): number => Math.round(n * 10) / 10

interface NeonProps {
  d: string
  color: string
  width?: number
  opacity?: number
  transform?: string
}

/** The neon look without a filter: a wide faint stroke, a mid stroke and a hot core, so scaling stays cheap. */
export function Neon({ d, color, width = 10, opacity, transform }: NeonProps) {
  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={opacity} transform={transform}>
      <path d={d} stroke={color} strokeWidth={width * 4} opacity={0.16} />
      <path d={d} stroke={color} strokeWidth={width * 1.8} opacity={0.45} />
      <path d={d} stroke={color} strokeWidth={width} />
      <path d={d} stroke="#fff" strokeWidth={width * 0.35} opacity={0.85} />
    </g>
  )
}

// Gate shapes, each a closed path of a w by h opening centred on 0,0.
const SHAPES: Record<GateShape, (w: number, h: number) => string> = {
  ellipse: (w, h) => `M ${r1(-w / 2)} 0 A ${r1(w / 2)} ${r1(h / 2)} 0 1 1 ${r1(w / 2)} 0 A ${r1(w / 2)} ${r1(h / 2)} 0 1 1 ${r1(-w / 2)} 0 Z`,
  arch: (w, h) => {
    const spring = -h / 2 + h * 0.36
    return `M ${r1(-w / 2)} ${r1(h / 2)} L ${r1(-w / 2)} ${r1(spring)} A ${r1(w / 2)} ${r1(h * 0.36)} 0 0 1 ${r1(w / 2)} ${r1(spring)} L ${r1(w / 2)} ${r1(h / 2)} Z`
  },
  rounded: (w, h) => {
    const r = Math.min(w, h) * 0.12
    return `M ${r1(-w / 2 + r)} ${r1(-h / 2)} H ${r1(w / 2 - r)} Q ${r1(w / 2)} ${r1(-h / 2)} ${r1(w / 2)} ${r1(-h / 2 + r)} V ${r1(h / 2)} H ${r1(-w / 2)} V ${r1(-h / 2 + r)} Q ${r1(-w / 2)} ${r1(-h / 2)} ${r1(-w / 2 + r)} ${r1(-h / 2)} Z`
  },
  pointed: (w, h) => {
    const spring = -h / 2 + h * 0.42
    return `M ${r1(-w / 2)} ${r1(h / 2)} L ${r1(-w / 2)} ${r1(spring)} Q ${r1(-w / 2)} ${r1(-h / 2 + h * 0.08)} 0 ${r1(-h / 2)} Q ${r1(w / 2)} ${r1(-h / 2 + h * 0.08)} ${r1(w / 2)} ${r1(spring)} L ${r1(w / 2)} ${r1(h / 2)} Z`
  },
  hex: (w, h) => `M ${r1(-w / 2)} ${r1(h / 2)} L ${r1(-w / 2)} ${r1(-h / 6)} L ${r1(-w / 4)} ${r1(-h / 2)} L ${r1(w / 4)} ${r1(-h / 2)} L ${r1(w / 2)} ${r1(-h / 6)} L ${r1(w / 2)} ${r1(h / 2)} Z`,
  trapezoid: (w, h) => `M ${r1(-w / 2)} ${r1(h / 2)} L ${r1(-w * 0.34)} ${r1(-h / 2)} L ${r1(w * 0.34)} ${r1(-h / 2)} L ${r1(w / 2)} ${r1(h / 2)} Z`,
  gable: (w, h) => `M ${r1(-w / 2)} ${r1(h / 2)} L ${r1(-w / 2)} ${r1(-h * 0.12)} L 0 ${r1(-h / 2)} L ${r1(w / 2)} ${r1(-h * 0.12)} L ${r1(w / 2)} ${r1(h / 2)} Z`,
  chamfer: (w, h) => {
    const c = Math.min(w, h) * 0.18
    return `M ${r1(-w / 2)} ${r1(h / 2)} L ${r1(-w / 2)} ${r1(-h / 2 + c)} L ${r1(-w / 2 + c)} ${r1(-h / 2)} L ${r1(w / 2 - c)} ${r1(-h / 2)} L ${r1(w / 2)} ${r1(-h / 2 + c)} L ${r1(w / 2)} ${r1(h / 2)} Z`
  },
}

const shapeOf = (era: Era, w: number, h: number): string => SHAPES[ERAS[era].shape](w, h)

const ring = (r: number): string => `M ${r1(-r)} 0 A ${r1(r)} ${r1(r)} 0 1 1 ${r1(r)} 0 A ${r1(r)} ${r1(r)} 0 1 1 ${r1(-r)} 0`

type ArtOf = (w: number, h: number, e: EraLook) => ReactNode

// Gate facade ornaments, drawn around the opening (w by h) on the wall.
const ORNAMENTS: Record<Era, ArtOf> = {
  hub: (w, h, e) => {
    const ticks = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      const r0 = w * 0.56
      const r = w * (i % 2 ? 0.6 : 0.64)
      return `M ${r1(Math.cos(a) * r0)} ${r1(Math.sin(a) * r0 * (h / w))} L ${r1(Math.cos(a) * r)} ${r1(Math.sin(a) * r * (h / w))}`
    }).join(' ')
    return (
      <>
        <Neon d={ticks} color={e.a2} width={6} />
        <Neon d={SHAPES.ellipse(w * 1.24, h * 1.24)} color={e.a1} width={5} opacity={0.7} />
      </>
    )
  },
  village: (w, h, e) => (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI + (i / 8) * Math.PI
        const cx = Math.cos(a) * w * 0.6
        const cy = -h / 2 + h * 0.36 + Math.sin(a) * h * 0.47
        return (
          <g key={i}>
            <circle cx={r1(cx)} cy={r1(cy)} r={26} fill="none" stroke={e.a1} strokeWidth={8} />
            <circle cx={r1(cx)} cy={r1(cy)} r={8} fill="#fff" />
          </g>
        )
      })}
      <Neon d={`M ${r1(-w * 0.62)} ${r1(h / 2)} V ${r1(-h * 0.1)} M ${r1(w * 0.62)} ${r1(h / 2)} V ${r1(-h * 0.1)}`} color={e.a2} width={8} />
    </>
  ),
  highway: (w, h, e) => (
    <>
      <rect x={r1(-w * 0.58)} y={r1(-h / 2 - 160)} width={r1(w * 1.16)} height={140} rx={30} fill="#2a0620" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={r1(-w * 0.55 + (i * w * 1.1) / 21)} cy={r1(-h / 2 - 90)} r={16} fill={i % 2 ? e.a2 : '#fff'} />
      ))}
      <Neon d={`M ${r1(-w * 0.58)} ${r1(-h / 2 - 160)} h ${r1(w * 1.16)} v 140 h ${r1(-w * 1.16)} Z`} color={e.a1} width={8} />
    </>
  ),
  swamp: (w, h, e) => (
    <>
      <Neon d={`M ${r1(-w * 0.62)} ${r1(h / 2)} V ${r1(-h * 0.2)} L ${r1(-w * 0.7)} ${r1(-h * 0.34)} M ${r1(w * 0.62)} ${r1(h / 2)} V ${r1(-h * 0.2)} L ${r1(w * 0.7)} ${r1(-h * 0.34)}`} color={e.a2} width={9} />
      <Neon d={SHAPES.pointed(w * 0.36, h * 0.3).replace(/Z$/, '')} color={e.a1} width={6} transform={`translate(0 ${r1(-h * 0.6)})`} />
    </>
  ),
  deepSea: (w, h, e) => (
    <>
      {[
        [-0.56, 0.3],
        [-0.56, -0.05],
        [0.56, 0.3],
        [0.56, -0.05],
        [-0.3, -0.62],
        [0.3, -0.62],
      ].map(([x, y]) => (
        <Neon key={`${x}${y}`} d={SHAPES.hex(70, 80)} color={e.a2} width={5} transform={`translate(${r1(x * w)} ${r1(y * h)})`} />
      ))}
      <Neon d={SHAPES.hex(w * 1.16, h * 1.12)} color={e.a1} width={5} opacity={0.6} />
    </>
  ),
  colosseum: (w, h, e) => (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={r1(-w * 0.6)} y={r1(-h * 0.4 + i * h * 0.12)} width={r1(w * 0.08)} height={20} fill={e.a2} opacity={r1(0.4 + (i % 3) * 0.2)} />
          <rect x={r1(w * 0.52)} y={r1(-h * 0.4 + i * h * 0.12)} width={r1(w * 0.08)} height={20} fill={e.a2} opacity={r1(0.4 + ((i + 1) % 3) * 0.2)} />
        </g>
      ))}
      <Neon d={SHAPES.trapezoid(w * 1.2, h * 1.14)} color={e.a1} width={6} opacity={0.6} />
      <circle cx={0} cy={r1(-h / 2 - 110)} r={54} fill="none" stroke={e.a1} strokeWidth={12} />
      <circle cx={0} cy={r1(-h / 2 - 110)} r={18} fill={e.a2} />
    </>
  ),
  trial: (w, h, e) => {
    const teeth = Array.from({ length: 11 }, (_, i) => {
      const x = -w * 0.5 + (i * w) / 10
      return `M ${r1(x - 60)} ${r1(-h / 2)} L ${r1(x)} ${r1(-h / 2 + 130)} L ${r1(x + 60)} ${r1(-h / 2)}`
    }).join(' ')
    return (
      <>
        <path d={teeth} fill="#2a0614" />
        <Neon d={teeth} color={e.a1} width={6} />
        <Neon d={`M -120 ${r1(-h / 2 - 60)} L 0 ${r1(-h / 2 - 240)} L 120 ${r1(-h / 2 - 60)} Z`} color={e.a2} width={8} />
      </>
    )
  },
  sky: (w, h, e) => (
    <>
      {[-1, 1].flatMap((side) =>
        [0.3, 0, -0.3].map((y) => {
          const x = side * w * 0.64
          return (
            <g key={`${side}${y}`}>
              <rect x={r1(x - 110)} y={r1(y * h - 120)} width={220} height={240} rx={20} fill="#1d0833" />
              <circle cx={r1(x)} cy={r1(y * h)} r={80} fill="none" stroke={e.a1} strokeWidth={10} />
              <circle cx={r1(x)} cy={r1(y * h)} r={28} fill={e.a2} />
            </g>
          )
        }),
      )}
      <Neon d={SHAPES.chamfer(w * 1.08, h * 1.08)} color={e.a2} width={5} opacity={0.7} />
    </>
  ),
  core: (w, h, e) => (
    <>
      <Neon
        d={`M ${r1(-w * 0.62)} ${r1(-h * 0.06)} L 0 ${r1(-h * 0.62)} L ${r1(w * 0.62)} ${r1(-h * 0.06)} M ${r1(-w * 0.62)} ${r1(-h * 0.06)} L ${r1(-w * 0.72)} ${r1(-h * 0.2)} M ${r1(w * 0.62)} ${r1(-h * 0.06)} L ${r1(w * 0.72)} ${r1(-h * 0.2)} M 0 ${r1(-h * 0.62)} V ${r1(-h * 0.76)}`}
        color={e.a1}
        width={10}
      />
      <Neon d={`M ${r1(-w * 0.58)} ${r1(h / 2)} V ${r1(-h * 0.06)} M ${r1(w * 0.58)} ${r1(h / 2)} V ${r1(-h * 0.06)}`} color={e.a2} width={9} />
    </>
  ),
  saved: (w, h, e) => (
    <>
      <Neon d={SHAPES.ellipse(w * 1.2, h * 1.2)} color={e.a1} width={6} />
      <Neon d={SHAPES.ellipse(w * 1.4, h * 1.4)} color={e.a2} width={4} opacity={0.5} />
    </>
  ),
}

/** The art of a plane laid out at world size: its box (w by h, centred unless it stands on the floor). */
export interface PlaneArt {
  w: number
  h: number
  viewBox: string
  art: ReactNode
}

const centred = (w: number, h: number, art: ReactNode): PlaneArt => ({ w, h, viewBox: `${r1(-w / 2)} ${r1(-h / 2)} ${r1(w)} ${r1(h)}`, art })

export function ribArt(era: Era, tw: number): PlaneArt {
  return centred(tw + 120, TH + 120, <Neon d={shapeOf(era, tw, TH)} color={ERAS[era].a1} width={7} />)
}

export function gateArt(era: Era, tw: number): PlaneArt {
  const w = tw * 2.4
  const h = TH * 2.3
  const e = ERAS[era]
  const opening = shapeOf(era, tw, TH)
  return centred(
    w,
    h,
    <>
      <path fillRule="evenodd" d={`M ${r1(-w / 2)} ${r1(-h / 2)} H ${r1(w / 2)} V ${r1(h / 2)} H ${r1(-w / 2)} Z ${opening}`} fill={e.wall} />
      {ORNAMENTS[era](tw, TH, e)}
      <Neon d={opening} color={e.a1} width={12} />
    </>,
  )
}

// The decor that turns with the scroll: the hub's time ring, the village's star wheel, the trial
// corona, the sky's laser fan, the saved's rays. Its place and turn are in world.ts DECOR.
const DECOR_ART: Partial<Record<Era, (tw: number) => PlaneArt>> = {
  hub: (tw) => {
    const r = Math.min(tw, TH) * 0.42
    const ticks = Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2
      const inner = r * (i % 3 ? 0.9 : 0.82)
      return `M ${r1(Math.cos(a) * r)} ${r1(Math.sin(a) * r)} L ${r1(Math.cos(a) * inner)} ${r1(Math.sin(a) * inner)}`
    }).join(' ')
    const size = r * 2.3
    return centred(
      size,
      size,
      <>
        <Neon d={ticks} color={ERAS.hub.a1} width={5} />
        <Neon d={ring(r)} color={ERAS.hub.a2} width={4} />
      </>,
    )
  },
  village: () => {
    const r = TH * 0.34
    const rand = seeded(7)
    const stars = Array.from({ length: 9 }, () => [(rand() - 0.5) * r * 1.6, (rand() - 0.5) * r * 1.6] as const)
    const lines = stars
      .slice(1)
      .map(([x, y], i) => `M ${r1(stars[i][0])} ${r1(stars[i][1])} L ${r1(x)} ${r1(y)}`)
      .join(' ')
    return centred(
      r * 2.4,
      r * 2.4,
      <>
        <Neon d={ring(r)} color={ERAS.village.a1} width={4} opacity={0.6} />
        <Neon d={lines} color={ERAS.village.a2} width={3} />
        {stars.map(([x, y]) => (
          <circle key={`${x}${y}`} cx={r1(x)} cy={r1(y)} r={12} fill="#fff" />
        ))}
      </>,
    )
  },
  trial: () => {
    const r = TH * 0.2
    const rays = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      const out = r * (i % 2 ? 1.5 : 1.8)
      return `M ${r1(Math.cos(a) * r * 1.1)} ${r1(Math.sin(a) * r * 1.1)} L ${r1(Math.cos(a) * out)} ${r1(Math.sin(a) * out)}`
    }).join(' ')
    return centred(r * 4, r * 4, <Neon d={rays} color={ERAS.trial.a1} width={6} />)
  },
  sky: () => {
    const beams = Array.from({ length: 7 }, (_, i) => {
      const a = -Math.PI / 2 + (i - 3) * 0.28
      return `M 0 0 L ${r1(Math.cos(a) * TH)} ${r1(Math.sin(a) * TH)}`
    }).join(' ')
    return centred(TH * 2, TH * 2, <Neon d={beams} color={ERAS.sky.a1} width={5} opacity={0.75} />)
  },
  saved: () => {
    const rays = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return `M ${r1(Math.cos(a) * TH * 0.2)} ${r1(Math.sin(a) * TH * 0.2)} L ${r1(Math.cos(a) * TH * 0.6)} ${r1(Math.sin(a) * TH * 0.6)}`
    }).join(' ')
    return centred(TH * 1.3, TH * 1.3, <Neon d={rays} color={ERAS.saved.a1} width={4} opacity={0.5} />)
  },
}

export function decorArt(era: Era, tw: number): PlaneArt {
  const make = DECOR_ART[era]
  if (!make) return centred(1, 1, null)
  return make(tw)
}
