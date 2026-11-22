'use client'

import { memo, useId, type ReactNode } from 'react'
import { DARK_FANTASY } from './palette'

// The boss arena the knight's scenes play in, a gothic STAGE drawn on one 1920 by 1080 canvas and split into
// the theatre's layers: the back wall with its distant towers and small lancet windows (sky), the chandelier
// and the hanging soul lamps (far), the interior columns (mid), the floor, cornice and balustrade ledge
// (near) and the stone and crystal spikes with the bottom mist in front of everything (fg). The lancets glow
// in the scene's own light. The soul motes drift with the scroll ([data-fx="motes"]). Every shape is placed
// by its index, so the server and the browser draw the same picture.

export const HALL_W = 1920
export const HALL_H = 1080
const HORIZON = 560

/** One layer's canvas: the arena's size, bottom anchored, cropped at the sides on a narrow screen. */
export function HallLayer({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${HALL_W} ${HALL_H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

// A stable stand in for chance: the same fraction in 0 to 1 for the same index on every render.
const scatter = (i: number): number => {
  const s = Math.sin(i * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

// small, distant pointed-arch (lancet) window set into the back wall
function Lancet({ x, baseY, w, h, op, light }: { x: number; baseY: number; w: number; h: number; op: number; light: string }) {
  const hw = w / 2
  const l = x - hw
  const r = x + hw
  const apexY = baseY - h
  const springY = baseY - h + Math.min(w * 0.8, h * 0.5)
  const d = `M${l},${baseY} L${l},${springY} Q${l},${apexY} ${x},${apexY} Q${r},${apexY} ${r},${springY} L${r},${baseY} Z`
  return (
    <g>
      <path d={d} fill={light} opacity={op * 0.45} />
      <path d={d} fill="none" stroke={DARK_FANTASY.stoneGrey} strokeWidth="2.5" opacity={op * 1.8} />
      <line x1={x} y1={baseY} x2={x} y2={apexY} stroke={DARK_FANTASY.stoneGrey} strokeWidth="1.5" opacity={op * 1.4} />
    </g>
  )
}

function Tower({ x, baseY, w, topY, op }: { x: number; baseY: number; w: number; topY: number; op: number }) {
  const hw = w / 2
  const roofH = w * 1.9
  return (
    <g fill={DARK_FANTASY.voidDeep} opacity={op}>
      <rect x={x - hw} y={topY} width={w} height={baseY - topY} />
      <polygon points={`${x - hw},${topY} ${x},${topY - roofH} ${x + hw},${topY}`} />
    </g>
  )
}

const MOTES = Array.from({ length: 18 }, (_, i) => ({
  x: ((i * 47 + 5) % 100) * (HALL_W / 100),
  y: ((i * 23 + 7) % 70) * (HALL_H / 100),
  r: 1 + (i % 3) * 0.5,
  gold: i % 5 === 0,
}))

/** The back wall: the cavern's gradient, the nave and floor light, the towers, pilasters and lancets lit in `light`, the motes. */
export const HallSky = memo(function HallSky({ light }: { light: string }) {
  const id = useId()
  return (
    <HallLayer>
      <defs>
        <linearGradient id={`${id}cavern`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DARK_FANTASY.void} />
          <stop offset="0.4" stopColor={DARK_FANTASY.voidDeep} />
          <stop offset="1" stopColor={DARK_FANTASY.voidPurple} />
        </linearGradient>
        <radialGradient id={`${id}nave`} cx="0.5" cy="0.22" r="0.5">
          <stop offset="0" stopColor={light} stopOpacity="0.12" />
          <stop offset="1" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}floor`} cx="0.5" cy="0.84" r="0.45">
          <stop offset="0" stopColor={DARK_FANTASY.ethereal} stopOpacity="0.05" />
          <stop offset="1" stopColor={DARK_FANTASY.ethereal} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}mote`}>
          <stop offset="0" stopColor={DARK_FANTASY.etherealDark} />
          <stop offset="1" stopColor={DARK_FANTASY.etherealDark} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}moteGold`}>
          <stop offset="0" stopColor={DARK_FANTASY.spiritGold} />
          <stop offset="1" stopColor={DARK_FANTASY.spiritGold} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={HALL_W} height={HALL_H} fill={`url(#${id}cavern)`} />
      <rect width={HALL_W} height={HALL_H} fill={`url(#${id}nave)`} />
      <rect width={HALL_W} height={HALL_H} fill={`url(#${id}floor)`} />

      {/* distant towers beyond the wall (faint, high) */}
      <Tower x={360} baseY={200} w={34} topY={-50} op={0.28} />
      <Tower x={960} baseY={165} w={54} topY={-120} op={0.32} />
      <Tower x={1560} baseY={200} w={34} topY={-50} op={0.28} />

      {/* BACK WALL */}
      <rect x="0" y="0" width={HALL_W} height={HORIZON} fill={DARK_FANTASY.void} opacity="0.55" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={`pil${i}`} x={70 + i * 145} y={0} width="14" height={HORIZON} fill={DARK_FANTASY.voidDeep} opacity="0.4" />
      ))}
      {/* small, distant lancet windows, high on the wall, lit by the scene */}
      {Array.from({ length: 12 }, (_, i) => (
        <Lancet key={`w${i}`} x={150 + i * 145} baseY={430} w={96} h={250} op={0.16} light={light} />
      ))}

      <g data-fx="motes">
        {MOTES.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r={m.r * 3} fill={`url(#${id}${m.gold ? 'moteGold' : 'mote'})`} opacity="0.7" />
        ))}
      </g>
    </HallLayer>
  )
})

