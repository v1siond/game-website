import { useId, type ReactNode } from 'react'
import { COLORS as C, TONE_VARS, type Tone } from './palette'
import paint from './scenery.module.css'

// The jungle's scenery, after the source's pre rendered levels: fan palms whose fronds split into
// fingers and droop, lit from above with a dark underside; ferns and round leaves in front; red blooms;
// a far treeline painted in flat bands under a pale sky; the treetop village's giant trunks, decks and
// lanterns; the purple cave with its stalactites and the hoard of bananas.
//
// Every shape is drawn once in SceneryDefs (the world's root renders it) and placed with <use>; it
// paints from the tone of the scene round it (scenery.module.css), so the same palm is green by day,
// black against the sunset and teal at night.
//
// Backdrop lays a section's scene behind it in planes: the sky and the banded treeline at the top, a
// cluster of foliage in each top and bottom corner, and a wall of leaves down both sides that repeats
// for as long as the section runs (an SVG pattern). The corners and walls keep to the page's edges, so
// the text in the middle never sits on a busy shape; the cards are opaque and stand in front.

// ---- the shapes ----

// A palm frond pointing right from its base at 0,0: the lit top edge, a darker underside split into
// hanging fingers, the rib and the cuts between the fingers.
const FROND = 'M0 0 C24 -20 64 -22 96 10 L88 14 L90 26 L76 20 L76 34 L62 24 L60 38 L48 26 L44 38 L34 24 L28 32 L20 18 L10 20 Z'
const FROND_UNDER = 'M2 6 C30 2 66 0 92 12 L88 14 L90 26 L76 20 L76 34 L62 24 L60 38 L48 26 L44 38 L34 24 L28 32 L20 18 L10 20 Z'
const FROND_RIB = 'M0 0 C28 -8 64 -6 94 11 M14 3 L20 18 M30 0 L34 24 M46 -1 L48 26 M62 0 L62 24 M76 4 L76 20'
const FROND_RIM = 'M4 -3 C28 -19 62 -20 92 6'

// The palm stands on 0,0 and its crown is 178 up; the trunk is ringed like the source's palms.
const CROWN = -178
const TRUNK_RINGS = Array.from({ length: 14 }, (_, i) => {
  const y = -168 + i * 12
  const half = 3 + ((y - CROWN) / -CROWN) * 5.5
  return `M${-half} ${y} Q0 ${y + 4} ${half} ${y}`
}).join(' ')

// The palm's fronds: the back pair first, darker, then the front ones drooping further down.
const BACK_FRONDS = [-76, -40]
const FRONT_FRONDS = [-12, 18, 46]

function Fronds({ angles }: { angles: number[] }) {
  return angles.flatMap((angle) => [
    <use key={`r${angle}`} href="#tp-frond" transform={`translate(0 ${CROWN}) rotate(${angle})`} />,
    <use key={`l${angle}`} href="#tp-frond" transform={`translate(0 ${CROWN}) scale(-1 1) rotate(${angle})`} />,
  ])
}

// A fern blade: leaflets in pairs up a stem, narrowing to the tip, 66 long.
const FERN_BLADE = (() => {
  const pairs = Array.from({ length: 9 }, (_, i) => ({ y: 6 + i * 6.5, w: 10 * (1 - i / 10) }))
  const right = pairs.map(({ y, w }) => `L${w.toFixed(1)} ${-(y + 2)} L1 ${-(y + 5)}`).join(' ')
  const left = [...pairs].reverse().map(({ y, w }) => `L-1 ${-(y + 5)} L${(-w).toFixed(1)} ${-(y + 2)}`).join(' ')
  return `M1 0 ${right} L0 -66 ${left} L-1 0 Z`
})()
const FERN_BLADES = [-58, -34, -12, 10, 32, 56]

const PETALS = [-48, -24, 0, 22, 46]

const BANANA = 'M0 0 C2 12 12 20 26 18 C24 22 18 24 12 23 C2 21 -3 12 -2 2 Z'
const BANANAS = [-34, -12, 10, 32]

