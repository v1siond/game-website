import type { Ref } from 'react'
import { cssVars } from '@/lib/cssVars'
import { MYTH } from './palette'
import u from './underworld.module.css'

// The fixed painting behind the page, one place of the journey per stretch of the CV, in the order they walk
// it, all of our own northern myth: the snow wood round the cabin (hero, about), the old road through the
// ruins (work), the mirror lake with its island temple (tech stack, services), the ring of light (projects),
// the iron mountain under black smoke (ventures), the grey sea of the dead (bands), the frozen shore under a
// low sun (muay thai) and the stair to the peak above the clouds (contact). The root's data-zone fades the place
// in view up (stage.tsx). Each place's weather is played by the first scene in its region on the shared scene
// player (scenes.tsx writes --era-t on its data-era layer): the snow falling on the wood, the leaves along the
// road, the mist over the lake, the light breathing in the ring, the smoke rolling off the mountain, the fog on
// the dead sea, the drift along the shore and the wind at the peak, back on the way up and again every pass.
// Each place drifts against the pointer (--mx, --my), written on the painting's own box (the theme's pointer ref),
// so a pointer move restyles the painting alone.

const INK = MYTH.inkLine

/** A pine, its foot at (x, y), `h` tall. */
function Pine({ x, y, h, fill = MYTH.pine, snow = true }: { x: number; y: number; h: number; fill?: string; snow?: boolean }) {
  const w = h * 0.36
  return (
    <g>
      <path d={`M${x} ${y - h} L${x + w} ${y - h * 0.1} H${x - w} Z`} fill={fill} stroke={INK} strokeWidth={2} />
      {snow && <path d={`M${x} ${y - h} L${x + w * 0.4} ${y - h * 0.62} Q${x} ${y - h * 0.68} ${x - w * 0.4} ${y - h * 0.62} Z`} fill={MYTH.snow} />}
      <rect x={x - 5} y={y - h * 0.1} width={10} height={h * 0.1} fill={MYTH.woodShade} />
    </g>
  )
}

