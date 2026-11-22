import { HERO_LEGS, HERO_POSES } from './survivor'
import { STALKER_BOX, STALKER_LEGS, STALKER_POSES } from './stalker'
import { FAR_SCALE, apply, lastFrame, playKey, scriptFor, startFrame, type Beat, type Frame, type Script, type Zone } from './scripts'
import { footAt, type Leg, type LegTurn } from './gait'
import { PROFESSION_ORDER } from '@/lib/cv/professions'

// The joint rule of the rig (./rig): both figures face right, so an elbow only bends with a negative turn
// and a knee only with a positive one. A pose that breaks it bends a limb backwards on screen.

const ARMS = ['backArm', 'frontArm'] as const
const LEGS = ['backLeg', 'frontLeg'] as const

describe.each([
  ['him', HERO_POSES],
  ['the pursuer', STALKER_POSES],
] as const)('%s', (_who, poses) => {
  it.each(Object.entries(poses))('%s bends elbows and knees the right way', (_name, row) => {
    ARMS.forEach((arm) => expect(row[arm][1]).toBeLessThanOrEqual(0))
    LEGS.forEach((leg) => expect(row[leg][1]).toBeGreaterThanOrEqual(0))
  })
})

const ZONES: Zone[] = ['hall', 'store', 'about', 'experience', 'tech', 'projects', 'ventures', 'bands', 'gym', 'contact']
const CONTEXTS = PROFESSION_ORDER.flatMap((profession) =>
  (['danger', 'caution', 'fine'] as const).flatMap((condition) => [0, 1].map((saves) => ({ profession, condition, saves, entrance: 0 }))),
)

describe('the room scripts', () => {
  it.each(ZONES)('%s ends with him on camera, standing still, the pursuer gone or in place', (zone) => {
    CONTEXTS.forEach((context) => {
      const frame = lastFrame(scriptFor(zone, context))
      expect(frame.gone).toBe(false)
      expect(frame.move).toBe(0)
      expect(frame.x).toBeGreaterThanOrEqual(-0.5)
      expect(frame.x).toBeLessThanOrEqual(1)
      expect(HERO_POSES[frame.hero]).toBeDefined()
    })
  })

  // His rule: no animation lasts more than 5 s from its trigger. A beat ends when its move and its joints have
  // eased there.
  it.each(ZONES)('%s ends by 5000 ms, every move and joint eased in', (zone) => {
    CONTEXTS.forEach((context) => {
      const ends = scriptFor(zone, context).beats.map((beat) => beat.at + Math.max(beat.move ?? 0, beat.fmove ?? 0, beat.tempo ?? 0, beat.ftempo ?? 0))
      expect(Math.max(...ends)).toBeLessThanOrEqual(5000)
    })
  })

  it('plays the item box again for a new profession, the gym for a new condition, the safe room for a save', () => {
    const context = { profession: 'engineer', condition: 'danger', saves: 0, entrance: 0 } as const
    expect(playKey('store', context)).not.toBe(playKey('store', { ...context, profession: 'drummer' }))
    expect(playKey('gym', context)).not.toBe(playKey('gym', { ...context, condition: 'fine' }))
    expect(playKey('contact', context)).not.toBe(playKey('contact', { ...context, saves: 1 }))
    expect(playKey('about', context)).toBe(playKey('about', { ...context, profession: 'fighter' }))
  })

  it('ends the safe room inside, at the typewriter', () => {
    ;[0, 2].forEach((saves) => {
      const frame = lastFrame(scriptFor('contact', { profession: 'engineer', condition: 'fine', saves, entrance: 0 }))
      expect(frame.flags.inside).toBe(true)
      expect(frame.hero).toBe('sit')
    })
  })
})

