import {
  IDLE_FOLLOWER,
  MAX_SCENE_MS,
  MIN_ACTION_MS,
  actionLengths,
  crossOf,
  elapsedOf,
  follow,
  nearOf,
  playheadAt,
  pacedMoves,
  restAt,
  restingPlay,
  sceneEnd,
  sceneLength,
  stagePlay,
  wayOf,
  type Follower,
  type Way,
} from '@/lib/scroll/player'
import { FIRST_FRAME_MS } from '@/lib/scroll/stage'

describe('actionLengths', () => {
  it('gives every action at least the time to read it', () => {
    expect(actionLengths([300, 800])).toEqual([MIN_ACTION_MS, MIN_ACTION_MS])
  })

  it('keeps a script that fits as it is', () => {
    expect(actionLengths([1500, 2000])).toEqual([1500, 2000])
  })

  it('fits a long script into the whole scene, no action under the minimum', () => {
    const lengths = actionLengths([4000, 1200, 3000])
    expect(lengths.reduce((sum, ms) => sum + ms, 0)).toBeCloseTo(MAX_SCENE_MS)
    expect(Math.min(...lengths)).toBe(MIN_ACTION_MS)
    expect(lengths[0]).toBeGreaterThan(lengths[2])
  })

  it('plays at most three actions', () => {
    expect(actionLengths([1200, 1200, 1200, 1200])).toHaveLength(3)
  })

  it('works a script out once, however many frames ask for it', () => {
    const script = [1500, 2000]
    expect(actionLengths(script)).toBe(actionLengths(script))
  })
})

describe('playheadAt', () => {
  const script = [1500, 2000] as const

  it('starts at the first action, nothing played', () => {
    expect(playheadAt(script, 0)).toEqual({ action: 0, t: 0, done: false })
  })

  it('eases each action: slow out of rest, half way at its middle', () => {
    expect(playheadAt(script, 150).t).toBeLessThan(0.1)
    expect(playheadAt(script, 750).t).toBeCloseTo(0.5)
  })

  it('moves on to the next action on time, never two at once', () => {
    const second = playheadAt(script, 1500 + 1000)
    expect(second.action).toBe(1)
    expect(second.t).toBeCloseTo(0.5)
  })

  it('holds the end frame once the script has played, however long after', () => {
    expect(playheadAt(script, 3500)).toEqual({ action: 1, t: 1, done: true })
    expect(playheadAt(script, 60_000)).toEqual(sceneEnd(script))
  })

  it('takes the same time whatever the cards: one action per script entry', () => {
    expect(playheadAt([1200], 600).action).toBe(0)
    expect(sceneEnd([1200, 1200, 1200])).toEqual({ action: 2, t: 1, done: true })
  })
})

describe('elapsedOf', () => {
  const script = [1500, 2000] as const

  it('reads the time back from a playhead at an even pace, whatever the easing', () => {
    for (const ms of [0, 200, 750, 1499, 1500, 2600, 3400]) expect(elapsedOf(script, playheadAt(script, ms))).toBeCloseTo(ms, 6)
  })

  it('gives the whole scene at its end frame', () => {
    expect(elapsedOf(script, sceneEnd(script))).toBe(3500)
  })
})

