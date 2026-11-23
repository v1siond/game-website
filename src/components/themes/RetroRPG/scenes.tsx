import type { ReactNode } from 'react'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { Labels } from '@/lib/cv/labels'
import { stageItems, type StageItems } from '@/lib/cv/stageItems'
import { litOf } from '@/lib/scroll/propRow'
import { ramp } from '@/lib/scroll/stage'
import { walkAlong } from '@/lib/scroll/walkAlong'
import { fadeTo, fx, lerp, r1, transformTo } from '../shared/stageNodes'
import { propLayout, type FigureState, type FigureWriter, type PropLayout, type StageNodes } from '../shared/figureScene'
import { PropRow, propNodes } from '../shared/propRow'
import { DUMMY, FLOWER, MONSTER, type PixelSprite } from './npcs'
import { PixelArt, type Frame } from './walker'
import { RPG } from './palette'
import { GROUND, PX, type Zone } from './zones'

// Each part of the page as a scene of the walk underground: its place (the ruins, the snow, the waterfall,
// the heat zone, the town), his kit, and a row of props on the floor, one per card the section counts
// (the shared prop row), each lit as he acts on it at the scene's progress p (0 when its stage starts to
// rise, 1 when it has sunk) with f of its cards reached. About: a small monster per highlight, checked and
// let go, hopping off. Work: a lantern post per job in the snow, lit as he keys his pocket terminal. Tech:
// an item chest per category by the waterfall, its lid open and a sparkle over it. Services: a floor
// switch per service in the heat zone, pressed in. Projects: a block of spikes per project, sunk into the
// floor as he crosses. Ventures: a shop door per venture in the town, opened with its window lit. Bands: a
// bell flower per band on the dock, ringing its light while he drums. Muay Thai: a training dummy per
// achievement, struck with a slash. Contact: he walks up to the save star in the ruins. The hero: him in
// the ruins and the small monster across from him, which hops off as the page moves on.
//
// He is the pixel sprite (walker.tsx) and his frames swap the way sprite frames do: two step frames while
// he walks, his profession's two action frames at a prop, the standing frame between.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his feet are, his size, his sprite frame and how visible he is. */
export type WalkerState = FigureState<Frame>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The props behind him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<Frame>
}

// The band the props stand in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [880, 1300], phone: [580, 860] }

/** His size: a sprite pixel is 1.4 grid pixels, so he stands about a quarter of the screen. */
const K = 1.4 * PX

// He comes in from this far left of the first prop as its card nears the reading line.
const ENTRY = 120

const walker = (x: number, frame: Frame, k = K, opacity = 1): WalkerState => ({ x, y: GROUND, k, pose: frame, opacity })

/** His frame: acting at a prop, stepping while he walks, standing between. */
const frameOf = (moving: number, act: number, beat: number, x: number): Frame => {
  if (act > 0.5) return Math.floor(beat * 6) % 2 === 0 ? 'actA' : 'actB'
  if (moving > 0.15) return Math.floor(x / 36) % 2 === 0 ? 'stepA' : 'stepB'
  return 'stand'
}

/** A cast sprite drawn on the grid round its foot (its bottom middle). */
const Sprite = ({ sprite, width, height }: { sprite: PixelSprite; width: number; height: number }) => (
  <g transform={`scale(${PX * 1.4})`}>
    <PixelArt sprite={sprite} x={-width / 2} y={-height} />
  </g>
)

/** A shape on the grid round its foot, blown up to the canvas. */
const Px = ({ children, k = 1.4 }: { children: ReactNode; k?: number }) => <g transform={`scale(${PX * k})`}>{children}</g>

// ---------------------------------------------------------------- a row scene: one prop per card

interface RowDef {
  zone: Zone
  kit: Profession | null
  art: (i: number) => ReactNode
  light: (i: number) => ReactNode
  /** What lighting a prop does to its art, at its light l from 0 to 1. */
  moved?: (l: number) => { transform?: string; opacity?: number }
  /** Where he stands from the prop he acts on. */
  offset: number
}