/** The far art and its weather, both slid against the pointer. */
function Place({ children, weather }: { children: React.ReactNode; weather?: React.ReactNode }) {
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

// Flakes and drops across the width: where each starts and how far it drifts.
const FALL = Array.from({ length: 28 }, (_, i) => ({ x: (i * 173) % 1200, y: (i * 97) % 300, drift: (i % 5) * 12 - 24 }))

/** Snow falling over a place, each flake out of step (--i). */
const Snow = ({ size = 4, fill = MYTH.snow }: { size?: number; fill?: string }) => (
  <>
    {FALL.map(({ x, y, drift }, i) => (
      <circle key={i} cx={x} cy={y - 320} r={size * (0.6 + (i % 3) * 0.3)} fill={fill} opacity={0.85} className={`${u.era} ${u.snow}`} style={cssVars({ '--i': i % 7, '--drift': drift })} />
    ))}
  </>
)

/** Bands of mist, fog or smoke drifting across. */
const Drift = ({ ys, fill, opacity, className }: { ys: readonly number[]; fill: string; opacity: number; className: string }) => (
  <>
    {ys.map((y, i) => (
      <ellipse key={y} cx={300 + i * 320} cy={y} rx={420} ry={40 + i * 6} fill={fill} opacity={opacity} className={`${u.era} ${className}`} style={cssVars({ '--i': i })} />
    ))}
  </>
)

// The snow wood: the far pines, the cabin with its lit window and the smoke from its chimney, the river below.
function WoodArt() {
  return (
    <Place weather={<Snow />}>
      <path d="M0 420 Q300 360 600 400 T1200 380 V800 H0 Z" fill={MYTH.snowShade} />
      {[60, 180, 300, 860, 980, 1100].map((x, i) => (
        <Pine key={x} x={x} y={430 + (i % 2) * 20} h={220 + (i % 3) * 40} fill={MYTH.pineLight} />
      ))}
      <path d="M0 560 Q400 520 800 560 T1200 550 V800 H0 Z" fill={MYTH.snow} />
      <path d="M0 700 Q300 670 640 700 T1200 690" fill="none" stroke={MYTH.lakeWater} strokeWidth={26} />
      <g>
        <path d="M480 470 L560 410 L640 470 Z" fill={MYTH.snow} stroke={INK} strokeWidth={3} />
        <rect x={490} y={470} width={140} height={90} fill={MYTH.wood} stroke={INK} strokeWidth={3} />
        <rect x={510} y={495} width={30} height={26} fill={MYTH.fireCore} stroke={INK} strokeWidth={2} />
        <rect x={580} y={500} width={30} height={60} fill={MYTH.woodShade} stroke={INK} strokeWidth={2} />
        <rect x={600} y={420} width={16} height={34} fill={MYTH.woodShade} stroke={INK} strokeWidth={2} />
        <path d="M608 410 Q590 360 620 320 Q600 280 630 240" fill="none" stroke={MYTH.ash} strokeWidth={10} opacity={0.5} />
      </g>
    </Place>
  )
}

// The old road through the ruins in the wood: a broken arch, stones of a fallen wall, the road running on.
function RoadArt() {
  return (
    <Place weather={<Snow size={3} fill={MYTH.furLight} />}>
      {[100, 260, 940, 1100].map((x, i) => (
        <Pine key={x} x={x} y={520} h={300 + (i % 2) * 60} snow={false} />
      ))}
      <path d="M0 520 H1200 V800 H0 Z" fill={MYTH.woodLow} />
      <path d="M420 800 L560 520 H640 L780 800 Z" fill={MYTH.stoneShade} opacity={0.6} />
      <g fill={MYTH.stoneShade} stroke={INK} strokeWidth={3}>
        <path d="M380 520 V300 Q380 220 460 220 V260 Q420 260 420 320 V520 Z" />
        <rect x={700} y={420} width={60} height={100} />
        <rect x={760} y={460} width={50} height={60} />
      </g>
    </Place>
  )
}

// The mirror lake: the far shore under mist, the island with its temple of grey stone, the still water.
function LakeArt() {
  return (
    <Place weather={<Drift ys={[460, 520, 600]} fill={MYTH.snow} opacity={0.35} className={u.mist} />}>
      <path d="M0 360 L180 240 L340 330 L520 200 L700 320 L900 230 L1200 340 V460 H0 Z" fill={MYTH.lakeHigh} opacity={0.7} />
      <rect y={460} width={1200} height={340} fill={MYTH.lakeWater} />
      <path d="M0 500 H1200 M0 560 H1200 M0 640 H1200" stroke={MYTH.lakeLow} strokeWidth={2} opacity={0.5} />
      <path d="M760 470 Q860 430 960 470 Z" fill={MYTH.pine} stroke={INK} strokeWidth={2} />
      <path d="M820 440 L860 380 L900 440 Z" fill={MYTH.stoneShade} stroke={INK} strokeWidth={2} />
    </Place>
  )
}

// The ring of light: a white stone temple on its island, a ring of standing walls round a column of light.
function LightArt() {
  return (
    <Place weather={<circle cx={600} cy={360} r={260} fill={MYTH.lightHigh} className={`${u.era} ${u.breathe}`} />}>
      <rect width={1200} height={800} fill={MYTH.lightLow} opacity={0.3} />
      <rect x={540} y={0} width={120} height={600} fill={MYTH.lightHigh} opacity={0.6} />
      {[200, 340, 860, 1000].map((x) => (
        <rect key={x} x={x - 40} y={360} width={80} height={240} fill={MYTH.stone} stroke={INK} strokeWidth={3} />
      ))}
      <path d="M0 600 Q600 560 1200 600 V800 H0 Z" fill={MYTH.stoneShade} />
    </Place>
  )
}

// The iron mountain: its black flank and the shaft's head frame, black smoke rolling off the top.
function MountainArt() {
  return (
    <Place weather={<Drift ys={[120, 180, 240]} fill={MYTH.ink} opacity={0.55} className={u.smokeRoll} />}>
      <path d="M0 800 L380 220 L520 300 L640 140 L860 360 L1200 300 V800 Z" fill={MYTH.mountainLow} stroke={INK} strokeWidth={3} />
      <path d="M560 800 V420 H680 V800" fill={MYTH.ironDeep} stroke={INK} strokeWidth={3} />
      <path d="M560 420 L620 360 L680 420" fill="none" stroke={MYTH.iron} strokeWidth={8} />
      <path d="M600 420 V800 M640 420 V800" stroke={MYTH.iron} strokeWidth={3} />
    </Place>
  )
}

// The grey sea of the dead: the fog on black water, the far shapes of the dead standing in it.
function DeadArt() {
  return (
    <Place weather={<Drift ys={[420, 500, 580]} fill={MYTH.deadLow} opacity={0.5} className={u.fog} />}>
      <rect y={440} width={1200} height={360} fill={MYTH.deadHigh} />
      {[160, 240, 330, 900, 980, 1060].map((x, i) => (
        <path key={x} d={`M${x} 470 q8 -40 16 0 v30 h-16 Z`} fill={MYTH.deadLow} opacity={0.5 + (i % 2) * 0.2} />
      ))}
      <path d="M0 520 H1200 M0 600 H1200" stroke={MYTH.deadLow} strokeWidth={2} opacity={0.4} />
    </Place>
  )
}

// The frozen shore under a low sun: ice plates on the water, the white beach, the far cliffs.
function ShoreArt() {
  return (
    <Place weather={<Drift ys={[640, 700]} fill={MYTH.snow} opacity={0.4} className={u.mist} />}>
      <circle cx={900} cy={420} r={90} fill={MYTH.fireCore} opacity={0.8} />
      <path d="M0 380 L140 300 L260 360 L320 300 V460 H0 Z" fill={MYTH.lakeHigh} />
      <rect y={460} width={1200} height={120} fill={MYTH.lakeWater} />
      {[100, 360, 620, 880].map((x) => (
        <path key={x} d={`M${x} 500 l90 -8 l40 20 l-110 6 Z`} fill={MYTH.snow} opacity={0.8} />
      ))}
      <path d="M0 580 Q600 560 1200 590 V800 H0 Z" fill={MYTH.shoreLow} />
    </Place>
  )
}

// The stair to the peak: steps cut in the rock climbing past a long painted wall, clouds below the top.
function PeakArt() {
  return (
    <Place weather={<Drift ys={[300, 360]} fill={MYTH.snow} opacity={0.35} className={u.wind} />}>
      <path d="M0 800 L500 160 L640 120 L1200 700 V800 Z" fill={MYTH.stoneShade} stroke={INK} strokeWidth={3} />
      <path d="M0 640 Q300 600 600 640 T1200 620 V800 H0 Z" fill={MYTH.cloud} opacity={0.9} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${360 + i * 30} ${600 - i * 54} h40 v10 h-40 Z`} fill={MYTH.stone} stroke={INK} strokeWidth={1.6} />
      ))}
    </Place>
  )
}

export function Depths({ pointerRef }: { pointerRef: Ref<HTMLDivElement> }) {
  const places = [
    ['wood', u.zoneWood, <WoodArt key="wood" />],
    ['road', u.zoneRoad, <RoadArt key="road" />],
    ['lake', u.zoneLake, <LakeArt key="lake" />],
    ['light', u.zoneLight, <LightArt key="light" />],
    ['mountain', u.zoneMountain, <MountainArt key="mountain" />],
    ['dead', u.zoneDead, <DeadArt key="dead" />],
    ['shore', u.zoneShore, <ShoreArt key="shore" />],
    ['peak', u.zonePeak, <PeakArt key="peak" />],
  ] as const
  return (
    <div ref={pointerRef} className={u.depths} aria-hidden="true">
      {places.map(([zone, look, art]) => (
        <div key={zone} className={`${u.zone} ${look}`} data-era={zone}>
          {art}
        </div>
      ))}
      {/* a dark veil over the painting so the page's text keeps its contrast in every region */}
      <div className="absolute inset-0 bg-[var(--myth-ink)] opacity-40" />
    </div>
  )
}
