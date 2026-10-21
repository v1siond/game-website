import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithCV as render, testCV } from '../helpers/test-utils'
import { DownloadPdfButton } from '@/components/cv/DownloadPdfButton'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'

// save stays pending so the loading state the button announces can be observed.
jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    save: jest.fn(() => new Promise<void>(() => {})),
  })),
}))

const { cvPage } = testCV().labels

describe('Accessibility Tests', () => {
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

      expect(screen.getByText(cvPage.language)).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('is keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<LanguageSwitcher />)

      await user.tab()

      expect(screen.getByRole('combobox')).toHaveFocus()
    })

    it('options have human-readable names', () => {
      render(<LanguageSwitcher />)

      expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Español' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Italiano' })).toBeInTheDocument()
    })

    it('has visible focus styles', () => {
      render(<LanguageSwitcher />)

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('focus:ring-2')
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
          <DownloadPdfButton label="Download" />
        </div>
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
      const container = screen.getByText(cvPage.language).parentElement
      expect(container).toHaveClass('print:hidden')
    })
  })
})
