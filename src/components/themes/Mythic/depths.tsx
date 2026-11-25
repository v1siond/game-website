import type { ReactNode, Ref } from 'react'
import { cssVars } from '@/lib/cssVars'
import type { Zone } from './stage'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The fixed painting behind the page, one place of the run per stretch of the CV, in the games' order and in
// the colour the footage gives each (research/2026-11-25-footage-gow12/notes.md, Look): the storm green sea
// with the serpent's lesser heads far off (hero), Athens burning at night (about), the ochre sandstorm of the
// desert (work), the warm stone and torchlight of the architect's temple (tech stack), the grey storm over the
// temple of the last duel (services), Rhodes at night under cyan lightning (projects), the bright sky over the
// white island (ventures), the green bog (bands), the black chasm (muay thai) and the mountain of the gods in
// gold (contact). Fog and rock close the frame's sides. The root's data-zone fades the place in view up
// (stage.tsx). Each place's weather is played by the first scene in its region on the shared scene player
// (scenes.tsx writes --era-t on its data-era layer): the rain, the embers over Athens, the blowing sand, the
// torch flames, the lightning, the clouds, the bog's mist, the falling grit and the mountain's light, back on
// the way up and again every pass. Each place drifts against the pointer (--mx, --my), written on the painting's
// own box (the theme's pointer ref), so a pointer move restyles the painting alone.

const INK = MYTH.inkLine

/** The far art and its weather, both slid against the pointer. */
function Place({ children, weather }: { children: ReactNode; weather?: ReactNode }) {
  return (
    <>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.far}`}>
        {children}
      </svg>
      {weather && (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" className={`absolute inset-0 h-full w-full ${u.near}`}>
          {weather}
        </svg>
      )}
    </>
  )
}

// Drops, motes and embers across the width: where each starts and how far it drifts.
const MOTES = Array.from({ length: 30 }, (_, i) => ({ x: (i * 173) % 1200, y: (i * 97) % 300, drift: (i % 5) * 12 - 24 }))

/** A fall or a rise of motes over a place, each out of step (--i): rain, sand, grit, embers. */
const Motes = ({ className, size = 3, fill, slant = 0 }: { className: string; size?: number; fill: string; slant?: number }) => (
  <>
    {MOTES.map(({ x, y, drift }, i) => (
      <path key={i} d={`M${x} ${y - 320} l${slant} ${size * 6}`} stroke={fill} strokeWidth={size} strokeLinecap="round" opacity={0.8} className={`${u.era} ${className}`} style={cssVars({ '--i': i % 7, '--drift': drift })} />
    ))}
  </>
)

/** Bands of fog, sand or cloud drifting across. */
const Drift = ({ ys, fill, opacity, className }: { ys: readonly number[]; fill: string; opacity: number; className: string }) => (
  <>
    {ys.map((y, i) => (
      <ellipse key={y} cx={300 + i * 320} cy={y} rx={420} ry={40 + i * 6} fill={fill} opacity={opacity} className={`${u.era} ${className}`} style={cssVars({ '--i': i })} />
    ))}
  </>
)

/** A column of the temples, its light on the left edge. */
function Column({ x, top, bottom, width, fill, light }: { x: number; top: number; bottom: number; width: number; fill: string; light: string }) {
  const half = width / 2
  return (
    <g>
      <rect x={x - half} y={top} width={width} height={bottom - top} fill={fill} stroke={INK} strokeWidth={3} />
      <rect x={x - half + 4} y={top} width={width * 0.18} height={bottom - top} fill={light} />
      <rect x={x - half - 12} y={top - 18} width={width + 24} height={20} fill={fill} stroke={INK} strokeWidth={3} />
    </g>
  )
}

// The storm sea: the swell under the sky, two lesser heads of the serpent swaying far off, a wrecked ship.
function SeaArt() {
  return (
    <Place weather={<Motes className={u.rain} fill={MYTH.seaFoam} slant={-14} size={2} />}>
      {[[240, 0.55], [1000, 0.45]].map(([x, o]) => (
        <path key={x} d={`M${x} 620 Q${x - 40} 470 ${x + 20} 400 Q${x + 40} 380 ${x + 70} 392 L${x + 50} 410 Q${x + 10} 440 ${x + 30} 620 Z`} fill={MYTH.serpentShade} stroke={INK} strokeWidth={3} opacity={o} />
      ))}
      <path d="M700 600 L716 360 L728 362 L720 600 Z M660 600 L840 600 L820 630 L680 630 Z" fill={MYTH.deckShade} stroke={INK} strokeWidth={3} opacity={0.6} />
      <path d="M-60 600 Q60 560 180 600 T420 600 T660 600 T900 600 T1140 600 T1380 600 L1380 800 L-60 800 Z" fill={MYTH.sea} stroke={INK} strokeWidth={4} />
      <path d="M-60 604 Q60 566 180 604 T420 604 T660 604 T900 604 T1140 604 T1380 604" fill="none" stroke={MYTH.seaFoam} strokeWidth={3} opacity={0.6} />
    </Place>
  )
}

// Athens at night: the city's roofs and temple fronts black against the fires, smoke going up.
function AthensArt() {
  return (
    <Place weather={<Motes className={u.embers} fill={MYTH.fire} size={4} />}>
      {[200, 520, 860].map((x) => (
        <ellipse key={x} cx={x} cy={420} rx={160} ry={260} fill={MYTH.inkSoft} opacity={0.35} />
      ))}
      <path d="M0 560 L0 470 L80 470 L80 420 L160 420 L160 500 L260 500 L260 440 L300 400 L340 440 L340 520 L460 520 L460 460 L560 460 L560 540 L700 540 L700 430 L760 380 L820 430 L820 520 L960 520 L960 450 L1060 450 L1060 500 L1200 500 L1200 800 L0 800 Z" fill={MYTH.city} stroke={INK} strokeWidth={3} />
      {[[40, 500], [210, 520], [400, 548], [640, 560], [900, 548], [1120, 528]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} q-16 -30 0 -60 q4 20 14 10 q10 26 -14 50 Z`} fill={MYTH.fire} stroke={INK} strokeWidth={2} />
      ))}
    </Place>
  )
}