/** The shapes every scene places; drawn once by the world's root, never shown on their own. */
export function SceneryDefs() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
      <defs>
        <g id="tp-frond">
          <path d={FROND} className={paint.leafLit} />
          <path d={FROND_UNDER} className={paint.leaf} />
          <path d={FROND_RIB} className={paint.rib} strokeWidth="1.4" />
          <path d={FROND_RIM} className={paint.rim} strokeWidth="2.2" opacity="0.7" />
        </g>

        <g id="tp-palm">
          <path d={`M-8 0 C-6 -60 -4 -120 -3 ${CROWN + 2} L3 ${CROWN + 2} C4 -120 6 -60 9 0 Z`} className={paint.trunk} />
          <path d={TRUNK_RINGS} className={paint.rib} strokeWidth="1.6" />
          <path d={`M3 ${CROWN + 4} C4 -120 6 -60 8.5 -2`} className={paint.rim} strokeWidth="1.6" opacity="0.6" />
          <g className={paint.back}>
            <Fronds angles={BACK_FRONDS} />
          </g>
          <circle cx="0" cy={CROWN + 2} r="8" className={paint.leafShade} />
          <ellipse cx="-6" cy={CROWN + 10} rx="4" ry="6" className={paint.leaf} />
          <ellipse cx="5" cy={CROWN + 11} rx="4" ry="6" className={paint.leaf} />
          <ellipse cx="0" cy={CROWN + 16} rx="4" ry="6" className={paint.leafShade} />
          <Fronds angles={FRONT_FRONDS} />
        </g>

        <g id="tp-fern">
          {FERN_BLADES.map((angle, i) => (
            <g key={angle} transform={`rotate(${angle}) scale(${i % 2 ? 1 : 0.82})`}>
              <path d={FERN_BLADE} className={i % 2 ? paint.leafLit : paint.leaf} />
              <path d="M0 0 L0 -64" className={paint.rib} strokeWidth="1.2" />
            </g>
          ))}
        </g>

        <g id="tp-broad">
          <path d="M0 -2 C10 -10 30 -14 34 4 C38 22 16 30 0 28 C-16 30 -38 22 -34 4 C-30 -14 -10 -10 0 -2 Z" className={paint.leafLit} />
          <path d="M-34 6 C-30 22 -12 30 0 28 C14 30 34 22 34 6 C20 14 -20 14 -34 6 Z" className={paint.leaf} />
          <path d="M0 -2 V26 M0 6 L-22 -2 M0 12 L-26 10 M0 6 L22 -2 M0 12 L26 10 M0 18 L-18 22 M0 18 L18 22" className={paint.rib} strokeWidth="1.3" />
          <path d="M-30 -4 C-24 -12 -10 -10 -2 -3 M2 -3 C10 -10 26 -12 32 0" className={paint.rim} strokeWidth="1.6" opacity="0.8" />
        </g>

        <g id="tp-bloom">
          {PETALS.map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path d="M0 0 C-9 -14 -7 -30 0 -42 C7 -30 9 -14 0 0 Z" className={paint.bloom} />
              <path d="M0 0 C6 -14 5 -28 0 -42 C7 -30 9 -14 0 0 Z" className={paint.fold} />
            </g>
          ))}
        </g>

        {/* The far treeline, 400 wide, in the flat bands the source paints its distance in. */}
        <g id="tp-treeline">
          <path d="M0 30 Q20 10 40 26 Q60 6 84 24 Q104 8 126 26 Q150 4 172 24 Q196 10 218 26 Q240 6 262 24 Q286 10 306 26 Q330 4 352 24 Q376 10 400 30 V100 H0 Z" className={paint.farLit} />
          <path d="M0 50 Q24 34 46 48 Q70 30 94 46 Q116 34 140 48 Q164 30 188 46 Q212 34 236 48 Q258 30 282 46 Q306 34 330 48 Q352 30 376 46 Q390 38 400 48 V100 H0 Z" className={paint.far} />
          {[60, 70, 80, 90].map((y) => (
            <rect key={y} x="0" y={y} width="400" height="3" className={paint.farLit} opacity="0.3" />
          ))}
        </g>

        <g id="tp-drip">
          <path d="M-14 0 C-10 40 -5 90 0 130 C5 90 10 40 14 0 Z" className={paint.leaf} />
          <path d="M0 0 L14 0 C10 40 5 90 0 130 C2 90 3 40 0 0 Z" className={paint.leafShade} opacity="0.7" />
          <path d="M-12 2 C-8 40 -4 86 -1 124" className={paint.rim} strokeWidth="1.6" opacity="0.6" />
        </g>

        {/* A bunch of four bananas on a stem, about 40 across, centred on 0,0. */}
        <g id="tp-bunch">
          {BANANAS.map((angle) => (
            <g key={angle} transform={`translate(-4 -12) rotate(${angle})`}>
              <path d={BANANA} fill={C.banana} stroke={C.bananaShade} strokeWidth="1.4" />
              <path d="M2 5 C5 12 11 17 20 18" fill="none" stroke={C.bananaLit} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ))}
          <path d="M-7 -20 L-1 -20 L-2 -11 L-6 -11 Z" fill={C.stem} />
        </g>
      </defs>
    </svg>
  )
}

