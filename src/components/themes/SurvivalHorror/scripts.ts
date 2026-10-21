import type { Profession } from '@/lib/cv/professions'
import type { HeroPose } from './survivor'
import type { StalkerPose } from './stalker'
import type { Condition } from './ecg'

// What he and the pursuer do in each room behind the page (./stage), as timed beats. A room's script runs
// once when its part of the page scrolls into view, then the figures hold its last frame and only breathe.
// It runs again only when what it shows changes: the item box on a new profession, the gym on a new
// condition, the safe room on a save. Reduced motion, or a script already played, shows the last frame
// at once, which is every beat folded over the start.
//
// Places are in his body widths from where he stands at the left of the screen, so a prop, he and the
// pursuer line up at every screen size: the stage turns a place into translateX(place * 100%) on boxes as
// wide as him.

export type Zone = 'hall' | 'store' | 'about' | 'experience' | 'tech' | 'projects' | 'ventures' | 'bands' | 'gym' | 'contact'

export interface Flags {
  // hall: the laser sight on; store: the chest lid up; about: the desk lamp lit, the page turned;
  // tech: the spent magazine on the floor, the lamp swinging; projects: the back door open; ventures: the
  // trader's coat open; bands: the suit door open; contact: the safe door open, the door shaking under the
  // blows, the cut inside the safe room.
  laser: boolean
  lid: boolean
  lamp: boolean
  turned: boolean
  dropped: boolean
  swing: boolean
  backDoor: boolean
  coat: boolean
  suitDoor: boolean
  safeDoor: boolean
  shake: boolean
  inside: boolean
}

export interface Frame {
  hero: HeroPose
  // His place, how long his move to it takes (linear, the genre's tank walk), and which way he faces.
  x: number
  move: number
  face: 1 | -1
  // He has gone through a door and out of the camera.
  gone: boolean
  // How long his joints take to reach the pose.
  tempo: number
  // The pursuer: none, near (the same floor as him) or far (behind the glass, small and dark).
  foe: StalkerPose | null
  fx: number
  fmove: number
  far: boolean
  flags: Flags
}

export type Beat = { at: number } & Partial<Omit<Frame, 'flags'>> & { set?: Partial<Flags> }

export interface Script {
  start: Partial<Omit<Frame, 'flags'>> & { set?: Partial<Flags> }
  beats: Beat[]
}

export interface ScriptContext {
  profession: Profession
  condition: Condition
  saves: number
  // The hall waits for the door into the house to finish before he walks in.
  entrance: number
}

const NO_FLAGS: Flags = {
  laser: false,
  lid: false,
  lamp: false,
  turned: false,
  dropped: false,
  swing: false,
  backDoor: false,
  coat: false,
  suitDoor: false,
  safeDoor: false,
  shake: false,
  inside: false,
}

const BASE: Frame = { hero: 'stand', x: 0, move: 0, face: 1, gone: false, tempo: 320, foe: null, fx: 8, fmove: 0, far: false, flags: NO_FLAGS }

// Off camera to the left and to the right of every screen.
const OFF_LEFT = -4
const OFF_RIGHT = 10
const OFF_FAR_LEFT = -6

/** A frame with a beat applied: its fields over the frame's, its flags over the frame's flags. */
export function apply(frame: Frame, beat: Partial<Beat>): Frame {
  const fields = Object.fromEntries(Object.entries(beat).filter(([name]) => name !== 'at' && name !== 'set')) as Partial<Frame>
  return { ...frame, ...fields, flags: { ...frame.flags, ...beat.set } }
}

export const startFrame = (script: Script) => apply(BASE, script.start)

/** Every beat folded over the start, with no moves left to play: the frame a finished script holds. */
export const lastFrame = (script: Script): Frame => ({ ...script.beats.reduce(apply, startFrame(script)), move: 0, fmove: 0, tempo: 0 })

interface Walk {
  from: number
  to: number
  ms: number
  poses?: readonly [HeroPose, HeroPose]
  step?: number
  end?: HeroPose
}

const steps = (from: number, ms: number, step: number) => Array.from({ length: Math.max(1, Math.round(ms / step)) }, (_, index) => from + index * step)

/** He crosses to `to` over `ms`, his legs swapping between the two poses each step, then takes `end`. */
function walk({ from, to, ms, poses = ['walkA', 'walkB'], step = 360, end = 'stand' }: Walk): Beat[] {
  const strides = steps(from, ms, step).map((at, index): Beat => ({ at, hero: poses[index % 2], tempo: step }))
  return [{ ...strides[0], x: to, move: ms }, ...strides.slice(1), { at: from + ms, hero: end, tempo: 320 }]
}