// The desert of lost souls: dunes under the ochre haze, a broken column half buried.
function DesertArt() {
  return (
    <Place weather={<Drift ys={[460, 540, 620]} fill={MYTH.sandLow} opacity={0.45} className={u.blow} />}>
      <path d="M0 520 Q300 470 600 510 T1200 490 V800 H0 Z" fill={MYTH.sandHigh} opacity={0.7} />
      <path d="M840 520 L860 380 L900 380 L912 520 Z" fill={MYTH.sand} stroke={INK} strokeWidth={3} opacity={0.7} />
      <path d="M0 620 Q400 580 800 620 T1200 610 V800 H0 Z" fill={MYTH.sand} />
    </Place>
  )
}

// The architect's temple: tall columns in torchlight, the vault dark above.
function TempleArt() {
  return (
    <Place weather={<Motes className={u.embers} fill={MYTH.fireCore} size={3} />}>
      {[120, 330, 870, 1080].map((x) => (
        <Column key={x} x={x} top={120} bottom={640} width={70} fill={MYTH.templeShade} light={MYTH.templeStone} />
      ))}
      <path d="M0 100 H1200 V130 H0 Z" fill={MYTH.templeShade} stroke={INK} strokeWidth={3} />
      <rect y={640} width={1200} height={160} fill={MYTH.templeShade} />
    </Place>
  )
}

// The grey storm over the temple of the last duel: the temple front on its cliff, the sea below.
function StormArt() {
  return (
    <Place weather={<rect width={1200} height={800} fill={MYTH.lightning} opacity={0} className={`${u.era} ${u.flash}`} />}>
      <path d="M0 560 L200 520 L260 400 L700 400 L740 520 L1200 560 V800 H0 Z" fill={MYTH.titanShade} stroke={INK} strokeWidth={3} opacity={0.8} />
      <path d="M300 400 L480 330 L660 400 Z" fill={MYTH.stormLow} stroke={INK} strokeWidth={3} />
      {[320, 380, 440, 500, 560, 620].map((x) => (
        <rect key={x} x={x} y={400} width={18} height={110} fill={MYTH.stormLow} stroke={INK} strokeWidth={2} />
      ))}
      <path d="M0 660 Q300 630 600 660 T1200 650 V800 H0 Z" fill={MYTH.sea} />
    </Place>
  )
}

