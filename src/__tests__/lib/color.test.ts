import { mix } from '@/lib/color'

describe('mix', () => {
  it('lands halfway between black and white on #808080, the hex both old copies gave', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080')
  })

  it('keeps the first colour at 0 and reaches the second at 1', () => {
    expect(mix('#0f0a1a', '#41c8e8', 0)).toBe('#0f0a1a')
    expect(mix('#0f0a1a', '#41c8e8', 1)).toBe('#41c8e8')
  })

  it('rounds each channel on its own, as the stage palette mixes its void toward the accent', () => {
    expect(mix('#0f0a1a', '#41c8e8', 0.1)).toBe('#141d2f')
  })

  it('reads a three digit colour as its six digit form', () => {
    expect(mix('#fff', '#000000', 0)).toBe('#ffffff')
  })
})
