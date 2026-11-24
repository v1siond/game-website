import {
  HANDOVER,
  SETTLE_EPSILON_PX,
  SETTLE_TAU_MS,
  heroState,
  itemsReached,
  jumpStart,
  layerTransform,
  ramp,
  settleStep,
  stageState,
} from '@/lib/scroll/stage'

describe('ramp', () => {
  it('is 0 before the range, 1 after it and linear inside it', () => {
    expect(ramp(-10, 0, 100)).toBe(0)
    expect(ramp(25, 0, 100)).toBe(0.25)
    expect(ramp(400, 0, 100)).toBe(1)
  })

  it('reads a reversed range the other way round', () => {
    expect(ramp(25, 100, 0)).toBe(0.75)
  })
})

describe('settleStep', () => {
  it('covers 1 - e^-1 of the distance in one time constant, whatever the frame rate', () => {
    const one = settleStep(0, 1000, SETTLE_TAU_MS)
    const halves = settleStep(settleStep(0, 1000, SETTLE_TAU_MS / 2).drawn, 1000, SETTLE_TAU_MS / 2)
    expect(one.drawn).toBeCloseTo(1000 * (1 - Math.exp(-1)), 6)
    expect(halves.drawn).toBeCloseTo(one.drawn, 6)
    expect(one.settled).toBe(false)
  })

  it('moves backwards the same way when the target is above the drawn position', () => {
    expect(settleStep(1000, 0, SETTLE_TAU_MS).drawn).toBeCloseTo(1000 * Math.exp(-1), 6)
  })

  it('snaps to the target and reports settled once within the epsilon', () => {
    expect(settleStep(500 - SETTLE_EPSILON_PX / 2, 500, 16)).toEqual({ drawn: 500, settled: true })
  })

  it('settles in about a second after a full screen stop at 60 Hz: still on its way at half a second, within 7 px at one, at rest before 1.6 s', () => {
    let state = { drawn: 0, settled: false }
    let frames = 0
    let atHalf = 0
    let atOne = 0
    // Bounded, so a settle that never rests fails the test instead of hanging it.
    while (!state.settled && frames < 600) {
      state = settleStep(state.drawn, 900, 1000 / 60)
      frames += 1
      if (frames === 30) atHalf = state.drawn
      if (frames === 60) atOne = state.drawn
    }
    expect(900 - atHalf).toBeGreaterThan(50)
    expect(900 - atOne).toBeLessThan(7)
    expect(frames * (1000 / 60)).toBeLessThanOrEqual(1600)
    expect(state.drawn).toBe(900)
  })

  it('jumps straight to the target with a time constant of 0 (no settle)', () => {
    expect(settleStep(0, 800, 16, 0)).toEqual({ drawn: 800, settled: true })
  })
})

describe('jumpStart', () => {
  it('keeps the drawn position for a scroll shorter than the jump threshold', () => {
    expect(jumpStart(0, 1000, 1000)).toBe(0)
  })

  it('lands a quarter screen short of a long jump down, so it eases only the end', () => {
    expect(jumpStart(0, 5000, 1000)).toBe(4750)
  })

  it('lands a quarter screen short of a long jump up', () => {
    expect(jumpStart(5000, 0, 1000)).toBe(250)
  })
})

describe('stageState', () => {
  const vh = 1000
  const span = { top: 2000, bottom: 6000 }

  it('is dark before the stage starts to rise', () => {
    expect(stageState(span, 2000 + HANDOVER.inFrom * vh - 1, vh).vis).toBe(0)
  })

  it('rises from dark to full between its in lines', () => {
    const middle = 2000 + ((HANDOVER.inFrom + HANDOVER.inTo) / 2) * vh
    expect(stageState(span, middle, vh).vis).toBeCloseTo(0.5)
    expect(stageState(span, 2000 + HANDOVER.inTo * vh, vh).vis).toBe(1)
  })

  it('never sinks to dark: it stays whole past its section, for the next stage to dissolve in over it', () => {
    expect(stageState(span, 6000 + HANDOVER.outTo * vh, vh).vis).toBe(1)
    expect(stageState(span, 9000, vh).vis).toBe(1)
    expect(stageState(span, 3000, vh)).toEqual(stageState(span, 3000, vh))
  })

  it('runs its progress 0 to 1 from the first rise to the end of the sink', () => {
    expect(stageState(span, 2000 + HANDOVER.inFrom * vh, vh).progress).toBe(0)
    expect(stageState(span, 6000 + HANDOVER.outTo * vh, vh).progress).toBe(1)
  })

  it('never sinks the last stage, which holds to the end of the page', () => {
    const end = 6000 - vh
    expect(stageState(span, end, vh, { last: true })).toMatchObject({ vis: 1, progress: 1 })
  })

  it('plays a last section shorter than the screen through to its end instead of backward', () => {
    const short = { top: 2000, bottom: 2300 }
    expect(stageState(short, 1000, vh, { last: true }).progress).toBe(0)
    expect(stageState(short, 2400, vh, { last: true }).progress).toBe(1)
  })
})

