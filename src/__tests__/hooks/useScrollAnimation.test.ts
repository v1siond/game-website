import { renderHook, act } from '@testing-library/react'
import {
  useSmoothScroll,
  useScrollTrigger,
  useScrollZones,
  lerp,
  clamp,
  mapRange,
} from '@/hooks/useScrollAnimation'

// Mock window scroll-related properties
const mockScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    value,
    writable: true,
    configurable: true,
  })
}

const mockDocHeight = (scrollHeight: number, innerHeight: number) => {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    writable: true,
    configurable: true,
  })
  Object.defineProperty(window, 'innerHeight', {
    value: innerHeight,
    writable: true,
    configurable: true,
  })
}

// Mock requestAnimationFrame
const mockRAF = () => {
  let frameId = 0
  const originalRAF = window.requestAnimationFrame
  const originalCAF = window.cancelAnimationFrame

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    frameId++
    setTimeout(() => cb(performance.now()), 16)
    return frameId
  })

  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

  return () => {
    window.requestAnimationFrame = originalRAF
    window.cancelAnimationFrame = originalCAF
  }
}

describe('Utility Functions', () => {
  describe('lerp', () => {
    it('returns start when factor is 0', () => {
      expect(lerp(0, 100, 0)).toBe(0)
      expect(lerp(10, 50, 0)).toBe(10)
    })

    it('returns end when factor is 1', () => {
      expect(lerp(0, 100, 1)).toBe(100)
      expect(lerp(10, 50, 1)).toBe(50)
    })

    it('returns midpoint when factor is 0.5', () => {
      expect(lerp(0, 100, 0.5)).toBe(50)
      expect(lerp(10, 50, 0.5)).toBe(30)
    })

    it('works with negative numbers', () => {
      expect(lerp(-100, 100, 0.5)).toBe(0)
      expect(lerp(-50, -10, 0.5)).toBe(-30)
    })

    it('handles decimals', () => {
      expect(lerp(0, 1, 0.25)).toBeCloseTo(0.25)
      expect(lerp(0, 1, 0.75)).toBeCloseTo(0.75)
    })
  })

  describe('clamp', () => {
    it('returns value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })

    it('returns min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(-100, 0, 10)).toBe(0)
    })

    it('returns max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10)
      expect(clamp(100, 0, 10)).toBe(10)
    })

    it('handles negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(0, -10, -1)).toBe(-1)
    })
  })

  describe('mapRange', () => {
    it('maps value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
      expect(mapRange(0, 0, 10, 0, 100)).toBe(0)
      expect(mapRange(10, 0, 10, 0, 100)).toBe(100)
    })

    it('maps to different range sizes', () => {
      expect(mapRange(50, 0, 100, 0, 1)).toBe(0.5)
      expect(mapRange(0.5, 0, 1, 0, 100)).toBe(50)
    })

    it('clamps output to target range', () => {
      expect(mapRange(-5, 0, 10, 0, 100)).toBe(0)
      expect(mapRange(15, 0, 10, 0, 100)).toBe(100)
    })

    it('handles inverted ranges', () => {
      expect(mapRange(5, 0, 10, 100, 0)).toBe(50)
    })
  })
})

