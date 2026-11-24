import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { hop } from '@/lib/motion/arc'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { clamp01, fadeTo, fx, lerp, r1, transformTo, translateTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { KEEPER, type PixelSprite } from './npcs'
import { PixelArt, type Frame } from './walker'
import { RPG } from './palette'
import { GROUND, PX, type Zone } from './zones'

// Each part of the page as one room of the underground the world comes from, in its order of places: the
// violet ruins, the snow forest, the dark glowing cave, the hot lab country, a town, the battle screen and
// the last save star. Each room has its props at fixed places and a short script of one to three different
// actions the shared scene player moves through (src/lib/scroll/player.ts); every frame is a function of the
// playhead alone, so an action reads the same played backward, and the end frame is the one reduced motion
// shows. The hero: he gets up from the flower bed under the light and the save star sparkles in the doorway.
// About: he presses the two marked wall switches and the spikes across the exit sink. Work: he steps over the
// floor tiles, each turning from a cross to a ring, and the spikes at the gap retract. Tech: he pushes a bud
// into the water, the others come up along the line and bloom into a bridge, and he crosses it, the glowing
// plants lighting as he passes. Services: the belt carries him to the beam gate, he stands still through the
// blue beam and walks on through the orange one. Projects: the room cuts to the battle screen, his heart
// dodges a wave of pellets in the box, then he talks the monster down and spares it. Ventures: he buys at the
// counter. Bands: he plays the piano and a hidden door opens. Muay Thai: on the battle screen the attack bar
// stops on its centre and he lands a knee and a kick on the sparring dummy. Contact: he touches the last save
// star and the save box opens.
//
// He is the pixel sprite (walker.tsx) and his frames swap the way sprite frames do. Nothing here copies the
// game: the monster, the dummy, the keeper and every prop are drawn for this page.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his feet are, his size, his sprite frame and how visible he is. */
export type WalkerState = FigureState<Frame>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The scene's actions, each its length in ms. */
  script: SceneScript
  /** The room's props and cast, drawn in the figure layer behind him. */
  back: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<Frame>
}

// The middle of the band the scenes play in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [880, 1300], phone: [580, 860] }

/** His size: a sprite pixel is 1.4 grid pixels, so he stands about a quarter of the screen. */
const K = 1.4 * PX

/** One grid pixel of a prop's art on the canvas. */
const U = K

/** Before the section arrives a scene shows its first frame. */
const START: Playhead = { action: 0, t: 0, done: false }

/** How far action `i` has played at `play`: all of it once a later one plays, `t` while it plays, none before. */
const share = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action === i ? t : 0)

/** A bump from 0 up to 1 and back over [from, to] of t. */
const bell = (t: number, from: number, to: number): number => Math.sin(Math.PI * ramp(t, from, to))

/** A place in the room `dx` from where he starts: right of the text on a wide screen; on a phone, inside its
 *  narrower view (about x 580 to 860), the room drawn closer. */
const roomX = ({ phone }: Layout, dx: number): number => (phone ? 650 : 900) + dx * (phone ? 0.45 : 1)

const walker = (x: number, frame: Frame, opacity = 1, k = K, y = GROUND): WalkerState => ({ x, y, k, pose: frame, opacity })

/** His step frame at `x` of his walk. */
const stepOf = (x: number): Frame => (Math.floor(x / 40) % 2 === 0 ? 'stepA' : 'stepB')

/** Him walking from `from` to `to` over `t`: his step frames on the way, standing right at either end. */
const walk = (from: number, to: number, t: number): WalkerState => {
  const x = lerp(from, to, t)
  return walker(x, t > 0 && t < 1 ? stepOf(x) : 'standR')
}

/** A cast sprite drawn on the grid round its foot (its bottom middle). */
const Sprite = ({ sprite, width, height }: { sprite: PixelSprite; width: number; height: number }) => (
  <g transform={`scale(${U})`}>
    <PixelArt sprite={sprite} x={-width / 2} y={-height} />
  </g>
)

/** A shape on the grid round its foot, blown up to the canvas. */
const Px = ({ children }: { children: ReactNode }) => <g transform={`scale(${U})`}>{children}</g>

/** Two looks of one thing: the first shown, the second hidden until `swap` turns them. */
const Swap = ({ name, first, second }: { name: string; first: ReactNode; second: ReactNode }) => (
  <g data-fx={name}>
    <g visibility="visible">{first}</g>
    <g visibility="hidden">{second}</g>
  </g>
)

const swap = (node: Element | null, second: boolean): void => {
  node?.children[0]?.setAttribute('visibility', second ? 'hidden' : 'visible')
  node?.children[1]?.setAttribute('visibility', second ? 'visible' : 'hidden')
}

// ---------------------------------------------------------------- the props

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

