import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { drop, hop } from '@/lib/motion/arc'
import { ramp } from '@/lib/scroll/stage'
import { trackAt } from '@/lib/scroll/track'
import { clamp01, fadeTo, focusOn, fx, lerp, r1, transformTo, translateTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { BANDMATES, CRITTER, KEEPER, SPARRER, VILLAGER, type PixelSprite } from './npcs'
import { PixelArt, type Frame } from './walker'
import { RPG } from './palette'
import { GROUND, PX, type Zone } from './zones'

// Each part of the page as a scene of the walk: its place (the ruins, the snow town, the crystal cave, the
// volcano, the market town), his kit, and one stop per card the section counts. He holds his place while
// the field slides under him: as each card is read the field runs one spacing to bring its stop (the run,
// his two step frames), then he makes the genre's move there and the stop answers it (the beat), held once
// done; scroll up plays it back (the shared trackAt). About: he fights a critter, which flashes, fades and
// drops a coin. Work: he talks to the villager at each job's door and the door's lamp lights. Tech: he
// kneels and opens a chest, the item rising over it. Services: he pushes a stone block onto a switch and a
// bridge slides out over the lava. Projects: he casts at a rune stone and the spikes before it sink. Ventures:
// he pays at a stall, the keeper bows and the sign lights. Bands: a bandmate walks in and falls in behind
// him, the party line growing one per band. Muay Thai: guard, knee and kick at a sparring critter, the
// arena torch flaring. Contact: he walks up to the save point in the ruins and kneels at it. The hero: him
// in the ruins and his critter across from him, which hops off as the page moves on.
//
// He is the pixel sprite (walker.tsx) and his frames swap the way sprite frames do.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his feet are, his size, his sprite frame and how visible he is. */
export type WalkerState = FigureState<Frame>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The stops and the cast, drawn in the figure layer behind him. */
  back: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<Frame>
}

// The middle of the band the scenes play in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [880, 1300], phone: [580, 860] }

/** His size: a sprite pixel is 1.4 grid pixels, so he stands about a quarter of the screen. */
const K = 1.4 * PX

/** One grid pixel of a stop's art on the canvas. */
const U = K

/** Where he holds his place: right of the text on a wide screen, left of the middle on a phone. */
const holdOf = ({ phone }: Layout): number => (phone ? 620 : 900)

/** The stops stand this far apart; the next one waits one spacing ahead of him. */
const SPACING = 600

// How far the view pushes in at a full push.
const PUSH = 0.1

const walker = (x: number, frame: Frame, k = K, opacity = 1, y = GROUND): WalkerState => ({ x, y, k, pose: frame, opacity })

/** A cast sprite drawn on the grid round its foot (its bottom middle). */
const Sprite = ({ sprite, width, height }: { sprite: PixelSprite; width: number; height: number }) => (
  <g transform={`scale(${U})`}>
    <PixelArt sprite={sprite} x={-width / 2} y={-height} />
  </g>
)

/** A shape on the grid round its foot, blown up to the canvas. */
const Px = ({ children }: { children: ReactNode }) => <g transform={`scale(${U})`}>{children}</g>

// ---------------------------------------------------------------- the stops writer

/** His frame at a moment of a move: the sprite frame, how far ahead of his place and above the floor. */
interface Him {
  frame: Frame
  ahead: number
  lift?: number
}

/** A key of a move: by `at` (0 to 1 of the move) he is `ahead` and `lift` up, having got there in `frame`
 *  over an arc `arc` high; the first key is where the move starts. */
interface Key extends Him {
  at: number
  arc?: number
}

/** A move from its keys in order of `at`: between two keys he travels in the later key's frame; after the
 *  last he holds it. */
function keyed(keys: readonly Key[]): (t: number) => Him {
  return (t) => {
    const next = keys.findIndex((key) => key.at > t)
    if (next === -1) return keys[keys.length - 1]
    const from = keys[Math.max(0, next - 1)]
    const to = keys[next]
    const u = next === 0 ? 0 : ramp(t, from.at, to.at)
    return { frame: to.frame, ahead: lerp(from.ahead, to.ahead, u), lift: lerp(from.lift ?? 0, to.lift ?? 0, u) + hop(u, to.arc ?? 0) }
  }
}

