import { nextIn } from '@/lib/nextIn'

const CYCLE = ['jab', 'cross', 'hook'] as const

describe('nextIn', () => {
  it('starts the cycle on its first item when nothing came before', () => {
    expect(nextIn(CYCLE, null)).toBe('jab')
  })

  it('gives the item after the last one', () => {
    expect(nextIn(CYCLE, 'jab')).toBe('cross')
    expect(nextIn(CYCLE, 'cross')).toBe('hook')
  })

  it('goes back to the first item after the last', () => {
    expect(nextIn(CYCLE, 'hook')).toBe('jab')
  })

  it('stays on the only item of a one item list', () => {
    expect(nextIn(['roar'], 'roar')).toBe('roar')
  })
})