const Gem = () => (
  <Px>
    <path d="M-4 -6 L-2 -9 H2 L4 -6 L0 0 Z" fill={RPG.crystal} />
    <rect x={-2} y={-8} width={1} height={2} fill={RPG.border} />
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

/** The save star: a four point star of light, its white core and a ring of glow. */
const SaveStar = () => (
  <Px>
    <rect x={-7} y={-19} width={14} height={14} fill={RPG.gold} opacity={0.2} />
    <path d="M0 -20 L2 -14 L8 -12 L2 -10 L0 -4 L-2 -10 L-8 -12 L-2 -14 Z" fill={RPG.gold} />
    <rect x={-1} y={-13} width={2} height={2} fill={RPG.border} />
  </Px>
)

/** The bed of yellow flowers he wakes on, 40 grid pixels wide. */
const FlowerBed = () => (
  <Px>
    <rect x={-20} y={-2} width={40} height={2} fill={RPG.pine} />
    {[-17, -11, -5, 1, 7, 13, 17].map((x, i) => (
      <g key={x}>
        <rect x={x} y={-4 - (i % 2)} width={1} height={3} fill={RPG.coatGreen} />
        <rect x={x - 1} y={-6 - (i % 2)} width={3} height={2} fill={RPG.gold} />
      </g>
    ))}
  </Px>
)

/** A wall switch: a plate on the wall at shoulder height, marked when it is the one to press. */
const WallSwitch = ({ marked }: { marked: boolean }) => (
  <Px>
    {marked && <rect x={-4} y={-25} width={8} height={9} fill={RPG.gold} opacity={0.35} />}
    <rect x={-3} y={-24} width={6} height={7} fill={RPG.stoneDark} />
    <rect x={-2} y={-23} width={4} height={2} fill={marked ? RPG.gold : RPG.stoneLit} />
  </Px>
)

const Pillar = () => (
  <Px>
    <rect x={-4} y={-40} width={8} height={40} fill={RPG.stoneLit} />
    <rect x={-5} y={-42} width={10} height={3} fill={RPG.stone} />
    <rect x={3} y={-40} width={1} height={40} fill={RPG.stoneDark} />
  </Px>
)

/** A floor tile with its mark: a cross before he steps on it, a ring after. */
const Tile = ({ ring }: { ring: boolean }) => (
  <Px>
    <rect x={-4} y={-1} width={8} height={2} fill={RPG.snowShade} />
    {ring ? <rect x={-2} y={-5} width={4} height={4} fill="none" stroke={RPG.gold} strokeWidth={1} /> : <path d="M-2 -5 L2 -1 M2 -5 L-2 -1" stroke={RPG.border} strokeWidth={1} />}
  </Px>
)

/** A closed bud on the water, and the pad it blooms into. */
const Bud = () => (
  <Px>
    <rect x={-3} y={-6} width={6} height={6} fill={RPG.coatGreen} />
    <rect x={-1} y={-8} width={2} height={2} fill={RPG.crystal} />
  </Px>
)

const Pad = () => (
  <Px>
    <rect x={-6} y={-2} width={12} height={2} fill={RPG.coatGreen} />
    <rect x={-2} y={-4} width={4} height={2} fill={RPG.crystal} />
  </Px>
)

/** A glowing plant of the cave: a tall stem and its lamp head, lit or dark. */
const GlowPlant = ({ lit }: { lit: boolean }) => (
  <Px>
    {lit && <rect x={-5} y={-36} width={10} height={10} fill={RPG.crystal} opacity={0.3} />}
    <rect x={0} y={-28} width={1} height={28} fill={RPG.pine} />
    <rect x={-2} y={-34} width={5} height={6} fill={lit ? RPG.crystal : RPG.caveLine} />
  </Px>
)

/** The beam gate: two posts and the curtain of light between them, blue or orange. */
const Beam = ({ fill }: { fill: string }) => (
  <Px>
    <rect x={-2} y={-40} width={4} height={40} fill={fill} opacity={0.75} />
    <rect x={-1} y={-40} width={2} height={40} fill={RPG.border} opacity={0.6} />
  </Px>
)

const Piano = () => (
  <Px>
    <rect x={0} y={-18} width={24} height={12} fill={RPG.night} stroke={RPG.border} strokeWidth={0.5} />
    <rect x={0} y={-8} width={24} height={2} fill={RPG.border} />
    {[3, 7, 11, 15, 19].map((x) => (
      <rect key={x} x={x} y={-8} width={1} height={2} fill={RPG.void} />
    ))}
    <rect x={1} y={-6} width={2} height={6} fill={RPG.night} />
    <rect x={21} y={-6} width={2} height={6} fill={RPG.night} />
  </Px>
)

const Note = () => (
  <Px>
    <rect x={0} y={-6} width={1} height={6} fill={RPG.border} />
    <rect x={-2} y={-1} width={3} height={2} fill={RPG.border} />
    <rect x={1} y={-6} width={2} height={1} fill={RPG.border} />
  </Px>
)

// ---------------------------------------------------------------- the battle screen

/** The battle screen's box round its middle `bx`: half its width and its top and bottom; lower on a phone,
 *  whose view starts at y 360, so the monster and the dummy over it stay in view. */
const boxOf = ({ phone, cx }: Layout) => (phone ? { bx: cx, w: 120, top: 560, bottom: 670 } : { bx: cx, w: 160, top: 420, bottom: 570 })

const BUTTONS = ['fight', 'act', 'item', 'mercy'] as const

/** A command button's icon, plain shapes: a blade, a speech mark, a bag, a cross. */
const ICONS: Record<(typeof BUTTONS)[number], ReactNode> = {
  fight: <path d="M-1 -6 h2 v8 h2 v2 h-6 v-2 h2 Z" />,
  act: <path d="M-5 -5 h10 v7 h-6 l-3 3 v-3 h-1 Z" />,
  item: <path d="M-4 -3 h8 v7 h-8 Z M-2 -5 h4 v2 h-4 Z" />,
  mercy: <path d="M-5 -5 L5 5 M5 -5 L-5 5" strokeWidth={2} />,
}

/** The black battle screen with its white bordered box and the four command buttons under it. */
function BattleScreen({ layout, children }: { layout: Layout; children?: ReactNode }) {
  const { bx, w, top, bottom } = boxOf(layout)
  const gap = (2 * w) / BUTTONS.length
  return (
    <g data-fx="battle">
      <rect x={-200} y={0} width={1840} height={810} fill={RPG.void} />
      <rect x={bx - w} y={top} width={2 * w} height={bottom - top} fill={RPG.void} stroke={RPG.border} strokeWidth={6} />
      {BUTTONS.map((name, i) => (
        <g key={name} transform={`translate(${r1(bx - w + gap * (i + 0.5))} ${bottom + 70})`}>
          <rect data-fx={`button-${name}`} x={-gap / 2 + 8} y={-26} width={gap - 16} height={52} fill={RPG.void} stroke={RPG.wraps} strokeWidth={4} />
          <g transform="scale(3)" fill={RPG.wraps} stroke={RPG.wraps}>
            {ICONS[name]}
          </g>
        </g>
      ))}
      {children}
    </g>
  )
}

/** The monster of the encounter, drawn for this page in flat white line art: a round blob with a wavy edge and two eyes. */
const Monster = () => (
  <g fill="none" strokeWidth={6} strokeLinejoin="round">
    <path d="M-60 0 Q-70 -70 0 -90 Q70 -70 60 0 Q40 -12 20 0 Q0 -12 -20 0 Q-40 -12 -60 0 Z" fill={RPG.void} />
    <rect x={-26} y={-58} width={12} height={16} fill={RPG.border} stroke="none" />
    <rect x={14} y={-58} width={12} height={16} fill={RPG.border} stroke="none" />
  </g>
)

/** The sparring dummy, drawn for this page in flat white line art: a post, a stuffed body and a crossbar. */
const Dummy = () => (
  <g fill={RPG.void} stroke={RPG.border} strokeWidth={6}>
    <path d="M0 0 V-150" />
    <path d="M-50 -110 H50" />
    <rect x={-30} y={-140} width={60} height={80} rx={14} />
    <circle cx={0} cy={-168} r={20} />
  </g>
)

/** His heart in the battle box. */
const Heart = () => (
  <path d="M0 10 L-10 0 Q-14 -8 -7 -10 Q-2 -10 0 -5 Q2 -10 7 -10 Q14 -8 10 0 Z" fill={RPG.red} />
)

const PELLETS = 6

// ---------------------------------------------------------------- the scenes

// The hero, the ruins' entrance: he sits up on the flower bed under the light and stands, then turns to the
// doorway, where the save star sparkles.
const HERO = { wide: { him: 1060, star: 1250 }, phone: { him: 690, star: 810 } }
const heroK = ({ phone }: Layout): number => (phone ? 1.6 : 1.9) * PX

const hero: SceneDef = {
  zone: 'ruins',
  kit: null,
  script: [1600, 1400],
  back: ({ phone }) => {
    const at = HERO[phone ? 'phone' : 'wide']
    return (
      <>
        <rect x={at.him - 90} y={0} width={180} height={GROUND} fill={RPG.gold} opacity={0.12} />
        <g transform={`translate(${at.him} ${GROUND})`}>
          <FlowerBed />
        </g>
        <g data-fx="star" opacity={0} transform={`translate(${at.star} ${GROUND})`}>
          <SaveStar />
        </g>
      </>
    )
  },
  bind: (stage, layout) => {
    const star = fx(stage, 'star')
    const at = HERO[layout.phone ? 'phone' : 'wide']
    return (_p, _f, play = START) => {
      const up = share(play, 0)
      const shown = share(play, 1)
      fadeTo(star, ramp(shown, 0.2, 0.6))
      transformTo(star, `translate(${at.star} ${GROUND}) scale(${(0.6 + 0.4 * ramp(shown, 0.2, 0.6) + 0.15 * bell(shown, 0.6, 1)).toFixed(3)})`)
      const frame: Frame = up < 0.5 ? 'kneel' : shown > 0.1 ? 'standR' : 'stand'
      return walker(at.him, frame, 1, heroK(layout))
    }
  },
}

// About, the ruins' switch room: three pillars, a switch beside each, two of them marked, and spikes across the
// exit. He walks to the first marked switch and presses it, then to the second, and the spikes sink one row
// after another.
const ABOUT = { pillars: [40, 150, 260] as const, marked: [0, 1] as const, reach: 34, spikes: 330 }

const about: SceneDef = {
  zone: 'ruins',
  kit: null,
  script: [1600, 1800],
  back: (layout) => (
    <>
      {ABOUT.pillars.map((dx, i) => (
        <g key={dx}>
          <g transform={`translate(${r1(roomX(layout, dx))} ${GROUND})`}>
            <Pillar />
          </g>
          <g data-fx={`switch-${i}`} transform={`translate(${r1(roomX(layout, dx) + 40)} ${GROUND})`}>
            <WallSwitch marked={i < ABOUT.marked.length} />
          </g>
        </g>
      ))}
      {[0, 1].map((i) => (
        <g key={i} data-fx={`spikes-${i}`} transform={`translate(${r1(roomX(layout, ABOUT.spikes) + i * 60)} ${GROUND})`}>
          <Spikes />
        </g>
      ))}
    </>
  ),
  bind: (stage, layout) => {
    const switches = ABOUT.marked.map((i) => ({ node: fx(stage, `switch-${i}`), x: roomX(layout, ABOUT.pillars[i]) + 40 }))
    const spikes = [0, 1].map((i) => ({ node: fx(stage, `spikes-${i}`), x: roomX(layout, ABOUT.spikes) + i * 60 }))
    const start = roomX(layout, -40)
    return (_p, _f, play = START) => {
      const first = share(play, 0)
      const second = share(play, 1)
      const pressed = [ramp(first, 0.65, 0.8), ramp(second, 0.45, 0.6)]
      switches.forEach(({ node, x }, i) => translateTo(node, x, GROUND + 2 * U * pressed[i]))
      spikes.forEach(({ node, x }, i) => {
        const sink = ramp(second, 0.6 + 0.15 * i, 0.8 + 0.15 * i)
        translateTo(node, x, GROUND + 8 * U * sink)
        fadeTo(node, 1 - sink)
      })
      const [one, two] = switches.map(({ x }) => x - ABOUT.reach)
      if (play.action === 0) return first < 0.6 ? walk(start, one, ramp(first, 0, 0.6)) : walker(one, first < 0.9 ? 'cast' : 'standR')
      return second < 0.4 ? walk(one, two, ramp(second, 0, 0.4)) : walker(two, second < 0.7 ? 'cast' : 'standR')
    }
  },
}

// Work, the snow forest: four floor tiles marked with crosses before a spiked gap. He steps over them, each
// turning to a ring under his foot, then the last chimes and the spikes at the gap retract.
const WORK = { tiles: [40, 100, 160, 220] as const, spikes: 320, stop: 225 }

const work: SceneDef = {
  zone: 'snow',
  kit: 'engineer',
  script: [2400, 1400],
  back: (layout) => (
    <>
      {WORK.tiles.map((dx, i) => (
        <g key={dx} transform={`translate(${r1(roomX(layout, dx))} ${GROUND})`}>
          <Swap name={`tile-${i}`} first={<Tile ring={false} />} second={<Tile ring />} />
        </g>
      ))}
      <g data-fx="chime" opacity={0} transform={`translate(${r1(roomX(layout, 130))} ${GROUND - 60})`}>
        <Sparkle y={0} />
      </g>
      <g data-fx="spikes" transform={`translate(${r1(roomX(layout, WORK.spikes))} ${GROUND})`}>
        <Spikes />
      </g>
    </>
  ),
  bind: (stage, layout) => {
    const tiles = WORK.tiles.map((dx, i) => ({ node: fx(stage, `tile-${i}`), x: roomX(layout, dx) }))
    const chime = fx(stage, 'chime')
    const spikes = fx(stage, 'spikes')
    const spikesX = roomX(layout, WORK.spikes)
    const from = roomX(layout, -20)
    const to = roomX(layout, WORK.stop)
    return (_p, _f, play = START) => {
      const stepped = share(play, 0)
      const solved = share(play, 1)
      const him = walk(from, to, stepped)
      tiles.forEach(({ node, x }) => swap(node, him.x >= x))
      fadeTo(chime, bell(solved, 0, 0.5))
      const sink = ramp(solved, 0.3, 0.8)
      translateTo(spikes, spikesX, GROUND + 8 * U * sink)
      fadeTo(spikes, 1 - sink)
      return him
    }
  },
}

// Tech, the glowing cave: a stretch of dark water and a closed bud on its bank. He pushes the bud into the
// water, three more come up along the line and all bloom into pads, then he crosses on them, the glowing
// plants behind lighting as he passes.
const TECH = { water: [60, 350] as const, pads: [95, 165, 235, 305] as const, plants: [120, 220, 320] as const, bank: 40, end: 370 }

const tech: SceneDef = {
  zone: 'cave',
  kit: 'engineer',
  script: [1400, 1400, 2000],
  back: (layout) => {
    const [w0, w1] = TECH.water.map((dx) => roomX(layout, dx))
    return (
      <>
        {TECH.plants.map((dx, i) => (
          <g key={dx} transform={`translate(${r1(roomX(layout, dx))} ${GROUND - 30})`}>
            <Swap name={`plant-${i}`} first={<GlowPlant lit={false} />} second={<GlowPlant lit />} />
          </g>
        ))}
        <rect x={r1(w0)} y={GROUND - 4} width={r1(w1 - w0)} height={60} fill={RPG.caveLine} />
        <rect x={r1(w0)} y={GROUND + 8} width={r1(w1 - w0)} height={6} fill={RPG.crystal} opacity={0.35} />
        {TECH.pads.map((dx, i) => (
          <g key={dx} data-fx={`bud-${i}`} transform={`translate(${r1(roomX(layout, i === 0 ? TECH.bank : dx))} ${GROUND})`} opacity={i === 0 ? 1 : 0}>
            <Swap name={`bloom-${i}`} first={<Bud />} second={<Pad />} />
          </g>
        ))}
      </>
    )
  },
  bind: (stage, layout) => {
    const buds = TECH.pads.map((dx, i) => ({ node: fx(stage, `bud-${i}`), bloom: fx(stage, `bloom-${i}`), x: roomX(layout, dx) }))
    const plants = TECH.plants.map((dx, i) => ({ node: fx(stage, `plant-${i}`), x: roomX(layout, dx) }))
    const bank = roomX(layout, TECH.bank)
    const start = roomX(layout, -10)
    const end = roomX(layout, TECH.end)
    return (_p, _f, play = START) => {
      const pushed = share(play, 0)
      const grown = share(play, 1)
      const crossed = share(play, 2)
      const [first, ...rest] = buds
      translateTo(first.node, lerp(bank, first.x, ramp(pushed, 0.3, 0.9)), GROUND)
      rest.forEach(({ node, x }, i) => {
        const up = ramp(grown, i * 0.2, i * 0.2 + 0.3)
        translateTo(node, x, GROUND + 30 * (1 - up))
        fadeTo(node, up)
      })
      buds.forEach(({ bloom }) => swap(bloom, grown >= 0.85))
      const behind = bank - 40
      const edge = buds[0].x - 40
      const him =
        play.action === 0
          ? pushed < 0.3
            ? walk(start, behind, ramp(pushed, 0, 0.3))
            : walker(lerp(behind, edge, ramp(pushed, 0.3, 0.9)), 'push')
          : walk(edge, end, crossed)
      plants.forEach(({ node, x }) => swap(node, him.x >= x - 20))
      return him
    }
  },
}

// Services, the hot lab country: a belt and a beam gate. The belt carries him to the gate; the blue beam sweeps
// over him while he stands still, then the orange beam sweeps back while he keeps walking through it.
const SERVICES = { belt: [-20, 200] as const, gate: 220, beam: [330, 120] as const, end: 330 }

const services: SceneDef = {
  zone: 'volcano',
  kit: 'engineer',
  script: [1800, 2400],
  back: (layout) => {
    const [b0, b1] = SERVICES.belt.map((dx) => roomX(layout, dx))
    return (
      <>
        <rect x={r1(b0)} y={GROUND - 4} width={r1(b1 - b0)} height={14} fill={RPG.basaltLit} />
        <g data-fx="belt">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={r1(b0 + i * 24)} y={GROUND} width={10} height={4} fill={RPG.ash} />
          ))}
        </g>
        <g data-fx="blue" opacity={0}>
          <Beam fill={RPG.sky} />
        </g>
        <g data-fx="orange" opacity={0}>
          <Beam fill={RPG.wraps} />
        </g>
      </>
    )
  },
  bind: (stage, layout) => {
    const belt = fx(stage, 'belt')
    const blue = fx(stage, 'blue')
    const orange = fx(stage, 'orange')
    const [b0, b1] = SERVICES.belt.map((dx) => roomX(layout, dx))
    const gate = roomX(layout, SERVICES.gate)
    const [far, near] = SERVICES.beam.map((dx) => roomX(layout, dx))
    const end = roomX(layout, SERVICES.end)
    return (_p, _f, play = START) => {
      const carried = share(play, 0)
      const swept = share(play, 1)
      translateTo(belt, (carried * 96) % 24, 0)
      const blueT = ramp(swept, 0, 0.45)
      const orangeT = ramp(swept, 0.5, 1)
      translateTo(blue, lerp(far, near, blueT), GROUND)
      fadeTo(blue, blueT > 0 && blueT < 1 ? 1 : 0)
      translateTo(orange, lerp(near + 220, near, orangeT), GROUND)
      fadeTo(orange, orangeT > 0 && orangeT < 1 ? 1 : 0)
      if (play.action === 0) return walker(lerp(b0 + 20, Math.min(b1, gate), carried), 'standR')
      return swept < 0.5 ? walker(gate, 'standR') : walk(gate, end, orangeT)
    }
  },
}

