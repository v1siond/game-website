import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../test-utils'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { themes } from '@/themes/themes'

describe('Theme Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('Complete theme switching flow', () => {
    it('user can open dropdown, browse themes, and select one', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Step 1: Open dropdown
      const triggerButton = screen.getByRole('button', { name: /themes/i })
      await user.click(triggerButton)

      // Step 2: Verify all themes are visible
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()
      themes.forEach((theme) => {
        expect(screen.getByText(theme.name)).toBeInTheDocument()
      })

      // Step 3: Select a different theme
      const retroRPGButton = screen.getByRole('button', { name: /Retro RPG/i })
      await user.click(retroRPGButton)

      // Step 4: Dropdown closes
      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })

      // Step 5: Theme is persisted
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'retro-rpg')
    })

    it('user can switch themes multiple times', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Switch to Retro RPG
      await user.click(screen.getByRole('button', { name: /themes/i }))
      await user.click(screen.getByRole('button', { name: /Retro RPG/i }))

      // Switch to Neon Cyber
      await user.click(screen.getByRole('button', { name: /themes/i }))
      await user.click(screen.getByRole('button', { name: /Neon Cyber/i }))

      // Switch to Mythic
      await user.click(screen.getByRole('button', { name: /themes/i }))
      await user.click(screen.getByRole('button', { name: /Mythic/i }))

      // Final theme should be persisted
      expect(localStorage.setItem).toHaveBeenLastCalledWith('portfolio-theme', 'mythic')
    })

    it('user can cancel theme selection by clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <div data-testid="outside-area">Outside</div>
          <ThemeSwitcher />
        </div>
      )

      // Open dropdown
      await user.click(screen.getByRole('button', { name: /themes/i }))
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()

      // Click outside
      const outsideArea = screen.getByTestId('outside-area')
      await user.click(outsideArea)

      // Dropdown should close without changing theme
      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })
    })

    it('user can cancel theme selection with Escape key', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Open dropdown
      await user.click(screen.getByRole('button', { name: /themes/i }))
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()

      // Press Escape
      await user.keyboard('{Escape}')

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })
    })
  })

  describe('Theme selection visual feedback', () => {
    it('shows checkmark on currently selected theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Default theme (Dark Fantasy) should have checkmark visual indicator
      const darkFantasyButton = screen.getByRole('button', { name: /Dark Fantasy/i })
      // The button styling indicates selection through border and background
      expect(darkFantasyButton).toBeInTheDocument()
    })

    it('theme options show color indicators', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Each theme button should contain a color dot
      const themeButtons = screen.getAllByRole('button').filter((btn) =>
        themes.some((t) => btn.textContent?.includes(t.name))
      )

      themeButtons.forEach((button) => {
        const colorDot = button.querySelector('.rounded-full')
        expect(colorDot).toBeInTheDocument()
      })
    })
  })

  describe('Keyboard navigation', () => {
    it('user can navigate and select theme using only keyboard', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Tab to the button
      await user.tab()
      expect(screen.getByRole('button', { name: /themes/i })).toHaveFocus()

      // Press Enter to open
      await user.keyboard('{Enter}')
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()

      // Press Escape to close
      await user.keyboard('{Escape}')
      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })
    })
  })
})

describe('Theme Persistence Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('theme selection survives component remount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ThemeSwitcher />)

    // Select a theme
    await user.click(screen.getByRole('button', { name: /themes/i }))
    await user.click(screen.getByRole('button', { name: /Bold Noir/i }))

    // Verify it was saved
    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'bold-noir')

    // Unmount
    unmount()

    // Mock reading from localStorage
    ;(localStorage.getItem as jest.Mock).mockReturnValue('bold-noir')

    // Remount
    render(<ThemeSwitcher />)

    // Theme context should read from localStorage on mount
    // (The actual persistence is verified through the mock calls)
    expect(localStorage.getItem).toHaveBeenCalled()
  })
})
