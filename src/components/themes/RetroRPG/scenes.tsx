import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { hop } from '@/lib/motion/arc'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import { ramp } from '@/lib/scroll/stage'
import { bell, fadeTo, fx, lerp, r1, transformTo, translateTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { CARETAKER, CHAMPION, DUMMY, HUNTER, KID, LANTERN, OWL, OWL_ASLEEP, SCARF_GUARD, SHOWMAN, WEAVER, type PixelSprite } from './npcs'
import { PixelArt, type Frame } from './walker'
import { PIXEL, RPG } from './palette'
import { GROUND, PX, type Zone } from './zones'

// One merciful run through the underground the world comes from, told a section at a time in the game's
// order of places (score/C62/retro-rpg-concept.md): the violet ruins, the snow forest, the dark marsh, the hot
// country, the grey royal city at the barrier and the surface. The hero: he falls down the shaft of light
// into the flowers, sits up and steps to the edge of the light. About: a grinning lantern's glowing beads
// close in a ring round him, the caretaker's fire breaks it, and he talks to the training dummy instead of
// hitting it. Work: the caretaker blocks the way out; on the battle screen her fire bends away from his
// heart each time he spares her, then she holds him and the door opens. Tech: he solves the scarf guard's
// tile floor, his heart falls under gravity and jumps the icicles, and the guard gives up and hands him an
// invitation. Services: he freezes mid stride under the owl sentry's beam, then pets the owl to sleep.
// Projects: he hides in the marsh grass from the armoured hunter, his heart's shield turns to every lance,
// and in the heat he pours a cup of water on her. Ventures: he buys a charm at the weaver's stall, his heart
// rides her threads, and the charm he holds up lets him through her web. Bands: he drums a fill on the
// showman's stage, his heart shoots up at the speakers, and the meter fills until the showman bows. Muay
// Thai: the old champion shatters the spare button, he raises his guard in the storm, calls his friends'
// lights, and reaches out until the champion is a kid again. Contact: he climbs out onto the cliff at sunset
// with the friends of this page behind him and touches the save star.
//
// Every scene is one to three actions on the shared scene player (src/lib/scroll/player.ts); each frame is a
// function of the playhead alone, so an action reads the same played backward, and the end frame is the one
// reduced motion shows. He is drawn once in every scene: his sprite in the room, or his heart alone while the
// battle screen covers it (his sprite fades out as the screen comes in). Nothing here copies the game: every
// creature, prop and word is drawn for this page.

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
  /** The room's props and cast, drawn in the figure layer behind him; `kit` is the profession he wears and
   *  `name` his name, for the save box. */
  back: (layout: Layout, kit: Profession, name: string) => ReactNode
  /** What stands in front of him, if anything. */
  front?: (layout: Layout) => ReactNode
  /** The battle screen the scene cuts to, drawn over the whole room, him and what stands in front of him. */
  screen?: (layout: Layout) => ReactNode
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

/** On a phone the room is drawn at half size round this point, the middle of its view on the floor line
 *  (stage.tsx), so the same room as on a wide screen fits its narrow view (about x 580 to 860). */
export const PHONE_PIVOT = { x: 720, y: GROUND, scale: 0.5 } as const

/** A place in the room `dx` from where he starts: right of the text on a wide screen; on a phone the same
 *  spacing, centred so the half size room lands in its view. */
const roomX = ({ phone }: Layout, dx: number): number => (phone ? 610 : 900) + dx

const walker = (x: number, frame: Frame, opacity = 1, k = K, y = GROUND): WalkerState => ({ x, y, k, pose: frame, opacity })

/** His step frame at `x` of his walk. */
const stepOf = (x: number): Frame => (Math.floor(x / 40) % 2 === 0 ? 'stepA' : 'stepB')

/** Him walking from `from` to `to` over `t`: his step frames on the way, standing right at either end. */
const walk = (from: number, to: number, t: number, opacity = 1): WalkerState => {
  const x = lerp(from, to, t)
  return walker(x, t > 0 && t < 1 ? stepOf(x) : 'standR', opacity)
}

/** A cast sprite drawn round its foot (its bottom middle), each of its pixels a grid pixel of the room. */
const Sprite = ({ sprite }: { sprite: PixelSprite }) => (
  <g transform={`scale(${U})`}>
    <PixelArt sprite={sprite} x={-sprite.rows[0].length / 2} y={-sprite.rows.length} />
  </g>
)

/** A shape on the grid round its foot, blown up to the canvas. */
const Px = ({ children }: { children: ReactNode }) => <g transform={`scale(${U})`}>{children}</g>

/** A cast member or prop group at its foot `x`, `y`, sized `size` and turned `turn` degrees round its foot. */
const placeTo = (node: Element | null, x: number, y: number, size = 1, turn = 0): void =>
  transformTo(node, `translate(${r1(x)} ${r1(y)})${turn ? ` rotate(${r1(turn)})` : ''}${size === 1 ? '' : ` scale(${size.toFixed(3)})`}`)

/** Two looks of one thing: the first shown, the second hidden until `swap` turns them. Both are written on
 *  every turn, so a stage bound again never keeps a stale look. */
const Swap = ({ name, first, second }: { name: string; first: ReactNode; second: ReactNode }) => (
  <g data-fx={name}>
    <g>{first}</g>
    <g visibility="hidden">{second}</g>
  </g>
)

const swap = (node: Element | null, second: boolean): void => {
  node?.children[0]?.setAttribute('visibility', second ? 'hidden' : 'inherit')
  node?.children[1]?.setAttribute('visibility', second ? 'inherit' : 'hidden')
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

/** The woven charm from the weaver's stall: a small diamond of thread. */
const Charm = () => (
  <Px>
    <path d="M0 -10 L5 -5 L0 0 L-5 -5 Z" fill={RPG.weaver} />
    <path d="M0 -8 L3 -5 L0 -2 L-3 -5 Z" fill={RPG.purple} />
  </Px>
)

/** The scarf guard's invitation: a folded white card with a red seal. */
const Letter = () => (
  <Px>
    <rect x={-5} y={-7} width={10} height={7} fill={RPG.border} />
    <path d="M-5 -7 L0 -3 L5 -7" fill="none" stroke={RPG.borderShade} strokeWidth={0.6} />
    <rect x={-1} y={-4} width={2} height={2} fill={RPG.scarf} />
  </Px>
)

/** The bake stall: posts, a striped roof, a lit sign and the counter. */
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

/** The bed of yellow flowers he lands on, 40 grid pixels wide. */
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

/** A dark doorway in the ruins' wall, round topped. */
const Doorway = () => (
  <Px>
    <path d="M-10 0 V-26 a10 10 0 0 1 20 0 V0 Z" fill={RPG.stoneDark} />
    <path d="M-7 0 V-25 a7 7 0 0 1 14 0 V0 Z" fill={RPG.void} />
  </Px>
)

/** A floor tile of the guard's puzzle: grey before he steps on it, gold after. */
const Tile = ({ lit }: { lit: boolean }) => (
  <Px>
    <rect x={-5} y={-1} width={10} height={2} fill={lit ? RPG.gold : RPG.snowShade} />
    <rect x={-4} y={-1} width={8} height={1} fill={lit ? RPG.lavaCore : RPG.snowCap} />
  </Px>
)

/** The plank bridge over the snow forest's gap. */
const Bridge = ({ width }: { width: number }) => (
  <g>
    <rect x={0} y={-6} width={r1(width)} height={10} fill={RPG.woodDark} />
    {Array.from({ length: Math.floor(width / 30) }, (_, i) => (
      <rect key={i} x={i * 30 + 2} y={-6} width={24} height={6} fill={RPG.wood} />
    ))}
  </g>
)

/** The sentry's lantern on its pole, and the booth he sits in. */
const LampPost = () => (
  <Px>
    <rect x={-1} y={-44} width={2} height={44} fill={RPG.woodDark} />
    <rect x={-3} y={-48} width={6} height={5} fill={RPG.gold} />
    <rect x={-4} y={-49} width={8} height={1} fill={RPG.spriteLine} />
  </Px>
)

const Booth = () => (
  <Px>
    <rect x={-12} y={-26} width={24} height={26} fill={RPG.wood} />
    <rect x={-12} y={-26} width={24} height={2} fill={RPG.woodDark} />
    <rect x={-14} y={-32} width={28} height={6} fill={RPG.snowCap} />
    <rect x={-9} y={-22} width={18} height={9} fill={RPG.woodDark} />
  </Px>
)

/** A clump of the marsh's tall grass, in front of him. */
const Grass = () => (
  <Px>
    {[-9, -6, -3, 0, 3, 6, 9].map((x, i) => (
      <rect key={x} x={x} y={-22 - (i % 3) * 3} width={2} height={22 + (i % 3) * 3} fill={i % 2 ? RPG.pine : RPG.pineLit} />
    ))}
  </Px>
)

/** The water cooler in the marsh's warm end: a white stand and its blue jug. */
const Cooler = () => (
  <Px>
    <rect x={-4} y={-16} width={8} height={16} fill={RPG.muted} />
    <rect x={-3} y={-24} width={6} height={8} fill={RPG.sky} />
    <rect x={-1} y={-12} width={2} height={2} fill={RPG.spriteLine} />
  </Px>
)

/** The weaver's web door: a dark opening strung with threads. */
const WebDoor = () => (
  <Px>
    <rect x={-10} y={-32} width={20} height={32} fill={RPG.void} />
    <rect x={-12} y={-34} width={24} height={2} fill={RPG.basaltLit} />
  </Px>
)

const Web = () => (
  <Px>
    <path d="M-10 -32 L10 0 M10 -32 L-10 0 M0 -32 V0 M-10 -16 H10 M-6 -26 H6 M-6 -6 H6" stroke={RPG.border} strokeWidth={0.6} opacity={0.8} />
  </Px>
)

/** His drum kit on the showman's stage: a bass drum, a snare and a cymbal. */
const Kit = () => (
  <Px>
    <rect x={-1} y={-24} width={1} height={14} fill={RPG.borderShade} />
    <rect x={-5} y={-25} width={8} height={1} fill={RPG.gold} />
    <rect x={2} y={-13} width={12} height={13} fill={RPG.snare} />
    <rect x={4} y={-11} width={8} height={9} fill={RPG.border} />
    <rect x={-6} y={-11} width={7} height={4} fill={RPG.snare} />
    <rect x={-6} y={-11} width={7} height={1} fill={RPG.border} />
    <rect x={-3} y={-7} width={1} height={7} fill={RPG.borderShade} />
  </Px>
)

/** A phone held up in the cardboard audience, its screen dark or lit. */
const Phone = () => (
  <Px>
    <rect x={-1} y={-4} width={2} height={8} fill={RPG.spriteLine} />
    <rect x={-3} y={-12} width={6} height={9} fill={RPG.spriteLine} />
  </Px>
)

/** The old champion's halberd, held upright beside him. */
const Halberd = () => (
  <Px>
    <rect x={-1} y={-40} width={2} height={40} fill={RPG.woodDark} />
    <path d="M1 -40 L7 -36 L7 -30 L1 -32 Z" fill={RPG.helmet} />
    <path d="M-1 -44 L0 -48 L1 -44 Z" fill={RPG.helmet} />
  </Px>
)

/** A friend's light: a small square of colour with its glow. */
const FriendLight = ({ fill }: { fill: string }) => (
  <Px>
    <rect x={-4} y={-4} width={8} height={8} fill={fill} opacity={0.3} />
    <rect x={-2} y={-2} width={4} height={4} fill={fill} />
  </Px>
)

/** A falling bolt of the champion's storm: a white square. */
const Bolt = () => <rect x={-6} y={-6} width={12} height={12} fill={RPG.border} />

// ---------------------------------------------------------------- the battle screen

/** The battle screen's box round its middle `bx`: half its width and its top and bottom; lower on a phone,
 *  whose view starts at y 360, so the foe over it stays in view. */
const boxOf = ({ phone, cx }: Layout) => (phone ? { bx: cx, w: 120, top: 560, bottom: 670 } : { bx: cx, w: 160, top: 420, bottom: 570 })

/** The foe's size over the box: smaller on a phone, so it stands in the strip above the box. */
const foeSize = ({ phone }: Layout): number => (phone ? 0.75 : 1)

const BUTTONS = ['blade', 'speech', 'bag', 'spare'] as const

/** A command button's icon, plain shapes: a blade, a speech mark, a bag, a cross. */
const ICONS: Record<(typeof BUTTONS)[number], ReactNode> = {
  blade: <path d="M-1 -6 h2 v8 h2 v2 h-6 v-2 h2 Z" />,
  speech: <path d="M-5 -5 h10 v7 h-6 l-3 3 v-3 h-1 Z" />,
  bag: <path d="M-4 -3 h8 v7 h-8 Z M-2 -5 h4 v2 h-4 Z" />,
  spare: <path d="M-5 -5 L5 5 M5 -5 L-5 5" strokeWidth={2} />,
}

/** His heart in the battle box, in the colour of its mode. */
const Heart = ({ fill }: { fill: string }) => (
  <path d="M0 10 L-10 0 Q-14 -8 -7 -10 Q-2 -10 0 -5 Q2 -10 7 -10 Q14 -8 10 0 Z" fill={fill} />
)

/**
 * The battle screen over the room: black, the white bordered box, the foe standing on its top edge, the four
 * command buttons under it, the heart in the box and whatever the fight throws (`children`), then the white
 * flash the cut plays. Hidden until the scene cuts to it.
 */
function Battle({ layout, foe, heart, children }: { layout: Layout; foe: PixelSprite; heart: string; children?: ReactNode }) {
  const { bx, w, top, bottom } = boxOf(layout)
  const gap = (2 * w) / BUTTONS.length
  return (
    <>
      <g data-fx="screen" opacity={0}>
        <rect x={-200} y={0} width={1840} height={1000} fill={RPG.void} />
        <g transform={`translate(${bx} ${top - 6}) scale(${foeSize(layout)})`}>
          <Sprite sprite={foe} />
        </g>
        <rect x={bx - w} y={top} width={2 * w} height={bottom - top} fill={RPG.void} stroke={RPG.border} strokeWidth={6} />
        {BUTTONS.map((name, i) => (
          <g key={name} transform={`translate(${r1(bx - w + gap * (i + 0.5))} ${bottom + 70})`}>
            <rect data-fx={`button-${name}`} x={-gap / 2 + 8} y={-26} width={gap - 16} height={52} fill={RPG.void} stroke={RPG.wraps} strokeWidth={4} />
            <g data-fx={`icon-${name}`} transform="scale(3)" fill={RPG.wraps} stroke={RPG.wraps}>
              {ICONS[name]}
            </g>
          </g>
        ))}
        {children}
        <g data-fx="heart" transform={`translate(${bx} ${(top + bottom) / 2})`}>
          <Heart fill={heart} />
        </g>
      </g>
      <rect data-fx="flash" x={-200} y={0} width={1840} height={1000} fill={RPG.border} opacity={0} />
    </>
  )
}

/** The cut to the battle screen over `cutIn` (its first share) and back to the room over `cutOut` (its last):
 *  writes the screen and the flash and returns how much of the screen shows, so his sprite fades the other
 *  way and he is drawn once, as the heart or as himself. */
const battleCut = (stage: StageNodes) => {
  const screen = fx(stage, 'screen')
  const flash = fx(stage, 'flash')
  return (cutIn: number, cutOut: number): number => {
    const shown = ramp(cutIn, 0.12, 0.28) * (1 - ramp(cutOut, 0.72, 0.88))
    fadeTo(screen, shown)
    // a short soft flash, so a scroll that rests on the cut never holds a white screen
    fadeTo(flash, 0.5 * Math.max(bell(cutIn, 0.04, 0.24), bell(cutOut, 0.76, 0.96)))
    return shown
  }
}

/** The battle box of a scene: its middle and edges, the heart's node, and where the heart sits at rest. */
const boxNodes = (stage: StageNodes, layout: Layout) => {
  const box = boxOf(layout)
  return { ...box, mid: (box.top + box.bottom) / 2, heart: fx(stage, 'heart') }
}

// ---------------------------------------------------------------- the scenes

// The hero, the ruins' first cave: he drops down the shaft of light from the hole far above and lands in
// the flowers, sits up and shakes his head, stands, then steps to the edge of the light, the dark doorway
// ahead.
const HERO = { wide: { him: 1060, door: 1320, step: 120 }, phone: { him: 640, door: 940, step: 120 } }
const heroK = ({ phone }: Layout): number => (phone ? 2.6 : 1.9) * PX

const hero: SceneDef = {
  zone: 'ruins',
  kit: null,
  script: [1400, 1200, 1400],
  back: ({ phone }) => {
    const at = HERO[phone ? 'phone' : 'wide']
    return (
      <>
        <rect x={at.him - 90} y={0} width={180} height={GROUND} fill={RPG.gold} opacity={0.12} />
        <g transform={`translate(${at.him} ${GROUND})`}>
          <FlowerBed />
        </g>
        <g transform={`translate(${at.door} ${GROUND})`}>
          <Doorway />
        </g>
      </>
    )
  },
  bind: (_stage, layout) => {
    const at = HERO[layout.phone ? 'phone' : 'wide']
    const k = heroK(layout)
    return (_p, _f, play = START) => {
      const fell = share(play, 0)
      const rose = share(play, 1)
      const stepped = share(play, 2)
      if (play.action === 0) {
        const down = ramp(fell, 0, 0.75)
        return walker(at.him, 'kneel', 1, k, GROUND - (GROUND + 300) * (1 - down * down))
      }
      if (play.action === 1) return walker(at.him + 4 * Math.sin(rose * Math.PI * 8) * (1 - ramp(rose, 0.3, 0.5)), rose < 0.55 ? 'kneel' : 'stand', 1, k)
      const him = walk(at.him, at.him + at.step, stepped)
      return { ...him, k }
    }
  },
}

// About, a hall of the ruins: a grinning lantern offers its glowing beads; he reaches for them and they close
// in a ring round him; the caretaker comes in, her fire breaks the ring and the lantern flees up into the dark;
// then he walks up to the straw dummy and talks to it, speech marks over it, the caretaker behind him with her
// lamp.
const ABOUT = { from: -40, reach: 100, lantern: 240, dummy: 340, talk: 270, carerFrom: -200, carer: 20, carerEnd: 140 }
const BEADS = 6

const about: SceneDef = {
  zone: 'ruins',
  kit: null,
  script: [1600, 1500, 1600],
  back: (layout) => (
    <>
      <g transform={`translate(${r1(roomX(layout, ABOUT.dummy))} ${GROUND})`}>
        <Sprite sprite={DUMMY} />
      </g>
      <g data-fx="speech" opacity={0} transform={`translate(${r1(roomX(layout, ABOUT.dummy) - 60)} ${r1(GROUND - 26 * U)})`}>
        {[0, 1, 2].map((i) => (
          <rect key={i} data-fx={`speech-${i}`} x={i * 22} y={-i * 6} width={14} height={8} fill={RPG.border} />
        ))}
      </g>
      <g data-fx="lantern" transform={`translate(${r1(roomX(layout, ABOUT.lantern))} ${r1(GROUND - 150)})`}>
        <Sprite sprite={LANTERN} />
      </g>
      {Array.from({ length: BEADS }, (_, i) => (
        <rect key={i} data-fx={`bead-${i}`} x={-7} y={-7} width={14} height={14} fill={i % 2 ? RPG.crystal : RPG.gold} />
      ))}
      <g data-fx="carer" opacity={0} transform={`translate(${r1(roomX(layout, ABOUT.carerFrom))} ${GROUND})`}>
        <Sprite sprite={CARETAKER} />
      </g>
      <g data-fx="fire" opacity={0}>
        <rect x={-14} y={-14} width={28} height={28} fill={RPG.lava} />
        <rect x={-7} y={-7} width={14} height={14} fill={RPG.lavaCore} />
      </g>
    </>
  ),
  bind: (stage, layout) => {
    const lantern = fx(stage, 'lantern')
    const beads = Array.from({ length: BEADS }, (_, i) => fx(stage, `bead-${i}`))
    const carer = fx(stage, 'carer')
    const fire = fx(stage, 'fire')
    const speech = fx(stage, 'speech')
    const marks = [0, 1, 2].map((i) => fx(stage, `speech-${i}`))
    const lanternX = roomX(layout, ABOUT.lantern)
    const from = roomX(layout, ABOUT.from)
    const reachX = roomX(layout, ABOUT.reach)
    const talkX = roomX(layout, ABOUT.talk)
    const [carerFrom, carerAt, carerEnd] = [ABOUT.carerFrom, ABOUT.carer, ABOUT.carerEnd].map((dx) => roomX(layout, dx))
    const ringY = GROUND - 100
    return (_p, _f, play = START) => {
      const reached = share(play, 0)
      const saved = share(play, 1)
      const talked = share(play, 2)
      const close = ramp(reached, 0.45, 0.9)
      const scatter = ramp(saved, 0.4, 0.7)
      beads.forEach((bead, i) => {
        const a = (i / BEADS) * Math.PI * 2 + reached * 2
        const offered = { x: lanternX - 120 + 50 * Math.cos(a), y: GROUND - 150 + 40 * Math.sin(a) }
        const ring = { x: reachX + 90 * Math.cos(a), y: ringY + 90 * Math.sin(a) }
        const out = 1 + 2.5 * scatter
        translateTo(bead, lerp(offered.x, reachX + (ring.x - reachX) * out, close), lerp(offered.y, ringY + (ring.y - ringY) * out, close))
        fadeTo(bead, 1 - scatter)
      })
      const flee = ramp(saved, 0.45, 0.9)
      placeTo(lantern, lanternX + 80 * flee, GROUND - 150 - 320 * flee - hop(ramp(reached, 0.85, 1), 16))
      fadeTo(lantern, 1 - flee)
      const came = ramp(saved, 0, 0.3)
      const carerX = talked > 0 ? lerp(carerAt, carerEnd, ramp(talked, 0.1, 0.6)) : lerp(carerFrom, carerAt, came)
      placeTo(carer, carerX, GROUND)
      fadeTo(carer, came)
      const thrown = ramp(saved, 0.25, 0.45)
      translateTo(fire, lerp(carerAt + 40, reachX, thrown), lerp(GROUND - 120, ringY, thrown))
      fadeTo(fire, thrown > 0 && thrown < 1 ? 1 : 0)
      const spoken = ramp(talked, 0.55, 0.9)
      fadeTo(speech, spoken > 0 ? 1 : 0)
      marks.forEach((mark, i) => fadeTo(mark, ramp(spoken, i * 0.3, i * 0.3 + 0.2)))
      if (play.action === 0) return reached < 0.45 ? walk(from, reachX, ramp(reached, 0, 0.45)) : walker(reachX, 'cast')
      if (play.action === 1) return walker(reachX, saved < 0.5 ? 'cast' : 'standR')
      return talked < 0.5 ? walk(reachX, talkX, ramp(talked, 0, 0.5)) : walker(talkX, 'standR')
    }
  },
}

// Work, the basement corridor of the ruins: the caretaker stands before the tall door out. The screen cuts to
// the battle: her fire sweeps across the box in waves and his heart weaves the gaps; he spares her again and
// again, the spare button lighting each time, and her fire bends further away from his heart. Back in the
// corridor she kneels and holds him, the door swings open, and she waves him on.
const WORK = { from: -60, hug: 110, carer: 170, door: 280 }
const FLAMES = 9

const work: SceneDef = {
  zone: 'ruins',
  kit: null,
  script: [1800, 1700, 1400],
  back: (layout) => {
    const door = roomX(layout, WORK.door)
    return (
      <>
        <rect data-fx="door-light" x={r1(door - 10 * U)} y={r1(GROUND - 34 * U)} width={r1(20 * U)} height={r1(34 * U)} fill={RPG.gold} opacity={0} />
        <rect x={r1(door - 11 * U)} y={r1(GROUND - 35 * U)} width={r1(22 * U)} height={r1(35 * U)} fill="none" stroke={RPG.stoneDark} strokeWidth={U} />
        <rect data-fx="door" x={r1(door - 10 * U)} y={r1(GROUND - 34 * U)} width={r1(20 * U)} height={r1(34 * U)} fill={RPG.woodDark} />
        <g data-fx="carer" transform={`translate(${r1(roomX(layout, WORK.carer))} ${GROUND})`}>
          <Sprite sprite={CARETAKER} />
        </g>
      </>
    )
  },
  screen: (layout) => {
    const { bx, w } = boxOf(layout)
    return (
        <Battle layout={layout} foe={CARETAKER} heart={RPG.red}>
          {Array.from({ length: FLAMES }, (_, i) => (
            <rect key={i} data-fx={`flame-${i}`} x={-9} y={-9} width={18} height={18} fill={i % 2 ? RPG.lava : RPG.lavaCore} transform={`translate(${bx - w} 0)`} />
          ))}
        </Battle>
    )
  },
  bind: (stage, layout) => {
    const cut = battleCut(stage)
    const box = boxNodes(stage, layout)
    const flames = Array.from({ length: FLAMES }, (_, i) => fx(stage, `flame-${i}`))
    const spareButton = fx(stage, 'button-spare')
    const carer = fx(stage, 'carer')
    const door = fx(stage, 'door')
    const light = fx(stage, 'door-light')
    const [from, hugX, carerX, doorX] = [WORK.from, WORK.hug, WORK.carer, WORK.door].map((dx) => roomX(layout, dx))
    const lanes = [box.top + 25, box.mid, box.bottom - 25]
    return (_p, _f, play = START) => {
      const fought = share(play, 0)
      const spared = share(play, 1)
      const held = share(play, 2)
      const shown = cut(fought, held)
      const heartX = box.bx + box.w * 0.55 * Math.sin((fought + spared) * Math.PI * 3)
      const heartY = lanes[1] + 30 * Math.sin((fought + spared) * Math.PI * 5)
      translateTo(box.heart, heartX, heartY)
      const bend = ramp(spared, 0, 1)
      flames.forEach((flame, i) => {
        const lane = lanes[i % 3]
        const run = (fought * 1.6 + spared * 1.2 + i / FLAMES) % 1
        const x = box.bx - box.w + 10 + run * (2 * box.w - 20)
        const away = Math.sign(lane - heartY || 1) * 60 * bend * Math.max(0, 1 - Math.abs(x - heartX) / 140)
        translateTo(flame, x, Math.min(box.bottom - 12, Math.max(box.top + 12, lane + away)))
        fadeTo(flame, shown > 0.5 && fought > 0.3 ? 1 : 0)
      })
      spareButton?.setAttribute('stroke', spared > 0 && spared < 1 && Math.sin(spared * Math.PI * 6) > 0 ? RPG.gold : RPG.wraps)
      const knelt = bell(held, 0.1, 0.6)
      placeTo(carer, carerX, GROUND + 40 * knelt - hop(ramp(held, 0.75, 1), 14))
      const open = ramp(held, 0.4, 0.7)
      // the leaf folds toward its hinge on the left edge, which stays where it is
      const shut = 1 - 0.85 * open
      transformTo(door, `translate(${r1((doorX - 10 * U) * (1 - shut))} 0) scale(${shut.toFixed(3)} 1)`)
      fadeTo(light, 0.6 * open)
      if (play.action < 2) return walker(from, 'standR', 1 - shown)
      if (held < 0.3) return walk(from, hugX, ramp(held, 0, 0.3), 1 - shown)
      return held < 0.7 ? walker(hugX, 'standR') : walk(hugX, doorX - 60, ramp(held, 0.7, 1))
    }
  },
}

// Tech Stack, the snow forest: the scarf guard waits on his bridge; he steps across the guard's tile floor and
// the tiles light gold one by one. The screen cuts to the battle: his heart turns blue and falls under
// gravity, jumping the icicles sliding along the floor of the box. Back in the snow the guard gives up, beams,
// and an invitation flies to his hand.
const TECH = { tiles: [30, 80, 130, 180] as const, from: -30, stop: 220, bridge: 260, guard: 340 }
const ICICLES = 3

const tech: SceneDef = {
  zone: 'snow',
  kit: 'engineer',
  script: [1600, 1800, 1400],
  back: (layout) => {
    const bridge = roomX(layout, TECH.bridge)
    return (
      <>
        <g transform={`translate(${r1(bridge)} ${GROUND})`}>
          <Bridge width={roomX(layout, TECH.guard + 120) - bridge} />
        </g>
        {TECH.tiles.map((dx, i) => (
          <g key={dx} transform={`translate(${r1(roomX(layout, dx))} ${GROUND})`}>
            <Swap name={`tile-${i}`} first={<Tile lit={false} />} second={<Tile lit />} />
          </g>
        ))}
        <g data-fx="guard" transform={`translate(${r1(roomX(layout, TECH.guard))} ${GROUND})`}>
          <Sprite sprite={SCARF_GUARD} />
        </g>
        <g data-fx="letter" opacity={0}>
          <Letter />
        </g>
      </>
    )
  },
  screen: (layout) => (
      <Battle layout={layout} foe={SCARF_GUARD} heart={RPG.sky}>
        {Array.from({ length: ICICLES }, (_, i) => (
          <path key={i} data-fx={`ice-${i}`} d="M-14 0 L0 -36 L14 0 Z" fill={RPG.snowCap} />
        ))}
      </Battle>
  ),
  bind: (stage, layout) => {
    const tiles = TECH.tiles.map((dx, i) => ({ node: fx(stage, `tile-${i}`), x: roomX(layout, dx) }))
    const guard = fx(stage, 'guard')
    const letter = fx(stage, 'letter')
    const icicles = Array.from({ length: ICICLES }, (_, i) => fx(stage, `ice-${i}`))
    const cut = battleCut(stage)
    const box = boxNodes(stage, layout)
    const [from, stop, guardX] = [TECH.from, TECH.stop, TECH.guard].map((dx) => roomX(layout, dx))
    const heartX = box.bx - box.w * 0.3
    const floor = box.bottom - 14
    return (_p, _f, play = START) => {
      const solved = share(play, 0)
      const fought = share(play, 1)
      const gave = share(play, 2)
      const shown = cut(fought, gave)
      let lift = 0
      icicles.forEach((ice, i) => {
        const x = box.bx + box.w - 20 - ((fought * 2 + i / ICICLES) % 1) * (2 * box.w - 40)
        translateTo(ice, x, box.bottom - 3)
        fadeTo(ice, fought > 0.25 ? 1 : 0)
        const near = Math.abs(x - heartX) / 70
        if (fought > 0.25 && near < 1) lift = Math.max(lift, 70 * (1 - near * near))
      })
      translateTo(box.heart, heartX, floor - lift)
      placeTo(guard, guardX, GROUND - hop(bell(gave, 0, 0.35), 24))
      const flown = ramp(gave, 0.3, 0.7)
      translateTo(letter, lerp(guardX, stop + 40, flown), GROUND - 150 + 40 * flown - hop(flown, 60))
      fadeTo(letter, gave > 0.3 ? 1 : 0)
      const him = play.action === 0 ? walk(from, stop, solved) : walker(stop, gave > 0.6 && gave < 0.85 ? 'cast' : 'standR', 1 - shown)
      tiles.forEach(({ node, x }) => swap(node, him.x >= x))
      return him
    }
  },
}

// Services, the snow by the sentry's booth: the owl sentry sees only what moves, his lantern's beam sweeping
// the path. He walks in and freezes mid stride as the beam passes over him, and the owl sees nothing; then he
// walks past the lantern up to the booth and pats the owl, who ruffles his feathers and falls asleep.
const SERVICES = { from: -60, freeze: 110, post: 180, booth: 280, pet: 220 }

const services: SceneDef = {
  zone: 'snow',
  kit: 'engineer',
  script: [2200, 1600],
  back: (layout) => {
    const post = roomX(layout, SERVICES.post)
    const booth = roomX(layout, SERVICES.booth)
    return (
      <>
        <g transform={`translate(${r1(booth)} ${GROUND})`}>
          <Booth />
        </g>
        <g data-fx="owl" transform={`translate(${r1(booth)} ${r1(GROUND - 13 * U)})`}>
          <Swap name="owl-eyes" first={<Sprite sprite={OWL} />} second={<Sprite sprite={OWL_ASLEEP} />} />
        </g>
        <g transform={`translate(${r1(post)} ${GROUND})`}>
          <LampPost />
        </g>
        <path data-fx="beam" d={`M${r1(post - 3 * U)} ${r1(GROUND - 46 * U)} L${r1(post + 3 * U)} ${r1(GROUND - 46 * U)} L${r1(post + 90)} ${GROUND} L${r1(post - 90)} ${GROUND} Z`} fill={RPG.gold} opacity={0.22} />
      </>
    )
  },
  bind: (stage, layout) => {
    const beam = fx(stage, 'beam')
    const owl = fx(stage, 'owl')
    const eyes = fx(stage, 'owl-eyes')
    const [from, freezeX, post, booth, petX] = [SERVICES.from, SERVICES.freeze, SERVICES.post, SERVICES.booth, SERVICES.pet].map((dx) => roomX(layout, dx))
    return (_p, _f, play = START) => {
      const froze = share(play, 0)
      const petted = share(play, 1)
      const sweep = ramp(froze, 0.35, 0.95)
      const beamAt = lerp(post + 120, freezeX - 160, sweep) * (1 - ramp(petted, 0, 0.2)) + post * ramp(petted, 0, 0.2)
      transformTo(beam, `translate(${r1(beamAt - post)} 0)`)
      const ruffle = bell(petted, 0.45, 0.75)
      transformTo(owl, `translate(${r1(booth)} ${r1(GROUND - 13 * U - 6 * ruffle)}) rotate(${r1(8 * Math.sin(petted * Math.PI * 10) * ruffle)})`)
      swap(eyes, petted > 0.75)
      if (play.action === 0) return froze < 0.35 ? walk(from, freezeX, ramp(froze, 0, 0.35)) : walker(freezeX, 'stepA')
      return petted < 0.4 ? walk(freezeX, petX, ramp(petted, 0, 0.4)) : walker(petX, petted < 0.7 ? 'cast' : 'standR')
    }
  },
}

// Projects, the dark marsh of glowing plants: he crouches in the tall grass as the armoured hunter's light
// passes over it. The screen cuts to the battle: his heart turns green and can only turn its shield, and the
// lances come from every side in turn and stop on it. Back in the marsh the room warms to the red of the hot
// country, the hunter collapses in the heat, and he fills a cup at the cooler and pours it on her; she sits
// up in a cloud of steam.
const PROJECTS = { from: -120, hide: 0, grass: [-40, 0, 40] as const, cooler: 140, pour: 260, hunter: 290 }
const LANCES = 4
// The sides the lances come from in turn, as the angle of the shield that stops each: left, top, right, bottom.
const LANCE_SIDES = [180, 270, 0, 90] as const

const projects: SceneDef = {
  zone: 'cave',
  kit: 'engineer',
  script: [1400, 1900, 1600],
  back: (layout) => {
    return (
      <>
        <rect data-fx="heat" x={-200} y={0} width={1840} height={1000} fill={RPG.lava} opacity={0} />
        <g transform={`translate(${r1(roomX(layout, PROJECTS.cooler))} ${GROUND})`}>
          <Cooler />
        </g>
        <g data-fx="hunter" transform={`translate(${r1(roomX(layout, PROJECTS.hunter))} ${GROUND})`}>
          <Sprite sprite={HUNTER} />
          <rect x={r1(-9 * U)} y={r1(-34 * U)} width={r1(U)} height={r1(34 * U)} fill={RPG.visor} />
        </g>
        <ellipse data-fx="glow" cx={0} cy={GROUND - 60} rx={110} ry={80} fill={RPG.visor} opacity={0} />
        <g data-fx="steam" opacity={0}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={i * 26 - 30} y={-i * 30} width={18} height={18} fill={RPG.border} opacity={0.7} />
          ))}
        </g>
        <g data-fx="drops" opacity={0}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={i * 14 - 14} y={i * 18} width={8} height={12} fill={RPG.sky} />
          ))}
        </g>
        <g data-fx="cup" opacity={0}>
          <Px>
            <rect x={-2} y={-5} width={4} height={5} fill={RPG.border} />
          </Px>
        </g>
      </>
    )
  },
  screen: (layout) => {
    const { bx, top, bottom } = boxOf(layout)
    const mid = (top + bottom) / 2
    return (
        <Battle layout={layout} foe={HUNTER} heart={RPG.green}>
          {Array.from({ length: LANCES }, (_, i) => (
            <rect key={i} data-fx={`lance-${i}`} x={-20} y={-4} width={40} height={8} fill={RPG.border} />
          ))}
          <g data-fx="shield" transform={`translate(${bx} ${mid})`}>
            <rect x={-40} y={-24} width={8} height={48} fill={RPG.green} />
          </g>
        </Battle>
    )
  },
  front: (layout) => (
    <>
      {PROJECTS.grass.map((dx) => (
        <g key={dx} transform={`translate(${r1(roomX(layout, dx))} ${GROUND + 6})`}>
          <Grass />
        </g>
      ))}
    </>
  ),
  bind: (stage, layout) => {
    const cut = battleCut(stage)
    const box = boxNodes(stage, layout)
    const lances = Array.from({ length: LANCES }, (_, i) => fx(stage, `lance-${i}`))
    const shield = fx(stage, 'shield')
    const heat = fx(stage, 'heat')
    const hunter = fx(stage, 'hunter')
    const glow = fx(stage, 'glow')
    const steam = fx(stage, 'steam')
    const drops = fx(stage, 'drops')
    const cup = fx(stage, 'cup')
    const [from, hideX, coolerX, pourX, hunterX] = [PROJECTS.from, PROJECTS.hide, PROJECTS.cooler, PROJECTS.pour, PROJECTS.hunter].map((dx) => roomX(layout, dx))
    return (_p, _f, play = START) => {
      const hid = share(play, 0)
      const fought = share(play, 1)
      const poured = share(play, 2)
      const shown = cut(fought, poured)
      translateTo(box.heart, box.bx, box.mid)
      const turn = Math.min(LANCES - 1, Math.floor(ramp(fought, 0.2, 1) * LANCES))
      lances.forEach((lance, i) => {
        const u = ramp(fought, 0.2 + (i * 0.8) / LANCES, 0.2 + ((i + 1) * 0.8) / LANCES)
        const angle = (LANCE_SIDES[i] * Math.PI) / 180
        // each lance starts at the box's edge on its side, so none crosses the buttons under it
        const edge = LANCE_SIDES[i] % 180 === 0 ? box.w - 10 : (box.bottom - box.top) / 2 + 10
        const reach = lerp(edge, 54, u)
        transformTo(lance, `translate(${r1(box.bx + reach * Math.cos(angle))} ${r1(box.mid + reach * Math.sin(angle))}) rotate(${LANCE_SIDES[i]})`)
        fadeTo(lance, u > 0 && u < 1 ? 1 : 0)
      })
      transformTo(shield, `translate(${box.bx} ${r1(box.mid)}) rotate(${LANCE_SIDES[turn] - 180})`)
      const passed = ramp(hid, 0.45, 1)
      transformTo(glow, `translate(${r1(lerp(hunterX, from - 120, passed))} 0)`)
      fadeTo(glow, 0.3 * bell(hid, 0.45, 1))
      fadeTo(heat, 0.18 * ramp(poured, 0, 0.25))
      const fell = ramp(poured, 0.05, 0.25) * (1 - ramp(poured, 0.85, 1))
      placeTo(hunter, hunterX + 40 * fell, GROUND, 1, 80 * fell)
      const wet = ramp(poured, 0.7, 0.85)
      translateTo(drops, hunterX - 20, GROUND - 140 + 60 * wet)
      fadeTo(drops, wet > 0 && wet < 1 ? 1 : 0)
      const steamed = ramp(poured, 0.8, 1)
      translateTo(steam, hunterX, GROUND - 120 - 60 * steamed)
      fadeTo(steam, steamed > 0 ? 1 - 0.5 * steamed : 0)
      if (play.action === 0) return hid < 0.45 ? walk(from, hideX, ramp(hid, 0, 0.45)) : walker(hideX, 'kneel')
      if (play.action === 1) return walker(hideX, 'kneel', 1 - shown)
      const him =
        poured < 0.2
          ? walker(hideX, 'kneel', 1 - shown)
          : poured < 0.4
            ? walk(hideX, coolerX - 40, ramp(poured, 0.2, 0.4))
            : poured < 0.5
              ? walker(coolerX - 40, 'cast')
              : poured < 0.7
                ? walk(coolerX - 40, pourX - 60, ramp(poured, 0.5, 0.7))
                : walker(pourX - 60, poured < 0.85 ? 'cast' : 'standR')
      translateTo(cup, him.x + 30, GROUND - 120)
      fadeTo(cup, poured >= 0.45 ? 1 : 0)
      return him
    }
  },
}