// Projects, the encounter: the room flashes and cuts to the battle screen and the monster appears; his heart
// dodges a wave of pellets in the box; then ACT lights, the monster calms and its outline turns yellow, MERCY
// lights and it is spared and drifts off.
const projects: SceneDef = {
  zone: 'volcano',
  kit: 'engineer',
  script: [1400, 2000, 1600],
  back: (layout) => {
    const { bx, top } = boxOf(layout)
    return (
      <>
        <g data-fx="screen" opacity={0}>
          <BattleScreen layout={layout}>
            <g data-fx="monster" transform={`translate(${bx} ${top - 40})`} stroke={RPG.border}>
              <Monster />
            </g>
            <g data-fx="pellets">
              {Array.from({ length: PELLETS }, (_, i) => (
                <rect key={i} data-fx={`pellet-${i}`} x={-6} y={-6} width={12} height={12} fill={RPG.border} />
              ))}
            </g>
            <g data-fx="heart">
              <Heart />
            </g>
          </BattleScreen>
        </g>
        <rect data-fx="flash" x={-200} y={0} width={1840} height={810} fill={RPG.border} opacity={0} />
      </>
    )
  },
  bind: (stage, layout) => {
    const screen = fx(stage, 'screen')
    const flash = fx(stage, 'flash')
    const monster = fx(stage, 'monster')
    const heart = fx(stage, 'heart')
    const pellets = Array.from({ length: PELLETS }, (_, i) => fx(stage, `pellet-${i}`))
    const act = fx(stage, 'button-act')
    const mercy = fx(stage, 'button-mercy')
    const { bx, w, top, bottom } = boxOf(layout)
    const mid = (top + bottom) / 2
    const him = roomX(layout, 120)
    return (_p, _f, play = START) => {
      const cut = share(play, 0)
      const dodged = share(play, 1)
      const spared = share(play, 2)
      fadeTo(flash, bell(cut, 0, 0.35))
      fadeTo(screen, ramp(cut, 0.15, 0.3))
      const calmed = ramp(spared, 0.15, 0.4)
      const gone = ramp(spared, 0.6, 1)
      fadeTo(monster, ramp(cut, 0.4, 0.8) * (1 - gone))
      transformTo(monster, `translate(${bx} ${r1(top - 40 - 60 * gone + 6 * Math.sin(dodged * Math.PI * 6) * (1 - calmed))})`)
      monster?.setAttribute('stroke', calmed > 0.5 ? RPG.gold : RPG.border)
      transformTo(heart, `translate(${r1(bx + w * 0.6 * Math.sin(dodged * Math.PI * 4))} ${r1(mid + 24 * Math.sin(dodged * Math.PI * 6))})`)
      pellets.forEach((pellet, i) => {
        const fall = (dodged * 2.5 + i / PELLETS) % 1
        translateTo(pellet, bx - w + ((i + 0.5) * 2 * w) / PELLETS, lerp(top + 10, bottom - 10, fall))
        fadeTo(pellet, dodged > 0 && dodged < 1 ? 1 : 0)
      })
      act?.setAttribute('stroke', spared > 0 && spared < 0.45 ? RPG.gold : RPG.wraps)
      mercy?.setAttribute('stroke', spared >= 0.45 ? RPG.gold : RPG.wraps)
      return walker(him, 'standR', 1 - ramp(cut, 0.15, 0.3))
    }
  },
}

