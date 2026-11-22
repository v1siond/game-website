import type { ReactNode } from 'react'
import { ERAS, type Era, type EraLook, type GateShape } from './palette'
import { FLOOR, seeded, TH } from './world'

// Every era of the corridor, drawn in code in world units: the shape of its gate (also the shape of its
// tunnel ribs), the ornaments on its gate facade, the decor that turns with the scroll and the vista at
// the far end of its room. Our own places and times; nothing here is taken from a game.

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

const points = (list: ReadonlyArray<readonly [number, number]>): string => list.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ')

function Stars({ seed, count, w, h, color = '#fff' }: { seed: number; count: number; w: number; h: number; color?: string }) {
  const rand = seeded(seed)
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const r = 2 + rand() * 5
        return <circle key={i} cx={r1((rand() - 0.5) * w)} cy={r1(-h / 2 + rand() * h * 0.55)} r={r1(r)} fill={color} opacity={r1(0.35 + rand() * 0.6)} />
      })}
    </>
  )
}

function Sky({ id, w, h, stops }: { id: string; w: number; h: number; stops: ReadonlyArray<readonly [number, string]> }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <rect x={r1(-w / 2)} y={r1(-h / 2)} width={r1(w)} height={r1(h)} fill={`url(#${id})`} />
    </>
  )
}

