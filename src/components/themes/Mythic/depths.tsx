import { MYTH } from './palette'
import u from './underworld.module.css'

// The fixed painting behind the page, one layer per region the page goes down: the great hall of
// crimson marble with its braziers and the pool's glow, the teal brick vaults with their soul lamps, the
// basalt and the magma river, the gold light over the green fields with their ruined columns, and the
// red temple under the surface's dawn. The root's data-zone fades the region in view up (stage.tsx);
// each region's far and near art drifts against the pointer at two depths (--mx, --my).

const INK = MYTH.inkLine

function Flame({ x, y, scale = 1, color = MYTH.fire, core = MYTH.fireCore }: { x: number; y: number; scale?: number; color?: string; core?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={u.flame}>
        <path d="M0 0 Q-18 -20 -6 -46 Q-2 -30 6 -38 Q4 -58 14 -70 Q24 -40 16 -20 Q22 -26 20 -10 Q16 0 0 0 Z" fill={color} />
        <path d="M2 -2 Q-8 -14 0 -30 Q4 -20 8 -26 Q14 -12 2 -2 Z" fill={core} />
      </g>
    </g>
  )
}

function Brazier({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 10} ${y + 120} L${x - 4} ${y + 10} L${x + 4} ${y + 10} L${x + 10} ${y + 120} Z`} fill={MYTH.bronze} stroke={INK} strokeWidth={3} />
      <path d={`M${x - 34} ${y} L${x + 34} ${y} L${x + 22} ${y + 18} L${x - 22} ${y + 18} Z`} fill={MYTH.goldDeep} stroke={INK} strokeWidth={3} />
      <Flame x={x - 4} y={y + 2} scale={1.1} />
    </g>
  )
}

// A fluted column with a capital and a base; the light falls on its left edge.
function Column({ x, top, bottom, width, tone = MYTH.column, light = MYTH.columnLight }: { x: number; top: number; bottom: number; width: number; tone?: string; light?: string }) {
  const half = width / 2
  return (
    <g>
      <rect x={x - half} y={top} width={width} height={bottom - top} fill={tone} stroke={INK} strokeWidth={3} />
      <rect x={x - half + 4} y={top} width={width * 0.18} height={bottom - top} fill={light} />
      {[0.42, 0.62, 0.82].map((at) => (
        <path key={at} d={`M${x - half + width * at} ${top + 6} L${x - half + width * at} ${bottom - 6}`} stroke={INK} strokeWidth={2} opacity={0.5} />
      ))}
      <rect x={x - half - 12} y={top - 18} width={width + 24} height={20} fill={tone} stroke={INK} strokeWidth={3} />
      <rect x={x - half - 16} y={bottom} width={width + 32} height={18} fill={tone} stroke={INK} strokeWidth={3} />
    </g>
  )
}

function HallArt() {
  return (
    <>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
        {[180, 380, 820, 1020].map((x) => (
          <Column key={x} x={x} top={140} bottom={640} width={56} tone={MYTH.crimson} light={MYTH.columnLight} />
        ))}
        <path d="M0 120 L1200 120 L1200 150 L0 150 Z" fill={MYTH.crimson} stroke={INK} strokeWidth={3} />
        <path d="M0 640 L1200 640 L1200 800 L0 800 Z" fill={MYTH.column} />
        <ellipse cx={600} cy={720} rx={320} ry={46} fill={MYTH.pool} stroke={INK} strokeWidth={4} />
        <ellipse cx={600} cy={712} rx={250} ry={22} fill={MYTH.poolLight} opacity={0.35} />
      </svg>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.near}`}>
        <Column x={40} top={40} bottom={780} width={110} />
        <Column x={1160} top={40} bottom={780} width={110} />
        <Brazier x={250} y={560} />
        <Brazier x={950} y={560} />
      </svg>
    </>
  )
}

function DepthsArt() {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
      {[0, 400, 800].map((x) => (
        <g key={x}>
          <path d={`M${x} 800 L${x} 260 Q${x + 200} 60 ${x + 400} 260 L${x + 400} 800 L${x + 340} 800 L${x + 340} 290 Q${x + 200} 150 ${x + 60} 290 L${x + 60} 800 Z`} fill={MYTH.brick} stroke={INK} strokeWidth={4} />
          {[340, 420, 500, 580, 660, 740].map((y) => (
            <path key={y} d={`M${x + 4} ${y} L${x + 56} ${y} M${x + 344} ${y} L${x + 396} ${y}`} stroke={INK} strokeWidth={2} opacity={0.55} />
          ))}
        </g>
      ))}
      <path d="M0 700 L1200 700 L1200 800 L0 800 Z" fill={MYTH.tartLow} stroke={INK} strokeWidth={3} />
      {[200, 1000].map((x) => (
        <g key={x}>
          <path d={`M${x - 6} 700 L${x - 6} 520 L${x + 6} 520 L${x + 6} 700 Z`} fill={MYTH.steelShade} stroke={INK} strokeWidth={3} />
          <Flame x={x - 2} y={522} scale={0.9} color={MYTH.soul} core={MYTH.common} />
        </g>
      ))}
    </svg>
  )
}

