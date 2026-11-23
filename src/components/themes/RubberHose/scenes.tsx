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
import { PieEyes } from './art'
import { HOSE } from './palette'
import type { Frame } from './toon'
import { GROUND, type Zone } from './zones'

// Each part of the page as a scene of a cartoon's walk from the meadow through the carnival to the casino:
// its place, his kit, and a row of props on the ground, one per card the section counts (the shared prop
// row), each set off as he acts on it at the scene's progress p (0 when its stage starts to rise, 1 when it
// has sunk) with f of its cards reached. About: a faced flower per highlight, blooming as he points his
// finger gun. Work: a pennant per job, raised on its pole. Tech: a balloon per category, let go up into the
// sky. Services: a sign per service, turned to its painted face. Projects: a bottle per project on the
// shooting gallery shelf, knocked over. Ventures: a striped booth per venture, its lamp lit. Bands: a record
// per band, ringed in gold while he drums. Muay Thai: a punching bag per achievement, swung by his jab. Contact: he
// walks into the spotlight at the microphone. The hero: him in the meadow beside the big faced flower.
//
// He is the rubber hose cartoon of toon.tsx, drawn still in each frame; the scroll picks the frame: two
// strides while he walks, his profession's two act frames at a prop, the standing frame between.

export type SceneId = 'hero' | SectionId | 'contact'

type Layout = PropLayout

/** Him in a frame: where his shoes are, his size, his frame and how visible he is. */
export type ToonState = FigureState<Frame>

export interface SceneDef {
  zone: Zone
  /** His kit in the scene; null takes the profession the page shows. */
  kit: Profession | null
  /** The props behind him, drawn in the figure layer. */
  back: (layout: Layout) => ReactNode
  bind: (stage: StageNodes, layout: Layout) => FigureWriter<Frame>
}

// The band the props stand in: right of the text column on a wide screen, the middle a phone shows.
const BAND: Record<'wide' | 'phone', readonly [number, number]> = { wide: [880, 1320], phone: [560, 880] }

/** His size on the canvas: his 170 unit box about a quarter of the screen. */
const K = 1.7

// He comes in from this far left of the first prop as its card nears the reading line.
const ENTRY = 120

const INK = HOSE.ink

const toon = (zone: Zone, x: number, frame: Frame, k = K, opacity = 1): ToonState => ({ x, y: GROUND[zone], k, pose: frame, opacity })

/** His frame: acting at a prop, striding while he walks, standing between. */
const frameOf = (moving: number, act: number, beat: number, x: number): Frame => {
  if (act > 0.5) return Math.floor(beat * 6) % 2 === 0 ? 'actA' : 'actB'
  if (moving > 0.15) return Math.floor(x / 40) % 2 === 0 ? 'stepA' : 'stepB'
  return 'stand'
}

// ---------------------------------------------------------------- a row scene: one prop per card

interface RowDef {
  zone: Zone
  kit: Profession | null
  art: (i: number) => ReactNode
  light: (i: number) => ReactNode
  /** What setting a prop off does to its art, at its light l from 0 to 1. */
  moved?: (l: number, i: number) => { transform?: string; opacity?: number }
  /** Where he stands from the prop he acts on. */
  offset: number
}

const rowScene = ({ zone, kit, art, light, moved, offset }: RowDef): SceneDef => ({
  zone,
  kit,
  back: ({ xs }) => <PropRow xs={xs} floor={GROUND[zone]} art={(i) => art(i)} light={(i) => light(i)} />,
  bind: (stage, { xs, count }) => {
    const props = propNodes(stage, count)
    return (p, f) => {
      props.forEach(({ move, lit }, i) => {
        const l = litOf(f, i)
        fadeTo(lit, l)
        if (!moved) return
        const { transform, opacity } = moved(l, i)
        if (transform !== undefined) transformTo(move, transform)
        if (opacity !== undefined) fadeTo(move, opacity)
      })
      const { x, moving, act } = walkAlong(xs, f, offset, ENTRY)
      return toon(zone, x, frameOf(moving, act, f + p, x))
    }
  },
})

// ---------------------------------------------------------------- the props, drawn round their foot

function Flower({ petal, size = 1 }: { petal: string; size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      <path d="M0 0 Q-8 -60 0 -120" fill="none" stroke={HOSE.meadowDark} strokeWidth={8} />
      <path d="M-2 -50 Q-36 -72 -46 -54 Q-24 -38 -2 -44" fill={HOSE.meadow} stroke={INK} strokeWidth={4} />
      <g transform="translate(0 -140)">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx={0} cy={-26} rx={14} ry={22} fill={petal} stroke={INK} strokeWidth={4} transform={`rotate(${a})`} />
        ))}
        <circle r={21} fill={HOSE.gold} stroke={INK} strokeWidth={4.4} />
        <PieEyes cx={0} cy={-3} size={24} paper={HOSE.gold} />
        <path d="M-8 8 Q0 15 8 8" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      </g>
    </g>
  )
}