// Gothic chandelier with mechanical elements, hung at the top centre of the hall
function Chandelier() {
  return (
    <g transform={`translate(${(HALL_W - 500 * 1.6) / 2} 0) scale(1.6)`} opacity="0.5">
      {/* Central chain with gear link */}
      <path d="M250,0 L250,10" stroke={DARK_FANTASY.brass} strokeWidth="2" />
      <circle cx="250" cy="14" r="4" fill="none" stroke={DARK_FANTASY.copper} strokeWidth="1" />
      <circle cx="250" cy="14" r="2" fill={DARK_FANTASY.brass} />
      {/* Simple ornate arms */}
      <path d="M250,18 Q200,22 150,20 Q100,24 50,22" fill="none" stroke={DARK_FANTASY.brass} strokeWidth="1" opacity="0.6" />
      <path d="M250,18 Q300,22 350,20 Q400,24 450,22" fill="none" stroke={DARK_FANTASY.brass} strokeWidth="1" opacity="0.6" />
      {/* Subtle glow points along the arms */}
      {[100, 175, 250, 325, 400].map((x) => (
        <g key={x}>
          <circle cx={x} cy={22 + Math.abs(x - 250) * 0.01} r="3" fill={DARK_FANTASY.spiritGold} opacity="0.3" />
          <circle cx={x} cy={22 + Math.abs(x - 250) * 0.01} r="6" fill={DARK_FANTASY.spiritGold} opacity="0.1" />
        </g>
      ))}
      {/* Central larger glow */}
      <ellipse cx="250" cy="30" rx="20" ry="12" fill={DARK_FANTASY.spiritGold} opacity="0.15" />
    </g>
  )
}

function SoulLamp({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y - 80} x2={x} y2={y + 70} stroke={DARK_FANTASY.stoneGrey} strokeWidth="3" opacity="0.4" />
      <path d={`M${x - 14},${y} Q${x},${y - 20} ${x + 14},${y} Q${x},${y + 7} ${x - 14},${y} Z`} fill={DARK_FANTASY.voidDeep} stroke={DARK_FANTASY.stoneGrey} strokeWidth="2" opacity="0.6" />
      <circle cx={x} cy={y} r="24" fill={DARK_FANTASY.ethereal} opacity="0.07" />
      <circle cx={x} cy={y} r="7" fill={DARK_FANTASY.etherealDark} opacity="0.5" />
    </g>
  )
}

/** The chandelier and the hanging soul lamps along the wall. */
export const HallLamps = memo(function HallLamps() {
  return (
    <HallLayer>
      <Chandelier />
      <SoulLamp x={300} y={250} />
      <SoulLamp x={620} y={210} />
      <SoulLamp x={1300} y={210} />
      <SoulLamp x={1620} y={250} />
    </HallLayer>
  )
})

function Column({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 52} y={0} width="104" height={HALL_H} fill={DARK_FANTASY.void} opacity="0.82" />
      <rect x={x - 66} y={112} width="132" height="36" rx="6" fill={DARK_FANTASY.void} opacity="0.85" />
      <rect x={x - 66} y={540} width="132" height="26" rx="4" fill={DARK_FANTASY.void} opacity="0.85" />
      {[250, 400].map((y) => (
        <path key={y} d={`M${x - 52},${y} Q${x},${y + 18} ${x + 52},${y}`} fill="none" stroke={DARK_FANTASY.stoneDark} strokeWidth="3" opacity="0.8" />
      ))}
    </g>
  )
}