// Ventures, a town shop: he walks up to the counter and the keeper waves, then a coin goes across and an item
// comes back to him, the shop's sign lighting.
const VENTURES = { stall: 150, keeper: 240, stand: 110 }

const ventures: SceneDef = {
  zone: 'town',
  kit: 'engineer',
  script: [1400, 1800],
  back: (layout) => (
    <>
      <g data-fx="keeper" transform={`translate(${r1(roomX(layout, VENTURES.keeper))} ${r1(GROUND - 6 * U)})`}>
        <Sprite sprite={KEEPER} width={12} height={20} />
      </g>
      <g transform={`translate(${r1(roomX(layout, VENTURES.stall))} ${GROUND})`}>
        <Swap name="stall" first={<Stall lit={false} />} second={<Stall lit />} />
      </g>
      <g data-fx="pay" opacity={0}>
        <Coin />
      </g>
      <g data-fx="item" opacity={0}>
        <Gem />
        <Sparkle y={-10} />
      </g>
    </>
  ),
  bind: (stage, layout) => {
    const keeper = fx(stage, 'keeper')
    const stall = fx(stage, 'stall')
    const coin = fx(stage, 'pay')
    const item = fx(stage, 'item')
    const keeperX = roomX(layout, VENTURES.keeper)
    const stand = roomX(layout, VENTURES.stand)
    const from = roomX(layout, -30)
    return (_p, _f, play = START) => {
      const arrived = share(play, 0)
      const traded = share(play, 1)
      translateTo(keeper, keeperX, GROUND - 6 * U - hop(ramp(arrived, 0.6, 0.9), 14))
      const across = ramp(traded, 0, 0.4)
      translateTo(coin, lerp(stand + 20, keeperX, across), GROUND - 110 - hop(across, 50))
      fadeTo(coin, across > 0 && across < 1 ? 1 : 0)
      const back = ramp(traded, 0.45, 0.85)
      translateTo(item, lerp(keeperX, stand + 10, back), GROUND - 140 - hop(back, 50))
      fadeTo(item, back > 0 ? 1 : 0)
      swap(stall, traded >= 0.85)
      return play.action === 0 ? walk(from, stand, ramp(arrived, 0, 0.6)) : walker(stand, traded > 0.2 && traded < 0.45 ? 'strike' : 'standR')
    }
  },
}

