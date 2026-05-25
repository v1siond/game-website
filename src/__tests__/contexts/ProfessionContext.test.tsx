import { renderHook, act } from '@testing-library/react'
import {
  ProfessionProvider,
  useProfession,
  PROFESSION_CONFIGS,
  type Profession,
} from '@/contexts/ProfessionContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProfessionProvider>{children}</ProfessionProvider>
)

describe('ProfessionContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('ProfessionProvider', () => {
    it('provides default profession as engineer', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      expect(result.current.active).toBe('engineer')
    })

    it('provides profession config', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      expect(result.current.config).toEqual(PROFESSION_CONFIGS.engineer)
    })

    it('provides all professions list', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      expect(result.current.allProfessions).toHaveLength(3)
      expect(result.current.allProfessions).toContainEqual(PROFESSION_CONFIGS.engineer)
      expect(result.current.allProfessions).toContainEqual(PROFESSION_CONFIGS.drummer)
      expect(result.current.allProfessions).toContainEqual(PROFESSION_CONFIGS.fighter)
    })
  })

  describe('useProfession hook', () => {
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useProfession())
      }).toThrow('useProfession must be used within a ProfessionProvider')

      consoleSpy.mockRestore()
    })

    it('allows switching to drummer profession', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      act(() => {
        result.current.setActive('drummer')
      })

      expect(result.current.active).toBe('drummer')
      expect(result.current.config).toEqual(PROFESSION_CONFIGS.drummer)
    })

    it('allows switching to fighter profession', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      act(() => {
        result.current.setActive('fighter')
      })

      expect(result.current.active).toBe('fighter')
      expect(result.current.config).toEqual(PROFESSION_CONFIGS.fighter)
    })

    it('allows switching back to engineer profession', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      // Switch away first
      act(() => {
        result.current.setActive('drummer')
      })

      // Then switch back
      act(() => {
        result.current.setActive('engineer')
      })

      expect(result.current.active).toBe('engineer')
      expect(result.current.config).toEqual(PROFESSION_CONFIGS.engineer)
    })

    it('persists profession selection to localStorage', () => {
      const { result } = renderHook(() => useProfession(), { wrapper })

      act(() => {
        result.current.setActive('drummer')
      })

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-profession', 'drummer')
    })
  })

  describe('PROFESSION_CONFIGS', () => {
    const professions: Profession[] = ['engineer', 'drummer', 'fighter']

    professions.forEach((profession) => {
      describe(`${profession} config`, () => {
        it('has required id matching key', () => {
          expect(PROFESSION_CONFIGS[profession].id).toBe(profession)
        })

        it('has a title', () => {
          expect(PROFESSION_CONFIGS[profession].title).toBeTruthy()
        })

        it('has a tagline', () => {
          expect(PROFESSION_CONFIGS[profession].tagline).toBeTruthy()
        })

        it('has an icon', () => {
          expect(PROFESSION_CONFIGS[profession].icon).toBeTruthy()
        })

        it('has a color', () => {
          expect(PROFESSION_CONFIGS[profession].color).toBeTruthy()
          expect(PROFESSION_CONFIGS[profession].color).toMatch(/^#/)
        })

        it('has years of experience', () => {
          expect(PROFESSION_CONFIGS[profession].years).toBeTruthy()
        })
      })
    })

    it('engineer has specific values', () => {
      expect(PROFESSION_CONFIGS.engineer.title).toBe('System Engineer')
      expect(PROFESSION_CONFIGS.engineer.years).toBe('10+ years')
    })

    it('drummer has specific values', () => {
      expect(PROFESSION_CONFIGS.drummer.title).toBe('Professional Drummer')
      expect(PROFESSION_CONFIGS.drummer.years).toBe('15 years')
    })

    it('fighter has specific values', () => {
      expect(PROFESSION_CONFIGS.fighter.title).toBe('Martial Arts Instructor')
      expect(PROFESSION_CONFIGS.fighter.years).toBe('6 years')
    })
  })
})
