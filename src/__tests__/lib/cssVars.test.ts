import { cssVars } from '@/lib/cssVars'

describe('cssVars', () => {
  it('hands the variables to the style prop unchanged', () => {
    expect(cssVars({ '--x': 3, '--delay': '120ms' })).toEqual({ '--x': 3, '--delay': '120ms' })
  })

  it('keeps an empty set empty', () => {
    expect(cssVars({})).toEqual({})
  })
})
