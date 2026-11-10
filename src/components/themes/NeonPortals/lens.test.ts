import { project, type Lens } from './lens'

const FRONT: Lens = { position: [0, 2, 10], target: [0, 2, 0], fov: 40, aspect: 2 }

describe('the lens projection', () => {
  it('puts the point it looks at in the middle of the frame', () => {
    const point = project([0, 2, 0], FRONT)
    expect([point.x, point.y, point.depth]).toEqual([0.5, 0.5, 10])
  })

  it('puts a point to the right on the right half and a point above on the upper half', () => {
    const right = project([2, 2, 0], FRONT)
    const above = project([0, 3, 0], FRONT)
    expect(right.x).toBeGreaterThan(0.5)
    expect(above.y).toBeLessThan(0.5)
  })

  it('reaches the frame edge at half the field of view', () => {
    const half = Math.tan((20 * Math.PI) / 180) * 10
    expect(project([0, 2 + half, 0], FRONT).y).toBeCloseTo(0, 6)
    expect(project([half * 2, 2, 0], FRONT).x).toBeCloseTo(1, 6)
  })
})
