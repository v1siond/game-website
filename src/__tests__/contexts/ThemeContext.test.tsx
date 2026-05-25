import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/themes/ThemeContext'
import { themes, DEFAULT_THEME_ID, getThemeById } from '@/themes/themes'

// Test wrapper for hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('ThemeProvider', () => {
    it('provides default theme initially', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBeDefined()
      expect(result.current.theme.id).toBe(DEFAULT_THEME_ID)
    })

    it('provides all available themes', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.allThemes).toEqual(themes)
      expect(result.current.allThemes.length).toBeGreaterThan(0)
    })

    it('provides setThemeById function', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(typeof result.current.setThemeById).toBe('function')
    })
  })

  describe('useTheme hook', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleSpy.mockRestore()
    })

    it('allows theme switching via setThemeById', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      // Find a different theme to switch to
      const newTheme = themes.find((t) => t.id !== DEFAULT_THEME_ID)
      expect(newTheme).toBeDefined()

      act(() => {
        result.current.setThemeById(newTheme!.id)
      })

      expect(result.current.theme.id).toBe(newTheme!.id)
    })

    it('persists theme selection to localStorage', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })
      const newThemeId = 'retro-rpg'

      act(() => {
        result.current.setThemeById(newThemeId)
      })

      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', newThemeId)
    })

    it('handles invalid theme ID gracefully', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setThemeById('non-existent-theme')
      })

      // Should fallback to first theme
      expect(result.current.theme).toBeDefined()
      expect(result.current.theme.id).toBe(themes[0].id)
    })
  })

  describe('Theme data structure', () => {
    it('all themes have required color properties', () => {
      themes.forEach((theme) => {
        expect(theme.colors).toBeDefined()
        expect(theme.colors.background).toBeDefined()
        expect(theme.colors.accent).toBeDefined()
        expect(theme.colors.text).toBeDefined()
        expect(theme.colors.textMuted).toBeDefined()
        expect(theme.colors.border).toBeDefined()
        expect(theme.colors.surface).toBeDefined()
      })
    })

    it('all themes have unique IDs', () => {
      const ids = themes.map((t) => t.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(themes.length)
    })

    it('all themes have name and description', () => {
      themes.forEach((theme) => {
        expect(theme.name).toBeTruthy()
        expect(theme.description).toBeTruthy()
      })
    })

    it('all themes have valid effect settings', () => {
      themes.forEach((theme) => {
        expect(theme.effects).toBeDefined()
        expect(typeof theme.effects.vignette).toBe('boolean')
        expect(typeof theme.effects.grain).toBe('boolean')
        expect(typeof theme.effects.scanlines).toBe('boolean')
        expect(typeof theme.effects.grainOpacity).toBe('number')
      })
    })
  })

  describe('getThemeById', () => {
    it('returns correct theme for valid ID', () => {
      const theme = getThemeById('retro-rpg')
      expect(theme.id).toBe('retro-rpg')
      expect(theme.name).toBe('Retro RPG')
    })

    it('returns first theme for invalid ID', () => {
      const theme = getThemeById('invalid-theme-id')
      expect(theme).toBe(themes[0])
    })

    it('returns default theme for empty string', () => {
      const theme = getThemeById('')
      expect(theme).toBe(themes[0])
    })
  })
})