describe('useSmoothScroll', () => {
  let cleanupRAF: () => void

  beforeEach(() => {
    mockScrollY(0)
    mockDocHeight(2000, 1000)
    cleanupRAF = mockRAF()
  })

  afterEach(() => {
    cleanupRAF()
    jest.clearAllMocks()
  })

  it('returns initial values', () => {
    const { result } = renderHook(() => useSmoothScroll())

    expect(result.current.scrollY).toBeDefined()
    expect(result.current.smoothScrollY).toBeDefined()
    expect(result.current.scrollProgress).toBeDefined()
    expect(result.current.isScrollingDown).toBeDefined()
  })

  it('accepts custom smoothing factor', () => {
    const { result } = renderHook(() => useSmoothScroll(0.2))

    expect(result.current).toBeDefined()
  })

  it('updates on scroll event', async () => {
    const { result } = renderHook(() => useSmoothScroll())

    // Simulate scroll
    act(() => {
      mockScrollY(500)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.scrollY).toBe(500)
  })

  it('calculates scroll progress', async () => {
    const { result } = renderHook(() => useSmoothScroll())

    // Set up document height (scrollHeight - innerHeight = 1000)
    // Scroll to middle
    act(() => {
      mockScrollY(500)
      window.dispatchEvent(new Event('scroll'))
    })

    // Progress should be approximately 0.5
    expect(result.current.scrollProgress).toBe(0.5)
  })

  it('detects scroll direction', async () => {
    const { result } = renderHook(() => useSmoothScroll())

    // Scroll down
    act(() => {
      mockScrollY(100)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.isScrollingDown).toBe(true)

    // Scroll up
    act(() => {
      mockScrollY(50)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.isScrollingDown).toBe(false)
  })
})

describe('useScrollTrigger', () => {
  beforeEach(() => {
    mockScrollY(0)
    mockDocHeight(2000, 1000)
  })

  it('returns false initially', () => {
    const { result } = renderHook(() => useScrollTrigger(0.5))

    expect(result.current).toBe(false)
  })

  it('triggers when scroll passes threshold', async () => {
    const { result } = renderHook(() => useScrollTrigger(0.3))

    // Scroll past 30% threshold
    act(() => {
      mockScrollY(400) // 400/1000 = 0.4 > 0.3
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)
  })

  it('does not trigger when below threshold', async () => {
    const { result } = renderHook(() => useScrollTrigger(0.5))

    // Scroll to 20%
    act(() => {
      mockScrollY(200)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(false)
  })

  it('stays triggered once fired', async () => {
    const { result } = renderHook(() => useScrollTrigger(0.3))

    // Trigger
    act(() => {
      mockScrollY(400)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(true)

    // Scroll back
    act(() => {
      mockScrollY(0)
      window.dispatchEvent(new Event('scroll'))
    })

    // Should still be triggered
    expect(result.current).toBe(true)
  })
})

describe('useScrollZones', () => {
  beforeEach(() => {
    mockScrollY(0)
    mockDocHeight(2000, 1000)
  })

  it('returns empty set initially', () => {
    const { result } = renderHook(() => useScrollZones([0.25, 0.5, 0.75]))

    expect(result.current.size).toBe(0)
  })

  it('triggers zones as scroll passes them', async () => {
    const { result } = renderHook(() => useScrollZones([0.25, 0.5, 0.75]))

    // Scroll to 30%
    act(() => {
      mockScrollY(300)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.has(0.25)).toBe(true)
    expect(result.current.has(0.5)).toBe(false)
    expect(result.current.has(0.75)).toBe(false)

    // Scroll to 60%
    act(() => {
      mockScrollY(600)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.has(0.25)).toBe(true)
    expect(result.current.has(0.5)).toBe(true)
    expect(result.current.has(0.75)).toBe(false)

    // Scroll to 80%
    act(() => {
      mockScrollY(800)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.has(0.25)).toBe(true)
    expect(result.current.has(0.5)).toBe(true)
    expect(result.current.has(0.75)).toBe(true)
  })

  it('keeps zones triggered when scrolling back', async () => {
    const { result } = renderHook(() => useScrollZones([0.25, 0.5]))

    // Scroll to trigger zones
    act(() => {
      mockScrollY(600)
      window.dispatchEvent(new Event('scroll'))
    })

    // Scroll back
    act(() => {
      mockScrollY(100)
      window.dispatchEvent(new Event('scroll'))
    })

    // Zones should still be triggered
    expect(result.current.has(0.25)).toBe(true)
    expect(result.current.has(0.5)).toBe(true)
  })

  it('handles empty zones array', () => {
    const { result } = renderHook(() => useScrollZones([]))

    expect(result.current.size).toBe(0)
  })
})