// Bands, the cave's piano room: he walks up to the piano and plays a short phrase, notes rising from its keys,
// then a hidden door in the wall slides open, light behind it.
const BANDS = { piano: 60, door: 300, notes: 3 }

const bands: SceneDef = {
  zone: 'cave',
  kit: 'drummer',
  script: [2200, 1600],
  back: (layout) => {
    const door = roomX(layout, BANDS.door)
    return (
      <>
        <g data-fx="light" opacity={0}>
          <rect x={r1(door - 8 * U)} y={r1(GROUND - 28 * U)} width={r1(16 * U)} height={r1(28 * U)} fill={RPG.gold} opacity={0.5} />
        </g>
        <rect x={r1(door - 9 * U)} y={r1(GROUND - 29 * U)} width={r1(18 * U)} height={r1(29 * U)} fill="none" stroke={RPG.caveLine} strokeWidth={U} />
        <rect data-fx="door" x={r1(door - 8 * U)} y={r1(GROUND - 28 * U)} width={r1(16 * U)} height={r1(28 * U)} fill={RPG.caveWall} />
        <g transform={`translate(${r1(roomX(layout, BANDS.piano))} ${GROUND})`}>
          <Piano />
        </g>
        {Array.from({ length: BANDS.notes }, (_, i) => (
          <g key={i} data-fx={`note-${i}`} opacity={0}>
            <Note />
          </g>
        ))}
      </>
    )
  },
  bind: (stage, layout) => {
    const door = fx(stage, 'door')
    const light = fx(stage, 'light')
    const notes = Array.from({ length: BANDS.notes }, (_, i) => fx(stage, `note-${i}`))
    const piano = roomX(layout, BANDS.piano)
    const seat = piano - 10
    const from = roomX(layout, -60)
    return (_p, _f, play = START) => {
      const played = share(play, 0)
      const opened = share(play, 1)
      const playing = ramp(played, 0.35, 1)
      notes.forEach((note, i) => {
        const rise = clamp01((playing * 3 - i * 0.6) % 1.6)
        translateTo(note, piano + 30 + i * 40, GROUND - 12 * U - 120 * rise)
        fadeTo(note, playing > 0 && playing < 1 && rise > 0 ? 1 - rise : 0)
      })
      transformTo(door, `translate(0 ${r1(-28 * U * ramp(opened, 0.1, 0.8))})`)
      fadeTo(light, ramp(opened, 0.3, 0.9))
      if (played < 0.35) return walk(from, seat, ramp(played, 0, 0.35))
      return walker(seat, playing > 0 && playing < 1 && Math.floor(playing * 8) % 2 === 1 ? 'actB' : 'actA')
    }
  },
}