/** The pursuer's walk: the same, on his own place. */
function stalk({ from, to, ms, poses = ['walkA', 'walkB'], step = 520, end = 'stand' }: Omit<Walk, 'poses' | 'end'> & { poses?: readonly [StalkerPose, StalkerPose]; end?: StalkerPose }): Beat[] {
  const strides = steps(from, ms, step).map((at, index): Beat => ({ at, foe: poses[index % 2] }))
  return [{ ...strides[0], fx: to, fmove: ms }, ...strides.slice(1), { at: from + ms, foe: end }]
}

const READY: Record<Profession, { pose: HeroPose; laser: boolean }> = {
  engineer: { pose: 'aim', laser: true },
  drummer: { pose: 'sticksUp', laser: false },
  fighter: { pose: 'guard', laser: false },
}

const byTime = (beats: Beat[]) => [...beats].sort((a, b) => a.at - b.at)

// He walks into the hall under the chandelier and takes his profession's ready stance.
function hall({ profession, entrance }: ScriptContext): Script {
  const ready = READY[profession]
  return {
    start: { x: OFF_LEFT, hero: 'walkA' },
    beats: [...walk({ from: entrance, to: 0.8, ms: 1400, end: ready.pose }), { at: entrance + 1700, set: { laser: ready.laser } }],
  }
}

// He walks to the chest, kneels, opens it, takes the item of his profession and holds it up.
function store(): Script {
  return {
    start: { x: OFF_LEFT, hero: 'walkA' },
    beats: [
      ...walk({ from: 0, to: 0.1, ms: 1300 }),
      { at: 1400, hero: 'kneel', tempo: 420 },
      { at: 1800, set: { lid: true } },
      { at: 2100, hero: 'take' },
      { at: 2600, hero: 'lift', tempo: 480 },
      { at: 3200, set: { lid: false } },
    ],
  }
}

// At the desk: the lamp clicks on, he picks up the paper, reads, turns the page.
function about(): Script {
  return {
    start: { x: 0.1 },
    beats: [
      { at: 300, set: { lamp: true } },
      { at: 700, hero: 'reach' },
      { at: 1200, hero: 'read', tempo: 420 },
      { at: 2800, hero: 'readTurn', set: { turned: true } },
      { at: 3300, hero: 'read' },
    ],
  }
}

// The long corridor: the pursuer crosses behind the glass; he turns to it, raises the gun, lowers it.
function experience(): Script {
  return {
    start: { x: OFF_LEFT, hero: 'walkA', foe: 'walkA', fx: OFF_RIGHT, far: true },
    beats: byTime([
      ...walk({ from: 0, to: 0.3, ms: 1200 }),
      ...stalk({ from: 600, to: OFF_FAR_LEFT, ms: 7000 }),
      { at: 1900, hero: 'alert', tempo: 260 },
      { at: 3300, hero: 'aim', tempo: 420 },
      { at: 6400, hero: 'stand' },
      { at: 7700, foe: null },
    ]),
  }
}

// The armoury: he checks the gun, drops the spent magazine, loads a fresh one, racks it and aims; a blow
// somewhere in the house swings the lamp, he turns to the sound.
function tech(): Script {
  return {
    start: { x: 0.3 },
    beats: [
      { at: 200, hero: 'gunCheck' },
      { at: 900, hero: 'reloadDrop', set: { dropped: true } },
      { at: 1400, hero: 'reloadReach' },
      { at: 1900, hero: 'reloadInsert' },
      { at: 2400, hero: 'rack', tempo: 200 },
      { at: 3000, hero: 'aim' },
      { at: 3700, set: { swing: true } },
      { at: 3800, hero: 'alert', tempo: 220 },
      { at: 5000, hero: 'stand' },
    ],
  }
}

// The back door opens on the pursuer standing in it; he aims and steps back, the pursuer reaches out.
function projects(): Script {
  return {
    start: { x: 0.4, foe: null, fx: 1.6 },
    beats: [
      { at: 400, set: { backDoor: true } },
      { at: 800, foe: 'stand' },
      { at: 1200, hero: 'aim', tempo: 260 },
      ...walk({ from: 1600, to: -0.1, ms: 1200, poses: ['aimStepA', 'aimStepB'], step: 400, end: 'aim' }),
      { at: 2600, foe: 'reach', tempo: 600 },
    ],
  }
}

// The trader by his blue fire: he walks up, the trader throws open his coat, he nods.
function ventures(): Script {
  return {
    start: { x: OFF_LEFT, hero: 'walkA' },
    beats: [...walk({ from: 0, to: 0.3, ms: 1400 }), { at: 1600, set: { coat: true } }, { at: 2100, hero: 'nod' }, { at: 2700, hero: 'stand' }],
  }
}