// Ventures, the hot country: he stops at the weaver's bake stall and drops a coin, and a small woven charm
// comes back to him. The screen cuts to the battle: his heart turns purple and is bound to her threads,
// sliding from line to line as her shuttles fly along them. Back in her lair he holds up the charm; she knows
// her own work, laughs, the web over her door parts, and he walks through it as she waves the charm at him.
const VENTURES = { from: -140, buy: -60, stall: -10, show: 170, weaver: 240, door: 310 }
const THREADS = 3
// The thread his heart rides at each sixth of the fight.
const LANE_PATH = [1, 0, 2, 1, 2, 0] as const

const ventures: SceneDef = {
  zone: 'volcano',
  kit: 'engineer',
  script: [1400, 1800, 1400],
  back: (layout) => {
    const door = roomX(layout, VENTURES.door)
    return (
      <>
        <g transform={`translate(${r1(roomX(layout, VENTURES.stall))} ${GROUND}) scale(0.6)`}>
          <Swap name="stall" first={<Stall lit={false} />} second={<Stall lit />} />
        </g>
        <g transform={`translate(${r1(door)} ${GROUND})`}>
          <WebDoor />
        </g>
        <g data-fx="web" transform={`translate(${r1(door)} ${GROUND})`}>
          <Web />
        </g>
        <g data-fx="weaver" transform={`translate(${r1(roomX(layout, VENTURES.weaver))} ${GROUND})`}>
          <Sprite sprite={WEAVER} />
        </g>
        <g data-fx="pay" opacity={0}>
          <Coin />
        </g>
        <g data-fx="charm" opacity={0}>
          <Charm />
          <Sparkle y={-12} />
        </g>
      </>
    )
  },
  screen: (layout) => {
    const { bx, w, top, bottom } = boxOf(layout)
    return (
        <Battle layout={layout} foe={WEAVER} heart={RPG.purple}>
          {Array.from({ length: THREADS }, (_, i) => (
            <rect key={i} x={bx - w + 8} y={r1(lerp(top + 25, bottom - 25, i / (THREADS - 1)) - 1)} width={2 * w - 16} height={3} fill={RPG.weaver} />
          ))}
          {Array.from({ length: THREADS }, (_, i) => (
            <path key={i} data-fx={`shuttle-${i}`} d="M-16 0 L0 -7 L16 0 L0 7 Z" fill={RPG.border} />
          ))}
        </Battle>
    )
  },
  bind: (stage, layout) => {
    const cut = battleCut(stage)
    const box = boxNodes(stage, layout)
    const shuttles = Array.from({ length: THREADS }, (_, i) => fx(stage, `shuttle-${i}`))
    const stall = fx(stage, 'stall')
    const coin = fx(stage, 'pay')
    const charm = fx(stage, 'charm')
    const web = fx(stage, 'web')
    const weaver = fx(stage, 'weaver')
    const [from, buyX, stallX, showX, weaverX, doorX] = [VENTURES.from, VENTURES.buy, VENTURES.stall, VENTURES.show, VENTURES.weaver, VENTURES.door].map((dx) => roomX(layout, dx))
    const laneY = (i: number): number => lerp(box.top + 25, box.bottom - 25, i / (THREADS - 1))
    return (_p, _f, play = START) => {
      const bought = share(play, 0)
      const fought = share(play, 1)
      const shownCharm = share(play, 2)
      const shown = cut(fought, shownCharm)
      const step = Math.min(LANE_PATH.length - 1, Math.floor(fought * LANE_PATH.length))
      const within = fought * LANE_PATH.length - step
      const lane = lerp(laneY(LANE_PATH[Math.max(0, step - 1)]), laneY(LANE_PATH[step]), ramp(within, 0, 0.3))
      translateTo(box.heart, box.bx - box.w * 0.4 + box.w * 0.8 * fought, lane)
      shuttles.forEach((shuttle, i) => {
        translateTo(shuttle, box.bx + box.w - 20 - ((fought * 2.4 + i * 0.37) % 1) * (2 * box.w - 40), laneY(i))
        fadeTo(shuttle, fought > 0.25 ? 1 : 0)
      })
      const paid = ramp(bought, 0.5, 0.7)
      translateTo(coin, lerp(buyX + 20, stallX + 40, paid), GROUND - 110 - hop(paid, 40))
      fadeTo(coin, paid > 0 && paid < 1 ? 1 : 0)
      swap(stall, bought >= 0.7)
      const raised = ramp(shownCharm, 0.25, 0.4)
      const given = ramp(shownCharm, 0.55, 0.75)
      const back = ramp(bought, 0.7, 0.95)
      const charmX = play.action < 2 ? lerp(stallX + 40, buyX + 30, back) : lerp(lerp(buyX + 30, showX + 10, ramp(shownCharm, 0, 0.25)), weaverX - 50, given)
      const charmY = play.action < 2 ? GROUND - 130 - hop(back, 40) : GROUND - 120 - 80 * raised * (1 - given)
      translateTo(charm, charmX, charmY)
      fadeTo(charm, bought > 0.7 ? 1 - shown : 0)
      placeTo(weaver, weaverX, GROUND - hop(bell(shownCharm, 0.4, 0.75), 18))
      fadeTo(web, 1 - ramp(shownCharm, 0.5, 0.75))
      if (play.action === 0) return bought < 0.45 ? walk(from, buyX, ramp(bought, 0, 0.45)) : walker(buyX, bought < 0.95 ? 'cast' : 'standR')
      if (play.action === 1) return walker(buyX, 'standR', 1 - shown)
      if (shownCharm < 0.25) return walk(buyX, showX, ramp(shownCharm, 0, 0.25), 1 - shown)
      return shownCharm < 0.7 ? walker(showX, 'cast') : walk(showX, doorX, ramp(shownCharm, 0.7, 1))
    }
  },
}