// Muay Thai, sparring on the battle screen: the attack bar's slider runs and stops on its centre, then he
// lands a knee and a kick on the dummy, which shakes under a white flash.
const muayThai: SceneDef = {
  zone: 'volcano',
  kit: 'fighter',
  script: [1400, 2000],
  back: (layout) => {
    const { bx, w, top } = boxOf(layout)
    return (
      <BattleScreen layout={layout}>
        <g data-fx="dummy" transform={`translate(${bx + 70} ${top - 10})`}>
          <Dummy />
        </g>
        <rect data-fx="hit" x={bx + 20} y={top - 190} width={100} height={180} fill={RPG.border} opacity={0} />
        <rect x={bx - w + 16} y={top + 40} width={2 * w - 32} height={60} fill={RPG.void} stroke={RPG.border} strokeWidth={4} />
        <rect x={bx - 4} y={top + 40} width={8} height={60} fill={RPG.borderShade} />
        <rect data-fx="slider" x={-5} y={top + 34} width={10} height={72} fill={RPG.border} />
      </BattleScreen>
    )
  },
  bind: (stage, layout) => {
    const dummy = fx(stage, 'dummy')
    const hit = fx(stage, 'hit')
    const slider = fx(stage, 'slider')
    const { bx, w, top } = boxOf(layout)
    const stand = bx - 90
    return (_p, _f, play = START) => {
      const aimed = share(play, 0)
      const struck = share(play, 1)
      translateTo(slider, lerp(bx - w + 20, bx, aimed), 0)
      const knee = bell(struck, 0.15, 0.45)
      const kick = bell(struck, 0.5, 0.85)
      const shake = Math.max(knee, kick)
      transformTo(dummy, `translate(${bx + 70} ${top - 10}) rotate(${r1(8 * shake + 6 * ramp(struck, 0.7, 1))})`)
      fadeTo(hit, 0.7 * Math.max(bell(struck, 0.25, 0.4), bell(struck, 0.6, 0.75)))
      const frame: Frame = struck === 0 ? 'actA' : struck < 0.45 ? 'knee' : struck < 0.9 ? 'kick' : 'standR'
      return walker(stand + 30 * Math.max(knee, kick), frame, 1, K, top - 10)
    }
  },
}

