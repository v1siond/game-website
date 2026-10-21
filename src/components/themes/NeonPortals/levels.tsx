import type { CSSProperties, ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import { Crate, Fruit } from './art'
import { HeroCharacter } from './character'
import { PORTAL } from './palette'
import world from './world.module.css'

// The level each portal leads to, drawn as a wide side view under the hub, three layers deep (far, mid,
// near) that lean apart with the pointer (--mx), so the scene has the platformer's depth:
// - System Engineer: temple ruins turned into his lab, glowing panels set in the carved stone where
//   code lines type out, a stack of crates, him at a stone desk.
// - Musician: a raft stage on a jungle river at night, tiki torches, his kit with the cymbals tipping
//   and rings of sound off the drums.
// - Martial Artist: a ring on a floating stone island over the clouds, the heavy bag swinging after a
//   hit, him bouncing in his guard.
// Every loop is transform or opacity; five to seven move per level, all stopped under reduced motion.

const LAYER = 'absolute inset-0 h-full w-full'

function Layer({ depth, children }: { depth: 'far' | 'mid' | 'near'; children: ReactNode }) {
  return (
    <svg viewBox="0 0 800 250" preserveAspectRatio="xMidYMax slice" className={`${LAYER} ${world[`depth_${depth}`]}`} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const JUNGLE = 'M0 170 Q40 120 80 150 Q120 90 170 140 Q210 100 260 150 Q320 80 380 140 Q430 110 480 150 Q540 90 600 140 Q650 110 700 150 Q750 100 800 140 V250 H0 Z'

const nightSky = (
  <>
    <rect width="800" height="250" fill="url(#np-level-sky)" />
    <circle cx="660" cy="56" r="26" fill="#f6f0d0" opacity="0.9" />
    <circle cx="650" cy="50" r="26" fill={PORTAL.NIGHT} opacity="0.35" />
  </>
)

function SkyDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="np-level-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PORTAL.VOID} />
          <stop offset="0.7" stopColor={PORTAL.NIGHT} />
          <stop offset="1" stopColor={PORTAL.HAZE} />
        </linearGradient>
        <linearGradient id="np-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b4f8a" />
          <stop offset="1" stopColor="#0b2346" />
        </linearGradient>
        <linearGradient id="np-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f3d5c" />
          <stop offset="1" stopColor="#06213a" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ---- System Engineer: the temple lab ----

const CODE_ROWS = [0, 1, 2, 3]

function CodePanel({ x, width }: { x: number; width: number }) {
  return (
    <g>
      <rect x={x} y="70" width={width} height="80" rx="4" fill="url(#np-screen)" stroke={PORTAL.BLUE} strokeWidth="2.5" />
      {CODE_ROWS.map((row) => (
        <rect
          key={row}
          x={x + 8 + (row % 2) * 10}
          y={84 + row * 16}
          width={width - 26 - (row % 3) * 14}
          height="5"
          rx="2"
          fill={row === 2 ? PORTAL.ORANGE : PORTAL.BLUE}
          className={world.codeLine}
          style={{ '--i': row + x / 100 } as CSSProperties}
        />
      ))}
    </g>
  )
}

function EngineerLevel() {
  return (
    <>
      <Layer depth="far">
        {nightSky}
        <path d={JUNGLE} fill="#123a2a" opacity="0.8" />
      </Layer>
      <Layer depth="mid">
        <path d="M120 250 V90 L170 60 H630 L680 90 V250 Z" fill="url(#np-stone)" stroke={PORTAL.STONE_DARK} strokeWidth="3" />
        {[150, 300, 450, 600].map((x) => (
          <path key={x} d={`M${x} 60 V250`} stroke={PORTAL.STONE_DARK} strokeWidth="2" />
        ))}
        <path d="M120 120 H680 M120 180 H680" stroke={PORTAL.STONE_DARK} strokeWidth="2" />
        <path d="M380 62 L400 40 L420 62 Z" fill={PORTAL.STONE_LIT} />
        <g className={world.panelGlow}>
          <CodePanel x={200} width={150} />
          <CodePanel x={450} width={150} />
        </g>
        <path d="M120 90 Q150 140 130 200 M680 90 Q650 150 672 210" stroke="#2f8f3a" strokeWidth="5" fill="none" />
      </Layer>
      <Layer depth="near">
        <rect y="218" width="800" height="32" fill={PORTAL.STONE_DARK} />
        <rect y="214" width="800" height="6" fill={PORTAL.STONE} />
        <rect x="300" y="170" width="200" height="16" rx="3" fill={PORTAL.STONE_LIT} stroke={PORTAL.STONE_DARK} strokeWidth="2" />
        <rect x="320" y="186" width="20" height="30" fill={PORTAL.STONE} />
        <rect x="460" y="186" width="20" height="30" fill={PORTAL.STONE} />
        <rect x="370" y="162" width="60" height="8" rx="2" fill={PORTAL.MUTED} />
      </Layer>
      <div className="absolute bottom-[6%] left-[4%] flex w-[16%] flex-col-reverse items-start" aria-hidden="true">
        <Crate className="h-auto w-[60%]" />
        <Crate className="-mb-px h-auto w-[60%]" mark />
      </div>
    </>
  )
}

// ---- Musician: the raft stage on the river ----

function TikiTorch({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 4} y="110" width="8" height="110" fill={PORTAL.BAND} />
      <rect x={x - 8} y="100" width="16" height="16" rx="2" fill={PORTAL.PLANK_DARK} />
      <g className={world.flame}>
        <ellipse cx={x} cy="88" rx="10" ry="16" fill={PORTAL.ORANGE} />
        <ellipse cx={x} cy="92" rx="5" ry="9" fill={PORTAL.GOLD} />
      </g>
    </g>
  )
}

function DrumKitArt() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true" focusable="false">
      <g className={world.cymbalLeft}>
        <rect x="27" y="30" width="3" height="88" fill={PORTAL.MUTED} />
        <ellipse cx="28" cy="30" rx="26" ry="5" fill={PORTAL.GOLD} stroke={PORTAL.ORANGE_DEEP} strokeWidth="1.5" />
      </g>
      <g className={world.cymbalRight}>
        <rect x="171" y="22" width="3" height="96" fill={PORTAL.MUTED} />
        <ellipse cx="172" cy="22" rx="28" ry="5" fill={PORTAL.GOLD} stroke={PORTAL.ORANGE_DEEP} strokeWidth="1.5" />
      </g>
      <circle cx="100" cy="82" r="36" fill={PORTAL.FRUIT_RED} stroke={PORTAL.WHITE} strokeWidth="4" />
      <circle cx="100" cy="82" r="22" fill={PORTAL.WHITE} opacity="0.9" />
      <rect x="54" y="44" width="34" height="22" rx="4" fill={PORTAL.FRUIT_RED} stroke={PORTAL.WHITE} strokeWidth="2.5" />
      <rect x="112" y="44" width="34" height="22" rx="4" fill={PORTAL.FRUIT_RED} stroke={PORTAL.WHITE} strokeWidth="2.5" />
      <rect x="140" y="74" width="34" height="34" rx="5" fill={PORTAL.FRUIT_RED} stroke={PORTAL.WHITE} strokeWidth="2.5" />
    </svg>
  )
}