describe('crossOf', () => {
  it('shows only the top fully risen stage and the ones rising over it, never a dip to dark', () => {
    const cross = crossOf([1, 1, 0.5, 0])
    expect(cross.layers.map((layer) => layer.shown)).toEqual([false, true, true, false])
    expect(cross.layers[1].opacity).toBe(1)
    expect(cross.layers[2].opacity).toBeCloseTo(0.5)
  })

  it('keeps the first stage under everything while nothing has fully risen over it', () => {
    const cross = crossOf([1, 0.2])
    expect(cross.layers[0]).toEqual({ shown: true, opacity: 1 })
  })

  it('names the stage the page is in: the last one at least half risen', () => {
    expect(crossOf([1, 1, 0.6, 0.1]).lead).toBe(2)
    expect(crossOf([1, 0.4]).lead).toBe(0)
  })

  it('on the way back cuts to the stage the page returns to: the one it leaves is gone at once, never left over it', () => {
    const cross = crossOf([1, 1, 0.6, 0.1], 'up')
    expect(cross.layers.map((layer) => layer.shown)).toEqual([false, true, false, false])
    expect(cross.layers[1]).toEqual({ shown: true, opacity: 1 })
    expect(cross.lead).toBe(1)
  })

  it('dissolves on the way down as before', () => {
    expect(crossOf([1, 1, 0.6, 0.1], 'down')).toEqual(crossOf([1, 1, 0.6, 0.1]))
  })

  it('draws nothing for no stage, and the one stage whole', () => {
    expect(crossOf([])).toEqual({ layers: [], lead: 0 })
    expect(crossOf([0])).toEqual({ layers: [{ shown: true, opacity: 1 }], lead: 0 })
  })

  it('on the way back with no stage yet whole, shows the first and hides the ones rising over it', () => {
    expect(crossOf([0.4, 0.2], 'up')).toEqual({ layers: [{ shown: true, opacity: 1 }, { shown: false, opacity: 0 }], lead: 0 })
  })
})

describe('nearOf', () => {
  it('names the stage the page is in and its neighbours within reach', () => {
    expect(nearOf(crossOf([1, 1, 1, 1, 0, 0, 0]), 1)).toEqual([2, 3, 4])
    expect(nearOf(crossOf([1, 1, 1, 1, 0, 0, 0]), 2)).toEqual([1, 2, 3, 4, 5])
  })

  it('stops at the ends of the page', () => {
    expect(nearOf(crossOf([0, 0, 0, 0]), 1)).toEqual([0, 1])
    expect(nearOf(crossOf([1, 1, 1, 1]), 1)).toEqual([2, 3])
  })

  it('keeps every stage on screen, the one dissolving out under a lead two stages on included', () => {
    // a scroll far enough in one frame: two stages rise over the whole one, the lead the second
    const cross = crossOf([1, 1, 0.7, 0.6, 0])
    expect(cross.lead).toBe(3)
    expect(nearOf(cross, 0)).toEqual([1, 2, 3])
  })

  it('on the way back follows the stage it returns to', () => {
    expect(nearOf(crossOf([1, 1, 0.6, 0.1], 'up'), 1)).toEqual([0, 1, 2])
  })
})