function MagmaArt() {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
      <path d="M0 520 L140 300 L260 470 L420 220 L560 480 L700 280 L860 500 L1000 240 L1200 460 L1200 800 L0 800 Z" fill={MYTH.basalt} stroke={INK} strokeWidth={4} />
      <path d="M420 220 L460 300 L430 330 L470 420 M1000 240 L1030 320 L1010 360" fill="none" stroke={MYTH.magma} strokeWidth={5} />
      <path d="M0 690 Q300 650 600 690 T1200 680 L1200 740 Q900 710 600 740 T0 740 Z" fill={MYTH.magma} stroke={INK} strokeWidth={3} />
      <path d="M0 704 Q300 676 600 706 T1200 696" fill="none" stroke={MYTH.fireCore} strokeWidth={4} opacity={0.8} />
      <path d="M0 740 L1200 740 L1200 800 L0 800 Z" fill={MYTH.aspHigh} />
    </svg>
  )
}

function FieldsArt() {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
      {[-30, -12, 6, 24].map((angle) => (
        <path key={angle} d="M600 -40 L560 800 L640 800 Z" fill={MYTH.elyLight} opacity={0.12} transform={`rotate(${angle} 600 -40)`} />
      ))}
      <path d="M0 560 Q300 470 620 560 T1200 520 L1200 800 L0 800 Z" fill={MYTH.elyLow} stroke={INK} strokeWidth={4} />
      <path d="M0 650 Q400 580 800 650 T1200 640 L1200 800 L0 800 Z" fill={MYTH.elyGreen} opacity={0.55} stroke={INK} strokeWidth={3} />
      <Column x={180} top={420} bottom={600} width={40} tone={MYTH.marbleShade} light={MYTH.marble} />
      <Column x={1040} top={470} bottom={590} width={40} tone={MYTH.marbleShade} light={MYTH.marble} />
      <path d="M1000 470 L1080 452 L1084 468 L1004 486 Z" fill={MYTH.marbleShade} stroke={INK} strokeWidth={3} />
    </svg>
  )
}

function TempleArt() {
  return (
    <>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
        <circle cx={600} cy={130} r={110} fill={MYTH.dawn} opacity={0.35} />
        <path d="M300 300 L600 160 L900 300 Z" fill={MYTH.kiltShade} stroke={INK} strokeWidth={4} />
        <path d="M300 300 L900 300 L900 330 L300 330 Z" fill={MYTH.terracottaDeep} stroke={INK} strokeWidth={3} />
        {[350, 450, 750, 850].map((x) => (
          <Column key={x} x={x} top={340} bottom={620} width={48} tone={MYTH.terracottaDeep} light={MYTH.crimson} />
        ))}
        {[0, 1, 2, 3].map((step) => (
          <path key={step} d={`M${240 - step * 60} ${640 + step * 40} L${960 + step * 60} ${640 + step * 40} L${960 + step * 60} ${680 + step * 40} L${240 - step * 60} ${680 + step * 40} Z`} fill={MYTH.styxLow} stroke={INK} strokeWidth={3} />
        ))}
      </svg>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.near}`}>
        <Brazier x={170} y={560} />
        <Brazier x={1030} y={560} />
      </svg>
    </>
  )
}

// The embers' start across the width and the way each one drifts as it rises.
const EMBERS = [
  { left: '7%', drift: 30 },
  { left: '21%', drift: -20 },
  { left: '35%', drift: 40 },
  { left: '50%', drift: -30 },
  { left: '64%', drift: 18 },
  { left: '78%', drift: -26 },
  { left: '92%', drift: 22 },
]

export function Depths() {
  return (
    <div className={u.depths} aria-hidden="true">
      <div className={`${u.zone} ${u.zoneHall}`}>
        <HallArt />
      </div>
      <div className={`${u.zone} ${u.zoneDepths}`}>
        <DepthsArt />
      </div>
      <div className={`${u.zone} ${u.zoneMagma}`}>
        <MagmaArt />
      </div>
      <div className={`${u.zone} ${u.zoneFields}`}>
        <FieldsArt />
      </div>
      <div className={`${u.zone} ${u.zoneTemple}`}>
        <TempleArt />
      </div>
      {EMBERS.map(({ left, drift }, index) => (
        <span key={left} className={u.ember} style={{ ['--left' as string]: left, ['--i' as string]: index, ['--drift' as string]: drift }} />
      ))}
      {/* a dark veil over the painting so the page's text keeps its contrast in every region */}
      <div className="absolute inset-0 bg-[var(--myth-ink)] opacity-40" />
    </div>
  )
}