/** The interior side columns framing the arena. */
export const HallColumns = memo(function HallColumns() {
  return (
    <HallLayer>
      <Column x={48} />
      <Column x={1872} />
    </HallLayer>
  )
})

/** The cornice, the flat floor and the foreground balustrade ledge. */
export const HallFloor = memo(function HallFloor() {
  return (
    <HallLayer>
      {/* CORNICE, wall/floor boundary (contrast) */}
      <rect x="0" y={HORIZON - 5} width={HALL_W} height="9" fill={DARK_FANTASY.stoneGrey} opacity="0.2" />
      <rect x="0" y={HORIZON + 4} width={HALL_W} height="22" fill={DARK_FANTASY.void} opacity="0.4" />
      {/* FLOOR, flat 2D side-view plane + foreground balustrade ledge (no perspective) */}
      <rect x="0" y={HORIZON} width={HALL_W} height={HALL_H - HORIZON} fill={DARK_FANTASY.voidDeep} opacity="0.3" />
      <rect x="0" y="1004" width={HALL_W} height="14" fill={DARK_FANTASY.void} opacity="0.92" />
      <rect x="0" y="1056" width={HALL_W} height="24" fill={DARK_FANTASY.void} opacity="0.96" />
      {Array.from({ length: 28 }, (_, i) => {
        const bx = 34 + i * 69
        return (
          <g key={`bal${i}`} fill={DARK_FANTASY.void} opacity="0.9">
            <rect x={bx - 7} y="1018" width="14" height="40" rx="3" />
            <ellipse cx={bx} cy="1018" rx="13" ry="7" />
            <ellipse cx={bx} cy="1056" rx="13" ry="7" />
          </g>
        )
      })}
    </HallLayer>
  )
})

// Stone/crystal formations along the bottom edge, on their own 1000 by 100 strip stretched over the bottom
// 128 units of the arena, as the cavern's floor in front of the balustrade.
const STONE_SPIKES = Array.from({ length: 20 }, (_, i) => ({
  x: i * 50 + 25 + (scatter(i) - 0.5) * 20,
  height: 25 + scatter(i + 40) * 35,
  width: 8 + scatter(i + 80) * 8,
  lean: (scatter(i + 120) - 0.5) * 10,
  isCrystal: i % 4 === 0,
}))
const MOSS = [100, 350, 650, 850].map((x, i) => ({ x, rx: 30 + scatter(i + 160) * 20 }))
const STRIP_H = 128

/** The stone and crystal spikes and the moss in front of the arena, and the mist rising from the bottom. */
export const HallFront = memo(function HallFront() {
  const id = useId()
  return (
    <HallLayer>
      <defs>
        <linearGradient id={`${id}mist`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={DARK_FANTASY.voidPurple} stopOpacity="0" />
          <stop offset="0.5" stopColor={DARK_FANTASY.voidPurple} stopOpacity="0.3" />
          <stop offset="1" stopColor={DARK_FANTASY.void} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="0" y={HALL_H - 192} width={HALL_W} height="192" fill={`url(#${id}mist)`} />
      <g transform={`translate(0 ${HALL_H - STRIP_H}) scale(${HALL_W / 1000} ${STRIP_H / 100})`} opacity="0.6">
        {/* Base weathered stone */}
        <path d="M0,85 Q200,82 400,88 Q600,80 800,86 Q900,83 1000,85 L1000,100 L0,100 Z" fill={DARK_FANTASY.stoneDark} />
        {/* Crystal/stone spikes - irregular, weathered */}
        {STONE_SPIKES.map(({ x, height, width, lean, isCrystal }, i) => (
          <g key={i}>
            <path
              d={`M${x},85 L${x + lean - width * 0.3},${85 - height * 0.7} L${x + lean},${85 - height} L${x + lean + width * 0.3},${85 - height * 0.7} L${x},85`}
              fill={isCrystal ? DARK_FANTASY.ethereal : DARK_FANTASY.stoneGrey}
              opacity={isCrystal ? 0.4 : 0.8}
            />
            {isCrystal && <path d={`M${x + lean},${85 - height} L${x + lean},${85 - height + 10}`} stroke={DARK_FANTASY.ethereal} strokeWidth="2" opacity="0.6" />}
          </g>
        ))}
        {/* Moss/organic growth patches */}
        {MOSS.map(({ x, rx }) => (
          <ellipse key={x} cx={x} cy={90} rx={rx} ry={8} fill={DARK_FANTASY.mossGreen} opacity="0.3" />
        ))}
      </g>
    </HallLayer>
  )
})