// A walk that looks planted: while he crosses the floor, the foot on the ground sweeps back under him by as
// much as he travels, so his feet neither skate nor tread on the spot. A step is one contact pose (both
// feet down, or the lead foot landing in a run) to the next; its sweep is how far each foot moves between
// the two, measured with the leg math on the poses' own angles.
type Rows = Record<string, { backLeg: LegTurn; frontLeg: LegTurn }>
interface Figure {
  name: string
  rows: Rows
  legs: { back: Leg; front: Leg }
  contacts: readonly string[]
  pose: (frame: Frame) => string | null
  place: (frame: Frame) => number
  moving: (beat: Beat) => number | undefined
  unitsPerWidth: (frame: Frame) => number
}

const HERO: Figure = {
  name: 'him',
  rows: HERO_POSES,
  legs: HERO_LEGS,
  contacts: ['walkA', 'walkB', 'runA', 'runB', 'limpA', 'limpB', 'aimStepA', 'aimStepB'],
  pose: (frame) => frame.hero,
  place: (frame) => frame.x,
  moving: (beat) => beat.move,
  unitsPerWidth: () => 48,
}

const PURSUER: Figure = {
  name: 'the pursuer',
  rows: STALKER_POSES,
  legs: STALKER_LEGS,
  contacts: ['walkA', 'walkB', 'chargeA', 'chargeB'],
  pose: (frame) => frame.foe,
  place: (frame) => frame.fx,
  moving: (beat) => beat.fmove,
  unitsPerWidth: (frame) => 80 / STALKER_BOX.width / (frame.far ? FAR_SCALE : 1),
}

const sweep = (figure: Figure, from: string, to: string) => {
  const between = (leg: 'back' | 'front') => {
    const turn = (name: string) => figure.rows[name][leg === 'back' ? 'backLeg' : 'frontLeg']
    return Math.abs(footAt(figure.legs[leg], turn(from))[0] - footAt(figure.legs[leg], turn(to))[0])
  }
  return (between('back') + between('front')) / 2
}

/**
 * Each move of the figure in a script: how far it went (in its own viewBox units), the contact poses it
 * landed on during the move (its steps), and the sweep of each step from the contact before it.
 */
function walksOf(script: Script, figure: Figure) {
  const beats = [...script.beats].sort((a, b) => a.at - b.at)
  let frame = startFrame(script)
  const walks: { travel: number; steps: number; sweeps: number[] }[] = []
  beats.forEach((beat) => {
    const before = frame
    frame = apply(frame, beat)
    const ms = figure.moving(beat)
    if (!ms) return
    let pose = figure.pose(before)
    const landed = beats
      .filter((other) => other.at >= beat.at && other.at < beat.at + ms)
      .map((other) => figure.pose(apply(frame, other)))
      .filter((name): name is string => {
        const step = !!name && name !== pose && figure.contacts.includes(name)
        if (name !== pose) pose = name
        return step
      })
    const contacts = figure.contacts.includes(figure.pose(before) ?? '') ? [figure.pose(before) as string, ...landed] : landed
    const sweeps = contacts.slice(1).map((name, index) => sweep(figure, contacts[index], name))
    walks.push({ travel: Math.abs(figure.place(frame) - figure.place(before)) * figure.unitsPerWidth(frame), steps: landed.length, sweeps })
  })
  return walks
}

describe.each([HERO, PURSUER])('$name walking through the rooms', (figure) => {
  it.each(ZONES)('%s: every step carries him as far as his planted foot sweeps', (zone) => {
    CONTEXTS.forEach((context) => {
      walksOf(scriptFor(zone, context), figure).forEach(({ travel, steps, sweeps }) => {
        expect(sweeps.length).toBeGreaterThan(0)
        const perStep = travel / steps
        const reach = sweeps.reduce((sum, value) => sum + value, 0) / sweeps.length
        expect({ zone, perStep: Math.round(perStep), reach: Math.round(reach), off: Math.abs(perStep / reach - 1) < 0.25 }).toEqual({
          zone,
          perStep: Math.round(perStep),
          reach: Math.round(reach),
          off: true,
        })
      })
    })
  })
})
