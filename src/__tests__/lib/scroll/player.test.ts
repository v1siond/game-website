import { ARRIVE_VIS, IDLE_CLOCK, MAX_SCENE_MS, MIN_ACTION_MS, actionLengths, advance, arrive, crossOf, playheadAt, sceneEnd, type SceneClock } from '@/lib/scroll/player'

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

describe('arrive', () => {
  const idle: SceneClock = { startedAt: null }

  it('waits while the scene is not yet in view', () => {
    expect(arrive(idle, ARRIVE_VIS - 0.01, 500)).toEqual(idle)
  })

  it('starts the clock when the scene arrives', () => {
    expect(arrive(idle, ARRIVE_VIS, 500)).toEqual({ startedAt: 500 })
  })

  it('never restarts: back in view later, the time already run shows the end frame', () => {
    const started = arrive(idle, 1, 500)
    expect(arrive(started, 1, 90_000)).toEqual({ startedAt: 500 })
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
})

describe('advance', () => {
  const script = [1500, 2000] as const

  it('holds the first frame and asks for no frames until the scene arrives', () => {
    expect(advance(IDLE_CLOCK, script, 0.2, 100)).toEqual({ clock: IDLE_CLOCK, play: { action: 0, t: 0, done: false }, playing: false })
  })

  it('plays on from the arrival and asks for the next frame while it runs', () => {
    const { clock } = advance(IDLE_CLOCK, script, 1, 100)
    const later = advance(clock, script, 0, 100 + 1500 + 1000)
    expect(later.play.action).toBe(1)
    expect(later.playing).toBe(true)
  })

  it('stops asking for frames once the end frame holds', () => {
    const { clock } = advance(IDLE_CLOCK, script, 1, 100)
    expect(advance(clock, script, 1, 10_000)).toEqual({ clock, play: sceneEnd(script), playing: false })
  })
})