const rowScene = ({ zone, kit, art, light, moved, offset }: RowDef): SceneDef => ({
  zone,
  kit,
  back: ({ xs }) => <PropRow xs={xs} floor={GROUND} art={(i) => art(i)} light={(i) => light(i)} />,
  bind: (stage, { xs, count }) => {
    const props = propNodes(stage, count)
    return (p, f) => {
      props.forEach(({ move, lit }, i) => {
        const l = litOf(f, i)
        fadeTo(lit, l)
        if (!moved) return
        const { transform, opacity } = moved(l)
        if (transform !== undefined) transformTo(move, transform)
        if (opacity !== undefined) fadeTo(move, opacity)
      })
      const { x, moving, act } = walkAlong(xs, f, offset, ENTRY)
      return walker(x, frameOf(moving, act, f + p, x))
    }
  },
})

// ---------------------------------------------------------------- the props

const Sparkle = ({ y, fill = RPG.gold }: { y: number; fill?: string }) => (
  <Px>
    <path d={`M-1 ${y - 4} h2 v3 h3 v2 h-3 v3 h-2 v-3 h-3 v-2 h3 Z`} fill={fill} />
  </Px>
)

const Lantern = () => (
  <Px>
    <rect x={-1} y={-40} width={2} height={40} fill={RPG.woodDark} />
    <rect x={-4} y={-46} width={8} height={7} fill={RPG.pine} />
    <rect x={-3} y={-45} width={6} height={5} fill={RPG.snowShade} />
    <rect x={-5} y={-47} width={10} height={2} fill={RPG.woodDark} />
  </Px>
)

const LanternLit = () => (
  <Px>
    <rect x={-9} y={-50} width={18} height={15} fill={RPG.gold} opacity={0.35} />
    <rect x={-3} y={-45} width={6} height={5} fill={RPG.gold} />
  </Px>
)

const Chest = () => (
  <Px>
    <rect x={-8} y={-10} width={16} height={10} fill={RPG.shopDark} />
    <rect x={-8} y={-14} width={16} height={4} fill={RPG.shopWood} />
    <rect x={-1} y={-9} width={2} height={3} fill={RPG.gold} />
  </Px>
)

const ChestOpen = () => (
  <>
    <Px>
      <rect x={-8} y={-14} width={16} height={4} fill={RPG.void} />
      <rect x={-8} y={-20} width={16} height={4} fill={RPG.shopWood} />
    </Px>
    <Sparkle y={-24} />
  </>
)

const Switch = () => (
  <Px>
    <rect x={-7} y={-3} width={14} height={3} fill={RPG.heatDeep} />
    <rect x={-5} y={-6} width={10} height={3} fill={RPG.borderShade} />
  </Px>
)

const SwitchOn = () => (
  <Px>
    <rect x={-5} y={-6} width={10} height={3} fill={RPG.heatDeep} />
    <rect x={-5} y={-4} width={10} height={1} fill={RPG.gold} />
  </Px>
)

const Spikes = () => (
  <Px>
    <rect x={-8} y={-2} width={16} height={2} fill={RPG.borderShade} />
    {[-6, -2, 2, 6].map((x) => (
      <path key={x} d={`M${x - 2} -2 L${x} -8 L${x + 2} -2 Z`} fill={RPG.border} />
    ))}
  </Px>
)

const SpikesDown = () => (
  <Px>
    <rect x={-8} y={-2} width={16} height={2} fill={RPG.gold} />
  </Px>
)

const Door = () => (
  <Px>
    <rect x={-9} y={-24} width={18} height={24} fill={RPG.townWall} />
    <rect x={-10} y={-27} width={20} height={3} fill={RPG.townRoof} />
    <rect x={-4} y={-16} width={8} height={16} fill={RPG.townRoof} />
    <rect x={-7} y={-21} width={4} height={4} fill={RPG.townMint} />
    <rect x={3} y={-21} width={4} height={4} fill={RPG.townMint} />
  </Px>
)

const DoorOpen = () => (
  <Px>
    <rect x={-4} y={-16} width={8} height={16} fill={RPG.void} />
    <rect x={-7} y={-21} width={4} height={4} fill={RPG.gold} />
    <rect x={3} y={-21} width={4} height={4} fill={RPG.gold} />
  </Px>
)

const FlowerRing = () => (
  <Px>
    <rect x={-6} y={-16} width={12} height={8} fill={RPG.glow} opacity={0.35} />
    <rect x={-8} y={-14} width={16} height={4} fill={RPG.glow} opacity={0.25} />
  </Px>
)

