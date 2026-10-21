import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { HeroCharacter, type SpritePose } from './character'
import { Layer, gearPath, pinePath } from './depth'
import { SHADE, SKY, type SkyLight } from './palette'
import shade from './shade.module.css'

// His three places, one per profession, each a silhouette scene in four planes (./depth): the System
// Engineer types at a console in a machine hall at dawn, gears turning in the fog and a lamp swinging
// on its cord; the Musician drums on an ember hilltop, birds crossing the low sun; the Martial Artist
// kicks a heavy bag hung from a branch at the edge of a forest ring under a crimson dusk, the bag
// swinging away on each kick. The lever switch (./levers) shows the picked one.
//
// Animated per place, at most 9: three or four props, his parts, the layers' lean.

export const PROFESSION_SKY: Record<Profession, SkyLight> = {
  engineer: SKY.dawn,
  drummer: SKY.ember,
  fighter: SKY.crimson,
}

export function Sky({ light, children }: { light: SkyLight; children?: ReactNode }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-b ${light.sky}`} aria-hidden="true">
      {children}
    </div>
  )
}

export const GROUND = 'M0 180 Q120 174 260 178 T520 176 T600 178 V200 H0 Z'

// A soft edged black shape out of focus: the shape at full dark over a wider, fainter copy of itself.
export function Soft({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill={SHADE.black} opacity={0.35} stroke={SHADE.black} strokeOpacity={0.35} strokeWidth={10} strokeLinejoin="round" />
      <path d={d} fill={SHADE.black} opacity={0.85} />
    </>
  )
}

// ---- System Engineer: the machine hall at dawn ----

const DAWN = SKY.dawn

function MachineHall({ pose }: { pose: SpritePose }) {
  return (
    <>
      <Sky light={DAWN} />
      <Layer depth="far">
        <path d="M0 150 Q110 128 230 142 T460 136 T600 140 V200 H0 Z" fill={DAWN.far} opacity={0.7} />
        <path d={gearPath(470, 92, 46, 14)} fill={DAWN.far} fillRule="evenodd" className={shade.spin} />
        <path d={gearPath(536, 140, 22, 9)} fill={DAWN.far} fillRule="evenodd" className={shade.spinBack} />
        {[70, 150].map((x) => (
          <path key={x} d={`M${x - 9} 150 L${x} 60 L${x + 9} 150 M${x - 12} 82 H${x + 12} M${x - 6} 110 H${x + 6}`} stroke={DAWN.far} strokeWidth={2} fill="none" />
        ))}
      </Layer>
      <Layer depth="mid">
        <rect x={0} y={54} width={600} height={7} fill={DAWN.mid} />
        <rect x={86} y={54} width={8} height={126} fill={DAWN.mid} />
        <rect x={520} y={54} width={10} height={126} fill={DAWN.mid} />
        <rect x={108} y={96} width={34} height={84} fill={DAWN.mid} />
        <rect x={118} y={70} width={14} height={34} fill={DAWN.mid} className={shade.piston} />
        <g className={shade.lampSwing}>
          <line x1={360} y1={61} x2={360} y2={104} stroke={SHADE.black} strokeWidth={1.4} />
          <path d="M350 104 H370 L376 114 H344 Z" fill={SHADE.black} />
          <path d="M346 114 H374 L410 178 H310 Z" fill={DAWN.rim} opacity={0.14} className={shade.lampFlicker} />
        </g>
      </Layer>
      <Layer depth="plane">
        <path d={GROUND} fill={SHADE.black} />
        <rect x={318} y={148} width={44} height={32} fill={SHADE.black} />
        <path d="M322 148 L328 124 H358 L362 148 Z" fill={SHADE.black} />
        <rect x={332} y={128} width={22} height={13} fill={DAWN.rim} className={shade.screenGlow} />
        <HeroCharacter profession="engineer" pose={pose} place={{ x: 290, y: 180, height: 58 }} />
      </Layer>
      <Layer depth="near">
        <Soft d="M0 0 Q60 70 40 130 Q30 160 0 170 Z" />
        <path d="M200 0 Q230 40 210 80" stroke={SHADE.black} strokeWidth={5} fill="none" opacity={0.8} />
        <path d="M560 0 Q540 50 580 90" stroke={SHADE.black} strokeWidth={6} fill="none" opacity={0.8} />
      </Layer>
    </>
  )
}

// ---- Musician: the ember hill ----

const EMBER = SKY.ember

function DrumKit() {
  return (
    <g fill={SHADE.black}>
      <circle cx={338} cy={164} r={16} />
      <rect x={322} y={176} width={32} height={4} />
      <ellipse cx={330} cy={142} rx={10} ry={4} />
      <rect x={322} y={142} width={16} height={9} />
      <line x1={366} y1={178} x2={366} y2={118} stroke={SHADE.black} strokeWidth={1.6} />
      <ellipse cx={366} cy={118} rx={15} ry={2.4} className={shade.cymbal} />
      <rect x={300} y={150} width={14} height={8} />
      <line x1={307} y1={158} x2={307} y2={178} stroke={SHADE.black} strokeWidth={1.4} />
    </g>
  )
}

function EmberHill({ pose }: { pose: SpritePose }) {
  return (
    <>
      <Sky light={EMBER}>
        <div className={`absolute left-[48%] top-[38%] h-40 w-40 rounded-full bg-[radial-gradient(closest-side,var(--sh-sun),transparent)] opacity-60`} />
      </Sky>
      <Layer depth="far">
        <circle cx={290} cy={130} r={30} fill={SHADE.sun} />
        <path d="M0 160 Q108 136 230 152 T460 146 T600 154 V200 H0 Z" fill={EMBER.far} />
        <g className={shade.birds}>
          {[
            [120, 60],
            [134, 52],
            [148, 64],
            [230, 46],
          ].map(([x, y]) => (
            <path key={x} d={`M${x - 4} ${y} Q${x - 2} ${y - 4} ${x} ${y} Q${x + 2} ${y - 4} ${x + 4} ${y}`} stroke={SHADE.black} strokeWidth={1.4} fill="none" />
          ))}
        </g>
      </Layer>
      <Layer depth="mid">
        <path d="M0 200 V176 Q160 150 300 156 Q440 150 600 176 V200 Z" fill={EMBER.mid} />
        <path d="M80 168 l3 -14 l3 14 l4 -10 l2 10 Z" fill={SHADE.black} className={shade.sway} />
        <path d="M520 170 l3 -14 l3 14 l4 -10 l2 10 Z" fill={SHADE.black} className={`${shade.sway} [animation-delay:-1.6s]`} />
      </Layer>
      <Layer depth="plane">
        <path d={GROUND} fill={SHADE.black} />
        <HeroCharacter profession="drummer" pose={pose} place={{ x: 288, y: 180, height: 58 }} />
        <DrumKit />
      </Layer>
      <Layer depth="near">
        <Soft d="M0 200 L0 120 L14 160 L22 104 L32 158 L44 120 L52 200 Z" />
        <Soft d="M600 200 L600 132 L586 166 L576 118 L566 170 L552 140 L548 200 Z" />
      </Layer>
    </>
  )
}

// ---- Martial Artist: the forest ring at dusk ----

const CRIMSON = SKY.crimson

function TempleRoof({ x }: { x: number }) {
  return (
    <path
      d={`M${x - 46} 160 H${x + 46} V200 H${x - 46} Z M${x - 56} 160 L${x - 32} 140 H${x + 32} L${x + 56} 160 Z M${x - 38} 140 L${x - 18} 122 H${x + 18} L${x + 38} 140 Z M${x - 22} 122 L${x} 100 L${x + 22} 122 Z M${x - 56} 160 Q${x - 62} 154 ${x - 60} 146 M${x + 56} 160 Q${x + 62} 154 ${x + 60} 146`}
      fill={CRIMSON.far}
      stroke={CRIMSON.far}
      strokeWidth={1.5}
    />
  )
}

function ForestRing({ pose }: { pose: SpritePose }) {
  return (
    <>
      <Sky light={CRIMSON} />
      <Layer depth="far">
        {[30, 80, 140, 200, 470, 540, 580].map((x, index) => (
          <path key={x} d={pinePath(x, 70 + (index % 3) * 22, 176)} fill={CRIMSON.far} />
        ))}
        <TempleRoof x={330} />
      </Layer>
      <Layer depth="mid">
        <path d="M0 176 L80 160 L150 172 L240 156 L300 176 Z" fill={CRIMSON.mid} />
        <rect x={150} y={120} width={6} height={60} fill={CRIMSON.mid} />
        <rect x={500} y={120} width={6} height={60} fill={CRIMSON.mid} />
        {[132, 148, 164].map((y) => (
          <line key={y} x1={153} y1={y} x2={503} y2={y} stroke={CRIMSON.mid} strokeWidth={1.6} />
        ))}
      </Layer>
      <Layer depth="plane">
        <path d={GROUND} fill={SHADE.black} />
        <path d="M600 200 V40 Q560 44 540 30 Q500 60 440 62 Q400 64 360 70 L362 76 Q420 74 470 72 Q520 70 556 80 L560 200 Z" fill={SHADE.black} />
        <g className={shade.bagSwing}>
          <line x1={378} y1={72} x2={378} y2={112} stroke={SHADE.black} strokeWidth={1.4} />
          <rect x={368} y={110} width={20} height={48} rx={6} fill={SHADE.black} />
        </g>
        <HeroCharacter profession="fighter" pose={pose} place={{ x: 330, y: 180, height: 58 }} />
      </Layer>
      <Layer depth="near">
        <Soft d="M0 200 L0 96 L18 150 L30 80 L44 160 L60 116 L70 200 Z" />
      </Layer>
    </>
  )
}

const PLACES: Record<Profession, (props: { pose: SpritePose }) => ReactNode> = {
  engineer: MachineHall,
  drummer: EmberHill,
  fighter: ForestRing,
}

export function Place({ profession, pose }: { profession: Profession; pose: SpritePose }) {
  const Scene = PLACES[profession]
  return <Scene pose={pose} />
}
