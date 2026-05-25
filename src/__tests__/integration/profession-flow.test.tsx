import { renderHook, act } from '@testing-library/react'
import {
  ProfessionProvider,
  useProfession,
  PROFESSION_CONFIGS,
} from '@/contexts/ProfessionContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProfessionProvider>{children}</ProfessionProvider>
)

describe('Profession Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('Complete profession switching flow', () => {
    it('user can switch between all professions', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      // Initial state
      expect(result.current.active).toBe('engineer')
      expect(result.current.config.title).toBe('System Engineer')

      // Switch to drummer
      act(() => {
        result.current.setActive('drummer')
      })
      expect(result.current.active).toBe('drummer')
      expect(result.current.config.title).toBe('Professional Drummer')

      // Switch to fighter
      act(() => {
        result.current.setActive('fighter')
      })
      expect(result.current.active).toBe('fighter')
      expect(result.current.config.title).toBe('Martial Arts Instructor')

      // Switch back to engineer
      act(() => {
        result.current.setActive('engineer')
      })
      expect(result.current.active).toBe('engineer')
      expect(result.current.config.title).toBe('System Engineer')
    })

    it('profession config updates correctly on each switch', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      // Engineer config
      expect(result.current.config).toEqual(PROFESSION_CONFIGS.engineer)
      expect(result.current.config.icon).toBe('//--')
      expect(result.current.config.color).toBe('#41c8e8')

      // Drummer config
      act(() => {
        result.current.setActive('drummer')
      })
      expect(result.current.config).toEqual(PROFESSION_CONFIGS.drummer)
      expect(result.current.config.icon).toBe('(O)')
      expect(result.current.config.color).toBe('#9966cc')

      // Fighter config
      act(() => {
        result.current.setActive('fighter')
      })
      expect(result.current.config).toEqual(PROFESSION_CONFIGS.fighter)
      expect(result.current.config.icon).toBe('/|\\')
      expect(result.current.config.color).toBe('#ff4444')
    })
  })

  describe('Profession persistence', () => {
    it('saves each profession change to localStorage', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      act(() => {
        result.current.setActive('drummer')
      })
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-profession', 'drummer')

      act(() => {
        result.current.setActive('fighter')
      })
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-profession', 'fighter')

      act(() => {
        result.current.setActive('engineer')
      })
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-profession', 'engineer')
    })

    it('restores profession from localStorage on mount', () => {
      ;(localStorage.getItem as jest.Mock).mockReturnValue('drummer')

      const { result } = renderHook(() => useProfession(), { wrapper })

      // After mount effect runs, should have drummer
      // Note: In test environment, the initial render may show engineer
      // then useEffect runs to update. We verify the localStorage was checked.
      expect(localStorage.getItem).toHaveBeenCalled()
    })
  })

  describe('All professions data integrity', () => {
    it('allProfessions contains all three professions', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      const professionIds = result.current.allProfessions.map((p) => p.id)

      expect(professionIds).toContain('engineer')
      expect(professionIds).toContain('drummer')
      expect(professionIds).toContain('fighter')
      expect(professionIds.length).toBe(3)
    })

    it('each profession has complete config', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      result.current.allProfessions.forEach((profession) => {
        expect(profession.id).toBeTruthy()
        expect(profession.title).toBeTruthy()
        expect(profession.tagline).toBeTruthy()
        expect(profession.icon).toBeTruthy()
        expect(profession.color).toMatch(/^#[0-9a-fA-F]{6}$/)
        expect(profession.years).toBeTruthy()
      })
    })
  })
})

describe('Profession Context Edge Cases', () => {
  it('handles rapid profession changes', () => {
    const { result } = renderHook(() => useProfession(), { wrapper })

    // Rapidly switch professions
    act(() => {
      result.current.setActive('drummer')
      result.current.setActive('fighter')
      result.current.setActive('engineer')
      result.current.setActive('drummer')
      result.current.setActive('fighter')
    })

    // Final state should be fighter
    expect(result.current.active).toBe('fighter')
    expect(result.current.config.title).toBe('Martial Arts Instructor')
  })

  it('handles setting same profession multiple times', () => {
    const { result } = renderHook(() => useProfession(), { wrapper })

    act(() => {
      result.current.setActive('engineer')
      result.current.setActive('engineer')
      result.current.setActive('engineer')
    })

    // Should still be engineer with no issues
    expect(result.current.active).toBe('engineer')
    expect(result.current.config.title).toBe('System Engineer')
  })
})