/** A sun or moon cut by horizontal gaps (the retro stripes), as bands clipped to the disc. */
function StripedDisc({ id, cx, cy, r, color, bands }: { id: string; cx: number; cy: number; r: number; color: string; bands: number }) {
  return (
    <>
      <defs>
        <clipPath id={id}>
          <circle cx={r1(cx)} cy={r1(cy)} r={r1(r)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`} fill={color}>
        {Array.from({ length: bands }, (_, i) => {
          const y0 = cy - r + (i * 2 * r) / bands
          const gap = i < bands / 2 ? 0 : (i - bands / 2 + 1) * (r / bands) * 0.35
          const y1 = y0 + (2 * r) / bands - gap
          return <rect key={i} x={r1(cx - r)} y={r1(y0)} width={r1(2 * r)} height={r1(Math.max(4, y1 - y0))} />
        })}
      </g>
    </>
  )
}

const Ground = ({ w, h, top, fill }: { w: number; h: number; top: number; fill: string }) => (
  <rect x={r1(-w / 2)} y={r1(top)} width={r1(w)} height={r1(h / 2 - top)} fill={fill} />
)

type ArtOf = (w: number, h: number, e: EraLook) => ReactNode

const VISTAS: Partial<Record<Era, ArtOf>> = {
  observatory: (w, h, e) => {
    const base = h * 0.18
    return (
      <>
        <Sky id="np-sky-observatory" w={w} h={h} stops={[[0, '#04161a'], [0.55, '#0b2b2a'], [0.78, '#6b3d0c'], [1, '#2a1503']]} />
        <Stars seed={11} count={90} w={w} h={h} />
        {[0.42, 0.32, 0.22, 0.12].map((half, i) => (
          <rect key={half} x={r1(-w * half)} y={r1(base - (i + 1) * h * 0.07)} width={r1(w * half * 2)} height={r1(h * 0.07 + 2)} fill="#130b03" />
        ))}
        <rect x={r1(-w * 0.04)} y={r1(base - h * 0.36)} width={r1(w * 0.08)} height={r1(h * 0.08)} fill="#130b03" />
        <Neon d={`M ${r1(-w * 0.42)} ${r1(base)} H ${r1(w * 0.42)}`} color={e.a1} width={6} />
        <Ground w={w} h={h} top={base} fill="#1a0e03" />
      </>
    )
  },
  speedway: (w, h, e) => {
    const horizon = h * 0.08
    return (
      <>
        <Sky id="np-sky-speedway" w={w} h={h} stops={[[0, '#1b0526'], [0.45, '#7a0f52'], [0.62, '#ff6a3d'], [0.66, '#2a0820'], [1, '#14040f']]} />
        <StripedDisc id="np-sun-speedway" cx={0} cy={horizon - h * 0.12} r={h * 0.22} color="#ffb347" bands={9} />
        <polygon points={points([[-w / 2, horizon], [-w * 0.44, horizon - h * 0.1], [-w * 0.3, horizon - h * 0.1], [-w * 0.26, horizon - h * 0.04], [-w * 0.16, horizon]])} fill="#2d0721" />
        <polygon points={points([[w * 0.14, horizon], [w * 0.2, horizon - h * 0.07], [w * 0.36, horizon - h * 0.08], [w * 0.4, horizon - h * 0.15], [w * 0.47, horizon - h * 0.15], [w / 2, horizon]])} fill="#2d0721" />
        <Ground w={w} h={h} top={horizon} fill="#1c0416" />
        <polygon points={points([[-w * 0.03, horizon], [w * 0.03, horizon], [w * 0.36, h / 2], [-w * 0.36, h / 2]])} fill="#2b0a26" />
        <Neon d={`M ${r1(-w * 0.03)} ${r1(horizon)} L ${r1(-w * 0.36)} ${r1(h / 2)} M ${r1(w * 0.03)} ${r1(horizon)} L ${r1(w * 0.36)} ${r1(h / 2)}`} color={e.a1} width={5} />
        <Neon d={`M 0 ${r1(horizon + 20)} V ${r1(horizon + 60)} M 0 ${r1(horizon + 110)} V ${r1(horizon + 190)} M 0 ${r1(horizon + 260)} V ${r1(h / 2)}`} color={e.a2} width={6} />
      </>
    )
  },
  forge: (w, h, e) => {
    const rand = seeded(23)
    const ground = h * 0.16
    return (
      <>
        <Sky id="np-sky-forge" w={w} h={h} stops={[[0, '#0d0302'], [0.5, '#4a0f06'], [0.72, '#c4380f'], [1, '#3a0d04']]} />
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={r1((rand() - 0.5) * w)} cy={r1(-h / 2 + rand() * h * 0.6)} r={r1(2 + rand() * 4)} fill={e.a1} opacity={r1(0.3 + rand() * 0.7)} />
        ))}
        <circle cx={r1(w * 0.28)} cy={r1(-h * 0.24)} r={r1(h * 0.08)} fill="#ffd0a0" opacity={0.9} />
        <rect x={r1(-w * 0.42)} y={r1(ground - h * 0.12)} width={r1(w * 0.84)} height={r1(h * 0.12)} fill="#120502" />
        {[-0.34, -0.18, 0.02, 0.2, 0.36].map((x, i) => {
          const tw = w * (i === 2 ? 0.09 : 0.06)
          const th = h * (i === 2 ? 0.42 : 0.28)
          const cx = w * x
          return (
            <g key={x}>
              <rect x={r1(cx - tw / 2)} y={r1(ground - th)} width={r1(tw)} height={r1(th)} fill="#120502" />
              <polygon points={points([[cx - tw * 0.7, ground - th], [cx, ground - th - tw * 1.3], [cx + tw * 0.7, ground - th]])} fill="#120502" />
              <rect x={r1(cx - 8)} y={r1(ground - th * 0.7)} width={16} height={34} fill={e.a1} opacity={0.9} />
            </g>
          )
        })}
        <Ground w={w} h={h} top={ground} fill="#160603" />
        <Neon d={`M ${r1(-w * 0.42)} ${r1(ground - h * 0.12)} H ${r1(w * 0.42)}`} color={e.a2} width={5} />
      </>
    )
  },
  relay: (w, h, e) => {
    const rand = seeded(37)
    const ground = h * 0.2
    const towers = Array.from({ length: 13 }, (_, i) => {
      const cx = -w * 0.46 + (i * w * 0.92) / 12
      const tw = w * (0.035 + rand() * 0.035)
      const th = h * (0.2 + rand() * 0.45)
      return (
        <g key={i}>
          <rect x={r1(cx - tw / 2)} y={r1(ground - th)} width={r1(tw)} height={r1(th)} fill="#041109" />
          {Array.from({ length: 6 }, (_, k) => (
            <rect key={k} x={r1(cx - tw * 0.3)} y={r1(ground - th + 30 + k * th * 0.15)} width={r1(tw * 0.6)} height={6} fill={k % 2 ? e.a2 : e.a1} opacity={0.7} />
          ))}
        </g>
      )
    })
    return (
      <>
        <Sky id="np-sky-relay" w={w} h={h} stops={[[0, '#010806'], [0.55, '#06352b'], [0.8, '#2f6b12'], [1, '#04140a']]} />
        <Stars seed={38} count={50} w={w} h={h} color={e.a2} />
        <Neon d={SHAPES.ellipse(w * 0.62, h * 0.62)} color={e.a2} width={4} opacity={0.55} />
        {towers}
        <Neon d={`M ${r1(-w * 0.32)} ${r1(ground - h * 0.3)} H ${r1(w * 0.3)}`} color={e.a1} width={7} />
        <Ground w={w} h={h} top={ground} fill="#03100a" />
      </>
    )
  },
  sands: (w, h, e) => {
    const ground = h * 0.2
    const pyramid = (cx: number, half: number, height: number) => (
      <g key={cx}>
        <polygon points={points([[cx - half, ground], [cx, ground - height], [cx + half, ground]])} fill="#081822" />
        <polygon points={points([[cx, ground - height], [cx + half, ground], [cx + half * 0.15, ground]])} fill="#0f2a35" />
        <Neon d={`M ${r1(cx - half)} ${r1(ground)} L ${r1(cx)} ${r1(ground - height)} L ${r1(cx + half)} ${r1(ground)}`} color={e.a1} width={4} opacity={0.8} />
      </g>
    )
    return (
      <>
        <Sky id="np-sky-sands" w={w} h={h} stops={[[0, '#020611'], [0.6, '#0a2a44'], [1, '#123d4c']]} />
        <Stars seed={41} count={80} w={w} h={h} />
        <circle cx={r1(-w * 0.18)} cy={r1(-h * 0.2)} r={r1(h * 0.15)} fill="#f4ffe8" opacity={0.92} />
        <circle cx={r1(-w * 0.18)} cy={r1(-h * 0.2)} r={r1(h * 0.22)} fill="#f4ffe8" opacity={0.08} />
        {pyramid(w * 0.16, w * 0.22, h * 0.34)}
        {pyramid(-w * 0.3, w * 0.14, h * 0.2)}
        {pyramid(w * 0.4, w * 0.1, h * 0.13)}
        <polygon points={points([[-w / 2, ground], [-w * 0.2, ground - 30], [w * 0.1, ground + 10], [w / 2, ground - 20], [w / 2, h / 2], [-w / 2, h / 2]])} fill="#0b2029" />
        <Neon d={`M ${r1(-w / 2)} ${r1(ground)} Q ${r1(-w * 0.2)} ${r1(ground - 60)} ${r1(w * 0.1)} ${r1(ground + 10)} T ${r1(w / 2)} ${r1(ground - 20)}`} color={e.a2} width={4} opacity={0.7} />
      </>
    )
  },
  keystone: (w, h, e) => {
    const ground = h * 0.22
    const rocks: Array<readonly [number, number]> = [
      [-w / 2, ground],
      [-w * 0.4, ground - h * 0.2],
      [-w * 0.3, ground - h * 0.08],
      [-w * 0.2, ground - h * 0.26],
      [-w * 0.08, ground],
      [w * 0.1, ground],
      [w * 0.22, ground - h * 0.3],
      [w * 0.32, ground - h * 0.1],
      [w * 0.42, ground - h * 0.22],
      [w / 2, ground],
      [w / 2, h / 2],
      [-w / 2, h / 2],
    ]
    return (
      <>
        <Sky id="np-sky-keystone" w={w} h={h} stops={[[0, '#05010a'], [0.6, '#2a0517'], [1, '#4a0a22']]} />
        <circle cx={0} cy={r1(-h * 0.1)} r={r1(h * 0.3)} fill={e.a1} opacity={0.12} />
        <circle cx={0} cy={r1(-h * 0.1)} r={r1(h * 0.24)} fill={e.a1} opacity={0.25} />
        <Neon d={SHAPES.ellipse(h * 0.4, h * 0.4)} color={e.a1} width={8} transform={`translate(0 ${r1(-h * 0.1)})`} />
        <circle cx={0} cy={r1(-h * 0.1)} r={r1(h * 0.19)} fill="#05010a" />
        <polygon points={points(rocks)} fill="#0d0207" />
      </>
    )
  },
  arena: (w, h, e) => {
    const rand = seeded(53)
    const ground = h * 0.18
    return (
      <>
        <Sky id="np-sky-arena" w={w} h={h} stops={[[0, '#07020f'], [0.55, '#2b0a4a'], [0.85, '#7a1a8a'], [1, '#1a0526']]} />
        <StripedDisc id="np-sun-arena" cx={0} cy={ground - h * 0.05} r={h * 0.2} color="#ff7ad9" bands={8} />
        {Array.from({ length: 16 }, (_, i) => {
          const cx = -w * 0.48 + (i * w * 0.96) / 15
          const th = h * (0.1 + rand() * 0.3)
          return (
            <g key={i}>
              <rect x={r1(cx - w * 0.028)} y={r1(ground - th)} width={r1(w * 0.056)} height={r1(th)} fill="#0c0318" />
              <rect x={r1(cx - w * 0.02)} y={r1(ground - th + 20)} width={r1(w * 0.04)} height={5} fill={i % 2 ? e.a2 : e.a1} />
            </g>
          )
        })}
        <Ground w={w} h={h} top={ground} fill="#12041f" />
        <Neon d={`M ${r1(-w / 2)} ${r1(ground)} H ${r1(w / 2)}`} color={e.a2} width={5} />
      </>
    )
  },
  pavilion: (w, h, e) => {
    const ground = h * 0.2
    const roof = (cx: number, half: number, tiers: number, top: number) => (
      <g key={cx}>
        {Array.from({ length: tiers }, (_, i) => {
          const hw = half * (1 - i * 0.24)
          const y = ground - top + i * -h * 0.07
          return (
            <g key={i}>
              <polygon points={points([[cx - hw, y], [cx - hw * 0.7, y - h * 0.09], [cx + hw * 0.7, y - h * 0.09], [cx + hw, y]])} fill="#170a02" />
              <Neon d={`M ${r1(cx - hw)} ${r1(y)} L ${r1(cx - hw * 1.1)} ${r1(y - h * 0.05)}`} color={e.a1} width={4} />
              <Neon d={`M ${r1(cx + hw)} ${r1(y)} L ${r1(cx + hw * 1.1)} ${r1(y - h * 0.05)}`} color={e.a1} width={4} />
            </g>
          )
        })}
        <rect x={r1(cx - half * 0.7)} y={r1(ground - top)} width={r1(half * 1.4)} height={r1(top)} fill="#170a02" />
      </g>
    )
    return (
      <>
        <Sky id="np-sky-pavilion" w={w} h={h} stops={[[0, '#1a0703'], [0.5, '#8a2a08'], [0.75, '#ffb03a'], [1, '#3a1704']]} />
        <circle cx={r1(w * 0.05)} cy={r1(ground - h * 0.3)} r={r1(h * 0.2)} fill="#ffe7a3" opacity={0.95} />
        {roof(-w * 0.26, w * 0.12, 3, h * 0.12)}
        {roof(w * 0.24, w * 0.16, 4, h * 0.16)}
        <Ground w={w} h={h} top={ground} fill="#1c0b03" />
        <Neon d={`M ${r1(-w / 2)} ${r1(ground)} H ${r1(w / 2)}`} color={e.a2} width={5} />
      </>
    )
  },
  beacon: (w, h, e) => (
    <>
      <defs>
        <radialGradient id="np-sky-beacon" cx=".5" cy=".42" r=".7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".18" stopColor="#d9fbff" />
          <stop offset=".5" stopColor="#2aa6c4" />
          <stop offset="1" stopColor="#03121a" />
        </radialGradient>
      </defs>
      <rect x={r1(-w / 2)} y={r1(-h / 2)} width={r1(w)} height={r1(h)} fill="url(#np-sky-beacon)" />
      <Neon d={SHAPES.ellipse(w * 0.5, h * 0.5)} color={e.a2} width={5} opacity={0.6} />
      <Neon d={SHAPES.ellipse(w * 0.75, h * 0.75)} color={e.a2} width={4} opacity={0.35} />
    </>
  ),
}

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
  observatory: (w, h, e) => (
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
  speedway: (w, h, e) => (
    <>
      <rect x={r1(-w * 0.58)} y={r1(-h / 2 - 160)} width={r1(w * 1.16)} height={140} rx={30} fill="#2a0620" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={r1(-w * 0.55 + (i * w * 1.1) / 21)} cy={r1(-h / 2 - 90)} r={16} fill={i % 2 ? e.a2 : '#fff'} />
      ))}
      <Neon d={`M ${r1(-w * 0.58)} ${r1(-h / 2 - 160)} h ${r1(w * 1.16)} v 140 h ${r1(-w * 1.16)} Z`} color={e.a1} width={8} />
    </>
  ),
  forge: (w, h, e) => (
    <>
      <Neon d={`M ${r1(-w * 0.62)} ${r1(h / 2)} V ${r1(-h * 0.2)} L ${r1(-w * 0.7)} ${r1(-h * 0.34)} M ${r1(w * 0.62)} ${r1(h / 2)} V ${r1(-h * 0.2)} L ${r1(w * 0.7)} ${r1(-h * 0.34)}`} color={e.a2} width={9} />
      <Neon d={SHAPES.pointed(w * 0.36, h * 0.3).replace(/Z$/, '')} color={e.a1} width={6} transform={`translate(0 ${r1(-h * 0.6)})`} />
    </>
  ),
  relay: (w, h, e) => (
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
  sands: (w, h, e) => (
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
  keystone: (w, h, e) => {
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
  arena: (w, h, e) => (
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
  pavilion: (w, h, e) => (
    <>
      <Neon
        d={`M ${r1(-w * 0.62)} ${r1(-h * 0.06)} L 0 ${r1(-h * 0.62)} L ${r1(w * 0.62)} ${r1(-h * 0.06)} M ${r1(-w * 0.62)} ${r1(-h * 0.06)} L ${r1(-w * 0.72)} ${r1(-h * 0.2)} M ${r1(w * 0.62)} ${r1(-h * 0.06)} L ${r1(w * 0.72)} ${r1(-h * 0.2)} M 0 ${r1(-h * 0.62)} V ${r1(-h * 0.76)}`}
        color={e.a1}
        width={10}
      />
      <Neon d={`M ${r1(-w * 0.58)} ${r1(h / 2)} V ${r1(-h * 0.06)} M ${r1(w * 0.58)} ${r1(h / 2)} V ${r1(-h * 0.06)}`} color={e.a2} width={9} />
    </>
  ),
  beacon: (w, h, e) => (
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

export function vistaArt(era: Era, tw: number): PlaneArt {
  const w = tw * 1.25
  const h = TH * 1.25
  return centred(w, h, VISTAS[era]?.(w, h, ERAS[era]))
}

// The decor that turns with the scroll: the hub's time ring, the observatory's star wheel, the keystone
// corona, the arena's laser fan, the beacon's rays. Its place and turn are in world.ts DECOR.
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
  observatory: () => {
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
        <Neon d={ring(r)} color={ERAS.observatory.a1} width={4} opacity={0.6} />
        <Neon d={lines} color={ERAS.observatory.a2} width={3} />
        {stars.map(([x, y]) => (
          <circle key={`${x}${y}`} cx={r1(x)} cy={r1(y)} r={12} fill="#fff" />
        ))}
      </>,
    )
  },
  keystone: () => {
    const r = TH * 0.2
    const rays = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      const out = r * (i % 2 ? 1.5 : 1.8)
      return `M ${r1(Math.cos(a) * r * 1.1)} ${r1(Math.sin(a) * r * 1.1)} L ${r1(Math.cos(a) * out)} ${r1(Math.sin(a) * out)}`
    }).join(' ')
    return centred(r * 4, r * 4, <Neon d={rays} color={ERAS.keystone.a1} width={6} />)
  },
  arena: () => {
    const beams = Array.from({ length: 7 }, (_, i) => {
      const a = -Math.PI / 2 + (i - 3) * 0.28
      return `M 0 0 L ${r1(Math.cos(a) * TH)} ${r1(Math.sin(a) * TH)}`
    }).join(' ')
    return centred(TH * 2, TH * 2, <Neon d={beams} color={ERAS.arena.a1} width={5} opacity={0.75} />)
  },
  beacon: () => {
    const rays = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return `M ${r1(Math.cos(a) * TH * 0.2)} ${r1(Math.sin(a) * TH * 0.2)} L ${r1(Math.cos(a) * TH * 0.6)} ${r1(Math.sin(a) * TH * 0.6)}`
    }).join(' ')
    return centred(TH * 1.3, TH * 1.3, <Neon d={rays} color={ERAS.beacon.a1} width={4} opacity={0.5} />)
  },
}

export function decorArt(era: Era, tw: number): PlaneArt {
  const make = DECOR_ART[era]
  if (!make) return centred(1, 1, null)
  return make(tw)
}

/** The keystone door: two halves that slide apart, a lamp on the left half per venture. */
export function doorArt(era: Era, tw: number): PlaneArt {
  const e = ERAS[era]
  const w = tw
  const h = TH
  const half = (side: -1 | 1) => {
    const x0 = side < 0 ? -w / 2 : 0
    return (
      <g data-part={side < 0 ? 'doorL' : 'doorR'}>
        <rect x={r1(x0)} y={r1(-h / 2)} width={r1(w / 2)} height={r1(h)} fill="#14040d" />
        <Neon d={`M ${r1(x0 + 20)} ${r1(-h / 2 + 20)} h ${r1(w / 2 - 40)} v ${r1(h - 40)} h ${r1(-w / 2 + 40)} Z`} color={e.a1} width={6} />
        {side < 0 &&
          Array.from({ length: 5 }, (_, i) => (
            <circle key={i} data-part={`lamp${i}`} cx={r1(side * w * 0.12)} cy={r1(-h * 0.32 + i * h * 0.14)} r={34} fill={e.a2} opacity={0.15} />
          ))}
      </g>
    )
  }
  return centred(
    w,
    h,
    <>
      {half(-1)}
      {half(1)}
    </>,
  )
}

/** The floor line of the tunnel, for the runner's shadow and the props' feet. */
export const FLOOR_Y = FLOOR