const Bloom = () => <circle cy={-140} r={62} fill={HOSE.highlight} opacity={0.55} />

const POLE = 200

const Pennant = () => (
  <>
    <rect x={-4} y={-POLE} width={8} height={POLE} fill={HOSE.inkSoft} />
    <circle cy={-POLE} r={9} fill={HOSE.gold} stroke={INK} strokeWidth={3} />
  </>
)

const PennantFlag = () => <path d="M4 -46 L76 -30 L4 -14 Z" fill={HOSE.red} stroke={INK} strokeWidth={4} strokeLinejoin="round" />

const Balloon = ({ tint }: { tint: string }) => (
  <>
    <path d="M0 -12 Q10 -60 0 -110" fill="none" stroke={INK} strokeWidth={3} />
    <ellipse cy={-150} rx={34} ry={42} fill={tint} stroke={INK} strokeWidth={4.4} />
    <path d="M-6 -108 L6 -108 L0 -100 Z" fill={tint} stroke={INK} strokeWidth={3} />
    <ellipse cx={-12} cy={-164} rx={7} ry={12} fill={HOSE.highlight} opacity={0.6} />
  </>
)

const BALLOONS = [HOSE.red, HOSE.blue, HOSE.gold, HOSE.orange]

const Sign = () => (
  <>
    <rect x={-5} y={-150} width={10} height={150} fill={HOSE.inkSoft} />
    <g>
      <rect x={-50} y={-210} width={100} height={66} rx={8} fill={HOSE.paperDark} stroke={INK} strokeWidth={4.4} />
      <path d="M-34 -190 H34 M-34 -174 H18 M-34 -158 H26" stroke={HOSE.shadow} strokeWidth={6} />
    </g>
  </>
)

const SignFace = () => (
  <g>
    <rect x={-50} y={-210} width={100} height={66} rx={8} fill={HOSE.red} stroke={INK} strokeWidth={4.4} />
    <path d="M0 -196 L7 -183 L21 -181 L11 -171 L13 -157 L0 -164 L-13 -157 L-11 -171 L-21 -181 L-7 -183 Z" fill={HOSE.gold} stroke={INK} strokeWidth={3} />
  </g>
)

const Shelf = () => <rect x={-40} y={-8} width={80} height={8} fill={HOSE.shadowDark} stroke={INK} strokeWidth={3} />

const Bottle = () => (
  <g>
    <path d="M-14 -8 V-60 Q-14 -72 -6 -78 V-100 H6 V-78 Q14 -72 14 -60 V-8 Z" fill={HOSE.feltGreen} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-14} y={-56} width={28} height={20} fill={HOSE.paper} stroke={INK} strokeWidth={3} />
  </g>
)

const Pop = () => <path d="M0 -120 L10 -100 L32 -104 L16 -88 L28 -68 L6 -78 L-6 -58 L-8 -82 L-30 -88 L-10 -98 Z" fill={HOSE.parry} stroke={INK} strokeWidth={3} strokeLinejoin="round" />

const Booth = () => (
  <>
    <rect x={-46} y={-120} width={92} height={120} fill={HOSE.paper} stroke={INK} strokeWidth={4.4} />
    {[-30, -6, 18].map((x) => (
      <rect key={x} x={x} y={-150} width={12} height={34} fill={HOSE.red} />
    ))}
    <path d="M-56 -116 L0 -170 L56 -116 Z" fill="none" stroke={INK} strokeWidth={4.4} strokeLinejoin="round" />
    <rect x={-26} y={-96} width={52} height={40} fill={HOSE.inkSoft} stroke={INK} strokeWidth={3} />
  </>
)

const BoothLamp = () => (
  <>
    <rect x={-26} y={-96} width={52} height={40} fill={HOSE.gold} stroke={INK} strokeWidth={3} />
    <circle cy={-180} r={12} fill={HOSE.gold} stroke={INK} strokeWidth={3} />
  </>
)

const Record = () => (
  <g>
    <rect x={-4} y={-70} width={8} height={70} fill={HOSE.inkSoft} />
    <g>
      <circle cy={-120} r={48} fill={HOSE.film} stroke={INK} strokeWidth={4} />
      <circle cy={-120} r={32} fill="none" stroke={HOSE.inkSoft} strokeWidth={2} />
      <circle cy={-120} r={16} fill={HOSE.red} />
      <path d="M-6 -120 H6" stroke={HOSE.paper} strokeWidth={4} />
    </g>
  </g>
)

const RecordGlow = () => <circle cy={-120} r={60} fill="none" stroke={HOSE.gold} strokeWidth={6} />

