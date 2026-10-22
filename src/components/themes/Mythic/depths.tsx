import { MYTH } from './palette'
import u from './underworld.module.css'

// The fixed painting behind the page, one era per stretch of the CV: the great hall of crimson marble
// with its braziers (hero, about), the storm sea with the serpent (work history, tech stack), the basalt
// and the magma river (projects, ventures), Rhodes at night under the bronze giant (bands, muay thai) and
// Olympus at dawn (contact). The root's data-zone fades the era in view up (stage.tsx) and only that era
// runs its own clock (the .era parts sit paused otherwise); each era drifts against the pointer (--mx, --my).

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

interface ColumnProps {
  x: number
  top: number
  bottom: number
  width: number
  tone?: string
  light?: string
  // a ruin: the shaft snapped off in a jagged break, no capital
  broken?: boolean
}

// The top of a column: its capital, or the jagged break of a ruin.
function ColumnTop({ x, top, width, tone, broken }: Required<Omit<ColumnProps, 'bottom' | 'light'>>) {
  const half = width / 2
  if (broken) {
    return <path d={`M${x - half} ${top} L${x - half * 0.4} ${top - 14} L${x} ${top - 4} L${x + half * 0.5} ${top - 20} L${x + half} ${top - 6} Z`} fill={tone} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
  }
  return <rect x={x - half - 12} y={top - 18} width={width + 24} height={20} fill={tone} stroke={INK} strokeWidth={3} />
}

