import { focusOn } from './stageNodes'

// The camera push: a zoom held on one point of the canvas, so that point stays where it is on screen.
const apply = (transform: string, x: number, y: number): [number, number] => {
  const [, tx, ty, k] = /translate\((\S+) (\S+)\) scale\((\S+)\)/.exec(transform)!.map(Number)
  return [tx + k * x, ty + k * y]
}

describe('focusOn', () => {
  it('keeps the focus point in place at any zoom', () => {
    expect(apply(focusOn(1100, 560, 1.35), 1100, 560)).toEqual([1100, 560])
  })

  it('pushes the rest of the canvas away from the focus', () => {
    const [x, y] = apply(focusOn(1100, 560, 1.5), 1000, 460)
    expect(x).toBeCloseTo(950)
    expect(y).toBeCloseTo(410)
  })

  it('is the identity at zoom 1', () => {
    expect(focusOn(1100, 560, 1)).toBe('translate(0 0) scale(1.000)')
  })
})
