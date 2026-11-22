import { STRIDE_PX, gait, gaitAt, walkOn } from '@/lib/motion/gait'

// The walk faces +x: a positive hip angle swings the leg toward his facing. Scrolling down raises the phase,
// so a rising phase must carry him forward: each leg swings forward while its knee is bent (in the air)
// and sweeps back while it is straight (planted), which pushes the body forward over the planted foot.

const STEPS = 200
// Any bend past the straight leg's -6 means the leg is in the air.
const BENT = -6.5
const phases = Array.from({ length: STEPS }, (_, i) => i / STEPS)

const swings = (leg: 'F' | 'B') =>
  phases.map((phase) => {
    // Each step is judged at its middle, so a step across a footfall counts once, on the side it is mostly on.
    const now = gait(phase)
    const middle = gait(phase + 0.5 / STEPS)
    const next = gait(phase + 1 / STEPS)
    return { inAir: middle[`knee${leg}`] < BENT, forward: next[`hip${leg}`] > now[`hip${leg}`] }
  })

describe('gait', () => {
  it.each(['F', 'B'] as const)('swings leg %s toward his facing while it is in the air', (leg) => {
    const air = swings(leg).filter((step) => step.inAir)
    expect(air.length).toBeGreaterThan(STEPS / 4)
    expect(air.filter((step) => !step.forward)).toEqual([])
  })

  it.each(['F', 'B'] as const)('sweeps leg %s back while it is planted, so he moves forward', (leg) => {
    const planted = swings(leg).filter((step) => !step.inAir)
    expect(planted.length).toBeGreaterThan(STEPS / 4)
    expect(planted.filter((step) => step.forward)).toEqual([])
  })

  it('raises the phase as he moves forward, so scrolling down steps forward and scrolling up plays it back', () => {
    const scale = 1.25
    const at = (x: number) => gaitAt(x, scale, 1)
    expect(at(STRIDE_PX * scale * 0.25)).toEqual(gait(0.25))
    expect(at(800 + STRIDE_PX * scale)).toEqual(gait((800 + STRIDE_PX * scale) / (STRIDE_PX * scale)))
  })
})

describe('walkOn', () => {
  it('never carries him back as the scene plays', () => {
    const xs = Array.from({ length: 101 }, (_, i) => walkOn(600, i / 100))
    xs.slice(1).forEach((x, i) => expect(x).toBeGreaterThan(xs[i]))
  })

  it('puts him on his mark once he has walked in', () => {
    expect(walkOn(600, 0.2)).toBeGreaterThanOrEqual(600)
    expect(walkOn(600, 0)).toBeLessThan(600)
  })
})
