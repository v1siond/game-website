import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { stretchesOf } from '@/lib/motion/sideScroll'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { Back, Canvas, Far, Fog, Front, Ground, Mid, Mist, PHONE_TOP, PhoneTop, Sky, framingOf, type Region, type Run } from './forest'
import { LIGHTS, type LightName } from './palette'
import { Stretch, bindStretch, type Place, type PlaceInput } from './place'
import { about } from './places/about'
import { bands } from './places/bands'
import { contact } from './places/contact'
import { hero } from './places/hero'
import { muayThai } from './places/muayThai'
import { projects } from './places/projects'
import { services } from './places/services'
import { tech } from './places/tech'
import { ventures } from './places/ventures'
import { work } from './places/work'

// The page as one run through one level of the side scroller, its story told in the game's order as his own
// search: he wakes in the grass at the forest's edge and sees one lit window far off (hero), crosses the
// water, baits the giant spider's leg into a trap, rides away from its snare as it runs after him, leads the
// hostile boys into their own crushers, is marched away by a worm on his head just as he sees the girl under
// the window, cuts the sign that kills in the dead city, crosses the foundry's beat and the gravity room, and
// breaks through the glass back to the forest's edge, where the window is near and the girl under it turns to
// him (contact). Each section of the shown profession is the next stretch of the level, laid right after the
// one before, so the camera that follows him through one scene starts the next where it left him. Every
// stretch past the hero stands in the profession's own light, a grey only just tinted: cold at dawn for the
// System Engineer, warm for the Musician, faintly red at dusk for the Martial Artist. Behind the ground the fog
// lies in planes: the far trunks out of focus, a fog band, a grey plane, the mid trunks, the low mist.
// Each scene names its stretch, its anchor, its script of one to three actions the scroll plays, and how
// many cards its section counts (stageItems) for the theatre's reading line.

export type SceneId = 'hero' | SectionId | 'contact'

const PLACES: Record<SceneId, Place> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

const ANCHORS: Record<SceneId, string> = {
  hero: 'top',
  about: 'about',
  work: 'work',
  tech: 'tech',
  services: 'services',
  projects: 'projects',
  ventures: 'ventures',
  bands: 'bands',
  muayThai: 'muay-thai',
  contact: 'contact',
}

const PROFESSION_LIGHT: Record<Profession, LightName> = { engineer: 'dawn', drummer: 'ember', fighter: 'crimson' }

export interface ShadeScene extends TheatreScene {
  id: SceneId
  anchor: string
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const layersOf = (id: SceneId, place: Place, input: PlaceInput, run: Run, light: LightName): StageLayer[] =>
  layerNodes(id, place, input, run, light).map(({ name, node }) => ({
    name,
    node: <PhoneTop.Provider value={place.phoneTop ?? PHONE_TOP}>{node}</PhoneTop.Provider>,
  }))

const layerNodes = (id: SceneId, place: Place, input: PlaceInput, run: Run, light: LightName): StageLayer[] => [
  { name: 'sky', node: <Sky light={light} /> },
  { name: 'far', node: <Far run={run} light={input.light} distant={place.distant?.(input)} /> },
  { name: 'fog', node: <Fog run={run} light={input.light} /> },
  { name: 'back', node: <Back run={run} light={input.light} /> },
  { name: 'mid', node: <Mid run={run} light={input.light} /> },
  { name: 'mist', node: <Mist run={run} light={input.light} /> },
  { name: 'near', node: <Ground run={run} light={input.light} gaps={place.gaps} /> },
  {
    name: 'figure',
    node: (
      <Canvas>
        <Stretch place={place} input={input} run={run} marked={id === 'hero'} />
      </Canvas>
    ),
  },
  { name: 'fg', node: <Front run={run} /> },
]

interface Planned {
  id: SceneId
  slot: SectionSlot | null
  count: number
}

/** Every scene of the page in order, each its stretch of the one level and what its picture is built from. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession, phone: boolean): ShadeScene[] {
  const planned: Planned[] = [
    { id: 'hero', slot: null, count: 0 },
    ...slots.map((slot) => {
      const { lead, count } = stageItems(slot, labels, highlights)
      return { id: slot.id, slot, count: lead + count }
    }),
    { id: 'contact', slot: null, count: 0 },
  ]
  // the hero's run also crosses the screen from where he wakes to the hold
  const framings = planned.map(({ id }) => framingOf(id === 'hero', phone))
  const lengths = planned.map(({ id }, i) => PLACES[id].length + framings[i].hold - framings[i].start)
  const stretches = stretchesOf(lengths)
  const regionAt = (x: number): Region => {
    const at = stretches.findIndex(({ to }) => x < to)
    return PLACES[planned[at === -1 ? planned.length - 1 : at].id].region
  }
  return planned.map(({ id, slot, count }, i) => {
    const place = PLACES[id]
    const light = id === 'hero' ? 'dawn' : PROFESSION_LIGHT[profession]
    const input = { profession, light: LIGHTS[light] }
    const run: Run = { ...framings[i], from: stretches[i].from, length: lengths[i], region: place.region, regionAt }
    return {
      id,
      anchor: ANCHORS[id],
      slot,
      count,
      script: place.script,
      layers: layersOf(id, place, input, run, light),
      bind: (stage) => bindStretch(place, run, stage, input),
    }
  })
}

/** The camera's follow carries the depth now, so the layers only breathe: a slight push in on the sky and
 *  the soft shapes in front, the ground, what stands on it and he held level so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.02], lift: [0, 0] },
  far: { zoom: [1.0, 1.0], lift: [0, 0] },
  fog: { zoom: [1.0, 1.0], lift: [0, 0] },
  back: { zoom: [1.0, 1.0], lift: [0, 0] },
  mid: { zoom: [1.0, 1.0], lift: [0, 0] },
  mist: { zoom: [1.0, 1.0], lift: [0, 0] },
  near: { zoom: [1.0, 1.0], lift: [0, 0] },
  figure: { zoom: [1.0, 1.0], lift: [0, 0] },
  fg: { zoom: [1.0, 1.04], lift: [0, 0] },
}