/** The bell a push follows over a move: 0, up to 1 at `at`, back to 0 `width` either side. */
const bell = (t: number, at: number, width = 0.1): number => clamp01(1 - Math.abs(t - at) / width)

/** His step frame at `x` of his walk. */
const stepOf = (x: number): Frame => (Math.floor(x / 40) % 2 === 0 ? 'stepA' : 'stepB')

interface StopsDef {
  zone: Zone
  kit: Profession | null
  /** A card's stop, drawn round the spot where he makes his move (x 0 his place, y 0 the floor). */
  stop: (i: number) => ReactNode
  /** The cast that walks with him instead of the field (the party line), drawn round his place. */
  company?: (layout: Layout) => ReactNode
  /** His move at a stop, `t` of the way; t 1 is its held end. */
  move: (t: number) => Him
  /** How far the view pushes in over his move. */
  push?: (t: number) => number
  /** Binds the stops' answers; the writer takes how far each card's answer has played, 0 to 1. */
  reply: (stage: StageNodes, layout: Layout) => (played: (i: number) => number) => void
}

const STAND: Him = { frame: 'standR', ahead: 0 }

/** The run between beats: out of the last move's held end, back to his place, in his step frames. */
function runOf(before: Him, run: number, offset: number): Him {
  if (run <= 0) return before
  return { frame: stepOf(offset), ahead: lerp(before.ahead, 0, ramp(run, 0, 0.4)), lift: lerp(before.lift ?? 0, 0, ramp(run, 0, 0.4)) }
}

const stopsScene = ({ zone, kit, stop, company, move, push, reply }: StopsDef): SceneDef => ({
  zone,
  kit,
  back: (layout) => (
    <>
      <g data-fx="course">
        {Array.from({ length: Math.max(1, layout.count) }, (_, i) => (
          <g key={i} transform={`translate(${holdOf(layout) + SPACING * (i + 1)} ${GROUND})`}>
            {stop(i)}
          </g>
        ))}
      </g>
      {company?.(layout)}
    </>
  ),
  bind: (stage, layout) => {
    const count = Math.max(1, layout.count)
    const hold = holdOf(layout)
    const course = fx(stage, 'course')
    const camera = fx(stage, 'camera')
    const answers = reply(stage, layout)
    return (_p, f) => {
      const beat = trackAt(f, count, SPACING)
      translateTo(course, -beat.offset, 0)
      answers((i) => (i < beat.at ? 1 : i === beat.at ? beat.act : 0))
      const him = beat.act > 0 ? move(beat.act) : runOf(beat.at > 0 ? move(1) : STAND, beat.run, beat.offset)
      const x = hold + him.ahead
      const y = GROUND - (him.lift ?? 0)
      const pushed = beat.act > 0 && push ? push(beat.act) : 0
      transformTo(camera, pushed > 0 ? focusOn(x, y - 120, 1 + PUSH * pushed) : '')
      return walker(x, him.frame, K, 1, y)
    }
  },
})

/** The nodes `name-0` to `name-(count - 1)`. */
const nodes = (stage: StageNodes, name: string, count: number): Array<Element | null> => Array.from({ length: Math.max(1, count) }, (_, i) => fx(stage, `${name}-${i}`))

/** Two frames of one stop: the first shown, the second hidden until the answer swaps them. */
const swap = (node: Element | null, second: boolean): void => {
  node?.children[0]?.setAttribute('visibility', second ? 'hidden' : 'visible')
  node?.children[1]?.setAttribute('visibility', second ? 'visible' : 'hidden')
}

/** A struck foe's answer: it blinks while it is hit, then fades out. */
const struck = (node: Element | null, t: number, hit: number): void => {
  const blink = t >= hit && t < hit + 0.15 && Math.floor((t - hit) * 40) % 2 === 1
  fadeTo(node, blink ? 0.2 : 1 - ramp(t, hit + 0.15, hit + 0.25))
}

// ---------------------------------------------------------------- the stops' art

const Sparkle = ({ y, fill = RPG.gold }: { y: number; fill?: string }) => (
  <Px>
    <path d={`M-1 ${y - 4} h2 v3 h3 v2 h-3 v3 h-2 v-3 h-3 v-2 h3 Z`} fill={fill} />
  </Px>
)

const Coin = () => (
  <Px>
    <rect x={-3} y={-7} width={6} height={7} fill={RPG.gold} />
    <rect x={-1} y={-6} width={2} height={5} fill={RPG.wraps} />
  </Px>
)

