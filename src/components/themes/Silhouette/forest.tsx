import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { transformTo } from '../shared/stageNodes'
import { FIGURE_VIEW, ShadeFigure } from './figure'
import { LIGHTS, SHADE, type Light, type LightName } from './palette'

// The drawing kit of the black forest behind the page: black shapes against a lit sky, depth by fog. Every
// scene is a stack of SVG layers on one 1600 by 1000 canvas anchored to its bottom centre (xMidYMax slice),
// so a phone, which sees about x 570 to 1030, and a desktop crop the same art: the sky in its light with a
// glow low on the horizon, the place's far shapes pale with fog, the fog band, the mid trunks a shade
// darker, the black ground he walks, and soft black shapes out of focus in front. Focus is faked with light,
// not blur: the far layer is pale and low in contrast, the near one dim and soft edged. He is the figure
// (figure.tsx) drawn into the canvas and posed by the scene's writer (pose.ts).

export const W = 1600
export const H = 1000
/** The top of the ground: his soles and every prop stand on it. */
export const FLOOR = 880

/** His drawn height on the canvas: small in his world, as the genre draws him. */
export const FIGURE_H = 260
const FIGURE_W = (FIGURE_H * FIGURE_VIEW.width) / FIGURE_VIEW.height

export function Canvas({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** The sky in its light, top to horizon, and the glow where the light comes from. */
export function Sky({ light }: { light: LightName }) {
  const { top, low, rim } = LIGHTS[light]
  const id = `sh-sky-${light}`
  return (
    <Canvas>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.85" stopColor={low} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={rim} stopOpacity="0.55" />
          <stop offset="1" stopColor={rim} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      <ellipse cx={1080} cy={640} rx={520} ry={260} fill={`url(#${id}-glow)`} />
    </Canvas>
  )
}

/** A two tier pine with its foot on the ground line at y. */
export function pinePath(x: number, height: number, y: number): string {
  const top = y - height
  const trunk = Math.max(4, height * 0.025)
  return `M${x - trunk} ${y} H${x + trunk} V${top + height * 0.7} H${x - trunk} Z M${x - height * 0.16} ${top + height * 0.5} L${x} ${top} L${x + height * 0.16} ${top + height * 0.5} Z M${x - height * 0.24} ${top + height * 0.82} L${x} ${top + height * 0.28} L${x + height * 0.24} ${top + height * 0.82} Z`
}

/** A gear outline for the machinery: `teeth` square teeth round a ring of radius r, with a hub hole. */
export function gearPath(cx: number, cy: number, r: number, teeth: number): string {
  const step = (Math.PI * 2) / teeth
  const outer = r * 1.16
  const points = Array.from({ length: teeth }, (_, index) => {
    const a = index * step
    const corners = [
      [a - step * 0.25, r],
      [a - step * 0.16, outer],
      [a + step * 0.16, outer],
      [a + step * 0.25, r],
    ]
    return corners.map(([angle, radius]) => `${(cx + Math.cos(angle) * radius).toFixed(1)} ${(cy + Math.sin(angle) * radius).toFixed(1)}`).join(' L')
  })
  const hub = r * 0.32
  return `M${points.join(' L')} Z M${cx - hub} ${cy} A${hub} ${hub} 0 1 0 ${cx + hub} ${cy} A${hub} ${hub} 0 1 0 ${cx - hub} ${cy} Z`
}

const FAR_PINES = [60, 170, 260, 380, 520, 610, 760, 1180, 1290, 1420, 1530]

/** The far forest, pale with fog: a row of pines on a low ridge. */
export function FarPines({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill={light.far} opacity={0.8}>
        {FAR_PINES.map((x, i) => (
          <path key={x} d={pinePath(x, 260 + (i % 4) * 70, 860)} />
        ))}
        <path d="M0 860 Q400 820 800 850 T1600 840 V1000 H0 Z" />
      </g>
    </Canvas>
  )
}

/** The fog band over the ground, in the light's own fog. */
export function Fog({ light }: { light: Light }) {
  return (
    <Canvas>
      <rect y={700} width={W} height={220} fill={light.fog} />
      <rect y={780} width={W} height={120} fill={light.fog} />
    </Canvas>
  )
}

const TRUNKS = [[90, 44], [300, 26], [1240, 30], [1500, 52]] as const

/** The mid forest a shade darker: a few tall trunks out of the top of the frame, a bough off each. */
export function Trunks({ light }: { light: Light }) {
  return (
    <Canvas>
      <g fill={light.mid}>
        {TRUNKS.map(([x, w]) => (
          <path key={x} d={`M${x} 0 H${x + w} V${FLOOR} H${x - 6} Q${x + w * 0.3} 500 ${x} 0 Z`} />
        ))}
        <path d="M134 300 Q200 340 230 420 L222 424 Q190 360 130 320 Z M1262 240 Q1200 290 1180 380 L1188 384 Q1214 300 1268 262 Z" />
      </g>
    </Canvas>
  )
}

/** The black ground he walks, a rise and a dip in it, and a rim of light along its top edge. */
export function Ground({ light }: { light: Light }) {
  return (
    <Canvas>
      <path d={`M0 ${FLOOR + 6} Q240 ${FLOOR - 8} 520 ${FLOOR} T1100 ${FLOOR - 2} T1600 ${FLOOR + 4} V${H} H0 Z`} fill={SHADE.black} />
      <path d={`M0 ${FLOOR + 6} Q240 ${FLOOR - 8} 520 ${FLOOR} T1100 ${FLOOR - 2} T1600 ${FLOOR + 4}`} fill="none" stroke={light.rim} strokeOpacity={0.25} strokeWidth={2} />
    </Canvas>
  )
}

/** A soft edged black shape out of focus: the shape at full dark over a wider, fainter copy of itself. */
function Soft({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill={SHADE.black} opacity={0.35} stroke={SHADE.black} strokeOpacity={0.35} strokeWidth={30} strokeLinejoin="round" />
      <path d={d} fill={SHADE.black} opacity={0.85} />
    </>
  )
}

/** In front, out of focus: a bough hanging into the top corner and grass at both bottom corners. */
export function Front() {
  return (
    <Canvas>
      <Soft d="M0 0 H320 Q220 60 160 130 Q80 200 0 220 Z" />
      <Soft d="M0 1000 L0 800 L30 920 L60 760 L90 910 L120 830 L150 950 L186 860 L204 1000 Z" />
      <Soft d="M1600 1000 L1600 780 L1564 920 L1534 820 L1498 930 L1468 860 L1438 1000 Z" />
    </Canvas>
  )
}

const figureAt = (x: number): string => `translate(${(x - FIGURE_W / 2).toFixed(1)} ${(FLOOR - FIGURE_H * (FIGURE_VIEW.soles / FIGURE_VIEW.height)).toFixed(1)})`

/** Him on the ground at `x` (his centre), in a profession's kit; the scene's writer moves and poses him. */
export function Figure({ x, profession }: { x: number; profession: Profession }) {
  return (
    <g data-fx="figure" transform={figureAt(x)}>
      <ShadeFigure profession={profession} box={{ width: FIGURE_W, height: FIGURE_H }} />
    </g>
  )
}

/** Moves him to `x` on the ground. */
export const placeFigure = (node: Element | null, x: number): void => transformTo(node, figureAt(x))