// Bands, the showman's stage in the hot country: the ratings meter drains while nothing happens. He drums a
// fill at his kit and the meter jumps. The screen cuts to the battle: his heart turns yellow, flips over, and
// shoots up at the showman's speakers. Back on stage the meter passes the top, the phones in the cardboard
// audience light up, and the showman takes his bow.
const BANDS = { kit: 60, him: 10, showman: 300, meter: 180 }
const PHONES = 6
const SHOTS = 4

const bands: SceneDef = {
  zone: 'volcano',
  kit: 'drummer',
  script: [1600, 1800, 1400],
  back: (layout) => {
    const meterX = roomX(layout, BANDS.meter)
    return (
      <>
        <rect x={-200} y={r1(GROUND - 4)} width={1840} height={20} fill={RPG.basaltLit} />
        {[BANDS.kit, BANDS.showman].map((dx) => (
          <path key={dx} d={`M${r1(roomX(layout, dx) - 20)} 0 L${r1(roomX(layout, dx) + 20)} 0 L${r1(roomX(layout, dx) + 110)} ${GROUND} L${r1(roomX(layout, dx) - 110)} ${GROUND} Z`} fill={RPG.gold} opacity={0.12} />
        ))}
        <g transform={`translate(${r1(roomX(layout, BANDS.kit))} ${GROUND})`}>
          <Kit />
        </g>
        <g data-fx="showman" transform={`translate(${r1(roomX(layout, BANDS.showman))} ${GROUND})`}>
          <Sprite sprite={SHOWMAN} />
        </g>
        <g transform={`translate(${r1(meterX - 90)} ${r1(GROUND - 300)})`}>
          <rect x={0} y={0} width={180} height={30} fill={RPG.void} stroke={RPG.border} strokeWidth={4} />
          <rect data-fx="meter" x={5} y={5} width={170} height={20} fill={RPG.gold} />
        </g>
      </>
    )
  },
  screen: (layout) => {
    const { bx, top } = boxOf(layout)
    return (
        <Battle layout={layout} foe={SHOWMAN} heart={RPG.gold}>
          {Array.from({ length: SHOTS }, (_, i) => (
            <rect key={i} data-fx={`shot-${i}`} x={-4} y={-12} width={8} height={24} fill={RPG.gold} transform={`translate(${bx} ${top})`} />
          ))}
        </Battle>
    )
  },
  front: (layout) => (
    <>
      {Array.from({ length: PHONES }, (_, i) => (
        <g key={i} transform={`translate(${r1(roomX(layout, -40 + i * 75))} ${r1(GROUND + 70 + (i % 2) * 14)})`}>
          <Phone />
          <rect data-fx={`screen-${i}`} x={r1(-2 * U)} y={r1(-11 * U)} width={r1(4 * U)} height={r1(6 * U)} fill={RPG.night} />
        </g>
      ))}
    </>
  ),
  bind: (stage, layout) => {
    const cut = battleCut(stage)
    const box = boxNodes(stage, layout)
    const meter = fx(stage, 'meter')
    const showman = fx(stage, 'showman')
    const shots = Array.from({ length: SHOTS }, (_, i) => fx(stage, `shot-${i}`))
    const screens = Array.from({ length: PHONES }, (_, i) => fx(stage, `screen-${i}`))
    const [himX, showmanX] = [BANDS.him, BANDS.showman].map((dx) => roomX(layout, dx))
    const heartX = (fought: number): number => box.bx + box.w * 0.6 * Math.sin(fought * Math.PI * 2)
    return (_p, _f, play = START) => {
      const drummed = share(play, 0)
      const fought = share(play, 1)
      const bowed = share(play, 2)
      const shown = cut(fought, bowed)
      const level = 0.25 - 0.1 * ramp(drummed, 0, 0.2) + 0.4 * ramp(drummed, 0.2, 0.9) + 0.3 * ramp(fought, 0.25, 0.9) + 0.15 * ramp(bowed, 0, 0.3)
      // the bar fills from its left end, which stays where it is
      const full = Math.min(1, level)
      transformTo(meter, `translate(${r1(5 * (1 - full))} 0) scale(${full.toFixed(3)} 1)`)
      transformTo(box.heart, `translate(${r1(heartX(fought))} ${box.bottom - 20}) rotate(180)`)
      shots.forEach((shot, i) => {
        const rise = (fought * 3 + i / SHOTS) % 1
        translateTo(shot, heartX(fought - rise * 0.1), lerp(box.bottom - 40, box.top - 40, rise))
        fadeTo(shot, fought > 0.25 && fought < 0.95 ? 1 : 0)
      })
      screens.forEach((screen, i) => screen?.setAttribute('fill', bowed > 0.3 + i * 0.06 ? RPG.gold : RPG.night))
      placeTo(showman, showmanX, GROUND, 1, -25 * ramp(bowed, 0.5, 0.8))
      const playing = drummed > 0.1 && drummed < 0.95
      const frame: Frame = playing ? (Math.floor(drummed * 14) % 2 ? 'actB' : 'actA') : 'actA'
      return walker(himX, frame, 1 - shown)
    }
  },
}