const Lantern = ({ lit }: { lit: boolean }) => (
  <Px>
    {lit && <rect x={-9} y={-50} width={18} height={15} fill={RPG.gold} opacity={0.35} />}
    <rect x={-1} y={-40} width={2} height={40} fill={RPG.woodDark} />
    <rect x={-4} y={-46} width={8} height={7} fill={RPG.pine} />
    <rect x={-3} y={-45} width={6} height={5} fill={lit ? RPG.gold : RPG.snowShade} />
    <rect x={-5} y={-47} width={10} height={2} fill={RPG.woodDark} />
  </Px>
)

const Balloon = () => (
  <Px>
    <rect x={-10} y={-8} width={20} height={9} fill={RPG.void} stroke={RPG.border} strokeWidth={1} />
    <rect x={-2} y={1} width={3} height={2} fill={RPG.border} />
  </Px>
)

const Chest = () => (
  <Px>
    <rect x={-8} y={-10} width={16} height={10} fill={RPG.shopDark} />
    <rect x={-8} y={-10} width={16} height={1} fill={RPG.shopWood} />
    <rect x={-1} y={-9} width={2} height={3} fill={RPG.gold} />
  </Px>
)

const ChestLid = () => (
  <Px>
    <rect x={-8} y={-4} width={16} height={4} fill={RPG.shopWood} />
    <rect x={-8} y={-4} width={16} height={1} fill={RPG.gold} />
  </Px>
)

const Gem = () => (
  <Px>
    <path d="M-4 -6 L-2 -9 H2 L4 -6 L0 0 Z" fill={RPG.crystal} />
    <rect x={-2} y={-8} width={1} height={2} fill={RPG.border} />
  </Px>
)

const Block = () => (
  <Px>
    <rect x={0} y={-12} width={12} height={12} fill={RPG.stoneLit} />
    <rect x={0} y={-12} width={12} height={2} fill={RPG.stone} />
    <rect x={0} y={-1} width={12} height={1} fill={RPG.stoneDark} />
    <rect x={11} y={-12} width={1} height={12} fill={RPG.stoneDark} />
  </Px>
)

const FloorSwitch = () => (
  <Px>
    <rect x={0} y={-2} width={12} height={2} fill={RPG.basaltLit} />
    <rect x={2} y={-3} width={8} height={1} fill={RPG.gold} />
  </Px>
)

const Spikes = () => (
  <Px>
    <rect x={0} y={-2} width={18} height={2} fill={RPG.borderShade} />
    {[2, 6, 10, 14].map((x) => (
      <path key={x} d={`M${x - 2} -2 L${x} -8 L${x + 2} -2 Z`} fill={RPG.border} />
    ))}
  </Px>
)

const RuneStone = ({ lit }: { lit: boolean }) => (
  <Px>
    <rect x={-5} y={-24} width={10} height={24} fill={RPG.basaltLit} />
    <rect x={-5} y={-24} width={10} height={2} fill={RPG.ash} />
    <path d="M-2 -18 h4 v2 h-1 v3 h2 v2 h-6 v-2 h2 v-3 h-1 Z" fill={lit ? RPG.runeGlow : RPG.basalt} />
    {lit && <rect x={-8} y={-24} width={16} height={14} fill={RPG.runeGlow} opacity={0.25} />}
  </Px>
)

const Orb = () => (
  <Px>
    <rect x={-3} y={-3} width={6} height={6} fill={RPG.runeGlow} opacity={0.5} />
    <rect x={-2} y={-2} width={4} height={4} fill={RPG.runeCore} />
  </Px>
)

const Stall = ({ lit }: { lit: boolean }) => (
  <Px>
    <rect x={-2} y={-30} width={2} height={30} fill={RPG.townBeam} />
    <rect x={26} y={-30} width={2} height={30} fill={RPG.townBeam} />
    <rect x={-4} y={-34} width={34} height={5} fill={RPG.awning} />
    {[0, 8, 16, 24].map((x) => (
      <rect key={x} x={x - 4} y={-34} width={4} height={5} fill={RPG.townRoof} />
    ))}
    <rect x={6} y={-42} width={14} height={7} fill={lit ? RPG.gold : RPG.townBeam} />
    <rect x={-4} y={-14} width={34} height={14} fill={RPG.shopWood} />
    <rect x={-4} y={-14} width={34} height={2} fill={RPG.shopDark} />
  </Px>
)

