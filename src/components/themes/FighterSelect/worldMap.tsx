import { FS } from './palette'

// The select screen's world map: flat orange continents ruled in a pale coast line on the deep blue sea,
// and player one's pin standing on his home town, Lima. Still art behind the portrait grid.

const CONTINENTS = [
  'M40 30 L95 22 L122 38 L106 62 L86 70 L74 90 L60 80 L46 58 Z',
  'M90 96 L114 100 L120 120 L106 150 L95 146 L90 120 Z',
  'M178 30 L214 22 L226 38 L206 52 L188 50 Z',
  'M184 62 L226 60 L242 80 L226 120 L211 132 L198 102 L182 84 Z',
  'M230 22 L322 16 L362 34 L352 56 L322 70 L300 66 L282 82 L262 70 L242 56 L228 42 Z',
  'M322 110 L356 106 L366 124 L342 134 L324 126 Z',
  'M370 44 L376 40 L380 54 L372 62 Z',
]

// Lima on the map's west coast of the southern land.
const HOME = { x: 96, y: 118 }

export function WorldMap() {
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width={400} height={160} fill={FS.select} />
      {[40, 80, 120].map((y) => (
        <line key={y} x1={0} y1={y} x2={400} y2={y} stroke={FS.selectDeep} strokeWidth={1} opacity={0.6} />
      ))}
      {CONTINENTS.map((d) => (
        <path key={d} d={d} fill={FS.land} stroke={FS.coast} strokeWidth={2} strokeLinejoin="round" />
      ))}
      <line x1={HOME.x} y1={HOME.y} x2={HOME.x} y2={HOME.y - 22} stroke={FS.flash} strokeWidth={2} />
      <path d={`M${HOME.x} ${HOME.y - 22} h16 v10 h-16 Z`} fill={FS.p1} stroke={FS.ink} strokeWidth={1.2} />
      <circle cx={HOME.x} cy={HOME.y} r={4} fill={FS.p2} stroke={FS.flash} strokeWidth={1.5} />
    </svg>
  )
}
