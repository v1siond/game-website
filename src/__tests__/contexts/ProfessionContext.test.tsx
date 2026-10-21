import { renderHook, act } from '@testing-library/react'
import { ProfessionProvider, useProfession, type Profession } from '@/contexts/ProfessionContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProfessionProvider>{children}</ProfessionProvider>
)

describe('ProfessionContext', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    jest.clearAllMocks()
  })

  it('opens on the engineer', () => {
    const { result } = renderHook(() => useProfession(), { wrapper })

    expect(result.current.active).toBe('engineer')
  })

  it('throws when used outside the provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    expect(() => renderHook(() => useProfession())).toThrow('useProfession must be used within a ProfessionProvider')

    consoleSpy.mockRestore()
  })

  it.each<Profession>(['drummer', 'fighter', 'engineer'])('switches to %s', (profession) => {
    const { result } = renderHook(() => useProfession(), { wrapper })

    act(() => result.current.setActive(profession))

    expect(result.current.active).toBe(profession)
  })
})
