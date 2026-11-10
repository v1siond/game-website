import { breachPuzzle } from '@/components/themes/NeonCyber/breach'
import { mulberry32, seedOf } from '@/lib/random/seeded'

// Captured from each world's own generator before the two were merged, so the shared one deals the same boards.
const BREACH_BEFORE = {
  'agency-rocket': {
    matrix: [[93, 58, 58, 145, 126], [228, 93, 126, 228, 93], [228, 93, 93, 126, 145], [58, 93, 58, 145, 145], [228, 145, 93, 126, 126]],
    sequence: [93, 228, 93],
  },
  clutchprep: {
    matrix: [[194, 126, 93, 93, 194], [58, 93, 228, 145, 145], [126, 194, 58, 194, 126], [93, 194, 145, 194, 145], [93, 228, 145, 58, 58]],
    sequence: [93, 145, 93],
  },
  datepal: {
    matrix: [[228, 126, 228, 194, 58], [126, 58, 194, 145, 58], [228, 58, 58, 93, 93], [126, 93, 228, 145, 58], [194, 145, 58, 58, 194]],
    sequence: [228, 194, 58],
  },
}

const TERMINAL_STREAMS_BEFORE: Record<number, number[]> = {
  0: [0.26642920868471265, 0.0003297457005828619, 0.2232720274478197, 0.1462021479383111],
  7: [0.011704753153026104, 0.06195825757458806, 0.97690763277933, 0.6990287057124078],
}

const firstFour = (next: () => number): number[] => [next(), next(), next(), next()]

describe('seeded random', () => {
  it.each(Object.entries(BREACH_BEFORE))('deals the %s breach matrix it dealt before', (slug, puzzle) => {
    expect(breachPuzzle(slug)).toEqual(puzzle)
  })

  it.each(Object.entries(TERMINAL_STREAMS_BEFORE))('streams the terminal numbers of seed %s it streamed before', (seed, stream) => {
    expect(firstFour(mulberry32(Number(seed)))).toEqual(stream)
  })

  it('gives one text one seed and two texts two seeds', () => {
    expect(seedOf('datepal')).toBe(seedOf('datepal'))
    expect(seedOf('datepal')).not.toBe(seedOf('clutchprep'))
  })
})