const Torch = ({ flare }: { flare: boolean }) => (
  <Px>
    <rect x={-1} y={-30} width={2} height={30} fill={RPG.woodDark} />
    <rect x={-3} y={-32} width={6} height={3} fill={RPG.basaltLit} />
    {flare ? <rect x={-4} y={-44} width={8} height={12} fill={RPG.lava} /> : <rect x={-2} y={-37} width={4} height={5} fill={RPG.lava} />}
    {flare ? <rect x={-2} y={-41} width={4} height={7} fill={RPG.lavaCore} /> : <rect x={-1} y={-35} width={2} height={3} fill={RPG.lavaCore} />}
  </Px>
)

/** Two frames of a stop's thing: before the answer and after it. */
const Swap = ({ name, i, first, second }: { name: string; i: number; first: ReactNode; second: ReactNode }) => (
  <g data-fx={`${name}-${i}`}>
    <g visibility="visible">{first}</g>
    <g visibility="hidden">{second}</g>
  </g>
)

// ---------------------------------------------------------------- the hero

const HERO_AT = { wide: { foe: 300, him: 1180 }, phone: { foe: 600, him: 820 } }

const hero: SceneDef = {
  zone: 'ruins',
  kit: null,
  back: ({ phone }) => (
    <g data-fx="foe" transform={`translate(${HERO_AT[phone ? 'phone' : 'wide'].foe} ${GROUND})`}>
      <Sprite sprite={CRITTER} width={16} height={12} />
    </g>
  ),
  bind: (stage, { phone }) => {
    const foe = fx(stage, 'foe')
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (p) => {
      // it hops off as the page moves on, up and out of the room
      const off = ramp(p, 0.15, 0.6)
      transformTo(foe, `translate(${r1(at.foe - 160 * off)} ${r1(GROUND - 120 * Math.sin(Math.PI * Math.min(1, off * 1.2)))})`)
      fadeTo(foe, 1 - ramp(p, 0.45, 0.6))
      return walker(at.him, 'stand', phone ? 1.6 * PX : 1.9 * PX)
    }
  },
}

// ---------------------------------------------------------------- the sections

// About: the fight. The critter walks up to FOE; he steps in and strikes at HIT.
const ABOUT = { from: 330, foe: 170, hit: 0.3 }

const about = stopsScene({
  zone: 'ruins',
  kit: null,
  stop: (i) => (
    <>
      <g data-fx={`coin-${i}`} opacity={0} transform={`translate(${ABOUT.foe} 0)`}>
        <Coin />
      </g>
      <g data-fx={`foe-${i}`} transform={`translate(${ABOUT.from} 0)`}>
        <Sprite sprite={CRITTER} width={16} height={12} />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, frame: 'standR', ahead: 0 },
    { at: 0.2, frame: 'stepB', ahead: 40 },
    { at: ABOUT.hit, frame: 'strike', ahead: 50 },
    { at: 0.45, frame: 'strike', ahead: 50 },
    { at: 0.6, frame: 'stepA', ahead: 0 },
    { at: 0.62, frame: 'standR', ahead: 0 },
  ]),
  push: (t) => bell(t, ABOUT.hit + 0.03),
  reply: (stage, { count }) => {
    const foes = nodes(stage, 'foe', count)
    const coins = nodes(stage, 'coin', count)
    return (played) =>
      foes.forEach((foe, i) => {
        const t = played(i)
        translateTo(foe, lerp(ABOUT.from, ABOUT.foe, ramp(t, 0, 0.25)), -hop(ramp(t, ABOUT.hit, ABOUT.hit + 0.1), 20))
        struck(foe, t, ABOUT.hit)
        const fall = ramp(t, 0.5, 0.65)
        translateTo(coins[i], ABOUT.foe, drop(fall, 120) - 120)
        fadeTo(coins[i], fall > 0 ? 1 : 0)
      })
  },
})

// Work: the talk. The villager waits at FOLK, the lamp of their door at LAMP; the balloon's dots come one
// by one, then the lamp lights.
const WORK = { folk: 180, lamp: 270, lit: 0.7 }

