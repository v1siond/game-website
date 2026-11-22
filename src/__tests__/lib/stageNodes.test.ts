import { clamp01, fadeTo, frames, fx, fxAll, lerp, r1, reached, spread, transformTo, translateTo } from '@/components/themes/shared/stageNodes'

// The node writers every theatre world's scene binder shares: the numbers they print and the nodes they
// touch, on a small SVG built the way a stage's markup is.

const stage = (): SVGSVGElement => {
  const holder = document.createElement('div')
  holder.innerHTML = `<svg><g data-fx="hero"><g data-frame="stand" visibility="visible"></g><g data-frame="jump" visibility="hidden"></g></g><g data-fx="coin-0"></g><g data-fx="coin-1"></g><g data-fx="cloud"></g></svg>`
  return holder.querySelector('svg')!
}

describe('the stage numbers', () => {
  it('prints one decimal', () => {
    expect(r1(12.345)).toBe(12.3)
    expect(r1(-0.06)).toBe(-0.1)
  })

  it('clamps to 0 and 1 and reads a fractional count per item', () => {
    expect([clamp01(-2), clamp01(0.4), clamp01(3)]).toEqual([0, 0.4, 1])
    expect([reached(2.5, 0), reached(2.5, 2), reached(2.5, 3)]).toEqual([1, 0.5, 0])
  })

  it('spreads places evenly, one in the middle', () => {
    expect(spread(3, 590, 1010)).toEqual([590, 800, 1010])
    expect(spread(1, 590, 1010)).toEqual([800])
    expect(lerp(10, 20, 0.25)).toBe(12.5)
  })
})

describe('the stage node writers', () => {
  it('finds a marked node, or every node of a prefix in document order, and none on a null stage', () => {
    const svg = stage()
    expect(fx(svg, 'cloud')?.getAttribute('data-fx')).toBe('cloud')
    expect(fxAll(svg, 'coin-').map((node) => node.getAttribute('data-fx'))).toEqual(['coin-0', 'coin-1'])
    expect(fx({ querySelector: () => null }, 'cloud')).toBeNull()
  })

  it('writes the transform and the opacity attributes as Era Postcards prints them', () => {
    const svg = stage()
    const cloud = fx(svg, 'cloud')
    translateTo(cloud, 12.34, -5.06)
    expect(cloud?.getAttribute('transform')).toBe('translate(12.3 -5.1)')
    transformTo(cloud, 'rotate(4)')
    expect(cloud?.getAttribute('transform')).toBe('rotate(4)')
    fadeTo(cloud, 0.12345)
    expect(cloud?.getAttribute('opacity')).toBe('0.123')
    expect(() => fadeTo(null, 1)).not.toThrow()
  })

  it('shows one sprite frame at a time and ignores a frame it does not have', () => {
    const hero = fx(stage(), 'hero')
    const show = frames(hero, 'stand')
    const shown = () => Array.from(hero?.querySelectorAll('[data-frame]') ?? [], (el) => `${el.getAttribute('data-frame')}:${el.getAttribute('visibility')}`)
    show('jump')
    expect(shown()).toEqual(['stand:hidden', 'jump:visible'])
    show('kick')
    expect(shown()).toEqual(['stand:hidden', 'jump:visible'])
    show('stand')
    expect(shown()).toEqual(['stand:visible', 'jump:hidden'])
  })
})