// Rhodes at night: the harbour wall and its towers, the sea, the cyan lightning.
function RhodesArt() {
  return (
    <Place weather={<path d="M900 0 L860 140 L900 150 L840 320" fill="none" stroke={MYTH.lightning} strokeWidth={6} className={`${u.era} ${u.flash}`} />}>
      <path d="M0 640 L0 540 L80 540 L80 480 L160 480 L160 560 L300 560 L300 600 L900 600 L900 520 L980 520 L980 470 L1060 470 L1060 560 L1200 560 L1200 640 Z" fill={MYTH.city} stroke={INK} strokeWidth={3} />
      {[[40, 560], [120, 500], [1020, 490]].map(([x, y]) => (
        <rect key={x} x={x} y={y} width={14} height={18} fill={MYTH.fireCore} />
      ))}
      <path d="M0 640 H1200 V800 H0 Z" fill={MYTH.rhodesHigh} />
      <path d="M0 670 Q300 660 600 670 T1200 670" fill="none" stroke={MYTH.lightning} strokeWidth={3} opacity={0.4} />
    </Place>
  )
}

// The bright sky over the island of creation: clouds, the sea far below, the island's white domes.
function SkyArt() {
  return (
    <Place weather={<Drift ys={[200, 300, 420]} fill={MYTH.cloud} opacity={0.7} className={u.clouds} />}>
      <path d="M0 640 H1200 V800 H0 Z" fill={MYTH.skyHigh} opacity={0.6} />
      {[[300, 600, 60], [420, 610, 44], [880, 600, 52]].map(([x, y, r]) => (
        <path key={x} d={`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`} fill={MYTH.whiteMarble} stroke={INK} strokeWidth={3} />
      ))}
    </Place>
  )
}

// The bog of the forgotten: dead trees in the green murk, still water.
function BogArt() {
  return (
    <Place weather={<Drift ys={[540, 600, 660]} fill={MYTH.mist} opacity={0.35} className={u.blow} />}>
      {[80, 260, 940, 1120].map((x, i) => (
        <path key={x} d={`M${x} 640 L${x + 10} ${300 + i * 20} M${x + 8} ${420 + i * 10} L${x - 50} ${360 + i * 10} M${x + 10} ${360 + i * 20} L${x + 60} ${300 + i * 20}`} stroke={MYTH.rotShade} strokeWidth={14} strokeLinecap="round" />
      ))}
      <rect y={640} width={1200} height={160} fill={MYTH.bogWater} />
    </Place>
  )
}

// The great chasm: black walls of rock either side, a far light above.
function ChasmArt() {
  return (
    <Place weather={<Motes className={u.grit} fill={MYTH.chasmLow} size={4} />}>
      <ellipse cx={600} cy={-40} rx={260} ry={120} fill={MYTH.goldPale} opacity={0.25} />
      <path d="M0 0 L260 0 L200 200 L280 420 L180 800 L0 800 Z M1200 0 L940 0 L1010 260 L920 500 L1020 800 L1200 800 Z" fill={MYTH.rock} stroke={INK} strokeWidth={3} />
    </Place>
  )
}

// The mountain of the gods in gold: rays from the summit, the clouds below.
function OlympusArt() {
  return (
    <Place weather={<Drift ys={[600, 660]} fill={MYTH.cloud} opacity={0.8} className={u.clouds} />}>
      <g className={`${u.era} ${u.rays}`}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <path key={angle} d="M600 120 L580 -500 L620 -500 Z" fill={MYTH.cloud} opacity={0.16} transform={`rotate(${angle} 600 120)`} />
        ))}
      </g>
      <circle cx={600} cy={120} r={80} fill={MYTH.fireCore} opacity={0.5} />
      <path d="M0 640 Q300 600 600 640 T1200 620 V800 H0 Z" fill={MYTH.cloud} />
    </Place>
  )
}

const PLACES: ReadonlyArray<readonly [Zone, string, () => ReactNode]> = [
  ['sea', u.zoneSea, SeaArt],
  ['athens', u.zoneAthens, AthensArt],
  ['desert', u.zoneDesert, DesertArt],
  ['temple', u.zoneTemple, TempleArt],
  ['storm', u.zoneStorm, StormArt],
  ['rhodes', u.zoneRhodes, RhodesArt],
  ['sky', u.zoneSky, SkyArt],
  ['bog', u.zoneBog, BogArt],
  ['chasm', u.zoneChasm, ChasmArt],
  ['olympus', u.zoneOlympus, OlympusArt],
]

export function Depths({ pointerRef }: { pointerRef: Ref<HTMLDivElement> }) {
  return (
    <div ref={pointerRef} className={u.depths} aria-hidden="true">
      {PLACES.map(([zone, look, Art]) => (
        <div key={zone} className={`${u.zone} ${look}`} data-era={zone}>
          <Art />
        </div>
      ))}
      {/* a dark veil over the painting so the page's text keeps its contrast in every region */}
      <div className="absolute inset-0 bg-[var(--myth-ink)] opacity-40" />
    </div>
  )
}
