import { staggerAt } from '@/components/themes/shared/stagger'

describe('staggerAt', () => {
  it('gives each of the first eight items its own --i step', () => {
    expect([0, 1, 7].map(staggerAt)).toEqual(['[--i:0]', '[--i:1]', '[--i:7]'])
  })

  it('holds every later item on the last step', () => {
    expect(staggerAt(12)).toBe('[--i:7]')
  })
})
