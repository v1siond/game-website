import { COLLECT, COUNT_BOX, GEMS_IN, HERO_TIMING, IRON_BOX, PATH, PIPS, POSES, RUN_MS, beatStart, heroEntranceMs, motionAt, aimAt, breakAt, collectMotion, frameAt, pipAt, postAt, postX, restSpot, sceneMs, techScene, techStep, type Scene } from './choreography'

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

describe('Work Experience: the checkpoint path', () => {
  it('lights post i halfway through its share of the path, evenly from the first job to the last', () => {
    expect([0, 1, 2, 3].map((index) => postAt(index, 4))).toEqual([0.125, 0.375, 0.625, 0.875])
    expect(postAt(0, 1)).toBe(0.5)
  })

  it('stands each post where he is at the moment it lights, so the light comes on as he passes', () => {
    const count = 8
    Array.from({ length: count }, (_, index) => index).forEach((index) => {
      expect(postX(index, count)).toBeCloseTo(PATH.from + postAt(index, count) * (PATH.to - PATH.from))
    })
  })

  it('keeps the path inside the strip, left to right', () => {
    expect(PATH.from).toBeGreaterThanOrEqual(0)
    expect(PATH.to).toBeLessThanOrEqual(100)
    expect(PATH.to).toBeGreaterThan(PATH.from)
  })

  it('runs the whole path on "Run" in 3 s, within 5 s', () => {
    expect(RUN_MS).toBe(3000)
    expect(RUN_MS).toBeLessThanOrEqual(FIVE_S)
  })
})

describe('Tech Stack: the spin through the boxes', () => {
  it('staggers the boxes by 0.3 s, closer when there are many, so the last breaks by 3.5 s', () => {
    expect(techStep(4)).toBe(300)
    expect(techStep(8)).toBe(300)
    expect(techStep(14)).toBe(250)
    expect(techStep(20) * 20).toBeLessThanOrEqual(3500)
  })

  it('breaks box i a step after the one before, once he is spinning', () => {
    expect(breakAt(1, 8) - breakAt(0, 8)).toBe(techStep(8))
    expect(breakAt(0, 8)).toBeGreaterThan(0)
  })

  it.each([1, 4, 8, 12, 30])('spins him across the row until the last of %i boxes has broken, within 4.5 s', (count) => {
    const scene = techScene(count)
    expect(scene.beats.map((beat) => beat.pose)).toEqual(['spin'])
    expect(sceneMs(scene)).toBeGreaterThanOrEqual(breakAt(count - 1, count))
    expect(sceneMs(scene)).toBeLessThanOrEqual(4500)
  })
})

describe('Services: the iron box', () => {
  it('runs him under the box, jumps him head first into it and lands him, in 1.2 s', () => {
    expect(IRON_BOX.beats.map((beat) => beat.pose)).toEqual(['run', 'hit', 'idle'])
    expect(sceneMs(IRON_BOX)).toBe(1200)
  })

  it('jumps straight up under the box and comes back to the ground', () => {
    const [run, hit, land] = IRON_BOX.beats
    expect(hit.to.x).toBe(run.to.x)
    expect(hit.to.lift).toBeGreaterThan(0)
    expect(land.to).toEqual(run.to)
  })

  it('turns the frames solid from the moment his head hits, all within the scene', () => {
    expect(frameAt(0)).toBe(beatStart(IRON_BOX, 'land'))
    expect(frameAt(9) - frameAt(8)).toBeGreaterThan(0)
    expect(frameAt(9)).toBeLessThan(FIVE_S)
  })
})

describe('Projects: pointing at a sphere', () => {
  it('turns his arm toward the card the visitor points at: across his body for the left column, out for the right', () => {
    expect(aimAt(0)).toBeGreaterThan(aimAt(0.5))
    expect(aimAt(0.5)).toBeGreaterThan(aimAt(1))
    expect(aimAt(0)).toBeGreaterThan(0)
    expect(aimAt(1)).toBeLessThan(0)
  })

  it('never swings the arm past level with his shoulder', () => {
    ;[0, 0.25, 0.5, 0.75, 1].forEach((share) => expect(Math.abs(aimAt(share))).toBeLessThanOrEqual(100))
  })

  it('reads a share outside the grid as its nearest edge', () => {
    expect(aimAt(-1)).toBe(aimAt(0))
    expect(aimAt(2)).toBe(aimAt(1))
  })
})

describe('Ventures: collecting the gems', () => {
  it('runs him into the row when the section shows, within 1 s', () => {
    expect(GEMS_IN.beats.map((beat) => beat.pose)).toEqual(['run'])
    expect(sceneMs(GEMS_IN)).toBeLessThan(1000)
  })

  it('runs him to the gem in under 1 s and flies the gem to the tally once he is there, all within 5 s', () => {
    expect(COLLECT.glideMs).toBeLessThan(1000)
    expect(COLLECT.glideMs + COLLECT.flightMs).toBeLessThanOrEqual(FIVE_S)
  })

  it('moves him from where he stands to the gem while he runs, and holds him there after', () => {
    expect(collectMotion(10, 70, true)).toEqual({ pose: 'run', from: { x: 10, lift: 0 }, to: { x: 70, lift: 0 }, ms: COLLECT.glideMs })
    expect(collectMotion(10, 70, false)).toEqual({ pose: 'idle', from: { x: 70, lift: 0 }, to: { x: 70, lift: 0 }, ms: 0 })
  })
})