// Muay Thai, the grey royal city at the barrier: the screen cuts to the battle and the old champion smashes
// the spare button, its pieces flying; back in the hall he raises his guard as the champion's storm comes
// down. He calls out, and one by one the lights of the friends he spared answer and the storm softens; then he
// reaches out, the champion shrinks back into the scared kid he was, and the barrier cracks open with light
// from above.
const MUAY_THAI = { from: -40, guard: 120, reach: 190, champion: 300, kid: 260 }
const SHARDS = 4
const BOLTS = 8
const FRIEND_LIGHTS = [RPG.robe, RPG.scarf, RPG.owl, RPG.visor, RPG.weaver, RPG.jukebox] as const

const muayThai: SceneDef = {
  zone: 'royal',
  kit: 'fighter',
  script: [1800, 1800, 1400],
  back: (layout) => {
    const champion = roomX(layout, MUAY_THAI.champion)
    return (
      <>
        <rect data-fx="skylight" x={r1(champion - 120)} y={0} width={240} height={GROUND} fill={RPG.barrier} opacity={0} />
        <path data-fx="crack" d={`M${r1(champion + 60)} 0 L${r1(champion + 40)} 120 L${r1(champion + 70)} 220 L${r1(champion + 45)} 330`} stroke={RPG.barrier} strokeWidth={10} fill="none" opacity={0} />
        <g data-fx="champion" transform={`translate(${r1(champion)} ${GROUND})`}>
          <g transform={`translate(${r1(10 * U)} 0)`}>
            <Halberd />
          </g>
          <Sprite sprite={CHAMPION} />
        </g>
        <g data-fx="kid" opacity={0} transform={`translate(${r1(roomX(layout, MUAY_THAI.kid))} ${GROUND})`}>
          <Sprite sprite={KID} />
        </g>
        {FRIEND_LIGHTS.map((fill, i) => (
          <g key={fill} data-fx={`friend-${i}`} opacity={0} transform={`translate(${r1(roomX(layout, -20 + i * 60))} ${r1(GROUND - 360 + (i % 2) * 40)})`}>
            <FriendLight fill={fill} />
          </g>
        ))}
        {Array.from({ length: BOLTS }, (_, i) => (
          <g key={i} data-fx={`bolt-${i}`} opacity={0}>
            <Bolt />
          </g>
        ))}
      </>
    )
  },
  screen: (layout) => {
    const { bx, w, bottom } = boxOf(layout)
    const spareX = bx - w + ((2 * w) / 4) * 3.5
    return (
        <Battle layout={layout} foe={CHAMPION} heart={RPG.red}>
          {Array.from({ length: SHARDS }, (_, i) => (
            <rect key={i} data-fx={`shard-${i}`} x={-10} y={-10} width={20} height={20} fill={RPG.wraps} opacity={0} transform={`translate(${r1(spareX)} ${bottom + 70})`} />
          ))}
        </Battle>
    )
  },
  bind: (stage, layout) => {
    const cut = battleCut(stage)
    const box = boxNodes(stage, layout)
    const spareButton = fx(stage, 'button-spare')
    const spareIcon = fx(stage, 'icon-spare')
    const shards = Array.from({ length: SHARDS }, (_, i) => fx(stage, `shard-${i}`))
    const champion = fx(stage, 'champion')
    const kid = fx(stage, 'kid')
    const friends = FRIEND_LIGHTS.map((_, i) => fx(stage, `friend-${i}`))
    const bolts = Array.from({ length: BOLTS }, (_, i) => fx(stage, `bolt-${i}`))
    const crack = fx(stage, 'crack')
    const skylight = fx(stage, 'skylight')
    const [from, guardX, reachX, championX] = [MUAY_THAI.from, MUAY_THAI.guard, MUAY_THAI.reach, MUAY_THAI.champion].map((dx) => roomX(layout, dx))
    const spareX = box.bx - box.w + ((2 * box.w) / 4) * 3.5
    return (_p, _f, play = START) => {
      const guarded = share(play, 0)
      const called = share(play, 1)
      const reached = share(play, 2)
      const shown = cut(ramp(guarded, 0, 0.5), ramp(guarded, 0.5, 1))
      translateTo(box.heart, box.bx, box.mid)
      const broke = ramp(guarded, 0.3, 0.5)
      fadeTo(spareButton, 1 - broke)
      fadeTo(spareIcon, 1 - broke)
      shards.forEach((shard, i) => {
        const a = (i / SHARDS) * Math.PI * 2 + 0.6
        translateTo(shard, spareX + 90 * broke * Math.cos(a), box.bottom + 70 + 90 * broke * Math.sin(a))
        fadeTo(shard, broke > 0 && broke < 1 ? 1 : 0)
      })
      const storm = ramp(guarded, 0.75, 0.9) * (1 - ramp(called, 0.2, 1))
      bolts.forEach((bolt, i) => {
        const fall = ((guarded + called) * 2.2 + i / BOLTS) % 1
        const size = 0.4 + 0.6 * storm
        transformTo(bolt, `translate(${r1(guardX - 140 + ((i * 97) % 300))} ${r1(lerp(60, GROUND - 10, fall))}) scale(${size.toFixed(3)})`)
        fadeTo(bolt, storm)
      })
      friends.forEach((friend, i) => fadeTo(friend, ramp(called, 0.1 + i * 0.12, 0.25 + i * 0.12)))
      const shrink = ramp(reached, 0.3, 0.6)
      placeTo(champion, championX, GROUND, 1 - 0.7 * shrink)
      fadeTo(champion, 1 - shrink)
      fadeTo(kid, ramp(reached, 0.5, 0.7))
      fadeTo(crack, ramp(reached, 0.4, 0.7))
      fadeTo(skylight, 0.35 * ramp(reached, 0.6, 1))
      if (play.action === 0) return guarded < 0.75 ? walker(from, 'standR', 1 - shown) : walk(from, guardX, ramp(guarded, 0.75, 1), 1 - shown)
      if (play.action === 1) return walker(guardX, called < 0.15 ? 'actA' : 'cast')
      return reached < 0.3 ? walk(guardX, reachX, ramp(reached, 0, 0.3)) : walker(reachX, reached < 0.8 ? 'cast' : 'standR')
    }
  },
}