const Bag = () => (
  <>
    <path d="M-50 -260 H50" stroke={INK} strokeWidth={6} />
    <path d="M0 -260 V-220" stroke={INK} strokeWidth={4} />
    <rect x={-26} y={-220} width={52} height={130} rx={24} fill={HOSE.red} stroke={INK} strokeWidth={4.4} />
    <rect x={-26} y={-190} width={52} height={10} fill={HOSE.redDark} />
  </>
)

const Hit = () => <path d="M-30 -170 L-60 -186 M-30 -150 L-66 -150 M-30 -130 L-60 -114" stroke={HOSE.gold} strokeWidth={6} strokeLinecap="round" />

// ---------------------------------------------------------------- the hero

const HERO_AT = { wide: { flower: 200, him: 1240 }, phone: { flower: 560, him: 820 } }

const hero: SceneDef = {
  zone: 'meadow',
  kit: null,
  back: ({ phone }) => (
    <g data-fx="flower" transform={`translate(${HERO_AT[phone ? 'phone' : 'wide'].flower} ${GROUND.meadow})`}>
      <Flower petal={HOSE.orange} size={1.6} />
    </g>
  ),
  bind: (stage, { phone }) => {
    const flower = fx(stage, 'flower')
    const at = HERO_AT[phone ? 'phone' : 'wide']
    return (p) => {
      // the big flower sways to him as the page moves on, then bows out
      transformTo(flower, `translate(${at.flower} ${GROUND.meadow}) rotate(${r1(12 * Math.sin(p * 8) - 20 * ramp(p, 0.4, 0.7))})`)
      return toon('meadow', at.him, 'stand', phone ? 1.9 : 2.2)
    }
  },
}

// ---------------------------------------------------------------- the sections

const PETALS = [HOSE.orange, HOSE.red, HOSE.gold]

const about = rowScene({
  zone: 'meadow',
  kit: null,
  art: (i) => <Flower petal={PETALS[i % PETALS.length]} />,
  light: () => <Bloom />,
  moved: (l) => ({ transform: `rotate(${r1(-14 * Math.sin(Math.PI * l))})` }),
  offset: -110,
})

const work = rowScene({
  zone: 'meadow',
  kit: 'engineer',
  art: () => <Pennant />,
  light: () => <PennantFlag />,
  offset: -90,
})

const tech = rowScene({
  zone: 'carnival',
  kit: 'engineer',
  art: (i) => <Balloon tint={BALLOONS[i % BALLOONS.length]} />,
  light: () => null,
  moved: (l) => ({ transform: `translate(0 ${r1(-420 * l)})`, opacity: 1 - l }),
  offset: -100,
})

const services = rowScene({
  zone: 'carnival',
  kit: 'engineer',
  art: () => <Sign />,
  light: () => <SignFace />,
  offset: -100,
})

const projects = rowScene({
  zone: 'carnival',
  kit: 'engineer',
  art: () => (
    <>
      <Shelf />
      <Bottle />
    </>
  ),
  light: () => <Pop />,
  moved: (l) => ({ transform: `translate(${r1(30 * l)} 0) rotate(${r1(80 * l)} 14 -8)` }),
  offset: -110,
})

const ventures = rowScene({ zone: 'carnival', kit: 'engineer', art: () => <Booth />, light: () => <BoothLamp />, offset: -110 })

const bands = rowScene({ zone: 'casino', kit: 'drummer', art: () => <Record />, light: () => <RecordGlow />, offset: -100 })

const muayThai = rowScene({
  zone: 'casino',
  kit: 'fighter',
  art: () => <Bag />,
  light: () => <Hit />,
  moved: (l) => ({ transform: `rotate(${r1(18 * Math.sin(Math.PI * Math.min(1, l * 1.5)))} 0 -260)` }),
  offset: -110,
})

// ---------------------------------------------------------------- Contact: the spotlight and the microphone

const contact: SceneDef = {
  zone: 'casino',
  kit: null,
  back: ({ cx }) => (
    <>
      <path data-fx="spot" d={`M${r1(cx + 20)} -10 L${r1(cx - 160)} ${GROUND.casino + 30} H${r1(cx + 200)} Z`} fill={HOSE.highlight} opacity={0} />
      <g transform={`translate(${r1(cx + 90)} ${GROUND.casino})`}>
        <rect x={-30} y={-6} width={60} height={6} fill={INK} />
        <rect x={-3} y={-170} width={6} height={166} fill={HOSE.inkSoft} />
        <rect x={-12} y={-210} width={24} height={44} rx={12} fill={HOSE.shadow} stroke={INK} strokeWidth={4} />
      </g>
    </>
  ),
  bind: (stage, { cx }) => {
    const spot = fx(stage, 'spot')
    return (p) => {
      const there = ramp(p, 0.2, 0.5)
      const x = lerp(cx - 420, cx + 20, there)
      fadeTo(spot, 0.35 * ramp(p, 0.5, 0.6))
      const moving = there > 0 && there < 1 ? 1 : 0
      return toon('casino', x, frameOf(moving, 0, p, x))
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
