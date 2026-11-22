import { pixelRuns } from '@/lib/pixelRuns'

describe('pixelRuns', () => {
  it('merges a row into runs of one colour and skips the transparent pixels', () => {
    expect(pixelRuns(['..KKSS..'], 3)).toEqual([
      { x: 2, y: 3, width: 2, key: 'K' },
      { x: 4, y: 3, width: 2, key: 'S' },
    ])
  })
})