const Slash = () => (
  <Px>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={-6 + i * 2} y={-16 + i * 2} width={2} height={2} fill={RPG.border} />
    ))}
  </Px>
)

// ---------------------------------------------------------------- the hero

const HERO_AT = { wide: { foe: 300, him: 1180 }, phone: { foe: 600, him: 820 } }

const hero: SceneDef = {
  zone: 'ruins',
  kit: null,
  back: ({ phone }) => (
    <g data-fx="foe" transform={`translate(${HERO_AT[phone ? 'phone' : 'wide'].foe} ${GROUND})`}>
      <Sprite sprite={MONSTER} width={16} height={12} />
    </g>
  ),
  bind: (stage, { phone }) => {
    const foe = fx(stage, 'foe')
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (p) => {
      // let go as the page moves on: it hops up and out of the room
      const off = ramp(p, 0.15, 0.6)
      transformTo(foe, `translate(${r1(at.foe - 160 * off)} ${r1(GROUND - 120 * Math.sin(Math.PI * Math.min(1, off * 1.2)))})`)
      fadeTo(foe, 1 - ramp(p, 0.45, 0.6))
      return walker(at.him, 'stand', phone ? 1.6 * PX : 1.9 * PX)
    }
  },
}

// ---------------------------------------------------------------- the sections

const about = rowScene({
  zone: 'ruins',
  kit: null,
  art: () => <Sprite sprite={MONSTER} width={16} height={12} />,
  light: () => <Sparkle y={-22} />,
  moved: (l) => ({ transform: `translate(0 ${r1(-90 * l)})`, opacity: 1 - l }),
  offset: -110,
})

const work = rowScene({ zone: 'snow', kit: 'engineer', art: () => <Lantern />, light: () => <LanternLit />, offset: -90 })

const tech = rowScene({ zone: 'water', kit: 'engineer', art: () => <Chest />, light: () => <ChestOpen />, offset: -100 })

const services = rowScene({ zone: 'heat', kit: 'engineer', art: () => <Switch />, light: () => <SwitchOn />, offset: -70 })

const projects = rowScene({
  zone: 'heat',
  kit: 'engineer',
  art: () => <Spikes />,
  light: () => <SpikesDown />,
  moved: (l) => ({ transform: `translate(0 ${r1(40 * l)})`, opacity: 1 - l }),
  offset: -90,
})

const ventures = rowScene({ zone: 'town', kit: 'engineer', art: () => <Door />, light: () => <DoorOpen />, offset: -100 })

const bands = rowScene({ zone: 'water', kit: 'drummer', art: () => <Sprite sprite={FLOWER} width={7} height={11} />, light: () => <FlowerRing />, offset: -90 })

const muayThai = rowScene({
  zone: 'heat',
  kit: 'fighter',
  art: () => <Sprite sprite={DUMMY} width={12} height={16} />,
  light: () => <Slash />,
  moved: (l) => ({ transform: `rotate(${r1(-12 * l)})` }),
  offset: -100,
})

// ---------------------------------------------------------------- Contact: the save star

const STAR = 'M7 0 H8 V4 H9 V6 H11 V7 H15 V8 H11 V9 H9 V11 H8 V15 H7 V11 H6 V9 H4 V8 H0 V7 H4 V6 H6 V4 H7 Z'

const contact: SceneDef = {
  zone: 'ruins',
  kit: null,
  back: ({ cx }) => (
    <g transform={`translate(${r1(cx + 90)} ${GROUND - 40 * PX})`}>
      <g data-fx="star-glow" opacity={0}>
        <Px k={2}>
          <rect x={-2} y={-2} width={19} height={19} fill={RPG.starGlow} opacity={0.4} />
        </Px>
      </g>
      <Px k={2}>
        <path d={STAR} fill={RPG.gold} />
        <rect x={6} y={6} width={3} height={3} fill={RPG.starCore} />
      </Px>
    </g>
  ),
  bind: (stage, { cx }) => {
    const glow = fx(stage, 'star-glow')
    return (p) => {
      const there = ramp(p, 0.2, 0.5)
      const x = lerp(cx - 420, cx + 90, there)
      fadeTo(glow, ramp(p, 0.5, 0.6))
      const moving = there > 0 && there < 1 ? 1 : 0
      return walker(x, frameOf(moving, 0, p, x))
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