/** A scope that gives the shapes inside it a tone. */
export function ToneScope({ tone, className = '', children }: { tone: Tone; className?: string; children: ReactNode }) {
  return (
    <div style={TONE_VARS[tone]} className={`${paint.scene} ${className}`}>
      {children}
    </div>
  )
}

// ---- the scenes ----

export type SceneKind = 'sunset' | 'dusk' | 'jungle' | 'vines' | 'treetop' | 'cave' | 'night'

// One scene: its tone, whether a sky and treeline open its top, and what grows in its corners and down
// its sides. Corners are drawn in a 400 by 300 box (top) and a 400 by 200 box (bottom), from the left
// edge inward; the right side is the same drawing mirrored. A wall tile is drawn in px from the edge.
interface SceneArt {
  tone: Tone
  sky: boolean
  top: ReactNode
  ground: ReactNode
  tile: { width: number; height: number; art: ReactNode }
}

const at = (x: number, y: number, scale = 1, angle = 0) => `translate(${x} ${y}) rotate(${angle}) scale(${scale})`

const PALM_CORNER = (
  <>
    <use href="#tp-palm" transform={at(250, 330, 0.95)} className={paint.haze} />
    <use href="#tp-palm" transform={at(96, 360, 1.35, -4)} />
    <use href="#tp-frond" transform={at(0, 26, 1.7, 14)} />
    <use href="#tp-frond" transform={at(0, 120, 1.2, 34)} className={paint.back} />
    <use href="#tp-broad" transform={at(34, 210, 1.3, 12)} />
  </>
)

const JUNGLE_GROUND = (
  <>
    <use href="#tp-fern" transform={at(300, 205, 1, 0)} className={paint.back} />
    <use href="#tp-bloom" transform={at(220, 205, 1.1)} />
    <use href="#tp-fern" transform={at(70, 205, 1.5)} />
    <use href="#tp-broad" transform={at(150, 182, 1.25, -8)} />
    <use href="#tp-broad" transform={at(26, 176, 1.1, 14)} />
  </>
)

const LEAF_TILE = {
  width: 220,
  height: 560,
  art: (
    <>
      <use href="#tp-frond" transform={at(0, 60, 1.3, 8)} />
      <use href="#tp-broad" transform={at(22, 190, 0.9, 20)} />
      <use href="#tp-frond" transform={at(0, 300, 1.1, 30)} className={paint.back} />
      <use href="#tp-fern" transform={at(4, 440, 1, 90)} />
      <use href="#tp-bloom" transform={at(10, 530, 0.8, 70)} />
    </>
  ),
}

const VINE_PATH = 'M0 0 C-10 80 12 160 0 240 C-10 320 10 400 0 480 C-8 520 6 550 0 560'

const VINE_TILE = {
  width: 220,
  height: 560,
  art: (
    <>
      <path d={VINE_PATH} transform="translate(26 0)" className={paint.vine} strokeWidth="5" />
      {[70, 190, 310, 430].map((y, i) => (
        <use key={y} href="#tp-broad" transform={at(i % 2 ? 40 : 14, y, 0.42, i % 2 ? 30 : -30)} />
      ))}
      <use href="#tp-frond" transform={at(0, 260, 1.15, 18)} className={paint.back} />
      <path d={VINE_PATH} transform="translate(84 -120)" className={paint.vine} strokeWidth="3" opacity="0.7" />
    </>
  ),
}