const work = stopsScene({
  zone: 'snow',
  kit: 'engineer',
  stop: (i) => (
    <>
      <g transform={`translate(${WORK.lamp} 0)`}>
        <Swap name="lamp" i={i} first={<Lantern lit={false} />} second={<Lantern lit />} />
      </g>
      <g data-fx={`folk-${i}`} transform={`translate(${WORK.folk} 0)`}>
        <Sprite sprite={VILLAGER} width={12} height={20} />
      </g>
      <g data-fx={`balloon-${i}`} opacity={0} transform={`translate(${WORK.folk} ${-24 * U})`}>
        <Balloon />
        {[0, 1, 2].map((d) => (
          <rect key={d} data-fx={`dot-${i}-${d}`} x={(-6 + d * 5) * U} y={-5 * U} width={2 * U} height={2 * U} fill={RPG.border} opacity={0} />
        ))}
      </g>
    </>
  ),
  move: keyed([
    { at: 0, frame: 'standR', ahead: 0 },
    { at: 0.15, frame: 'stepA', ahead: 30 },
    { at: 0.17, frame: 'standR', ahead: 30 },
  ]),
  reply: (stage, { count }) => {
    const stops = nodes(stage, 'folk', count).map((folk, i) => ({
      folk,
      lamp: fx(stage, `lamp-${i}`),
      balloon: fx(stage, `balloon-${i}`),
      dots: [0, 1, 2].map((d) => fx(stage, `dot-${i}-${d}`)),
    }))
    return (played) =>
      stops.forEach(({ folk, lamp, balloon, dots }, i) => {
        const t = played(i)
        fadeTo(balloon, t >= 0.2 && t < 0.65 ? 1 : 0)
        dots.forEach((dot, d) => fadeTo(dot, t >= 0.25 + d * 0.1 ? 1 : 0))
        // the villager nods its answer
        translateTo(folk, WORK.folk, -hop(ramp(t, 0.55, 0.65), 16))
        swap(lamp, t >= WORK.lit)
      })
  },
})

// Tech: the chest. He steps up and kneels; the lid swings up, the item rises over it.
const TECH = { chest: 170, open: 0.35, rise: [0.45, 0.7] as const }

const tech = stopsScene({
  zone: 'cave',
  kit: 'engineer',
  stop: (i) => (
    <g transform={`translate(${TECH.chest} 0)`}>
      <Chest />
      <g data-fx={`lid-${i}`} transform={`translate(0 ${-10 * U})`}>
        <ChestLid />
      </g>
      <g data-fx={`item-${i}`} opacity={0}>
        <Gem />
        <Sparkle y={-10} />
      </g>
    </g>
  ),
  move: keyed([
    { at: 0, frame: 'standR', ahead: 0 },
    { at: 0.15, frame: 'stepA', ahead: 50 },
    { at: 0.2, frame: 'kneel', ahead: 50 },
    { at: 0.7, frame: 'kneel', ahead: 50 },
    { at: 0.72, frame: 'standR', ahead: 50 },
  ]),
  reply: (stage, { count }) => {
    const stops = nodes(stage, 'lid', count).map((lid, i) => ({ lid, item: fx(stage, `item-${i}`) }))
    return (played) =>
      stops.forEach(({ lid, item }, i) => {
        const t = played(i)
        const open = ramp(t, TECH.open, TECH.open + 0.1)
        transformTo(lid, `translate(${r1(-8 * U)} ${r1(-10 * U - hop(open, 30))}) rotate(${r1(-100 * open)}) translate(${r1(8 * U)} 0)`)
        const rise = ramp(t, TECH.rise[0], TECH.rise[1])
        translateTo(item, 0, -10 * U - 130 * rise)
        fadeTo(item, rise > 0 ? 1 : 0)
      })
  },
})

// Services: the push. The block slides one block onto the switch, then the bridge slides out over the lava.
const BLOCK = 12 * U
const SERVICES = { block: 60, lava: [250, 420] as const, pushed: 0.55, bridge: [0.62, 0.9] as const }

