import { PAD_SPOTS, STAGE_LENS, padsOnScreen } from './pads'

describe('the warp pads on screen', () => {
  it('puts the middle pad in the middle and the outer two mirrored', () => {
    const [left, middle, right] = padsOnScreen(STAGE_LENS)
    expect(middle.x).toBeCloseTo(0.5, 6)
    expect(left.x + right.x).toBeCloseTo(1, 6)
    expect(left.x).toBeLessThan(middle.x)
  })

  it('keeps every pad inside the stage frame', () => {
    padsOnScreen(STAGE_LENS).forEach((pad) => {
      expect([pad.x > 0.05 && pad.x < 0.95, pad.y > 0.05 && pad.y < 0.95]).toEqual([true, true])
    })
  })

  it('has one pad per profession', () => {
    expect(Object.keys(PAD_SPOTS).sort()).toEqual(['drummer', 'engineer', 'fighter'])
  })
})