describe('heroState', () => {
  it('stays whole under the next stage while its progress runs a whole screen', () => {
    expect(heroState(0, 1000)).toMatchObject({ vis: 1, progress: 0 })
    expect(heroState(375, 1000)).toMatchObject({ vis: 1, progress: 0.375 })
    expect(heroState(750, 1000).vis).toBe(1)
    expect(heroState(1000, 1000).progress).toBe(1)
  })
})

describe('itemsReached', () => {
  it('counts every trigger passed, the one in progress as a fraction', () => {
    const triggers = [100, 500, 900]
    expect(itemsReached(triggers, 0, 1000)).toBe(0)
    expect(itemsReached(triggers, 250, 1000)).toBeCloseTo(0.5)
    expect(itemsReached(triggers, 650, 1000)).toBeCloseTo(1.5)
    expect(itemsReached(triggers, 5000, 1000)).toBe(3)
  })
})

describe('layerTransform', () => {
  const motion = { zoom: [1.04, 1.13] as const, lift: [0, -2] as const }

  it('writes the start and the end of the push in', () => {
    expect(layerTransform(motion, 0)).toBe('translate3d(0,0.00%,0) scale(1.0400)')
    expect(layerTransform(motion, 1)).toBe('translate3d(0,-2.00%,0) scale(1.1300)')
  })

  it('scales the motion down for a phone', () => {
    expect(layerTransform(motion, 1, 0.5)).toBe('translate3d(0,-1.00%,0) scale(1.0650)')
  })
})

const VIEWPORT = 1000

describe('the scroll that plays a scene', () => {
  const tall = { top: 5000, bottom: 9000 }

  it('starts as the stage arrives over its section and is played through a screen later, the section still in view', () => {
    expect(stageState(tall, 5000 - 0.25 * VIEWPORT, VIEWPORT).play).toBe(0)
    expect(stageState(tall, 5000 + 0.5 * VIEWPORT, VIEWPORT).play).toBeGreaterThan(0.5)
    expect(stageState(tall, 5000 + 0.95 * VIEWPORT, VIEWPORT).play).toBe(1)
  })

  it('plays a short section through while half of it is still on screen', () => {
    const short = { top: 5000, bottom: 5800 }
    expect(stageState(short, short.bottom - 0.5 * VIEWPORT, VIEWPORT).play).toBe(1)
  })

  it('plays it over a shorter scroll on a phone, done while the head still holds the room alone', () => {
    expect(stageState(tall, 5000 - 0.25 * VIEWPORT, VIEWPORT, { phone: true }).play).toBe(0)
    expect(stageState(tall, 5000 + 0.3 * VIEWPORT, VIEWPORT, { phone: true }).play).toBe(1)
    expect(stageState(tall, 5000 + 0.3 * VIEWPORT, VIEWPORT).play).toBeLessThan(1)
  })

  it('plays the last section through by the end of the page', () => {
    const last = { top: 5000, bottom: 5900 }
    expect(stageState(last, last.bottom - VIEWPORT, VIEWPORT, { last: true }).play).toBe(1)
  })

  it('plays the hero over the first part of a screen of scroll from the top', () => {
    expect(heroState(0, VIEWPORT).play).toBe(0)
    expect(heroState(0.6 * VIEWPORT, VIEWPORT).play).toBe(1)
  })

  it('plays a phone hero over a short scroll, done before the hero text reaches him', () => {
    expect(heroState(0, VIEWPORT, { phone: true }).play).toBe(0)
    expect(heroState(0.05 * VIEWPORT, VIEWPORT, { phone: true }).play).toBeGreaterThan(0)
    expect(heroState(0.1 * VIEWPORT, VIEWPORT, { phone: true }).play).toBe(1)
    expect(heroState(0.1 * VIEWPORT, VIEWPORT).play).toBeLessThan(1)
  })
})
