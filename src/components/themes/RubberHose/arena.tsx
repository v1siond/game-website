import type { ReactNode } from 'react'
import { HOSE } from './palette'

// The fight's one place, painted the way a 1930s cartoon paints its sets: the inside of the big top in
// watercolour washes under one ink line. Back to front: the striped canvas rising to the king pole (sky),
// the stands with their bunting (far), the ring with its sawdust floor and the curb round it (mid), and
// the front of the curb with two footlights (near). Every section fights in it; only the boss and the
// floor change. Drawn on the 1440 by 1080 canvas.

export const VIEW = '0 0 1440 1080'

/** The ring floor his shoes and the boss's wheels stand on. */
export const GROUND = 920

const INK = HOSE.ink

const STRIPES = 14

function Canvas() {
  // the tent's panels fan down from the pole's top, red and paper in turn
  const top: [number, number] = [720, -120]
  return (
    <>
      <rect width={1440} height={1080} fill={HOSE.paperSepia} />
      {Array.from({ length: STRIPES }, (_, i) => {
        const a = -60 + (1560 / STRIPES) * i
        const b = a + 1560 / STRIPES
        return <path key={i} d={`M${top[0]} ${top[1]} L${a} 760 L${b} 760 Z`} fill={i % 2 ? HOSE.paper : HOSE.red} opacity={i % 2 ? 0.9 : 0.55} />
      })}
      <path d="M0 760 Q720 690 1440 760" fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />
      <rect x={708} y={-10} width={24} height={780} fill={HOSE.boards} stroke={INK} strokeWidth={4} />
      <ellipse cx={720} cy={300} rx={560} ry={260} fill={HOSE.highlight} opacity={0.18} />
    </>
  )
}

function Stands() {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <path key={row} d={`M-20 ${640 + row * 46} Q720 ${590 + row * 46} 1460 ${640 + row * 46} V${690 + row * 46} Q720 ${640 + row * 46} -20 ${690 + row * 46} Z`} fill={row % 2 ? HOSE.shadow : HOSE.paperDark} stroke={INK} strokeWidth={3} opacity={0.85} />
      ))}
      {/* the bunting across the top of the stands */}
      <path d="M-20 600 Q360 660 720 610 T1460 600" fill="none" stroke={INK} strokeWidth={3} />
      {Array.from({ length: 18 }, (_, i) => {
        const x = 20 + i * 80
        const y = 600 + 40 * Math.sin((i / 17) * Math.PI) * (i < 9 ? 1 : 0.6)
        return <path key={i} d={`M${x} ${y} l30 0 l-15 34 Z`} fill={i % 3 === 0 ? HOSE.gold : i % 3 === 1 ? HOSE.red : HOSE.blue} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      })}
    </>
  )
}

function Ring() {
  return (
    <>
      <ellipse cx={720} cy={940} rx={900} ry={170} fill={HOSE.footlight} opacity={0.75} />
      <ellipse cx={720} cy={940} rx={900} ry={170} fill="none" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 97) % 1440} cy={880 + ((i * 53) % 140)} r={3} fill={HOSE.shadow} opacity={0.6} />
      ))}
    </>
  )
}

function Curb() {
  return (
    <>
      <path d="M-40 1040 Q720 1110 1480 1040 V1100 H-40 Z" fill={HOSE.red} stroke={INK} strokeWidth={5} />
      <path d="M-40 1050 Q720 1120 1480 1050" fill="none" stroke={HOSE.gold} strokeWidth={6} />
      {[180, 1260].map((x) => (
        <g key={x} transform={`translate(${x} 1046)`}>
          <ellipse cx={0} cy={-10} rx={34} ry={14} fill={HOSE.footlight} stroke={INK} strokeWidth={4} />
          <rect x={-24} y={-10} width={48} height={24} rx={5} fill={HOSE.inkSoft} stroke={INK} strokeWidth={4} />
        </g>
      ))}
    </>
  )
}

const plane = (children: ReactNode): ReactNode => (
  <svg viewBox={VIEW} preserveAspectRatio="xMidYMax slice" focusable="false">
    {children}
  </svg>
)

/** The big top's still layers, back to front, by the stage's layer names. */
export const ARENA_LAYERS: ReadonlyArray<{ name: string; node: ReactNode }> = [
  { name: 'sky', node: plane(<Canvas />) },
  { name: 'far', node: plane(<Stands />) },
  { name: 'mid', node: plane(<Ring />) },
  { name: 'near', node: plane(<Curb />) },
]

/** A plane of the stage on the shared canvas. */
export const arenaPlane = plane