const TREETOP_TILE = {
  width: 220,
  height: 640,
  art: (
    <>
      <rect x="0" y="0" width="64" height="640" className={paint.trunk} />
      <path d="M12 0 V640 M30 0 V640 M50 0 V640" className={paint.rib} strokeWidth="3" opacity="0.6" />
      <path d="M62 0 V640" className={paint.rim} strokeWidth="2" opacity="0.4" />
      <path d="M0 292 Q130 286 160 300 Q130 316 0 312 Z" className={paint.deck} />
      <path d="M0 312 Q130 316 160 300 L160 306 Q130 324 0 320 Z" className={paint.deckEdge} />
      <path d="M8 292 V262 M70 290 V262 M130 292 V266 M8 266 Q70 278 130 268" className={paint.rope} strokeWidth="2" />
      <circle cx="116" cy="250" r="26" className={paint.lamp} opacity="0.18" />
      <rect x="110" y="242" width="12" height="16" rx="3" className={paint.lamp} />
      <path d="M64 330 Q140 380 220 360" className={paint.rope} strokeWidth="2.5" opacity="0.8" />
      <use href="#tp-fern" transform={at(64, 560, 0.8, 70)} className={paint.back} />
    </>
  ),
}

const CAVE_TILE = {
  width: 160,
  height: 520,
  art: (
    <>
      <path d="M0 0 H44 L28 80 L50 160 L24 240 L42 330 L20 420 L46 500 L40 520 H0 Z" className={paint.leafShade} />
      <path d="M44 0 L28 80 L50 160 L24 240 L42 330 L20 420 L46 500" className={paint.rim} strokeWidth="2" opacity="0.5" />
      <path d="M30 120 l8 -16 l6 18 Z M26 300 l7 -12 l5 14 Z M34 460 l6 -14 l6 16 Z" className={paint.leafLit} />
    </>
  ),
}

const TREETOP_CORNER = (
  <>
    <path d="M60 0 V300 H140 V0 Z" className={paint.trunk} />
    <path d="M76 0 V300 M100 0 V300 M124 0 V300" className={paint.rib} strokeWidth="4" opacity="0.6" />
    <path d="M20 170 Q140 160 230 176 Q140 196 20 190 Z" className={paint.deck} />
    <path d="M20 190 Q140 196 230 176 L230 184 Q140 206 20 198 Z" className={paint.deckEdge} />
    <path d="M230 176 Q300 230 400 200" className={paint.rope} strokeWidth="3" />
    <path d="M230 160 Q300 214 400 184" className={paint.rope} strokeWidth="2" opacity="0.7" />
    <circle cx="200" cy="140" r="34" className={paint.lamp} opacity="0.16" />
    <rect x="192" y="130" width="16" height="22" rx="4" className={paint.lamp} />
    <use href="#tp-frond" transform={at(140, 20, 1.2, -6)} className={paint.back} />
  </>
)

const CAVE_CORNER = (
  <>
    {[
      [26, 1.3],
      [92, 0.8],
      [150, 1.05],
      [216, 0.6],
      [292, 0.9],
      [360, 0.55],
    ].map(([x, scale]) => (
      <use key={x} href="#tp-drip" transform={at(x, 0, scale)} />
    ))}
  </>
)

// The hoard: bunches heaped into a mound in the corner, stalagmites round it.
const HOARD = Array.from({ length: 14 }, (_, i) => {
  const row = i < 6 ? 0 : i < 10 ? 1 : i < 13 ? 2 : 3
  const first = [0, 6, 10, 13][row]
  return { x: 40 + (i - first) * 44 + row * 22, y: 186 - row * 30 }
})

const CAVE_GROUND = (
  <>
    {HOARD.map(({ x, y }) => (
      <use key={`${x}-${y}`} href="#tp-bunch" transform={at(x, y, 1.1)} />
    ))}
    <use href="#tp-drip" transform={at(330, 200, 0.7, 180)} />
    <use href="#tp-drip" transform={at(370, 200, 0.45, 180)} />
  </>
)