// Contact, the last room: he walks up to the save star and touches it; the save box opens over them with a
// full bar, and the star sparkles.
const SAVE_X = 140
// On a phone the star stands this far right of the middle, inside its narrower view.
const SAVE_X_PHONE = 60
const saveX = (cx: number, phone: boolean): number => cx + (phone ? SAVE_X_PHONE : SAVE_X)
// He stops this far short of the star, his raised hand at its edge.
const REACH = 110

/** The save box right over the star, clear of the contact window; on a phone, high in the middle. */
const saveBoxAt = (cx: number, phone: boolean): { x: number; y: number; size: number } => (phone ? { x: cx, y: 430, size: 0.6 } : { x: saveX(cx, false), y: 440, size: 0.55 })

const contact: SceneDef = {
  zone: 'ruins',
  kit: null,
  script: [1600, 1600],
  back: ({ cx, phone }) => (
    <>
      <g data-fx="star" transform={`translate(${r1(saveX(cx, phone))} ${GROUND})`}>
        <SaveStar />
      </g>
      <g data-fx="save" opacity={0} transform={`translate(${r1(saveBoxAt(cx, phone).x)} ${saveBoxAt(cx, phone).y}) scale(${saveBoxAt(cx, phone).size})`}>
        <rect x={-150} y={-60} width={300} height={120} fill={RPG.void} stroke={RPG.border} strokeWidth={6} />
        <rect x={-120} y={10} width={240} height={20} fill="none" stroke={RPG.border} strokeWidth={3} />
        <rect data-fx="save-bar" x={-117} y={13} width={234} height={14} fill={RPG.gold} />
        <g transform="translate(-100 -18) scale(1.2)">
          <SaveStar />
        </g>
      </g>
    </>
  ),
  bind: (stage, { cx, phone }) => {
    const star = fx(stage, 'star')
    const box = saveBoxAt(cx, phone)
    const save = fx(stage, 'save')
    const bar = fx(stage, 'save-bar')
    return (_p, _f, play = START) => {
      const there = share(play, 0)
      const touched = share(play, 1)
      const open = ramp(touched, 0.2, 0.5)
      fadeTo(save, open)
      transformTo(save, `translate(${r1(box.x)} ${box.y}) scale(${(box.size * (0.8 + 0.2 * open)).toFixed(3)})`)
      transformTo(bar, `scale(${ramp(touched, 0.45, 0.9).toFixed(3)} 1)`)
      transformTo(star, `translate(${r1(saveX(cx, phone))} ${GROUND}) scale(${(1 + 0.25 * bell(touched, 0.1, 0.6)).toFixed(3)})`)
      if (play.action === 0) return walk(cx - 300, saveX(cx, phone) - REACH, there)
      return walker(saveX(cx, phone) - REACH, touched > 0.05 && touched < 0.6 ? 'cast' : 'standR')
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