describe('follow', () => {
  const script = [1500, 2000] as const
  const total = sceneLength(script)
  const FRAME = 1000 / 60

  /** Frames of the follow toward `progress` from `from`, for `ms` of real time. */
  function run(from: Follower, progress: number, ms: number, start = 1000): { follower: Follower; playing: boolean } {
    let follower = from
    let playing = true
    for (let now = start; now <= start + ms; now += FRAME) ({ follower, playing } = follow(follower, script, progress, now))
    return { follower, playing }
  }

  it('moves a small way for a small scroll, and comes to rest there', () => {
    const { follower, playing } = run(IDLE_FOLLOWER, 0.05, 2000)
    expect(follower.drawn).toBeCloseTo(0.05 * total, 0)
    expect(playing).toBe(false)
  })

  it('never plays faster than the scene runs: a flick to the end takes at least the scene to cover', () => {
    const halfway = run(IDLE_FOLLOWER, 1, total / 2)
    expect(halfway.follower.drawn).toBeLessThanOrEqual(total / 2)
    expect(halfway.playing).toBe(true)
    expect(run(IDLE_FOLLOWER, 1, total * 1.5).follower.drawn).toBeCloseTo(total, 0)
  })

  it('eases out of rest: the first frames move less than the scene would at full speed', () => {
    const first = follow(IDLE_FOLLOWER, script, 1, 1000)
    const second = follow(first.follower, script, 1, 1000 + FRAME)
    expect(second.follower.drawn).toBeLessThan(FRAME)
    expect(second.follower.drawn).toBeGreaterThan(0)
  })

  it('counts the first frame after rest as one frame at 60 fps', () => {
    const first = follow(IDLE_FOLLOWER, script, 1, 5000)
    const timed = follow({ ...IDLE_FOLLOWER, at: 5000 - FIRST_FRAME_MS }, script, 1, 5000)
    expect(first.follower.drawn).toBeGreaterThan(0)
    expect(first.follower.drawn).toBeCloseTo(timed.follower.drawn, 9)
    expect(first.follower.speed).toBeCloseTo(timed.follower.speed, 9)
  })

  it('counts a frame after a hidden tab as a short one, so the scene does not jump', () => {
    const moving = run(IDLE_FOLLOWER, 1, 400).follower
    const after = follow(moving, script, 1, (moving.at ?? 0) + 60_000).follower
    expect(after.drawn - moving.drawn).toBeLessThanOrEqual(100)
  })

  it('turns back through a stop when the scroll reverses in mid play, never past it and never faster than the scene', () => {
    let { follower } = run(IDLE_FOLLOWER, 1, 600)
    const turnedAt = follower.drawn
    const drawn: number[] = []
    for (let now = (follower.at ?? 0) + FRAME; drawn.length < 400; now += FRAME) {
      follower = follow(follower, script, 0, now).follower
      expect(Math.abs(follower.speed)).toBeLessThanOrEqual(1)
      drawn.push(follower.drawn)
    }
    const peak = Math.max(...drawn)
    expect(peak - turnedAt).toBeLessThan(100)
    const falling = drawn.slice(drawn.indexOf(peak))
    falling.slice(1).forEach((at, i) => expect(at).toBeLessThanOrEqual(falling[i]))
    expect(drawn.at(-1)).toBe(0)
  })

  it('plays backward when the scroll goes back up', () => {
    const ended = run(IDLE_FOLLOWER, 1, total * 2).follower
    const back = run(ended, 0, 1000, (ended.at ?? 0) + FRAME).follower
    expect(back.drawn).toBeLessThan(total)
    expect(back.drawn).toBeGreaterThanOrEqual(total - 1000 - FRAME)
    expect(run(back, 0, total * 2, (back.at ?? 0) + FRAME).follower.drawn).toBe(0)
  })

  it('asks for no more frames once it rests on the target, and never passes it', () => {
    const rested = run(IDLE_FOLLOWER, 0.5, total * 2).follower
    expect(rested.drawn).toBe(0.5 * total)
    expect(follow(rested, script, 0.5, 90_000)).toEqual({ follower: { ...rested, at: 90_000 }, play: playheadAt(script, 0.5 * total), playing: false })
  })

  it('draws the playhead at the time it has reached', () => {
    const { follower } = run(IDLE_FOLLOWER, 1, total * 2)
    expect(follow(follower, script, 1, 99_000).play).toEqual(sceneEnd(script))
  })

})

describe('restingPlay', () => {
  it('gives the end frame reduced motion and a settled stage show', () => {
    expect(restingPlay([1500, 2000])).toEqual({ action: 1, t: 1, done: true })
  })

  it('gives a scene with no script its one frame, done', () => {
    expect(restingPlay(undefined)).toEqual({ action: 0, t: 1, done: true })
  })
})

describe('stagePlay', () => {
  const script = [1500, 2000]
  const total = sceneLength(script)

  it('rests a stage just bound where the scroll puts it, so a rebind never replays the scene from its start', () => {
    const run = stagePlay(null, script, 0.6, 1000, true)
    expect(run.play).toEqual(playheadAt(script, 0.6 * total))
    expect(run.playing).toBe(false)
    expect(run.follower).toEqual({ drawn: 0.6 * total, speed: 0, at: 1000 })
  })

  it('plays the leading stage at its own pace toward the scroll', () => {
    const run = stagePlay({ drawn: 0, speed: 0, at: 1000 }, script, 1, 1016, true)
    expect(run.playing).toBe(true)
    expect(run.follower?.drawn).toBeGreaterThan(0)
    expect(run.follower?.drawn).toBeLessThan(16)
  })

  it('draws every other stage where the scroll puts it and keeps no follower for it', () => {
    const run = stagePlay({ drawn: 0, speed: 0.5, at: 1000 }, script, 0.5, 1016, false)
    expect(run).toEqual({ follower: null, play: playheadAt(script, 0.5 * total), playing: false })
  })

  it('draws a scene with no script at its one frame', () => {
    expect(stagePlay(null, undefined, 0.3, 1000, true)).toEqual({ follower: null, play: restingPlay(undefined), playing: false })
  })
})