// Contact, the surface: he climbs out of the dark onto the cliff at sunset, the friends of this page's run
// coming up behind him, walks to the save star and touches it; the save box opens over it with a full bar,
// and the scene goes still.
const CONTACT = { from: -20, star: 300, reach: 240 }
// Where the friends stand: past the star on a wide screen, clear of the contact card in the middle; on a
// phone behind him on the left, inside its narrower view.
const FRIENDS_DX = { wide: [340, 372, 404, 436, 468], phone: [-120, -70, -20, 30, 80] } as const
const friendX = (layout: Layout, i: number): number => roomX(layout, FRIENDS_DX[layout.phone ? 'phone' : 'wide'][i])

/** The friends of each page's run: the creatures met in the sections that profession's page shows. */
const FRIENDS: Record<Profession, readonly PixelSprite[]> = {
  engineer: [CARETAKER, SCARF_GUARD, OWL_ASLEEP, HUNTER, WEAVER],
  drummer: [SHOWMAN],
  fighter: [CHAMPION],
}

/** The save box over the star; on a phone higher and smaller, inside its view. */
const saveBoxAt = (x: number, phone: boolean): { x: number; y: number; size: number } => (phone ? { x: x - 120, y: 360, size: 1 } : { x, y: 430, size: 0.55 })

