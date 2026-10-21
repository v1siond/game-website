import { HERO_POSES } from './survivor'
import { STALKER_POSES } from './stalker'
import { lastFrame, playKey, scriptFor, type Zone } from './scripts'
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
