import { renderHook, act } from '@testing-library/react'
import { ProfessionProvider, useProfession } from '@/contexts/ProfessionContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProfessionProvider>{children}</ProfessionProvider>
)

describe('Profession Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    jest.clearAllMocks()
  })

  it('switches through every profession and back', () => {
    const { result } = renderHook(() => useProfession(), { wrapper })

    expect(result.current.active).toBe('engineer')
    act(() => result.current.setActive('drummer'))
    expect(result.current.active).toBe('drummer')
    act(() => result.current.setActive('fighter'))
    expect(result.current.active).toBe('fighter')
    act(() => result.current.setActive('engineer'))
    expect(result.current.active).toBe('engineer')
  })

  it('opens on engineer even when an older visit stored another profession', () => {
    ;(localStorage.getItem as jest.Mock).mockReturnValue('drummer')

    const { result } = renderHook(() => useProfession(), { wrapper })

    expect(result.current.active).toBe('engineer')
  })

  it('keeps the last of rapid changes', () => {
    const { result } = renderHook(() => useProfession(), { wrapper })

    act(() => {
      result.current.setActive('drummer')
      result.current.setActive('fighter')
      result.current.setActive('engineer')
      result.current.setActive('fighter')
    })

    expect(result.current.active).toBe('fighter')
  })

  it('stays put when the same profession is set again', () => {
    const { result } = renderHook(() => useProfession(), { wrapper })

    act(() => {
      result.current.setActive('engineer')
      result.current.setActive('engineer')
    })

    expect(result.current.active).toBe('engineer')
  })
})