const services = stopsScene({
  zone: 'volcano',
  kit: 'engineer',
  stop: (i) => (
    <>
      <rect x={SERVICES.lava[0]} y={-4} width={SERVICES.lava[1] - SERVICES.lava[0]} height={60} fill={RPG.lava} />
      <rect x={SERVICES.lava[0]} y={10} width={SERVICES.lava[1] - SERVICES.lava[0]} height={12} fill={RPG.lavaCore} />
      <g data-fx={`bridge-${i}`} transform={`translate(${SERVICES.lava[0]} 0) scale(0 1)`}>
        <rect y={-14} width={SERVICES.lava[1] - SERVICES.lava[0]} height={22} fill={RPG.wood} />
        <rect y={-14} width={SERVICES.lava[1] - SERVICES.lava[0]} height={5} fill={RPG.woodDark} />
        {[0, 40, 80, 120, 160].map((x) => (
          <rect key={x} x={x} y={-14} width={4} height={22} fill={RPG.woodDark} />
        ))}
      </g>
      <g transform={`translate(${SERVICES.block + BLOCK} 0)`}>
        <Swap name="switch" i={i} first={<FloorSwitch />} second={<g transform={`translate(0 ${U})`}><FloorSwitch /></g>} />
      </g>
      <g data-fx={`block-${i}`} transform={`translate(${SERVICES.block} 0)`}>
        <Block />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, frame: 'standR', ahead: 0 },
    { at: 0.12, frame: 'push', ahead: 0 },
    { at: SERVICES.pushed, frame: 'push', ahead: BLOCK },
    { at: SERVICES.pushed + 0.03, frame: 'standR', ahead: BLOCK },
  ]),
  reply: (stage, { count }) => {
    const stops = nodes(stage, 'block', count).map((block, i) => ({ block, bridge: fx(stage, `bridge-${i}`), floorSwitch: fx(stage, `switch-${i}`) }))
    return (played) =>
      stops.forEach(({ block, bridge, floorSwitch }, i) => {
        const t = played(i)
        translateTo(block, SERVICES.block + BLOCK * ramp(t, 0.12, SERVICES.pushed), 0)
        swap(floorSwitch, t >= SERVICES.pushed)
        transformTo(bridge, `translate(${SERVICES.lava[0]} 0) scale(${ramp(t, SERVICES.bridge[0], SERVICES.bridge[1]).toFixed(3)} 1)`)
      })
  },
})

// Projects: the cast. The ring of light gathers at his raised hand, flies to the rune stone, the rune lights
// and the spikes before it sink.
const PROJECTS = { spikes: 120, rune: 300, hand: { x: 50, y: -200 }, gather: [0.12, 0.3] as const, land: 0.45 }

const projects = stopsScene({
  zone: 'volcano',
  kit: 'engineer',
  stop: (i) => (
    <>
      <g transform={`translate(${PROJECTS.rune} 0)`}>
        <Swap name="rune" i={i} first={<RuneStone lit={false} />} second={<RuneStone lit />} />
      </g>
      <g data-fx={`spikes-${i}`} transform={`translate(${PROJECTS.spikes} 0)`}>
        <Spikes />
      </g>
      <g data-fx={`orb-${i}`} opacity={0}>
        <Orb />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, frame: 'standR', ahead: 0 },
    { at: PROJECTS.gather[0], frame: 'cast', ahead: 0 },
    { at: 0.65, frame: 'cast', ahead: 0 },
    { at: 0.67, frame: 'standR', ahead: 0 },
  ]),
  push: (t) => bell(t, PROJECTS.land),
  reply: (stage, { count }) => {
    const stops = nodes(stage, 'orb', count).map((orb, i) => ({ orb, rune: fx(stage, `rune-${i}`), spikes: fx(stage, `spikes-${i}`) }))
    return (played) =>
      stops.forEach(({ orb, rune, spikes }, i) => {
        const t = played(i)
        const grow = ramp(t, PROJECTS.gather[0], PROJECTS.gather[1])
        const fly = ramp(t, PROJECTS.gather[1], PROJECTS.land)
        const x = lerp(PROJECTS.hand.x, PROJECTS.rune, fly)
        const y = lerp(PROJECTS.hand.y, -16 * U, fly) - hop(fly, 40)
        transformTo(orb, `translate(${r1(x)} ${r1(y)}) scale(${(0.3 + 0.7 * grow).toFixed(2)})`)
        fadeTo(orb, grow > 0 && t < PROJECTS.land ? 1 : 0)
        swap(rune, t >= PROJECTS.land)
        const sink = ramp(t, PROJECTS.land + 0.05, PROJECTS.land + 0.25)
        translateTo(spikes, PROJECTS.spikes, 8 * U * sink)
        fadeTo(spikes, 1 - sink)
      })
  },
})