const SCENES: Record<SceneKind, SceneArt> = {
  sunset: { tone: 'sunset', sky: false, top: PALM_CORNER, ground: JUNGLE_GROUND, tile: LEAF_TILE },
  dusk: { tone: 'dusk', sky: true, top: PALM_CORNER, ground: JUNGLE_GROUND, tile: LEAF_TILE },
  jungle: { tone: 'jungle', sky: true, top: PALM_CORNER, ground: JUNGLE_GROUND, tile: LEAF_TILE },
  vines: { tone: 'dusk', sky: true, top: PALM_CORNER, ground: JUNGLE_GROUND, tile: VINE_TILE },
  treetop: { tone: 'treetop', sky: true, top: TREETOP_CORNER, ground: JUNGLE_GROUND, tile: TREETOP_TILE },
  cave: { tone: 'cave', sky: false, top: CAVE_CORNER, ground: CAVE_GROUND, tile: CAVE_TILE },
  night: { tone: 'night', sky: false, top: PALM_CORNER, ground: JUNGLE_GROUND, tile: LEAF_TILE },
}

const TREELINE_COPIES = [0, 400, 800, 1200, 1600, 2000]

const WALL_SIDE = { left: 'left-0', right: 'right-0 -scale-x-100' } as const

function Wall({ tile, side }: { tile: SceneArt['tile']; side: 'left' | 'right' }) {
  // A pattern id that is safe inside url(#...): useId's own carries punctuation.
  const id = `tp-wall-${useId().replace(/[^\w-]/g, '')}`
  return (
    <svg className={`absolute inset-y-0 h-full w-[clamp(1.5rem,10vw,13rem)] ${WALL_SIDE[side]}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={tile.width} height={tile.height} patternUnits="userSpaceOnUse">
          {tile.art}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

const CORNER_BOX = 'absolute w-[clamp(8rem,28vw,24rem)]'
const TOP_CORNER = `${CORNER_BOX} top-0 aspect-[4/3]`
const GROUND_CORNER = `${CORNER_BOX} bottom-0 aspect-[2/1]`

// Where the backdrop sits: behind a full width band (the hero, the profession switch, the contact), or
// bled out to the screen's width from a section inside the page's column, and past its ends into the
// gaps between sections.
const PLACEMENT = {
  band: 'inset-0',
  bleed: '-inset-y-12 left-1/2 w-screen -translate-x-1/2',
} as const

interface BackdropProps {
  kind: SceneKind
  placement: keyof typeof PLACEMENT
}

/** A section's jungle, layered behind it; decoration only. */
export function Backdrop({ kind, placement }: BackdropProps) {
  const scene = SCENES[kind]

  return (
    <div style={TONE_VARS[scene.tone]} className={`pointer-events-none absolute -z-10 overflow-hidden ${PLACEMENT[placement]} ${paint.scene} ${paint.fade}`} aria-hidden="true">
      {scene.sky && (
        <>
          <div className={`absolute inset-x-0 top-0 h-36 ${paint.sky}`} />
          <svg viewBox="0 0 2400 100" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 top-16 h-24 w-full" focusable="false">
            {TREELINE_COPIES.map((x) => (
              <use key={x} href="#tp-treeline" x={x} />
            ))}
          </svg>
        </>
      )}
      <Wall tile={scene.tile} side="left" />
      <Wall tile={scene.tile} side="right" />
      <svg viewBox="0 0 400 300" className={`${TOP_CORNER} left-0`} focusable="false">
        {scene.top}
      </svg>
      <svg viewBox="0 0 400 300" className={`${TOP_CORNER} right-0 -scale-x-100`} focusable="false">
        {scene.top}
      </svg>
      <svg viewBox="0 0 400 200" className={`${GROUND_CORNER} left-0`} focusable="false">
        {scene.ground}
      </svg>
      <svg viewBox="0 0 400 200" className={`${GROUND_CORNER} right-0 -scale-x-100`} focusable="false">
        {scene.ground}
      </svg>
    </div>
  )
}

// ---- the stages inside the machines ----

const STAGE_PALMS: ReadonlyArray<readonly [number, number, number, boolean]> = [
  // x, base y, scale, far
  [40, 300, 0.95, true],
  [372, 300, 1.05, true],
  [118, 312, 0.8, false],
  [300, 318, 0.7, false],
]

/** Behind the partner barrel: a dusk sky over the banded treeline, palms near and far, ferns at the ledge. */
export function DuskStage() {
  return (
    <ToneScope tone="dusk" className="absolute inset-0">
      <div className={`absolute inset-x-0 top-0 h-2/3 ${paint.sky}`} />
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" focusable="false">
        <use href="#tp-treeline" transform="translate(0 150) scale(1 0.9)" />
        {STAGE_PALMS.map(([x, y, scale, far]) => (
          <use key={x} href="#tp-palm" transform={at(x, y, scale)} className={far ? paint.haze : undefined} />
        ))}
        <use href="#tp-fern" transform={at(30, 262, 0.9)} />
        <use href="#tp-broad" transform={at(370, 254, 0.9, -10)} />
        <use href="#tp-bloom" transform={at(392, 262, 0.7)} />
      </svg>
    </ToneScope>
  )
}

const CEILING_DRIPS: ReadonlyArray<readonly [number, number]> = [
  [20, 0.42],
  [74, 0.26],
  [130, 0.36],
  [196, 0.22],
  [250, 0.4],
  [318, 0.28],
  [380, 0.34],
  [446, 0.24],
  [508, 0.42],
  [570, 0.3],
  [634, 0.38],
  [700, 0.24],
  [760, 0.4],
]

/** The mine cart's tunnel as the purple cave of the hoard: stalactites along the roof, a rock wall behind. */
export function CaveCeiling() {
  return (
    <ToneScope tone="cave" className="absolute inset-0">
      <svg viewBox="0 0 800 144" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full" focusable="false">
        <rect width="800" height="144" className={paint.leafShade} />
        <path d="M0 40 Q60 70 120 52 T240 60 T360 46 T480 64 T600 50 T720 62 T800 48 V144 H0 Z" className={paint.far} opacity="0.7" />
        <path d="M0 96 Q80 84 160 98 T320 92 T480 100 T640 90 T800 98 V144 H0 Z" className={paint.leafShade} />
        <circle cx="620" cy="120" r="70" className={paint.lamp} opacity="0.12" />
        {CEILING_DRIPS.map(([x, scale]) => (
          <use key={x} href="#tp-drip" transform={at(x, 0, scale)} />
        ))}
      </svg>
    </ToneScope>
  )
}

const NIGHT_STARS: ReadonlyArray<readonly [number, number]> = [
  [20, 18], [60, 40], [110, 14], [150, 52], [200, 24], [240, 60], [280, 20], [330, 44], [370, 16], [90, 70], [300, 84],
]

/** The night behind the tree house: stars, the moon, the banded treeline and teal palms. */
export function NightSky() {
  return (
    <>
      {NIGHT_STARS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill={C.moon} opacity="0.75" />
      ))}
      <circle cx="320" cy="56" r="40" fill={C.moon} opacity="0.12" />
      <circle cx="320" cy="56" r="26" fill={C.moon} />
      <circle cx="310" cy="50" r="5" fill={C.nightSky} opacity="0.15" />
      <circle cx="328" cy="64" r="3.5" fill={C.nightSky} opacity="0.12" />
      <use href="#tp-treeline" transform="translate(0 150) scale(1 0.8)" />
      <use href="#tp-palm" transform={at(250, 236, 0.75, 4)} className={paint.haze} />
      <use href="#tp-palm" transform={at(372, 240, 0.95, -6)} />
    </>
  )
}

/** The night's foreground: round leaves, ferns and a bloom in the bottom corners, clear of the middle. */
export function NightFront() {
  return (
    <>
      <use href="#tp-broad" transform={at(10, 250, 1.1, 18)} />
      <use href="#tp-fern" transform={at(196, 262, 0.7)} className={paint.back} />
      <use href="#tp-fern" transform={at(392, 262, 1)} />
      <use href="#tp-bloom" transform={at(356, 262, 0.7)} />
    </>
  )
}