describe('pacedMoves', () => {
  const script = [1600]
  const total = sceneLength(script)

  it('rests a move first seen, or out of reach, where the scroll puts it', () => {
    const { followers, phases, playing } = pacedMoves(new Map(), [{ key: 'a', target: 0.4, near: true }], script, 1000)
    expect(phases).toEqual([0.4])
    expect(playing).toBe(false)
    expect(followers.get('a')).toEqual({ drawn: 0.4 * total, speed: 0, at: 1000 })
  })

  it('plays a held move in reach at its own pace and asks for frames', () => {
    const held = new Map([['a', { drawn: 0, speed: 0, at: 1000 }]])
    const { phases, playing } = pacedMoves(held, [{ key: 'a', target: 1, near: true }], script, 1016)
    expect(playing).toBe(true)
    expect(phases[0]).toBeGreaterThan(0)
    expect(phases[0]).toBeLessThan(0.02)
  })

  it('forgets the moves of a room left in mid move, so coming back rests them instead of replaying', () => {
    const held = new Map([['0:1', { drawn: 200, speed: 0.8, at: 1000 }]])
    const { followers, playing } = pacedMoves(held, [{ key: '1:0', target: 0, near: true }], script, 1016)
    expect(followers.has('0:1')).toBe(false)
    expect(playing).toBe(false)
  })

  it('asks for no frame with no move in view (the hub, a gap, reduced motion)', () => {
    const held = new Map([['0:1', { drawn: 200, speed: 0.8, at: 1000 }]])
    expect(pacedMoves(held, [], script, 1016)).toEqual({ followers: new Map(), phases: [], playing: false })
  })
})

describe('restAt', () => {
  const script = [1500, 1500]

  it('rests a scene out of view where the scroll puts it, so it never plays catching up', () => {
    const rested = restAt(script, 0.25, 1000)
    expect(rested).toEqual({ drawn: 750, speed: 0, at: 1000 })
    const next = follow(rested, script, 0.25, 1016)
    expect(next.playing).toBe(false)
    expect(next.play).toEqual(playheadAt(script, 750))
  })

  it('drops a scene the scroll flew past straight to its end or its start', () => {
    expect(restAt(script, 1.4, 0).drawn).toBe(sceneLength(script))
    expect(restAt(script, -2, 0).drawn).toBe(0)
  })
})

describe('wayOf', () => {
  /** The way after the scroll passes each position in turn. */
  const through = (positions: readonly number[], from: Way | null = null): Way => positions.reduce<Way | null>((was, at) => wayOf(at, was), from) as Way

  it('starts going down, and keeps its way while the page rests', () => {
    expect(wayOf(500, null).heading).toBe('down')
    expect(through([500, 500, 500]).heading).toBe('down')
  })

  it('turns up on a slow climb once the scroll has travelled 8 px back, however slow, with no lag needed', () => {
    const climb = Array.from({ length: 12 }, (_, i) => 1000 - i)
    expect(through(climb.slice(0, 8)).heading).toBe('down')
    expect(through(climb).heading).toBe('up')
  })

  it('keeps the way through a small reversal, a touch rubber band or a 2 px wheel', () => {
    expect(through([1000, 1100, 1098, 1101]).heading).toBe('down')
    const up = through([1000, 900])
    expect(through([903, 899], up).heading).toBe('up')
  })

  it('measures the travel back from the furthest point reached, so a long way down then 9 px up turns', () => {
    expect(through([0, 400, 800, 791]).heading).toBe('up')
    expect(through([800, 400, 409]).heading).toBe('down')
  })
})