// Ventures: the shop. He steps up to the stall, a coin goes across, the keeper bows and the sign lights.
const VENTURES = { stall: 150, keeper: 240, coin: [0.3, 0.45] as const, bow: 0.5, lit: 0.62 }

const ventures = stopsScene({
  zone: 'town',
  kit: 'engineer',
  stop: (i) => (
    <>
      <g data-fx={`keeper-${i}`} transform={`translate(${VENTURES.keeper} ${-6 * U})`}>
        <Sprite sprite={KEEPER} width={12} height={20} />
      </g>
      <g transform={`translate(${VENTURES.stall} 0)`}>
        <Swap name="stall" i={i} first={<Stall lit={false} />} second={<Stall lit />} />
      </g>
      <g data-fx={`pay-${i}`} opacity={0}>
        <Coin />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, frame: 'standR', ahead: 0 },
    { at: 0.1, frame: 'stepA', ahead: 25 },
    { at: 0.2, frame: 'stepB', ahead: 50 },
    { at: VENTURES.coin[0], frame: 'strike', ahead: 50 },
    { at: VENTURES.coin[1], frame: 'strike', ahead: 50 },
    { at: VENTURES.coin[1] + 0.02, frame: 'standR', ahead: 50 },
  ]),
  reply: (stage, { count }) => {
    const stops = nodes(stage, 'keeper', count).map((keeper, i) => ({ keeper, stall: fx(stage, `stall-${i}`), coin: fx(stage, `pay-${i}`) }))
    return (played) =>
      stops.forEach(({ keeper, stall, coin }, i) => {
        const t = played(i)
        const across = ramp(t, VENTURES.coin[0], VENTURES.coin[1])
        translateTo(coin, lerp(130, VENTURES.stall + 13 * U, across), lerp(-120, -14 * U, across) - hop(across, 50))
        fadeTo(coin, across > 0 ? 1 : 0)
        // the bow: the keeper dips once and stands back up
        const bow = hop(ramp(t, VENTURES.bow, VENTURES.bow + 0.12), 1)
        transformTo(keeper, `translate(${VENTURES.keeper} ${r1(-6 * U)}) scale(1 ${(1 - 0.15 * bow).toFixed(3)})`)
        swap(stall, t >= VENTURES.lit)
      })
  },
})

// Bands: the party joins. Each bandmate walks in from ahead of him and falls in behind him, one place
// further back than the last, with a chime of light where they stop.
const BANDS = { from: 360, gap: 70, walk: [0.1, 0.7] as const, chime: [0.7, 0.9] as const }

const slotOf = (i: number): number => -BANDS.gap * (i + 1)

const bands = stopsScene({
  zone: 'cave',
  kit: 'drummer',
  stop: () => null,
  company: (layout) => (
    <g transform={`translate(${holdOf(layout)} ${GROUND})`}>
      {Array.from({ length: Math.max(1, layout.count) }, (_, i) => (
        <g key={i} data-fx={`mate-${i}`} opacity={0} transform={`translate(${BANDS.from} 0)`}>
          <Sprite sprite={BANDMATES[i % BANDMATES.length]} width={12} height={20} />
          <rect data-fx={`chime-${i}`} x={-12 * U} y={-24 * U} width={24 * U} height={26 * U} fill="none" stroke={RPG.gold} strokeWidth={U} opacity={0} />
        </g>
      ))}
    </g>
  ),
  move: () => STAND,
  reply: (stage, { count }) => {
    const mates = nodes(stage, 'mate', count).map((mate, i) => ({ mate, chime: fx(stage, `chime-${i}`) }))
    return (played) =>
      mates.forEach(({ mate, chime }, i) => {
        const t = played(i)
        const walk = ramp(t, BANDS.walk[0], BANDS.walk[1])
        const x = lerp(BANDS.from, slotOf(i), walk)
        // a two pixel bob on each step while they walk
        const bob = walk > 0 && walk < 1 && Math.floor(x / 40) % 2 === 0 ? 2 * U : 0
        translateTo(mate, x, -bob)
        fadeTo(mate, t > 0 ? 1 : 0)
        const chimed = ramp(t, BANDS.chime[0], BANDS.chime[1])
        fadeTo(chime, chimed > 0 && chimed < 1 ? 1 - chimed : 0)
      })
  },
})

