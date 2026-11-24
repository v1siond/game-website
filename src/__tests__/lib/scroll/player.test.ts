import { IDLE_FOLLOWER, MAX_SCENE_MS, MIN_ACTION_MS, actionLengths, crossOf, elapsedOf, follow, playheadAt, headingOf, restAt, sceneEnd, sceneLength, type Follower } from '@/lib/scroll/player'

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
    expect(second.follower.drawn).toBeLessThan(2 * FRAME)
    expect(second.follower.drawn).toBeGreaterThan(0)
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

  it('gives the end frame for the settled scene reduced motion shows', () => {
    expect(playheadAt(script, sceneLength(script))).toEqual(sceneEnd(script))
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

describe('headingOf', () => {
  it('reads the way the page goes from the lag behind the scroll, and keeps it while the page rests', () => {
    expect(headingOf(40, 'up')).toBe('down')
    expect(headingOf(-40, 'down')).toBe('up')
    expect(headingOf(0.3, 'up')).toBe('up')
  })
})