function MusicianLevel() {
  return (
    <>
      <Layer depth="far">
        {nightSky}
        <path d={JUNGLE} fill="#123a2a" opacity="0.85" />
        <rect y="190" width="800" height="60" fill="url(#np-water)" />
      </Layer>
      <Layer depth="mid">
        <TikiTorch x={170} />
        <TikiTorch x={630} />
        {[0, 1, 2].map((ring) => (
          <ellipse key={ring} cx="400" cy="140" rx={60 + ring * 40} ry={30 + ring * 20} fill="none" stroke={PORTAL.VIOLET} strokeWidth="3" className={world.soundRing} style={{ '--i': ring } as CSSProperties} />
        ))}
      </Layer>
      <Layer depth="near">
        <g className={world.raft}>
          <rect x="220" y="200" width="360" height="22" rx="6" fill="url(#np-plank)" stroke={PORTAL.BAND} strokeWidth="3" />
          {[260, 320, 380, 440, 500, 560].map((x) => (
            <path key={x} d={`M${x} 202 V220`} stroke={PORTAL.BAND} strokeWidth="2" />
          ))}
        </g>
        <path d="M0 236 Q100 228 200 236 T400 236 T600 236 T800 236 V250 H0 Z" fill="#0b2346" />
      </Layer>
      <div className={`absolute bottom-[12%] left-1/2 h-[42%] w-[26%] -translate-x-[10%] ${world.raft}`} aria-hidden="true">
        <DrumKitArt />
      </div>
    </>
  )
}