// Muay Thai: guard, a knee that knocks the critter back, then the kick, and it flashes and fades; the arena
// torch flares.
const MUAY = { foe: 200, knee: 0.38, kick: 0.62, torch: 320 }

const muayThai = stopsScene({
  zone: 'volcano',
  kit: 'fighter',
  stop: (i) => (
    <>
      <g transform={`translate(${MUAY.torch} 0)`}>
        <Swap name="torch" i={i} first={<Torch flare={false} />} second={<Torch flare />} />
      </g>
      <g data-fx={`foe-${i}`} transform={`translate(${MUAY.foe} 0)`}>
        <Sprite sprite={SPARRER} width={16} height={12} />
      </g>
    </>
  ),
  move: keyed([
    { at: 0, frame: 'actA', ahead: 0 },
    { at: 0.15, frame: 'actA', ahead: 0 },
    { at: 0.28, frame: 'stepA', ahead: 50 },
    { at: 0.45, frame: 'knee', ahead: 80, arc: 40 },
    { at: 0.52, frame: 'standR', ahead: 80 },
    { at: 0.72, frame: 'kick', ahead: 90 },
    { at: 0.74, frame: 'standR', ahead: 90 },
  ]),
  push: (t) => bell(t, MUAY.kick + 0.03),
  reply: (stage, { count }) => {
    const stops = nodes(stage, 'foe', count).map((foe, i) => ({ foe, torch: fx(stage, `torch-${i}`) }))
    return (played) =>
      stops.forEach(({ foe, torch }, i) => {
        const t = played(i)
        const back = ramp(t, MUAY.knee, MUAY.knee + 0.08)
        translateTo(foe, MUAY.foe + 30 * back, -hop(back, 30))
        struck(foe, t, MUAY.kick)
        swap(torch, t >= 0.85)
      })
  },
})

// ---------------------------------------------------------------- Contact: the save point

const SAVE_X = 90

const contact: SceneDef = {
  zone: 'ruins',
  kit: null,
  back: ({ cx }) => (
    <>
      <g transform={`translate(${r1(cx + SAVE_X)} ${GROUND})`}>
        <g data-fx="save-glow" opacity={0.3}>
          <Px>
            <rect x={-12} y={-4} width={24} height={4} fill={RPG.runeGlow} />
            <rect x={-8} y={-6} width={16} height={2} fill={RPG.runeGlow} />
          </Px>
        </g>
        <Px>
          <rect x={-10} y={-2} width={20} height={1} fill={RPG.runeCore} />
          <rect x={8} y={-14} width={2} height={12} fill={RPG.woodDark} />
          <rect x={4} y={-17} width={10} height={4} fill={RPG.border} />
          <rect x={8} y={-17} width={2} height={4} fill={RPG.borderShade} />
        </Px>
      </g>
      <rect data-fx="save-dim" x={-200} y={0} width={1840} height={810} fill={RPG.void} opacity={0} />
    </>
  ),
  bind: (stage, { cx }) => {
    const glow = fx(stage, 'save-glow')
    const dim = fx(stage, 'save-dim')
    return (p) => {
      const there = ramp(p, 0.15, 0.35)
      const x = lerp(cx - 420, cx + SAVE_X - 70, there)
      // he kneels, the screen dims and comes back up, and the save point glows steady
      fadeTo(dim, 0.6 * bell(p, 0.42, 0.05))
      fadeTo(glow, 0.3 + 0.7 * ramp(p, 0.42, 0.47))
      const frame: Frame = there >= 1 ? (p >= 0.37 ? 'kneel' : 'standR') : there > 0 ? stepOf(x) : 'standR'
      return walker(x, frame)
    }
  },
}

const SCENE_DEFS: Record<SceneId, SceneDef> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

export interface Scene {
  id: SceneId
  def: SceneDef
  layout: Layout
  /** His kit here: the scene's own, or the profession the page shows. */
  kit: Profession
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

type RecordWords = Pick<Labels, 'record' | 'years'>

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: propLayout(items, BAND[phone ? 'phone' : 'wide'], phone), kit: def.kit ?? profession, slot }
}

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, highlights: number, labels: RecordWords): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, highlights), profession, phone)),
  sceneOf('contact', null, NO_ITEMS, profession, phone),
]