// A fluted column with a capital and a base, or its ruin; the light falls on its left edge.
function Column({ x, top, bottom, width, tone = MYTH.column, light = MYTH.columnLight, broken = false }: ColumnProps) {
  const half = width / 2
  return (
    <g>
      <rect x={x - half} y={top} width={width} height={bottom - top} fill={tone} stroke={INK} strokeWidth={3} />
      <rect x={x - half + 4} y={top} width={width * 0.18} height={bottom - top} fill={light} />
      {[0.42, 0.62, 0.82].map((at) => (
        <path key={at} d={`M${x - half + width * at} ${top + 6} L${x - half + width * at} ${bottom - 6}`} stroke={INK} strokeWidth={2} opacity={0.5} />
      ))}
      <ColumnTop x={x} top={top} width={width} tone={tone} broken={broken} />
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

// The storm sea of the first game: rain driving at a slant, lightning every 7 s, the swell rolling under a
// broken mast with its torn sail, the serpent's near head rising out of the sea to lunge with its jaw open
// and sinking again, a second head swaying far off.
function StormArt() {
  const e = u.era
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
      <rect x={0} y={0} width={1200} height={800} fill={MYTH.lightning} className={`${e} ${u.lightning}`} opacity={0} />
      <path d="M820 0 L780 140 L820 150 L760 320" fill="none" stroke={MYTH.lightning} strokeWidth={5} className={`${e} ${u.lightning}`} />
      {/* the far head, swaying */}
      <g className={`${e} ${u.hydraSway}`}>
        <path d="M960 600 Q930 470 990 400 Q1010 380 1040 392 L1020 410 Q980 440 1000 600 Z" fill={MYTH.hydra} stroke={INK} strokeWidth={3} opacity={0.7} />
      </g>
      {/* the near head: neck out of the sea, the skull with its horns and the jaw that opens */}
      <g className={`${e} ${u.hydraRise}`}>
        <path d="M250 800 Q200 560 300 420 Q330 380 380 380 L400 420 Q330 450 320 560 Q320 680 360 800 Z" fill={MYTH.hydra} stroke={INK} strokeWidth={4} />
        <path d="M262 780 Q230 600 300 470" fill="none" stroke={MYTH.hydraBelly} strokeWidth={10} opacity={0.6} />
        <path d="M300 400 Q330 350 400 360 L480 390 L470 410 L380 420 Z" fill={MYTH.hydra} stroke={INK} strokeWidth={4} />
        <path d="M330 366 L300 320 L350 356 M370 360 L360 310 L392 358" fill={MYTH.hydra} stroke={INK} strokeWidth={3} />
        <circle cx={400} cy={378} r={5} fill={MYTH.fireCore} />
        <path d="M380 418 L470 410 L460 430 L390 440 Z" fill={MYTH.hydraBelly} stroke={INK} strokeWidth={3} className={`${e} ${u.hydraJaw}`} />
      </g>
      {/* the broken mast and its torn sail */}
      <path d="M720 700 L736 260 L748 262 L740 700 Z" fill={MYTH.leather} stroke={INK} strokeWidth={3} />
      <path d="M700 300 L840 300" stroke={MYTH.leather} strokeWidth={8} />
      <path d="M742 304 L840 304 L830 420 L800 400 L780 450 L746 430 Z" fill={MYTH.sail} stroke={INK} strokeWidth={3} className={`${e} ${u.sailFlap}`} />
      {/* the swell */}
      <g className={`${e} ${u.swell}`}>
        <path d="M-60 660 Q60 610 180 660 T420 660 T660 660 T900 660 T1140 660 T1380 660 L1380 800 L-60 800 Z" fill={MYTH.sea} stroke={INK} strokeWidth={4} />
        <path d="M-60 664 Q60 620 180 664 T420 664 T660 664 T900 664 T1140 664 T1380 664" fill="none" stroke={MYTH.seaFoam} strokeWidth={3} opacity={0.7} />
      </g>
      {/* the rain, one slanted sheet that loops */}
      <g className={`${e} ${u.rain}`} opacity={0.35}>
        {Array.from({ length: 40 }, (_, i) => (
          <path key={i} d={`M${(i * 37) % 1240} ${((i * 53) % 880) - 80} l-14 44`} stroke={MYTH.seaFoam} strokeWidth={2} />
        ))}
      </g>
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

// Rhodes at night under the bronze giant: the harbour city with its fires, the giant towering over it with
// the laurel crown, its blue eyes flaring, its fist rising and smashing the harbour wall every 8 s with a
// burst of dust, smoke going up from the city.
function RhodesArt() {
  const e = u.era
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
      {[0, 1, 2].map((plume) => (
        <circle key={plume} cx={300 + plume * 280} cy={560} r={50} fill={MYTH.smoke} opacity={0.5} className={`${e} ${u.smoke}`} style={{ animationDelay: `${plume * -4}s` }} />
      ))}
      {/* the giant: legs astride the harbour, the body, the head with the laurel and the eyes */}
      <path d="M540 800 L560 520 L600 520 L610 800 Z M640 800 L650 520 L690 520 L700 800 Z" fill={MYTH.giant} stroke={INK} strokeWidth={4} />
      <path d="M520 540 L540 300 Q620 260 720 300 L740 540 Z" fill={MYTH.giant} stroke={INK} strokeWidth={4} />
      <path d="M560 320 Q620 300 700 320 L690 420 Q620 440 570 420 Z" fill={MYTH.bronzeGiantLight} opacity={0.45} />
      <path d="M590 300 L590 200 Q630 160 670 200 L670 300 Z" fill={MYTH.giant} stroke={INK} strokeWidth={4} />
      {/* the curled beard and the laurel crown */}
      <path d="M592 262 Q596 318 630 326 Q664 318 668 262 Q650 280 630 276 Q610 280 592 262 Z" fill={MYTH.giant} stroke={INK} strokeWidth={3} />
      <path d="M604 290 q6 8 12 0 M624 300 q6 8 12 0 M644 290 q6 8 12 0" fill="none" stroke={INK} strokeWidth={2} />
      <path d="M582 200 Q630 150 678 200" fill="none" stroke={MYTH.gold} strokeWidth={7} />
      <path d="M592 190 l-10 -8 M606 180 l-8 -10 M654 180 l8 -10 M668 190 l10 -8" stroke={MYTH.gold} strokeWidth={4} />
      <g className={`${e} ${u.giantEyes}`}>
        <circle cx={612} cy={236} r={6} fill={MYTH.giantEye} />
        <circle cx={648} cy={236} r={6} fill={MYTH.giantEye} />
      </g>
      {/* the far arm hangs, the near arm rises and smashes down from the shoulder */}
      <path d="M520 320 L470 480 L500 490 L540 340 Z" fill={MYTH.giant} stroke={INK} strokeWidth={4} />
      <g className={`${e} ${u.giantArm}`}>
        <path d="M740 300 L860 460 L840 480 L720 330 Z" fill={MYTH.giant} stroke={INK} strokeWidth={4} />
        <circle cx={860} cy={478} r={26} fill={MYTH.bronzeGiantLight} stroke={INK} strokeWidth={4} />
      </g>
      <ellipse cx={880} cy={640} rx={90} ry={40} fill={MYTH.boneShade} opacity={0} className={`${e} ${u.dust}`} />
      {/* the city and its harbour wall, fires in the windows */}
      <path d="M0 640 L0 560 L60 560 L60 520 L120 520 L120 590 L200 590 L200 540 L260 540 L260 640 Z M940 640 L940 560 L1000 560 L1000 500 L1060 500 L1060 570 L1140 570 L1140 530 L1200 530 L1200 640 Z" fill={MYTH.city} stroke={INK} strokeWidth={3} />
      {[[30, 580], [90, 540], [230, 560], [970, 580], [1030, 520], [1170, 550]].map(([x, y]) => (
        <Flame key={x} x={x} y={y} scale={0.5} />
      ))}
      <path d="M0 640 L1200 640 L1200 680 L0 680 Z" fill={MYTH.city} stroke={INK} strokeWidth={3} />
      <path d="M0 680 L1200 680 L1200 800 L0 800 Z" fill={MYTH.harbourNight} />
      <path d="M0 700 Q300 690 600 700 T1200 700" fill="none" stroke={MYTH.fire} strokeWidth={3} opacity={0.5} />
    </svg>
  )
}

// Olympus at dawn: the mountain over the gold clouds, the temple lit on its top, waterfalls down its cliffs,
// the clouds drifting, the sun's rays turning slowly, birds crossing.
function OlympusArt() {
  const e = u.era
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
      <g className={`${e} ${u.rays}`}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <path key={angle} d="M600 120 L580 -500 L620 -500 Z" fill={MYTH.cloud} opacity={0.12} transform={`rotate(${angle} 600 120)`} />
        ))}
      </g>
      <circle cx={600} cy={120} r={70} fill={MYTH.fireCore} opacity={0.6} />
      <path d="M300 700 L480 300 L560 240 L640 240 L720 300 L900 700 Z" fill={MYTH.olympusRock} stroke={INK} strokeWidth={4} />
      {/* the temple on the top, lit */}
      <path d="M540 240 L600 200 L660 240 Z" fill={MYTH.gold} stroke={INK} strokeWidth={3} />
      {[548, 572, 596, 620, 644].map((x) => (
        <rect key={x} x={x} y={240} width={8} height={30} fill={MYTH.marble} stroke={INK} strokeWidth={1.5} />
      ))}
      {/* the waterfalls down the cliffs */}
      {[470, 720].map((x) => (
        <g key={x}>
          <rect x={x} y={340} width={14} height={300} fill={MYTH.waterfall} opacity={0.7} />
          <path d={`M${x + 4} 340 l0 300`} stroke={MYTH.seaFoam} strokeWidth={3} strokeDasharray="12 28" className={`${e} ${u.fall}`} />
        </g>
      ))}
      <g className={`${e} ${u.clouds}`}>
        <path d="M-100 640 Q0 580 120 620 Q220 560 340 620 Q460 570 560 630 Q680 570 800 630 Q920 570 1040 620 Q1160 570 1300 630 L1300 800 L-100 800 Z" fill={MYTH.cloud} stroke={INK} strokeWidth={3} />
      </g>
      <g className={`${e} ${u.birds}`}>
        {[0, 1, 2].map((bird) => (
          <path key={bird} d={`M${bird * 40} ${180 + bird * 14} q10 -10 20 0 q10 -10 20 0`} fill="none" stroke={INK} strokeWidth={3} />
        ))}
      </g>
    </svg>
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
      <div className={`${u.zone} ${u.zoneStorm}`}>
        <StormArt />
      </div>
      <div className={`${u.zone} ${u.zoneMagma}`}>
        <MagmaArt />
      </div>
      <div className={`${u.zone} ${u.zoneRhodes}`}>
        <RhodesArt />
      </div>
      <div className={`${u.zone} ${u.zoneOlympus}`}>
        <OlympusArt />
      </div>
      {EMBERS.map(({ left, drift }, index) => (
        <span key={left} className={u.ember} style={{ ['--left' as string]: left, ['--i' as string]: index, ['--drift' as string]: drift }} />
      ))}
      {/* a dark veil over the painting so the page's text keeps its contrast in every region */}
      <div className="absolute inset-0 bg-[var(--myth-ink)] opacity-40" />
    </div>
  )
}
