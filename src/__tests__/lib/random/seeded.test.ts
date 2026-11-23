import { mulberry32, seedOf } from '@/lib/random/seeded'

// Captured from the terminal's own generator before it moved to the shared one, so the shared one deals the same numbers.
const TERMINAL_STREAMS_BEFORE: Record<number, number[]> = {
  0: [0.26642920868471265, 0.0003297457005828619, 0.2232720274478197, 0.1462021479383111],
  7: [0.011704753153026104, 0.06195825757458806, 0.97690763277933, 0.6990287057124078],
}

const firstFour = (next: () => number): number[] => [next(), next(), next(), next()]

describe('seeded random', () => {
  it.each(Object.entries(TERMINAL_STREAMS_BEFORE))('streams the terminal numbers of seed %s it streamed before', (seed, stream) => {
    expect(firstFour(mulberry32(Number(seed)))).toEqual(stream)
  })

  it('gives one text one seed and two texts two seeds', () => {
    expect(seedOf('datepal')).toBe(seedOf('datepal'))
    expect(seedOf('datepal')).not.toBe(seedOf('clutchprep'))
  })
})
