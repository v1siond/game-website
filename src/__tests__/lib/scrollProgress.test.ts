import { clamp01, sectionProgress, advanceScene, readThenWrite, travelLines, SCENE_IDLE, SCENE_DONE } from '@/lib/scroll/progress'

describe('clamp01', () => {
  it.each([
    [-0.5, 0],
    [0, 0],
    [0.4, 0.4],
    [1, 1],
    [7, 1],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 1],
    [Number.NEGATIVE_INFINITY, 0],
  ])('clamps %p to %p', (value, expected) => {
    expect(clamp01(value)).toBe(expected)
  })
})

describe('sectionProgress', () => {
  const viewport = 1000

  it('is 0 while the section top is still at or below the start line (the viewport bottom)', () => {
    expect(sectionProgress(1000, viewport)).toBe(0)
    expect(sectionProgress(1400, viewport)).toBe(0)
  })

  it('is 1 once the section top reaches the end line (half the viewport)', () => {
    expect(sectionProgress(500, viewport)).toBe(1)
    expect(sectionProgress(-200, viewport)).toBe(1)
  })

  it('moves linearly between the two lines', () => {
    expect(sectionProgress(750, viewport)).toBeCloseTo(0.5)
    expect(sectionProgress(900, viewport)).toBeCloseTo(0.2)
  })

  it('takes the lines as fractions of the viewport', () => {
    expect(sectionProgress(800, viewport, { start: 0.8, end: 0.2 })).toBe(0)
    expect(sectionProgress(500, viewport, { start: 0.8, end: 0.2 })).toBeCloseTo(0.5)
    expect(sectionProgress(200, viewport, { start: 0.8, end: 0.2 })).toBe(1)
  })

  it('jumps straight to 1 when the lines meet or cross, or the viewport has no height', () => {
    expect(sectionProgress(600, viewport, { start: 0.5, end: 0.5 })).toBe(1)
    expect(sectionProgress(600, viewport, { start: 0.3, end: 0.6 })).toBe(1)
    expect(sectionProgress(600, 0)).toBe(1)
  })
})

describe('advanceScene', () => {
  it('starts playing from idle and follows the progress both ways while playing', () => {
    const playing = advanceScene(SCENE_IDLE, 0.3)
    expect(playing).toEqual({ phase: 'playing', progress: 0.3 })
    expect(advanceScene(playing, 0.1)).toEqual({ phase: 'playing', progress: 0.1 })
  })

  it('clamps the raw progress it is given', () => {
    expect(advanceScene(SCENE_IDLE, -2)).toEqual({ phase: 'playing', progress: 0 })
  })

  it('is done at 1 and stays done when scrolled back (a scene plays once)', () => {
    const done = advanceScene({ phase: 'playing', progress: 0.9 }, 1.2)
    expect(done).toEqual(SCENE_DONE)
    expect(advanceScene(done, 0)).toEqual(SCENE_DONE)
  })
})

describe('readThenWrite', () => {
  const recorder = () => {
    const log: string[] = []
    const scene = (name: string, onWrite?: () => void) => ({
      read: () => {
        log.push(`read ${name}`)
        return name.length
      },
      write: (reading: number) => {
        log.push(`write ${name} ${reading}`)
        onWrite?.()
      },
    })
    return { log, scene }
  }

  it('reads every scene before it writes any, so one frame forces one layout', () => {
    const { log, scene } = recorder()
    readThenWrite([scene('a'), scene('bb'), scene('ccc')])
    expect(log).toEqual(['read a', 'read bb', 'read ccc', 'write a 1', 'write bb 2', 'write ccc 3'])
  })

  it('hands each scene its own reading even when a write releases a scene from the set', () => {
    const { log, scene } = recorder()
    const armed = new Set<ReturnType<typeof scene>>()
    const first = scene('a', () => armed.delete(second))
    const second = scene('bb')
    armed.add(first).add(second)
    readThenWrite(armed)
    expect(log).toEqual(['read a', 'read bb', 'write a 1', 'write bb 2'])
    expect([...armed]).toEqual([first])
  })

  it('does nothing for no scenes', () => {
    expect(() => readThenWrite([])).not.toThrow()
  })
})

describe('travelLines', () => {
  it('stretches the scene over the section, ending a third of a screen early', () => {
    expect(travelLines(2000, 1000)).toEqual({ start: 0.85, end: -0.8 })
  })

  it('keeps a minimum travel for a short section', () => {
    expect(travelLines(300, 1000)).toEqual({ start: 0.85, end: 0.55 })
  })

  it('falls back to the minimum travel before the viewport is measured', () => {
    expect(travelLines(0, 0)).toEqual({ start: 0.85, end: 0.55 })
  })
})