// The suit door: he turns the key, the door swings open, and the pursuer passes behind the glass.
function bands(): Script {
  return {
    start: { x: OFF_LEFT, hero: 'walkA', foe: 'walkA', fx: OFF_RIGHT, far: true },
    beats: byTime([
      ...walk({ from: 0, to: 0.1, ms: 1200 }),
      { at: 1400, hero: 'keyReach' },
      { at: 1900, hero: 'keyTurn' },
      { at: 2300, set: { suitDoor: true } },
      ...stalk({ from: 2600, to: OFF_FAR_LEFT, ms: 6000 }),
      { at: 3000, hero: 'alert', tempo: 260 },
      { at: 6800, hero: 'stand' },
      { at: 8700, foe: null },
    ]),
  }
}

// The gym follows his condition: hurt he limps in, healed once he straightens, fine he takes his guard
// and kicks the pursuer back out of the room.
const GYM: Record<Condition, () => Script> = {
  danger: () => ({
    start: { x: OFF_LEFT, hero: 'limpA' },
    beats: walk({ from: 0, to: 0.2, ms: 2600, poses: ['limpA', 'limpB'], step: 520, end: 'limp' }),
  }),
  caution: () => ({ start: { x: 0.2, hero: 'limp' }, beats: [{ at: 300, hero: 'stand', tempo: 700 }] }),
  fine: () => ({
    start: { x: 0.2, foe: 'walkA', fx: 5 },
    beats: byTime([
      { at: 200, hero: 'guard' },
      ...stalk({ from: 400, to: 1.5, ms: 1800 }),
      { at: 2400, hero: 'kickChamber', tempo: 240 },
      { at: 2700, hero: 'kick', tempo: 140 },
      { at: 2850, foe: 'stagger', tempo: 200 },
      { at: 3400, hero: 'guard', tempo: 320 },
      ...stalk({ from: 3800, to: OFF_RIGHT, ms: 2800 }),
      { at: 6700, foe: null },
    ]),
  }),
}

const TYPING = 8
const KEY_MS = 140

// Contact: he runs from the pursuer to the safe room and shuts the door; the pursuer pounds on it and
// goes; inside he sits at the typewriter. Every save types his line again.
function contact({ saves }: ScriptContext): Script {
  if (saves > 0) {
    return {
      start: { x: 0.5, hero: 'sit', set: { inside: true } },
      beats: [...Array.from({ length: TYPING }, (_, index): Beat => ({ at: index * KEY_MS, hero: index % 2 ? 'typeB' : 'typeA', tempo: 100 })), { at: TYPING * KEY_MS, hero: 'sit' }],
    }
  }
  return {
    start: { x: 2.4, face: -1, foe: null, fx: 6 },
    beats: byTime([
      ...walk({ from: 300, to: 0.2, ms: 1200, poses: ['runA', 'runB'], step: 200, end: 'runA' }),
      { at: 300, foe: 'chargeA' },
      ...stalk({ from: 400, to: 1.4, ms: 1500, poses: ['chargeA', 'chargeB'], step: 250, end: 'stand' }),
      { at: 1200, set: { safeDoor: true } },
      { at: 1500, gone: true },
      { at: 1700, set: { safeDoor: false } },
      { at: 2000, foe: 'raise', tempo: 300 },
      { at: 2300, foe: 'pound', tempo: 120, set: { shake: true } },
      { at: 2700, foe: 'raise', tempo: 300, set: { shake: false } },
      { at: 3000, foe: 'pound', tempo: 120, set: { shake: true } },
      { at: 3400, foe: 'stand', tempo: 400, set: { shake: false } },
      ...stalk({ from: 3800, to: OFF_RIGHT, ms: 2600 }),
      { at: 6600, foe: null, gone: false, x: 0.5, face: 1, hero: 'sit', set: { inside: true } },
    ]),
  }
}

const SCRIPTS: Record<Zone, (context: ScriptContext) => Script> = {
  hall,
  store,
  about,
  experience,
  tech,
  projects,
  ventures,
  bands,
  gym: ({ condition }) => GYM[condition](),
  contact,
}

export const scriptFor = (zone: Zone, context: ScriptContext) => SCRIPTS[zone](context)

/** What makes a room's script worth playing again: the same key means the room already looks right. */
const KEYS: Record<Zone, (context: ScriptContext) => string> = {
  hall: () => 'hall',
  store: ({ profession }) => `store-${profession}`,
  about: () => 'about',
  experience: () => 'experience',
  tech: () => 'tech',
  projects: () => 'projects',
  ventures: () => 'ventures',
  bands: () => 'bands',
  gym: ({ condition }) => `gym-${condition}`,
  contact: ({ saves }) => `contact-${saves}`,
}

export const playKey = (zone: Zone, context: ScriptContext) => KEYS[zone](context)
