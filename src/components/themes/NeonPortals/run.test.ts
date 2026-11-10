import { project } from './lens'
import { END_PIECE_Z, PHONE_WINDOW, DESKTOP_WINDOW, levelLens, runAt } from './run'

describe('the run through a level', () => {
  it('starts him at the gate and ends him at the end piece', () => {
    expect(runAt(0).heroZ).toBe(0)
    expect(runAt(1).heroZ).toBeLessThan(END_PIECE_Z + 4)
    expect(runAt(1).arrived).toBe(true)
    expect(runAt(0.5).arrived).toBe(false)
  })

  it('reads a progress outside 0 to 1 as its edge', () => {
    expect(runAt(-2)).toEqual(runAt(0))
    expect(runAt(7)).toEqual(runAt(1))
  })

  it('turns the distance run into a stride phase between 0 and 1', () => {
    for (let step = 0; step <= 20; step += 1) {
      const { stride } = runAt(step / 20)
      expect(stride).toBeGreaterThanOrEqual(0)
      expect(stride).toBeLessThan(1)
    }
  })

  // Item 4 of the build: him and the era's key piece in frame on a 390 by 844 phone and on a desktop.
  it.each([
    ['phone', PHONE_WINDOW],
    ['desktop', DESKTOP_WINDOW],
  ] as const)('keeps him and the end piece in frame on the %s window', (_, aspect) => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const lens = levelLens(progress, aspect)
      const { heroZ } = runAt(progress)
      const points = [
        project([0, 0.05, heroZ], lens),
        project([0, 2.1, heroZ], lens),
        project([0, 3, END_PIECE_Z], lens),
        project([0, 0.5, END_PIECE_Z], lens),
      ]
      points.forEach((point) => {
        expect([progress, point.x >= 0.05 && point.x <= 0.95, point.y >= 0.05 && point.y <= 0.95]).toEqual([progress, true, true])
      })
    }
  })

  it('opens the lens wider on the phone window than on the desktop one', () => {
    expect(levelLens(0.5, PHONE_WINDOW).fov).toBeGreaterThan(levelLens(0.5, DESKTOP_WINDOW).fov)
  })
})