// ---- Martial Artist: the floating ring ----

function FighterLevel() {
  return (
    <>
      <Layer depth="far">
        {nightSky}
        {[
          [120, 180, 90],
          [520, 200, 120],
          [330, 220, 70],
        ].map(([x, y, r]) => (
          <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.3} fill={PORTAL.MUTED} opacity="0.35" className={world.cloud} />
        ))}
      </Layer>
      <Layer depth="mid">
        <g className={world.island}>
          <path d="M180 170 H620 L560 220 L470 246 L400 250 L320 244 L240 220 Z" fill="url(#np-stone)" stroke={PORTAL.STONE_DARK} strokeWidth="3" />
          <rect x="180" y="160" width="440" height="14" fill={PORTAL.HAZE} stroke={PORTAL.STONE_DARK} strokeWidth="2" />
          {[200, 600].map((x) => (
            <rect key={x} x={x - 5} y="80" width="10" height="84" fill={PORTAL.STONE_LIT} />
          ))}
          {[96, 116, 136].map((y, i) => (
            <line key={y} x1="200" y1={y} x2="600" y2={y} stroke={[PORTAL.FRUIT_RED, PORTAL.WHITE, PORTAL.BLUE][i]} strokeWidth="3" />
          ))}
        </g>
      </Layer>
      <Layer depth="near">
        <g className={world.bag}>
          <line x1="500" y1="0" x2="500" y2="70" stroke={PORTAL.MUTED} strokeWidth="3" />
          <rect x="482" y="70" width="36" height="78" rx="14" fill={PORTAL.FRUIT_RED} stroke={PORTAL.BAND} strokeWidth="3" />
          <rect x="482" y="86" width="36" height="6" fill={PORTAL.GOLD} />
        </g>
      </Layer>
    </>
  )
}

const LEVEL: Record<Profession, () => ReactNode> = {
  engineer: EngineerLevel,
  drummer: MusicianLevel,
  fighter: FighterLevel,
}

// Where he stands in each level, as a share of the strip.
const HIM: Record<Profession, string> = {
  engineer: 'left-[44%] bottom-[16%] h-[52%]',
  drummer: 'left-[36%] bottom-[16%] h-[52%]',
  fighter: 'left-[38%] bottom-[24%] h-[48%]',
}

export function ProfessionLevel({ profession }: { profession: Profession }) {
  const Level = LEVEL[profession]

  return (
    <div className={`relative mx-auto aspect-[16/7] max-w-5xl overflow-hidden rounded-[2rem] border-4 border-[color:var(--np-stone-dark)] sm:aspect-[16/5] ${world.level}`} aria-hidden="true">
      <SkyDefs />
      <Level />
      <div className={`absolute aspect-[2/3] ${HIM[profession]} ${world.depth_near}`}>
        <div className={`h-full w-full ${profession === 'fighter' ? world.guardBounce : world.idle}`}>
          <HeroCharacter profession={profession} className="h-full w-full" />
        </div>
      </div>
      {profession === 'engineer' && (
        <div className={`absolute right-[8%] top-[14%] h-[14%] ${world.floatFruit}`}>
          <Fruit className="h-full w-auto" />
        </div>
      )}
    </div>
  )
}