const contact: SceneDef = {
  zone: 'surface',
  kit: null,
  script: [1800, 1600],
  back: (layout, kit, name) => {
    const star = roomX(layout, CONTACT.star)
    const box = saveBoxAt(star, layout.phone)
    return (
      <>
        {FRIENDS[kit].map((sprite, i) => (
          <g key={i} data-fx={`friend-${i}`} opacity={0} transform={`translate(${r1(friendX(layout, i))} ${GROUND}) scale(0.5)`}>
            <Sprite sprite={sprite} />
          </g>
        ))}
        <g data-fx="star" transform={`translate(${r1(star)} ${GROUND})`}>
          <SaveStar />
        </g>
        <g data-fx="save" opacity={0} transform={`translate(${r1(box.x)} ${box.y}) scale(${box.size})`}>
          <rect x={-150} y={-60} width={300} height={120} fill={RPG.void} stroke={RPG.border} strokeWidth={6} />
          <rect x={-120} y={10} width={240} height={20} fill="none" stroke={RPG.border} strokeWidth={3} />
          <rect data-fx="save-bar" x={-117} y={13} width={234} height={14} fill={RPG.gold} />
          <g transform="translate(-110 -14) scale(1.1)">
            <SaveStar />
          </g>
          <text x={-80} y={-20} fill={RPG.text} fontSize={20} className={PIXEL} textLength={name.length > 12 ? 200 : undefined} lengthAdjust="spacingAndGlyphs">
            {name}
          </text>
        </g>
        <rect data-fx="dark" x={-200} y={0} width={1840} height={1000} fill={RPG.void} opacity={0.85} />
      </>
    )
  },
  bind: (stage, layout) => {
    const star = fx(stage, 'star')
    const starX = roomX(layout, CONTACT.star)
    const box = saveBoxAt(starX, layout.phone)
    const save = fx(stage, 'save')
    const bar = fx(stage, 'save-bar')
    const dark = fx(stage, 'dark')
    const friends = FRIENDS_DX.wide.map((_, i) => fx(stage, `friend-${i}`))
    const [from, reachX] = [CONTACT.from, CONTACT.reach].map((dx) => roomX(layout, dx))
    return (_p, _f, play = START) => {
      const climbed = share(play, 0)
      const saved = share(play, 1)
      fadeTo(dark, 0.85 * (1 - ramp(climbed, 0.1, 0.5)))
      friends.forEach((friend, i) => fadeTo(friend, ramp(climbed, 0.45 + i * 0.08, 0.65 + i * 0.08)))
      const open = ramp(saved, 0.2, 0.5)
      fadeTo(save, open)
      transformTo(save, `translate(${r1(box.x)} ${box.y}) scale(${(box.size * (0.8 + 0.2 * open)).toFixed(3)})`)
      transformTo(bar, `scale(${ramp(saved, 0.45, 0.9).toFixed(3)} 1)`)
      transformTo(star, `translate(${r1(starX)} ${GROUND}) scale(${(1 + 0.25 * bell(saved, 0.1, 0.6)).toFixed(3)})`)
      if (play.action === 0) {
        if (climbed < 0.45) return walker(from, 'push', 1, K, GROUND + 200 * (1 - ramp(climbed, 0, 0.45)))
        return walk(from, reachX, ramp(climbed, 0.5, 1))
      }
      return walker(reachX, saved > 0.05 && saved < 0.6 ? 'cast' : 'standR')
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
  /** His name, as the page's hero shows it, for the save box. */
  name: string
}

type RecordWords = Pick<Labels, 'record' | 'years'>

const NO_ITEMS: StageItems = { lead: 0, count: 0 }

const sceneOf = (id: SceneId, slot: SectionSlot | null, items: StageItems, profession: Profession, phone: boolean, name: string): Scene => {
  const def = SCENE_DEFS[id]
  return { id, def, layout: propLayout(items, BAND[phone ? 'phone' : 'wide'], phone), kit: def.kit ?? profession, slot, name }
}

/** The page as scenes: the hero, one per section the profession shows in reading order, the contact. */
export const scenesOf = (slots: readonly SectionSlot[], profession: Profession, phone: boolean, highlights: number, labels: RecordWords, name: string): Scene[] => [
  sceneOf('hero', null, NO_ITEMS, profession, phone, name),
  ...slots.map((slot) => sceneOf(slot.id, slot, stageItems(slot, labels, highlights), profession, phone, name)),
  sceneOf('contact', null, NO_ITEMS, profession, phone, name),
]
