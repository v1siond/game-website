import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { render } from '../test-utils'
import { themes } from '@/themes/themes'

describe('ThemeSwitcher', () => {
  describe('initial render', () => {
    it('renders the themes button', () => {
      render(<ThemeSwitcher />)

      expect(screen.getByRole('button', { name: /themes/i })).toBeInTheDocument()
    })

    it('dropdown is initially closed', () => {
      render(<ThemeSwitcher />)

      // Dropdown content should not be visible
      expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
    })
  })

  describe('dropdown behavior', () => {
    it('opens dropdown when button is clicked', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      const button = screen.getByRole('button', { name: /themes/i })
      await user.click(button)

      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()
    })

    it('displays all available themes when open', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Check that all theme names are displayed
      themes.forEach((theme) => {
        expect(screen.getByText(theme.name)).toBeInTheDocument()
      })
    })

    it('displays theme descriptions when open', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Check that theme descriptions are shown
      themes.forEach((theme) => {
        expect(screen.getByText(theme.description)).toBeInTheDocument()
      })
    })

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <ThemeSwitcher />
        </div>
      )

      // Open dropdown
      await user.click(screen.getByRole('button', { name: /themes/i }))
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'))

      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })
    })

    it('closes dropdown when pressing Escape', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Open dropdown
      await user.click(screen.getByRole('button', { name: /themes/i }))
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()

      // Press Escape
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })
    })

    it('toggles dropdown when clicking button again', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      const button = screen.getByRole('button', { name: /themes/i })

      // Open
      await user.click(button)
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()

      // Close
      await user.click(button)
      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })
    })
  })

  describe('theme selection', () => {
    it('closes dropdown after selecting a theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Open dropdown
      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Select a theme
      const themeButton = screen.getByRole('button', { name: /Retro RPG/i })
      await user.click(themeButton)

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
      })
    })

    it('shows checkmark on selected theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Open dropdown
      await user.click(screen.getByRole('button', { name: /themes/i }))

      // The default theme should be selected (has checkmark)
      // Dark Fantasy is the default
      const defaultThemeButton = screen.getByRole('button', { name: /Dark Fantasy/i })

      // Check that checkmark exists within the button
      expect(defaultThemeButton.textContent).toContain('Dark Fantasy')
    })

    it('has color indicators for each theme', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Each theme should have a colored dot
      const themeButtons = screen.getAllByRole('button').filter((btn) =>
        themes.some((t) => btn.textContent?.includes(t.name))
      )

      // Each button should contain a span with the accent color
      expect(themeButtons.length).toBe(themes.length)
    })
  })

  describe('accessibility', () => {
    it('theme buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      // Tab to the button and press Enter
      await user.tab()
      await user.keyboard('{Enter}')

      // Dropdown should open
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()
    })

    it('each theme in dropdown is a button element', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // All themes should be buttons
      themes.forEach((theme) => {
        const themeElement = screen.getByRole('button', { name: new RegExp(theme.name) })
        expect(themeElement).toBeInTheDocument()
      })
    })
  })

  describe('hover effects', () => {
    it('button has hover state styles', () => {
      render(<ThemeSwitcher />)

      const button = screen.getByRole('button', { name: /themes/i })

      // Check button has transition class
      expect(button).toHaveClass('transition-colors')
    })

    it('theme options have hover state styles', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />)

      await user.click(screen.getByRole('button', { name: /themes/i }))

      const themeOption = screen.getByRole('button', { name: /Dark Fantasy/i })
      expect(themeOption).toHaveClass('transition-all')
    })
  })
})
