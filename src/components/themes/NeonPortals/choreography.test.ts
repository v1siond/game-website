import { COUNT_BOX, HERO_TIMING, PIPS, POSES, beatStart, heroEntranceMs, motionAt, pipAt, restSpot, sceneMs, type Scene } from './choreography'

// Every timing of the world, read the way BD29 and the standard count them: a section's scene ends within
// 5 s, a one shot move under 1 s, the hero's entrance within 3 s, and every scene ends on a held frame.

const FIVE_S = 5000

const SCENE: Scene = {
  start: { x: 0, lift: 0 },
  beats: [
    { name: 'walk', pose: 'run', ms: 600, to: { x: 30, lift: 0 } },
    { name: 'pull', pose: 'pull', ms: 500, to: { x: 30, lift: 0 } },
    { name: 'jump', pose: 'hop', ms: 400, to: { x: 40, lift: 20 } },
  ],
  rest: 'idle',
}

describe('a scene as beats', () => {
  it('lasts the sum of its beats', () => {
    expect(sceneMs(SCENE)).toBe(1500)
  })

  it('starts each beat when the one before it ends', () => {
    expect(beatStart(SCENE, 'walk')).toBe(0)
    expect(beatStart(SCENE, 'pull')).toBe(600)
    expect(beatStart(SCENE, 'jump')).toBe(1100)
  })

  it('moves him from where the beat before ended to where this one ends', () => {
    expect(motionAt(SCENE, 0)).toEqual({ pose: 'run', from: { x: 0, lift: 0 }, to: { x: 30, lift: 0 }, ms: 600 })
    expect(motionAt(SCENE, 2)).toEqual({ pose: 'hop', from: { x: 30, lift: 0 }, to: { x: 40, lift: 20 }, ms: 400 })
  })

  it('holds the last spot in the rest pose once the beats are over, the frame a scroll back shows', () => {
    expect(restSpot(SCENE)).toEqual({ x: 40, lift: 20 })
    expect(motionAt(SCENE, 3)).toEqual({ pose: 'idle', from: { x: 40, lift: 20 }, to: { x: 40, lift: 20 }, ms: 0 })
  })

  it('rests on the start spot when a scene has no beats', () => {
    expect(restSpot({ start: { x: 12, lift: 0 }, beats: [], rest: 'idle' })).toEqual({ x: 12, lift: 0 })
  })
})

describe('the hero', () => {
  it('plays its entrance (the platform, the pads, his beam, the ring) within 3 s', () => {
    expect(heroEntranceMs()).toBeLessThanOrEqual(3000)
    expect(HERO_TIMING.ring.at).toBeGreaterThanOrEqual(HERO_TIMING.beam.at)
  })

  it('lights the three pads in turn after the platform has risen', () => {
    expect(HERO_TIMING.pads.at).toBeGreaterThan(0)
    expect(HERO_TIMING.pads.step).toBeGreaterThan(0)
  })

  it('hops him to a new pad and swaps the sphere each under 1 s', () => {
    expect(HERO_TIMING.hopMs).toBeLessThan(1000)
    expect(HERO_TIMING.swapMs).toBeLessThan(1000)
  })

  it('scratches his head after 1.5 s of a resting pointer, at most once every 8 s, and ends the scratch well within 5 s', () => {
    expect(HERO_TIMING.scratch.restMs).toBe(1500)
    expect(HERO_TIMING.scratch.everyMs).toBe(8000)
    expect(HERO_TIMING.scratch.ms).toBeLessThan(FIVE_S)
  })

  it('names every pose his sprite draws', () => {
    expect(POSES).toEqual(
      expect.arrayContaining(['idle', 'scratch', 'run', 'pull', 'spin', 'hit', 'point', 'drum', 'guard', 'knee', 'press', 'dance', 'hop']),
    )
  })
})

describe('About: the count box', () => {
  it('plays the walk, the plunger pull, the three pips and the panel opening in 2.4 s', () => {
    expect(COUNT_BOX.beats.map((beat) => beat.name)).toEqual(['walk', 'pull', 'count', 'open'])
    expect(sceneMs(COUNT_BOX)).toBe(2400)
  })

  it('blinks the three pips one after another inside the count beat', () => {
    expect(PIPS).toBe(3)
    const count = COUNT_BOX.beats.find((beat) => beat.name === 'count')
    expect(pipAt(0)).toBe(beatStart(COUNT_BOX, 'count'))
    expect(pipAt(PIPS - 1)).toBeLessThan(beatStart(COUNT_BOX, 'count') + (count?.ms ?? 0))
  })

  it('leaves him at the plunger on the box, never on top of it', () => {
    expect(new Set(COUNT_BOX.beats.map((beat) => beat.to.lift))).toEqual(new Set([0]))
  })
})
