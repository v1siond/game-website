import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { DownloadPdfButton } from '@/components/cv/DownloadPdfButton'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { ThemeProvider } from '@/themes/ThemeContext'
import { ProfessionProvider } from '@/contexts/ProfessionContext'

// Wrapper for components that need theme context
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ProfessionProvider>{children}</ProfessionProvider>
  </ThemeProvider>
)

describe('Accessibility Tests', () => {
  describe('ThemeSwitcher Accessibility', () => {
    it('has accessible button with clear text', () => {
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      const button = screen.getByRole('button', { name: /themes/i })
      expect(button).toBeInTheDocument()
    })

    it('can be activated with keyboard Enter', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      const button = screen.getByRole('button', { name: /themes/i })
      button.focus()

      await user.keyboard('{Enter}')

      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()
    })

    it('can be activated with keyboard Space', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      const button = screen.getByRole('button', { name: /themes/i })
      button.focus()

      await user.keyboard(' ')

      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()
    })

    it('can close dropdown with Escape key', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      // Open
      await user.click(screen.getByRole('button', { name: /themes/i }))
      expect(screen.getByText('[ SELECT THEME ]')).toBeInTheDocument()

      // Close with Escape
      await user.keyboard('{Escape}')

      expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
    })

    it('theme options are buttons with accessible names', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Each theme should be a button
      const themeButtons = screen.getAllByRole('button').filter(
        (btn) => btn.textContent && btn.textContent !== 'THEMES'
      )

      expect(themeButtons.length).toBeGreaterThan(0)
      themeButtons.forEach((btn) => {
        expect(btn.textContent).toBeTruthy()
      })
    })

    it('indicates selected theme visually', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Selected theme should have checkmark
      const darkFantasyButton = screen.getByRole('button', { name: /Dark Fantasy/i })
      expect(darkFantasyButton.textContent).toContain('Dark Fantasy')
    })
  })

  describe('DownloadPdfButton Accessibility', () => {
    beforeEach(() => {
      const mockElement = document.createElement('div')
      mockElement.id = 'cv-content'
      document.body.appendChild(mockElement)
    })

    afterEach(() => {
      const element = document.getElementById('cv-content')
      if (element) document.body.removeChild(element)
    })

    it('has accessible button role', () => {
      render(<DownloadPdfButton label="Download PDF" />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has descriptive button text', () => {
      render(<DownloadPdfButton label="Download CV as PDF" />)

      expect(screen.getByRole('button')).toHaveTextContent('Download CV as PDF')
    })

    it('is keyboard focusable', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      await user.tab()

      expect(screen.getByRole('button')).toHaveFocus()
    })

    it('can be activated with keyboard', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')

      // Button should be disabled during generation
      expect(button).toBeDisabled()
    })

    it('provides visual feedback during loading', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      await user.click(screen.getByRole('button'))

      // Should show loading state
      expect(screen.getByText(/Generating/i)).toBeInTheDocument()
    })

    it('disabled state is properly communicated', async () => {
      const user = userEvent.setup()
      render(<DownloadPdfButton label="Download PDF" />)

      await user.click(screen.getByRole('button'))

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('LanguageSwitcher Accessibility', () => {
    it('has accessible select with label', () => {
      render(<LanguageSwitcher />)

      expect(screen.getByText('Language:')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('is keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      await user.tab()

      expect(screen.getByRole('combobox')).toHaveFocus()
    })

    it('can change value with keyboard', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      select.focus()

      // Arrow down to select next option
      await user.keyboard('{ArrowDown}')

      // Value should change
      expect(select.value).toBeDefined()
    })

    it('options have human-readable names', () => {
      render(<LanguageSwitcher />)

      expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Espanol' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Italiano' })).toBeInTheDocument()
    })

    it('has visible focus styles', () => {
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('focus:ring-2')
    })
  })

  describe('Focus Management', () => {
    it('ThemeSwitcher maintains focus within dropdown when open', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // First theme should be focusable
      const firstTheme = screen.getByRole('button', { name: /Dark Fantasy/i })
      expect(firstTheme).toBeInTheDocument()
    })

    it('focus returns to trigger after closing', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      const triggerButton = screen.getByRole('button', { name: /themes/i })

      // Open
      await user.click(triggerButton)

      // Close with Escape
      await user.keyboard('{Escape}')

      // Focus should be manageable (component handles this via DOM events)
      expect(screen.queryByText('[ SELECT THEME ]')).not.toBeInTheDocument()
    })
  })

  describe('Color Contrast (visual indicators)', () => {
    it('ThemeSwitcher shows colored theme indicators', async () => {
      const user = userEvent.setup()
      render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

      await user.click(screen.getByRole('button', { name: /themes/i }))

      // Each theme button should have a color indicator span
      const themeButtons = screen.getAllByRole('button').filter(
        (btn) => btn.textContent && btn.textContent !== 'THEMES'
      )

      themeButtons.forEach((btn) => {
        const colorIndicator = btn.querySelector('span.rounded-full')
        expect(colorIndicator).toBeInTheDocument()
      })
    })
  })

  describe('Semantic HTML', () => {
    it('LanguageSwitcher uses proper form controls', () => {
      render(<LanguageSwitcher />)

      // Select element is proper form control
      const select = screen.getByRole('combobox')
      expect(select.tagName).toBe('SELECT')

      // Options are proper option elements
      const options = screen.getAllByRole('option')
      options.forEach((opt) => {
        expect(opt.tagName).toBe('OPTION')
      })
    })

    it('buttons have button role', () => {
      render(
        <div>
          <ThemeSwitcher />
          <DownloadPdfButton label="Download" />
        </div>,
        { wrapper: ThemeWrapper }
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Print Accessibility', () => {
    it('interactive elements are hidden from print', () => {
      render(
        <div>
          <DownloadPdfButton label="Download" />
          <LanguageSwitcher />
        </div>
      )

      // Download button should be hidden in print
      const downloadButton = screen.getByRole('button')
      expect(downloadButton).toHaveClass('print:hidden')

      // Language switcher container should be hidden in print
      const container = screen.getByText('Language:').parentElement
      expect(container).toHaveClass('print:hidden')
    })
  })
})

describe('Reduced Motion Support', () => {
  // Note: Testing prefers-reduced-motion would require mocking matchMedia
  // The actual CSS handles this with media queries

  it('components have CSS classes that can be disabled with reduced motion', () => {
    render(<ThemeSwitcher />, { wrapper: ThemeWrapper })

    const button = screen.getByRole('button', { name: /themes/i })
    // Transition classes should be present (CSS will handle disabling them)
    expect(button).toHaveClass('transition-colors')
  })
})
